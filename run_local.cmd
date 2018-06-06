mvn clean install

java -jar auth/target/restful-booker-platform-auth-*-SNAPSHOT.jar &
java -jar booking/target/restful-booker-platform-booking-*-SNAPSHOT.jar &
java -jar hotel/target/restful-booker-platform-hotel-*-SNAPSHOT.jar &
java -jar report/target/restful-booker-platform-report-*-SNAPSHOT.jar &
java -jar search/target/restful-booker-platform-search-*-SNAPSHOT.jar &

cd ui && npm start