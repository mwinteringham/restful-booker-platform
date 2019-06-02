FROM openjdk:8-jre-alpine

ADD . /usr/local/assets

WORKDIR /usr/local/assets

COPY api/target ./

ENTRYPOINT java -jar -Dspring.profiles.active=prod restful-booker-platform-assets-1.0-SNAPSHOT.jar
