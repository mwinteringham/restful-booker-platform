FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/search

WORKDIR /usr/local/search

COPY target ./

ENV authDomain=auth
ENV bookingDomain=booking
ENV roomDomain=room

ENTRYPOINT java -jar target/restful-booker-platform-search-1.0-SNAPSHOT.jar -D