-- View: public.api_mview_personagens_processo

-- DROP MATERIALIZED VIEW public.api_mview_personagens_processo;

CREATE MATERIALIZED VIEW public.api_mview_personagens_processo
TABLESPACE pg_default
AS
 SELECT p.nome AS nome_personagem,
    pp.processo_id AS processo_tj,
    pr.cod_cnj AS processo_cnj,
    tp.desc_pers AS tipo_personagem
   FROM api_personagemprocesso pp
     JOIN api_personagem p ON p.cod_pers = pp.personagem_id
     JOIN api_processo pr ON pr.cod_proc::text = pp.processo_id::text
     JOIN api_tipopersonagem tp ON tp.cod_tip_pers = pp.tipo_personagem_id
WITH DATA;

ALTER TABLE public.api_mview_personagens_processo
    OWNER TO elisdbadmin;


CREATE INDEX api_mview_personagens_processo_processo_cnj
    ON public.api_mview_personagens_processo USING btree
    (processo_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_personagens_processo_processo_tj
    ON public.api_mview_personagens_processo USING btree
    (processo_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;