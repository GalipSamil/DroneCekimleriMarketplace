using System.Globalization;
using System.Text;
using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.API.Seo
{
    public static class SeoUrlBuilder
    {
        private const string SiteUrl = "https://dronepazar.com";

        public static string BuildServiceUrl(ListingDto listing)
        {
            return $"{SiteUrl}/service/{Uri.EscapeDataString(listing.Id.ToString())}/{Slugify(listing.Title)}";
        }

        public static string BuildPilotProfileUrl(ListingDto listing)
        {
            return $"{SiteUrl}/pilot/{Uri.EscapeDataString(listing.PilotUserId)}/{Slugify(listing.PilotName)}";
        }

        public static string BuildPilotServicesUrl(ListingDto listing)
        {
            return $"{BuildPilotProfileUrl(listing)}/services";
        }

        private static string Slugify(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "detay";
            }

            var transliterated = value
                .Replace('ç', 'c').Replace('Ç', 'c')
                .Replace('ğ', 'g').Replace('Ğ', 'g')
                .Replace('ı', 'i').Replace('İ', 'i').Replace('I', 'i')
                .Replace('ö', 'o').Replace('Ö', 'o')
                .Replace('ş', 's').Replace('Ş', 's')
                .Replace('ü', 'u').Replace('Ü', 'u');

            var normalized = transliterated.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder(normalized.Length);

            foreach (var character in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(char.ToLowerInvariant(character));
                }
            }

            var ascii = builder
                .ToString()
                .Normalize(NormalizationForm.FormC);

            var slugBuilder = new StringBuilder(ascii.Length);
            var previousWasHyphen = false;

            foreach (var character in ascii)
            {
                if (char.IsLetterOrDigit(character) && character <= sbyte.MaxValue)
                {
                    slugBuilder.Append(character);
                    previousWasHyphen = false;
                    continue;
                }

                if (previousWasHyphen)
                {
                    continue;
                }

                slugBuilder.Append('-');
                previousWasHyphen = true;
            }

            var slug = slugBuilder
                .ToString()
                .Trim('-');

            return string.IsNullOrWhiteSpace(slug) ? "detay" : slug;
        }
    }
}
