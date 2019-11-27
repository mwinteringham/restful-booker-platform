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
#######################################\n\n"

trap "kill 0" EXIT

java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-*.jar > auth.log &
java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-*.jar > booking.log &
java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-*.jar > room.log &
java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-*.jar > report.log &
java -jar -Dspring.profiles.active=dev branding/target/restful-booker-platform-branding-*.jar > branding.log &
java -jar -Dspring.profiles.active=dev message/target/restful-booker-platform-message-*.jar > message.log &
java -jar -Dspring.profiles.active=dev assets/api/target/restful-booker-platform-assets-*.jar > ui.log &

node .utilities/rbp-proxy/local/proxy.js &
node .utilities/monitor/local_monitor.js

printf "\n\n####### RESTFUL-BOOKER-PLATFORM #######
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
####     http://localhost:8080     ####
####                               ####
#######################################"

wait
