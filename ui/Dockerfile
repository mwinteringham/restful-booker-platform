FROM node:5

EXPOSE 3003

ADD . /usr/local/ui

CMD cd /usr/local/ui && npm install

ENTRYPOINT sleep 5 && npm start
