FROM node:22-alpine AS base

WORKDIR /app/gateway

COPY package-lock.json ./
COPY ./gateway/package.json ./
COPY .npmrc ./

RUN npm ci

COPY ./gateway ./

EXPOSE 9000

CMD ["npm","run","docker"]
