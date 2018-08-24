FROM openjdk:8-jre-alpine

ADD . /usr/local/auth

WORKDIR /usr/local/auth

COPY target ./

ENTRYPOINT java -jar -Dspring.profiles.active=prod restful-booker-platform-auth-1.0-SNAPSHOT.jar