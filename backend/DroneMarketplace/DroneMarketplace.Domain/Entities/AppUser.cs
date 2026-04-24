using Microsoft.AspNetCore.Identity;
using System;

namespace DroneMarketplace.Domain.Entities
{
    public class AppUser : IdentityUser 
    {
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public string FullName { get; private set; } = string.Empty;
        public string? ProfilePictureUrl { get; private set; }

        public Pilot? PilotProfile { get; private set; }

        // Needs parameterless constructor for EF Core
        protected AppUser() { }

        public static AppUser Create(string email, string fullName)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email cannot be empty.");
            if (string.IsNullOrWhiteSpace(fullName)) throw new ArgumentException("FullName cannot be empty.");

            var names = fullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            
            return new AppUser
            {
                UserName = email,
                Email = email,
                FullName = fullName,
                FirstName = names.Length > 0 ? names[0] : "",
                LastName = names.Length > 1 ? names[1] : ""
            };
        }

        public void UpdateProfilePicture(string? url)
        {
            ProfilePictureUrl = string.IsNullOrWhiteSpace(url) ? null : url.Trim();
        }
    }
}
