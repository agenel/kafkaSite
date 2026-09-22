import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

import { blokSemasi as blok } from './lib/blok-semasi';
export type { Blok } from './lib/blok-semasi';

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

/** §34 — dönemsel, CMS'ten yönetilen alanlar. Metne gömülmez. */
const durum = z.enum([
  'basvurular-acik',
  'dolu',
  'bekleme-listesi',
  'yakinda',
  'bu-subede-acik-degil',
]);

const teklif = z.object({
  sube: z.enum(['gaziantep', 'izmir']),
  durum: durum.default('basvurular-acik'),
  gun: z.string().optional(),
  saat: z.string().optional(),
  yasSinif: z.string().optional(),
  haftalikSure: z.string().optional(),
  programSuresi: z.string().optional(),
  kontenjan: z.string().optional(),
  egitmen: z.string().optional(),
  not: z.string().optional(),
});

const yasCatisi = z.enum([
  'okul-oncesi',
  'cocuklar',
  'gencler',
  'yetiskinler',
]);

const programlar = defineCollection({
  loader: glob({ base: './src/content/programlar', pattern: '**/*.json' }),
  schema: z.object({
    ad: z.string(),
    uzunAd: z.string().optional(),
    kisaltma: z.string().optional(),
    /**
     * §09: bağımsız programların yaş grubu sabit değil; birden çok çatıda görünebilir.
     * Sıra çatıdan çatıya değişir — §07 ve §13 farklı sıralamalar veriyor, o yüzden
     * sıra tek bir sayı değil, çatı başına tanımlanır. §36 bu sırayı denetliyor.
     */
    yerlesim: z
      .array(z.object({ yasCatisi, sira: z.number() }))
      .min(1),
    format: z.enum(['ana-program', 'laboratuvar', 'atolye', 'kulup', 'topluluk']),
    amiral: z.boolean().default(false),
    anaSayfaGorunurluk: z.enum(['amiral', 'liste', 'gizli']).default('liste'),
    ustBaslik: z.string().optional(),
    kisaTanim: z.string(),
    girisMetni: z.string().optional(),
    ctaTipi: z.enum(['basvuru', 'whatsapp', 'katalog', 'bilgi']).default('basvuru'),
    gorsel: z.string().optional(),
    gorselAlt: z.string().optional(),
    gorselKarakteri: z.string().optional(),
    teklifler: z.array(teklif).default([]),
    bolumler: z.array(blok).default([]),
    seo,
  }),
});

const sayfalar = defineCollection({
  loader: glob({ base: './src/content/sayfalar', pattern: '**/*.json' }),
  schema: z.object({
    baslik: z.string(),
    ustBaslik: z.string().optional(),
    girisMetni: z.string().optional(),
    acilisAlintisi: z.string().optional(),
    bolumler: z.array(blok).default([]),
    seo,
  }),
});

const subeler = defineCollection({
  loader: glob({ base: './src/content/subeler', pattern: '**/*.json' }),
  schema: z.object({
    kod: z.enum(['gaziantep', 'izmir']),
    ad: z.string(),
    kisaAd: z.string(),
    tanim: z.string(),
    sira: z.number(),
    telefon: z.string(),
    adres: z.string(),
    haritaUrl: z.string().optional(),
    instagram: z.string(),
    ekInstagram: z.array(z.object({ etiket: z.string(), hesap: z.string() })).default([]),
    sorumlu: z.object({ ad: z.string(), unvan: z.string() }),
    seo,
  }),
});

const uretimler = defineCollection({
  loader: glob({ base: './src/content/uretimler', pattern: '**/*.json' }),
  schema: z.object({
    ad: z.string(),
    yil: z.number(),
    kategori: z.enum([
      'sahne',
      'tirat',
      'yazi',
      'dijital',
      'yaratici-kesifler',
      'kamera-arkasi',
    ]),
    program: z.string(),
    sube: z.enum(['gaziantep', 'izmir']).optional(),
    mekan: z.string().optional(),
    neUretildi: z.string(),
    nasilCalisildi: z.string().optional(),
    ogrenciRolleri: z.array(z.string()).default([]),
    gorsel: z.string().optional(),
    gorselAlt: z.string().optional(),
    surecGorselleri: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    fragmanUrl: z.string().optional(),
    ogrenciSozu: z.object({ metin: z.string(), kaynak: z.string() }).optional(),
    seo,
  }),
});

const international = defineCollection({
  loader: glob({ base: './src/content/international', pattern: '**/*.json' }),
  schema: z.object({
    ad: z.string(),
    ulke: z.string(),
    sehir: z.string(),
    hedefGrup: z.string(),
    tarihler: z.string().optional(),
    amac: z.string(),
    /** §26 istisnası: International ücreti YALNIZ burada yayınlanabilir. */
    ucret: z.string().optional(),
    ogrenciIndirimi: z.string().optional(),
    icerikBasliklari: z.array(z.string()).default([]),
    dogrulanmisBilgiler: z.array(z.object({ etiket: z.string(), deger: z.string() })).default([]),
    gorsel: z.string().optional(),
    gorselAlt: z.string().optional(),
    durum: z.enum(['aktif', 'yakinda', 'tamamlandi']).default('aktif'),
    sira: z.number().default(50),
    seo,
  }),
});

/** §17: Kostüm kataloğunda fiyat alanı BİLEREK yoktur. */
const kostum = defineCollection({
  loader: glob({ base: './src/content/kostum', pattern: '**/*.json' }),
  schema: z.object({
    ad: z.string(),
    kategori: z.enum([
      'halk-oyunlari',
      'modern-dans',
      'bale',
      'tiyatro',
      'tematik',
      'okul-gosterisi',
    ]),
    aciklama: z.string(),
    hizmetler: z.array(z.enum(['kiralama', 'toplu-siparis', 'ozel-siparis'])).default([]),
    gorsel: z.string().optional(),
    gorselAlt: z.string().optional(),
    sira: z.number().default(50),
  }),
});

const sosyalProjeler = defineCollection({
  loader: glob({ base: './src/content/sosyal-projeler', pattern: '**/*.json' }),
  schema: z.object({
    ad: z.string(),
    statu: z.enum(['aktif', 'donemsel', 'tamamlandi', 'arsiv']),
    partner: z.string().optional(),
    yer: z.string().optional(),
    yaklasim: z.string(),
    aciklama: z.string(),
    /** §24: tarih, kapsam ve partner tanımı yayın öncesi doğrulanmalı. */
    dogrulandi: z.boolean().default(false),
    gorsel: z.string().optional(),
    gorselAlt: z.string().optional(),
    sira: z.number().default(50),
  }),
});

const sss = defineCollection({
  // CMS dosya koleksiyonu içeriği { sorular: [...] } olarak yazar.
  loader: file('./src/content/sss.json', {
    parser: (metin) => JSON.parse(metin).sorular,
  }),
  schema: z.object({
    id: z.string(),
    soru: z.string(),
    cevap: z.string(),
    kategori: z.enum([
      'genel',
      'kayit',
      'ucret',
      'okul-oncesi',
      'cocuklar',
      'gencler',
      'yetiskinler',
      'international',
      'kostum',
    ]),
  }),
});

export const collections = {
  programlar,
  sayfalar,
  subeler,
  uretimler,
  international,
  kostum,
  sosyalProjeler,
  sss,
};
