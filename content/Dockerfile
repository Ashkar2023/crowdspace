FROM node:22 AS build

WORKDIR /app/content

COPY ./content/package.json ./
COPY package-lock.json ./

ENV NODE_ENV=development

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci 

COPY ./content ./

RUN npm run build

EXPOSE 5000

CMD [ "npm","start"]


FROM node:22-alpine AS production

WORKDIR /app/content

COPY --from=build /app/content/dist ./dist

COPY ./content/package.json ./ 
COPY package-lock.json ./ 

ENV NODE_ENV=production

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci --omit=dev

EXPOSE 5000

CMD [ "node", "dist/index.js" ]