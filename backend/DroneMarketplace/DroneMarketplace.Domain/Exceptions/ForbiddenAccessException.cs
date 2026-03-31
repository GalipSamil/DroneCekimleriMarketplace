namespace DroneMarketplace.Domain.Exceptions
{
    public sealed class ForbiddenAccessException : Exception
    {
        public ForbiddenAccessException(string message) : base(message)
        {
        }
    }
}
