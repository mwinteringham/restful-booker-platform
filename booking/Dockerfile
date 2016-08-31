FROM node:5

ADD . /usr/local/booking

WORKDIR /usr/local/booking

RUN npm install
RUN npm install frontail -g
RUN touch booking.log

ENTRYPOINT sleep 5 && npm start & frontail -t dark -p 9000 booking.log
