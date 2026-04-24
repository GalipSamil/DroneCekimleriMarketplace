namespace Domain.UnitTests;

public sealed class PilotTests
{
    [Fact]
    public void Verify_WhenLicenseMissing_ThrowsInvalidOperationException()
    {
        var pilot = Pilot.Create("pilot-user");

        Assert.Throws<InvalidOperationException>(() => pilot.Verify());
    }

    [Fact]
    public void UpdateProfile_WhenVerifiedPilotClearsLicense_RevokesVerification()
    {
        var pilot = Pilot.Create("pilot-user");
        pilot.UpdateProfile("Bio", "Equipment", "SHGM-001", null);
        pilot.Verify();

        pilot.UpdateProfile("Updated bio", "Updated equipment", null, null);

        Assert.False(pilot.IsVerified);
    }

    [Fact]
    public void UpdateProfile_WhenVerifiedPilotChangesLicense_RevokesVerification()
    {
        var pilot = Pilot.Create("pilot-user");
        pilot.UpdateProfile("Bio", "Equipment", "SHGM-001", null);
        pilot.Verify();

        pilot.UpdateProfile("Updated bio", "Updated equipment", "SHGM-999", null);

        Assert.False(pilot.IsVerified);
    }

    [Fact]
    public void RevokeVerification_WhenReasonIsEmpty_ThrowsArgumentException()
    {
        var pilot = Pilot.Create("pilot-user");
        pilot.UpdateProfile("Bio", "Equipment", "SHGM-001", null);
        pilot.Verify();

        Assert.Throws<ArgumentException>(() => pilot.RevokeVerification(string.Empty));
    }

    [Fact]
    public void RevokeVerification_WhenReasonProvided_SetsRejectionReason()
    {
        var pilot = Pilot.Create("pilot-user");
        pilot.UpdateProfile("Bio", "Equipment", "SHGM-001", null);

        pilot.RevokeVerification("Lisans bilgisi doğrulanamadı.");

        Assert.False(pilot.IsVerified);
        Assert.Equal("Lisans bilgisi doğrulanamadı.", pilot.VerificationRejectionReason);
    }

    [Fact]
    public void UpdateProfile_ClearsPreviousRejectionReason()
    {
        var pilot = Pilot.Create("pilot-user");
        pilot.UpdateProfile("Bio", "Equipment", "SHGM-001", null);
        pilot.RevokeVerification("Eksik evrak");

        pilot.UpdateProfile("Bio", "Equipment", "SHGM-002", null);

        Assert.Null(pilot.VerificationRejectionReason);
    }
}
