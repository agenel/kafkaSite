/**
 * CMS yapılandırması ile içerik şemasının senkron kalmasını denetler.
 * Şemaya alan eklenip CMS'e eklenmezse editör o alanı silerek kaydedebilir.
 */
import YAML from 'yaml';
import { readFileSync, readdirSync } from 'node:fs';

const cms = YAML.parse(readFileSync('public/admin/config.yml', 'utf8'));
const sorunlar = [];

// 1) Blok tipleri
const cmsBloklar = cms.collections
  .find((c) => c.name === 'programlar')
  .fields.find((f) => f.name === 'bolumler')
  .types.map((t) => t.name)
  .sort();
const semaBloklar = [
  ...readFileSync('src/lib/blok-semasi.ts', 'utf8').matchAll(/z\.literal\('([a-z]+)'\)/g),
].map((m) => m[1]).sort();
if (cmsBloklar.join() !== semaBloklar.join()) {
  sorunlar.push(`Blok tipleri uyuşmuyor.\n    CMS  : ${cmsBloklar.join(', ')}\n    Şema : ${semaBloklar.join(', ')}`);
}

// 2) Klasör koleksiyonlarının hedefleri var mı
for (const k of cms.collections.filter((c) => c.folder)) {
  try {
    readdirSync(k.folder);
  } catch {
    sorunlar.push(`CMS koleksiyonu "${k.name}" mevcut olmayan klasörü gösteriyor: ${k.folder}`);
  }
}

// 3) Program durumları şemayla aynı mı
const cmsDurumlar = cms.collections
  .find((c) => c.name === 'programlar')
  .fields.find((f) => f.name === 'teklifler')
  .fields.find((f) => f.name === 'durum')
  .options.map((o) => o.value)
  .sort();
const semaDurumlar = [
  ...readFileSync('src/content.config.ts', 'utf8')
    .match(/const durum = z\.enum\(\[([\s\S]*?)\]\)/)[1]
    .matchAll(/'([a-z-]+)'/g),
].map((m) => m[1]).sort();
if (cmsDurumlar.join() !== semaDurumlar.join()) {
  sorunlar.push(`Program durumları uyuşmuyor.\n    CMS  : ${cmsDurumlar.join(', ')}\n    Şema : ${semaDurumlar.join(', ')}`);
}

// 4) site.ts'teki durum etiketleri de aynı kümeyi kapsamalı
const etiketler = [
  ...readFileSync('src/data/site.ts', 'utf8')
    .match(/programDurumEtiketi = \{([\s\S]*?)\} as const/)[1]
    .matchAll(/^\s*'?([a-z-]+)'?:/gm),
].map((m) => m[1]).sort();
if (etiketler.join() !== semaDurumlar.join()) {
  sorunlar.push(`site.ts durum etiketleri eksik/fazla.\n    site.ts: ${etiketler.join(', ')}\n    Şema   : ${semaDurumlar.join(', ')}`);
}

if (sorunlar.length === 0) {
  console.log('CMS yapılandırması içerik şemasıyla senkron.');
} else {
  console.log(`${sorunlar.length} uyuşmazlık:`);
  sorunlar.forEach((s) => console.log('  • ' + s));
  process.exit(1);
}
