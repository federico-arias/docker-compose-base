FROM golang:1.14
WORKDIR /app
ARG app_basepath=.

# install deps
COPY $app_basepath/go.mod .
RUN go mod download

# install app
COPY $app_basepath .
#RUN go get -d -v -u ./...

# install task runner
RUN go get -u github.com/cosmtrek/air

CMD ["air"]
