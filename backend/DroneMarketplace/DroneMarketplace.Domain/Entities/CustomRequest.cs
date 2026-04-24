namespace DroneMarketplace.Domain.Entities
{
    public class CustomRequest : BaseEntity
    {
        public int Category { get; private set; }
        public string Location { get; private set; } = string.Empty;
        public DateTime RequestedDate { get; private set; }
        public string? Budget { get; private set; }
        public string Details { get; private set; } = string.Empty;
        public string ContactPhone { get; private set; } = string.Empty;
        public string? CustomerUserId { get; private set; }
        public AppUser? CustomerUser { get; private set; }

        protected CustomRequest()
        {
        }

        public static CustomRequest Create(
            int category,
            string location,
            DateTime requestedDate,
            string? budget,
            string details,
            string contactPhone,
            string? customerUserId)
        {
            if (string.IsNullOrWhiteSpace(location))
                throw new ArgumentException("Konum zorunludur.");

            if (string.IsNullOrWhiteSpace(details))
                throw new ArgumentException("Talep detayı zorunludur.");

            if (string.IsNullOrWhiteSpace(contactPhone))
                throw new ArgumentException("İletişim numarası zorunludur.");

            return new CustomRequest
            {
                Category = category,
                Location = location.Trim(),
                RequestedDate = requestedDate,
                Budget = string.IsNullOrWhiteSpace(budget) ? null : budget.Trim(),
                Details = details.Trim(),
                ContactPhone = contactPhone.Trim(),
                CustomerUserId = string.IsNullOrWhiteSpace(customerUserId) ? null : customerUserId.Trim(),
            };
        }
    }
}
