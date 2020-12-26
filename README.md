This is a

# Installation

1. `cp -R .env .docker .redis .postgres .rabbit .mongo .dockerignore
   docker-compose.yaml ${your_project_folder}`
1. `docker-compose build`
2. `docker-compose up #docker-compose up --force-build?`

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

* `docker exec -it ${container_hash} rabbitmqctl list_users` - access RabbitMQ CLI.
* `source .postgres/.env && docker exec -it psql $POSTGRES_DSN` - access
	PostgreSQL CLI.
* `docker exec -it ${container_hash} mongo $MONGO_DSN` - access Mongo Shell.
* `docker exec -it ${container_hash} redis-cli` - acces Redis CLI.
