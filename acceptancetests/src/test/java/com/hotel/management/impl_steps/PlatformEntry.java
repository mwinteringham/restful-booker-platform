package com.hotel.management.impl_steps;

import com.hotel.management.pages.EntryPage;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.hamcrest.CoreMatchers;
import org.hamcrest.core.IsNot;
import static org.hamcrest.Matchers.*;

import static org.hamcrest.MatcherAssert.assertThat;

public class PlatformEntry {

    EntryPage entryPage;

    public PlatformEntry(EntryPage entryPage) {
        this.entryPage = entryPage;
    }

    @Given(value = "^I login as \"([^\"]*)\" and \"([^\"]*)\"$")
    public void i_login_as_and(String user, String password) {
        entryPage.provideLoginDetails(user, password).clickSubmit();
    }

    @When(value = "^I enter \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\"$")
    public void i_enter(String hotel, String address, String owner, String number, String email) {
        if (!(entryPage.listOfHotelsNames().contains(hotel)))
            entryPage.provideHotelDetails(hotel, address, owner, number, email);
        entryPage.clickCreateBTN();
    }

    @Then(value = "^I expect to see \"([^\"]*)\" in the entry list$")
    public void i_expect_to_see_in_the_entry_list(String expectedOutput) {
        assertThat(entryPage.listOfHotelsNames(), CoreMatchers.hasItems(expectedOutput));
    }

    @When(value = "^I delete an \"([^\"]*)\"$")
    public void i_delete_an(String entry) {
        entryPage.deleteHotel();
    }

    @Then(value = "^\"([^\"]*)\" must be deleted$")
    public void must_be_deleted(String hotel) {
        assertThat(entryPage.listOfHotelsNames(),not(hasItems(hotel)));
    }
}
