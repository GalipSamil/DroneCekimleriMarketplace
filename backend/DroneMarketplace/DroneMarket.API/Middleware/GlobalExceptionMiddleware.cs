using System.Net;
using System.Text.Json;
using DroneMarket.Application.Common.Models;

namespace DroneMarket.API.Middleware
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
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Return detailed error in development, generic error in production to avoid leaking info
            var message = _env.IsDevelopment() ? exception.Message : "Beklenmeyen bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";

            var response = new ApiResponse<string>(message);
            // Manuel olarak Succeeded = false ayarla (ApiResponse constructor string alinca false yapiyor zaten)
            response.Succeeded = false;

            _logger.LogError(exception, "Global Exception Caught: {Message}", exception.Message);

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
