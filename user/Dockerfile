FROM node:22 AS build

WORKDIR /app/user

COPY ./user/package.json ./
COPY package-lock.json ./

ENV NODE_ENV=development

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci 

COPY ./user ./

RUN npm run build

EXPOSE 5000

CMD [ "npm","run","docker"]


FROM node:22-alpine AS production

WORKDIR /app/user

COPY --from=build /app/user/dist ./dist

COPY ./user/package.json ./ 
COPY package-lock.json ./ 

ENV NODE_ENV=production

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci --omit=dev

EXPOSE 5000

CMD [ "node", "dist/index.js" ]