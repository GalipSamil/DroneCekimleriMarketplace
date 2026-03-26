using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace DroneMarketplace.Domain.Entities
{
    public class AppUser : IdentityUser 
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }

        public string? ProfilePictureUrl { get; set; }


        // 1 e 1 ilişki : bir kullanıcının ya Pilot profili vardır ya da yoktur
        // bu ilişkiyi kurmak için Pilot.cs dosyasına geri navigasyon ekleyelim

        public Pilot? PilotProfile { get; set; }
    }
}
