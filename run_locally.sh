#!/usr/bin/env bash

mvn clean install

trap "kill 0" EXIT

java -jar auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar &
java -jar booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar &
java -jar room/target/restful-booker-platform-room-*-SNAPSHOT.jar &
java -jar report/target/restful-booker-platform-report-*-SNAPSHOT.jar &
java -jar search/target/restful-booker-platform-search-*-SNAPSHOT.jar &

cd ui && npm start &

wait