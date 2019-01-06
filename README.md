# restful-booker-platform [![CircleCI](https://circleci.com/gh/mwinteringham/restful-booker-platform.svg?style=svg)](https://circleci.com/gh/mwinteringham/restful-booker-platform)
A platform of web services that form a Hotel booking system for training others on how to explore and test web service platforms as well as strategise and implement automation in testing strategies.

## Requirements
RBP is currently known to work with the following requirements:

- JDK 1.8
- Maven 3.3.9
- Node 10.15.0
- NPM 6.4.1

## Running locally

You will require Java SDK 1.8, Maven and Node/Npm installed and available in your terminal to run RBP. To get started follow these instructions:

1. Clone/Download the repository
2. Navigate into the restful-booker-platform root folder
3. Run either ```run_locally.sh``` or ```run_locally.cmd``` depending on your OS to build RBP and get it running (It may take a while on the first run as it downloads dependencies)
4. Navigate to http://localhost:3003 to access the site

### Login
The user login details are:
* Username: admin
* Password: password

### Database access

RBP uses h2 in-memory databases for ease of deployment. However, the databases have been setup with TCP access, meaning you can use a SQL client that supports h2 SQL to connect.

You can either connect to the Booking database on port ```9090``` or the Room database on port ```9091```.

**Please note: DB connections are only available in local deployments**

### Development

The details on running checks, building APIs and additional details on documentation for development are found in READMEs inside each of the API folders.
