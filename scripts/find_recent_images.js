const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFiles(fullPath);
    } else if (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')) {
      console.log(`${fullPath} — Modified: ${stat.mtime.toLocaleString('fr-FR')} — Size: ${stat.size} bytes`);
    }
  }
}

console.log('=== RECHERCHE DE TOUTES LES IMAGES DU PROJET ===');
searchFiles(path.join(__dirname, '..'));
