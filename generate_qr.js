// Generates high-res print-ready QR codes (PNG + SVG) for the conference poster
const { execSync } = require("child_process");
const fs = require("fs");

const url = process.argv[2] || "https://smart-farm-assistant.vercel.app";

console.log(`Generating poster QR codes for: ${url}`);

try {
  // 1. High-resolution PNG (1200x1200px, 300dpi equivalent for posters)
  execSync(`npx -y qrcode -w 1200 -q 2 -e H -o poster_qr_code.png "${url}"`, { stdio: "inherit" });
  console.log(" Created: poster_qr_code.png (1200x1200px high-res PNG)");

  // 2. Crisp vector SVG (infinite resolution for Canva/Photoshop/Illustrator)
  execSync(`npx -y qrcode -t svg -q 2 -e H -o poster_qr_code.svg "${url}"`, { stdio: "inherit" });
  console.log(" Created: poster_qr_code.svg (Vector SVG)");

  console.log("\nDone! Both QR code files are ready in your project directory for your ADSAUF-2047 poster.");
} catch (e) {
  console.error("Error generating QR code:", e.message);
  process.exit(1);
}
