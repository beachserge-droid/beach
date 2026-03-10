const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 0 }));
  });
};

const urls = [];
for(let i=1; i<=100; i++) {
  urls.push(`https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-oda-${i}.webp`);
  urls.push(`https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-${i}.webp`);
}

Promise.all(urls.map(checkUrl)).then(results => {
  const valid = results.filter(r => r.status === 200).map(r => r.url);
  console.log('Found valid images:', valid.length);
  valid.forEach(v => console.log(v));
});
