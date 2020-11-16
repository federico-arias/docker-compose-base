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
-- Name: tags; Type: TABLE; Schema: public; Owner: deploy
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    parent_id integer,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    type character varying(255) DEFAULT 'default'::character varying,
    meta jsonb,
    creator_id integer,
    root_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    mode character varying(255) DEFAULT 'default'::character varying
);


ALTER TABLE public.tags OWNER TO deploy;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: deploy
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO deploy;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: deploy
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: deploy
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: deploy
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags_slug_mode_type_index; Type: INDEX; Schema: public; Owner: deploy
--

CREATE INDEX tags_slug_mode_type_index ON public.tags USING btree (slug, mode, type);


--
-- PostgreSQL database dump complete
--

