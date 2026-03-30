using DroneMarket.Infrastructure.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            var adminEmail = configuration["AdminSettings:Email"];
            var adminPassword = configuration["AdminSettings:Password"];

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            try
            {
                if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
                {
                    var adminExists = await userManager.FindByEmailAsync(adminEmail);
                    if (adminExists == null)
                    {
                        var adminUser = AppUser.Create(adminEmail, "SkyMarket Admin");
                        adminUser.EmailConfirmed = true;
                        await userManager.CreateAsync(adminUser, adminPassword);
                    }
                    else
                    {
                        var token = await userManager.GeneratePasswordResetTokenAsync(adminExists);
                        await userManager.ResetPasswordAsync(adminExists, token, adminPassword);
                    }
                }

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
            var pilot1 = AppUser.Create("pilot1@test.com", "Ahmet Yılmaz");
            pilot1.EmailConfirmed = true;

            var pilot2 = AppUser.Create("pilot2@test.com", "Mehmet Kaya");
            pilot2.EmailConfirmed = true;

            var customer1 = AppUser.Create("customer1@test.com", "Ayşe Demir");
            customer1.EmailConfirmed = true;

            await userManager.CreateAsync(pilot1, "Test123!");
            await userManager.CreateAsync(pilot2, "Test123!");
            await userManager.CreateAsync(customer1, "Test123!");

            // Create pilot profiles using domain factory
            var pilotProfile1 = Pilot.Create(pilot1.Id);
            pilotProfile1.UpdateProfile(
                bio: "Profesyonel drone pilotu. 5 yıl deneyim, emlak ve düğün çekimlerinde uzman.",
                equipmentList: "DJI Mavic 3 Pro, DJI Air 2S, DJI Mini 3, Gimbal, 4K Kamera",
                shgmLicenseNumber: "TR-SHGM-12345",
                location: new Point(28.9784, 41.0082) { SRID = 4326 } // Istanbul
            );
            pilotProfile1.Verify();

            var pilotProfile2 = Pilot.Create(pilot2.Id);
            pilotProfile2.UpdateProfile(
                bio: "Deneyimli drone operatörü. İnşaat, tarım ve haritacılık projelerinde uzman.",
                equipmentList: "DJI Phantom 4 RTK, DJI Matrice 300, Termal Kamera",
                shgmLicenseNumber: "TR-SHGM-67890",
                location: new Point(32.8597, 39.9334) { SRID = 4326 } // Ankara
            );
            pilotProfile2.Verify();

            context.Pilots.AddRange(pilotProfile1, pilotProfile2);
            await context.SaveChangesAsync();

            // Create listings
            var listing1 = Listing.Create(
                pilotId: pilotProfile1.Id,
                title: "Emlak Fotoğraf ve Video Çekimi",
                description: "Profesyonel emlak pazarlama için 4K kalitede fotoğraf ve video çekimi. Drone ile havadan çekim, iç mekan çekimi ve sanal tur hizmeti.",
                category: ServiceCategory.RealEstate,
                hourlyRate: 500,
                dailyRate: 2000,
                projectRate: 3500,
                coverImageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
                maxDistance: 50,
                requiredEquipment: "DJI Mavic 3 Pro, 4K Kamera, Gimbal",
                deliverableFormat: "4K Video (MP4), RAW Fotoğraflar (DNG), Düzenlenmiş Fotoğraflar (JPG)"
            );
            listing1.Activate();

            var listing2 = Listing.Create(
                pilotId: pilotProfile1.Id,
                title: "Düğün ve Etkinlik Çekimi",
                description: "Özel günlerinizi havadan çekerek unutulmaz anılar oluşturuyoruz. Düğün, nişan, doğum günü ve kurumsal etkinlikler için profesyonel hizmet.",
                category: ServiceCategory.Wedding,
                hourlyRate: 750,
                dailyRate: 3000,
                projectRate: 5000,
                coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
                maxDistance: 75,
                requiredEquipment: "DJI Air 2S, Ses Kayıt Ekipmanı",
                deliverableFormat: "4K Video Montaj, Highlight Video, Fotoğraf Albümü"
            );
            listing2.Activate();

            var listing3 = Listing.Create(
                pilotId: pilotProfile2.Id,
                title: "İnşaat ve Yapı Denetimi",
                description: "İnşaat projelerinin havadan takibi, ilerleme raporları ve yapı denetimi. Termal kamera ile enerji verimliliği analizi.",
                category: ServiceCategory.Construction,
                hourlyRate: 800,
                dailyRate: 4000,
                projectRate: 7500,
                coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500",
                maxDistance: 100,
                requiredEquipment: "DJI Matrice 300, Termal Kamera, RTK Modülü",
                deliverableFormat: "Termal Görüntüler, 3D Harita, İlerleme Raporu"
            );
            listing3.Activate();

            var listing4 = Listing.Create(
                pilotId: pilotProfile2.Id,
                title: "Tarımsal Haritacılık ve Analiz",
                description: "Tarım arazilerinin havadan haritalanması, bitki sağlığı analizi ve verim optimizasyonu için multispektral görüntüleme.",
                category: ServiceCategory.Agriculture,
                hourlyRate: 600,
                dailyRate: 2500,
                projectRate: 4000,
                coverImageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
                maxDistance: 200,
                requiredEquipment: "DJI Phantom 4 RTK, Multispektral Kamera",
                deliverableFormat: "NDVI Haritası, Bitki Sağlığı Raporu, GPS Koordinatları"
            );
            listing4.Activate();

            var listing5 = Listing.Create(
                pilotId: pilotProfile1.Id,
                title: "Sinema ve Reklam Çekimi",
                description: "Profesyonel sinema ve reklam projeleri için sinematik drone çekimi. Hollywood tarzı havadan görüntüler.",
                category: ServiceCategory.Cinematography,
                hourlyRate: 1200,
                dailyRate: 6000,
                projectRate: 12000,
                coverImageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500",
                maxDistance: 25,
                requiredEquipment: "DJI Inspire 2, Cinema Kamera, Profesyonel Gimbal",
                deliverableFormat: "Cinema 4K (ProRes), Color Grading, Final Cut"
            );
            listing5.Activate();

            var listings = new List<Listing> { listing1, listing2, listing3, listing4, listing5 };

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