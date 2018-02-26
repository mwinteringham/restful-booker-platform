FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/auth

WORKDIR /usr/local/auth

COPY src ./
COPY pom.xml ./

RUN mvn clean package

ENTRYPOINT java -jar target/restful-booker-platform-auth-1.0-SNAPSHOT.jar