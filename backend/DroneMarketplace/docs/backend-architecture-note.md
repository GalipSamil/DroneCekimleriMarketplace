# Backend Architecture Note

Bu not, projede kullandigimiz `actor-aware authorization` ve katman sorumluluklari icin kisa takim standardidir.

## 1. Controller ne yapar?

- HTTP request/response orchestration yapar.
- Uygun `Authorize` policy kullanir.
- Gerekirse actor bilgisini `ICurrentUserService` uzerinden alir.
- Service cagirir, sonucu `ApiResponse` ile doner.
- Is kurali, ownership karari veya domain state degisimi yapmaz.

## 2. Service ne yapar?

- Use-case orchestration yapar.
- Repository, unit of work ve gerekli guard'lari kullanir.
- Actor-aware authorization kararini burada uygular.
- Ownership, moderation, public-vs-managed read ayrimini burada yonetir.
- DTO mapleme yapabilir.
- Controller'dan gelen ham `userId/isAdmin` daginikligini kabul etmeyiz; actor bilgisi merkezi olmalidir.

## 3. Domain entity ne yapar?

- Kendi state degisim kurallarini korur.
- Gecersiz state transition'lari engeller.
- `Create`, `Update`, `Verify`, `Activate`, `Accept`, `MarkAsRead` gibi davranislar entity icinde yasar.
- Salt data bag olmamaya calisir; ama tum business flow'u da tek basina tasimak zorunda degildir.

## 4. Authorization ve ownership nerede kontrol edilir?

- Policy bazli rol kontrolu controller seviyesinde baslar.
- Kaynak bazli access control ve ownership karari service/guard seviyesinde yapilir.
- Tekrar eden kurallar icin `*AccessGuard` siniflari kullanilir.
- Domain icindeki invariant ile service/guard icindeki access karari birbirini tamamlar.

## 5. Public read vs managed read nasil ayrilir?

- `Public read`: anonim veya genis erisimli, sadece guvenli alanlari donduren endpoint.
- `Managed read`: owner veya admin icin, yonetim detaylarini donduren endpoint.
- Ayni DTO ile her seyi donmek yerine gerekirse public DTO ve managed DTO ayrilir.
- Hassas alanlar public endpointten donulmez.

## 6. Admin bypass sinirlari nedir?

- Admin; dashboard, moderation, audit ve operasyonel override alanlarinda yetkili olabilir.
- Admin her zaman owner yerine gecmemelidir.
- Ozellikle owner-baslatmali akislarda admin bypass acmayiz:
  - booking create
  - listing create
  - drone create
  - review create/update
  - pilot profile icerik guncelleme
- Admin yetkisi gerekiyorsa acik ve dosya bazli olarak tanimli olmali, "admin her seyi yapar" mantigi default olmamalidir.

## 7. Testler neyi dogrular?

### Integration test

- Policy'lerin dogru calistigini
- Ownership ihlallerinin `403` verdigini
- Public ve managed endpoint ayriminin korundugunu
- Admin'in izinli oldugu ve olmadigi akislari
- Middleware'in exception-to-status-code mapping davranisini

### Domain unit test

- Entity invariant'larini
- State transition kurallarini
- Validation ve encapsulation davranisini

## 8. Uygulama kurali

Yeni bir modul veya endpoint eklerken su sorular net cevaplanmali:

1. Bu endpoint public mi, managed mi?
2. Owner kim?
3. Admin burada moderation mi yapiyor, yoksa owner yerine mi geciyor?
4. Access karari policy ile mi, guard ile mi, yoksa ikisi birlikte mi korunuyor?
5. Bu kural integration test ile kapsandi mi?

Bu sorular net degilse endpoint tamamlanmis sayilmaz.
