FROM openjdk:8-jre-alpine

ADD . /usr/local/search

WORKDIR /usr/local/search

COPY target ./

ENV authDomain=rbp-auth
ENV bookingDomain=rbp-booking
ENV roomDomain=rbp-room

ENTRYPOINT java -jar target/restful-booker-platform-search-1.0-SNAPSHOT.jar -D