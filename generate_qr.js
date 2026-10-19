// Generates high-res print-ready QR codes (PNG + SVG) for the conference poster
const QRCode = require("qrcode");
const path = require("path");

const url = process.argv[2] || "https://smart-farm-assistant-hazel.vercel.app";

async function main() {
  console.log(`Generating poster QR codes for: ${url}`);

  try {
    // 1. High-resolution PNG (1200x1200px, 300dpi equivalent for conference poster prints)
    const pngPath = path.join(__dirname, "poster_qr_code.png");
    await QRCode.toFile(pngPath, url, {
      width: 1200,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1d2b1f",  // theme dark green/black
        light: "#ffffff"
      }
    });
    console.log(" Created: poster_qr_code.png (1200x1200px high-res PNG)");

    // 2. Vector SVG (infinite resolution for Canva / Photoshop / Illustrator)
    const svgPath = path.join(__dirname, "poster_qr_code.svg");
    await QRCode.toFile(svgPath, url, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#1d2b1f",
        light: "#ffffff"
      }
    });
    console.log(" Created: poster_qr_code.svg (Scalable Vector SVG)");

    console.log("\nDone! Both QR code files are ready in your project directory for your ADSAUF-2047 poster.");
  } catch (err) {
    console.error("Error generating QR code:", err);
    process.exit(1);
  }
}

main();
