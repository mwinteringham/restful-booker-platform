FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/booking

WORKDIR /usr/local/booking

COPY target ./

ENV authDomain=auth
ENV mysqlDomain=mysql

ENTRYPOINT java -jar target/restful-booker-platform-booking-1.0-SNAPSHOT.jar -D