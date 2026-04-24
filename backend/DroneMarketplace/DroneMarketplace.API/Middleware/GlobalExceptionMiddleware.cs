using System.Net;
using System.Text.Json;
using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarketplace.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = exception switch
            {
                ForbiddenAccessException => (int)HttpStatusCode.Forbidden,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                InvalidOperationException => (int)HttpStatusCode.BadRequest,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            // Preserve actionable client errors in production, but keep unexpected server failures generic.
            var detailedMessage = exception.GetBaseException().Message;
            var isServerError = context.Response.StatusCode >= (int)HttpStatusCode.InternalServerError;
            var message = (_env.IsDevelopment() || !isServerError)
                ? detailedMessage
                : "Beklenmeyen bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";

            var response = new ApiResponse<string>(message);
            // Manuel olarak Succeeded = false ayarla (ApiResponse constructor string alinca false yapiyor zaten)
            response.Succeeded = false;

            _logger.LogError(exception, "Global Exception Caught with status {StatusCode}: {Message}", context.Response.StatusCode, exception.Message);

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
