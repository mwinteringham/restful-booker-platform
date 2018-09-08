FROM openjdk:8-jre-alpine

ADD . /usr/local/ui

WORKDIR /usr/local/ui

COPY api/target ./

ENTRYPOINT java -jar -Dspring.profiles.active=prod restful-booker-platform-ui-1.0-SNAPSHOT.jar
