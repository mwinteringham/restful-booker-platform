FROM eclipse-temurin:26-jre-alpine

WORKDIR /app

# Use the executable JAR
COPY target/restful-booker-platform-room-*-exec.jar ./room.jar

ENV authDomain=rbp-auth
ENV bookingDomain=rbp-booking
ENV profile=prod

ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:MaxMetaspaceSize=96m -XX:+UseContainerSupport"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar -Dspring.profiles.active=$profile -Dhoneycomb.beeline.write-key=${HONEYCOMB_API_KEY} ./room.jar"]
