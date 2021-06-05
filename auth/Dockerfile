FROM openjdk:15-slim

ADD . /usr/local/auth

WORKDIR /usr/local/auth

COPY target ./

ENTRYPOINT java -jar -Dspring.profiles.active=prod -Dhoneycomb.beeline.write-key=${HONEYCOMB_API_KEY} restful-booker-platform-auth-*.jar