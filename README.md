# Kafka Sanat Akademisi — Web Sitesi

Statik site. İçerik kaynağı: `brief/KAFKA_WEB_SITE_FINAL.docx` (37 bölümlük nihai içerik dosyası).

```
Astro 7 (static)  →  Cloudflare Pages
Sveltia CMS       →  /admin (GitHub ile giriş)
Cloudflare Worker →  /api/basvuru (başvuru formu → e-posta)
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:4321) |
| `npm run build` | `dist/` klasörüne statik site üretir |
| `npm run preview` | Üretilmiş siteyi yerel olarak servis eder |
| `npm run check` | TypeScript ve Astro tip kontrolü |
| `npm test` | Worker testleri + CMS/şema senkron kontrolü |
| `npm run test:yayin` | §36 yayın öncesi kontrol listesi (önce `build`) |
| `npm run test:responsive` | 42 sayfa × 3 genişlik: taşma, dokunma hedefi, alt metni (önce `build` + `preview`) |

## Mimari

### İçerik ile dönemsel veri ayrıdır
Belgenin temel kuralı: gün, saat, eğitmen, kontenjan ve program durumu metne gömülmez.
Bunlar her programın `teklifler` dizisinde, şube başına tutulur ve CMS'ten güncellenir.
Kurumsal ve pedagojik metinler `bolumler` bloklarında durur.

### Program ↔ şube çoka-çok
Aynı GÇT'nin Gaziantep ve Güzelbahçe'de ayrı takvimi ve durumu vardır; metni tektir.
`durum: "bu-subede-acik-degil"` olan teklif, o şubenin sayfasında listelenmez.

### Yaş çatısındaki sıra çatıya göre değişir
§07 (Çocuklar) ve §13 (Yetişkinler) farklı sıralamalar verdiği için sıra tek bir sayı
değil, `yerlesim: [{ yasCatisi, sira }]` biçiminde çatı başına tanımlanır.

### Bloklar
`src/lib/blok-semasi.ts` tek bir ayrık birleşim (discriminated union) tanımlar;
`src/components/Bloklar.astro` hepsini render eder; `public/admin/config.yml` aynısını
CMS'te sunar. `npm run test:cms` üçünün senkron kaldığını denetler.

## Dizinler

```
brief/           Kaynak docx ve düz metin çıkarımı
docs/            Çekim listesi, CMS kullanım kılavuzu
public/admin/    Sveltia CMS
public/fonts/    Self-hosted Archivo + Source Serif 4 (Google'a istek gitmez)
scripts/         Doğrulama betikleri
src/content/     İçeriğin tek kaynağı (JSON)
src/lib/         Şema ve sorgu yardımcıları
worker/          Cloudflare Worker + testleri
```

## Önizleme

Her `main` push'unda GitHub Actions siteyi derleyip GitHub Pages'e dağıtır:
**https://agenel.github.io/kafkaSite/**

Önizlemeye özgü üç fark (yalnız çıktıya uygulanır, kaynak kod etkilenmez):
- Site `/kafkaSite/` alt yolunda durduğu için bağlantılara önek eklenir
- `/admin` kimlik doğrulaması olmayan `test-repo` arka ucunda açılır (değişiklikler
  yalnız tarayıcıda kalır)
- `robots.txt` arama motorlarına kapalıdır; kanonik etiketler gerçek alan adını gösterir

## Kurulum (yayına alma)

1. **GitHub**: repoyu oluşturup `main` dalına gönderin.
2. **Cloudflare Pages**: repoyu bağlayın · build komutu `npm run build` · çıktı `dist`.
3. **Worker**: `cd worker && npx wrangler deploy`, ardından secret'ları girin:
   ```
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put ALICI_EPOSTA        # kafkaakademi@gmail.com
   npx wrangler secret put GONDERICI_EPOSTA    # doğrulanmış gönderici adresi
   npx wrangler secret put TURNSTILE_SECRET    # opsiyonel, spam koruması
   ```
   Worker rotasını `kafkasanatakademisi.com/api/basvuru` olarak bağlayın.
4. **CMS**: `repo` alanı `agenel/kafkaSite` olarak dolu. Giriş için GitHub'dan bir
   fine-grained PAT yeterlidir (Contents: read/write) — ayrı OAuth uygulaması veya
   Worker **gerekmez**. Yerelde çalışmak için `localhost:4321/admin/index.html` →
   “Work with Local Repository”. Ayrıntı: `docs/cms-kullanim.md`.
5. **Domain**: DNS'i Cloudflare'e yönlendirin.

## Bilinen eksikler

- **Görseller Instagram'dan alındı, çekim hâlâ gerekli.** `public/gorseller/` altındaki
  35 görsel, kurumun kendi Instagram hesaplarından (@kafkasanatakademisi,
  @gaziantepcocuktiyatrosu, @kafkakostum) indirildi. Ayrıntı: `docs/gorsel-kaynaklari.md`.
  **Yayın öncesi iki şey gerekli:** (1) §30 uyarınca çocukların web sitesinde
  gösterilmesi için ayrı izin teyidi, (2) hero videosu ve geniş banner'lar için gerçek
  çekim — Instagram kareleri bu slotlara yetmiyor. **Tam çekim listesi: `docs/cekim-listesi.md`** — 15 çekim oturumu ve sitedeki her görsel alanının dökümü.
- **Yasal metinler yer tutucu.** KVKK, gizlilik, çerez ve fotoğraf/video izin sayfaları
  `noindex` ve site haritası dışında; nihai metin hukuki kontrolden geçmeden yayına çıkmaz.
- **Ürettiklerimiz'de 6 örnek kayıt var.** Sayfanın gerçek kayıtlarla nasıl görüneceğini
  göstermek için eklendi. Her biri `ornek: true` taşır, sitede "Örnek kayıt" olarak
  etiketlenir ve `npm run test:yayin` bunlar silinene kadar **başarısız olur** — yani
  yanlışlıkla yayına çıkamazlar.
- **Harita bağlantıları eksik.** Şube kayıtlarındaki `haritaUrl` alanı doldurulmalı.
