# ------------------------------------------ Build production application assets
FROM node:10.14.2-alpine@sha256:36a8d46c32eb0610c42cd6a970f3f7e04595425b9191679b5ee05bf2b713f67f as nodeBuild

LABEL application="consumer/server"
LABEL maintainer="Paul Costigan"
LABEL version="[ci]"
LABEL build_src="[ci]"

ARG APP_FOLDER=/opt/app/

ENV APP_PORT=5000
ENV MONGO_PORT=27017
ENV MONGO_HOST=mongo
ENV MONGO_DB=MyDb
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_EXPIRY=3600
ENV RABBIT_USER=user
ENV RABBIT_PASS=user
ENV RABBIT_VHOST=vhost
ENV RABBIT_PORT=5672

WORKDIR ${APP_FOLDER}

COPY package.json package.json
COPY package-lock.json package-lock.json 

RUN npm ci

COPY . . 

ENTRYPOINT ["npm", "start"]