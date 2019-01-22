package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

import java.util.List;

public class RoomPage extends BasePage {

    @FindBy(how = How.ID, using = "firstname")
    private WebElement inputFirstname;

    @FindBy(how = How.ID, using = "lastname")
    private WebElement inputLastname;

    @FindBy(how = How.ID, using = "totalprice")
    private WebElement inputTotalPrice;

    @FindBy(how = How.ID, using = "createBooking")
    private WebElement buttonCreateBooking;

    @FindBy(how = How.CSS, using = ".detail")
    private List<WebElement> lstBookings;

    @FindBy(how = How.CSS, using = ".checkin input")
    private WebElement inputCheckin;

    @FindBy(how = How.CSS, using = ".checkout input")
    private WebElement inputCheckout;

    @FindBy(how = How.CSS, using = ".react-datepicker__day--001")
    private WebElement divFirstdate;

    @FindBy(how = How.CSS, using = ".react-datepicker__day--002")
    private WebElement divSeconddate;

    public RoomPage(WebDriver driver) {
        super(driver);
    }

    public void populateFirstname(String firstname) throws InterruptedException {
        inputFirstname.sendKeys(firstname);
        Thread.sleep(200);
    }

    public void populateLastname(String lastname) throws InterruptedException {
        inputLastname.sendKeys(lastname);
        Thread.sleep(200);
    }

    public void populateTotalPrice(String totalPrice) throws InterruptedException {
        inputTotalPrice.sendKeys(totalPrice);
        Thread.sleep(200);
    }

    public void clickCreateBooking() throws InterruptedException {
        Thread.sleep(200);
        buttonCreateBooking.click();
        Thread.sleep(200);
    }

    public int getBookingCount() throws InterruptedException {
        Thread.sleep(1000);
        return lstBookings.size();
    }

    public void populateCheckin(String checkInDate) throws InterruptedException {
        Thread.sleep(1000);
        inputCheckin.click();
        divFirstdate.click();
    }

    public void populateCheckout(String checkOutDate) throws InterruptedException {
        Thread.sleep(1000);
        inputCheckout.click();
        divSeconddate.click();
    }
}
