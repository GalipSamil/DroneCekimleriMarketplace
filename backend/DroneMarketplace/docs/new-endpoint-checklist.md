# New Endpoint Checklist

Bu checklist, yeni bir endpoint eklerken proje standardini korumak icin kullanilir. Endpoint tasarlarken, implement ederken ve PR acmadan once hizli kontrol listesi olarak bakilmalidir. `Backend Architecture Note` genel kurali anlatir; bu dokuman ise gunluk gelistirmede "tamam mi, eksik mi?" kontrolu icindir.

## Endpoint Checklist

- [ ] Bu endpoint tipi net mi: `public`, `managed` veya `admin`?
- [ ] Uygun `Authorize` policy tanimli mi ve dogru yerde kullanildi mi?
- [ ] Controller ince mi; sadece HTTP orchestration yapiyor mu?
- [ ] Actor bilgisi controller icinde daginik claim okuma ile degil, `ICurrentUserService` / `ActorContext` standardi ile mi kullaniliyor?
- [ ] Ownership veya access karari gerekiyorsa bu karar service/guard katmaninda mi veriliyor?
- [ ] `*AccessGuard` benzeri ortak kural cikarmak gerekiyor mu?
- [ ] Admin bypass var mi? Varsa gercekten gerekli mi?
- [ ] Admin owner yerine geciyor mu? Geciyorsa bu bilincli bir urun karari mi?
- [ ] `public read` ve `managed read` ayrimi gerekiyor mu?
- [ ] Gerekliyse `public DTO` ve `managed DTO` ayrildi mi?
- [ ] Hassas alanlar public response'ta donulmuyor mu?
- [ ] Domain invariant veya state transition entity icinde korunuyor mu?
- [ ] Service icinde query + authorization + mapping asiri karismis mi?
- [ ] Repository veya query abstraction gerekiyorsa eklendi mi?
- [ ] Basarisiz access durumunda dogru exception/status code akisi var mi?
- [ ] En az bir integration test ile policy/ownership davranisi dogrulandi mi?
- [ ] Gerekiyorsa domain unit test ile invariant veya behavior dogrulandi mi?
- [ ] `403`, `404`, `400` gibi beklenen durumlar testte net mi?
- [ ] Nullable, warning ve build etkisi kontrol edildi mi?

## PR Oncesi Kisa Kontrol

- [ ] `dotnet build` gecti mi?
- [ ] Ilgili domain/unit testler gecti mi?
- [ ] Ilgili integration testler gecti mi?
- [ ] Yeni endpoint mevcut authorization/ownership standardina uyuyor mu?
- [ ] Gerekliyse README veya docs guncellendi mi?

## Kullanim Notu

- Bu dokuman `backend/DroneMarketplace/docs/` altinda durmali.
- `Backend Architecture Note` icinden linklenmesi iyi olur; cunku biri kuralin aciklamasini, digeri pratik kontrol listesini verir.
- README'den de tek satirlik link verilirse yeni gelen developer daha kolay bulur.
- Dokuman kisa kalmali; madde listesi disina tasan uzun aciklamalar architecture note'a gitmelidir.
