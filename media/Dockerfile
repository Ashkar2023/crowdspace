# development stage
FROM node:22-alpine AS base

WORKDIR /app/media

COPY ./media/package.json ./
COPY package-lock.json ./

COPY  .npmrc ./

RUN npm ci

COPY ./media ./

EXPOSE 5000

CMD [ "npm","run","docker"]
