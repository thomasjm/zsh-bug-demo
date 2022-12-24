
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y zsh npm

RUN mkdir /app
COPY package.json /app
COPY package-lock.json /app
RUN cd /app && npm install

COPY index.js /app

CMD node /app/index.js
