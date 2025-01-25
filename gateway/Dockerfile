# development stage
FROM node:22-alpine AS base

WORKDIR /app/gateway

COPY ./gateway/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./gateway ./

EXPOSE 5000

CMD [ "npm","run","docker"]
