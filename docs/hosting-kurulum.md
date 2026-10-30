# Hosting Kurulumu (FTP + Apache + PHP)

Site statik HTML olarak üretilir ve FTP ile paylaşımlı hosting'e yüklenir.
Tek sunucu tarafı parça başvuru formudur; o da PHP ile çalışır.

```
GitHub (kaynak + içerik)
   │  push veya CMS kaydı
   ▼
GitHub Actions — derler, test eder, FTP ile yükler
   ▼
Hosting /public_html/   ← site burada
```

---

## 1. GitHub secret'ları

**Settings → Secrets and variables → Actions → New repository secret**

| Ad | Örnek | Nereden |
|---|---|---|
| `FTP_SUNUCU` | `ftp.kafkasanatakademisi.com` | Hosting panelindeki FTP bilgileri |
| `FTP_KULLANICI` | `kafka@kafkasanatakademisi.com` | Aynı yer |
| `FTP_PAROLA` | — | Aynı yer |
| `FTP_DIZIN` | `/public_html/` | cPanel'de `public_html`, Plesk'te `httpdocs` |

Bunlar girilmeden dağıtım çalışmaz; CMS'ten yapılan değişiklikler siteye yansımaz.

> Dağıtım **FTPS** (şifreli FTP) kullanır. Hosting yalnız düz FTP destekliyorsa
> `.github/workflows/deploy-ftp.yml` içindeki `protocol: ftps` satırını `ftp`
> yapın — ama mümkünse sağlayıcıdan FTPS isteyin, parola düz FTP'de açık gider.

## 2. Form ayar dosyası

`docs/basvuru-ayar.ornek.php` dosyasını sunucuda **`api/basvuru-ayar.php`**
adıyla oluşturun ve doldurun. Bu dosya depoya girmez ve dağıtımda silinmez
(iş akışında `exclude` listesinde).

İçinde saklanan: alıcı adres, gönderici adres, izinli kaynak, hız sınırı.
`.htaccess` bu dosyayı dışarıdan okunamaz hâle getirir.

## 3. Gönderici e-posta

Hosting panelinden **`basvuru@kafkasanatakademisi.com`** adresini oluşturun.

Gönderici adresi alan adıyla aynı olmazsa e-postalar spam'e düşer. `mail()`
fonksiyonu sunucunun kendi posta sistemini kullanır; ayrı servis gerekmez.

> Gönderim sorunlu olursa SMTP'ye geçilebilir: panelden SMTP bilgilerini alıp
> `basvuru.php` içindeki `mail()` çağrısı PHPMailer ile değiştirilir.

## 4. İlk yükleme

```bash
npm ci
npm run build
```

`dist/` klasörünün **içeriğini** (klasörün kendisini değil) `public_html/`
altına kopyalayın. Gizli dosyaların da gitmesi gerekir — FTP istemcinizde
"gizli dosyaları göster" açık olmalı, özellikle **`.htaccess`**.

Sonraki yüklemeler otomatik olur.

## 5. Yükleme sonrası kontrol

- [ ] `https://kafkasanatakademisi.com` açılıyor
- [ ] `https://kafkasanatakademisi.com/programlar/gct` açılıyor — **sonunda eğik çizgi olmadan**
- [ ] Olmayan bir adres 404 sayfasını gösteriyor
- [ ] `http://` adresi `https://`'e yönleniyor
- [ ] `www.` adresi www'suz adrese yönleniyor
- [ ] Başvuru formu gönderiliyor ve e-posta ulaşıyor
- [ ] `https://kafkasanatakademisi.com/api/basvuru-ayar.php` **403 veriyor** (okunamıyor)
- [ ] `/admin` açılıyor ve PAT ile giriş yapılabiliyor
- [ ] WhatsApp ve harita bağlantıları mobilde çalışıyor

## Apache yapılandırması

`public/.htaccess` dosyası derlemeyle birlikte yüklenir ve şunları yapar:

| Ne | Neden |
|---|---|
| `DirectorySlash Off` + rewrite | Site "sondaki eğik çizgi yok" kuralıyla üretiliyor; Apache varsayılanı bunu bozardı |
| HTTPS ve www yönlendirmesi | Tek kanonik adres |
| `ErrorDocument 404` | Kendi 404 sayfamız |
| Sıkıştırma ve önbellek | HTML hep taze, varlıklar uzun ömürlü |
| Güvenlik başlıkları | nosniff, frame-deny, referrer policy |
| `basvuru-ayar*.php` erişim reddi | Ayar dosyası dışarıdan okunamaz |
| `Options -Indexes` | Dizin listelemesi kapalı |

Hosting `mod_rewrite` veya `mod_headers` desteklemiyorsa ilgili bloklar
sessizce atlanır (`<IfModule>` ile sarılı), site yine çalışır — yalnız temiz
adresler bozulur. O durumda sağlayıcıdan `mod_rewrite` isteyin.

## Cloudflare alternatifi

`worker/` klasöründeki Cloudflare Worker, formun bu kuruluma geçmeden önceki
hâlidir. FTP kurulumunda **kullanılmaz**; ileride Cloudflare Pages'e geçilirse
hazır durur. Mantığı `basvuru.php` ile aynıdır ve `npm test` ile test edilir.
