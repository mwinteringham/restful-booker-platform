mvn clean install

function clean_up {
    echo Killing web services
    wmic process where "name like '%java%'" delete
}

trap clean_up SIGHUP SIGINT SIGTERM

START java -jar -Dspring.profiles.active=dev auth/target/restful-booker-platform-auth-1.0-SNAPSHOT.jar
START java -jar -Dspring.profiles.active=dev booking/target/restful-booker-platform-booking-1.0-SNAPSHOT.jar
START java -jar -Dspring.profiles.active=dev room/target/restful-booker-platform-room-1.0-SNAPSHOT.jar
START java -jar -Dspring.profiles.active=dev report/target/restful-booker-platform-report-1.0-SNAPSHOT.jar
START java -jar -Dspring.profiles.active=dev search/target/restful-booker-platform-search-1.0-SNAPSHOT.jar

cd ui && npm start