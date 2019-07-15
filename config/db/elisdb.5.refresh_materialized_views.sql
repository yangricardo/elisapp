select refreshallmaterializedviews('public', false)

REFRESH MATERIALIZED VIEW public.api_mview_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_advogado_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_documento_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_personagens_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_sentencas WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_processossimilares WITH DATA;