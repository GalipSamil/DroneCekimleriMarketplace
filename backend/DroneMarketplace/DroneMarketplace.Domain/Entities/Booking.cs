namespace DroneMarketplace.Domain.Entities
{
    public class Booking : BaseEntity
    {
        public Guid ListingId { get; private set; }
        public Listing Listing { get; private set; } = default!;

        public string CustomerId { get; private set; } = string.Empty;
        public AppUser Customer { get; private set; } = default!;

        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public BookingType Type { get; private set; }
        
        public string Location { get; private set; } = string.Empty;
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }
        
        public decimal TotalPrice { get; private set; }
        public decimal Hours { get; private set; }
        public int Days { get; private set; }
        
        public BookingStatus Status { get; private set; }
        public DateTime BookingDate { get; private set; }
        
        public string CustomerNotes { get; private set; } = string.Empty;
        public string PilotNotes { get; private set; } = string.Empty;
        
        public Review? Review { get; private set; }

        // Parameterless constructor for EF Core
        protected Booking() { }

        public static Booking Create(
            Guid listingId, 
            Listing listing, 
            string customerId, 
            DateTime startDate, 
            DateTime endDate, 
            BookingType type, 
            string location, 
            double latitude, 
            double longitude, 
            decimal hours, 
            int days, 
            string? customerNotes)
        {
            if (startDate >= endDate)
                throw new InvalidOperationException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");

            var booking = new Booking
            {
                ListingId = listingId,
                CustomerId = customerId,
                StartDate = startDate,
                EndDate = endDate,
                Type = type,
                Location = location,
                Latitude = latitude,
                Longitude = longitude,
                Hours = hours,
                Days = days,
                CustomerNotes = customerNotes ?? string.Empty,
                PilotNotes = string.Empty,
                Status = BookingStatus.Pending,
                BookingDate = DateTime.UtcNow
            };

            booking.CalculateTotalPrice(listing);

            return booking;
        }

        private void CalculateTotalPrice(Listing listing)
        {
            if (Type == BookingType.Hourly)
            {
                TotalPrice = listing.HourlyRate * Hours;
            }
            else if (Type == BookingType.Daily)
            {
                TotalPrice = listing.DailyRate * Days;
            }
            else // Project
            {
                TotalPrice = listing.ProjectRate;
            }
        }

        public void Accept(string? pilotMessage)
        {
            if (Status != BookingStatus.Pending)
                throw new InvalidOperationException($"Şu anki rezervasyon durumunda onay işlemi yapılamaz: {Status}");

            Status = BookingStatus.Accepted;
            AppendPilotNote(pilotMessage);
            Touch();
        }

        public void Reject(string reason)
        {
            if (Status != BookingStatus.Pending)
                throw new InvalidOperationException($"Beklemede olmayan bir rezervasyon reddedilemez: {Status}");

            Status = BookingStatus.Rejected;
            AppendPilotNote($"[Reddedildi]: {reason}");
            Touch();
        }

        public void Start(string? pilotMessage)
        {
            if (Status != BookingStatus.Accepted)
                throw new InvalidOperationException($"Sadece onaylanan projeler başlatılabilir.");

            Status = BookingStatus.InProgress;
            AppendPilotNote(pilotMessage);
            Touch();
        }

        public void Deliver(string? pilotMessage)
        {
            if (Status != BookingStatus.InProgress)
                throw new InvalidOperationException($"Devam etmeyen bir rezervasyon teslim edilemez.");

            Status = BookingStatus.Delivered;
            AppendPilotNote(pilotMessage);
            Touch();
        }

        public void Complete()
        {
            if (Status != BookingStatus.Delivered)
                throw new InvalidOperationException("Müşteri onayı (Tamamlama) için önce 'Teslim Edildi' durumunda olmalıdır.");

            Status = BookingStatus.Completed;
            Touch();
        }
        
        public void RequestRevision(string message)
        {
             if (Status != BookingStatus.Delivered)
                throw new InvalidOperationException("Sadece teslim edilmiş hizmetler için revizyon talep edilebilir.");

            Status = BookingStatus.InProgress;
            AppendCustomerNote($"[İade/Düzeltme Talebi]: {message}");
            Touch();
        }

        public void CancelByCustomer(string reason)
        {
            if (Status == BookingStatus.Completed || Status == BookingStatus.Cancelled || Status == BookingStatus.Delivered)
                throw new InvalidOperationException($"{Status} durumundaki bir işlem iptal edilemez.");

            Status = BookingStatus.Cancelled;
            AppendCustomerNote($"[İptal Sebebi]: {reason}");
            Touch();
        }

        // Generic fallback status updater (used for admin forcing status)
        public void ForceStatusChange(BookingStatus newStatus, string? note)
        {
            Status = newStatus;
            AppendPilotNote($"[Sistem/Admin Güncellemesi]: {note}");
            Touch();
        }

        private void AppendPilotNote(string? message)
        {
            if (!string.IsNullOrWhiteSpace(message))
            {
                PilotNotes = string.IsNullOrEmpty(PilotNotes) ? message : $"{PilotNotes}\n{message}";
            }
        }
        
        private void AppendCustomerNote(string? message)
        {
             if (!string.IsNullOrWhiteSpace(message))
            {
                CustomerNotes = string.IsNullOrEmpty(CustomerNotes) ? message : $"{CustomerNotes}\n{message}";
            }
        }
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
