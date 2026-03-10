const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.selgebeachhotel.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('selge.html', data, 'utf8');
    
    // Quick Extract
    let links = new Set();
    const bgRegex = /url\(['"]?([^'"]*\.(?:jpg|png|webp|jpeg))['"]?\)/ig;
    const imgRegex = /src=["']([^"']*\.(?:jpg|png|webp|jpeg))["']/ig;
    let match;
    while(match = bgRegex.exec(data)) links.add(match[1]);
    while(match = imgRegex.exec(data)) links.add(match[1]);
    
    console.log("--- IMAGES FOUND ---");
    Array.from(links).forEach(l => console.log(l));
  });
}).on('error', (e) => {
  console.error(e);
});
