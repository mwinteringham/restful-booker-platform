# RBP End to End checks

This module is responsible for running fullstack checks against RBP once it is successfully running.

## Running RBP checks

To run RBP checks you will need to configure the following environmental variables:

* TARGET - Set this to `production` if you would like to run the e2e checks against automationintesting.online. If not, leave blank to run against localhost.  
* BROWSER - Sets which browser you would like to run the e2e checks against. Current options are `chrome` and `remote`. `remote` works with Sauce labs and requires a valid Sauce labs username and access key.
* SAUCE_USERNAME - If you are using `BROWSER = remote` then you will need to set `SAUCE_USERNAME` to the username set in your Sauce labs account.
* SAUCE_ACCESS_KEY - If you are using `BROWSER = remote` then you will need to set `SAUCE_ACCESS_KEY` to the access key set in your Sauce labs account. You can find the access key here: [https://app.saucelabs.com/user-settings](https://app.saucelabs.com/user-settings)

With your environmental variables set. Simply run `mvn clean test` to start the checks.