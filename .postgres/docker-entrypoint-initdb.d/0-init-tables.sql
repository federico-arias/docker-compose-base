CREATE TABLE offices (
    id serial NOT NULL,
    name varchar(255) NULL,
    slug varchar(255) NULL,
    district_id int4 NULL,
    category_id int4 NULL,
    inserted_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    automatic bool NULL DEFAULT false,
    street varchar(255) NULL,
    lat float8 NULL DEFAULT 0.0,
    lng float8 NULL DEFAULT 0.0,
    hours varchar NULL,
    phone varchar NULL,
    timezone varchar NULL,
    "options" jsonb NULL DEFAULT '{}'::jsonb,
    folder varchar NULL,
    deleted_at timestamp NULL,
    code varchar NULL,
    CONSTRAINT offices_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX offices_slug_index ON public.offices USING btree (slug);

CREATE TABLE if not exists users (
    id serial NOT NULL,
    uid varchar(255) NULL,
    email varchar(255) NULL,
    encrypted_password varchar(255) NULL,
    rut varchar(255) NULL,
    "name" varchar(255) NULL,
    slug varchar(255) NULL,
    inserted_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    "notify" varchar NULL,
    "type" varchar NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX users_email_index ON public.users USING btree (email);
CREATE INDEX users_rut_index ON public.users USING btree (rut);
CREATE UNIQUE INDEX users_slug_index ON public.users USING btree (slug);
CREATE UNIQUE INDEX users_uid_index ON public.users USING btree (uid);

CREATE TABLE permissions (
    id serial NOT NULL,
    office_id int4 NULL,
    user_id int4 NULL,
    inserted_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    CONSTRAINT permissions_pkey PRIMARY KEY (id),
    CONSTRAINT permissions_office_id_fkey FOREIGN KEY (office_id) REFERENCES offices(id),
    CONSTRAINT permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX idx_permissions_user_id_office_id ON public.permissions USING btree (user_id, office_id);
CREATE INDEX permissions_office_id_index ON public.permissions USING btree (office_id);
CREATE INDEX permissions_user_id_index ON public.permissions USING btree (user_id);

insert into users(email, name, type, inserted_at, updated_at) values ('demo@demo.com', 'Prueba', 'TestUser', now(), now());
insert into offices(id, name, inserted_at, updated_at) values  (1, 'oficina 1', now(), now());
