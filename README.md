# Use

1. `docker-compose build`
2. `docker-compose up`

# Utils

* To dump a table from Postgres:

```bash
tables="offices_tags"
# set --schema-only or --data-only depending on use case
for table in $tables
do
pg_dump $DB_CONNECTION_STRING -t "public.${table}"  > ".postgres/docker-entrypoint-initdb.d/${table}.sql"
done
```

# Container debugging

* `docker exec -it ${container_hash} rabbitmqctl list_users` - access RabbitMQ CLI.
* `source .postgres/.env && docker exec -it psql -U -P` - access
	PostgreSQL CLI.
* `docker exec -it ${hash} mongo` - access Mongo Shell.
