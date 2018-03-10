FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/report

WORKDIR /usr/local/report

COPY src ./
COPY pom.xml ./

ENV mysqlDomain=mysql

RUN mvn clean package

ENTRYPOINT java -jar target/restful-booker-platform-report-1.0-SNAPSHOT.jar -D