# development stage
FROM node:22-alpine AS base

WORKDIR /app/auth

COPY ./auth/package.json ./
COPY ./package-lock.json ./

# COPY ./package.json ../

COPY  .npmrc /app/auth/

RUN npm ci

COPY ./auth ./

EXPOSE 5000

CMD [ "npm","run","docker"]
