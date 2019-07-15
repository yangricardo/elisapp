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
-- Name: api_view_gruposimilar_processos; Type: VIEW; Schema: public; Owner: elisdbadmin
--

CREATE VIEW public.api_view_gruposimilar_processos AS
 SELECT gps.id,
    gps.grupo_id,
    gps.processos_similares_id,
    ps.similaridade,
    ps.processo_base_tj,
    ps.processo_similar_tj,
    ps.processo_base_cnj,
    ps.processo_similar_cnj
   FROM (public.api_mview_processossimilares ps
     JOIN public.api_gruposimilarprocessos gps ON ((gps.processos_similares_id = ps.id)));


ALTER TABLE public.api_view_gruposimilar_processos OWNER TO elisdbadmin;

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
-- PostgreSQL database dump complete
--

