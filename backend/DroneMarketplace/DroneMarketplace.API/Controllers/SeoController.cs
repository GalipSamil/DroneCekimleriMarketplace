using System.Text;
using DroneMarketplace.API.Seo;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/seo/sitemaps")]
    [ApiController]
    public sealed class SeoController : ControllerBase
    {
        private readonly IListingService _listingService;

        public SeoController(IListingService listingService)
        {
            _listingService = listingService;
        }

        [HttpGet("listings.xml")]
        public async Task<IActionResult> GetListingsSitemap()
        {
            var listings = (await _listingService.SearchListingsAsync(string.Empty)).ToList();
            var urls = listings.Select(listing => new SitemapUrl(SeoUrlBuilder.BuildServiceUrl(listing), listing.CreatedAt));
            return Content(CreateUrlSetXml(urls), "application/xml", Encoding.UTF8);
        }

        [HttpGet("pilots.xml")]
        public async Task<IActionResult> GetPilotsSitemap()
        {
            var listings = (await _listingService.SearchListingsAsync(string.Empty)).ToList();

            var urls = listings
                .Where(listing => !string.IsNullOrWhiteSpace(listing.PilotUserId) && !string.IsNullOrWhiteSpace(listing.PilotName))
                .GroupBy(listing => new { listing.PilotUserId, listing.PilotName })
                .SelectMany(group =>
                {
                    var latestDate = group.Max(listing => listing.CreatedAt);
                    var representativeListing = group.First();

                    return new[]
                    {
                        new SitemapUrl(SeoUrlBuilder.BuildPilotProfileUrl(representativeListing), latestDate),
                        new SitemapUrl(SeoUrlBuilder.BuildPilotServicesUrl(representativeListing), latestDate),
                    };
                });

            return Content(CreateUrlSetXml(urls), "application/xml", Encoding.UTF8);
        }

        private static string CreateUrlSetXml(IEnumerable<SitemapUrl> urls)
        {
            var builder = new StringBuilder();
            builder.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            builder.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

            foreach (var url in urls)
            {
                builder.AppendLine("  <url>");
                builder.AppendLine($"    <loc>{EscapeXml(url.Location)}</loc>");
                builder.AppendLine($"    <lastmod>{url.LastModified:yyyy-MM-dd}</lastmod>");
                builder.AppendLine("  </url>");
            }

            builder.AppendLine("</urlset>");
            return builder.ToString();
        }

        private static string EscapeXml(string value)
        {
            return value
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;")
                .Replace("'", "&apos;");
        }

        private sealed record SitemapUrl(string Location, DateTime LastModified);
    }
}
