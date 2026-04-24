namespace DroneMarketplace.Application.Common.Time;

public static class MarketplaceDateTime
{
    private static readonly TimeZoneInfo TurkeyTimeZone = ResolveTurkeyTimeZone();

    public static DateTime NormalizeIncoming(DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => TimeZoneInfo.ConvertTimeToUtc(value, TurkeyTimeZone),
        };
    }

    public static DateTime NormalizeOutgoing(DateTime value)
    {
        var utcValue = value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
        };

        var turkeyTime = TimeZoneInfo.ConvertTimeFromUtc(utcValue, TurkeyTimeZone);
        return DateTime.SpecifyKind(turkeyTime, DateTimeKind.Unspecified);
    }

    private static TimeZoneInfo ResolveTurkeyTimeZone()
    {
        foreach (var timeZoneId in new[] { "Europe/Istanbul", "Turkey Standard Time" })
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            }
            catch (TimeZoneNotFoundException)
            {
            }
            catch (InvalidTimeZoneException)
            {
            }
        }

        return TimeZoneInfo.Utc;
    }
}
