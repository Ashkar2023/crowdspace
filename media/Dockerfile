# development stage
FROM node:22-alpine AS development

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY ./media ./media

WORKDIR /app/media

EXPOSE 5000

CMD [ "yarn","run","dev" ]