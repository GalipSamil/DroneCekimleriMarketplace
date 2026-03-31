namespace DroneMarketplace.Domain.Entities
{
    public abstract class BaseEntity
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; private set; }
        public bool IsDeleted { get; private set; }

        protected void Touch()
        {
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            if (IsDeleted)
            {
                return;
            }

            IsDeleted = true;
            Touch();
        }
    }
}
