FROM openjdk:8-jre-alpine

ADD . /usr/local/room

WORKDIR /usr/local/room

COPY target ./

ENV authDomain=rbp-auth
ENV bookingDomain=rbp-booking

ENTRYPOINT java -jar target/restful-booker-platform-room-1.0-SNAPSHOT.jar -D