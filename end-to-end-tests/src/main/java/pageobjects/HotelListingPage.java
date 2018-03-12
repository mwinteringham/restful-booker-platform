package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.FindBys;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class HotelListingPage extends BasePage
{
    @FindBy(how = How.ID, using = "hotelName")
    private WebElement txtHotelName;

    @FindBy(how = How.ID, using = "address")
    private WebElement txtAddress;

    @FindBy(how = How.ID, using = "owner")
    private WebElement txtOwner;

    @FindBy(how = How.ID, using = "phone")
    private WebElement txtPhoneNumber;

    @FindBy(how = How.ID, using = "email")
    private WebElement txtEmail;

    @FindBy(how = How.ID, using = "createHotel")
    private WebElement btnCreate;

    @FindBy(how = How.CSS, using = "div[data-type~=\"hotel\"]")
    private List<WebElement> lstHotels;

    private String lblHotelName = "hotelname";
    private String lblHotelAddress = "hoteladdress";
    private String lblHotelOwner = "hotelowner";
    private String lblHotelPhone = "hotelphone";
    private String lblHotelEmail = "hotelemail";

    public HotelListingPage(WebDriver driver)
    {
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.col-sm-2.rowHeader")));
    }

    public HotelListingPage PopulateHoteName(String hotelName) throws InterruptedException
    {
        txtHotelName.sendKeys(hotelName);
        Thread.sleep(200);
        return this;
    }

    public HotelListingPage PopulateAddress(String address) throws InterruptedException
    {
        txtAddress.sendKeys(address);
        Thread.sleep(200);
        return this;
    }

    public HotelListingPage PopulateOwner(String owner) throws InterruptedException
    {
        txtOwner.sendKeys(owner);
        Thread.sleep(200);
        return this;
    }

    public HotelListingPage PopulatePhone(String phone) throws InterruptedException
    {
        txtPhoneNumber.sendKeys(phone);
        Thread.sleep(200);
        return this;
    }

    public HotelListingPage PopulateEmail(String email) throws InterruptedException
    {
        txtEmail.sendKeys(email);
        Thread.sleep(200);
        return this;
    }

    public HotelListingPage ClickCreateHotel() throws InterruptedException
    {
        Thread.sleep(200);
        btnCreate.click();
        Thread.sleep(200);
        return new HotelListingPage(driver);
    }

    public String ReadHotelName(int index)
    {
        return driver.findElement(By.id(lblHotelName+index)).getText();
    }

    public int HotelCount()
    {
        return lstHotels.size();
    }
}
