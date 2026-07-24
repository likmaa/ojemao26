const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function findPillBox() {
  const filePath = path.join(__dirname, '..', 'public', 'images', 'gabarit-co.png');
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  let minX = width, maxX = 0, minY = height, maxY = 0;

  // Search for the white pill box in Y range [1000, 1400]
  for (let y = 1000; y < 1400; y++) {
    for (let x = 250; x < 950; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (r > 245 && g > 245 && b > 245) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`=== PILULE CADRE NOM DANS GABARIT-CO.PNG ===`);
  console.log(`MinX: ${minX}, MaxX: ${maxX} (Largeur: ${maxX - minX})`);
  console.log(`MinY: ${minY}, MaxY: ${maxY} (Hauteur: ${maxY - minY})`);
  console.log(`Centre X: ${(minX + maxX) / 2}, Centre Y: ${(minY + maxY) / 2}`);
}

findPillBox().catch(console.error);
