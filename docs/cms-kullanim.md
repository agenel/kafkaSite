# İçerik Yönetimi (CMS) Kullanım Kılavuzu

Yaptığınız her değişiklik git'e kaydedilir, site otomatik yeniden yayınlanır ve
yaklaşık **1 dakika içinde** canlıya çıkar. Her değişiklik geçmişe işlenir;
yanlış bir şey yaparsanız geri alınabilir.

## Panele üç şekilde girilir

| Nerede | Adres | Ne görürsünüz |
|---|---|---|
| **Yerelde** (bilgisayarınızda) | `npm run dev` → `localhost:4321/admin/index.html` → **“Work with Local Repository”** | Gerçek içeriğin tamamı. Giriş gerekmez. Değişiklikler doğrudan dosyalara yazılır; git'e siz commit edersiniz. **Chrome veya Edge gerekir.** |
| **Yayındaki sitede** | `kafkasanatakademisi.com/admin` → **“Sign In with GitHub Using PAT”** | Gerçek içerik. GitHub'dan alacağınız bir erişim anahtarıyla (PAT) girilir; değişiklikler doğrudan git'e yazılır. |
| **Önizleme sitesinde** | `agenel.github.io/kafkaSite/admin/` | **Boş.** Demo arka ucunda çalışır; sitedeki içeriği okumaz. Yalnız panelin nasıl göründüğünü denemek içindir. |

> **Önizlemedeki panel neden boş?**
> Demo arka ucu (test-repo) hiçbir depoya bağlı değildir ve tasarımı gereği boş başlar.
> Sitedeki 16 program, şubeler ve SSS orada görünmez — eksik değil, o panel içeriği
> okumuyor. Gerçek içerik için yukarıdaki ilk iki satırı kullanın.

### PAT ile giriş (yayındaki site için)

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. Yalnız `agenel/kafkaSite` deposuna erişim verin
3. İzin: **Contents → Read and write**
4. Oluşan anahtarı kopyalayın, `/admin` sayfasında “Sign In with GitHub Using PAT” deyip yapıştırın

Ayrı bir OAuth uygulaması veya sunucu kurmanız **gerekmez**.

---

## En sık yapacağınız iş: dönem bilgisi güncellemek

Gün, saat, eğitmen, kontenjan ve program durumu metnin içine gömülü **değildir**.
Bunlar her programın **"Şube teklifleri"** bölümünden yönetilir.

1. Sol menüden **Programlar** → güncellemek istediğiniz programı açın
2. Aşağı inip **Şube teklifleri** bölümünü bulun
3. İlgili şubeyi (Gaziantep / İzmir) açın
4. Gün, saat, yaş/sınıf, süre, kontenjan, eğitmen alanlarını düzenleyin
5. Sağ üstten **Kaydet** / **Yayınla**

### Program durumu ne anlama geliyor?

| Durum | Sitede ne olur |
|---|---|
| **Başvurular Açık** | Program kartında kırmızı "Başvurular Açık" rozeti çıkar |
| **Dolu** | Gri rozet; program görünür ama dolu olduğu belirtilir |
| **Bekleme Listesi** | Bekleme listesi rozeti |
| **Yakında** | Program görünür, henüz açılmadığı belirtilir |
| **Bu Şubede Açık Değil** | O şubenin sayfasında **listelenmez**; program sayfasında açıkça belirtilir |

---

## Yeni program eklemek

**Programlar → Yeni Program.** Doldurulması gerekenler:

- **Program adı** — sitede görünen ad
- **Yaş çatısı ve sırası** — programın hangi yaş sayfalarında, kaçıncı sırada görüneceği.
  Bir program birden çok yaş grubunda görünebilir (örn. Resim: Çocuklar, Gençler, Yetişkinler).
  **Sıra sayısı küçük olan üstte çıkar.**
- **Program formatı** — ana program / laboratuvar / atölye / kulüp / topluluk
- **Kısa tanım** — kartlarda görünen bir-iki cümle
- **SEO** — Google'da görünecek başlık ve açıklama

---

## İçerik bölümleri nasıl çalışır?

Program ve kurumsal sayfaların gövdesi **bloklardan** oluşur. "Bölüm ekle" deyip
tipini seçersiniz:

| Blok | Ne işe yarar |
|---|---|
| **Metin** | Başlık + bir veya daha fazla paragraf |
| **Kafka alıntısı** | Büyük, kırmızı çizgili vurgu cümlesi (sayfanın omurgası) |
| **Liste** | Madde veya numaralı liste; giriş ve kapanış metni eklenebilir |
| **Kartlar** | Başlık + açıklama ızgarası (örn. "Neyi önemsiyoruz?") |
| **Numaralı adımlar** | Sıralı süreç anlatımı (örn. Öğrenci Yolculuğu) |
| **Bilgi satırları** | Etiket / değer çiftleri (örn. "Eğitim grupları: Haftada 2 gün") |
| **Kenar notu** | Küçük, kırmızı çizgili açıklama kutusu |
| **Buton(lar)** | Sayfa içi yönlendirme |

Blokları sürükleyerek sıralarını değiştirebilirsiniz.

---

## Görsel eklemek

Görsel alanlarına tıklayıp dosya yükleyin. Yüklenen görseller `public/gorseller/`
klasörüne gider.

**Alt metni boş bırakmayın.** Alt metin, görseli göremeyen ziyaretçiler ve arama
motorları için görselin ne anlattığını yazar. Örnek: *"GÇT grubunda öğrenciler
felsefe çemberinde tartışıyor"*.

Görsel yoksa site, oraya hangi çekimin geleceğini yazan bir yer tutucu gösterir.
Bu bilinçli bir tasarımdır — sahte stok fotoğraf konulmaz.

---

## Dikkat edilecek kurallar

- **Eğitim programlarının ücreti sitede yayınlanmaz.** Ücret alanı yoktur.
  Tek istisna: Kafka International program sayfaları.
- **Kafka Kostüm kataloğunda fiyat alanı yoktur.** Fiyat WhatsApp üzerinden paylaşılır.
- **Öğrenci ve veli sözleri** yalnız gerçek, doğrulanmış ve izinliyse eklenir.
  Öğrencinin ağzına pazarlama cümlesi yazılmaz.
- **Çocuk üretimlerinde** varsayılan görünürlük "ad + yaş / program" biçimindedir;
  soyad kullanılmaz.
- **Sosyal sorumluluk projelerinde** "Yayın öncesi doğrulandı" kutusunu, tarih ve
  partner bilgisi teyit edilmeden işaretlemeyin.

---

## Bir şeyler ters giderse

Kaydettikten sonra sitede beklediğiniz değişikliği göremiyorsanız:

1. 1–2 dakika bekleyip sayfayı yenileyin (yeniden yayınlanması zaman alır)
2. Hâlâ yoksa, zorunlu bir alanı boş bırakmış olabilirsiniz — bu durumda yayınlama durur
3. Geliştiriciye haber verin; her değişiklik geri alınabilir durumda kayıtlıdır
