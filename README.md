# Kafka Sanat Akademisi — Web Sitesi

Statik site. İçerik kaynağı: `brief/KAFKA_WEB_SITE_FINAL.docx` (37 bölümlük nihai içerik dosyası).

```
Astro 7 (static)   →  FTP hosting (Apache + PHP)
GitHub Actions     →  her push'ta derler, FTP ile yükler
Sveltia CMS        →  /admin (GitHub ile giriş)
PHP (/api/basvuru.php) →  başvuru formu → e-posta
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:4321) |
| `npm run build` | `dist/` klasörüne statik site üretir |
| `npm run preview` | Üretilmiş siteyi yerel olarak servis eder |
| `npm run check` | TypeScript ve Astro tip kontrolü |
| `npm test` | Form mantığı + CMS/şema senkron kontrolü |
| `npm run test:form` | Başvuru formunun PHP ile uçtan uca testi (PHP gerekir) |
| `npm run test:yayin` | §36 yayın öncesi kontrol listesi (önce `build`) |
| `npm run gorsel-durum` | Her görsel alanının durumu: gerçek / geçici / boş |
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

Ayrıntılı adımlar: **`docs/hosting-kurulum.md`**

1. **GitHub secret'ları** — Settings → Secrets and variables → Actions:
   `FTP_SUNUCU`, `FTP_KULLANICI`, `FTP_PAROLA`, `FTP_DIZIN` (genelde `/public_html/`)
2. **Sunucuda form ayarı** — `docs/basvuru-ayar.ornek.php` dosyasını sunucuda
   `api/basvuru-ayar.php` adıyla oluşturup doldurun. Depoya girmez.
3. **Gönderici e-posta** — hosting panelinden `basvuru@kafkasanatakademisi.com`
   oluşturun; alan adıyla aynı olmayan gönderici spam'e düşer.
4. **CMS** — `repo` alanı `agenel/kafkaSite` olarak dolu. Giriş için GitHub'dan
   fine-grained PAT yeterlidir (Contents: read/write). Yerelde:
   `localhost:4321/admin/index.html` → “Work with Local Repository”.
5. **Domain** — DNS'i hosting sağlayıcısının sunucularına yöneltin.

> CMS'ten yapılan her değişiklik git'e yazılır, GitHub Actions derleyip FTP ile
> yükler. Secret'lar girilmeden bu zincir çalışmaz ve CMS güncellemeleri siteye
> yansımaz.

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
