# Restful-booker-ui

The UI is responsible for serving the UI assets to a browser to give users easy access to the restful-booker-platform.

## Building

To build this API you will need to run the following steps:

1. Navigate to the ```js``` folder and run ```npm install``` followed by ```npm run build```
2. With the JavaScript assets built, change directory to ```api``` and run ```mvn install``` (Do not run the ```clean``` command as it will remove the JS assets)

## Running

To run the API, ensure that you have first built it and then run ```java -jar target/restful-booker-platform-ui-1.0-SNAPSHOT.jar```. This will start up the API, allowing you to access the UI. 

## Documentation

You can also find out the health of the application by accessing ```http://localhost:3003/actuator/health```. Finally to access the APIs logfiles, head to ```http://localhost:3003/actuator/logfile``` 