using Microsoft.Extensions.Configuration;

namespace DroneMarketplace.Infrastructure.Services
{
    public class EmailSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "DronePazar";
        public bool EnableSsl { get; set; } = true;
        public bool UseDefaultCredentials { get; set; }

        public bool IsConfigured =>
            !string.IsNullOrWhiteSpace(Host) &&
            !string.IsNullOrWhiteSpace(FromEmail) &&
            (UseDefaultCredentials || (
                !string.IsNullOrWhiteSpace(Username) &&
                !string.IsNullOrWhiteSpace(Password)
            ));

        public static EmailSettings Resolve(IConfiguration configuration)
        {
            var settings = new EmailSettings();
            configuration.GetSection("EmailSettings").Bind(settings);

            settings.Host = FirstNonEmpty(settings.Host, configuration["SMTP_HOST"]);
            settings.Username = FirstNonEmpty(settings.Username, configuration["SMTP_USERNAME"]);
            settings.Password = FirstNonEmpty(settings.Password, configuration["SMTP_PASSWORD"]);
            settings.FromEmail = FirstNonEmpty(settings.FromEmail, configuration["SMTP_FROM_EMAIL"]);
            settings.FromName = FirstNonEmpty(settings.FromName, configuration["SMTP_FROM_NAME"]);

            settings.Port = TryParseInt(configuration["SMTP_PORT"]) ?? settings.Port;
            settings.EnableSsl = TryParseBool(configuration["SMTP_ENABLE_SSL"]) ?? settings.EnableSsl;
            settings.UseDefaultCredentials = TryParseBool(configuration["SMTP_USE_DEFAULT_CREDENTIALS"]) ?? settings.UseDefaultCredentials;

            return settings;
        }

        private static string FirstNonEmpty(params string?[] values) =>
            values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)) ?? string.Empty;

        private static int? TryParseInt(string? value) =>
            int.TryParse(value, out var parsed) ? parsed : null;

        private static bool? TryParseBool(string? value) =>
            bool.TryParse(value, out var parsed) ? parsed : null;
    }
}
