#!/usr/bin/env bash

java -jar ../booking/target/restful-booker-platform-booking-1.0-SNAPSHOT.jar &
java -jar ../report/target/restful-booker-platform-report-1.0-SNAPSHOT.jar &
java -jar ../auth/target/restful-booker-platform-auth-1.0-SNAPSHOT.jar &

sleep 10

mvn clean integration-test