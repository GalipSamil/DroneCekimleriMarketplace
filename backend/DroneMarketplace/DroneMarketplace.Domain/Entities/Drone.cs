namespace DroneMarketplace.Domain.Entities
{
    public class Drone : BaseEntity
    {
        public Guid PilotId { get; set; }
        public Pilot Pilot { get; set; }

        public string Model { get; set; }
        public string Brand { get; set; }
        public DroneType Type { get; set; }
        public string Specifications { get; set; }
        public bool IsAvailable { get; set; } = true;
        public decimal Weight { get; set; } // kg
        public int MaxFlightTime { get; set; } // dakika
        public string ImageUrl { get; set; }
        
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public enum DroneType
    {
        Photography,    // Fotoğraf/Video
        Mapping,       // Haritacılık
        Inspection,    // İnceleme
        Racing,        // Yarış
        Commercial,    // Ticari
        Agricultural   // Tarımsal
    }
}