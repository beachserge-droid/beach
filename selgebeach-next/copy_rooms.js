const fs = require('fs');
const path = require('path');

const srcBase = 'c:/xampp/htdocs';
const dest = 'c:/xampp/htdocs/selgebeach-next/public/rooms';

const folders = [
  'Jakuzi Suite Oda - Selge Beach Resort Resmi Web Sayfasıdır',
  'Deluxe Aile Odası Deniz Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Deluxe Aile Odası Kara Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Deluxe Oda Deniz Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Deluxe Oda Kara Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Standart Aile Odası Deniz Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Standart Aile Odası Kara Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Standart Oda Deniz Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
  'Standart Oda Kara Manzara - Selge Beach Resort Resmi Web Sayfasıdır',
];

if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

let total = 0;
for (const folder of folders) {
  const srcDir = path.join(srcBase, folder);
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    const src = path.join(srcDir, file);
    const destFile = path.join(dest, file);
    fs.copyFileSync(src, destFile);
    console.log('Copied: ' + file);
    total++;
  }
}
console.log(`\nTotal: ${total} files copied to ${dest}`);
