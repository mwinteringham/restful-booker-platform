# restful-booker-platform
A platform of web services that form a Hotel booking system for training others on how to explore and test web service platforms as well as strategise and implement automation in testing strategies.

## Requirements
RBP is currently known to work with the following requirements:

### Production
- Docker 17.12.0
- Docker Compose 1.18.0

### Development
- JDK 1.8
- Maven 3.3.9
- Node 6.10.3
- NPM 3.3.9

## Installation

### Production
You will require Docker and Docker-compose to run RBP in production mode (as in none of the APIs running standalone). The following steps will guide you to getting setup:

1. Clone the repo
2. Navigate into the restful-booker-platform root folder
3. Run ```docker-compose build``` to generate images
4. Run ```docker-compose up``` to start the platform
5. Navigate to http://localhost:3003 to access the site

#### Login
The user login details are:
* Username: admin
* Password: password

### Development

#### Java APIs
For the Java APIs these can be run via Maven. You have the choice to navigating to the root folder and running ```mvn clean package``` to run tests and build a JAR. The other option is to run the application via your IDE and running hotel/src/main/java/api/Application.java to start up the API inside your IDE for debugging.

#### Node Frontend
For the node UI API you will need to run the following:

1. Navigate to root ```/ui``` folder
2. Run ```npm install``` to download necessary dependencies
3. Run ```npm start``` to run the UI API
4. Alternatively run ```npm test``` to run Jest tests

## Logging and documentation

Logging and documentation is available for each of the services on their own separate endpoints.

### Java APIs

Logging for that API can be found on the endpoint /logfile
API documentation exists at /swagger-ui.html

### Node APIs

Logging for the UI API exists on port 9003. Update the port to 9003 and the logging will appear.
There is no Swagger documentation for the UI.
