FROM openjdk:15-slim

ADD . /usr/local/room

WORKDIR /usr/local/room

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-room-*.jar -D