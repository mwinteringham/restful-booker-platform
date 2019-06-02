package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.w3c.dom.html.HTMLInputElement;

public class NavPage extends BasePage {

    @FindBy(how = How.CSS, using  =".navbar-brand")
    private WebElement divNavBar;

    @FindBy(how = How.ID, using = "search")
    private WebElement inputSearchTerm;

    @FindBy(how = How.ID, using = "reportLink")
    private WebElement aReportLink;

    @FindBy(how = How.ID, using = "brandingLink")
    private WebElement aBranding;

    @FindBy(how = How.CSS, using = ".fa-inbox")
    private WebElement aNotification;

    @FindBy(how = How.ID, using = "frontPageLink")
    private WebElement aFrontPage;

    public NavPage(WebDriver driver) {
        super(driver);
    }

    public WebElement getDivNavBar() {
        return divNavBar;
    }

    public void clickReport() {
        aReportLink.click();
    }

    public void clickBranding() {
        aBranding.click();
    }

    public void clickNotification() {
        aNotification.click();
    }

    public void clickFrontPage() {
        aFrontPage.click();
    }
}
