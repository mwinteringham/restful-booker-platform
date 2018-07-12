call mvn clean install

START java -jar auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar
START java -jar booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar
START java -jar room/target/restful-booker-platform-room-*-SNAPSHOT.jar
START java -jar report/target/restful-booker-platform-report-*-SNAPSHOT.jar
START java -jar search/target/restful-booker-platform-search-*-SNAPSHOT.jar

cd ui && npm start