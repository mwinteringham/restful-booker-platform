FROM openjdk:11-jre-slim

ADD . /usr/local/assets

WORKDIR /usr/local/assets

COPY api/target ./

ENTRYPOINT java -jar -Dspring.profiles.active=prod restful-booker-platform-assets-*.jar
