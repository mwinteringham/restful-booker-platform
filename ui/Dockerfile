FROM node:5

ADD . /usr/local/ui

WORKDIR /usr/local/ui

RUN npm install
RUN npm install frontail -g
RUN touch ui.log

ENTRYPOINT sleep 5 && npm start & frontail -t dark -p 9003 ui.log
