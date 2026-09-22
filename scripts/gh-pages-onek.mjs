/**
 * YALNIZ GitHub Pages önizlemesi içindir.
 *
 * GitHub Pages proje sayfaları /<repo>/ alt yolunda servis edilir; sitedeki
 * bağlantılar ise kök göreli ("/programlar"). Bu betik dist/ çıktısındaki kök
 * göreli URL'lere alt yol önekini ekler.
 *
 * Gerçek hedef Cloudflare Pages'tir; orada site kök alan adında durur ve bu
 * betik hiç çalışmaz. Bu yüzden önek kaynak koda değil, yalnız çıktıya uygulanır.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ONEK = process.argv[2];
if (!ONEK || !ONEK.startsWith('/')) {
  console.error('Kullanım: node scripts/gh-pages-onek.mjs /repo-adi');
  process.exit(1);
}

const UZANTILAR = ['.html', '.css', '.xml', '.js'];

// Kök göreli URL'ler: href="/x", src="/x", content="/x", srcset, url(/x), url("/x")
// "//cdn.example.com" (protokolsüz) ve "/kafkaSite/..." (zaten önekli) atlanır.
const DESENLER = [
  [/(\s(?:href|src|content|action|data-src)=")\/(?!\/)/g, `$1${ONEK}/`],
  [/(\ssrcset=")\/(?!\/)/g, `$1${ONEK}/`],
  [/(url\(")\/(?!\/)/g, `$1${ONEK}/`],
  [/(url\()\/(?!\/)/g, `$1${ONEK}/`],
];

function* dosyalar(dizin) {
  for (const ad of readdirSync(dizin)) {
    const tam = join(dizin, ad);
    if (statSync(tam).isDirectory()) yield* dosyalar(tam);
    else if (UZANTILAR.some((u) => ad.endsWith(u))) yield tam;
  }
}

let degisen = 0;
let toplamDegisim = 0;
for (const dosya of dosyalar('dist')) {
  const orij = readFileSync(dosya, 'utf8');
  let icerik = orij;
  for (const [desen, yerine] of DESENLER) {
    icerik = icerik.replace(desen, (...args) => {
      toplamDegisim++;
      // $1'i elle yerine koy: eşleşen grup + önek + "/"
      return args[1] + ONEK + '/';
    });
  }
  if (icerik !== orij) {
    writeFileSync(dosya, icerik);
    degisen++;
  }
}

// Önizleme dağıtımı arama motorlarına kapalıdır; kanonik etiketler zaten
// gerçek alan adını gösteriyor.
writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');

console.log(`${degisen} dosyada ${toplamDegisim} bağlantı "${ONEK}" önekiyle güncellendi.`);
console.log('robots.txt önizleme için Disallow: / olarak değiştirildi.');
