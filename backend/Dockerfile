FROM node:20

WORKDIR /usr/src/app

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm ci --omit=dev

COPY ./controllers ./controllers
COPY ./customMW ./customMW
COPY ./migrations ./migrations
COPY ./models ./models
COPY ./util ./util
COPY ./.env ./.env
COPY ./index.js ./index.js
COPY ./README.md ./README.md


CMD npm start