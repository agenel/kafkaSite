/**
 * Kurumsal tek kaynak.
 * Telefon, e-posta, sosyal hesap ve CTA metinleri YALNIZ burada tanımlanır.
 * Sayfalarda elle yazılmaz — §36 kontrol listesi bu bilgilerin doğruluğunu denetliyor.
 */

export const site = {
  ad: 'Kafka Sanat Akademisi',
  slogan: 'Düşün. İfade et. Üret.',
  pedagojikCumle: 'Biz sanatçı yetiştirmeden önce insan yetiştiriyoruz.',
  dusunselHafiza: 'Her şey başka türlü de düşünülebilir.',
  kurulus: 2017,
  kurulusYeri: 'Gaziantep',
  url: 'https://kafkasanatakademisi.com',
  eposta: 'kafkaakademi@gmail.com',
  varsayilanAciklama:
    'Sanat, düşünce ve üretimi bir araya getiren disiplinlerarası programlar. Okul öncesi, çocuklar, gençler ve yetişkinler için Kafka Sanat Akademisi.',
} as const;

export const kurucular = [
  {
    ad: 'Haluk Uluçay',
    unvan: 'Kurucu Ortak · Eğitim Direktörü',
    sorumluluk: 'Kafka Sanat Akademisi Gaziantep Şube Sorumlusu',
    sube: 'gaziantep',
  },
  {
    ad: 'Erkut Aytekin',
    unvan: 'Kurucu Ortak · Genel Sanat Yönetmeni',
    sorumluluk: 'Kafka Sanat Akademisi Güzelbahçe Şube Sorumlusu',
    sube: 'izmir',
  },
] as const;

/** Kafka International ve Kafka Kostüm iletişimi bu kişi üzerinden yürür (§36). */
export const yapiSorumlusu = {
  ad: 'Özlem Demireli',
  telefon: '+90 536 433 43 08',
  eposta: 'kafkaakademi@gmail.com',
} as const;

export type SubeKodu = 'gaziantep' | 'izmir';

export const cta = {
  basvuru: 'Başvuru Yap',
  programlariKesfet: 'Programları Keşfet',
  programiIncele: 'Programı İncele',
  yaklasimiOku: 'Yaklaşımımızı Oku',
  yolculuguGor: 'Öğrenci Yolculuğunu Gör',
  uretimleriKesfet: 'Üretimleri Keşfet',
  bizeUlasin: 'Bize Ulaşın',
  whatsappBilgi: "WhatsApp'tan Bilgi Al",
  whatsappSor: "WhatsApp'tan Sor",
  katalogIncele: 'Kataloğu İncele',
  gctModeliniGor: 'GÇT Modelini Gör',
  ggtLabKesfet: "GGT Lab'i Keşfet",
  velilerIcin: 'Veliler İçin Kafka',
  hikaye: "Kafka'nın Hikayesi",
} as const;

/**
 * Telefonu WhatsApp'ın beklediği uluslararası biçime indirger.
 * Hem "+90 505 614 47 67" hem "0505 614 47 67" hem "505 614 47 67" kabul edilir;
 * hepsi 905056144767 olur. Böylece CMS'e hangi biçimde girilirse girilsin
 * WhatsApp ve arama bağlantıları bozulmaz.
 */
export function waNumber(telefon: string): string {
  let d = telefon.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 10 && d.startsWith('5')) return `90${d}`;
  if (d.length === 11 && d.startsWith('0')) return `90${d.slice(1)}`;
  if (d.length === 12 && d.startsWith('90')) return d;
  if (d.length === 13 && d.startsWith('090')) return `90${d.slice(3)}`;
  return d;
}

/** Ön tanımlı mesajla WhatsApp derin bağlantısı üretir. */
export function waLink(telefon: string, mesaj?: string): string {
  const base = `https://wa.me/${waNumber(telefon)}`;
  return mesaj ? `${base}?text=${encodeURIComponent(mesaj)}` : base;
}

export function telLink(telefon: string): string {
  return `tel:+${waNumber(telefon)}`;
}

export const sosyal = {
  gaziantepAna: 'kafkasanatakademisi',
  izmirAna: 'kafkasanatakademisi.izmir',
  gaziantepCocukTiyatrosu: 'gaziantepcocuktiyatrosu',
  gaziantepGenclikTiyatrosu: 'gaziantep.gencliktiyatrosu',
  guzelbahceCocukTiyatrosu: 'guzelbahcecocuktiyatrosu',
  kitapKulubu: 'kafka.kitapkulubu',
  sinemaKulubu: 'kafka.sinemakulubu',
  kat: 'katiyatro',
  guzelbahceAtolye: 'kafkasanat.atolyee',
  kostum: 'kafkakostum',
} as const;

export const instagramUrl = (hesap: string) => `https://instagram.com/${hesap}`;

/** Ana navigasyon (§03). */
export const navigasyon = [
  {
    etiket: 'Programlar',
    href: '/programlar',
    alt: [
      { etiket: 'Okul Öncesi', href: '/programlar/okul-oncesi' },
      { etiket: 'Çocuklar', href: '/programlar/cocuklar' },
      { etiket: 'Gençler', href: '/programlar/gencler' },
      { etiket: 'Yetişkinler', href: '/programlar/yetiskinler' },
    ],
  },
  { etiket: 'Kafka International', href: '/kafka-international' },
  { etiket: 'Kafka Kostüm', href: '/kafka-kostum' },
  { etiket: 'Ürettiklerimiz', href: '/urettiklerimiz' },
  {
    etiket: 'Kafka',
    href: '/kafka/hikayemiz',
    alt: [
      { etiket: 'Yaklaşımımız', href: '/yaklasimimiz' },
      { etiket: 'Hikayemiz', href: '/kafka/hikayemiz' },
      { etiket: 'Öğrenci Yolculuğu', href: '/ogrenci-yolculugu' },
      { etiket: 'Veliler İçin', href: '/veliler-icin' },
      { etiket: 'Şubeler', href: '/kafka/subeler' },
      { etiket: 'Sosyal Sorumluluk', href: '/kafka/sosyal-sorumluluk' },
    ],
  },
  { etiket: 'İletişim', href: '/iletisim' },
] as const;

/** Footer (§29). */
export const footerGruplari = [
  {
    baslik: 'Programlar',
    baglantilar: [
      { etiket: 'Okul Öncesi', href: '/programlar/okul-oncesi' },
      { etiket: 'Çocuklar', href: '/programlar/cocuklar' },
      { etiket: 'Gençler', href: '/programlar/gencler' },
      { etiket: 'Yetişkinler', href: '/programlar/yetiskinler' },
    ],
  },
  {
    baslik: 'Kafka',
    baglantilar: [
      { etiket: 'Yaklaşımımız', href: '/yaklasimimiz' },
      { etiket: 'Öğrenci Yolculuğu', href: '/ogrenci-yolculugu' },
      { etiket: 'Ürettiklerimiz', href: '/urettiklerimiz' },
      { etiket: 'Hikayemiz', href: '/kafka/hikayemiz' },
      { etiket: 'Şubeler', href: '/kafka/subeler' },
      { etiket: 'Sosyal Sorumluluk', href: '/kafka/sosyal-sorumluluk' },
    ],
  },
  {
    baslik: 'Diğer yapılar',
    baglantilar: [
      { etiket: 'Kafka International', href: '/kafka-international' },
      { etiket: 'Kafka Kostüm', href: '/kafka-kostum' },
    ],
  },
  {
    baslik: 'Ulaşın',
    baglantilar: [
      { etiket: 'Gaziantep', href: '/gaziantep' },
      { etiket: 'İzmir', href: '/izmir' },
      { etiket: 'İletişim', href: '/iletisim' },
      { etiket: 'Başvuru Yap', href: '/basvuru' },
    ],
  },
  {
    baslik: 'Yasal',
    baglantilar: [
      { etiket: 'KVKK', href: '/yasal/kvkk' },
      { etiket: 'Gizlilik', href: '/yasal/gizlilik' },
      { etiket: 'Çerez', href: '/yasal/cerez' },
      { etiket: 'Fotoğraf / Video İzni', href: '/yasal/foto-video-izin' },
    ],
  },
] as const;

/** Yaş çatısı (§03) — sıralama sabittir. */
export const yasCatilari = [
  { kod: 'okul-oncesi', etiket: 'Okul Öncesi', href: '/programlar/okul-oncesi' },
  { kod: 'cocuklar', etiket: 'Çocuklar', href: '/programlar/cocuklar' },
  { kod: 'gencler', etiket: 'Gençler', href: '/programlar/gencler' },
  { kod: 'yetiskinler', etiket: 'Yetişkinler', href: '/programlar/yetiskinler' },
] as const;

export const programDurumEtiketi = {
  'basvurular-acik': 'Başvurular Açık',
  dolu: 'Dolu',
  'bekleme-listesi': 'Bekleme Listesi',
  yakinda: 'Yakında',
  'bu-subede-acik-degil': 'Bu Şubede Açık Değil',
} as const;
