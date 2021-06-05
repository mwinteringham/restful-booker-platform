FROM openjdk:15-slim

ADD . /usr/local/booking

WORKDIR /usr/local/booking

COPY target ./

ENV authDomain=rbp-auth
ENV messageDomain=rbp-message

ENTRYPOINT java -jar -Dspring.profiles.active=prod -Dhoneycomb.beeline.write-key=${HONEYCOMB_API_KEY} target/restful-booker-platform-booking-*.jar -D