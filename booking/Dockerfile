FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/auth

WORKDIR /usr/local/auth

COPY src ./
COPY pom.xml ./

ENV authDomain=auth
ENV mysqlDomain=mysql

RUN mvn clean package

ENTRYPOINT java -jar target/restful-booker-platform-booking-1.0-SNAPSHOT.jar -D