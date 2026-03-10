const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.selgebeachhotel.com/webpfy.aspx?foto=';
const outDir = path.join(__dirname, 'public', 'rooms');

const needed = [
  'selge-beach-hotel-standart-oda-18.webp',
  'selge-beach-hotel-standart-oda.webp',
  'selge-beach-hotel-standart-aile-odasi-19.webp',
  'selge-beach-hotel-standart-aile-odasi.webp',
  'selge-beach-hotel-deluxe-oda.webp',
  'selge-beach-hotel-deluxe-aile-odasi.webp',
  'selge-beach-hotel-deluxe-oda-deniz-manzara-20.webp',
  'selge-beach-hotel-deluxe-aile-odasi-deniz-manzara-22.webp',
  'selge-beach-hotel-deluxe-oda-25.webp',
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
        resolve(`SKIP_404 ${filename} (${res.statusCode})`);
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
  const results = await Promise.all(needed.map(downloadFile));
  results.forEach(r => console.log(r));
})();
