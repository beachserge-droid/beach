const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // consume response to avoid socket hang
      res.resume();
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => resolve({ url, status: 0 }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ url, status: 0 }); });
  });
};

const baseUrl = 'https://www.selgebeachhotel.com/webpfy.aspx?foto=';

const rooms = [
  'jakuzi-suite-oda',
  'standart-oda',
  'deluxe-oda',
  'deluxe-aile-odasi',
  'standart-aile-odasi',
];

const suffixes = [
  '', '-banyo', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10',
  '-11', '-12', '-13', '-14', '-15', '-16', '-17', '-18', '-19', '-20',
  '-21', '-22', '-23', '-24', '-25', '-26', '-27', '-28', '-29', '-30',
];

const urls = [];
rooms.forEach(room => {
  suffixes.forEach(s => {
    urls.push(`${baseUrl}selge-beach-hotel-${room}${s}.webp`);
  });
});

// Also try some alternative bathroom/room patterns
['banyo', 'jakuzi', 'oda-ic', 'oda-detay', 'suite-oda', 'suite-banyo', 'interior'].forEach(slug => {
  for (let i = 1; i <= 20; i++) {
    urls.push(`${baseUrl}selge-beach-hotel-${slug}-${i}.webp`);
  }
});

console.log(`Testing ${urls.length} URLs...`);

const BATCH_SIZE = 30;
const batches = [];
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  batches.push(urls.slice(i, i + BATCH_SIZE));
}

(async () => {
  const results = [];
  for (const batch of batches) {
    const r = await Promise.all(batch.map(checkUrl));
    results.push(...r);
  }
  const valid = results.filter(r => r.status === 200).map(r => r.url);
  console.log('\n=== VALID IMAGES ===');
  valid.forEach(v => console.log(v));
  console.log(`\nTotal valid: ${valid.length}`);
})();
