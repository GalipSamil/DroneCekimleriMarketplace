namespace DroneMarketplace.Domain.Entities
{
    public class Listing : BaseEntity
    {
        public Guid PilotId { get; private set; }
        public Pilot Pilot { get; private set; }

        public string Title { get; private set; }
        public string Description { get; private set; }
        public ServiceCategory Category { get; private set; }
        
        public decimal HourlyRate { get; private set; }
        public decimal DailyRate { get; private set; }
        public decimal ProjectRate { get; private set; }
        
        public string? CoverImageUrl { get; private set; }
        public bool IsActive { get; private set; } 
        
        public int MaxDistance { get; private set; } 
        public string? RequiredEquipment { get; private set; }
        public string? DeliverableFormat { get; private set; } 
        
        public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();

        // For EF Core
        protected Listing() { }

        public static Listing Create(Guid pilotId, string title, string description, ServiceCategory category, 
            decimal hourlyRate, decimal dailyRate, decimal projectRate, string? coverImageUrl, 
            int maxDistance, string? requiredEquipment, string? deliverableFormat)
        {
            if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("İlan başlığı boş olamaz.");
            if (string.IsNullOrWhiteSpace(description)) throw new ArgumentException("İlan açıklaması boş olamaz.");

            return new Listing
            {
                Id = Guid.NewGuid(),
                PilotId = pilotId,
                Title = title,
                Description = description,
                Category = category,
                HourlyRate = hourlyRate,
                DailyRate = dailyRate,
                ProjectRate = projectRate,
                CoverImageUrl = coverImageUrl,
                MaxDistance = maxDistance,
                RequiredEquipment = requiredEquipment,
                DeliverableFormat = deliverableFormat,
                IsActive = false // Default
            };
        }

        public void UpdateDetails(string title, string description, ServiceCategory category, 
            decimal hourlyRate, decimal dailyRate, decimal projectRate, string? coverImageUrl, 
            int maxDistance, string? requiredEquipment, string? deliverableFormat)
        {
            if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("İlan başlığı boş olamaz.");
            if (string.IsNullOrWhiteSpace(description)) throw new ArgumentException("İlan açıklaması boş olamaz.");

            Title = title;
            Description = description;
            Category = category;
            HourlyRate = hourlyRate;
            DailyRate = dailyRate;
            ProjectRate = projectRate;
            CoverImageUrl = coverImageUrl;
            MaxDistance = maxDistance;
            RequiredEquipment = requiredEquipment;
            DeliverableFormat = deliverableFormat;

            // Ensure invariants are maintained if currently active
            if (IsActive)
            {
                ValidateActivationCompleteness();
            }
        }

        public void Activate()
        {
            ValidateActivationCompleteness();
            IsActive = true;
        }

        public void Deactivate()
        {
            IsActive = false;
        }

        private void ValidateActivationCompleteness()
        {
            if (HourlyRate <= 0 && DailyRate <= 0 && ProjectRate <= 0)
                throw new InvalidOperationException("İlanın yayına alınabilmesi için en az bir fiyat tarifesi (Saatlik/Günlük/Proje) belirlenmiş olmalıdır.");

            if (string.IsNullOrWhiteSpace(CoverImageUrl))
                throw new InvalidOperationException("İlanın yayına alınabilmesi için kapak fotoğrafı (Cover Image) zorunludur.");
        }
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