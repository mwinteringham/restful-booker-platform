package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

public class ReportPage extends BasePage{

    @FindBy(how = How.CSS, using = ".rbc-calendar")
    private WebElement divHeatmap;

    public ReportPage(WebDriver driver) {
        super(driver);
    }

    public Boolean reportExists() {
        return divHeatmap.isDisplayed();
    }
}
