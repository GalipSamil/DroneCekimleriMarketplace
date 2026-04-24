@echo off
cd /d C:\Users\kralg\Desktop\DroneCekimleriMarketpalce
dotnet run --project backend\DroneMarketplace\DroneMarketplace.API\DroneMarketplace.API.csproj --launch-profile http > backend-start.log 2>&1
