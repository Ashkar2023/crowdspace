# development stage
FROM node:22-alpine AS base

WORKDIR /app/user

COPY ./user/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./user ./

EXPOSE 5000

CMD [ "npm","run","docker"]
