<?php
/**
 * Bu dosyayı sunucuda "basvuru-ayar.php" adıyla kopyalayıp doldurun.
 * Depoya girmez — gerçek adresler ve ayarlar burada durur.
 */
return [
    // Başvuruların düşeceği adres
    'alici' => 'kafkaakademi@gmail.com',

    // Gönderici: alan adıyla aynı olmalı, yoksa e-postalar spam'e düşer.
    // Hosting panelinden bu adresi oluşturun.
    'gonderici' => 'basvuru@kafkasanatakademisi.com',

    // Formun gönderilebileceği tek kaynak
    'izinliKaynak' => 'https://kafkasanatakademisi.com',

    // Aynı IP'den saatte en fazla kaç başvuru
    'limitDakika' => 10,
];
