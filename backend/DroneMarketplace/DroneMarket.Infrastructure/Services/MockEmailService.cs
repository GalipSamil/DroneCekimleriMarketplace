using DroneMarket.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace DroneMarket.Infrastructure.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogWarning(
                "Mock email service invoked. To: {To}, Subject: {Subject}",
                to,
                subject);
            return Task.CompletedTask;
        }
    }
}
