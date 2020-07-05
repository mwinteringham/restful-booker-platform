# restful-booker-platform [![CircleCI](https://circleci.com/gh/mwinteringham/restful-booker-platform.svg?style=svg)](https://circleci.com/gh/mwinteringham/restful-booker-platform)
A platform of web services that form a Hotel booking system for training others on how to explore and test web service platforms as well as strategise and implement automation in testing strategies.

## Requirements
RBP is currently known to work with the following requirements:

- JDK 14.0.1
- Maven 3.6.3
- Node 12.13.0
- NPM 6.12.0

## Building locally

You will require Java SDK 11, Maven and Node/Npm installed and available in your terminal to run RBP. To get started follow these instructions:

1. Clone/Download the repository
2. Navigate into the restful-booker-platform root folder
3. Run either ```bash build_locally.sh``` on Linux or Mac or ```build_locally.cmd``` on Windows to build RBP and get it running (It may take a while on the first run as it downloads dependencies)
4. Navigate to http://localhost:8080 to access the site

## Running locally

Assuming you have successfully built the application at least once, you can now run the app without having to rebuild the whole application.

### Mac / Linux
1. To run without end-to-end checks run: ```run_locally.sh```
2. To run with end-to-end checks run: ```run_locally.sh -e true```

### Windows
1. To run without end-to-end checks run: ```run_locally.cmd```
2. To run with end-to-end checks run: ```run_locally.cmd true```

### Login
The user login details are:
* Username: admin
* Password: password

### Development

The details on running checks, building APIs and additional details on documentation for development are found in READMEs inside each of the API folders.
