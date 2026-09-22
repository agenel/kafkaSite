# Görsel Kaynakları ve İzin Durumu

`public/gorseller/` altındaki görseller kurumun **kendi Instagram hesaplarından**
indirildi. Üretilmiş veya stok görsel yoktur (§31).

| Klasör | Adet | Kaynak hesap | Kullanıldığı yer |
|---|---|---|---|
| `gorseller/kostum/` | 24 | @kafkakostum | Kafka Kostüm kataloğu ve ana sayfası |
| `gorseller/foto/` | 20 | @kafkasanatakademisi, @gaziantepcocuktiyatrosu, @katiyatro, @gaziantep.gencliktiyatrosu | Ana sayfa, 17 program sayfası, üretim kayıtları |

## Yayın öncesi yapılması gerekenler

### 1. Fotoğraf / video izni — **yayını bloke eder**

Belgenin §30 maddesi şunu söylüyor:

> Kayıt sırasında genel fotoğraf / video tercih izni alınır. **Öne çıkan, özel veya
> geniş kullanımlı yayınlarda ayrıca onay alınır.**

Bu görsellerin tamamında çocuk yüzü var. Instagram'da paylaşılmış olmaları, web
sitesinde — özellikle ana sayfa hero'sunda ve program sayfalarının üst görselinde —
kullanılmaları için verilmiş bir izin anlamına gelmez. Yayına çıkmadan önce
velilerden bu kullanım için ayrıca onay alınmalıdır.

Onay alınamayan görseller `src/content/` altındaki ilgili JSON dosyasından
`gorsel` alanı silinerek kaldırılır; yerini otomatik olarak çekim notu taşıyan
yer tutucu alır.

### 2. Teknik yeterlilik — kalite sınırı

Instagram kareleri şu slotlar için **yeterli değil**:

- **Ana sayfa hero videosu** (§32: 8–12 saniye yatay, sessiz, en az 6 farklı an)
- **21:9 geniş program banner'ları** — Instagram kaynakları en fazla 1400 px
- **Kafka International** — uluslararası program görüntüsü yok
- **Sosyal sorumluluk** — proje görüntüsü yok
- **Yoga ve Ahşap Oyma Atölyesi** — bu programlara ait fotoğraf bulunamadı
- **Kostüm kataloğunda "Tiyatro" kategorisi** — ayrı çekim yok

Bu slotlar bilinçli olarak yer tutucuda bırakıldı; her yer tutucu oraya hangi
çekimin geleceğini yazıyor. Gerçek çekim listesi: `cekim-listesi.md`.

### 3. Instagram akışının yapısı

İncelenen ~100 gönderinin yaklaşık %80'i tanıtım afişi, bayram görseli ve oyun
afişiydi. Belgesel nitelikte (doğal çalışma anı, prova, sahne) fotoğraf azdı.
Sitenin ihtiyacı olan görsel türü — §31'in deyişiyle *"gerçek Kafka öğrencileri
ve üretimleri, doğal çalışma anları"* — ayrı bir çekimle üretilmelidir.

## Görsel değiştirme

Bir görseli değiştirmek için CMS'ten ilgili kaydı açıp yeni dosya yükleyin, ya da
`public/gorseller/` altındaki dosyanın üzerine aynı adla yazın. Kod değişmez.
