#!/bin/sh

printf "####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####       PRE FLIGHT CHECKS       ####
####                               ####
#######################################\n"


if ! type -p java; then
    printf "The Java Runtime Environment is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupjava\n"
    exit
fi

if ! type -p javac; then
    printf "The Java Development Kit is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupjava\n"
    exit
fi

if ! type -p mvn; then
    printf "Maven is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupmaven\n"
    exit
fi

if [[ -z "${JAVA_HOME}" ]]; then
  printf "JAVA_HOME has not been set. To learn how to set it please visit:
    https://automationintesting.com/setup/settingupmaven\n"
  exit
fi

if ! type -p node; then
    printf "Node is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupnode\n"
    exit
fi

if ! type -p npm; then
    printf "Npm is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupnode\n"
    exit
fi

mvn clean

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####      BUILDING FRONTEND        ####
####                               ####
#######################################\n"

cd ui/js
npm install
npm run build

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####       BUILDING BACKEND        ####
####                               ####
#######################################\n"

cd ../..

mvn install

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
java -jar -Dspring.profiles.active=dev search/target/restful-booker-platform-search-*-SNAPSHOT.jar > search.log &
java -jar -Dspring.profiles.active=dev ui/api/target/restful-booker-platform-ui-*-SNAPSHOT.jar > ui.log &

node .utilities/monitor/local_monitor.js

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####    RUNNING E2E CHECKS         ####
####                               ####
#######################################\n"

cd end-to-end-tests

mvn clean test

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####      APPLICATION READY        ####
####                               ####
####         Available at:         ####
####     http://localhost:3003     ####
####                               ####
#######################################"

wait