FROM node:10.14.2-alpine@sha256:36a8d46c32eb0610c42cd6a970f3f7e04595425b9191679b5ee05bf2b713f67f as nodeBuild

# set working directory
WORKDIR /front-end

# add `/front-end/node_modules/.bin` to $PATH
ENV PATH /front-end/node_modules/.bin:$PATH

# install and cache front-end dependencies
COPY package.json /front-end/package.json
COPY package-lock.json /front-end/package-lock.json

RUN apk add --update git

RUN npm ci --verbose
RUN npm install -g @angular/cli

# add front-end
COPY . /front-end

# start app
CMD ng serve --host 0.0.0.0