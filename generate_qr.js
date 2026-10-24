// Generates high-res print-ready QR codes (PNG + SVG) for the conference poster
const QRCode = require("qrcode");
const path = require("path");

const PRIMARY_URL = "https://smartfarm-pjtau.vercel.app";
const SECONDARY_URL = "https://smartfarming-web.vercel.app";

async function generatePair(url, baseName, label) {
  console.log(`\nGenerating QR codes for ${label}: ${url}`);

  // 1. High-resolution PNG (1200x1200px, 300dpi equivalent for conference poster prints)
  const pngPath = path.join(__dirname, `${baseName}.png`);
  await QRCode.toFile(pngPath, url, {
    width: 1200,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#1d2b1f",  // theme dark green/black
      light: "#ffffff"
    }
  });
  console.log(` Created: ${baseName}.png (1200x1200px high-res PNG)`);

  // 2. Vector SVG (infinite resolution for Canva / Photoshop / Illustrator)
  const svgPath = path.join(__dirname, `${baseName}.svg`);
  await QRCode.toFile(svgPath, url, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#1d2b1f",
      light: "#ffffff"
    }
  });
  console.log(` Created: ${baseName}.svg (Scalable Vector SVG)`);
}

async function main() {
  const customUrl = process.argv[2];

  try {
    if (customUrl) {
      await generatePair(customUrl, "poster_qr_code", "Custom URL");
    } else {
      // 1. Primary domain (PJTAU conference poster standard)
      await generatePair(PRIMARY_URL, "poster_qr_code", "Primary Domain (PJTAU)");
      await generatePair(PRIMARY_URL, "poster_qr_pjtau", "PJTAU Direct Link");

      // 2. Secondary domain (Web portal)
      await generatePair(SECONDARY_URL, "poster_qr_smartfarming_web", "Alternative Web Domain");
    }

    console.log("\nDone! Poster QR codes for both domains are ready in your project directory.");
  } catch (err) {
    console.error("Error generating QR code:", err);
    process.exit(1);
  }
}

main();
