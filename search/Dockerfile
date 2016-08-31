FROM node:5

ADD . /usr/local/search

WORKDIR /usr/local/search

RUN npm install
RUN npm install frontail -g
RUN touch search.log

ENTRYPOINT sleep 5 && npm start & frontail -t dark -p 9002 search.log
