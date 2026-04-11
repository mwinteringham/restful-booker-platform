package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class HomePage extends BasePage {

    @FindBy(how = How.CSS, using = ".room-card a")
    private List<WebElement> btnReserveRoom;

    @FindBy(how = How.CSS, using = ".btn-outline-primary.book-room")
    private WebElement btnSubmitBooking;

    @FindBy(how = How.CSS, using = ".alert-danger")
    private WebElement divAlert;

    @FindBy(how = How.CSS, using = ".display-5")
    private List<WebElement> divSubHeaders;

    public HomePage(WebDriver driver) {
        super(driver);
    }

    public void clickOpenBookingForm() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", divSubHeaders.get(0));
        Thread.sleep(500);

        btnReserveRoom.get(0).click();
    }

    public void clickSubmitBooking() {
        btnSubmitBooking.click();
    }


    public Boolean bookingFormErrorsExist() {
        return divAlert.isDisplayed();
    }
}
