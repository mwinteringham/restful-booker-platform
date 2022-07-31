# Restful-booker-assets

The assets API is responsible for serving the UI assets to a browser to give users easy access to the restful-booker-platform.

The assets folder is broken into two sections: ```api``` and ```js```. The ```js``` folder contains all the HTML, CSS, JavaScript and Images that make up the front end assets to create a single page application which enables UI components to be individually checked before builds. The contents of the ```js``` folder are built using ```webpack``` that bundles the frontend assets and sends them to the ```api```. The ```api``` folder contains code for the assets API that contains one endpoint that serves the frontend assets when requested. The rest of the assets part of the application is then run within the browser with JavaScript taking responsibility to create the HTML.

## Building and running

The building of the assets API is done in two stages.

1. The frontend assets should be built first so that they are compiled and sent to the ```api``` folder. To do this, navigate to the ```js``` folder and run ```npm run build``` 
2. Once the frontend assets are built. Navigate to the ```api``` folder and run ```mvn install``` (Note: Do not run ```mvn clean install``` as this will remove the frontend assets)

Once built run ```java -jar target/restful-booker-platform-ui-1.0-SNAPSHOT.jar``` in the ```api``` folder. This will start up the API, allowing you to access the UI.

## Running checks

### JS module 

To run the ```js``` checks you will need to install Jest globally ```npm install jest -g``` before running either ```npm test``` or ```jest```

### API module

The ```api``` module contains visual checks that use [Applitools](https://applitools.com/) to run the visual checking. Therefore you will need to set the following environmental variable with your [Applitools](https://applitools.com/) API key:

```APPLITOOLS_API_KEY = MY_API_KEY_ABC1234```

With that set you can then run ```mvn verify```

## Documentation

You can also find out the health of the application by accessing ```http://localhost:3003/actuator/health```. Finally, to access the APIs logfiles, head to ```http://localhost:3003/actuator/logfile``` 