namespace DroneMarketplace.Domain.Entities
{
    public class Booking : BaseEntity
    {
        public Guid ListingId { get; set; }
        public Listing Listing { get; set; }

        public string CustomerId { get; set; }
        public AppUser Customer { get; set; }

        // Rezervasyon detayları
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public BookingType Type { get; set; }
        
        // Lokasyon
        public string Location { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        // Fiyatlandırma
        public decimal TotalPrice { get; set; }
        public decimal Hours { get; set; }
        public int Days { get; set; }
        
        // Durum
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        
        // Notlar
        public string CustomerNotes { get; set; }
        public string PilotNotes { get; set; }
        
        // İlişkiler
        public Review? Review { get; set; }
    }

    public enum BookingType
    {
        Hourly,    // Saatlik
        Daily,     // Günlük
        Project    // Proje bazlı
    }

    public enum BookingStatus
    {
        Pending,     // Beklemede
        Accepted,    // Kabul edildi
        InProgress,  // Devam ediyor
        Completed,   // Tamamlandı
        Cancelled,   // İptal edildi
        Rejected,    // Reddedildi
        Delivered    // Teslim edildi (Müşteri onayı bekliyor)
    }
}