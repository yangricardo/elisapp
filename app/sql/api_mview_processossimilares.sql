-- View: public.api_mview_processossimilares

-- DROP MATERIALIZED VIEW public.api_mview_processossimilares;

CREATE MATERIALIZED VIEW public.api_mview_processossimilares
TABLESPACE pg_default
AS
 SELECT ps.id,
    ps.similaridade,
    ps.processo_base_id AS processo_base_tj,
    ps.processo_similar_id AS processo_similar_tj,
    psd.cod_cnj AS processo_similar_cnj,
    pbd.cod_cnj AS processo_base_cnj,
    cb.desc_coma AS processo_base_comarca,
    cs.desc_coma AS processo_similar_comarca,
    sb.desc_serv AS processo_base_serventia,
    ss.desc_serv AS processo_similar_serventia,
    ab.descr AS processo_base_assunto,
    a_s.descr AS processo_similar_assunto,
    clb.descr AS processo_base_classe,
    cls.descr AS processo_similar_classe,
    comb.desc_comp AS processo_base_competencia,
    coms.desc_comp AS processo_similar_competencia
   FROM api_processossimilares ps
     JOIN api_processo pbd ON pbd.cod_proc::text = ps.processo_base_id::text
     JOIN api_processo psd ON psd.cod_proc::text = ps.processo_similar_id::text
     FULL JOIN api_assunto ab ON ab.cod_assunto = pbd.assunto_id
     FULL JOIN api_assunto a_s ON a_s.cod_assunto = psd.assunto_id
     FULL JOIN api_classe clb ON clb.cod_classe = pbd.classe_id
     FULL JOIN api_classe cls ON cls.cod_classe = psd.classe_id
     JOIN api_serventia sb ON sb.cod_serv = pbd.serventia_id
     JOIN api_serventia ss ON ss.cod_serv = psd.serventia_id
     JOIN api_comarca cb ON cb.cod_coma = sb.comarca_id
     JOIN api_comarca cs ON cs.cod_coma = ss.comarca_id
     JOIN api_competencia comb ON comb.cod_comp = pbd.competencia_id
     JOIN api_competencia coms ON coms.cod_comp = psd.competencia_id
  ORDER BY ps.processo_base_id, ps.similaridade DESC
WITH DATA;

ALTER TABLE public.api_mview_processossimilares
    OWNER TO elisdbadmin;


CREATE INDEX api_mview_processossimilares_assunto
    ON public.api_mview_processossimilares USING btree
    (processo_base_assunto COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_classe
    ON public.api_mview_processossimilares USING btree
    (processo_base_classe COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_comarca
    ON public.api_mview_processossimilares USING btree
    (processo_base_comarca COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_processo_base
    ON public.api_mview_processossimilares USING btree
    (processo_base_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_processo_base_cnj
    ON public.api_mview_processossimilares USING btree
    (processo_base_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_processo_similar
    ON public.api_mview_processossimilares USING btree
    (processo_similar_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_processo_similar_cnj
    ON public.api_mview_processossimilares USING btree
    (processo_similar_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_processossimilares_serventia
    ON public.api_mview_processossimilares USING btree
    (processo_base_serventia COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;