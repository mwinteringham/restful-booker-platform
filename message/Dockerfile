FROM openjdk:8-jre-alpine

ADD . /usr/local/message

WORKDIR /usr/local/message

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-message-1.0-SNAPSHOT.jar -D