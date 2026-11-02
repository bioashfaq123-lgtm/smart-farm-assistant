import zlib from "node:zlib";

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * Creates a deterministic, valid PNG binary buffer of given dimensions and RGB fill
 */
export function createPngBuffer(width = 200, height = 200, r = 40, g = 120, b = 50) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk("IHDR", ihdrData);

  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3);
    row[0] = 0; // Filter none
    for (let x = 0; x < width; x++) {
      row[1 + x * 3] = r;
      row[1 + x * 3 + 1] = g;
      row[1 + x * 3 + 2] = b;
    }
    rawRows.push(row);
  }

  const idatChunk = makeChunk("IDAT", zlib.deflateSync(Buffer.concat(rawRows)));
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

export function createPngDataUri(width = 200, height = 200, r = 40, g = 120, b = 50) {
  const buf = createPngBuffer(width, height, r, g, b);
  return "data:image/png;base64," + buf.toString("base64");
}

// 1. Valid Clear Leaf Image (200x200, balanced foliage green)
export const VALID_LEAF_IMAGE = createPngDataUri(200, 200, 45, 135, 55);

// 2. Very Dark Image (Severe Underexposure, luminance ~8)
export const VERY_DARK_IMAGE = createPngDataUri(200, 200, 5, 8, 6);

// 3. Overexposed Image (Harsh Glare / Flash wash-out, luminance ~252)
export const OVEREXPOSED_IMAGE = createPngDataUri(200, 200, 253, 254, 252);

// 4. Below-Resolution Image (64x64 px, below 120x120 minimum threshold)
export const LOW_RES_IMAGE = createPngDataUri(64, 64, 45, 120, 50);

// 5. Corrupted Base64 Image
export const CORRUPTED_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAASignedGarbageNotDecodable!!!";

// 6. Spoofed File (Text payload with image/png MIME declaration)
export const SPOOFED_IMAGE = "data:image/png;base64," + Buffer.from("<html><script>alert(1)</script></html>").toString("base64");

// 7. Unsupported File Type (GIF89a signature)
export const UNSUPPORTED_TYPE_IMAGE = "data:image/gif;base64," + Buffer.from("GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!").toString("base64");

