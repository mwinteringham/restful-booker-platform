FROM node:5

ADD . /usr/local/auth

WORKDIR /usr/local/auth

RUN npm install
RUN npm install frontail -g
RUN touch auth.log

ENTRYPOINT sleep 5 && npm start & frontail -t dark -p 9004 auth.log
