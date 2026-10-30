/**
 * Sitedeki her görsel alanının güncel durumu.
 * Geçici görseller yol üzerinden tanınır: /gorseller/gecici/ altındakiler
 * değiştirilmeyi bekler. CMS'ten gerçek görsel yüklenince yol değişir ve
 * kayıt kendiliğinden "gerçek" sayılır — ayrı bir işaret tutmaya gerek yok.
 *
 * Kullanım: npm run gorsel-durum
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const GECICI = '/gorseller/gecici/';

const koleksiyonlar = [
  { dizin: 'src/content/programlar',      etiket: 'Programlar',        cms: 'Programlar' },
  { dizin: 'src/content/uretimler',       etiket: 'Ürettiklerimiz',    cms: 'Ürettiklerimiz' },
  { dizin: 'src/content/kostum',          etiket: 'Kafka Kostüm',      cms: 'Kafka Kostüm kataloğu' },
  { dizin: 'src/content/international',   etiket: 'International',     cms: 'Kafka International programları' },
  { dizin: 'src/content/sosyal-projeler', etiket: 'Sosyal sorumluluk', cms: 'Sosyal sorumluluk projeleri' },
  { dizin: 'src/content/subeler',         etiket: 'Şubeler',           cms: 'Şubeler' },
];

const sayac = { gercek: 0, gecici: 0, bos: 0 };
const satirlar = [];

for (const k of koleksiyonlar) {
  if (!existsSync(k.dizin)) continue;
  for (const dosya of readdirSync(k.dizin).filter((f) => f.endsWith('.json')).sort()) {
    const d = JSON.parse(readFileSync(join(k.dizin, dosya), 'utf8'));
    const ad = d.ad ?? d.baslik ?? dosya.replace('.json', '');
    const g = d.gorsel;
    const durum = !g ? 'bos' : g.includes(GECICI) ? 'gecici' : 'gercek';
    sayac[durum]++;
    const ek = [];
    if (Array.isArray(d.galeri) && d.galeri.length) ek.push(`galeri ${d.galeri.length}`);
    if (Array.isArray(d.mekanGorselleri) && d.mekanGorselleri.length) ek.push(`mekan ${d.mekanGorselleri.length}`);
    if (Array.isArray(d.surecGorselleri) && d.surecGorselleri.length) ek.push(`süreç ${d.surecGorselleri.length}`);
    satirlar.push({ grup: k.etiket, cms: k.cms, ad, durum, g, ek: ek.join(' · ') });
  }
}

const isaret = { gercek: '🟢', gecici: '🟠', bos: '🔴' };
const aciklama = { gercek: 'gerçek görsel', gecici: 'GEÇİCİ — değiştirilecek', bos: 'BOŞ — yer tutucu' };

let aktifGrup = '';
console.log('\nSİTEDEKİ GÖRSEL DURUMU\n' + '='.repeat(74));
for (const s of satirlar) {
  if (s.grup !== aktifGrup) {
    aktifGrup = s.grup;
    console.log(`\n${s.grup}   ·   CMS'te: "${s.cms}"`);
    console.log('-'.repeat(74));
  }
  console.log(`  ${isaret[s.durum]} ${s.ad.padEnd(32)} ${aciklama[s.durum].padEnd(24)} ${s.ek}`);
}

console.log('\n' + '='.repeat(74));
console.log(`🟢 gerçek: ${sayac.gercek}    🟠 geçici: ${sayac.gecici}    🔴 boş: ${sayac.bos}`);

if (sayac.gecici || sayac.bos) {
  console.log('\nDeğiştirmek için: /admin → yukarıdaki CMS koleksiyonu → kayıt → görsel alanı.');
  console.log('Yerelde: npm run dev → localhost:4321/admin/index.html → "Work with Local Repository"');
}
