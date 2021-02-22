FROM openjdk:15-slim

ADD . /usr/local/branding

WORKDIR /usr/local/branding

COPY target ./

ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=prod target/restful-booker-platform-branding-*.jar -D