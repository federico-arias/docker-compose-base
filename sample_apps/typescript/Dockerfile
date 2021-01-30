FROM node:14-alpine
WORKDIR /app

# install deps
COPY package.json .
RUN yarn install

# install app
COPY . .
RUN tsc

EXPOSE ${CONTAINER_PORT}
