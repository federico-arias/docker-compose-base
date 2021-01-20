# Introduction

Docker Compose Starter's Template provides a development
environment for different languages and databases.

It supports the following languages:

* Node
* Typescript
* Go

It also provides fixtures and migration capabilities for the following
databases:

* Redis
* PostgreSQL
* RabbitMQ
* Mongo

# Installation

1. `install dcst ${HOME}/.local/bin`

# Use

1. `dcst go redis postgres` - installs a Go base app with Redis and
   PostgreSQL databases.
2. `docker-compose up --force-build` -  use `--force-build` in case a
   dependency changes.

# Getting started

You can populate your databases with data from your production
tables, using either only your schema and/or your data.

Each database provides a special tool for this purpose:

* Mongo: `mongodump`
* Postgres: `pgdump`

## Postgres

```bash
tables="offices_tags"
# set --schema-only or --data-only depending on use case
for table in $tables
do
pg_dump $DB_CONNECTION_STRING -t "public.${table}"  > ".postgres/docker-entrypoint-initdb.d/${table}.sql"
done
```

## Mongo


# Debugging

```bash
export container_hash=$(docker ps -aqf 'name=<container name>')
```

* `docker exec -it ${container_hash} rabbitmqctl list_users` - access RabbitMQ CLI.
* `source .postgres/.env && docker exec -it psql $POSTGRES_DSN` - access
	PostgreSQL CLI.
* `docker exec -it ${container_hash} mongo $MONGO_DSN` - access Mongo Shell.
* `docker exec -it ${container_hash} redis-cli` - acces Redis CLI.
