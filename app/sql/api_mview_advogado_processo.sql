-- View: public.api_mview_advogado_processo

-- DROP MATERIALIZED VIEW public.api_mview_advogado_processo;

CREATE MATERIALIZED VIEW public.api_mview_advogado_processo
TABLESPACE pg_default
AS
 SELECT a.num_oab AS oab,
    a.nome_adv AS nome,
    ap.tip_polo AS polo,
    p.cod_proc AS processo_tj,
    p.cod_cnj AS processo_cnj
   FROM api_advogadoprocesso ap
     JOIN api_advogado a ON a.cod_adv = ap.advogado_id
     JOIN api_processo p ON p.cod_proc::text = ap.processo_id::text
WITH DATA;

ALTER TABLE public.api_mview_advogado_processo
    OWNER TO elisdbadmin;


CREATE INDEX api_mview_advogado_processo_cnj
    ON public.api_mview_advogado_processo USING btree
    (processo_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_advogado_processo_nome
    ON public.api_mview_advogado_processo USING btree
    (nome COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_advogado_processo_oab
    ON public.api_mview_advogado_processo USING btree
    (oab COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_advogado_processo_tj
    ON public.api_mview_advogado_processo USING btree
    (processo_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;