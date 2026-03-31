# Drone Çekimleri Marketplace

Drone Çekimleri Marketplace, drone pilotları ile drone çekimi hizmeti almak isteyen müşterileri bir araya getiren bir web platformudur. 

## Proje Yapısı
Bu proje iki ana kısımdan oluşmaktadır:
1. **Backend**: .NET Core (C#) ile geliştirilmiş güçlü bir REST API.
2. **Frontend**: React (TypeScript) ile geliştirilmiş modern, etkileşimli ve kullanıcı dostu bir arayüz.

## Backend Architecture Note
Backend tarafındaki mimari kurallar ve son refactor standardı için şu dokümana bakın:

- [Backend Architecture Note / Conventions](backend/DroneMarketplace/docs/backend-architecture-note.md)
- Controller, service ve domain entity sorumluluklarının nasıl ayrıldığını açıklar.
- Authorization, ownership ve actor-aware access kararlarının nerede kontrol edildiğini özetler.
- Public read vs managed read ayrımını, admin bypass sınırlarını ve test yaklaşımını kısa şekilde tanımlar.

## Özellikler
- **Kullanıcı Yönetimi**: Pilotlar ve müşteriler için ayrı kayıt/giriş (Authentication & Authorization).
- **Hizmet Listeleme**: Pilotların sunduğu hizmetleri listeleme ve düzenleyebilme özellikleri.
- **Rezervasyon Sistemi**: Müşterilerin drone hizmeti için randevu/rezervasyon oluşturabilmesi.
- **Mesajlaşma (Chat)**: Pilot ve müşteri arasındaki anlık iletişimi sağlayan mesajlaşma altyapısı (SignalR ile).
- **Değerlendirme ve İnceleme**: Hizmet sonrasında pilotlara puan ve yorum bırakılabilmesi.

## Nasıl Kurulur?

### Beklentiler (Prerequisites)
- [.NET 8.0 SDK veya daha güncel bir sürüm](https://dotnet.microsoft.com/)
- [Node.js (LTS sürümü tavsiye edilir)](https://nodejs.org/)
- [SQL Server veya uygun bir veritabanı]

### Backend'i Çalıştırmak (.NET Ana Dizini: `backend/`)
1. Backend dizinine gidin.
2. `appsettings.json` içerisindeki veritabanı bağlantı cümlenizi (`ConnectionStrings`) kontrol edip kendi yapınıza göre düzenleyin.
3. Terminalde şu komutları çalıştırarak veritabanı migration'larını uygulayın ve API'yi başlatın:
   ```bash
   dotnet ef database update
   dotnet run
   ```

### Frontend'i Çalıştırmak (Ana Dizin: `frontend/`)
1. Frontend klasörüne gidin: `cd frontend`
2. Bağımlılıkları yükleyin: `npm install` (veya `yarn install`)
3. Geliştirme sunucusunu başlatın: `npm run dev`

## İletişim & Katkı
Bu proje şu anda geliştirme aşamasındadır. Herhangi bir sorunuz veya katkınız için GitHub üzerinden iletişim kurabilir veya "Issue" oluşturabilirsiniz.
