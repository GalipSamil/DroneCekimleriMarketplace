using DroneMarketplace.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace DroneMarketplace.Infrastructure.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(
            string to,
            string subject,
            string body,
            string? fromEmail = null,
            string? fromName = null,
            string? replyToEmail = null,
            string? replyToName = null)
        {
            _logger.LogWarning(
                "Mock email service invoked. No real email was sent. To: {To}, Subject: {Subject}, From: {FromEmail}, ReplyTo: {ReplyTo}",
                to,
                subject,
                fromEmail ?? "(default)",
                replyToEmail ?? "(none)");
            return Task.CompletedTask;
        }
    }
}
