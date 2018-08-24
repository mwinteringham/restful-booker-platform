#!/usr/bin/env bash

mvn clean install

trap "kill 0" EXIT

java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar &
java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar &
java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-*-SNAPSHOT.jar &
java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-*-SNAPSHOT.jar &
java -jar -Dspring.profiles.active=dev search/target/restful-booker-platform-search-*-SNAPSHOT.jar &

cd ui && npm start &

wait