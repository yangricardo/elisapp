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

SET default_tablespace = '';

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
-- PostgreSQL database dump complete
--

