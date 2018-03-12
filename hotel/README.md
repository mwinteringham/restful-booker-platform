# Restful-booker-hotel

Hotel is responsible for creating, reading, updating and deleting hotel data from the database to share with other services.

## Building

To build this API run ```mvn clean package``` this will run the tests and then create a .JAR file that can be run.

## Running

To run the API, ensure that you have first built it and then run ```java -jar target/restful-booker-platform-hotel-1.0-SNAPSHOT.jar```. This will start up the API, allowing you to access it's endpoints.

## Documentation

To access this API's endpoint documentation, head to ```http://localhost:3001/swagger-ui.html```. You can also find out the health of the application by accessing ```http://localhost:3001/health```. . Finally to access the APIs logfiles, head to ```http://localhost:3001/logfile```