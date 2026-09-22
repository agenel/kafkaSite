/**
 * YALNIZ GitHub Pages önizlemesi içindir.
 *
 * GitHub Pages proje sayfaları /<repo>/ alt yolunda servis edilir; sitedeki
 * bağlantılar ise kök göreli ("/programlar"). Bu betik dist/ çıktısındaki kök
 * göreli URL'lere alt yol önekini ekler.
 *
 * Gerçek hedef Cloudflare Pages'tir; orada site kök alan adında durur ve bu
 * betik hiç çalışmaz. Bu yüzden önek kaynak koda değil, yalnız çıktıya uygulanır.
 *
 * Ayrıca çıktıda:
 *  - /admin CMS'i, kimlik doğrulaması gerektirmeyen "test-repo" arka ucuna alır
 *    (Sveltia'nın demo kipi; tarayıcıda çalışır, hiçbir yere yazmaz)
 *  - robots.txt'yi arama motorlarına kapatır
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
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

// ── /admin: kimlik doğrulaması olmayan demo kipi ────────────────
// Gerçek yapılandırma GitHub arka ucunu kullanır ve OAuth Worker'ı ister.
// Önizlemede o yok; "test-repo" arka ucu tarayıcıda çalışır, hiçbir yere yazmaz.
const adminYolu = 'dist/admin/config.yml';
if (existsSync(adminYolu)) {
  const cfg = readFileSync(adminYolu, 'utf8');
  let demo = cfg.replace(
    /backend:\n(?:[ \t]+.*\n)+/,
    'backend:\n  name: test-repo   # ÖNİZLEME: kimlik doğrulaması yok, değişiklikler kaydedilmez\n'
  );
  // YAML içindeki kök göreli yollar (HTML desenlerine uymaz, elle öneklenir)
  demo = demo
    .replace(/^(logo_url:\s*)\/(?!\/)/m, `$1${ONEK}/`)
    .replace(/^(public_folder:\s*)\/(?!\/)/m, `$1${ONEK}/`)
    .replace(/^(site_url:\s*).*$/m, `$1${ONEK}/`);
  writeFileSync(adminYolu, demo);
  console.log('admin/config.yml önizleme için test-repo arka ucuna alındı.');

  // Önizlemede olduğunu panelin üstünde açıkça yaz.
  const adminHtml = 'dist/admin/index.html';
  if (existsSync(adminHtml)) {
    const afis = `<div style="position:fixed;inset:auto 0 0 0;z-index:9999;background:#de1f26;color:#fff;
font:500 13px/1.6 system-ui,sans-serif;padding:12px 16px;text-align:center">
<b>Önizleme kipi — koleksiyonlar bu yüzden boş görünüyor.</b><br>
Bu panel demo arka ucunda çalışıyor; sitedeki gerçek içeriği okumuyor ve hiçbir yere yazmıyor.
Gerçek içeriği görmek için: <code>npm run dev</code> → <code>localhost:4321/admin/index.html</code>
→ “Work with Local Repository”.</div>`;
    writeFileSync(adminHtml, readFileSync(adminHtml, 'utf8').replace('</body>', afis + '</body>'));
    console.log('admin/index.html önizleme afişi eklendi.');
  }
}

// Önizleme dağıtımı arama motorlarına kapalıdır; kanonik etiketler zaten
// gerçek alan adını gösteriyor.
writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');

console.log(`${degisen} dosyada ${toplamDegisim} bağlantı "${ONEK}" önekiyle güncellendi.`);
console.log('robots.txt önizleme için Disallow: / olarak değiştirildi.');
