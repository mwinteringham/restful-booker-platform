@echo off

echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####       PRE FLIGHT CHECKS       ####
echo ####                               ####
echo #######################################
echo:

where java >nul 2>nul
if %errorlevel%==1 (
    @echo Java Runtime not found in path.
    exit
)

where javac >nul 2>nul
if %errorlevel%==1 (
    @echo Java SDK not found in path.
    exit
)

where mvn >nul 2>nul
if %errorlevel%==1 (
    @echo Maven not found in path.
    exit
)

where node >nul 2>nul
if %errorlevel%==1 (
    @echo Node not found in path.
    exit
)

where npm >nul 2>nul
if %errorlevel%==1 (
    @echo NPM not found in path.
    exit
)

call mvn clean

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####      BUILDING FRONTEND        ####
echo ####                               ####
echo #######################################
echo:

cd ui/js
call npm install
call npm run build

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####       BUILDING BACKEND        ####
echo ####                               ####
echo #######################################
echo:

cd ../..

call mvn install

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####    STARTING APPLICATION...    ####
echo ####                               ####

START /B java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-1.0-SNAPSHOT.jar > auth.log
START /B java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-1.0-SNAPSHOT.jar > booking.log
START /B java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-1.0-SNAPSHOT.jar > room.log
START /B java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-1.0-SNAPSHOT.jar > report.log
START /B java -jar -Dspring.profiles.active=dev search/target/restful-booker-platform-search-1.0-SNAPSHOT.jar > search.log
START /B java -jar -Dspring.profiles.active=dev ui/api/target/restful-booker-platform-ui-1.0-SNAPSHOT.jar > ui.log

echo ####      APPLICATION STARTED      ####
echo ####                               ####
echo ####         Available at:         ####
echo ####     http://localhost:3003     ####
echo ####                               ####
echo ####      PRESS ENTER TO QUIT      ####
echo ####                               ####
echo #######################################
echo:
set /p=

echo Exiting Restful-booker-platform....
taskkill /f /im java.exe
