FROM openjdk:8-jre-alpine

ADD . /usr/local/room

WORKDIR /usr/local/room

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-room-1.0-SNAPSHOT.jar -D