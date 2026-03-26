-- Listings tablosu oluştur (DroneServices tablosunu yeniden adlandır)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'DroneServices')
BEGIN
    EXEC sp_rename 'DroneServices', 'Listings';
    EXEC sp_rename 'DroneServices.ServiceName', 'Title', 'COLUMN';
    PRINT 'DroneServices renamed to Listings successfully';
END
ELSE IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Listings')
BEGIN
    CREATE TABLE Listings (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        PilotId UNIQUEIDENTIFIER NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(2000) NOT NULL,
        Category INT NOT NULL,
        HourlyRate DECIMAL(18,2) NOT NULL,
        DailyRate DECIMAL(18,2) NOT NULL,
        ProjectRate DECIMAL(18,2) NOT NULL,
        CoverImageUrl NVARCHAR(500) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        MaxDistance INT NOT NULL,
        RequiredEquipment NVARCHAR(500) NULL,
        DeliverableFormat NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NULL,
        IsDeleted BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (PilotId) REFERENCES Pilots(Id) ON DELETE CASCADE
    );
    PRINT 'Listings table created successfully';
END

-- Bookings tablosunu güncelle
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Bookings') AND name = 'DroneServiceId')
BEGIN
    EXEC sp_rename 'Bookings.DroneServiceId', 'ListingId', 'COLUMN';
    PRINT 'DroneServiceId renamed to ListingId in Bookings';
END

-- Örnek veri ekle
DECLARE @Pilot1Id UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Pilots ORDER BY CreatedAt);

IF @Pilot1Id IS NOT NULL AND NOT EXISTS (SELECT * FROM Listings)
BEGIN
    INSERT INTO Listings (Id, PilotId, Title, Description, Category, HourlyRate, DailyRate, ProjectRate, 
                          CoverImageUrl, IsActive, MaxDistance, RequiredEquipment, DeliverableFormat, CreatedAt)
    VALUES 
    (NEWID(), @Pilot1Id, 'Emlak Fotoğraf ve Video Çekimi', 
     'Profesyonel emlak pazarlama için 4K kalitede fotoğraf ve video çekimi. Drone ile havadan çekim.', 
     0, 500, 2000, 3500, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', 
     1, 50, 'DJI Mavic 3 Pro, 4K Kamera', '4K Video (MP4), RAW Fotoğraflar', GETUTCDATE()),
     
    (NEWID(), @Pilot1Id, 'Düğün ve Etkinlik Çekimi', 
     'Özel günlerinizi havadan çekerek unutulmaz anılar oluşturuyoruz.', 
     1, 750, 3000, 5000, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500', 
     1, 75, 'DJI Air 2S', '4K Video Montaj, Fotoğraf Albümü', GETUTCDATE()),
     
    (NEWID(), @Pilot1Id, 'İnşaat Denetimi', 
     'İnşaat projelerinin havadan takibi ve denetimi.', 
     6, 800, 4000, 7500, 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500', 
     1, 100, 'DJI Matrice 300, Termal Kamera', 'Termal Görüntüler, 3D Harita', GETUTCDATE());
     
    PRINT 'Sample listings inserted';
END

SELECT 'Migration completed successfully' AS Result;
