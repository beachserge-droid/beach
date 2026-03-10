import fs from 'fs';
import https from 'https';
import * as cheerio from 'cheerio';

const urls = fs.readFileSync('sitemap_urls.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.selgebeachhotel.com',
      path: '/tr/' + url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const results = {};

async function scrapeAll() {
  console.log(`Starting to scrape ${urls.length} URLs...`);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i+1}/${urls.length}] Scraping /tr/${url}`);
    
    try {
      const html = await fetchUrl(url);
      const $ = cheerio.load(html);
      
      const title = $('h1').first().text().trim() || $('title').text().replace('- Selge Beach Resort', '').trim();
      
      // Target the main content area. Usually it's in a specific container or just paragraphs.
      // Often in themes there's an article, or .content class.
      let paragraphs = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        // Ignore extremely short / footer texts
        if (text.length > 20 && !text.includes('KVKK') && !text.includes('Çerez Politikası')) {
          paragraphs.push(text);
        }
      });
      // Deduplicate paragraphs to avoid repetitive menu texts etc.
      paragraphs = [...new Set(paragraphs)];
      
      const content = paragraphs.join('\n\n');
      
      const image = $('meta[property="og:image"]').attr('content') || null;

      results[url] = {
        title,
        content: content || 'İçerik Bulunamadı veya Yapım Aşamasında',
        image
      };
      
    } catch (err) {
      console.error(`Error scraping ${url}:`, err.message);
      results[url] = { error: err.message };
    }
    
    // Slight delay to be nice to the server
    await new Promise(r => setTimeout(r, 200));
  }
  
  fs.writeFileSync('src/data/scraped_content.json', JSON.stringify(results, null, 2));
  console.log('Scraping completed! Results saved to src/data/scraped_content.json');
}

scrapeAll();
