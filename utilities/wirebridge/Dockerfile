FROM maven:3.5.2-jdk-8-alpine

ADD . /usr/local/wirebridge

WORKDIR /usr/local/report

COPY . ./

ENTRYPOINT java -jar Wirebridge-0.0.3.jar -D