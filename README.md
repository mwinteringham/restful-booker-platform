# restful-booker-platform
A platform of web services that forms a Bed and Breakfast booking system. The platforms primary purpose is for  training others on how to explore and test web service platforms as well as strategise and implement automation in testing strategies.

## Requirements
RBP is currently known to work with the following requirements:

- JDK 15.0.2
- Maven 3.6.3
- Node 14.15.5
- NPM 6.14.11

## Building locally

Assuming you have the above requirements in place, to get started open a terminal/command line window and follow these instructions:

1. Clone/Download the repository
2. Navigate into the restful-booker-platform root folder
3. Run either ```bash build_locally.sh``` for Linux or Mac or ```build_locally.cmd``` on Windows to build RBP and get it running (It may take a while on the first run as it downloads dependencies)
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

## Development

### API details

The details on running checks, building APIs and additional details on documentation for development can be found in READMEs inside each of the API folders.

### Setting up your own CI/CD for this project 

The build process for this project is managed by [CircleCI](https://circleci.com/) which is all managed by the config.yml file in the .circleci folder. To get setup you will need to:

### Running CI tests

Follow these steps to get a CI setup running the tests 

1. Fork this repository so that you have your own copy
2. If you haven't already, create a CircleCI login using your GitHub details. This will connect CircleCI to your GitHub profile.
3. Head to the Projects page in CircleCI, locate the RBP repository and click setup project. 
4. Go through the steps to for setting up the project, ensuring that it loads in the config.yml from the project (Click use existing config)

If you would like to setup CircleCI to run a full deployment, please drop an issue into the repository.  
