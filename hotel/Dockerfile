FROM node:5

EXPOSE 3000

ADD . /usr/local/hotel

ENTRYPOINT sleep 5 && cd /usr/local/hotel && npm install && npm start
