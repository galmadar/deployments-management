FROM node:12-alpine

WORKDIR /usr/src/app

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./tsconfig.json ./tsconfig.json

RUN yarn install
RUN yarn build

CMD ["node", "dist/server.js"]
