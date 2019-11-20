# ------------------------------------------ Build production application assets
FROM node:10.14.2-alpine@sha256:36a8d46c32eb0610c42cd6a970f3f7e04595425b9191679b5ee05bf2b713f67f as nodeBuild

LABEL application="compatibilities/server"
LABEL maintainer="Paul Costigan"
LABEL version="[ci]"
LABEL build_src="[ci]"

ARG APP_FOLDER=/opt/app/

ENV APP_PORT=3000
ENV MONGO_PORT=27017
ENV MONGO_HOST=mongo
ENV MONGO_DB=MyDb
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_EXPIRY=3600
ENV SET_AUTH=true
ENV USE_TLS=
ENV AUTH_KEY="my-really-long-secret-key_that_no_one-can-get-to"
ENV RABBIT_USER=user
ENV RABBIT_PASS=user
ENV RABBIT_VHOST=vhost
ENV RABBIT_PORT=5672

WORKDIR ${APP_FOLDER}

COPY package.json package.json
COPY package-lock.json package-lock.json 

RUN npm ci

COPY . . 

# RUN apk add --update --no-cache curl=7.61.1-r3 openssl=1.0.2t-r0

# ENTRYPOINT ["/bin/sh", "init.sh"]
ENTRYPOINT ["npm", "start"]