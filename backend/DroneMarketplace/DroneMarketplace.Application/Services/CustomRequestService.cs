using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DroneMarketplace.Application.Services
{
    public class CustomRequestService : ICustomRequestService
    {
        private readonly IApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CustomRequestService> _logger;

        public CustomRequestService(
            IApplicationDbContext context,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<CustomRequestService> logger)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<CustomRequestDto> CreateAsync(CreateCustomRequestDto requestDto, string? currentUserId)
        {
            var requestedDate = requestDto.Date.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(requestDto.Date, DateTimeKind.Utc)
                : requestDto.Date.ToUniversalTime();

            var request = CustomRequest.Create(
                requestDto.Category,
                requestDto.Location,
                requestedDate,
                requestDto.Budget,
                requestDto.Details,
                requestDto.ContactPhone,
                currentUserId);

            _context.CustomRequests.Add(request);
            await _context.SaveChangesAsync();

            await TryNotifyByEmailAsync(request);

            return Map(request);
        }

        public async Task<List<CustomRequestDto>> GetAllAsync()
        {
            var requests = await _context.CustomRequests
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return requests.Select(Map).ToList();
        }

        private async Task TryNotifyByEmailAsync(CustomRequest request)
        {
            try
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
                    senderName = "DronePazar Ozel Talep";
                }

                var subject = $"[DronePazar Ozel Talep] {request.Location}";
                var body =
                    $"Kategori: {request.Category}\n" +
                    $"Konum: {request.Location}\n" +
                    $"Tarih: {request.RequestedDate:O}\n" +
                    $"Butce: {request.Budget ?? "-"}\n" +
                    $"Telefon: {request.ContactPhone}\n" +
                    $"CustomerUserId: {request.CustomerUserId ?? "-"}\n" +
                    $"Olusturulma: {request.CreatedAt:O}\n\n" +
                    "Detay:\n" +
                    request.Details;

                await _emailService.SendEmailAsync(
                    recipientEmail,
                    subject,
                    body,
                    fromEmail: senderEmail,
                    fromName: senderName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Custom request email notification failed for request {RequestId}", request.Id);
            }
        }

        private static CustomRequestDto Map(CustomRequest request) => new()
        {
            Id = request.Id.ToString(),
            Category = request.Category,
            Location = request.Location,
            Date = request.RequestedDate.ToString("yyyy-MM-dd"),
            Budget = request.Budget,
            Details = request.Details,
            ContactPhone = request.ContactPhone,
            CreatedAt = request.CreatedAt.ToString("O"),
            CustomerUserId = request.CustomerUserId,
        };
    }
}
