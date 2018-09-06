import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import models.Room;
import org.junit.Assert;
import org.junit.Test;
import pageobjects.LoginPage;
import pageobjects.RoomListingPage;

public class CreateRoomTest extends TestSetup
{
    @Test
    public void CreateNewRoom() throws InterruptedException
    {
        Room room = new Room("102", "Single", "1", "false", "WiFi");

        driver.navigate().to(baseUrl);
        RoomListingPage roomListingPage = new LoginPage(driver)
                .PopulateUsername("admin")
                .PopulatePassword("password")
                .ClickLogin()
                .PopulateRoomNumber(room.getNumber())
                .PopulateType(room.getType())
                .PopulateBeds(room.getBeds())
                .PopulateAccessible(room.getAccessible())
                .PopulateDetails(room.getDetails())
                .ClickCreateRoom();

        Assert.assertThat(roomListingPage.ReadRoomNumber(roomListingPage.RoomCount()).contains(room.getNumber()), is(equalTo(true)));
    }
}
