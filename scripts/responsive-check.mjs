/**
 * Tüm sayfaları üç genişlikte açar; yatay taşma, küçük dokunma hedefi ve
 * eksik alt metni arar. Kullanım: node scripts/responsive-check.mjs [taban-url]
 */
import puppeteer from 'puppeteer-core';
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const TABAN = process.argv[2] ?? 'http://localhost:4321';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const GENISLIKLER = [390, 768, 1440];

function yollar(kok = 'dist', dizin = 'dist') {
  const cikti = [];
  for (const ad of readdirSync(dizin)) {
    const tam = join(dizin, ad);
    if (statSync(tam).isDirectory()) cikti.push(...yollar(kok, tam));
    else if (ad === 'index.html') {
      const r = relative(kok, dizin).replaceAll('\\', '/');
      cikti.push(r === '' ? '/' : `/${r}`);
    }
  }
  return cikti.sort();
}

const sayfalar = yollar();
const tarayici = await puppeteer.launch({ executablePath: CHROME, headless: true });
const sayfa = await tarayici.newPage();

const sorunlar = [];
mkdirSync('/tmp/kafka-ss', { recursive: true });

for (const genislik of GENISLIKLER) {
  await sayfa.setViewport({ width: genislik, height: 900, deviceScaleFactor: 1 });
  for (const yol of sayfalar) {
    await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle0' });
    const rapor = await sayfa.evaluate(() => {
      const d = document.documentElement;
      const tasma = d.scrollWidth > d.clientWidth + 1;
      const tasanlar = [];
      if (tasma) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > d.clientWidth + 1 && r.width > 0) {
            tasanlar.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)}`);
            if (tasanlar.length > 3) break;
          }
        }
      }
      const kucukHedefler = [];
      for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const gizli = el.closest('[hidden]') || getComputedStyle(el).visibility === 'hidden';
        if (gizli) continue;
        const sinif = (el.className || '').toString();
        // Atlama bağlantısı odaklanınca büyür; kart bağlantıları ::after ile
        // tüm kartı tıklanabilir yapar — ikisi de yanlış pozitif üretir.
        if (sinif.includes('sr-only') || sinif.includes('after:inset-0')) continue;
        if (r.height < 24 || r.width < 24) {
          kucukHedefler.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 25)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
      }
      const altsiz = [...document.querySelectorAll('img')].filter((i) => i.alt === null).length;
      return { tasma, tasanlar, kucukHedefler, altsiz };
    });
    if (rapor.tasma) sorunlar.push(`[${genislik}px] ${yol} — YATAY TAŞMA: ${rapor.tasanlar.join(', ')}`);
    if (rapor.kucukHedefler.length) sorunlar.push(`[${genislik}px] ${yol} — küçük hedef: ${rapor.kucukHedefler.join(' | ')}`);
    if (rapor.altsiz) sorunlar.push(`[${genislik}px] ${yol} — ${rapor.altsiz} görselde alt yok`);
  }
}

await tarayici.close();

console.log(`${sayfalar.length} sayfa × ${GENISLIKLER.length} genişlik = ${sayfalar.length * GENISLIKLER.length} kontrol`);
if (sorunlar.length === 0) console.log('Sorun bulunamadı.');
else { console.log(`\n${sorunlar.length} sorun:`); sorunlar.forEach((s) => console.log('  ' + s)); }
process.exit(sorunlar.length ? 1 : 0);
