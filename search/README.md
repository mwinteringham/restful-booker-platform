# Restful-booker-search

Search is responsible for searching for rooms and bookings that match a specific keyword.

## Building

To build this API run ```mvn clean package``` this will run the tests and then create a .JAR file that can be run.

## Running

To run the API, ensure that you have first built it and then run ```java -jar target/restful-booker-platform-search-1.0-SNAPSHOT.jar```. This will start up the API, allowing you to access it's endpoints.

## Documentation

To access this API's endpoint documentation, head to ```http://localhost:3002/swagger-ui.html```. You can also find out the health of the application by accessing ```http://localhost:3002/health```. Finally to access the APIs logfiles, head to ```http://localhost:3002/logfile```