FROM node:12

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn \
  && mv /app/node_modules /node_modules

COPY . .

EXPOSE 4000

CMD ["yarn", "start:dev"]
