namespace DroneMarketplace.Domain.Entities
{
    public class Drone : BaseEntity
    {
        public Guid PilotId { get; private set; }
        public Pilot Pilot { get; private set; } = default!;

        public string Model { get; private set; } = string.Empty;
        public string Brand { get; private set; } = string.Empty;
        public DroneType Type { get; private set; }
        public string? Specifications { get; private set; }
        public bool IsAvailable { get; private set; } = true;
        public decimal Weight { get; private set; } // kg
        public int MaxFlightTime { get; private set; } // dakika
        public string? ImageUrl { get; private set; }
        
        public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();

        protected Drone()
        {
        }

        public static Drone Create(
            Guid pilotId,
            string model,
            string brand,
            DroneType type,
            string? specifications,
            decimal weight,
            int maxFlightTime,
            string? imageUrl)
        {
            if (pilotId == Guid.Empty)
                throw new ArgumentException("Drone için geçerli bir pilot gereklidir.");

            if (string.IsNullOrWhiteSpace(model))
                throw new ArgumentException("Drone model adı boş olamaz.");

            if (string.IsNullOrWhiteSpace(brand))
                throw new ArgumentException("Drone marka adı boş olamaz.");

            if (weight <= 0)
                throw new ArgumentOutOfRangeException(nameof(weight), "Drone ağırlığı sıfırdan büyük olmalıdır.");

            if (maxFlightTime <= 0)
                throw new ArgumentOutOfRangeException(nameof(maxFlightTime), "Maksimum uçuş süresi sıfırdan büyük olmalıdır.");

            return new Drone
            {
                PilotId = pilotId,
                Model = model,
                Brand = brand,
                Type = type,
                Specifications = specifications,
                Weight = weight,
                MaxFlightTime = maxFlightTime,
                ImageUrl = imageUrl,
                IsAvailable = true
            };
        }

        public void UpdateDetails(
            string model,
            string brand,
            DroneType type,
            string? specifications,
            decimal weight,
            int maxFlightTime,
            string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(model))
                throw new ArgumentException("Drone model adı boş olamaz.");

            if (string.IsNullOrWhiteSpace(brand))
                throw new ArgumentException("Drone marka adı boş olamaz.");

            if (weight <= 0)
                throw new ArgumentOutOfRangeException(nameof(weight), "Drone ağırlığı sıfırdan büyük olmalıdır.");

            if (maxFlightTime <= 0)
                throw new ArgumentOutOfRangeException(nameof(maxFlightTime), "Maksimum uçuş süresi sıfırdan büyük olmalıdır.");

            Model = model;
            Brand = brand;
            Type = type;
            Specifications = specifications;
            Weight = weight;
            MaxFlightTime = maxFlightTime;
            ImageUrl = imageUrl;
            Touch();
        }

        public void SetAvailability(bool isAvailable)
        {
            IsAvailable = isAvailable;
            Touch();
        }
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
