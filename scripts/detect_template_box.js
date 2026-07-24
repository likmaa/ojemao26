const fs = require('fs');
const path = require('path');

// Read PNG and find white region for circle and pill box
const filePath = path.join(__dirname, '..', 'public', 'images', 'gabarit-co.png');

console.log('Fichier gabarit-co.png chargé.');
