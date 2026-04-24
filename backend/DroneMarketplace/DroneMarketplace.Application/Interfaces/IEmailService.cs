namespace DroneMarketplace.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(
            string to,
            string subject,
            string body,
            string? fromEmail = null,
            string? fromName = null,
            string? replyToEmail = null,
            string? replyToName = null);
    }
}
