import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebElement;
import pageobjects.*;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.number.OrderingComparison.greaterThan;

public class SmokeTest extends TestSetup {

    @BeforeEach
    public void logIntoApplication(){
        navigateToApplication();

        LoginPage loginPage = new LoginPage(driver);
        loginPage.populateUsername("admin");
        loginPage.populatePassword("password");
        loginPage.clickLogin();
    }

    @Test
    public void authSmokeTest(){
        RoomListingPage roomListingPage = new RoomListingPage(driver);

        assertThat(roomListingPage.roomFormExists(), is(true));
    }

    @Test
    public void roomSmokeTest() throws InterruptedException {
        RoomListingPage roomListingPage = new RoomListingPage(driver);
        int initialRoomCount = roomListingPage.roomCount();

        roomListingPage.populateRoomNumber("102");
        roomListingPage.setRoomPrice("100");
        roomListingPage.checkWifi();
        roomListingPage.checkSafe();
        roomListingPage.checkRadio();
        roomListingPage.clickCreateRoom();

        int currentRoomCount = roomListingPage.roomCount();

        assertThat(currentRoomCount, is(initialRoomCount + 1));
    }

    @Test
    public void bookingSmokeTest() {
        NavPage navPage = new NavPage(driver);
        navPage.clickFrontPage();

        HomePage homePage = new HomePage(driver);
        homePage.clickOpenBookingForm();
        homePage.clickSubmitBooking();

        assertThat(homePage.bookingFormErrorsExist(), is(true));
    }

    @Test
    public void reportSmokeTest(){
        NavPage navPage = new NavPage(driver);
        navPage.clickReport();

        ReportPage reportPage = new ReportPage(driver);

        assertThat(reportPage.reportExists(), is(true));
    }

    @Test
    public void brandingSmokeTest() throws InterruptedException {
        NavPage navPage = new NavPage(driver);
        navPage.clickBranding();

        BrandingPage brandingPage = new BrandingPage(driver);
        String nameValue = brandingPage.getNameValue();

        assertThat(nameValue.length(), greaterThan(0));
    }

    @Test
    public void messageSmokeTest(){
        NavPage navPage = new NavPage(driver);
        navPage.clickNotification();

        MessagePage messagePage = new MessagePage(driver);
        List<WebElement> messages = messagePage.getMessages();

        assertThat(messages.size(), greaterThan(0));
    }

}
