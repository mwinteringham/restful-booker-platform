FROM openjdk:15-slim

ADD . /usr/local/branding

WORKDIR /usr/local/branding

COPY target ./

ENV profile=dev
ENV authDomain=rbp-auth

ENTRYPOINT java -jar -Dspring.profiles.active=$profile -Dhoneycomb.beeline.write-key=${HONEYCOMB_API_KEY} target/restful-booker-platform-branding-*.jar -D