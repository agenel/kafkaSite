# Fotoğraf ve Video Çekim Listesi

Kaynak: `KAFKA_WEB_SITE_FINAL.docx` §32.

Site şu anda tüm görsel alanlarını "Görsel bekleniyor" yer tutucusuyla gösteriyor.
Her yer tutucu, oraya hangi çekimin geleceğini yazıyor. Fotoğraflar geldiğinde
yalnız dosyalar yüklenir — kod değişmez.

**İki kural:**
- Stok fotoğraf kullanılmaz. Yalnız gerçek Kafka öğrencileri ve üretimleri.
- Yayınlanacak her görsel için fotoğraf/video izni bulunmalıdır (§30).

---

## Öncelik 1 — sitenin yayına çıkması için gerekli

### Hero (ana sayfa)
- 8–12 saniye yatay, **sessiz** video
- En az 6 farklı an: düşünme, yazı, hareket, kamera, prova, sahne
- Aynı anlardan 1 adet yatay kapak fotoğrafı (video yüklenene kadar kullanılır)

### Şubeler (Gaziantep + Güzelbahçe, ayrı ayrı)
- Dış cephe
- Giriş
- Ana çalışma alanları
- Mekan atmosferi

### Kurucular
- Haluk Uluçay — portre
- Erkut Aytekin — portre
- İkisi birlikte, doğal çalışma anı

---

## Öncelik 2 — amiral program sayfaları

### Sanata İlk Adım
- Doğal grup oyunu
- Hareket
- Hikaye anı
- Eğitmenin çocukla aynı seviyede etkileşimi
- **12–15 doğal fotoğraf · 3 kısa dikey video**

### GÇT — Eğitim Yılı
- Yaratıcı drama
- Felsefe çemberi
- Yazı
- Yaratıcı Keşifler
- Şan
- Dans
- Tiyatro

### GÇT — Üretim Yılı
- Masa başı
- Prova
- Tirat
- Sahne arkası
- Teknik süreç
- Final

### GGT Lab
- Kamera
- Işık
- Senaryo
- Yazı
- Performans
- Kurgu ekranı
- Ekip çalışması
- Set

### Sahne Modu
- Masa başı
- Blokaj
- Farklı prova evreleri
- Kulis
- Teknik prova
- Final oyun

### Kafka Akademi Tiyatrosu
- Eğitim grubu
- Masa başı
- Ensemble
- Prova
- Sahne
- Kulis
- Topluluk hissi

### Çocuk Korosu
- Prova
- Toplu nefes / ses
- Birlikte çalışma

---

## Öncelik 3 — ayrı yapılar

### Kafka International
- Gerçek uluslararası program görüntüleri
- Şehir / sanat kurumu / atölye / performans deneyimi
- **Turistik pozdan çok aktif deneyim**

### Kafka Kostüm
- Kostüm detayları
- Kumaş
- Hareket halinde kostüm
- Farklı koleksiyonlar
- Sahne ışığında görünüm
- **Katalog için temiz ürün çekimleri** (her koleksiyon için en az 1)

---

## Program görsel karakterleri (§31)

| Program | Karakter |
|---|---|
| Sanata İlk Adım | Yumuşak, sıcak, oyun ve hareket |
| GÇT | Canlı, yaratıcı, düşünce + grup + sahne |
| GGT Lab | Genç, dijital, sinematik, dinamik |
| Sahne Modu | Prova, sahne gerilimi, gerçek prodüksiyon |
| KAT | Olgun, tiyatral, yetişkin, topluluk |
| Kafka International | Dünya, şehir, sanat merkezi, hareket |
| Kafka Kostüm | Doku, kumaş, hareket, çocuk sahnesi, detay |
| Kafka kurumsal | Sakin, güvenilir, çağdaş kültür kurumu |

---

## Teslim biçimi

- **Fotoğraf:** JPG, kısa kenar en az 1600 px, sıkıştırılmamış hâli
- **Video:** MP4 (H.264), 1920×1080 veya üzeri, sesli çekilmiş olsa bile sessiz sürümü
- **Adlandırma:** `program-sube-konu-01.jpg` (örn. `gct-gaziantep-felsefe-cemberi-01.jpg`)
- Görseller `public/gorseller/` klasörüne yüklenir veya CMS üzerinden eklenir.
