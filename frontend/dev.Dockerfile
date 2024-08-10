FROM node:20

WORKDIR /usr/src/app


COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

# Development modessa käytetään npm install, ei npm ci !
RUN npm install

#COPY ./dist ./dist
COPY ./public ./public
COPY ./src ./src
COPY ./.eslintrc.cjs ./.eslintrc.cjs
COPY ./.prettierrc ./.prettierrc
COPY ./.env ./.env
COPY ./index.html ./index.html
COPY ./README.md ./README.md
COPY ./vite.config.js ./vite.config.js
#COPY ./Dockerfile ./Dockerfile


# npm run dev käynnistää soveluksen development tilassa
# extra viivat -- --host tarvitaan että server on näkyvissä kontin ulkopuolella
CMD ["npm", "run", "dev", "--", "--host"]