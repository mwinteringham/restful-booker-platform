docker-compose up -d mysql

java -jar auth\target\restful-booker-platform-auth-1.0-SNAPSHOT.jar &
java -jar booking\target\restful-booker-platform-booking-1.0-SNAPSHOT.jar &
java -jar hotel\target\restful-booker-platform-hotel-1.0-SNAPSHOT.jar &
java -jar report\target\restful-booker-platform-report-1.0-SNAPSHOT.jar &

cd ui
npm start