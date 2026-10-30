<?php
/**
 * Kafka Sanat Akademisi — başvuru formu işleyicisi.
 *
 * Paylaşımlı FTP hosting (Apache + PHP 7.4+) içindir.
 * Veri SAKLAMAZ; yalnız e-posta olarak iletir — KVKK yükü minimumda.
 *
 * Ayarlar bu dosyanın yanındaki basvuru-ayar.php dosyasından okunur.
 * O dosya depoya girmez (.gitignore'da); sunucuya elle yüklenir.
 */

declare(strict_types=1);

// ── Ayarlar ────────────────────────────────────────────────────
$ayarDosyasi = __DIR__ . '/basvuru-ayar.php';
$ayar = is_readable($ayarDosyasi) ? require $ayarDosyasi : [];

$ALICI        = $ayar['alici']        ?? 'kafkaakademi@gmail.com';
$GONDERICI    = $ayar['gonderici']    ?? 'basvuru@kafkasanatakademisi.com';
$IZINLI_KAYNAK = $ayar['izinliKaynak'] ?? 'https://kafkasanatakademisi.com';
$LIMIT_DAKIKA = (int) ($ayar['limitDakika'] ?? 10);  // aynı IP'den saatte en fazla

// ── Yardımcılar ────────────────────────────────────────────────
function yanit(array $govde, int $durum, string $kaynak): void
{
    http_response_code($durum);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . $kaynak);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($govde, JSON_UNESCAPED_UNICODE);
    exit;
}

function temizle($deger, int $sinir): string
{
    if (!is_string($deger)) {
        return '';
    }
    // Satır sonlarını at: e-posta başlığı enjeksiyonunu engeller
    $deger = str_replace(["\r", "\n", "\0"], ' ', $deger);
    $deger = trim($deger);
    return function_exists('mb_substr')
        ? mb_substr($deger, 0, $sinir)
        : substr($deger, 0, $sinir);
}

/** TR numarası: 10 hane (5 ile başlar), 11 hane (0 ile), 12 hane (90 ile). */
function telefonGecerli(string $ham): bool
{
    $d = preg_replace('/\D/', '', $ham);
    $u = strlen($d);
    if ($u === 10) return (bool) preg_match('/^[2-5]/', $d);
    if ($u === 11) return substr($d, 0, 1) === '0';
    if ($u === 12) return substr($d, 0, 2) === '90';
    return false;
}

/** Dosya tabanlı basit hız sınırı. KV/veritabanı gerektirmez. */
function hizSinirinaTakildi(string $ip, int $limit): bool
{
    $dizin = sys_get_temp_dir() . '/kafka-basvuru';
    if (!is_dir($dizin)) {
        @mkdir($dizin, 0700, true);
    }
    $dosya = $dizin . '/' . hash('sha256', $ip) . '.json';
    $simdi = time();
    $kayitlar = [];
    if (is_readable($dosya)) {
        $kayitlar = json_decode((string) file_get_contents($dosya), true) ?: [];
    }
    // Son bir saat
    $kayitlar = array_values(array_filter($kayitlar, static fn($t) => $simdi - $t < 3600));
    if (count($kayitlar) >= $limit) {
        return true;
    }
    $kayitlar[] = $simdi;
    @file_put_contents($dosya, json_encode($kayitlar), LOCK_EX);
    return false;
}

// ── İstek ──────────────────────────────────────────────────────
$kaynak = $_SERVER['HTTP_ORIGIN'] ?? '';
$izinliYanitKaynagi = ($kaynak === $IZINLI_KAYNAK) ? $kaynak : $IZINLI_KAYNAK;

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    yanit([], 204, $izinliYanitKaynagi);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    yanit(['hata' => 'Yöntem desteklenmiyor'], 405, $izinliYanitKaynagi);
}
// Formun yalnız kendi sitemizden gönderilmesi beklenir.
if ($kaynak !== '' && $kaynak !== $IZINLI_KAYNAK) {
    yanit(['hata' => 'Geçersiz kaynak'], 403, $izinliYanitKaynagi);
}

$govde = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($govde)) {
    yanit(['hata' => 'Geçersiz istek'], 400, $izinliYanitKaynagi);
}

// Bot tuzağı doluysa sessizce başarılı gibi dön — bota ipucu verme.
if (temizle($govde['sirket'] ?? null, 100) !== '') {
    yanit(['tamam' => true], 200, $izinliYanitKaynagi);
}

$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (hizSinirinaTakildi($ip, $LIMIT_DAKIKA)) {
    yanit(['hata' => 'Çok fazla deneme'], 429, $izinliYanitKaynagi);
}

$veri = [
    'sehir'    => temizle($govde['sehir']    ?? null, 40),
    'yas'      => temizle($govde['yas']      ?? null, 60),
    'program'  => temizle($govde['program']  ?? null, 120) ?: 'Henüz bilmiyorum',
    'beklenti' => temizle($govde['beklenti'] ?? null, 1200),
    'ad'       => temizle($govde['ad']       ?? null, 120),
    'telefon'  => temizle($govde['telefon']  ?? null, 30),
];

$eksik = array_values(array_filter(
    ['sehir', 'yas', 'ad', 'telefon'],
    static fn($a) => $veri[$a] === ''
));
if ($eksik !== []) {
    yanit(['hata' => 'Eksik alan', 'alanlar' => $eksik], 400, $izinliYanitKaynagi);
}
if (!in_array($veri['sehir'], ['Gaziantep', 'İzmir', 'Diğer'], true)) {
    yanit(['hata' => 'Geçersiz şehir'], 400, $izinliYanitKaynagi);
}
if (!telefonGecerli($veri['telefon'])) {
    yanit(['hata' => 'Geçersiz telefon'], 400, $izinliYanitKaynagi);
}
$onay = $govde['onay'] ?? null;
if ($onay !== 'on' && $onay !== true) {
    yanit(['hata' => 'Onay gerekli'], 400, $izinliYanitKaynagi);
}

// ── E-posta ────────────────────────────────────────────────────
$satirlar = [
    'Ad soyad'            => $veri['ad'],
    'Telefon'             => $veri['telefon'],
    'Şehir'               => $veri['sehir'],
    'Yaş / sınıf'         => $veri['yas'],
    'İlgilenilen program' => $veri['program'],
    'Kısa beklenti'       => $veri['beklenti'] !== '' ? $veri['beklenti'] : '—',
];

$k = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$tablo = '';
foreach ($satirlar as $etiket => $deger) {
    $tablo .= '<tr>'
        . '<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:40%;vertical-align:top">' . $k($etiket) . '</td>'
        . '<td style="padding:8px 0;border-bottom:1px solid #eee">' . $k($deger) . '</td>'
        . '</tr>';
}

$html = '<div style="font-family:system-ui,sans-serif;max-width:560px">'
    . '<h2 style="margin:0 0 4px">Yeni başvuru</h2>'
    . '<p style="margin:0 0 20px;color:#666">Kafka Sanat Akademisi · kafkasanatakademisi.com</p>'
    . '<table style="border-collapse:collapse;width:100%">' . $tablo . '</table>'
    . '<p style="margin-top:20px;color:#666;font-size:13px">'
    . 'Başvuru sahibine 1 iş günü içinde dönülmesi taahhüt edilmiştir.</p>'
    . '</div>';

$konu = sprintf('Başvuru · %s · %s · %s', $veri['ad'], $veri['sehir'], $veri['program']);

$basliklar = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Kafka Sanat Akademisi <' . $GONDERICI . '>',
    'Reply-To: ' . $ALICI,
    'X-Mailer: PHP/' . phpversion(),
]);

// Konu başlığını UTF-8 olarak kodla (Türkçe karakterler bozulmasın)
$konuKodlu = '=?UTF-8?B?' . base64_encode($konu) . '?=';

$gonderildi = @mail($ALICI, $konuKodlu, $html, $basliklar, '-f' . $GONDERICI);

if (!$gonderildi) {
    error_log('Kafka başvuru: mail() başarısız — ' . $veri['ad']);
    yanit(['hata' => 'Gönderilemedi'], 502, $izinliYanitKaynagi);
}

yanit(['tamam' => true], 200, $izinliYanitKaynagi);
