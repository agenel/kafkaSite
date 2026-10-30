#!/usr/bin/env bash
# Başvuru formu PHP işleyicisinin uçtan uca testi.
# PHP'nin yerleşik sunucusunu dist/ üzerinde başlatır ve gerçek istek atar.
# Kullanım: npm run build && bash scripts/basvuru-php-test.sh
set -uo pipefail

PORT=8099
KAYNAK="https://kafkasanatakademisi.com"
UC="http://127.0.0.1:${PORT}/api/basvuru.php"

command -v php >/dev/null || { echo "PHP bulunamadı — test atlandı."; exit 0; }
[ -d dist ] || { echo "dist/ yok. Önce: npm run build"; exit 1; }

php -S "127.0.0.1:${PORT}" -t dist >/dev/null 2>&1 &
SUNUCU=$!
trap 'kill $SUNUCU 2>/dev/null' EXIT
sleep 1.5

gecerli='{"sehir":"Gaziantep","yas":"7 yas / 2. sinif","program":"GÇT","beklenti":"Deneme","ad":"Ayşe Yılmaz","telefon":"0505 614 47 67","onay":"on"}'

hata=0
dene() {
  local ad="$1" govde="$2" beklenen="$3" kaynak="${4:-$KAYNAK}"
  local kod
  kod=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$UC" \
        -H 'Content-Type: application/json' -H "Origin: ${kaynak}" -d "$govde")
  if [[ " $beklenen " == *" $kod "* ]]; then
    printf '  ✓ %-26s → %s\n' "$ad" "$kod"
  else
    printf '  ✗ %-26s → %s (beklenen %s)\n' "$ad" "$kod" "$beklenen"; hata=$((hata+1))
  fi
}

echo "Başvuru formu PHP testleri:"
# mail() CI'da yoktur: doğrulamayı geçen istek 200 ya da 502 döner, ikisi de kabul.
dene "geçerli başvuru"   "$gecerli" "200 502"
dene "eksik ad"          "$(echo "$gecerli" | sed 's/"ad":"Ayşe Yılmaz"/"ad":""/')" "400"
dene "geçersiz telefon"  "$(echo "$gecerli" | sed 's/"telefon":"0505 614 47 67"/"telefon":"123"/')" "400"
dene "geçersiz şehir"    "$(echo "$gecerli" | sed 's/"sehir":"Gaziantep"/"sehir":"Ankara"/')" "400"
dene "onay yok"          "$(echo "$gecerli" | sed 's/,"onay":"on"//')" "400"
dene "bot tuzağı dolu"   "$(echo "$gecerli" | sed 's/{/{"sirket":"spam",/')" "200"
dene "bozuk JSON"        "{bozuk"  "400"
dene "yabancı kaynak"    "$gecerli" "403" "https://kotu-site.com"

kod=$(curl -s -o /dev/null -w '%{http_code}' -X GET "$UC")
if [ "$kod" = "405" ]; then printf '  ✓ %-26s → 405\n' "GET reddi"; else printf '  ✗ %-26s → %s (beklenen 405)\n' "GET reddi" "$kod"; hata=$((hata+1)); fi

# Ayar dosyası dışarıdan okunamamalı (PHP yerleşik sunucusu .htaccess okumaz;
# bu kontrol gerçek Apache'de anlamlıdır, burada yalnız dosyanın varlığına bakılır)
[ -f public/api/basvuru-ayar.php ] && { echo "  ! basvuru-ayar.php depoda olmamalı"; hata=$((hata+1)); }

echo
[ $hata -eq 0 ] && echo "Tüm form testleri geçti." || echo "$hata test başarısız."
exit $hata
