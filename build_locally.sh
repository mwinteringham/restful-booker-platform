#!/bin/sh -e

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

if ! node -v; then
    printf "Node is missing or broken. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupnode\n"
    exit
fi

if ! type -p npm; then
    printf "Npm is missing. To learn how to install it please visit:
    https://automationintesting.com/setup/settingupnode\n"
    exit
fi

printf "\n####### RESTFUL-BOOKER-PLATFORM #######
####                               ####
####       BUILDING PROJECT        ####
####                               ####
#######################################\n"

mvn clean

if [[ -z "${APPLITOOLS_API_KEY}" ]]; then
  printf "Skipping visual checks because no applitools api key has been set. Assign a key to APPLITOOLS_API_KEY to run visual checks"
  mvn install
else
  mvn install -P ci
fi

/bin/bash ./run_locally.sh -e true
