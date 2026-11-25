# UI Bileşen Envanteri

Bu doküman, `ai/zz-dev02-ui-components` branch'indeki frontend kaynak kodunda bulunan arayüz bileşenlerini listeler. Tarama, depoda izlenen tüm dosyaları ve özellikle `ARCHITECTURE.md`'de planlanan `apps/client/` konumunu kapsar.

## Tarama sonucu

**Bu branch'te henüz frontend kaynak kodu veya UI bileşeni yoktur.** Depoda `apps/client/` dizini bulunmaz; izlenen dosyalar arasında `.tsx`, `.jsx`, `.vue`, `.svelte` ya da arayüz içeren `.ts`/`.js` dosyası yoktur. `ARCHITECTURE.md`, React + Vite istemcisini ve `apps/client` dizinini gelecek yapı olarak tanımlar; bu yapı henüz çalışma ağacında mevcut değildir.

Bu nedenle aşağıdaki envanter boştur; bileşen yolu, amaç, props/arayüz ve kullanım yeri olan satır eklenmemiştir.

| Bileşen | Dosya yolu | Amaç | Temel props / arayüz | Kullanıldığı yerler |
| --- | --- | --- | --- | --- |
| _(yok)_ | _(yok)_ | _(yok)_ | _(yok)_ | _(yok)_ |

## Kaynak koddan doğrulananlar

- Tarama branch'i: `ai/zz-dev02-ui-components`
- Tarama anındaki HEAD: `321f7ac`
- Depoda izlenen dosyalar: `AGENTS.md`, `ARCHITECTURE.md`, `CODING_RULES.md`, `Jenkinsfile`, `README.md`, `RULES.md`
- `apps/client/src/`: mevcut değil
- Uygulanmış UI bileşeni sayısı: 0

## Planlanan arayüz sorumlulukları (henüz uygulanmadı)

Aşağıdaki maddeler `ARCHITECTURE.md`'nin "Client" bölümündeki gereksinimlerden gelir ve **mevcut bileşen** olarak sayılmaz:

- Tahta, pullar, zarlar ve skorun çizilmesi.
- Oyuncunun hamle seçimi; yasal hamlelerin vurgulanması ve önizleme.
- Seçilen hamleleri sunucuya gönderme ve sunucu yanıtını gösterme.
- Hapis pullarının renk dışında bir işaretle de gösterilmesi.
- Türkçe ve İngilizce arayüz desteği.

Bu doküman yalnızca envanter amaçlıdır; kod davranışını değiştirmez. Frontend kaynak kodu eklendiğinde tablo, her bileşen için dosya yolu, amacı, props/arayüzü ve kullanıldığı yerlerle güncellenmelidir.
