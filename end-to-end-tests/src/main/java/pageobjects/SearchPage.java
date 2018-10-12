package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

import java.util.List;


public class SearchPage extends BasePage {

    @FindBy(how = How.CSS, using = ".searchResult")
    private List<WebElement> divSearchResults;

    public SearchPage(WebDriver driver) {
        super(driver);
    }

    public List<WebElement> getSearchResults() {
        return divSearchResults;
    }
}
