# development stage
FROM node:22-alpine AS base

WORKDIR /app/auth

COPY ./auth/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./auth ./

EXPOSE 5000

CMD [ "npm","run","docker"]
