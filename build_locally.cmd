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

cd %cmdFileDirectory%.utilities\rbp-proxy\local
call npm install
cd %cmdFileDirectory%

cd %cmdFileDirectory%assets\js
call npm install
call npm test
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

CALL run_locally.cmd true
