# development stage
FROM node:22-alpine AS base

WORKDIR /app/chat

COPY ./chat/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./chat ./

EXPOSE 5000

CMD [ "npm","run","docker"]
