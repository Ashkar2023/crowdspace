FROM node:alpine

WORKDIR /user
COPY . .

USER root

EXPOSE 3000

RUN yarn install
RUN yarn run build

CMD [ "yarn" ]