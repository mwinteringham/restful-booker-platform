FROM openjdk:8-jre-alpine

ADD . /usr/local/booking

WORKDIR /usr/local/booking

COPY target ./

ENV authDomain=rbp-auth
ENV messageDomain=rbp-message

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-booking-1.0-SNAPSHOT.jar -D