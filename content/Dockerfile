# development stage
FROM node:22-alpine AS base

WORKDIR /app/content

COPY ./content/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./content ./

EXPOSE 5000

CMD [ "npm","run","docker"]
