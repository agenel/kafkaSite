import worker from './basvuru-worker.js';

const env = {
  RESEND_API_KEY: 'test',
  ALICI_EPOSTA: 'kafkaakademi@gmail.com',
  GONDERICI_EPOSTA: 'basvuru@kafkasanatakademisi.com',
  IZINLI_KAYNAK: 'https://kafkasanatakademisi.com',
};

let sonGonderilen = null;
globalThis.fetch = async (url, init) => {
  sonGonderilen = JSON.parse(init.body);
  return new Response(JSON.stringify({ id: 'x' }), { status: 200 });
};

const istek = (govde, origin = 'https://kafkasanatakademisi.com') =>
  new Request('https://kafkasanatakademisi.com/api/basvuru', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(govde),
  });

const gecerli = {
  sehir: 'Gaziantep', yas: '7 yaş / 2. sınıf', program: 'GÇT',
  beklenti: 'Çocuğum sahneye ilgi duyuyor.', ad: 'Ayşe Yılmaz',
  telefon: '0505 614 47 67', onay: 'on',
};

const testler = [
  ['geçerli başvuru', gecerli, 200],
  ['eksik ad', { ...gecerli, ad: '' }, 400],
  ['geçersiz telefon', { ...gecerli, telefon: '123' }, 400],
  ['geçersiz şehir', { ...gecerli, sehir: 'Ankara' }, 400],
  ['onay yok', { ...gecerli, onay: undefined }, 400],
  ['bot tuzağı dolu', { ...gecerli, sirket: 'spam' }, 200],
  ['+90 formatı', { ...gecerli, telefon: '+90 537 240 17 73' }, 200],
  ['öneksiz 10 hane', { ...gecerli, telefon: '5056144767' }, 200],
];

let hata = 0;
for (const [ad, govde, beklenen] of testler) {
  const y = await worker.fetch(istek(govde), env);
  const ok = y.status === beklenen;
  if (!ok) hata++;
  console.log(`${ok ? '✓' : '✗'} ${ad.padEnd(22)} → ${y.status} (beklenen ${beklenen})`);
}

// Yabancı kaynak reddedilmeli
const y = await worker.fetch(istek(gecerli, 'https://kotu-site.com'), env);
console.log(`${y.status === 403 ? '✓' : '✗'} yabancı kaynak reddi  → ${y.status} (beklenen 403)`);
if (y.status !== 403) hata++;

// XSS kaçışı
await worker.fetch(istek({ ...gecerli, ad: '<script>alert(1)</script>' }), env);
const kacisli = !sonGonderilen.html.includes('<script>alert');
console.log(`${kacisli ? '✓' : '✗'} HTML kaçışı`);
if (!kacisli) hata++;

console.log(`\n${hata === 0 ? 'Tüm testler geçti.' : hata + ' test başarısız.'}`);
process.exit(hata === 0 ? 0 : 1);
