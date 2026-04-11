# restful-booker-platform
A platform of web services that forms a Bed and Breakfast booking system. The platforms primary purpose is for  training others on how to explore and test web service platforms as well as strategise and implement automation in testing strategies.

## Requirements
RBP is currently known to work with the following requirements:

- JDK 26 or higher (Tested with JDK 26)
- Maven 3.9.14
- Node 24.14.1
- NPM 11.11.0

## Building locally

Assuming you have the above requirements in place, to get started open a terminal/command line window and follow these instructions:

1. Clone/Download the repository
2. Navigate into the restful-booker-platform root folder
3. Run either ```bash build_locally.sh``` for Linux or Mac or ```build_locally.cmd``` on Windows to build RBP and get it running (It may take a while on the first run as it downloads dependencies)
4. Navigate to http://localhost:3003 to access the site

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
