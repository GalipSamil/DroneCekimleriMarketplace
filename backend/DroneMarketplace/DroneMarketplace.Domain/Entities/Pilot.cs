using NetTopologySuite.Geometries;



namespace DroneMarketplace.Domain.Entities
{
    public class Pilot : BaseEntity
    {
        // 1. Foreign Key: AppUser'ın Id'si (IdentityUser varsayılan olarak string Id kullan
        public string AppUserId { get; set; }


        public AppUser? AppUser { get; set; }


        // pilot özellikleri
        public string SHGMLicenseNumber { get; set; }
        public string Bio { get; set; }

        public string EquipmentList { get; set; }
        public bool IsVerified { get; set; } = false;   

        public Point Location { get; set; }


        public ICollection<Listing> Listings { get; set; } = new List<Listing>();
        public ICollection<Drone> Drones { get; set; } = new List<Drone>();
        public ICollection<PilotAvailability> Availabilities { get; set; } = new List<PilotAvailability>();
    }
}
