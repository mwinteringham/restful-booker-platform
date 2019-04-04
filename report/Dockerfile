FROM openjdk:8-jre-alpine

ADD . /usr/local/report

WORKDIR /usr/local/report

COPY target ./

ENV roomDomain=rbp-room
ENV bookingDomain=rbp-booking

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-report-1.0-SNAPSHOT.jar -D