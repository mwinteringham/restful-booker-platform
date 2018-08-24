FROM openjdk:8-jre-alpine

ADD . /usr/local/report

WORKDIR /usr/local/report

COPY target ./

ENV roomDomain=rbp-room

ENTRYPOINT java -jar target/restful-booker-platform-report-1.0-SNAPSHOT.jar -D