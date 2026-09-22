# Kafka Sanat Akademisi — Geliştirici Notları

## Değiştirilmemesi gerekenler

Bu sitenin içerik kuralları `brief/KAFKA_WEB_SITE_FINAL.docx` dosyasından gelir ve
kurumsal kararlardır — "eksik" değildir:

- **Eğitim programlarının ücreti ana sitede yayınlanmaz** (§26). Tek istisna: Kafka
  International program sayfaları. Kafka Kostüm kataloğunda da fiyat alanı yoktur.
- **Stok fotoğraf kullanılmaz** (§31). Gerçek görsel yoksa yer tutucu gösterilir.
- **Sahne Modu ayrı bir program değildir** (§12); GGT Lab sayfasının alt bölümüdür.
- **Ayrı "Ekibimiz" sayfası açılmaz** (§02). Kurucular Hikayemiz sayfasında görünür.
- **KAT yönetim kurulu isimleri yayınlanmaz** (§14).
- Yaş sayfalarındaki ilk sıralar sabittir: Okul Öncesi→Sanata İlk Adım, Çocuklar→GÇT,
  Gençler→GGT Lab, Yetişkinler→KAT. `npm run test:yayin` bunu denetler.

## Tailwind v4 notu

`text-[var(--bir-sey)]` yazmayın — Tailwind bunu **renk** sanar ve font boyutu sessizce
uygulanmaz. Token'lar `@theme` içinde tanımlı; gerçek utility'leri kullanın:
`text-hero`, `text-baslik`, `text-govde`, `text-ink`, `bg-paper`, `border-line`.

## Şema değiştirirken

`src/lib/blok-semasi.ts` veya `src/content.config.ts` içinde alan eklerseniz
`public/admin/config.yml` dosyasını da güncelleyin. Aksi halde CMS o alanı tanımaz ve
editör kaydettiğinde alanı silebilir. `npm run test:cms` uyuşmazlığı yakalar.

## Doğrulama

```bash
npm run check          # tip kontrolü
npm test               # worker + CMS senkron
npm run build && npm run test:yayin       # §36 kontrol listesi
npm run preview & npm run test:responsive # taşma / dokunma hedefi / alt metni
```
