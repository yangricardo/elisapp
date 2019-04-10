import os, sys, django, pandas as pd , numpy as np

# caminho para arquivos
TJ_FILES_PATH = '/tj_files'

# rotas de arquivos
csv = {
    'advogados' : '/Advogado/dcpadvogado_2013-2017.csv.gz',
    'tipo_decisao_recurso' : 'DCP_TIPO_DECISAO_RECURSO.csv.gz',
    'indice_processo' : 'PROCCORP_INDICEPROCESSO_2013-2017.csv.gz',
    'assunto' : '/Parametros/DCP_ASSUNTO.csv.gz',
    'tipo_decisao' : '/Parametros/DCP_TIPO_DECISAO.csv.gz',
    'ato_juiz' : '/Parametros/DCP_ATOJUIZ.csv.gz',
    'tipo_decisao_recurso' : '/Parametros/DCP_TIPO_DECISAO_RECURSO.csv.gz',
    'cardo' : '/Parametros/DCP_CARGO.csv.gz',
    'tipo_entidade' : '/Parametros/DCP_TIPO_ENTIDADE.csv.gz',
    'classe' : '/Parametros/DCP_CLASSE.csv.gz',
    'tipo_andamento' : '/Parametros/DCP_TipoAndamento.csv.gz',
    'classe_assunto' : '/Parametros/DCP_CLASSEASSUNTO.csv.gz',
    'classe_assunto_1nivel' : '/Parametros/DCP_CLASSEASSUNTOPRIMEIRONIVEL.csv.gz',
    'tipo_documento' : '/Parametros/PROCOORP_TIPODOCUMENTO.csv.gz',
    'comarca' : '/Parametros/DCP_Comarca.csv.gz',
    'rito' : '/Parametros/DCP_RITO.csv.gz',
    'serventia' : '/Parametros/DCP_Serventias.csv.gz',
    'tipo_andamento_local' : '/Parametros/DCP_TIPOANDAMENTOLOCAL.csv.gz',
    'tipo_resultado_audiencia' : '/Parametros/dcp_TipoResultadoAudiencia.csv.gz',
    'tipo_ato_juiz' : '/Parametros/DCP_TIPOATOJUIZ.csv.gz',
    'funcao' : '/Parametros/dcp_funcao.csv.gz',
    'tipo_personagem' : '/Parametros/DCP_TIPOPERSONAGEM.csv.gz',
    'tipo_acao' : '/Parametros/DCP_TIPO_ACAO.csv.gz',
    'tipo_movimento' : '/Parametros/dcptipomovimento.csv.gz',
    'tipo_acao_cnj' : '/Parametros/DCP_TIPO_ACAO_CNJ.csv.gz',
    'funcionario' : '/Parametros/funcionario.csv.gz',
    'tipo_andamento2' : '/Parametros/DCP_TIPO_ANDAMENTO.csv.gz',
    'tipos_personagem2' : '/Parametros/tipopersonagem.csv.gz',    
    'personagens':'/Personagem/PERSONAGEMP_2013-2017.csv.gz',
    'personagens_especial' : '/PersonagemEspecial/PROCESSO_PERSONAGEM_ESPECIAL_2013-2017.csv.gz',
    'personagem_especial_original' : '/PersonagemEspecialOriginal/Personagem_especialOriginal_2015_2017.csv.gz',
    'personagem_processo' : '/PersonagemProcesso/DCP_PERSONAGEMPROCESSO_2013-2017.csv.gz',
    'processo_unico' : '/ProcessoUnico/ProcessoUnico.csv.gz',
}

def setup_env():
    # exibe até 500 colunas
    pd.set_option('display.max_columns', 500)

    # adiciona os path dos modulos do django
    sys.path.append('/app')
    sys.path.append('/tj_files')

    #configura ambiente django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()