/**
 * Crop Disease Diagnosis Evaluation Tool
 * Evaluates a folder of labeled test photos using the production diagnosis pipeline.
 *
 * HOW TO COLLECT AND LABEL TEST PHOTOS:
 * 1. Directory Structure:
 *    Organize test photos into folders following this exact convention:
 *    test-images/
 *      ├── Paddy/
 *      │   ├── paddy_blast/
 *      │   │   ├── photo_001.jpg
 *      │   │   └── photo_002.jpg
 *      │   ├── paddy_bacterial_leaf_blight/
 *      │   │   └── photo_003.jpg
 *      │   └── paddy_zinc_deficiency/
 *      │       └── photo_004.jpg
 *      ├── Cotton/
 *      │   ├── cotton_pink_bollworm/
 *      │   └── cotton_bacterial_blight/
 *      └── Chilli/
 *          ├── chilli_murda_leaf_curl/
 *          └── chilli_anthracnose_fruit_rot/
 *
 * 2. Golden Rule for Ground Truth:
 *    Every photo in a folder MUST have its diagnosis confirmed by:
 *    - A verified laboratory report / PCR / culture, OR
 *    - An experienced Mandal Agricultural Extension Officer (AEO) / PJTAU agricultural scientist.
 *    Do not label test photos based on AI outputs.
 *
 * 3. Photo Guidelines:
 *    - Take photos in good daylight (avoid harsh direct flash or heavy shadows).
 *    - Include a close-up of the characteristic lesion / pest.
 *    - Label ambiguous photos as "unclear" or place in a separate verification folder.
 */

const fs = require("fs");
const path = require("path");
const { diagnoseCropPhoto, getSupportedCrops } = require("../lib/diagnosis");
const { findDisorder } = require("../lib/diagnosis/knowledgeBase");

// Parse CLI arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const TEST_DIR = path.resolve(process.cwd(), getArg("--dir", "test-images"));
const OUTPUT_CSV = path.resolve(process.cwd(), getArg("--csv", `eval_report_${Date.now()}.csv`));
const DO_CONSISTENCY = args.includes("--consistency");
const LIMIT = parseInt(getArg("--limit", "100"), 10);

function findTestImages(dir) {
  const images = [];
  if (!fs.existsSync(dir)) return images;

  const cropFolders = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const cropDir of cropFolders) {
    const cropName = cropDir.name;
    const cropPath = path.join(dir, cropName);
    const diseaseFolders = fs.readdirSync(cropPath, { withFileTypes: true }).filter(d => d.isDirectory());

    for (const disDir of diseaseFolders) {
      const diseaseId = disDir.name;
      const disPath = path.join(cropPath, diseaseId);
      const files = fs.readdirSync(disPath);

      for (const file of files) {
        if (/\.(jpe?g|png|webp)$/i.test(file)) {
          images.push({
            crop: cropName,
            expectedDiseaseId: diseaseId,
            filePath: path.join(disPath, file),
            fileName: file
          });
        }
      }
    }
  }
  return images;
}

function matchesDisease(expectedId, candidate) {
  if (!candidate) return false;
  const exp = expectedId.toLowerCase().trim();
  const candId = (candidate.id || "").toLowerCase().trim();
  const candCommon = (candidate.commonName || "").toLowerCase().trim();
  const candSci = (candidate.scientificName || "").toLowerCase().trim();

  if (candId === exp) return true;
  if (candCommon.includes(exp) || exp.includes(candCommon)) return true;
  if (candSci.includes(exp) || exp.includes(candSci)) return true;

  // Check aliases from KB
  const disorder = findDisorder(null, expectedId);
  if (disorder) {
    if (disorder.id.toLowerCase() === candId) return true;
    if (candidate.commonName && disorder.commonName.toLowerCase() === candidate.commonName.toLowerCase()) return true;
  }
  return false;
}

async function runEvaluation() {
  console.log("==============================================================");
  console.log("🌱 SMART FARM ASSISTANT - CROP DISEASE DIAGNOSIS EVALUATION");
  console.log("==============================================================");
  console.log(`Directory:   ${TEST_DIR}`);
  console.log(`Output CSV:  ${OUTPUT_CSV}`);
  console.log(`Consistency: ${DO_CONSISTENCY ? "Enabled (3 runs per image)" : "Disabled (use --consistency to enable)"}`);
  console.log(`Max images:  ${LIMIT}\n`);

  const images = findTestImages(TEST_DIR);

  if (images.length === 0) {
    console.log(`⚠️ No test images found in "${TEST_DIR}".`);
    console.log("Please create test-images/{Crop}/{disease_id}/photo.jpg to run batch evaluation.");
    console.log("\nExample structure:");
    console.log("  test-images/Paddy/paddy_blast/photo1.jpg");
    console.log("  test-images/Cotton/cotton_pink_bollworm/photo2.jpg");
    console.log("  test-images/Chilli/chilli_murda_leaf_curl/photo3.jpg\n");
    return;
  }

  const selectedImages = images.slice(0, LIMIT);
  console.log(`Found ${images.length} labeled photos. Evaluating ${selectedImages.length}...\n`);

  let top1Correct = 0;
  let top3Correct = 0;
  let notSureCount = 0;
  let consistencyCheckedCount = 0;
  let consistencyMatches = 0;

  const perDiseaseStats = {};
  const confusionMap = {};
  const csvRows = [
    ["Crop", "GroundTruthDisease", "FileName", "Top1Predicted", "Top1Confidence", "Top1Correct", "Top3Correct", "IsNotSure", "ConsistencyMatch"]
  ];

  for (let idx = 0; idx < selectedImages.length; idx++) {
    const item = selectedImages[idx];
    process.stdout.write(`[${idx + 1}/${selectedImages.length}] Evaluating ${item.crop}/${item.expectedDiseaseId}/${item.fileName}... `);

    const imgBuffer = fs.readFileSync(item.filePath);
    const base64 = imgBuffer.toString("base64");

    if (!perDiseaseStats[item.expectedDiseaseId]) {
      perDiseaseStats[item.expectedDiseaseId] = {
        crop: item.crop,
        total: 0,
        top1: 0,
        top3: 0,
        notSure: 0
      };
    }
    perDiseaseStats[item.expectedDiseaseId].total++;

    try {
      // Primary evaluation run
      const res = await diagnoseCropPhoto({
        crop: item.crop,
        lang: "en",
        images: [base64],
        context: { stage: "vegetative", part: "leaf", spread: "scattered", weather: "normal", sprays: "none" },
        ip: "127.0.0.1",
        userId: "eval_script"
      });

      const diag = res.result;
      const isNotSure = (!diag.isUnderstood || !diag.candidates || diag.candidates.length === 0);

      let isTop1 = false;
      let isTop3 = false;
      let top1Name = "None (Not Sure)";
      let top1Conf = "low";

      if (isNotSure) {
        notSureCount++;
        perDiseaseStats[item.expectedDiseaseId].notSure++;
      } else {
        const top = diag.candidates[0];
        top1Name = top.id || top.commonName;
        top1Conf = top.confidence || "medium";

        if (matchesDisease(item.expectedDiseaseId, top)) {
          top1Correct++;
          perDiseaseStats[item.expectedDiseaseId].top1++;
          isTop1 = true;
        } else {
          // Record confusion pair
          const pairKey = `${item.expectedDiseaseId} -> ${top1Name}`;
          confusionMap[pairKey] = (confusionMap[pairKey] || 0) + 1;
        }

        const inTop3 = diag.candidates.some(c => matchesDisease(item.expectedDiseaseId, c));
        if (inTop3) {
          top3Correct++;
          perDiseaseStats[item.expectedDiseaseId].top3++;
          isTop3 = true;
        }
      }

      // Optional Consistency Check (3 sequential runs on identical image)
      let consistencyMatch = "N/A";
      if (DO_CONSISTENCY) {
        consistencyCheckedCount++;
        const run2 = await diagnoseCropPhoto({ crop: item.crop, images: [base64], ip: "127.0.0.1", userId: "eval_script" });
        const run3 = await diagnoseCropPhoto({ crop: item.crop, images: [base64], ip: "127.0.0.1", userId: "eval_script" });

        const p1 = diag.candidates?.[0]?.id || diag.candidates?.[0]?.commonName || "none";
        const p2 = run2.result?.candidates?.[0]?.id || run2.result?.candidates?.[0]?.commonName || "none";
        const p3 = run3.result?.candidates?.[0]?.id || run3.result?.candidates?.[0]?.commonName || "none";

        const isConsistent = (p1 === p2 && p2 === p3);
        if (isConsistent) consistencyMatches++;
        consistencyMatch = isConsistent ? "YES" : `NO (${p1} vs ${p2} vs ${p3})`;
      }

      csvRows.push([
        item.crop,
        item.expectedDiseaseId,
        item.fileName,
        top1Name,
        top1Conf,
        isTop1 ? "1" : "0",
        isTop3 ? "1" : "0",
        isNotSure ? "1" : "0",
        consistencyMatch
      ]);

      console.log(isTop1 ? "✓ Top-1 Match" : isTop3 ? "~ Top-3 Match" : isNotSure ? "? Not Sure" : `✗ Misdiagnosed (${top1Name})`);

    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      csvRows.push([item.crop, item.expectedDiseaseId, item.fileName, "ERROR", "N/A", "0", "0", "1", "ERROR"]);
    }
  }

  // Summary Metrics
  const total = selectedImages.length;
  const top1Acc = ((top1Correct / total) * 100).toFixed(1);
  const top3Acc = ((top3Correct / total) * 100).toFixed(1);
  const notSureRate = ((notSureCount / total) * 100).toFixed(1);
  const consistencyRate = consistencyCheckedCount > 0
    ? ((consistencyMatches / consistencyCheckedCount) * 100).toFixed(1) + "%"
    : "N/A";

  console.log("\n==============================================================");
  console.log("📊 DIAGNOSIS ACCURACY REPORT (MEASURED)");
  console.log("==============================================================");
  console.log(`Total Photos Evaluated: ${total}`);
  console.log(`Top-1 Accuracy:         ${top1Acc}% (${top1Correct}/${total})`);
  console.log(`Top-3 Accuracy:         ${top3Acc}% (${top3Correct}/${total})`);
  console.log(`"Not Sure" Rate:        ${notSureRate}% (${notSureCount}/${total})`);
  console.log(`3x Consistency Rate:    ${consistencyRate}`);
  console.log("--------------------------------------------------------------");

  console.log("\nPER-DISEASE ACCURACY:");
  console.log("Disease ID".padEnd(32) + "Crop".padEnd(12) + "Top-1 Acc".padEnd(14) + "Top-3 Acc".padEnd(14) + "Not Sure");
  console.log("-".repeat(80));
  for (const [disId, stat] of Object.entries(perDiseaseStats)) {
    const t1 = ((stat.top1 / stat.total) * 100).toFixed(0) + "%";
    const t3 = ((stat.top3 / stat.total) * 100).toFixed(0) + "%";
    const ns = stat.notSure;
    console.log(
      disId.padEnd(32) +
      stat.crop.padEnd(12) +
      `${stat.top1}/${stat.total} (${t1})`.padEnd(14) +
      `${stat.top3}/${stat.total} (${t3})`.padEnd(14) +
      `${ns}`
    );
  }

  const confusedPairs = Object.entries(confusionMap).sort((a, b) => b[1] - a[1]);
  if (confusedPairs.length > 0) {
    console.log("\nMOST CONFUSED PAIRS (Ground Truth -> Predicted):");
    confusedPairs.slice(0, 5).forEach(([pair, count]) => {
      console.log(`  • ${pair}: ${count} time(s)`);
    });
  }

  // Write CSV
  const csvContent = csvRows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  fs.writeFileSync(OUTPUT_CSV, csvContent, "utf8");
  console.log(`\nDetailed CSV report saved to: ${OUTPUT_CSV}`);
  console.log("==============================================================\n");
}

runEvaluation().catch(err => {
  console.error("Evaluation script encountered unhandled error:", err);
  process.exit(1);
});
