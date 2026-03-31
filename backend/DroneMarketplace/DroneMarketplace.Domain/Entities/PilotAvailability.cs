namespace DroneMarketplace.Domain.Entities
{
    public class PilotAvailability : BaseEntity
    {
        public Guid PilotId { get; set; }
        public Pilot Pilot { get; set; } = default!;

        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsBooked { get; set; } = false;
        public bool IsRecurring { get; set; } = false;
        
        // Tekrarlayan müsaitlik için
        public DayOfWeek? RecurringDayOfWeek { get; set; }
        public DateTime? RecurringEndDate { get; set; }
        
        public string? Notes { get; set; }
    }
}
