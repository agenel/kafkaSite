/**
 * §36 Yayın Öncesi Kontrol Listesi — otomatik doğrulanabilen maddeler.
 * dist/ üzerinden çalışır. Önce `npm run build`.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';

// --onizleme: önizleme dağıtımında örnek kayıtlar kabul edilir (uyarı olarak
// raporlanır, dağıtımı düşürmez). Gerçek yayın kontrolünde bayrak kullanılmaz.
const ONIZLEME = process.argv.includes('--onizleme');

const oku = (y) => (existsSync(y) ? readFileSync(y, 'utf8') : '');
const sonuclar = [];
const kontrol = (ad, kosul, detay = '') =>
  sonuclar.push({ ad, gecti: !!kosul, detay });

const ana = oku('dist/index.html');
const kartAdlari = (h) =>
  [...h.matchAll(/<h3[^>]*>\s*<a href="\/programlar\/[^"]+"[^>]*>\s*([^<]+?)\s*</g)].map((m) => m[1]);

kontrol('Hero metni "Düşün. İfade et. Üret."',
  /DÜŞÜN|Düşün\./.test(ana) && /İfade et|İFADE ET/.test(ana) && /Üret\.|ÜRET\./.test(ana));

kontrol('Ana CTA "Başvuru Yap"', (ana.match(/Başvuru Yap/g) || []).length >= 2);

// Kartlar CSS ile büyük harfe çevrilir; HTML'de başlık biçiminde durur.
kontrol('Program çatısı Okul Öncesi / Çocuklar / Gençler / Yetişkinler',
  ['Okul Öncesi', 'Çocuklar', 'Gençler', 'Yetişkinler'].every((c) => ana.includes(c)));

kontrol('GÇT ve GGT Lab iki şubede de aynı kısaltmayla',
  oku('dist/gaziantep/index.html').includes('GÇT') &&
  oku('dist/izmir/index.html').includes('GÇT') &&
  oku('dist/gaziantep/index.html').includes('GGT Lab') &&
  oku('dist/izmir/index.html').includes('GGT Lab'));

kontrol('Sanata İlk Adım, Okul Öncesi sayfasının tek sabit ana programı',
  kartAdlari(oku('dist/programlar/okul-oncesi/index.html'))[0] === 'Sanata İlk Adım');

for (const [sayfa, ilk] of [
  ['cocuklar', 'GÇT'], ['gencler', 'GGT Lab'], ['yetiskinler', 'Kafka Akademi Tiyatrosu'],
]) {
  const l = kartAdlari(oku(`dist/programlar/${sayfa}/index.html`));
  kontrol(`${sayfa} sayfasında "${ilk}" ilk sırada`, l[0] === ilk, `bulunan: ${l[0] ?? '—'}`);
}

const ggt = oku('dist/programlar/ggt-lab/index.html');
kontrol('Sahne Modu GGT Lab sayfasında, ayrı kart değil',
  ggt.includes('SAHNE MODU') || ggt.includes('Sahne Modu'));
kontrol('Sahne Modu ayrı program sayfası DEĞİL',
  !existsSync('dist/programlar/sahne-modu/index.html'));

kontrol('Kafka International ana sayfada adıyla görünür', ana.includes('Kafka International'));
kontrol('Kafka Kostüm ana sayfada adıyla görünür', ana.includes('Kafka Kostüm'));

const intl = oku('dist/kafka-international/index.html');
kontrol('Kafka International hedef kitlesi çocuklar, gençler ve yetişkinler',
  /çocukları?, gençleri? ve yetişkinler/i.test(intl));

const kostum = oku('dist/kafka-kostum/index.html');
kontrol('Kafka Kostüm koleksiyon + kiralama + toplu + özel siparişi birlikte anlatır',
  ['koleksiyon', 'kiralama', 'toplu', 'özel sipariş'].every((k) => kostum.toLowerCase().includes(k)));

kontrol('International ve Kostüm iletişimi Özlem Demireli / +90 536 433 43 08',
  intl.includes('Özlem Demireli') && intl.includes('536 433 43 08') &&
  kostum.includes('Özlem Demireli') && kostum.includes('536 433 43 08'));

const iletisim = oku('dist/iletisim/index.html');
kontrol('Genel e-posta kafkaakademi@gmail.com', iletisim.includes('kafkaakademi@gmail.com'));
kontrol('Gaziantep telefon ve adresi doğru',
  iletisim.includes('+90 505 614 47 67') &&
  iletisim.includes('Adnan İnanıcı') && iletisim.includes('153060. Sokak'));
kontrol('İzmir telefon ve adresi doğru',
  iletisim.includes('+90 537 240 17 73') &&
  iletisim.includes('Mithatpaşa') && iletisim.includes('35310 Güzelbahçe'));
kontrol('Her iki şubenin harita bağlantısı var',
  (iletisim.match(/maps\/search/g) || []).length >= 2 &&
  oku('dist/gaziantep/index.html').includes('maps/search') &&
  oku('dist/izmir/index.html').includes('maps/search'));
// Harita adresleri takip parametresi taşımamalı
kontrol('Harita bağlantılarında takip parametresi yok',
  !iletisim.includes('utm_source'));

const hikaye = oku('dist/kafka/hikayemiz/index.html');
kontrol('Kurucu unvanları doğru',
  hikaye.includes('Kurucu Ortak · Eğitim Direktörü') &&
  hikaye.includes('Kurucu Ortak · Genel Sanat Yönetmeni'));

const gct = oku('dist/programlar/gct/index.html');
kontrol('Her dönem 1 Gelişim Özeti ve 1 veli görüşmesi bilgisi var',
  /1 Gelişim Özeti/.test(gct) && /1 bireysel veli görüşmesi/.test(gct));

kontrol('GGT Lab çıktısı "Üretim Portfolyosu" olarak yazılmış',
  ggt.includes('Üretim Portfolyosu'));

const kat = oku('dist/programlar/kafka-akademi-tiyatrosu/index.html');
kontrol('KAT iki şubede aktif ve haftada 2 gün eğitim grubu',
  kat.includes('Gaziantep') && kat.includes('Güzelbahçe') && kat.includes('Haftada 2 gün'));

const koro = oku('dist/programlar/cocuk-korosu/index.html');
kontrol('Çocuk Korosu yaş grubu dönemsel yönetiliyor',
  /dönemsel olarak oluşturulur|dönemsel/i.test(koro));

const drama = oku('dist/programlar/yaratici-drama/index.html');
kontrol('Yaratıcı Drama İlkokul ve Ortaokul ayrı gruplar',
  drama.includes('İlkokul ve Ortaokul grupları ayrı açılır'));

const ing = oku('dist/programlar/ingilizce-konusma-kulubu/index.html');
kontrol('İngilizce Konuşma Kulübü İlkokul / Ortaokul / Lise olarak ayrılmış',
  ['İlkokul', 'Ortaokul', 'Lise'].every((g) => ing.includes(g)));

const yetiskinler = kartAdlari(oku('dist/programlar/yetiskinler/index.html'));
kontrol('Kitap ve Sinema Kulübü Yetişkinler altında',
  yetiskinler.includes('Kafka Kitap Kulübü') && yetiskinler.includes('Kafka Sinema Kulübü'));
kontrol('Ahşap Oyma Atölyesi Yetişkinler altında ve yalnız Güzelbahçe\'de',
  yetiskinler.includes('Ahşap Oyma Atölyesi') &&
  !kartAdlari(oku('dist/gaziantep/index.html')).includes('Ahşap Oyma Atölyesi') &&
  kartAdlari(oku('dist/izmir/index.html')).includes('Ahşap Oyma Atölyesi'));

// Eğitim ücreti hiçbir program sayfasında geçmemeli (International hariç)
const ucretDesen = /\b\d{1,3}\.?\d{3}\s?(TL|₺)/;
const ucretliSayfalar = [];
for (const s of ['gct', 'ggt-lab', 'sanata-ilk-adim', 'kafka-akademi-tiyatrosu']) {
  if (ucretDesen.test(oku(`dist/programlar/${s}/index.html`))) ucretliSayfalar.push(s);
}
kontrol('Eğitim programı ücretleri ana sitede yayınlanmıyor',
  ucretliSayfalar.length === 0, ucretliSayfalar.join(', '));

kontrol('2017 kuruluş yılı ve iki şehir ana sayfanın ilk bölümlerinde',
  ana.slice(0, 20000).includes('2017') &&
  ana.slice(0, 20000).includes('Gaziantep') &&
  ana.slice(0, 20000).includes('İzmir'));

kontrol('Yasal sayfalar noindex ve site haritasında değil',
  oku('dist/yasal/kvkk/index.html').includes('noindex') &&
  !oku('dist/sitemap-0.xml').includes('/yasal/'));

// Örnek (gerçek olmayan) kayıtlar yayına çıkamaz.
const ornekler = existsSync('src/content/uretimler')
  ? readdirSync('src/content/uretimler')
      .filter((f) => f.endsWith('.json'))
      .filter((f) => JSON.parse(readFileSync(`src/content/uretimler/${f}`, 'utf8')).ornek)
  : [];
if (!ONIZLEME) {
  kontrol('Sitede örnek (gerçek olmayan) kayıt yok',
    ornekler.length === 0, `${ornekler.length} örnek kayıt: ${ornekler.join(', ')}`);
}

// ── Çıktı ──────────────────────────────────────────────────────
const gecen = sonuclar.filter((s) => s.gecti).length;
console.log(`§36 otomatik kontroller: ${gecen}/${sonuclar.length}\n`);
for (const s of sonuclar) {
  console.log(`  ${s.gecti ? '☑' : '☐'} ${s.ad}${s.detay && !s.gecti ? '  → ' + s.detay : ''}`);
}
if (ONIZLEME && ornekler.length > 0) {
  console.log(`\n⚠ Önizleme kipi: ${ornekler.length} örnek kayıt var — gerçek yayında bu kontrol düşer.`);
  ornekler.forEach((f) => console.log('    ' + f));
}

console.log('\nElle doğrulanacaklar:');
for (const m of [
  'Gerçek Kafka fotoğraf ve videoları kullanılıyor (§31)',
  'Başvuru formu gerçek gönderim testi yapıldı (Worker canlıda)',
  'WhatsApp yönlendirmeleri ve harita bağlantıları mobil cihazda test edildi',
  'KVKK, gizlilik, çerez ve fotoğraf/video izin metinleri hukuki kontrolden geçti',
  'Inner Power projesinin tarihi, kapsamı ve partner tanımı doğrulandı (§24)',
]) console.log('  ☐ ' + m);

process.exit(gecen === sonuclar.length ? 0 : 1);
