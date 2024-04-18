FROM node:20-alpine

LABEL org.opencontainers.image.source = "https://github.com/Luxxy-GF/octopus-bot"

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
COPY ./ /usr/src/bot/

RUN npm install

CMD ["node index.js"]