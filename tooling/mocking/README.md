# Wiremock

Wiremock is a test double for Web APIs allowing you to create fake HTTP requests and responses that act like a real Web API.

## Using Wiremock

To start up Wiremock, navigate to this folder and run:

```
java -jar wiremock-standalone.jar --port {your port number}
```

This will start up Wiremock assuming nothing else is running on the port number you gave it

## Creating requests and responses

Wiremock-standalone can be programmed in two different ways. The first is creating .json mappings and adding them to the ```mappings folder```. When you start up Wiremock these mapping files will be loaded into Wiremock.

The other option is to programme 'over the wire', which means creating an HTTP request with your mapping details and sending it to Wiremock over HTTP.

To learn more, Wiremock has very well laid out documentation on how to use it (here)[http://wiremock.org/docs]