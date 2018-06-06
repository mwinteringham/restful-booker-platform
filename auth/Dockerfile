FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/auth

WORKDIR /usr/local/auth

COPY target ./

ENTRYPOINT java -jar restful-booker-platform-auth-1.0-SNAPSHOT.jar