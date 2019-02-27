FROM openjdk:8-jre-alpine

ADD . /usr/local/branding

WORKDIR /usr/local/branding

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-branding-1.0-SNAPSHOT.jar -D