using NetTopologySuite.Geometries;

namespace DroneMarketplace.Domain.Entities
{
    public class Pilot : BaseEntity
    {
        public string AppUserId { get; private set; } = string.Empty;
        public AppUser? AppUser { get; private set; }

        public string? SHGMLicenseNumber { get; private set; }
        public string? Bio { get; private set; }
        public string? EquipmentList { get; private set; }
        public string? VerificationRejectionReason { get; private set; }

        public bool IsVerified { get; private set; } = false;

        public Point? Location { get; private set; }

        public ICollection<Listing> Listings { get; private set; } = new List<Listing>();
        public ICollection<Drone> Drones { get; private set; } = new List<Drone>();
        public ICollection<PilotAvailability> Availabilities { get; private set; } = new List<PilotAvailability>();

        // For EF Core
        protected Pilot() { }

        /// <summary>
        /// Factory method: creates a new unverified pilot profile attached to an existing AppUser.
        /// Verification occurs only after admin review via Verify().
        /// </summary>
        public static Pilot Create(string appUserId)
        {
            if (string.IsNullOrWhiteSpace(appUserId))
                throw new ArgumentException("Pilot için geçerli bir kullanıcı kimliği gereklidir.");

            return new Pilot
            {
                AppUserId = appUserId,
                IsVerified = false
            };
        }

        /// <summary>
        /// Updates the pilot's editable profile fields.
        /// A pilot can only update their own profile (enforced at service layer via userId).
        /// </summary>
        public void UpdateProfile(string? bio, string? equipmentList, string? shgmLicenseNumber, Point? location)
        {
            var previousLicenseNumber = NormalizeLicenseNumber(SHGMLicenseNumber);
            var nextLicenseNumber = NormalizeLicenseNumber(shgmLicenseNumber);

            Bio = bio;
            EquipmentList = equipmentList;
            SHGMLicenseNumber = nextLicenseNumber;
            Location = location;
            VerificationRejectionReason = null;

            // Verified pilots must be reviewed again if their license changes or is cleared.
            if (IsVerified && !string.Equals(previousLicenseNumber, nextLicenseNumber, StringComparison.OrdinalIgnoreCase))
            {
                IsVerified = false;
            }

            Touch();
        }

        /// <summary>
        /// Admin-only: Marks the pilot as verified. Requires a valid SHGM license number.
        /// </summary>
        public void Verify()
        {
            if (string.IsNullOrWhiteSpace(SHGMLicenseNumber))
                throw new InvalidOperationException("Pilot onaylanabilmesi için geçerli bir SHGM lisans numarası girilmiş olmalıdır.");

            IsVerified = true;
            VerificationRejectionReason = null;
            Touch();
        }

        /// <summary>
        /// Admin-only: Revokes pilot verification (e.g. license expired or suspended).
        /// </summary>
        public void RevokeVerification(string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                throw new ArgumentException("Doğrulama iptal sebebi boş bırakılamaz.");

            IsVerified = false;
            VerificationRejectionReason = reason.Trim();
            Touch();
        }

        private static string? NormalizeLicenseNumber(string? shgmLicenseNumber)
        {
            return string.IsNullOrWhiteSpace(shgmLicenseNumber)
                ? null
                : shgmLicenseNumber.Trim();
        }
    }
}
