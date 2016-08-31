FROM node:5

ADD . /usr/local/hotel

WORKDIR /usr/local/hotel

RUN npm install
RUN npm install frontail -g
RUN touch hotel.log

ENTRYPOINT sleep 5 && npm start & frontail -t dark -p 9001 hotel.log
