package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class BrandingPage extends BasePage {

    @FindBy(how = How.ID, using = "name")
    private WebElement inpName;

    public BrandingPage(WebDriver driver) {
        super(driver);
    }

    public String getNameValue() throws InterruptedException {
        Thread.sleep(1000);
        return inpName.getAttribute("value");
    }
}
