# development stage
FROM node:22-alpine AS development

WORKDIR /app/user

COPY ./user/package.json ./

COPY ./package.json ../
COPY ./package-lock.json ../

# app/
#  |- user/ 
#       |-package.json
#  |- workspace package.json 
#  |- workspace package-lock.json

COPY ./.npmrc ../

RUN npm ci install -w user

COPY ./user ./

EXPOSE 3000

CMD [ "npm","run","dev" ]