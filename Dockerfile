FROM node:13.14.0-alpine3.10
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./

ARG git_tag=development
ARG CONTAINER_PORT=7004

ENV PORT=$CONTAINER_PORT
ENV NODE_ENV=production
ENV TAG=$git_tag

RUN echo $PORT
RUN yarn install --production

COPY . .
EXPOSE $CONTAINER_PORT
CMD [ "yarn", "start" ]
