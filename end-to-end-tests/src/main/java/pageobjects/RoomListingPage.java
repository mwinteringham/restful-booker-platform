package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.w3c.dom.html.HTMLInputElement;

import java.util.List;

public class RoomListingPage extends BasePage {

    @FindBy(how = How.ID, using = "roomNumber")
    private WebElement txtRoomNumber;

    @FindBy(how = How.ID, using = "createRoom")
    private WebElement btnCreate;

    @FindBy(how = How.ID, using = "wifiCheckbox")
    private WebElement chkWifi;

    @FindBy(how = How.CSS, using = "div[data-type~=\"room\"]")
    private List<WebElement> lstRooms;

    @FindBy(how = How.ID, using = "safeCheckbox")
    private WebElement chkSafe;

    @FindBy(how = How.ID, using = "radioCheckbox")
    private WebElement chkRadio;

    @FindBy(how = How.CSS, using = ".room-form")
    private WebElement frmForm;

    @FindBy(how = How.ID, using = "roomPrice")
    private WebElement inptRoomPrice;

    public RoomListingPage(WebDriver driver){
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.col-sm-2.rowHeader")));
    }

    public void populateRoomNumber(String roomNumber) throws InterruptedException {
        txtRoomNumber.sendKeys(roomNumber);
        Thread.sleep(200);
    }

    public void clickCreateRoom() throws InterruptedException {
        Thread.sleep(200);
        btnCreate.click();
        Thread.sleep(200);
    }

    public int roomCount() throws InterruptedException {
        Thread.sleep(1000);
        return lstRooms.size();
    }

    public void clickFirstRoom() {
        lstRooms.get(0).click();
    }

    public void checkWifi() {
        chkWifi.click();
    }

    public void checkSafe() {
        chkSafe.click();
    }

    public void checkRadio() {
        chkRadio.click();
    }

    public Boolean roomFormExists() {
        return frmForm.isDisplayed();
    }

    public void setRoomPrice(String price) throws InterruptedException {
        Thread.sleep(1000);
        inptRoomPrice.sendKeys(price);
    }
}
