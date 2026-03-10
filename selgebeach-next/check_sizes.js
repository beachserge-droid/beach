const https = require('https');

// Check file sizes to differentiate room photos (large) from concert banners (small graphic)
const checkSize = (url) => {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => resolve({ url, size, status: res.statusCode }));
    });
    req.on('error', () => resolve({ url, size: 0, status: 0 }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ url, size: 0, status: 0 }); });
  });
};

const baseUrl = 'https://www.selgebeachhotel.com/webpfy.aspx?foto=';
const urls = Array.from({ length: 29 }, (_, i) => `${baseUrl}selge-beach-hotel-${i + 1}.webp`);
// add room-named ones
urls.push(
  `${baseUrl}selge-beach-hotel-jakuzi-suite-oda-23.webp`,
  `${baseUrl}selge-beach-hotel-standart-oda-15.webp`,
  `${baseUrl}selge-beach-hotel-deluxe-oda-19.webp`,
  `${baseUrl}selge-beach-hotel-deluxe-aile-odasi-21.webp`
);

(async () => {
  const results = await Promise.all(urls.map(checkSize));
  results.filter(r => r.status === 200).sort((a, b) => b.size - a.size).forEach(r => {
    const fname = r.url.split('foto=')[1];
    console.log(`${fname}: ${(r.size / 1024).toFixed(1)} KB`);
  });
})();
