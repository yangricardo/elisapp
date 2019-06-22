-- FUNCTION: public.refreshallmaterializedviews(text, boolean)

-- DROP FUNCTION public.refreshallmaterializedviews(text, boolean);

CREATE OR REPLACE FUNCTION public.refreshallmaterializedviews(
	_schema text DEFAULT '*'::text,
	_concurrently boolean DEFAULT false)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
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
$BODY$;

ALTER FUNCTION public.refreshallmaterializedviews(text, boolean)
    OWNER TO elisdbadmin;


select refreshallmaterializedviews('public', false)

REFRESH MATERIALIZED VIEW public.api_mview_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_advogado_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_documento_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_personagens_processo WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_sentencas WITH DATA;
REFRESH MATERIALIZED VIEW public.api_mview_processossimilares WITH DATA;