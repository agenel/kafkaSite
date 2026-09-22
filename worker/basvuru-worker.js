/**
 * Kafka Sanat Akademisi — başvuru formu backend'i.
 * Cloudflare Worker. Veri SAKLAMAZ; yalnız e-posta olarak iletir (KVKK yükü minimumda).
 *
 * Gerekli ortam değişkenleri (Cloudflare panelinden secret olarak):
 *   RESEND_API_KEY   — e-posta gönderimi için
 *   ALICI_EPOSTA     — kafkaakademi@gmail.com
 *   GONDERICI_EPOSTA — doğrulanmış gönderici, örn. basvuru@kafkasanatakademisi.com
 *   TURNSTILE_SECRET — (opsiyonel) Cloudflare Turnstile gizli anahtarı
 *   IZINLI_KAYNAK    — https://kafkasanatakademisi.com
 */

const ALAN_SINIRI = {
  sehir: 40,
  yas: 60,
  program: 120,
  beklenti: 1200,
  ad: 120,
  telefon: 30,
};

const GECERLI_SEHIRLER = ['Gaziantep', 'İzmir', 'Diğer'];

function temizle(deger, sinir) {
  if (typeof deger !== 'string') return '';
  return deger.trim().slice(0, sinir);
}

function telefonGecerli(ham) {
  const rakam = String(ham).replace(/\D/g, '');
  if (rakam.length === 10) return /^[2-5]/.test(rakam);
  if (rakam.length === 11) return rakam.startsWith('0');
  if (rakam.length === 12) return rakam.startsWith('90');
  return false;
}

function kacisliHtml(metin) {
  return String(metin).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function yanit(govde, durum, kaynak) {
  return new Response(JSON.stringify(govde), {
    status: durum,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': kaynak,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}

async function turnstileDogrula(token, gizli, ip) {
  const form = new FormData();
  form.append('secret', gizli);
  form.append('response', token ?? '');
  if (ip) form.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const j = await r.json();
  return j.success === true;
}

export default {
  async fetch(request, env) {
    const izinliKaynak = env.IZINLI_KAYNAK ?? '*';

    if (request.method === 'OPTIONS') {
      return yanit({}, 204, izinliKaynak);
    }
    if (request.method !== 'POST') {
      return yanit({ hata: 'Yöntem desteklenmiyor' }, 405, izinliKaynak);
    }

    // Kaynak kontrolü — formun yalnız kendi sitemizden gönderilmesi beklenir.
    const origin = request.headers.get('Origin');
    if (env.IZINLI_KAYNAK && origin && origin !== env.IZINLI_KAYNAK) {
      return yanit({ hata: 'Geçersiz kaynak' }, 403, izinliKaynak);
    }

    let govde;
    try {
      govde = await request.json();
    } catch {
      return yanit({ hata: 'Geçersiz istek' }, 400, izinliKaynak);
    }

    // Bot tuzağı doluysa sessizce başarılı gibi dön — bota ipucu verme.
    if (temizle(govde.sirket, 100)) {
      return yanit({ tamam: true }, 200, izinliKaynak);
    }

    if (env.TURNSTILE_SECRET) {
      const ip = request.headers.get('CF-Connecting-IP');
      const gecerli = await turnstileDogrula(govde['cf-turnstile-response'], env.TURNSTILE_SECRET, ip);
      if (!gecerli) {
        return yanit({ hata: 'Doğrulama başarısız' }, 403, izinliKaynak);
      }
    }

    const veri = {
      sehir: temizle(govde.sehir, ALAN_SINIRI.sehir),
      yas: temizle(govde.yas, ALAN_SINIRI.yas),
      program: temizle(govde.program, ALAN_SINIRI.program) || 'Henüz bilmiyorum',
      beklenti: temizle(govde.beklenti, ALAN_SINIRI.beklenti),
      ad: temizle(govde.ad, ALAN_SINIRI.ad),
      telefon: temizle(govde.telefon, ALAN_SINIRI.telefon),
    };

    const eksik = ['sehir', 'yas', 'ad', 'telefon'].filter((a) => !veri[a]);
    if (eksik.length > 0) {
      return yanit({ hata: 'Eksik alan', alanlar: eksik }, 400, izinliKaynak);
    }
    if (!GECERLI_SEHIRLER.includes(veri.sehir)) {
      return yanit({ hata: 'Geçersiz şehir' }, 400, izinliKaynak);
    }
    if (!telefonGecerli(veri.telefon)) {
      return yanit({ hata: 'Geçersiz telefon' }, 400, izinliKaynak);
    }
    if (govde.onay !== 'on' && govde.onay !== true) {
      return yanit({ hata: 'Onay gerekli' }, 400, izinliKaynak);
    }

    const satirlar = [
      ['Ad soyad', veri.ad],
      ['Telefon', veri.telefon],
      ['Şehir', veri.sehir],
      ['Yaş / sınıf', veri.yas],
      ['İlgilenilen program', veri.program],
      ['Kısa beklenti', veri.beklenti || '—'],
    ];

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px">Yeni başvuru</h2>
        <p style="margin:0 0 20px;color:#666">Kafka Sanat Akademisi · kafkasanatakademisi.com</p>
        <table style="border-collapse:collapse;width:100%">
          ${satirlar
            .map(
              ([e, d]) =>
                `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:40%;vertical-align:top">${kacisliHtml(
                  e
                )}</td><td style="padding:8px 0;border-bottom:1px solid #eee">${kacisliHtml(d)}</td></tr>`
            )
            .join('')}
        </table>
        <p style="margin-top:20px;color:#666;font-size:13px">
          Başvuru sahibine 1 iş günü içinde dönülmesi taahhüt edilmiştir.
        </p>
      </div>`;

    const duzMetin = satirlar.map(([e, d]) => `${e}: ${d}`).join('\n');

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.GONDERICI_EPOSTA,
          to: [env.ALICI_EPOSTA],
          subject: `Başvuru · ${veri.ad} · ${veri.sehir} · ${veri.program}`,
          html,
          text: duzMetin,
          reply_to: env.ALICI_EPOSTA,
        }),
      });
      if (!r.ok) {
        console.error('E-posta gönderilemedi', r.status, await r.text());
        return yanit({ hata: 'Gönderilemedi' }, 502, izinliKaynak);
      }
    } catch (e) {
      console.error('E-posta isteği başarısız', e);
      return yanit({ hata: 'Gönderilemedi' }, 502, izinliKaynak);
    }

    return yanit({ tamam: true }, 200, izinliKaynak);
  },
};
