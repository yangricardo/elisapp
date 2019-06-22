--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.2 (Debian 11.2-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: refreshallmaterializedviews(text, boolean); Type: FUNCTION; Schema: public; Owner: elisdbadmin
--

CREATE FUNCTION public.refreshallmaterializedviews(_schema text DEFAULT '*'::text, _concurrently boolean DEFAULT false) RETURNS integer
    LANGUAGE plpgsql
    AS $$
  DECLARE
    r RECORD;
  BEGIN
    RAISE NOTICE 'Refreshing materialized view(s) in % %', CASE WHEN _schema = '*' THEN ' all schemas' ELSE 'schema "'|| _schema || '"' END, CASE WHEN _concurrently THEN 'concurrently' ELSE '' END;
    IF pg_is_in_recovery() THEN 
      RETURN 0;
    ELSE    
      FOR r IN SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = _schema OR _schema = '*' 
      LOOP
        RAISE NOTICE 'Refreshing %.%', r.schemaname, r.matviewname;
        EXECUTE 'REFRESH MATERIALIZED VIEW ' || CASE WHEN _concurrently THEN 'CONCURRENTLY ' ELSE '' END || '"' || r.schemaname || '"."' || r.matviewname || '"'; 
      END LOOP;
    END IF;
    RETURN 1;
  END 
$$;


ALTER FUNCTION public.refreshallmaterializedviews(_schema text, _concurrently boolean) OWNER TO elisdbadmin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: api_advogado; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_advogado (
    cod_adv integer NOT NULL,
    num_oab text NOT NULL,
    nome_adv text NOT NULL
);


ALTER TABLE public.api_advogado OWNER TO elisdbadmin;

--
-- Name: api_advogadoprocesso; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_advogadoprocesso (
    id integer NOT NULL,
    tip_polo character varying(1),
    advogado_id integer NOT NULL,
    processo_id character varying(18) NOT NULL,
    tipo_personagem_id integer NOT NULL
);


ALTER TABLE public.api_advogadoprocesso OWNER TO elisdbadmin;

--
-- Name: api_advogadoprocesso_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_advogadoprocesso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_advogadoprocesso_id_seq OWNER TO elisdbadmin;

--
-- Name: api_advogadoprocesso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_advogadoprocesso_id_seq OWNED BY public.api_advogadoprocesso.id;


--
-- Name: api_andamentoprocesso; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_andamentoprocesso (
    id integer NOT NULL,
    ordem integer NOT NULL,
    dt_ato timestamp with time zone,
    txt_descr text NOT NULL,
    txt_descr_len integer NOT NULL,
    ato_juiz_id integer,
    juiz_id text,
    processo_id character varying(18) NOT NULL,
    serventia_id integer,
    tipo_andamento_id integer,
    tipo_ato_juiz_id integer,
    tipo_decisao_recurso_id integer
);


ALTER TABLE public.api_andamentoprocesso OWNER TO elisdbadmin;

--
-- Name: api_andamentoprocesso_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_andamentoprocesso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_andamentoprocesso_id_seq OWNER TO elisdbadmin;

--
-- Name: api_andamentoprocesso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_andamentoprocesso_id_seq OWNED BY public.api_andamentoprocesso.id;


--
-- Name: api_assunto; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_assunto (
    cod_assunto integer NOT NULL,
    descr text NOT NULL,
    assunto_pai_id integer
);


ALTER TABLE public.api_assunto OWNER TO elisdbadmin;

--
-- Name: api_atojuiz; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_atojuiz (
    id integer NOT NULL,
    cod_ato integer NOT NULL,
    descr character varying(60) NOT NULL,
    tipo_ato_juiz_id integer,
    tipo_movimento_id integer
);


ALTER TABLE public.api_atojuiz OWNER TO elisdbadmin;

--
-- Name: api_atojuiz_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_atojuiz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_atojuiz_id_seq OWNER TO elisdbadmin;

--
-- Name: api_atojuiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_atojuiz_id_seq OWNED BY public.api_atojuiz.id;


--
-- Name: api_cargo; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_cargo (
    cod_carg integer NOT NULL,
    descr character varying(50) NOT NULL
);


ALTER TABLE public.api_cargo OWNER TO elisdbadmin;

--
-- Name: api_classe; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_classe (
    cod_classe integer NOT NULL,
    descr text NOT NULL,
    classe_pai_id integer,
    cod_pers_ativo_id integer,
    cod_pers_passivo_id integer
);


ALTER TABLE public.api_classe OWNER TO elisdbadmin;

--
-- Name: api_classeassunto; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_classeassunto (
    id integer NOT NULL,
    assunto_id integer NOT NULL,
    classe_id integer NOT NULL
);


ALTER TABLE public.api_classeassunto OWNER TO elisdbadmin;

--
-- Name: api_classeassunto_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_classeassunto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_classeassunto_id_seq OWNER TO elisdbadmin;

--
-- Name: api_classeassunto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_classeassunto_id_seq OWNED BY public.api_classeassunto.id;


--
-- Name: api_comarca; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_comarca (
    cod_coma integer NOT NULL,
    desc_coma character varying(50) NOT NULL,
    desc_redu character varying(3) NOT NULL
);


ALTER TABLE public.api_comarca OWNER TO elisdbadmin;

--
-- Name: api_competencia; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_competencia (
    cod_comp integer NOT NULL,
    desc_comp character varying(50) NOT NULL,
    desc_res character varying(15) NOT NULL
);


ALTER TABLE public.api_competencia OWNER TO elisdbadmin;

--
-- Name: api_documentoprocesso; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_documentoprocesso (
    cod_docto_elet text NOT NULL,
    assunto_id integer NOT NULL,
    classe_id integer NOT NULL,
    competencia_id integer NOT NULL,
    processo_id character varying(18) NOT NULL,
    tipo_documento_id integer NOT NULL
);


ALTER TABLE public.api_documentoprocesso OWNER TO elisdbadmin;

--
-- Name: api_funcionario; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_funcionario (
    num_matr text NOT NULL,
    nome character varying(100) NOT NULL,
    cod_carg_id integer
);


ALTER TABLE public.api_funcionario OWNER TO elisdbadmin;

--
-- Name: api_gruposimilar; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_gruposimilar (
    id integer NOT NULL,
    descricao character varying(150) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.api_gruposimilar OWNER TO elisdbadmin;

--
-- Name: api_gruposimilar_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_gruposimilar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_gruposimilar_id_seq OWNER TO elisdbadmin;

--
-- Name: api_gruposimilar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_gruposimilar_id_seq OWNED BY public.api_gruposimilar.id;


--
-- Name: api_gruposimilarprocessos; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_gruposimilarprocessos (
    id integer NOT NULL,
    grupo_id integer NOT NULL,
    processos_similares_id integer NOT NULL
);


ALTER TABLE public.api_gruposimilarprocessos OWNER TO elisdbadmin;

--
-- Name: api_gruposimilarprocessos_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_gruposimilarprocessos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_gruposimilarprocessos_id_seq OWNER TO elisdbadmin;

--
-- Name: api_gruposimilarprocessos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_gruposimilarprocessos_id_seq OWNED BY public.api_gruposimilarprocessos.id;


--
-- Name: api_gruposimilarusuarios; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_gruposimilarusuarios (
    id integer NOT NULL,
    grupo_id integer NOT NULL,
    user_id integer NOT NULL,
    administrador_id integer NOT NULL
);


ALTER TABLE public.api_gruposimilarusuarios OWNER TO elisdbadmin;

--
-- Name: api_gruposimilarusuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_gruposimilarusuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_gruposimilarusuarios_id_seq OWNER TO elisdbadmin;

--
-- Name: api_gruposimilarusuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_gruposimilarusuarios_id_seq OWNED BY public.api_gruposimilarusuarios.id;


--
-- Name: api_processo; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_processo (
    id_proc integer NOT NULL,
    cod_proc character varying(18) NOT NULL,
    cod_cnj character varying(25),
    data_cad timestamp with time zone,
    assunto_id integer,
    classe_id integer,
    competencia_id integer,
    serventia_id integer
);


ALTER TABLE public.api_processo OWNER TO elisdbadmin;

--
-- Name: api_processossimilares; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_processossimilares (
    id integer NOT NULL,
    similaridade double precision NOT NULL,
    processo_base_id character varying(18) NOT NULL,
    processo_similar_id character varying(18) NOT NULL
);


ALTER TABLE public.api_processossimilares OWNER TO elisdbadmin;

--
-- Name: api_serventia; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_serventia (
    cod_serv integer NOT NULL,
    desc_serv character varying(80) NOT NULL,
    desc_abre character varying(10),
    comarca_id integer NOT NULL
);


ALTER TABLE public.api_serventia OWNER TO elisdbadmin;

--
-- Name: api_mview_processo; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_processo AS
 SELECT p2.processo_tj,
    p1.cod_cnj AS processo_cnj,
    assunto.descr AS assunto,
    classe.descr AS classe,
    comarca.desc_coma AS comarca,
    serventia.desc_serv AS serventia,
    competencia.desc_comp AS competencia
   FROM ((((((public.api_processo p1
     JOIN ( SELECT DISTINCT api_processossimilares.processo_base_id AS processo_tj
           FROM public.api_processossimilares
        UNION
         SELECT DISTINCT api_processossimilares.processo_similar_id AS processo_tj
           FROM public.api_processossimilares) p2 ON (((p2.processo_tj)::text = (p1.cod_proc)::text)))
     FULL JOIN public.api_assunto assunto ON ((assunto.cod_assunto = p1.assunto_id)))
     FULL JOIN public.api_classe classe ON ((classe.cod_classe = p1.classe_id)))
     JOIN public.api_serventia serventia ON ((serventia.cod_serv = p1.serventia_id)))
     JOIN public.api_comarca comarca ON ((comarca.cod_coma = serventia.comarca_id)))
     JOIN public.api_competencia competencia ON ((competencia.cod_comp = p1.competencia_id)))
  WITH NO DATA;


ALTER TABLE public.api_mview_processo OWNER TO elisdbadmin;

--
-- Name: api_mview_advogado_processo; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_advogado_processo AS
 SELECT a.num_oab AS oab,
    ap.id,
    a.nome_adv AS nome,
    ap.tip_polo AS polo,
    p.processo_tj,
    p.processo_cnj
   FROM ((public.api_advogadoprocesso ap
     JOIN public.api_advogado a ON ((a.cod_adv = ap.advogado_id)))
     JOIN public.api_mview_processo p ON (((p.processo_tj)::text = (ap.processo_id)::text)))
  WITH NO DATA;


ALTER TABLE public.api_mview_advogado_processo OWNER TO elisdbadmin;

--
-- Name: api_tipodocumento; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipodocumento (
    id_tip_doc integer NOT NULL,
    descr character varying(210) NOT NULL
);


ALTER TABLE public.api_tipodocumento OWNER TO elisdbadmin;

--
-- Name: api_mview_documento_processo; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_documento_processo AS
 SELECT dp.cod_docto_elet AS cod_documento,
    p.processo_tj,
    p.processo_cnj,
    td.id_tip_doc AS id_tipo_documento,
    td.descr AS tipo_documento
   FROM ((public.api_documentoprocesso dp
     JOIN public.api_mview_processo p ON (((p.processo_tj)::text = (dp.processo_id)::text)))
     JOIN public.api_tipodocumento td ON ((td.id_tip_doc = dp.tipo_documento_id)))
  WITH NO DATA;


ALTER TABLE public.api_mview_documento_processo OWNER TO elisdbadmin;

--
-- Name: api_personagem; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_personagem (
    cod_pers integer NOT NULL,
    nome text NOT NULL
);


ALTER TABLE public.api_personagem OWNER TO elisdbadmin;

--
-- Name: api_personagemprocesso; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_personagemprocesso (
    id integer NOT NULL,
    personagem_id integer NOT NULL,
    processo_id character varying(18) NOT NULL,
    tipo_personagem_id integer NOT NULL
);


ALTER TABLE public.api_personagemprocesso OWNER TO elisdbadmin;

--
-- Name: api_tipopersonagem; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipopersonagem (
    cod_tip_pers integer NOT NULL,
    desc_pers character varying(25) NOT NULL,
    tipo_part character varying(1) NOT NULL,
    cod_tip_pers_inv_id integer
);


ALTER TABLE public.api_tipopersonagem OWNER TO elisdbadmin;

--
-- Name: api_mview_personagens_processo; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_personagens_processo AS
 SELECT p.nome AS nome_personagem,
    pp.id,
    pr.processo_tj,
    pr.processo_cnj,
    tp.desc_pers AS tipo_personagem,
    tp.tipo_part AS participacao
   FROM (((public.api_personagemprocesso pp
     JOIN public.api_personagem p ON ((p.cod_pers = pp.personagem_id)))
     JOIN public.api_mview_processo pr ON (((pr.processo_tj)::text = (pp.processo_id)::text)))
     JOIN public.api_tipopersonagem tp ON ((tp.cod_tip_pers = pp.tipo_personagem_id)))
  WITH NO DATA;


ALTER TABLE public.api_mview_personagens_processo OWNER TO elisdbadmin;

--
-- Name: api_mview_sentencas; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_sentencas AS
 SELECT ap.id,
    p.processo_tj,
    p.processo_cnj,
    ap.txt_descr AS texto_sentenca,
    aj.descr AS ato_juiz,
    j.num_matr AS matricula_juiz,
    j.nome AS nome_juiz,
    c.descr AS cargo_juiz
   FROM ((((public.api_andamentoprocesso ap
     JOIN public.api_mview_processo p ON (((p.processo_tj)::text = (ap.processo_id)::text)))
     LEFT JOIN public.api_atojuiz aj ON ((aj.id = ap.ato_juiz_id)))
     LEFT JOIN public.api_funcionario j ON ((j.num_matr = ap.juiz_id)))
     LEFT JOIN public.api_cargo c ON ((c.cod_carg = j.cod_carg_id)))
  WHERE ((ap.tipo_ato_juiz_id = 2) AND (ap.txt_descr !~~ 'Projeto em Revisão'::text))
  ORDER BY p.processo_tj, ap.dt_ato
  WITH NO DATA;


ALTER TABLE public.api_mview_sentencas OWNER TO elisdbadmin;

--
-- Name: api_mview_processossimilares; Type: MATERIALIZED VIEW; Schema: public; Owner: elisdbadmin
--

CREATE MATERIALIZED VIEW public.api_mview_processossimilares AS
 SELECT pss.id,
    pss.similaridade,
    pb.processo_tj AS processo_base_tj,
    ps.processo_tj AS processo_similar_tj,
    pb.processo_cnj AS processo_base_cnj,
    ps.processo_cnj AS processo_similar_cnj,
    pb.assunto AS processo_base_assunto,
    ps.assunto AS processo_similar_assunto,
    pb.classe AS processo_base_classe,
    ps.classe AS processo_similar_classe,
    pb.comarca AS processo_base_comarca,
    ps.comarca AS processo_similar_comarca,
    pb.serventia AS processo_base_serventia,
    ps.serventia AS processo_similar_serventia,
    pb.competencia AS processo_base_competencia,
    ps.competencia AS processo_similar_competencia,
    jb.juizes AS processo_base_juizes,
    js.juizes AS processo_similar_juizes,
    ppb.personagens AS processo_base_personagens,
    pps.personagens AS processo_similar_personagens,
    apb.advogados AS processo_base_advogados,
    aps.advogados AS processo_similar_advogados
   FROM ((((((((public.api_processossimilares pss
     JOIN public.api_mview_processo pb ON (((pb.processo_tj)::text = (pss.processo_base_id)::text)))
     JOIN public.api_mview_processo ps ON (((ps.processo_tj)::text = (pss.processo_similar_id)::text)))
     LEFT JOIN ( SELECT string_agg(DISTINCT (api_mview_sentencas.nome_juiz)::text, ', '::text ORDER BY (api_mview_sentencas.nome_juiz)::text) AS juizes,
            api_mview_sentencas.processo_tj
           FROM public.api_mview_sentencas
          GROUP BY api_mview_sentencas.processo_tj) jb ON (((pb.processo_tj)::text = (jb.processo_tj)::text)))
     LEFT JOIN ( SELECT string_agg(DISTINCT (api_mview_sentencas.nome_juiz)::text, ', '::text ORDER BY (api_mview_sentencas.nome_juiz)::text) AS juizes,
            api_mview_sentencas.processo_tj
           FROM public.api_mview_sentencas
          GROUP BY api_mview_sentencas.processo_tj) js ON (((ps.processo_tj)::text = (js.processo_tj)::text)))
     LEFT JOIN ( SELECT string_agg(api_mview_personagens_processo.nome_personagem, ', '::text ORDER BY api_mview_personagens_processo.nome_personagem) AS personagens,
            api_mview_personagens_processo.processo_tj
           FROM public.api_mview_personagens_processo
          GROUP BY api_mview_personagens_processo.processo_tj) ppb ON (((ppb.processo_tj)::text = (jb.processo_tj)::text)))
     LEFT JOIN ( SELECT string_agg(api_mview_personagens_processo.nome_personagem, ', '::text ORDER BY api_mview_personagens_processo.nome_personagem) AS personagens,
            api_mview_personagens_processo.processo_tj
           FROM public.api_mview_personagens_processo
          GROUP BY api_mview_personagens_processo.processo_tj) pps ON (((pps.processo_tj)::text = (js.processo_tj)::text)))
     LEFT JOIN ( SELECT string_agg(api_mview_advogado_processo.nome, ', '::text ORDER BY api_mview_advogado_processo.nome) AS advogados,
            api_mview_advogado_processo.processo_tj
           FROM public.api_mview_advogado_processo
          GROUP BY api_mview_advogado_processo.processo_tj) apb ON (((apb.processo_tj)::text = (jb.processo_tj)::text)))
     LEFT JOIN ( SELECT string_agg(api_mview_advogado_processo.nome, ', '::text ORDER BY api_mview_advogado_processo.nome) AS advogados,
            api_mview_advogado_processo.processo_tj
           FROM public.api_mview_advogado_processo
          GROUP BY api_mview_advogado_processo.processo_tj) aps ON (((aps.processo_tj)::text = (js.processo_tj)::text)))
  ORDER BY pb.processo_tj, pss.similaridade DESC
  WITH NO DATA;


ALTER TABLE public.api_mview_processossimilares OWNER TO elisdbadmin;

--
-- Name: api_personagemprocesso_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_personagemprocesso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_personagemprocesso_id_seq OWNER TO elisdbadmin;

--
-- Name: api_personagemprocesso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_personagemprocesso_id_seq OWNED BY public.api_personagemprocesso.id;


--
-- Name: api_processossimilares_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.api_processossimilares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.api_processossimilares_id_seq OWNER TO elisdbadmin;

--
-- Name: api_processossimilares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.api_processossimilares_id_seq OWNED BY public.api_processossimilares.id;


--
-- Name: api_tipoandamento; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipoandamento (
    cod_tip_and integer NOT NULL,
    descr character varying(60) NOT NULL,
    cod_tip_mov_id integer
);


ALTER TABLE public.api_tipoandamento OWNER TO elisdbadmin;

--
-- Name: api_tipoatojuiz; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipoatojuiz (
    cod_tip_ato integer NOT NULL,
    descr character varying(20) NOT NULL
);


ALTER TABLE public.api_tipoatojuiz OWNER TO elisdbadmin;

--
-- Name: api_tipodecisaorecurso; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipodecisaorecurso (
    cod_tip_dec_rec integer NOT NULL,
    descr character varying(25) NOT NULL
);


ALTER TABLE public.api_tipodecisaorecurso OWNER TO elisdbadmin;

--
-- Name: api_tipomovimento; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.api_tipomovimento (
    cod_tip_mov integer NOT NULL,
    descr character varying(100) NOT NULL,
    cod_tip_mov_pai_id integer
);


ALTER TABLE public.api_tipomovimento OWNER TO elisdbadmin;

--
-- Name: api_view_anos_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_anos_disponiveis AS
 SELECT DISTINCT "substring"((api_mview_processossimilares.processo_base_tj)::text, 0, 5) AS anos
   FROM public.api_mview_processossimilares;


ALTER TABLE public.api_view_anos_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_classes_assuntos_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_classes_assuntos_disponiveis AS
 SELECT x.classe,
    x.assunto,
    row_number() OVER (ORDER BY x.classe, x.assunto) AS id
   FROM ( SELECT DISTINCT api_mview_processossimilares.processo_base_classe AS classe,
            api_mview_processossimilares.processo_base_assunto AS assunto
           FROM public.api_mview_processossimilares
        UNION
         SELECT DISTINCT api_mview_processossimilares.processo_similar_classe AS classe,
            api_mview_processossimilares.processo_similar_assunto AS assunto
           FROM public.api_mview_processossimilares) x;


ALTER TABLE public.api_view_classes_assuntos_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_comarcas_serventias_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_comarcas_serventias_disponiveis AS
 SELECT x.serventia,
    x.comarca,
    row_number() OVER (ORDER BY x.comarca, x.serventia) AS id
   FROM ( SELECT DISTINCT api_mview_processossimilares.processo_base_serventia AS serventia,
            api_mview_processossimilares.processo_base_comarca AS comarca
           FROM public.api_mview_processossimilares
        UNION
         SELECT DISTINCT api_mview_processossimilares.processo_similar_serventia AS serventia,
            api_mview_processossimilares.processo_similar_comarca AS comarca
           FROM public.api_mview_processossimilares) x;


ALTER TABLE public.api_view_comarcas_serventias_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_competencias_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_competencias_disponiveis AS
 SELECT DISTINCT api_mview_processossimilares.processo_base_competencia AS competencia
   FROM public.api_mview_processossimilares
UNION
 SELECT DISTINCT api_mview_processossimilares.processo_similar_competencia AS competencia
   FROM public.api_mview_processossimilares;


ALTER TABLE public.api_view_competencias_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_juizes_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_juizes_disponiveis AS
 SELECT x.nome_juiz,
    x.cargo_juiz,
    row_number() OVER (ORDER BY x.nome_juiz, x.cargo_juiz) AS id
   FROM ( SELECT DISTINCT api_mview_sentencas.nome_juiz,
            api_mview_sentencas.cargo_juiz
           FROM public.api_mview_sentencas) x;


ALTER TABLE public.api_view_juizes_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_personagens_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_personagens_disponiveis AS
 SELECT x.nome_personagem,
    row_number() OVER (ORDER BY x.nome_personagem) AS id
   FROM ( SELECT DISTINCT api_mview_personagens_processo.nome_personagem
           FROM public.api_mview_personagens_processo) x;


ALTER TABLE public.api_view_personagens_disponiveis OWNER TO elisdbadmin;

--
-- Name: api_view_processo_base_similaridades_count; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_processo_base_similaridades_count AS
 SELECT DISTINCT ps.processo_base_tj,
    c.cnt
   FROM (public.api_mview_processossimilares ps
     JOIN ( SELECT api_mview_processossimilares.processo_base_tj,
            count(api_mview_processossimilares.processo_similar_tj) AS cnt
           FROM public.api_mview_processossimilares
          GROUP BY api_mview_processossimilares.processo_base_tj) c ON (((ps.processo_base_tj)::text = (c.processo_base_tj)::text)))
  ORDER BY c.cnt DESC, ps.processo_base_tj;


ALTER TABLE public.api_view_processo_base_similaridades_count OWNER TO elisdbadmin;

--
-- Name: api_view_processo_similar_similaridades_count; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_processo_similar_similaridades_count AS
 SELECT DISTINCT ps.processo_similar_tj,
    c.cnt
   FROM (public.api_mview_processossimilares ps
     JOIN ( SELECT api_mview_processossimilares.processo_similar_tj,
            count(api_mview_processossimilares.processo_base_tj) AS cnt
           FROM public.api_mview_processossimilares
          GROUP BY api_mview_processossimilares.processo_similar_tj) c ON (((ps.processo_similar_tj)::text = (c.processo_similar_tj)::text)))
  ORDER BY c.cnt DESC, ps.processo_similar_tj;


ALTER TABLE public.api_view_processo_similar_similaridades_count OWNER TO elisdbadmin;

--
-- Name: api_view_processo_estatistica; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_processo_estatistica AS
 SELECT base.processo_base_tj AS processo_tj,
    base.cnt AS referencia,
    sim.cnt AS referenciado
   FROM (public.api_view_processo_base_similaridades_count base
     FULL JOIN public.api_view_processo_similar_similaridades_count sim ON (((sim.processo_similar_tj)::text = (base.processo_base_tj)::text)))
  ORDER BY sim.cnt, base.cnt DESC, base.processo_base_tj;


ALTER TABLE public.api_view_processo_estatistica OWNER TO elisdbadmin;

--
-- Name: api_views_advogados_disponiveis; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_views_advogados_disponiveis AS
 SELECT x.nome,
    x.oab,
    row_number() OVER (ORDER BY x.nome, x.oab) AS id
   FROM ( SELECT DISTINCT api_mview_advogado_processo.oab,
            api_mview_advogado_processo.nome
           FROM public.api_mview_advogado_processo) x;


ALTER TABLE public.api_views_advogados_disponiveis OWNER TO elisdbadmin;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO elisdbadmin;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO elisdbadmin;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO elisdbadmin;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO elisdbadmin;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO elisdbadmin;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO elisdbadmin;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO elisdbadmin;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO elisdbadmin;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO elisdbadmin;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO elisdbadmin;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO elisdbadmin;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO elisdbadmin;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO elisdbadmin;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO elisdbadmin;

--
-- Name: frontend_avaliacaosimilaridade; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.frontend_avaliacaosimilaridade (
    id integer NOT NULL,
    inicial integer NOT NULL,
    contestacao integer NOT NULL,
    sentenca integer NOT NULL,
    comentario text NOT NULL,
    data timestamp with time zone NOT NULL,
    processo_similar_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.frontend_avaliacaosimilaridade OWNER TO elisdbadmin;

--
-- Name: frontend_avaliacaosimilaridade_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.frontend_avaliacaosimilaridade_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.frontend_avaliacaosimilaridade_id_seq OWNER TO elisdbadmin;

--
-- Name: frontend_avaliacaosimilaridade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.frontend_avaliacaosimilaridade_id_seq OWNED BY public.frontend_avaliacaosimilaridade.id;


--
-- Name: knox_authtoken; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.knox_authtoken (
    digest character varying(128) NOT NULL,
    salt character varying(16) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    expiry timestamp with time zone,
    token_key character varying(8) NOT NULL
);


ALTER TABLE public.knox_authtoken OWNER TO elisdbadmin;

--
-- Name: leads_lead; Type: TABLE; Schema: public; Owner: elisdbadmin
--

CREATE TABLE public.leads_lead (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    message character varying(500) NOT NULL,
    created_at date NOT NULL,
    owner_id integer
);


ALTER TABLE public.leads_lead OWNER TO elisdbadmin;

--
-- Name: leads_lead_id_seq; Type: SEQUENCE; Schema: public; Owner: elisdbadmin
--

CREATE SEQUENCE public.leads_lead_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.leads_lead_id_seq OWNER TO elisdbadmin;

--
-- Name: leads_lead_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: elisdbadmin
--

ALTER SEQUENCE public.leads_lead_id_seq OWNED BY public.leads_lead.id;


--
-- Name: api_advogadoprocesso id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso ALTER COLUMN id SET DEFAULT nextval('public.api_advogadoprocesso_id_seq'::regclass);


--
-- Name: api_andamentoprocesso id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso ALTER COLUMN id SET DEFAULT nextval('public.api_andamentoprocesso_id_seq'::regclass);


--
-- Name: api_atojuiz id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_atojuiz ALTER COLUMN id SET DEFAULT nextval('public.api_atojuiz_id_seq'::regclass);


--
-- Name: api_classeassunto id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classeassunto ALTER COLUMN id SET DEFAULT nextval('public.api_classeassunto_id_seq'::regclass);


--
-- Name: api_gruposimilar id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilar ALTER COLUMN id SET DEFAULT nextval('public.api_gruposimilar_id_seq'::regclass);


--
-- Name: api_gruposimilarprocessos id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarprocessos ALTER COLUMN id SET DEFAULT nextval('public.api_gruposimilarprocessos_id_seq'::regclass);


--
-- Name: api_gruposimilarusuarios id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios ALTER COLUMN id SET DEFAULT nextval('public.api_gruposimilarusuarios_id_seq'::regclass);


--
-- Name: api_personagemprocesso id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso ALTER COLUMN id SET DEFAULT nextval('public.api_personagemprocesso_id_seq'::regclass);


--
-- Name: api_processossimilares id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processossimilares ALTER COLUMN id SET DEFAULT nextval('public.api_processossimilares_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: frontend_avaliacaosimilaridade id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.frontend_avaliacaosimilaridade ALTER COLUMN id SET DEFAULT nextval('public.frontend_avaliacaosimilaridade_id_seq'::regclass);


--
-- Name: leads_lead id; Type: DEFAULT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.leads_lead ALTER COLUMN id SET DEFAULT nextval('public.leads_lead_id_seq'::regclass);


--
-- Name: api_advogado api_advogado_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogado
    ADD CONSTRAINT api_advogado_pkey PRIMARY KEY (cod_adv);


--
-- Name: api_advogadoprocesso api_advogadoprocesso_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso
    ADD CONSTRAINT api_advogadoprocesso_pkey PRIMARY KEY (id);


--
-- Name: api_advogadoprocesso api_advogadoprocesso_processo_id_advogado_id_92ec7297_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso
    ADD CONSTRAINT api_advogadoprocesso_processo_id_advogado_id_92ec7297_uniq UNIQUE (processo_id, advogado_id);


--
-- Name: api_andamentoprocesso api_andamentoprocesso_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocesso_pkey PRIMARY KEY (id);


--
-- Name: api_andamentoprocesso api_andamentoprocesso_processo_id_ordem_txt_de_4aaa654b_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocesso_processo_id_ordem_txt_de_4aaa654b_uniq UNIQUE (processo_id, ordem, txt_descr_len);


--
-- Name: api_assunto api_assunto_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_assunto
    ADD CONSTRAINT api_assunto_pkey PRIMARY KEY (cod_assunto);


--
-- Name: api_atojuiz api_atojuiz_cod_ato_tipo_ato_juiz_id_2c3b4bd3_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_atojuiz
    ADD CONSTRAINT api_atojuiz_cod_ato_tipo_ato_juiz_id_2c3b4bd3_uniq UNIQUE (cod_ato, tipo_ato_juiz_id, tipo_movimento_id);


--
-- Name: api_atojuiz api_atojuiz_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_atojuiz
    ADD CONSTRAINT api_atojuiz_pkey PRIMARY KEY (id);


--
-- Name: api_cargo api_cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_cargo
    ADD CONSTRAINT api_cargo_pkey PRIMARY KEY (cod_carg);


--
-- Name: api_classe api_classe_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classe
    ADD CONSTRAINT api_classe_pkey PRIMARY KEY (cod_classe);


--
-- Name: api_classeassunto api_classeassunto_classe_id_assunto_id_bb23d898_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classeassunto
    ADD CONSTRAINT api_classeassunto_classe_id_assunto_id_bb23d898_uniq UNIQUE (classe_id, assunto_id);


--
-- Name: api_classeassunto api_classeassunto_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classeassunto
    ADD CONSTRAINT api_classeassunto_pkey PRIMARY KEY (id);


--
-- Name: api_comarca api_comarca_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_comarca
    ADD CONSTRAINT api_comarca_pkey PRIMARY KEY (cod_coma);


--
-- Name: api_competencia api_competencia_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_competencia
    ADD CONSTRAINT api_competencia_pkey PRIMARY KEY (cod_comp);


--
-- Name: api_documentoprocesso api_documentoprocesso_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocesso_pkey PRIMARY KEY (cod_docto_elet);


--
-- Name: api_funcionario api_funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_funcionario
    ADD CONSTRAINT api_funcionario_pkey PRIMARY KEY (num_matr);


--
-- Name: api_gruposimilar api_gruposimilar_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilar
    ADD CONSTRAINT api_gruposimilar_pkey PRIMARY KEY (id);


--
-- Name: api_gruposimilarprocessos api_gruposimilarprocesso_grupo_id_processos_simil_7839a3b7_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarprocessos
    ADD CONSTRAINT api_gruposimilarprocesso_grupo_id_processos_simil_7839a3b7_uniq UNIQUE (grupo_id, processos_similares_id);


--
-- Name: api_gruposimilarprocessos api_gruposimilarprocessos_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarprocessos
    ADD CONSTRAINT api_gruposimilarprocessos_pkey PRIMARY KEY (id);


--
-- Name: api_gruposimilarusuarios api_gruposimilarusuarios_grupo_id_user_id_30e15a3d_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios
    ADD CONSTRAINT api_gruposimilarusuarios_grupo_id_user_id_30e15a3d_uniq UNIQUE (grupo_id, user_id);


--
-- Name: api_gruposimilarusuarios api_gruposimilarusuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios
    ADD CONSTRAINT api_gruposimilarusuarios_pkey PRIMARY KEY (id);


--
-- Name: api_personagem api_personagem_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagem
    ADD CONSTRAINT api_personagem_pkey PRIMARY KEY (cod_pers);


--
-- Name: api_personagemprocesso api_personagemprocesso_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso
    ADD CONSTRAINT api_personagemprocesso_pkey PRIMARY KEY (id);


--
-- Name: api_personagemprocesso api_personagemprocesso_processo_id_personagem_id_4f6cfb39_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso
    ADD CONSTRAINT api_personagemprocesso_processo_id_personagem_id_4f6cfb39_uniq UNIQUE (processo_id, personagem_id);


--
-- Name: api_processo api_processo_cod_cnj_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_cod_cnj_key UNIQUE (cod_cnj);


--
-- Name: api_processo api_processo_cod_proc_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_cod_proc_key UNIQUE (cod_proc);


--
-- Name: api_processo api_processo_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_pkey PRIMARY KEY (id_proc);


--
-- Name: api_processossimilares api_processossimilares_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processossimilares
    ADD CONSTRAINT api_processossimilares_pkey PRIMARY KEY (id);


--
-- Name: api_serventia api_serventia_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_serventia
    ADD CONSTRAINT api_serventia_pkey PRIMARY KEY (cod_serv);


--
-- Name: api_tipoandamento api_tipoandamento_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipoandamento
    ADD CONSTRAINT api_tipoandamento_pkey PRIMARY KEY (cod_tip_and);


--
-- Name: api_tipoatojuiz api_tipoatojuiz_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipoatojuiz
    ADD CONSTRAINT api_tipoatojuiz_pkey PRIMARY KEY (cod_tip_ato);


--
-- Name: api_tipodecisaorecurso api_tipodecisaorecurso_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipodecisaorecurso
    ADD CONSTRAINT api_tipodecisaorecurso_pkey PRIMARY KEY (cod_tip_dec_rec);


--
-- Name: api_tipodocumento api_tipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipodocumento
    ADD CONSTRAINT api_tipodocumento_pkey PRIMARY KEY (id_tip_doc);


--
-- Name: api_tipomovimento api_tipomovimento_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipomovimento
    ADD CONSTRAINT api_tipomovimento_pkey PRIMARY KEY (cod_tip_mov);


--
-- Name: api_tipopersonagem api_tipopersonagem_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipopersonagem
    ADD CONSTRAINT api_tipopersonagem_pkey PRIMARY KEY (cod_tip_pers);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: frontend_avaliacaosimilaridade frontend_avaliacaosimilaridade_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.frontend_avaliacaosimilaridade
    ADD CONSTRAINT frontend_avaliacaosimilaridade_pkey PRIMARY KEY (id);


--
-- Name: knox_authtoken knox_authtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.knox_authtoken
    ADD CONSTRAINT knox_authtoken_pkey PRIMARY KEY (digest);


--
-- Name: knox_authtoken knox_authtoken_salt_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.knox_authtoken
    ADD CONSTRAINT knox_authtoken_salt_key UNIQUE (salt);


--
-- Name: leads_lead leads_lead_email_key; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.leads_lead
    ADD CONSTRAINT leads_lead_email_key UNIQUE (email);


--
-- Name: leads_lead leads_lead_pkey; Type: CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.leads_lead
    ADD CONSTRAINT leads_lead_pkey PRIMARY KEY (id);


--
-- Name: api_advogado_nome_adv_f080874b; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogado_nome_adv_f080874b ON public.api_advogado USING btree (nome_adv);


--
-- Name: api_advogado_nome_adv_f080874b_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogado_nome_adv_f080874b_like ON public.api_advogado USING btree (nome_adv text_pattern_ops);


--
-- Name: api_advogado_num_oab_b5c4ff28; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogado_num_oab_b5c4ff28 ON public.api_advogado USING btree (num_oab);


--
-- Name: api_advogado_num_oab_b5c4ff28_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogado_num_oab_b5c4ff28_like ON public.api_advogado USING btree (num_oab text_pattern_ops);


--
-- Name: api_advogadoprocesso_advogado_id_715631e0; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogadoprocesso_advogado_id_715631e0 ON public.api_advogadoprocesso USING btree (advogado_id);


--
-- Name: api_advogadoprocesso_processo_id_101d88fb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogadoprocesso_processo_id_101d88fb ON public.api_advogadoprocesso USING btree (processo_id);


--
-- Name: api_advogadoprocesso_processo_id_101d88fb_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogadoprocesso_processo_id_101d88fb_like ON public.api_advogadoprocesso USING btree (processo_id varchar_pattern_ops);


--
-- Name: api_advogadoprocesso_tipo_personagem_id_cd59dc40; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_advogadoprocesso_tipo_personagem_id_cd59dc40 ON public.api_advogadoprocesso USING btree (tipo_personagem_id);


--
-- Name: api_andamentoprocesso_ato_juiz_id_f985f8b1; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_ato_juiz_id_f985f8b1 ON public.api_andamentoprocesso USING btree (ato_juiz_id);


--
-- Name: api_andamentoprocesso_juiz_id_2be2d4c0; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_juiz_id_2be2d4c0 ON public.api_andamentoprocesso USING btree (juiz_id);


--
-- Name: api_andamentoprocesso_juiz_id_2be2d4c0_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_juiz_id_2be2d4c0_like ON public.api_andamentoprocesso USING btree (juiz_id text_pattern_ops);


--
-- Name: api_andamentoprocesso_processo_id_d95ebfe3; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_processo_id_d95ebfe3 ON public.api_andamentoprocesso USING btree (processo_id);


--
-- Name: api_andamentoprocesso_processo_id_d95ebfe3_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_processo_id_d95ebfe3_like ON public.api_andamentoprocesso USING btree (processo_id varchar_pattern_ops);


--
-- Name: api_andamentoprocesso_serventia_id_7f16b316; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_serventia_id_7f16b316 ON public.api_andamentoprocesso USING btree (serventia_id);


--
-- Name: api_andamentoprocesso_tipo_andamento_id_cc849fa3; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_tipo_andamento_id_cc849fa3 ON public.api_andamentoprocesso USING btree (tipo_andamento_id);


--
-- Name: api_andamentoprocesso_tipo_ato_juiz_id_3e719b39; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_tipo_ato_juiz_id_3e719b39 ON public.api_andamentoprocesso USING btree (tipo_ato_juiz_id);


--
-- Name: api_andamentoprocesso_tipo_decisao_recurso_id_d8121b82; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_andamentoprocesso_tipo_decisao_recurso_id_d8121b82 ON public.api_andamentoprocesso USING btree (tipo_decisao_recurso_id);


--
-- Name: api_assunto_assunto_pai_id_87d13e30; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_assunto_assunto_pai_id_87d13e30 ON public.api_assunto USING btree (assunto_pai_id);


--
-- Name: api_atojuiz_tipo_ato_juiz_id_4d1ca5cb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_atojuiz_tipo_ato_juiz_id_4d1ca5cb ON public.api_atojuiz USING btree (tipo_ato_juiz_id);


--
-- Name: api_atojuiz_tipo_movimento_id_02a7130c; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_atojuiz_tipo_movimento_id_02a7130c ON public.api_atojuiz USING btree (tipo_movimento_id);


--
-- Name: api_classe_classe_pai_id_21a233c7; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_classe_classe_pai_id_21a233c7 ON public.api_classe USING btree (classe_pai_id);


--
-- Name: api_classe_cod_pers_ativo_id_c29046b6; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_classe_cod_pers_ativo_id_c29046b6 ON public.api_classe USING btree (cod_pers_ativo_id);


--
-- Name: api_classe_cod_pers_passivo_id_85589cb8; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_classe_cod_pers_passivo_id_85589cb8 ON public.api_classe USING btree (cod_pers_passivo_id);


--
-- Name: api_classeassunto_assunto_id_0f8743cb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_classeassunto_assunto_id_0f8743cb ON public.api_classeassunto USING btree (assunto_id);


--
-- Name: api_classeassunto_classe_id_6ee9dac8; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_classeassunto_classe_id_6ee9dac8 ON public.api_classeassunto USING btree (classe_id);


--
-- Name: api_documentoprocesso_assunto_id_7441b506; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_assunto_id_7441b506 ON public.api_documentoprocesso USING btree (assunto_id);


--
-- Name: api_documentoprocesso_classe_id_76b43488; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_classe_id_76b43488 ON public.api_documentoprocesso USING btree (classe_id);


--
-- Name: api_documentoprocesso_cod_docto_elet_2dca2e17_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_cod_docto_elet_2dca2e17_like ON public.api_documentoprocesso USING btree (cod_docto_elet text_pattern_ops);


--
-- Name: api_documentoprocesso_competencia_id_a06180c2; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_competencia_id_a06180c2 ON public.api_documentoprocesso USING btree (competencia_id);


--
-- Name: api_documentoprocesso_processo_id_989e3b94; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_processo_id_989e3b94 ON public.api_documentoprocesso USING btree (processo_id);


--
-- Name: api_documentoprocesso_processo_id_989e3b94_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_processo_id_989e3b94_like ON public.api_documentoprocesso USING btree (processo_id varchar_pattern_ops);


--
-- Name: api_documentoprocesso_tipo_documento_id_fbce891c; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_documentoprocesso_tipo_documento_id_fbce891c ON public.api_documentoprocesso USING btree (tipo_documento_id);


--
-- Name: api_funcionario_cod_carg_id_f9e13885; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_funcionario_cod_carg_id_f9e13885 ON public.api_funcionario USING btree (cod_carg_id);


--
-- Name: api_funcionario_num_matr_c04faba3_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_funcionario_num_matr_c04faba3_like ON public.api_funcionario USING btree (num_matr text_pattern_ops);


--
-- Name: api_gruposimilar_descricao_8517fd70; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilar_descricao_8517fd70 ON public.api_gruposimilar USING btree (descricao);


--
-- Name: api_gruposimilar_descricao_8517fd70_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilar_descricao_8517fd70_like ON public.api_gruposimilar USING btree (descricao varchar_pattern_ops);


--
-- Name: api_gruposimilar_user_id_76465acb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilar_user_id_76465acb ON public.api_gruposimilar USING btree (user_id);


--
-- Name: api_gruposimilarprocessos_grupo_id_74ae2fb1; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilarprocessos_grupo_id_74ae2fb1 ON public.api_gruposimilarprocessos USING btree (grupo_id);


--
-- Name: api_gruposimilarprocessos_processos_similares_id_05379787; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilarprocessos_processos_similares_id_05379787 ON public.api_gruposimilarprocessos USING btree (processos_similares_id);


--
-- Name: api_gruposimilarusuarios_administrador_id_22dfdd26; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilarusuarios_administrador_id_22dfdd26 ON public.api_gruposimilarusuarios USING btree (administrador_id);


--
-- Name: api_gruposimilarusuarios_grupo_id_398b776e; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilarusuarios_grupo_id_398b776e ON public.api_gruposimilarusuarios USING btree (grupo_id);


--
-- Name: api_gruposimilarusuarios_user_id_4513aca7; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_gruposimilarusuarios_user_id_4513aca7 ON public.api_gruposimilarusuarios USING btree (user_id);


--
-- Name: api_personagem_nome_6a36a828; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagem_nome_6a36a828 ON public.api_personagem USING btree (nome);


--
-- Name: api_personagem_nome_6a36a828_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagem_nome_6a36a828_like ON public.api_personagem USING btree (nome text_pattern_ops);


--
-- Name: api_personagemprocesso_personagem_id_b9e58ff4; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagemprocesso_personagem_id_b9e58ff4 ON public.api_personagemprocesso USING btree (personagem_id);


--
-- Name: api_personagemprocesso_processo_id_e79c4330; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagemprocesso_processo_id_e79c4330 ON public.api_personagemprocesso USING btree (processo_id);


--
-- Name: api_personagemprocesso_processo_id_e79c4330_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagemprocesso_processo_id_e79c4330_like ON public.api_personagemprocesso USING btree (processo_id varchar_pattern_ops);


--
-- Name: api_personagemprocesso_tipo_personagem_id_e9c2d775; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_personagemprocesso_tipo_personagem_id_e9c2d775 ON public.api_personagemprocesso USING btree (tipo_personagem_id);


--
-- Name: api_processo_assunto_id_bb791abc; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_assunto_id_bb791abc ON public.api_processo USING btree (assunto_id);


--
-- Name: api_processo_classe_id_560d82bb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_classe_id_560d82bb ON public.api_processo USING btree (classe_id);


--
-- Name: api_processo_cod_cnj_64be6b09_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_cod_cnj_64be6b09_like ON public.api_processo USING btree (cod_cnj varchar_pattern_ops);


--
-- Name: api_processo_cod_proc_972cf35a_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_cod_proc_972cf35a_like ON public.api_processo USING btree (cod_proc varchar_pattern_ops);


--
-- Name: api_processo_competencia_id_546603cb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_competencia_id_546603cb ON public.api_processo USING btree (competencia_id);


--
-- Name: api_processo_serventia_id_05073f3f; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processo_serventia_id_05073f3f ON public.api_processo USING btree (serventia_id);


--
-- Name: api_processossimilares_processo_base_id_b7d92ad3; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processossimilares_processo_base_id_b7d92ad3 ON public.api_processossimilares USING btree (processo_base_id);


--
-- Name: api_processossimilares_processo_base_id_b7d92ad3_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processossimilares_processo_base_id_b7d92ad3_like ON public.api_processossimilares USING btree (processo_base_id varchar_pattern_ops);


--
-- Name: api_processossimilares_processo_similar_id_a83cb884; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processossimilares_processo_similar_id_a83cb884 ON public.api_processossimilares USING btree (processo_similar_id);


--
-- Name: api_processossimilares_processo_similar_id_a83cb884_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_processossimilares_processo_similar_id_a83cb884_like ON public.api_processossimilares USING btree (processo_similar_id varchar_pattern_ops);


--
-- Name: api_serventia_comarca_id_776a14f3; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_serventia_comarca_id_776a14f3 ON public.api_serventia USING btree (comarca_id);


--
-- Name: api_tipoandamento_cod_tip_mov_id_e62c86f0; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_tipoandamento_cod_tip_mov_id_e62c86f0 ON public.api_tipoandamento USING btree (cod_tip_mov_id);


--
-- Name: api_tipomovimento_cod_tip_mov_pai_id_ad9c6816; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_tipomovimento_cod_tip_mov_pai_id_ad9c6816 ON public.api_tipomovimento USING btree (cod_tip_mov_pai_id);


--
-- Name: api_tipopersonagem_cod_tip_pers_inv_id_cf8773af; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX api_tipopersonagem_cod_tip_pers_inv_id_cf8773af ON public.api_tipopersonagem USING btree (cod_tip_pers_inv_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: frontend_avaliacaosimilaridade_processo_similar_id_9947f8ef; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX frontend_avaliacaosimilaridade_processo_similar_id_9947f8ef ON public.frontend_avaliacaosimilaridade USING btree (processo_similar_id);


--
-- Name: frontend_avaliacaosimilaridade_user_id_99f9324c; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX frontend_avaliacaosimilaridade_user_id_99f9324c ON public.frontend_avaliacaosimilaridade USING btree (user_id);


--
-- Name: knox_authtoken_digest_188c7e77_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX knox_authtoken_digest_188c7e77_like ON public.knox_authtoken USING btree (digest varchar_pattern_ops);


--
-- Name: knox_authtoken_salt_3d9f48ac_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX knox_authtoken_salt_3d9f48ac_like ON public.knox_authtoken USING btree (salt varchar_pattern_ops);


--
-- Name: knox_authtoken_token_key_8f4f7d47; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX knox_authtoken_token_key_8f4f7d47 ON public.knox_authtoken USING btree (token_key);


--
-- Name: knox_authtoken_token_key_8f4f7d47_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX knox_authtoken_token_key_8f4f7d47_like ON public.knox_authtoken USING btree (token_key varchar_pattern_ops);


--
-- Name: knox_authtoken_user_id_e5a5d899; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX knox_authtoken_user_id_e5a5d899 ON public.knox_authtoken USING btree (user_id);


--
-- Name: leads_lead_email_93d5b817_like; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX leads_lead_email_93d5b817_like ON public.leads_lead USING btree (email varchar_pattern_ops);


--
-- Name: leads_lead_owner_id_1f4568d0; Type: INDEX; Schema: public; Owner: elisdbadmin
--

CREATE INDEX leads_lead_owner_id_1f4568d0 ON public.leads_lead USING btree (owner_id);


--
-- Name: api_advogadoprocesso api_advogadoprocesso_advogado_id_715631e0_fk_api_advog; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso
    ADD CONSTRAINT api_advogadoprocesso_advogado_id_715631e0_fk_api_advog FOREIGN KEY (advogado_id) REFERENCES public.api_advogado(cod_adv) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_advogadoprocesso api_advogadoprocesso_processo_id_101d88fb_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso
    ADD CONSTRAINT api_advogadoprocesso_processo_id_101d88fb_fk_api_proce FOREIGN KEY (processo_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_advogadoprocesso api_advogadoprocesso_tipo_personagem_id_cd59dc40_fk_api_tipop; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_advogadoprocesso
    ADD CONSTRAINT api_advogadoprocesso_tipo_personagem_id_cd59dc40_fk_api_tipop FOREIGN KEY (tipo_personagem_id) REFERENCES public.api_tipopersonagem(cod_tip_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_juiz_id_2be2d4c0_fk_api_funci; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_juiz_id_2be2d4c0_fk_api_funci FOREIGN KEY (juiz_id) REFERENCES public.api_funcionario(num_matr) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_processo_id_d95ebfe3_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_processo_id_d95ebfe3_fk_api_proce FOREIGN KEY (processo_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_serventia_id_7f16b316_fk_api_serve; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_serventia_id_7f16b316_fk_api_serve FOREIGN KEY (serventia_id) REFERENCES public.api_serventia(cod_serv) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_tipo_andamento_id_cc849fa3_fk_api_tipoa; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_tipo_andamento_id_cc849fa3_fk_api_tipoa FOREIGN KEY (tipo_andamento_id) REFERENCES public.api_tipoandamento(cod_tip_and) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_tipo_ato_juiz_id_3e719b39_fk_api_tipoa; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_tipo_ato_juiz_id_3e719b39_fk_api_tipoa FOREIGN KEY (tipo_ato_juiz_id) REFERENCES public.api_tipoatojuiz(cod_tip_ato) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocess_tipo_decisao_recurso_d8121b82_fk_api_tipod; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocess_tipo_decisao_recurso_d8121b82_fk_api_tipod FOREIGN KEY (tipo_decisao_recurso_id) REFERENCES public.api_tipodecisaorecurso(cod_tip_dec_rec) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_andamentoprocesso api_andamentoprocesso_ato_juiz_id_f985f8b1_fk_api_atojuiz_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_andamentoprocesso
    ADD CONSTRAINT api_andamentoprocesso_ato_juiz_id_f985f8b1_fk_api_atojuiz_id FOREIGN KEY (ato_juiz_id) REFERENCES public.api_atojuiz(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_assunto api_assunto_assunto_pai_id_87d13e30_fk_api_assunto_cod_assunto; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_assunto
    ADD CONSTRAINT api_assunto_assunto_pai_id_87d13e30_fk_api_assunto_cod_assunto FOREIGN KEY (assunto_pai_id) REFERENCES public.api_assunto(cod_assunto) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_atojuiz api_atojuiz_tipo_ato_juiz_id_4d1ca5cb_fk_api_tipoa; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_atojuiz
    ADD CONSTRAINT api_atojuiz_tipo_ato_juiz_id_4d1ca5cb_fk_api_tipoa FOREIGN KEY (tipo_ato_juiz_id) REFERENCES public.api_tipoatojuiz(cod_tip_ato) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_atojuiz api_atojuiz_tipo_movimento_id_02a7130c_fk_api_tipom; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_atojuiz
    ADD CONSTRAINT api_atojuiz_tipo_movimento_id_02a7130c_fk_api_tipom FOREIGN KEY (tipo_movimento_id) REFERENCES public.api_tipomovimento(cod_tip_mov) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_classe api_classe_classe_pai_id_21a233c7_fk_api_classe_cod_classe; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classe
    ADD CONSTRAINT api_classe_classe_pai_id_21a233c7_fk_api_classe_cod_classe FOREIGN KEY (classe_pai_id) REFERENCES public.api_classe(cod_classe) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_classe api_classe_cod_pers_ativo_id_c29046b6_fk_api_tipop; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classe
    ADD CONSTRAINT api_classe_cod_pers_ativo_id_c29046b6_fk_api_tipop FOREIGN KEY (cod_pers_ativo_id) REFERENCES public.api_tipopersonagem(cod_tip_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_classe api_classe_cod_pers_passivo_id_85589cb8_fk_api_tipop; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classe
    ADD CONSTRAINT api_classe_cod_pers_passivo_id_85589cb8_fk_api_tipop FOREIGN KEY (cod_pers_passivo_id) REFERENCES public.api_tipopersonagem(cod_tip_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_classeassunto api_classeassunto_assunto_id_0f8743cb_fk_api_assun; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classeassunto
    ADD CONSTRAINT api_classeassunto_assunto_id_0f8743cb_fk_api_assun FOREIGN KEY (assunto_id) REFERENCES public.api_assunto(cod_assunto) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_classeassunto api_classeassunto_classe_id_6ee9dac8_fk_api_classe_cod_classe; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_classeassunto
    ADD CONSTRAINT api_classeassunto_classe_id_6ee9dac8_fk_api_classe_cod_classe FOREIGN KEY (classe_id) REFERENCES public.api_classe(cod_classe) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_documentoprocesso api_documentoprocess_assunto_id_7441b506_fk_api_assun; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocess_assunto_id_7441b506_fk_api_assun FOREIGN KEY (assunto_id) REFERENCES public.api_assunto(cod_assunto) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_documentoprocesso api_documentoprocess_classe_id_76b43488_fk_api_class; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocess_classe_id_76b43488_fk_api_class FOREIGN KEY (classe_id) REFERENCES public.api_classe(cod_classe) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_documentoprocesso api_documentoprocess_competencia_id_a06180c2_fk_api_compe; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocess_competencia_id_a06180c2_fk_api_compe FOREIGN KEY (competencia_id) REFERENCES public.api_competencia(cod_comp) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_documentoprocesso api_documentoprocess_processo_id_989e3b94_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocess_processo_id_989e3b94_fk_api_proce FOREIGN KEY (processo_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_documentoprocesso api_documentoprocess_tipo_documento_id_fbce891c_fk_api_tipod; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_documentoprocesso
    ADD CONSTRAINT api_documentoprocess_tipo_documento_id_fbce891c_fk_api_tipod FOREIGN KEY (tipo_documento_id) REFERENCES public.api_tipodocumento(id_tip_doc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_funcionario api_funcionario_cod_carg_id_f9e13885_fk_api_cargo_cod_carg; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_funcionario
    ADD CONSTRAINT api_funcionario_cod_carg_id_f9e13885_fk_api_cargo_cod_carg FOREIGN KEY (cod_carg_id) REFERENCES public.api_cargo(cod_carg) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilar api_gruposimilar_user_id_76465acb_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilar
    ADD CONSTRAINT api_gruposimilar_user_id_76465acb_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilarprocessos api_gruposimilarproc_grupo_id_74ae2fb1_fk_api_grupo; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarprocessos
    ADD CONSTRAINT api_gruposimilarproc_grupo_id_74ae2fb1_fk_api_grupo FOREIGN KEY (grupo_id) REFERENCES public.api_gruposimilar(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilarprocessos api_gruposimilarproc_processos_similares__05379787_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarprocessos
    ADD CONSTRAINT api_gruposimilarproc_processos_similares__05379787_fk_api_proce FOREIGN KEY (processos_similares_id) REFERENCES public.api_processossimilares(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilarusuarios api_gruposimilarusua_administrador_id_22dfdd26_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios
    ADD CONSTRAINT api_gruposimilarusua_administrador_id_22dfdd26_fk_auth_user FOREIGN KEY (administrador_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilarusuarios api_gruposimilarusua_grupo_id_398b776e_fk_api_grupo; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios
    ADD CONSTRAINT api_gruposimilarusua_grupo_id_398b776e_fk_api_grupo FOREIGN KEY (grupo_id) REFERENCES public.api_gruposimilar(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_gruposimilarusuarios api_gruposimilarusuarios_user_id_4513aca7_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_gruposimilarusuarios
    ADD CONSTRAINT api_gruposimilarusuarios_user_id_4513aca7_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_personagemprocesso api_personagemproces_personagem_id_b9e58ff4_fk_api_perso; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso
    ADD CONSTRAINT api_personagemproces_personagem_id_b9e58ff4_fk_api_perso FOREIGN KEY (personagem_id) REFERENCES public.api_personagem(cod_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_personagemprocesso api_personagemproces_processo_id_e79c4330_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso
    ADD CONSTRAINT api_personagemproces_processo_id_e79c4330_fk_api_proce FOREIGN KEY (processo_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_personagemprocesso api_personagemproces_tipo_personagem_id_e9c2d775_fk_api_tipop; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_personagemprocesso
    ADD CONSTRAINT api_personagemproces_tipo_personagem_id_e9c2d775_fk_api_tipop FOREIGN KEY (tipo_personagem_id) REFERENCES public.api_tipopersonagem(cod_tip_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processo api_processo_assunto_id_bb791abc_fk_api_assunto_cod_assunto; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_assunto_id_bb791abc_fk_api_assunto_cod_assunto FOREIGN KEY (assunto_id) REFERENCES public.api_assunto(cod_assunto) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processo api_processo_classe_id_560d82bb_fk_api_classe_cod_classe; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_classe_id_560d82bb_fk_api_classe_cod_classe FOREIGN KEY (classe_id) REFERENCES public.api_classe(cod_classe) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processo api_processo_competencia_id_546603cb_fk_api_compe; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_competencia_id_546603cb_fk_api_compe FOREIGN KEY (competencia_id) REFERENCES public.api_competencia(cod_comp) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processo api_processo_serventia_id_05073f3f_fk_api_serventia_cod_serv; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processo
    ADD CONSTRAINT api_processo_serventia_id_05073f3f_fk_api_serventia_cod_serv FOREIGN KEY (serventia_id) REFERENCES public.api_serventia(cod_serv) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processossimilares api_processossimilar_processo_base_id_b7d92ad3_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processossimilares
    ADD CONSTRAINT api_processossimilar_processo_base_id_b7d92ad3_fk_api_proce FOREIGN KEY (processo_base_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_processossimilares api_processossimilar_processo_similar_id_a83cb884_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_processossimilares
    ADD CONSTRAINT api_processossimilar_processo_similar_id_a83cb884_fk_api_proce FOREIGN KEY (processo_similar_id) REFERENCES public.api_processo(cod_proc) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_serventia api_serventia_comarca_id_776a14f3_fk_api_comarca_cod_coma; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_serventia
    ADD CONSTRAINT api_serventia_comarca_id_776a14f3_fk_api_comarca_cod_coma FOREIGN KEY (comarca_id) REFERENCES public.api_comarca(cod_coma) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_tipoandamento api_tipoandamento_cod_tip_mov_id_e62c86f0_fk_api_tipom; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipoandamento
    ADD CONSTRAINT api_tipoandamento_cod_tip_mov_id_e62c86f0_fk_api_tipom FOREIGN KEY (cod_tip_mov_id) REFERENCES public.api_tipomovimento(cod_tip_mov) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_tipomovimento api_tipomovimento_cod_tip_mov_pai_id_ad9c6816_fk_api_tipom; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipomovimento
    ADD CONSTRAINT api_tipomovimento_cod_tip_mov_pai_id_ad9c6816_fk_api_tipom FOREIGN KEY (cod_tip_mov_pai_id) REFERENCES public.api_tipomovimento(cod_tip_mov) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: api_tipopersonagem api_tipopersonagem_cod_tip_pers_inv_id_cf8773af_fk_api_tipop; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.api_tipopersonagem
    ADD CONSTRAINT api_tipopersonagem_cod_tip_pers_inv_id_cf8773af_fk_api_tipop FOREIGN KEY (cod_tip_pers_inv_id) REFERENCES public.api_tipopersonagem(cod_tip_pers) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: frontend_avaliacaosimilaridade frontend_avaliacaosi_processo_similar_id_9947f8ef_fk_api_proce; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.frontend_avaliacaosimilaridade
    ADD CONSTRAINT frontend_avaliacaosi_processo_similar_id_9947f8ef_fk_api_proce FOREIGN KEY (processo_similar_id) REFERENCES public.api_processossimilares(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: frontend_avaliacaosimilaridade frontend_avaliacaosimilaridade_user_id_99f9324c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.frontend_avaliacaosimilaridade
    ADD CONSTRAINT frontend_avaliacaosimilaridade_user_id_99f9324c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: knox_authtoken knox_authtoken_user_id_e5a5d899_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.knox_authtoken
    ADD CONSTRAINT knox_authtoken_user_id_e5a5d899_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: leads_lead leads_lead_owner_id_1f4568d0_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: elisdbadmin
--

ALTER TABLE ONLY public.leads_lead
    ADD CONSTRAINT leads_lead_owner_id_1f4568d0_fk_auth_user_id FOREIGN KEY (owner_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

