FROM node:5

EXPOSE 3004

ADD . /usr/local/auth

CMD cd /usr/local/auth && npm install

ENTRYPOINT sleep 5 && npm start
