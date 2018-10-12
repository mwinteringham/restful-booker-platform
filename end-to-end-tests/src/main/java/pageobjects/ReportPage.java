package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class ReportPage extends BasePage{

    @FindBy(how = How.CSS, using = "canvas")
    private WebElement canvasReport;

    public ReportPage(WebDriver driver) {
        super(driver);
    }

    public WebElement getReport() {
        return canvasReport;
    }
}
