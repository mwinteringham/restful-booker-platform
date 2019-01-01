import models.Booking;
import models.Room;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebElement;
import pageobjects.*;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

public class SmokeTest extends TestSetup {

    @Before
    public void logIntoApplication(){
        navigateToApplication();

        LoginPage loginPage = new LoginPage(driver);
        loginPage.populateUsername("admin");
        loginPage.populatePassword("password");
        loginPage.clickLogin();
    }

    @Test
    public void authSmokeTest(){
        NavPage navPage = new NavPage(driver);

        assertThat(navPage.getDivNavBar().getText(), containsString("Shady Meadows - Booking Management"));
    }

    @Test
    public void roomSmokeTest() throws InterruptedException {
        Room room = new Room("102", "Single", "1", "false", "WiFi");

        RoomListingPage roomListingPage = new RoomListingPage(driver);
        int initialRoomCount = roomListingPage.roomCount();

        roomListingPage.populateRoomNumber(room.getNumber());
        roomListingPage.populateType(room.getType());
        roomListingPage.populateBeds(room.getBeds());
        roomListingPage.populateAccessible(room.getAccessible());
        roomListingPage.populateDetails(room.getDetails());
        roomListingPage.clickCreateRoom();

        int currentRoomCount = roomListingPage.roomCount();

        assertThat(currentRoomCount, is(initialRoomCount + 1));
    }

    @Test
    public void bookingSmokeTest() throws InterruptedException {
        Booking booking = new Booking("Sam", "Jones", "100");

        RoomListingPage roomListingPage = new RoomListingPage(driver);
        roomListingPage.clickFirstRoom();

        RoomPage roomPage = new RoomPage(driver);
        int initialBookingCount = roomPage.getBookingCount();

        roomPage.populateFirstname(booking.getFirstname());
        roomPage.populateLastname(booking.getLastname());
        roomPage.populateTotalPrice(booking.getTotalPrice());
        roomPage.clickCreateBooking();

        int currentBookingCount = roomPage.getBookingCount();

        assertThat(currentBookingCount, is(initialBookingCount + 1));
    }

    @Test
    public void reportSmokeTest(){
        NavPage navPage = new NavPage(driver);
        navPage.clickReport();

        ReportPage reportPage = new ReportPage(driver);

        assertThat(reportPage.getReport(), instanceOf(WebElement.class));
    }

}
