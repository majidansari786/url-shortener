FROM node:20-alpine

RUN apk add --no-cache ffmpeg curl bash

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3232

CMD ["node", "server.js"]
