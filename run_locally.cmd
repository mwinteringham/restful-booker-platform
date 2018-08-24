call mvn clean install

START java -jar auth/target/restful-booker-platform-auth-1.0-SNAPSHOT.jar
START java -jar booking/target/restful-booker-platform-booking-1.0-SNAPSHOT.jar
START java -jar room/target/restful-booker-platform-room-1.0-SNAPSHOT.jar
START java -jar report/target/restful-booker-platform-report-1.0-SNAPSHOT.jar
START java -jar search/target/restful-booker-platform-search-1.0-SNAPSHOT.jar

cd ui && npm start