FROM node:slim

ARG PORT_NUMBER

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE $PORT_NUMBER

RUN yarn start:dev
