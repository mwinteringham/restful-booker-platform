package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage extends BasePage
{
    @FindBy(how = How.ID, using ="username")
    private WebElement txtUsername;

    @FindBy(how = How.ID, using ="password")
    private WebElement txtPassword;

    @FindBy(how = How.ID, using ="doLogin")
    private WebElement btnLogin;

    public LoginPage(WebDriver driver)
    {
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("loginModal")));
    }

    public LoginPage PopulateUsername(String username)
    {
        txtUsername.sendKeys(username);
        return this;
    }

    public LoginPage PopulatePassword(String password)
    {
        txtPassword.sendKeys(password);
        return this;
    }

    public HotelListingPage ClickLogin()
    {
        btnLogin.click();
        return new HotelListingPage(driver);
    }

}
