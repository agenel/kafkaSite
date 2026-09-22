import { z } from 'astro/zod';

/**
 * İçerik blokları.
 * Docx'teki her yapı tipinin (Heading2 + paragraf, QuoteKafka, ListBullet/ListNumber,
 * etiket-değer çiftleri, SmallNote) bir karşılığı var. Tek bir <Bloklar> bileşeni
 * hepsini render eder; böylece hem tasarım kontrolü hem CMS düzenlenebilirliği korunur.
 *
 * Şema `astro/zod`den alınır (sanal `astro:content` yerine), böylece tip çıkarımı
 * bileşenlerde de kaybolmaz.
 */
export const blokSemasi = z.discriminatedUnion('tip', [
  z.object({
    tip: z.literal('metin'),
    baslik: z.string().optional(),
    paragraflar: z.array(z.string()).min(1),
  }),
  z.object({
    tip: z.literal('alinti'),
    metin: z.string(),
    altMetin: z.string().optional(),
  }),
  z.object({
    tip: z.literal('liste'),
    baslik: z.string().optional(),
    giris: z.string().optional(),
    maddeler: z.array(z.string()).min(1),
    sirali: z.boolean().default(false),
    kapanis: z.string().optional(),
  }),
  z.object({
    tip: z.literal('kartlar'),
    baslik: z.string().optional(),
    giris: z.string().optional(),
    kartlar: z.array(z.object({ baslik: z.string(), metin: z.string() })).min(2),
    kapanis: z.string().optional(),
  }),
  z.object({
    tip: z.literal('adimlar'),
    baslik: z.string().optional(),
    giris: z.string().optional(),
    adimlar: z.array(z.object({ baslik: z.string(), metin: z.string() })).min(2),
  }),
  z.object({
    tip: z.literal('bilgi'),
    baslik: z.string().optional(),
    satirlar: z.array(z.object({ etiket: z.string(), deger: z.string() })).min(1),
  }),
  z.object({
    tip: z.literal('not'),
    baslik: z.string().optional(),
    metin: z.string(),
  }),
  z.object({
    tip: z.literal('cta'),
    birincil: z.object({ etiket: z.string(), href: z.string() }),
    ikincil: z.object({ etiket: z.string(), href: z.string() }).optional(),
  }),
]);

export type Blok = z.infer<typeof blokSemasi>;
