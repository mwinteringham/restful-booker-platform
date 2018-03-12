import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;

import models.Contact;
import models.Hotel;
import org.junit.Assert;
import org.junit.Test;
import pageobjects.HotelListingPage;
import pageobjects.NavigationPage;

import java.util.Date;

public class CreateHotelTests extends TestSetup
{
    @Test
    public void CreateNewHotel() throws InterruptedException
    {
        Hotel hotel = new Hotel("Richards Beach", "1 Richard Street", new Contact("Richard B", "07845745745", "rb456@rb.com"));


        driver.navigate().to(baseUrl);
        HotelListingPage hotelListingPage = new NavigationPage(driver)
                .ClickLogin()
                .PopulateUsername("admin")
                .PopulatePassword("password")
                .ClickLogin()
                .PopulateHoteName(hotel.getName())
                .PopulateAddress(hotel.getAddress())
                .PopulateOwner(hotel.getContact().getName())
                .PopulatePhone(hotel.getContact().getPhone())
                .PopulateEmail(hotel.getContact().getEmail())
                .ClickCreateHotel();

        Assert.assertThat(hotelListingPage.ReadHotelName(hotelListingPage.HotelCount()), is(equalTo(hotel.getName())));
    }
}
