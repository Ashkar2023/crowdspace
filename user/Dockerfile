# development stage
FROM node:22-alpine AS development

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY ./user ./user

WORKDIR /app/user

EXPOSE 3000

CMD [ "yarn","run","dev" ]