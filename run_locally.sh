#!/bin/sh

while getopts e: option
  do
    case "${option}"
  in
    e) DO_E2E=${OPTARG};;
  esac
done

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####    STARTING APPLICATION...    ####
####                               ####
#######################################\n"

trap "kill 0" EXIT

java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar > auth.log &
java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar > booking.log &
java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-*-SNAPSHOT.jar > room.log &
java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-*-SNAPSHOT.jar > report.log &
java -jar -Dspring.profiles.active=dev branding/target/restful-booker-platform-branding-*-SNAPSHOT.jar > branding.log &
java -jar -Dspring.profiles.active=dev ui/api/target/restful-booker-platform-ui-*-SNAPSHOT.jar > ui.log &

node .utilities/monitor/local_monitor.js

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####    RUNNING E2E CHECKS         ####
####                               ####
#######################################\n"

if [ "$DO_E2E" = "true" ]; then
  cd end-to-end-tests

  mvn clean test
else
printf "\n          SKIPPING E2E TESTS
 Add -e true argument to run E2E tests\n"
fi

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####      APPLICATION READY        ####
####                               ####
####         Available at:         ####
####     http://localhost:3003     ####
####                               ####
#######################################"

wait
