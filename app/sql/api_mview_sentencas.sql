-- View: public.api_mview_sentencas

-- DROP MATERIALIZED VIEW public.api_mview_sentencas;

CREATE MATERIALIZED VIEW public.api_mview_sentencas
TABLESPACE pg_default
AS
 SELECT ap.id,
    p.cod_proc AS processo_tj,
    p.cod_cnj AS processo_cnj,
    ap.txt_descr AS sentenca,
    aj.descr AS ato_juiz,
    j.num_matr AS matricula_juiz,
    j.nome AS nome_juiz,
    c.descr AS cargo_juiz
   FROM api_andamentoprocesso ap
     JOIN api_processo p ON p.cod_proc::text = ap.processo_id::text
     LEFT JOIN api_atojuiz aj ON aj.id = ap.ato_juiz_id
     LEFT JOIN api_funcionario j ON j.num_matr = ap.juiz_id
     LEFT JOIN api_cargo c ON c.cod_carg = j.cod_carg_id
  WHERE ap.tipo_ato_juiz_id = 2
  ORDER BY p.cod_proc
WITH DATA;

ALTER TABLE public.api_mview_sentencas
    OWNER TO elisdbadmin;


CREATE INDEX api_mview_sentencas_ato_juiz
    ON public.api_mview_sentencas USING btree
    (ato_juiz COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_sentencas_cargo_juiz
    ON public.api_mview_sentencas USING btree
    (cargo_juiz COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_sentencas_nome_juiz
    ON public.api_mview_sentencas USING btree
    (nome_juiz COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_sentencas_processo_cnj
    ON public.api_mview_sentencas USING btree
    (processo_cnj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;
CREATE INDEX api_mview_sentencas_processo_tj
    ON public.api_mview_sentencas USING btree
    (processo_tj COLLATE pg_catalog."C.UTF-8" text_pattern_ops)
    TABLESPACE pg_default;