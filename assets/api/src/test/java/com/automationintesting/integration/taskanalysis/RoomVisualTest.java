package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import com.xebialabs.restito.semantics.Condition;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.*;

// This test class extends the class TestSetup meaning we can inherit
// the Before and After hooks to setup Selenium and Applitools
public class RoomVisualTest extends TestSetup {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void roomListVisualTest(){
        // The UI is being checked in a 'stubbed state' meaning there are no backend APIs running. Therefore,
        // we can use WireMock to create fake APIs that send stubbed responses back to the UI to make it think
        // it is in a specific state.

        // Next, we mock the branding API that will send all the branding API details.
        whenHttp(brandingApi).
                match(Condition.get("/branding/")).
                then(ok(), header("Content-Type","application/json"), stringContent("{\"name\": \"Shady Meadows B&B\",\"map\": {\"latitude\": 52.6351204,\"longitude\": 1.2733774},\"logoUrl\": \"https://www.mwtestconsultancy.co.uk/img/rbp-logo.png\",\"description\": \"Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.\",\"contact\": {\"name\": \"Shady Meadows B&B\",\"address\": \"The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S\",\"phone\": \"012345678901\",\"email\": \"fake@fakeemail.com\"}}"));

        // Once the browser receives the first stubbed response, it will trigger the browser to send a POST response
        // to check if the app is logged in. The second stubbed response below will make the frontend believe it is
        // in a logged in state.
        whenHttp(authApi).
                match(Condition.post("/auth/validate")).
                then(ok());

        // Finally, we create a stubbed response for the Room API that will fill the UI with Rooms for the
        // rooms listing for us to check.
        whenHttp(roomApi).
            match(Condition.get("/room/")).
            then(ok(), header("Content-Type","application/json"), stringContent("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"accessible\":false,\"image\":\"https://www.mwtestconsultancy.co.uk/img/room1.jpg\",\"description\":\"Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.\",\"features\":[\"Wifi\",\"TV\",\"Safe\"]}]}"));

        // Next, we start Applitools by calling the open method and giving it the Selenium WebDriver object
        // to interact with and then details about the check and finally a fixed browser size that Applitools will
        // resize the browser to.
        eyes.open(driver, "RBP","Room List Visual Test", new RectangleSize(1400, 700));

        // Next we use Selenium to navigate to our page under test
        driver.navigate().to("http://localhost:8080/#/admin");

        // Close down the banner because we don't want to screenshot that
        driver.findElement(By.cssSelector(".btn-primary")).click();

        // Finally we trigger the Applitools check by calling 'checkWindow' that will take a screenshot of the browser
        // and upload it to Applitools cloud to compare it against a previously stored image to compare the differences
        eyes.checkWindow("Room state");
    }

}
