#!/bin/sh

printf "####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####       PRE FLIGHT CHECKS       ####
####                               ####
#######################################\n"


if ! type -p java; then
    echo "Java Runtime not found in path."
    exit
fi

if ! type -p javac; then
    echo "Java Runtime not found in path."
    exit
fi

if ! type -p mvn; then
    echo "Maven not found in path."
    exit
fi

if ! type -p node; then
    echo "Node not found in path."
    exit
fi

if ! type -p npm; then
    echo "NPM not found in path."
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
####                               ####\n"

trap "kill 0" EXIT

java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar > auth.log &
java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar > booking.log &
java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-*-SNAPSHOT.jar > room.log &
java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-*-SNAPSHOT.jar > report.log &
java -jar -Dspring.profiles.active=dev search/target/restful-booker-platform-search-*-SNAPSHOT.jar > search.log &
java -jar -Dspring.profiles.active=dev ui/api/target/restful-booker-platform-ui-*-SNAPSHOT.jar > ui.log &

printf "####      APPLICATION STARTED      ####
####                               ####
####         Available at:         ####
####     http://localhost:3003     ####
####                               ####
#######################################"

wait