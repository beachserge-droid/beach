const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.selgebeachhotel.com/webpfy.aspx?foto=';
const outDir = path.join(__dirname, 'public', 'rooms');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// The confirmed valid images from our previous probe
const images = [
  // Room-named
  'selge-beach-hotel-jakuzi-suite-oda-23.webp',
  'selge-beach-hotel-standart-oda-15.webp',
  'selge-beach-hotel-deluxe-oda-19.webp',
  'selge-beach-hotel-deluxe-aile-odasi-21.webp',
  // Generic numbered - also confirmed valid (1-29)
  ...Array.from({ length: 29 }, (_, i) => `selge-beach-hotel-${i + 1}.webp`),
];

const downloadFile = (filename) => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${filename}`;
    const dest = path.join(outDir, filename);
    if (fs.existsSync(dest)) {
      resolve(`SKIP ${filename}`);
      return;
    }
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        resolve(`SKIP_404 ${filename}`);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(`OK ${filename}`); });
    });
    req.on('error', (e) => resolve(`ERR ${filename}: ${e.message}`));
    req.setTimeout(10000, () => { req.destroy(); resolve(`TIMEOUT ${filename}`); });
  });
};

(async () => {
  console.log(`Downloading ${images.length} images to ${outDir}`);
  const results = await Promise.all(images.map(downloadFile));
  results.forEach(r => console.log(r));
  console.log('Done!');
})();
