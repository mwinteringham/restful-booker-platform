@echo off

echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####       PRE FLIGHT CHECKS       ####
echo ####                               ####
echo #######################################
echo:

where java >nul 2>nul
if %errorlevel%==1 (
    @echo The Java Runtime Environment is missing. To learn how to install it please visit:
    @echo https://automationintesting.com/setup/settingupjava
    @echo:
    @echo Press CTRL+C to quit
    exit
)

where javac >nul 2>nul
if %errorlevel%==1 (
    @echo The Java Development Kit is missing. To learn how to install it please visit:
    @echo https://automationintesting.com/setup/settingupjava
    @echo:
    @echo Press CTRL+C to quit
    exit
)

where mvn >nul 2>nul
if %errorlevel%==1 (
    @echo Maven is missing. To learn how to install it please visit:
    @echo https://automationintesting.com/setup/settingupmaven
    @echo:
    @echo Press CTRL+C to quit
    pause>nul
)

if "%JAVA_HOME%"=="" (
    @echo JAVA_HOME is not set. To learn how to set it please visit:
    @echo https://automationintesting.com/setup/settingupmaven
    @echo:
    @echo Press CTRL+C to quit
    pause>nul
    exit
)

where node >nul 2>nul
if %errorlevel%==1 (
    @echo Node is missing. To learn how to install it please visit:
    @echo https://automationintesting.com/setup/settingupnode
    @echo:
    @echo Press CTRL+C to quit
    pause>nul
)

where npm >nul 2>nul
if %errorlevel%==1 (
    @echo Npm is missing. To learn how to install it please visit:
    @echo https://automationintesting.com/setup/settingupmaven
    @echo:
    @echo Press CTRL+C to quit
    pause>nul
)

set cmdFileDirectory=%~dp0

cd %cmdFileDirectory%
call mvn clean

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####      BUILDING FRONTEND        ####
echo ####                               ####
echo #######################################
echo:

cd %cmdFileDirectory%ui\js
call npm install
call npm run build

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####       BUILDING BACKEND        ####
echo ####                               ####
echo #######################################
echo:

cd %cmdFileDirectory%
if defined APPLITOOLS_API_KEY (
    call mvn install
) else (
    echo Skipping visual checks because no applitools api key has been set. Assign a key to APPLITOOLS_API_KEY to run visual checks
    call mvn install -Dvisual.skip.test=true
)

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####    STARTING APPLICATION...    ####
echo ####                               ####
echo #######################################

START /B java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-1.0-SNAPSHOT.jar > auth.log
START /B java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-1.0-SNAPSHOT.jar > booking.log
START /B java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-1.0-SNAPSHOT.jar > room.log
START /B java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-1.0-SNAPSHOT.jar > report.log
START /B java -jar -Dspring.profiles.active=dev branding/target/restful-booker-platform-branding-1.0-SNAPSHOT.jar > branding.log
START /B java -jar -Dspring.profiles.active=dev ui/api/target/restful-booker-platform-ui-1.0-SNAPSHOT.jar > ui.log

call node .utilities/monitor/local_monitor.js

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####    RUNNING E2E CHECKS         ####
echo ####                               ####
echo #######################################

cd %cmdFileDirectory%end-to-end-tests
call mvn clean test

echo:
echo ####### RESTFUL-BOOKER-PLATFORM #######
echo ####                               ####
echo ####      APPLICATION READY        ####
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
