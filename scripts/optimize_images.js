const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targets = [
  { dir: 'public/partenaires', maxDim: 800, quality: 82 },
  { dir: 'public/images/organisateurs', maxDim: 600, quality: 85 },
];

const MIN_SIZE_TO_TOUCH = 150 * 1024; // skip files already under 150KB

(async () => {
  let totalBefore = 0, totalAfter = 0;
  for (const { dir, maxDim, quality } of targets) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;
      const before = stat.size;
      if (before < MIN_SIZE_TO_TOUCH) {
        console.log(`skip (small) ${filePath} — ${(before/1024).toFixed(0)}KB`);
        continue;
      }
      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.webp', '.jpg', '.jpeg'].includes(ext)) continue;

      const buffer = fs.readFileSync(filePath);
      const img = sharp(buffer, { limitInputPixels: false });
      const meta = await img.metadata();

      let pipeline = img.resize({
        width: maxDim,
        height: maxDim,
        fit: 'inside',
        withoutEnlargement: true,
      });

      if (ext === '.webp') pipeline = pipeline.webp({ quality });
      else if (ext === '.png') pipeline = pipeline.png({ quality, compressionLevel: 9 });
      else pipeline = pipeline.jpeg({ quality });

      const outBuffer = await pipeline.toBuffer();
      fs.writeFileSync(filePath, outBuffer);
      const after = outBuffer.length;
      totalBefore += before;
      totalAfter += after;
      console.log(`${filePath}: ${meta.width}x${meta.height} ${(before/1024/1024).toFixed(2)}MB -> ${(after/1024).toFixed(0)}KB`);
    }
  }
  console.log(`\nTOTAL: ${(totalBefore/1024/1024).toFixed(2)}MB -> ${(totalAfter/1024/1024).toFixed(2)}MB`);
})();
