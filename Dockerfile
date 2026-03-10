FROM node:20-alpine

RUN apt-get update && \
    apt-get install -y ffmpeg curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY . .

ENTRYPOINT [ "node","server.js" ]