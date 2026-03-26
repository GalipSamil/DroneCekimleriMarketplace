using DroneMarket.Infrastructure.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetTopologySuite.Geometries;

namespace DroneMarket.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            try
            {
                if (await context.Listings.AnyAsync())
                {
                    return; // Data already seeded
                }
            }
            catch
            {
                // Tables might not exist yet, continue with seeding
            }

            // Create test users
            var pilot1 = new AppUser
            {
                UserName = "pilot1@test.com",
                Email = "pilot1@test.com",
                FirstName = "Ahmet",
                LastName = "Yılmaz",
                FullName = "Ahmet Yılmaz",
                EmailConfirmed = true
            };

            var pilot2 = new AppUser
            {
                UserName = "pilot2@test.com",
                Email = "pilot2@test.com",
                FirstName = "Mehmet",
                LastName = "Kaya",
                FullName = "Mehmet Kaya",
                EmailConfirmed = true
            };

            var customer1 = new AppUser
            {
                UserName = "customer1@test.com",
                Email = "customer1@test.com",
                FirstName = "Ayşe",
                LastName = "Demir",
                FullName = "Ayşe Demir",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(pilot1, "Test123!");
            await userManager.CreateAsync(pilot2, "Test123!");
            await userManager.CreateAsync(customer1, "Test123!");

            // Create pilot profiles
            var pilotProfile1 = new Pilot
            {
                AppUserId = pilot1.Id,
                Bio = "Profesyonel drone pilotu. 5 yıl deneyim, emlak ve düğün çekimlerinde uzman.",
                EquipmentList = "DJI Mavic 3 Pro, DJI Air 2S, DJI Mini 3, Gimbal, 4K Kamera",
                SHGMLicenseNumber = "TR-SHGM-12345",
                IsVerified = true,
                Location = new Point(28.9784, 41.0082) { SRID = 4326 } // Istanbul
            };

            var pilotProfile2 = new Pilot
            {
                AppUserId = pilot2.Id,
                Bio = "Deneyimli drone operatörü. İnşaat, tarım ve haritacılık projelerinde uzman.",
                EquipmentList = "DJI Phantom 4 RTK, DJI Matrice 300, Termal Kamera",
                SHGMLicenseNumber = "TR-SHGM-67890",
                IsVerified = true,
                Location = new Point(32.8597, 39.9334) { SRID = 4326 } // Ankara
            };

            context.Pilots.AddRange(pilotProfile1, pilotProfile2);
            await context.SaveChangesAsync();

            // Create listings
            var listings = new List<Listing>
            {
                new Listing
                {
                    PilotId = pilotProfile1.Id,
                    Title = "Emlak Fotoğraf ve Video Çekimi",
                    Description = "Profesyonel emlak pazarlama için 4K kalitede fotoğraf ve video çekimi. Drone ile havadan çekim, iç mekan çekimi ve sanal tur hizmeti.",
                    Category = ServiceCategory.RealEstate,
                    HourlyRate = 500,
                    DailyRate = 2000,
                    ProjectRate = 3500,
                    CoverImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
                    IsActive = true,
                    MaxDistance = 50,
                    RequiredEquipment = "DJI Mavic 3 Pro, 4K Kamera, Gimbal",
                    DeliverableFormat = "4K Video (MP4), RAW Fotoğraflar (DNG), Düzenlenmiş Fotoğraflar (JPG)"
                },
                new Listing
                {
                    PilotId = pilotProfile1.Id,
                    Title = "Düğün ve Etkinlik Çekimi",
                    Description = "Özel günlerinizi havadan çekerek unutulmaz anılar oluşturuyoruz. Düğün, nişan, doğum günü ve kurumsal etkinlikler için profesyonel hizmet.",
                    Category = ServiceCategory.Wedding,
                    HourlyRate = 750,
                    DailyRate = 3000,
                    ProjectRate = 5000,
                    CoverImageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
                    IsActive = true,
                    MaxDistance = 75,
                    RequiredEquipment = "DJI Air 2S, Ses Kayıt Ekipmanı",
                    DeliverableFormat = "4K Video Montaj, Highlight Video, Fotoğraf Albümü"
                },
                new Listing
                {
                    PilotId = pilotProfile2.Id,
                    Title = "İnşaat ve Yapı Denetimi",
                    Description = "İnşaat projelerinin havadan takibi, ilerleme raporları ve yapı denetimi. Termal kamera ile enerji verimliliği analizi.",
                    Category = ServiceCategory.Construction,
                    HourlyRate = 800,
                    DailyRate = 4000,
                    ProjectRate = 7500,
                    CoverImageUrl = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500",
                    IsActive = true,
                    MaxDistance = 100,
                    RequiredEquipment = "DJI Matrice 300, Termal Kamera, RTK Modülü",
                    DeliverableFormat = "Termal Görüntüler, 3D Harita, İlerleme Raporu"
                },
                new Listing
                {
                    PilotId = pilotProfile2.Id,
                    Title = "Tarımsal Haritacılık ve Analiz",
                    Description = "Tarım arazilerinin havadan haritalanması, bitki sağlığı analizi ve verim optimizasyonu için multispektral görüntüleme.",
                    Category = ServiceCategory.Agriculture,
                    HourlyRate = 600,
                    DailyRate = 2500,
                    ProjectRate = 4000,
                    CoverImageUrl = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
                    IsActive = true,
                    MaxDistance = 200,
                    RequiredEquipment = "DJI Phantom 4 RTK, Multispektral Kamera",
                    DeliverableFormat = "NDVI Haritası, Bitki Sağlığı Raporu, GPS Koordinatları"
                },
                new Listing
                {
                    PilotId = pilotProfile1.Id,
                    Title = "Sinema ve Reklam Çekimi",
                    Description = "Profesyonel sinema ve reklam projeleri için sinematik drone çekimi. Hollywood tarzı havadan görüntüler.",
                    Category = ServiceCategory.Cinematography,
                    HourlyRate = 1200,
                    DailyRate = 6000,
                    ProjectRate = 12000,
                    CoverImageUrl = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500",
                    IsActive = true,
                    MaxDistance = 25,
                    RequiredEquipment = "DJI Inspire 2, Cinema Kamera, Profesyonel Gimbal",
                    DeliverableFormat = "Cinema 4K (ProRes), Color Grading, Final Cut"
                }
            };

            context.Listings.AddRange(listings);
            await context.SaveChangesAsync();

            // Create some drones
            var drones = new List<Drone>
            {
                new Drone
                {
                    PilotId = pilotProfile1.Id,
                    Model = "Mavic 3 Pro",
                    Brand = "DJI",
                    Type = DroneType.Photography,
                    Specifications = "4/3 CMOS Hasselblad Kamera, 43 dakika uçuş süresi, 15km menzil",
                    IsAvailable = true,
                    Weight = 0.895m,
                    MaxFlightTime = 43,
                    ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300"
                },
                new Drone
                {
                    PilotId = pilotProfile2.Id,
                    Model = "Matrice 300 RTK",
                    Brand = "DJI",
                    Type = DroneType.Commercial,
                    Specifications = "IP45 koruma, 55 dakika uçuş, çoklu kamera desteği",
                    IsAvailable = true,
                    Weight = 6.3m,
                    MaxFlightTime = 55,
                    ImageUrl = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300"
                }
            };

            context.Drones.AddRange(drones);
            await context.SaveChangesAsync();
        }
    }
}