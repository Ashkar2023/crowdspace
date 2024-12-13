# development stage
FROM node:22-alpine AS development

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY ./auth ./auth

WORKDIR /app/auth

EXPOSE 5000

CMD [ "yarn","run","dev" ]