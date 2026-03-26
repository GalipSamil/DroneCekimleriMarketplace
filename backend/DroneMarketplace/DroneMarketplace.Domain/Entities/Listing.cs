namespace DroneMarketplace.Domain.Entities
{
    public class Listing : BaseEntity
    {
        public Guid PilotId { get; set; }
        public Pilot Pilot { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceCategory Category { get; set; }
        
        // Fiyatlandırma
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public decimal ProjectRate { get; set; }
        
        public string CoverImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        
        // Hizmet detayları
        public int MaxDistance { get; set; } // km - maksimum mesafe
        public string RequiredEquipment { get; set; }
        public string DeliverableFormat { get; set; } // "4K Video, RAW Photos"
        
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public enum ServiceCategory
    {
        RealEstate,      // Emlak
        Wedding,         // Düğün
        Inspection,      // İnceleme/Denetim
        Commercial,      // Ticari
        Mapping,         // Haritacılık
        Agriculture,     // Tarım
        Construction,    // İnşaat
        Events,          // Etkinlik
        Cinematography   // Sinematografi
    }
}