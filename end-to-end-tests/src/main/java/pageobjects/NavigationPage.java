package pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class NavigationPage extends BasePage
{
    @FindBy(how = How.CSS, using = "#login a")
    private WebElement btnLogin;

    public NavigationPage(WebDriver driver)
    {
        super(driver);
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a.navbar-brand")));
    }

    public LoginPage ClickLogin()
    {
        btnLogin.click();
        return new LoginPage(driver);
    }
}
