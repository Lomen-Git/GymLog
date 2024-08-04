FROM node:20

WORKDIR /usr/src/app

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

# Development modessa käytetään npm install, ei npm ci !
RUN npm install

COPY ./controllers ./controllers
COPY ./customMW ./customMW
COPY ./migrations ./migrations
COPY ./models ./models
COPY ./util ./util
COPY ./.env ./.env
COPY ./index.js ./index.js
COPY ./README.md ./README.md

ENV DEBUG=playground:*

# npm run dev käynnistää soveluksen development tilassa
# extra viivat -- --host tarvitaan että server on näkyvissä konti ulkopuolella
CMD ["npm", "run", "dev", "--", "--host"]