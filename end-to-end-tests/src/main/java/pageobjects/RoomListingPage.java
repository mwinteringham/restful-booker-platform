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

    public RoomListingPage(WebDriver driver)
    {
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.col-sm-2.rowHeader")));
    }

    public RoomListingPage PopulateRoomNumber(String roomNumber) throws InterruptedException
    {
        txtRoomNumber.sendKeys(roomNumber);
        Thread.sleep(200);
        return this;
    }

    public RoomListingPage PopulateType(String type) throws InterruptedException
    {
        txtType.sendKeys(type);
        Thread.sleep(200);
        return this;
    }

    public RoomListingPage PopulateBeds(String beds) throws InterruptedException
    {
        txtBeds.sendKeys(beds);
        Thread.sleep(200);
        return this;
    }

    public RoomListingPage PopulateAccessible(String accessible) throws InterruptedException
    {
        txtAccessible.sendKeys(accessible);
        Thread.sleep(200);
        return this;
    }

    public RoomListingPage PopulateDetails(String details) throws InterruptedException
    {
        txtDetails.sendKeys(details);
        Thread.sleep(200);
        return this;
    }

    public RoomListingPage ClickCreateRoom() throws InterruptedException
    {
        Thread.sleep(200);
        btnCreate.click();
        Thread.sleep(200);
        return new RoomListingPage(driver);
    }

    public String ReadRoomNumber(int index)
    {
        return driver.findElement(By.id(lblRoomNumber +index)).getText();
    }

    public int RoomCount()
    {
        return lstRooms.size();
    }
}
