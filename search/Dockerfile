FROM node:5

EXPOSE 3002

ADD . /usr/local/search

CMD cd /usr/local/search && npm install

ENTRYPOINT sleep 5 && npm start
