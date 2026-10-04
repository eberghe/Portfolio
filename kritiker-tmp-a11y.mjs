import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
for (const u of ['/about','/faqs','/impressum','/datenschutz','/en/about','/en/faqs','/en/impressum','/en/datenschutz']) {
  await p.goto('http://localhost:3500'+u, {waitUntil:'load'}); await p.waitForTimeout(800);
  const meta = await p.evaluate(()=>({lang:document.documentElement.lang,title:document.title,
    desc:document.querySelector('meta[name=description]')?.content,
    canon:document.querySelector('link[rel=canonical]')?.href,
    robots:document.querySelector('meta[name=robots]')?.content,
    hreflang:[...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l=>l.hreflang+'='+l.href),
    ld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent.slice(0,600)),
    hscroll: document.documentElement.scrollWidth - innerWidth,
    imgs:[...document.images].map(i=>i.alt===''?'[leer] '+i.src.slice(-40):i.alt)}));
  console.log('\n=========', u, JSON.stringify(meta,null,1));
  console.log(await p.locator('body').ariaSnapshot());
}
await b.close();
