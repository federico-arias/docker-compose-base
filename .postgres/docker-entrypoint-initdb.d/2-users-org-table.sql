--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.16
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- Name: users_organizations; Type: TABLE; Schema: public; Owner: deploy
--

CREATE TABLE public.users_organizations (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    organization_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users_organizations OWNER TO deploy;

--
-- Name: users_organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: deploy
--

CREATE SEQUENCE public.users_organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_organizations_id_seq OWNER TO deploy;

--
-- Name: users_organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: deploy
--

ALTER SEQUENCE public.users_organizations_id_seq OWNED BY public.users_organizations.id;


--
-- Name: users_organizations id; Type: DEFAULT; Schema: public; Owner: deploy
--

ALTER TABLE ONLY public.users_organizations ALTER COLUMN id SET DEFAULT nextval('public.users_organizations_id_seq'::regclass);


--
-- Name: users_organizations users_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: deploy
--

ALTER TABLE ONLY public.users_organizations
    ADD CONSTRAINT users_organizations_pkey PRIMARY KEY (id);


--
-- Name: user_id_organization_id_unique_index; Type: INDEX; Schema: public; Owner: deploy
--

CREATE UNIQUE INDEX user_id_organization_id_unique_index ON public.users_organizations USING btree (user_id, organization_id);


--
-- Name: users_organizations_organization_id_index; Type: INDEX; Schema: public; Owner: deploy
--

CREATE INDEX users_organizations_organization_id_index ON public.users_organizations USING btree (organization_id);


--
-- Name: users_organizations_user_id_index; Type: INDEX; Schema: public; Owner: deploy
--

CREATE INDEX users_organizations_user_id_index ON public.users_organizations USING btree (user_id);


--
-- PostgreSQL database dump complete
--

