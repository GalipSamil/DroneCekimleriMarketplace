using System.Net;
using System.Net.Mail;
using DroneMarketplace.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DroneMarketplace.Infrastructure.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IOptions<EmailSettings> settings, ILogger<SmtpEmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(
            string to,
            string subject,
            string body,
            string? fromEmail = null,
            string? fromName = null,
            string? replyToEmail = null,
            string? replyToName = null)
        {
            if (!_settings.IsConfigured)
            {
                throw new InvalidOperationException("SMTP email settings are not configured.");
            }

            var effectiveFromEmail = string.IsNullOrWhiteSpace(fromEmail) ? _settings.FromEmail : fromEmail.Trim();
            var effectiveFromName = string.IsNullOrWhiteSpace(fromName) ? _settings.FromName : fromName.Trim();

            using var message = new MailMessage
            {
                From = new MailAddress(effectiveFromEmail, effectiveFromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(to);

            if (!string.IsNullOrWhiteSpace(replyToEmail))
            {
                message.ReplyToList.Add(new MailAddress(replyToEmail.Trim(), replyToName?.Trim()));
            }

            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                EnableSsl = _settings.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = _settings.UseDefaultCredentials
            };

            if (!_settings.UseDefaultCredentials && !string.IsNullOrWhiteSpace(_settings.Username))
            {
                client.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            }

            try
            {
                await client.SendMailAsync(message);
                _logger.LogInformation(
                    "Email sent to {To} via SMTP host {Host}:{Port} with SSL {EnableSsl}. From: {FromEmail}, ReplyTo: {ReplyTo}",
                    to,
                    _settings.Host,
                    _settings.Port,
                    _settings.EnableSsl,
                    effectiveFromEmail,
                    string.IsNullOrWhiteSpace(replyToEmail) ? "(none)" : replyToEmail.Trim());
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "SMTP send failed for {To}. Host: {Host}, Port: {Port}, SSL: {EnableSsl}, From: {FromEmail}",
                    to,
                    _settings.Host,
                    _settings.Port,
                    _settings.EnableSsl,
                    effectiveFromEmail);
                throw;
            }
        }
    }
}
