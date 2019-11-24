@echo off

set DO_E2E=%1

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####    STARTING APPLICATION...    ####
echo ####                               ####
echo #######################################
echo \n

START /B java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-*.jar > auth.log
START /B java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-*.jar > booking.log
START /B java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-*.jar > room.log
START /B java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-*.jar > report.log
START /B java -jar -Dspring.profiles.active=dev branding/target/restful-booker-platform-branding-*.jar > branding.log
START /B java -jar -Dspring.profiles.active=dev message/target/restful-booker-platform-message-*.jar > message.log &
START /B java -jar -Dspring.profiles.active=dev assets/api/target/restful-booker-platform-assets-*.jar > ui.log

START /B node .utilities/rbp-proxy/local/proxy.js
call node .utilities/monitor/local_monitor.js

echo:
echo \n
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####    RUNNING E2E CHECKS         ####
echo ####                               ####
echo #######################################

if "%DO_E2E%" == "true" (
  cd %cmdFileDirectory%end-to-end-tests
  call mvn clean test
  cd ..
) else (
  echo:
  echo:         SKIPPING E2E TESTS
  echo:  Add true argument to run E2E tests
)

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####      APPLICATION READY        ####
echo ####                               ####
echo ####         Available at:         ####
echo ####     http://localhost:8080     ####
echo ####                               ####
echo ####      PRESS ENTER TO QUIT      ####
echo ####                               ####
echo #######################################
echo:
set /p=

echo Exiting Restful-booker-platform....
taskkill /f /im java.exe
taskkill /f /im node.exe