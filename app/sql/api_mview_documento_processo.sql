-- View: public.api_mview_documento_processo

-- DROP MATERIALIZED VIEW public.api_mview_documento_processo;

CREATE MATERIALIZED VIEW public.api_mview_documento_processo
TABLESPACE pg_default
AS
 SELECT dp.cod_docto_elet AS cod_documento,
    p.cod_proc AS processo_tj,
    p.cod_cnj AS processo_cnj,
    td.id_tip_doc AS id_tipo_documento,
    td.descr AS tipo_documento
   FROM api_documentoprocesso dp
     JOIN api_processo p ON p.cod_proc::text = dp.processo_id::text
     JOIN api_tipodocumento td ON td.id_tip_doc = dp.tipo_documento_id
WITH DATA;

ALTER TABLE public.api_mview_documento_processo
    OWNER TO elisdbadmin;


CREATE INDEX api_mview_documento_processo_cnj
    ON public.api_mview_documento_processo USING btree
    (processo_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_tipo_documento_processo_tj
    ON public.api_mview_documento_processo USING btree
    (processo_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;