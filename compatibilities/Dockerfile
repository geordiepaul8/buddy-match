# ------------------------------------------ Build production application assets
FROM node:10.14.2-alpine@sha256:36a8d46c32eb0610c42cd6a970f3f7e04595425b9191679b5ee05bf2b713f67f as nodeBuild

LABEL application="compatibilities/server"
LABEL maintainer="Paul Costigan"
LABEL version="[ci]"
LABEL build_src="[ci]"

ARG APP_FOLDER=/opt/app/

ENV PORT=3000

WORKDIR ${APP_FOLDER}

COPY package.json package.json
COPY package-lock.json package-lock.json 

RUN npm ci --verbose

COPY . . 

VOLUME /data/db


ENTRYPOINT ["npm", "start"]
