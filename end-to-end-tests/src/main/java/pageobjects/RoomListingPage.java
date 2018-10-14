package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class RoomListingPage extends BasePage
{
    @FindBy(how = How.ID, using = "roomNumber")
    private WebElement txtRoomNumber;

    @FindBy(how = How.ID, using = "type")
    private WebElement txtType;

    @FindBy(how = How.ID, using = "beds")
    private WebElement txtBeds;

    @FindBy(how = How.ID, using = "accessible")
    private WebElement txtAccessible;

    @FindBy(how = How.ID, using = "details")
    private WebElement txtDetails;

    @FindBy(how = How.ID, using = "createRoom")
    private WebElement btnCreate;

    @FindBy(how = How.CSS, using = "div[data-type~=\"room\"]")
    private List<WebElement> lstRooms;

    private String lblRoomNumber = "room";

    public RoomListingPage(WebDriver driver){
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.col-sm-2.rowHeader")));
    }

    public void populateRoomNumber(String roomNumber) throws InterruptedException {
        txtRoomNumber.sendKeys(roomNumber);
        Thread.sleep(200);
    }

    public void populateType(String type) throws InterruptedException {
        txtType.sendKeys(type);
        Thread.sleep(200);
    }

    public void populateBeds(String beds) throws InterruptedException {
        txtBeds.sendKeys(beds);
        Thread.sleep(200);
    }

    public void populateAccessible(String accessible) throws InterruptedException {
        txtAccessible.sendKeys(accessible);
        Thread.sleep(200);
    }

    public void populateDetails(String details) throws InterruptedException {
        txtDetails.sendKeys(details);
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
}
