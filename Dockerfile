# build dependencies
FROM node:lts-alpine as builder

RUN apk update && apk --no-cache add python make g++

COPY package*.json ./

RUN npm install

# build app
FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder node_modules node_modules

COPY --chown=node:node . .

EXPOSE 5001

CMD [ "node", "server.js" ]
