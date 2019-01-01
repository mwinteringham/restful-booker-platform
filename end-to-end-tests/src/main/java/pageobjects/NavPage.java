package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class NavPage extends BasePage {

    @FindBy(how = How.CSS, using  =".navbar")
    private WebElement divNavBar;

    @FindBy(how = How.ID, using = "search")
    private WebElement inputSearchTerm;

    @FindBy(how = How.ID, using = "reportLink")
    private WebElement aReportLink;

    public NavPage(WebDriver driver) {
        super(driver);
    }

    public WebElement getDivNavBar() {
        return divNavBar;
    }

    public void clickReport() {
        aReportLink.click();
    }

}
