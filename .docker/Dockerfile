FROM node:13.14.0-alpine3.10
WORKDIR /usr/src/app

# install deps
COPY ../package.json ./
COPY ../yarn.lock ./
RUN yarn install

COPY .. .
EXPOSE $DOCKER_CONTAINER_PORT
# uses nodemon for hot-reloading
CMD [ "npm", "run", "start" ]
