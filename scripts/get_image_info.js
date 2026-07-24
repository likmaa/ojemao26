const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'images', 'gabarit-co.png');
const buf = fs.readFileSync(filePath);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(24); // Or readUInt32BE(20)

console.log('gabarit-co.png width x height:', buf.readUInt32BE(16), 'x', buf.readUInt32BE(20));
