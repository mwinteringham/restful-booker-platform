FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/hotel

WORKDIR /usr/local/hotel

COPY target ./

ENV authDomain=auth
ENV bookingDomain=booking

ENTRYPOINT java -jar target/restful-booker-platform-hotel-1.0-SNAPSHOT.jar -D