FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["backend/DroneMarketplace/DroneMarketplace.API/DroneMarketplace.API.csproj", "backend/DroneMarketplace/DroneMarketplace.API/"]
COPY ["backend/DroneMarketplace/DroneMarketplace.Application/DroneMarketplace.Application.csproj", "backend/DroneMarketplace/DroneMarketplace.Application/"]
COPY ["backend/DroneMarketplace/DroneMarketplace.Infrastructure/DroneMarketplace.Infrastructure.csproj", "backend/DroneMarketplace/DroneMarketplace.Infrastructure/"]
COPY ["backend/DroneMarketplace/DroneMarketplace.Domain/DroneMarketplace.Domain.csproj", "backend/DroneMarketplace/DroneMarketplace.Domain/"]

RUN dotnet restore "backend/DroneMarketplace/DroneMarketplace.API/DroneMarketplace.API.csproj"

COPY . .
WORKDIR /src/backend/DroneMarketplace
RUN dotnet publish "DroneMarketplace.API/DroneMarketplace.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DroneMarketplace.API.dll"]
