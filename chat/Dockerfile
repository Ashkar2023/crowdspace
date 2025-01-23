# development stage
FROM node:22-alpine AS development

WORKDIR /app/chat

COPY ./chat/package.json ./

COPY ./package.json ../
COPY ./package-lock.json ../

COPY  ./.npmrc /app/

RUN npm ci install -w chat

COPY ./chat ./

EXPOSE 7070

CMD [ "npm","run","docker"]