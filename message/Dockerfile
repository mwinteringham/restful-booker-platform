FROM openjdk:15-slim

ADD . /usr/local/message

WORKDIR /usr/local/message

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-message-*.jar -D