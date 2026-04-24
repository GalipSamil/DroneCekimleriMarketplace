using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public ContactController(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromBody] ContactMessageDto contactMessageDto)
        {
            var recipientEmail = _configuration["ContactSettings:RecipientEmail"]?.Trim();
            if (string.IsNullOrWhiteSpace(recipientEmail))
            {
                recipientEmail = "info@dronepazar.com";
            }

            var senderEmail = _configuration["ContactSettings:SenderEmail"]?.Trim();
            if (string.IsNullOrWhiteSpace(senderEmail))
            {
                senderEmail = "info@dronepazar.com";
            }

            var senderName = _configuration["ContactSettings:SenderName"]?.Trim();
            if (string.IsNullOrWhiteSpace(senderName))
            {
                senderName = "DronePazar Iletisim";
            }

            var subject = $"[DronePazar Contact] {contactMessageDto.Subject.Trim()}";
            var body =
                $"Name: {contactMessageDto.Name.Trim()}\n" +
                $"Email: {contactMessageDto.Email.Trim()}\n" +
                $"Submitted At (UTC): {DateTime.UtcNow:O}\n\n" +
                "Message:\n" +
                contactMessageDto.Message.Trim();

            await _emailService.SendEmailAsync(
                recipientEmail,
                subject,
                body,
                fromEmail: senderEmail,
                fromName: senderName,
                replyToEmail: contactMessageDto.Email.Trim(),
                replyToName: contactMessageDto.Name.Trim());

            return Ok(new ApiResponse<string?>(data: null, message: null));
        }
    }
}
