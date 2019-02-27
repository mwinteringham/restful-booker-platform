package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

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
    }

    public LoginPage populateUsername(String username)
    {
        txtUsername.sendKeys(username);
        return this;
    }

    public LoginPage populatePassword(String password)
    {
        txtPassword.sendKeys(password);
        return this;
    }

    public RoomListingPage clickLogin()
    {
        btnLogin.click();
        return new RoomListingPage(driver);
    }

}
