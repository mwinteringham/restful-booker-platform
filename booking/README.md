# Restful-booker-booking

Booking is responsible for creating, reading, updating and deleting booking data from the database to share with other services.

## Running the checks

To only run the checks run ```mvn clean test```

## Building the API

To build this API run ```mvn clean package``` this will run the tests and then create a .JAR file that can be run.

## Running the API

The Booking API takes the following environment variables:

* dbRefresh - Setting with a number such as 10 will cause the API to reset it's DB every 10 minutes. Leaving it blank or setting 0 will not cause the DB to reset
* dbServer - Setting this variable to true will enable the DB in 'server mode' allowing you to connect to the DB externally using tools such as SquirrelSQL   

To run the API, ensure that you have first built it and then run ```java -jar target/restful-booker-platform-booking-1.0-SNAPSHOT.jar```. This will start up the API, allowing you to access it's endpoints.

## Documentation

To access this API's endpoint documentation, head to ```http://localhost:3000/booking/swagger-ui/index.html```. You can also find out the health of the application by accessing ```http://localhost:3000/booking/actuator/health```. Finally, to access the APIs logfiles, head to ```http://localhost:3000/booking/actuator/logfile```
