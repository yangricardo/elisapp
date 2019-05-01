import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

import django
import numpy as np
import pandas as pd
import requests


class TJData:

    csv = {
        'assunto': 'Parameters/ASSUNTO.csv',
        'assunto_2': 'Parametros/DCP_ASSUNTO.csv.gz',
        'assunto_3': 'ASSUNTO.csv',
        'tipo_pedido_mp': 'Parameters/DCP_DCP_TIPOPEDIDOMP.csv',
        'tipo_vinculo': 'Parameters/DCP_TIPOVINCULO.CSV',
        'serventias_full': 'Parameters/serventias_full.csv',
        'ato_juiz': 'Parameters/ATOJUIZ.csv',
        'ato_juiz_2': 'Parametros/DCP_ATOJUIZ.csv.gz',
        'destinatario': 'Parameters/DCP_DESTINATARIO.CSV',
        'tipo_vinculo_processo': 'Parameters/DCP_TIPOVINCULOPROCESSO.csv',
        'tipo_andamento': 'Parameters/tipoandamento.csv',
        'classe': 'Parameters/cLASSE.csv',
        'orgao_mp': 'Parameters/DCP_ORGAOMP.CSV',
        'grupo_processamento': 'Parameters/GRUPOPROCESSAMENTO.csv',
        'tipo_ato_juiz': 'Parameters/TIPOATOJUIZ.csv',
        'comarca': 'Parameters/DCP_Comarca.csv',
        'tipo_categoria_serventia': 'Parameters/DCP_TIPOCATEGORIASERVENTIA.csv',
        'tipo_destinatario': 'Parameters/proccorp_tipodestinatario.csv',
        'competencia': 'Parameters/DCP_Competencia.csv',
        'tipo_remessa': 'Parameters/DCP_TIPOREMESSA.csv',
        'rito': 'Parameters/RITO.csv',
        'advogado': 'Advogado/dcpadvogado_2013-2017.csv.gz',
        'indice_processo': 'IndiceProcesso/PROCCORP_INDICEPROCESSO_2013-2017.csv.gz',
        'personagem': 'Personagem/PERSONAGEMP_2013-2017.csv.gz',
        'personagem_especial': 'PersonagemEspecial/PROCESSO_PERSONAGEM_ESPECIAL_2013-2017.csv.gz',
        'personagem_especial_original': 'PersonagemEspecialOriginal/Personagem_especialOriginal_2015_2017.csv.gz',
        'personagem_processo': 'PersonagemProcesso/DCP_PERSONAGEMPROCESSO_2013-2017.csv.gz',
        'cargo': 'Parametros/DCP_CARGO.csv.gz',
        'classe_assunto_2': 'Parametros/DCP_CLASSEASSUNTO.csv.gz',
        'classe_assunto_primeiro_nivel': 'Parametros/DCP_CLASSEASSUNTOPRIMEIRONIVEL.csv.gz',
        'classe_2': 'Parametros/DCP_CLASSE.csv.gz',
        'comarca_2': 'Parametros/DCP_Comarca.csv.gz',
        'funcao': 'Parametros/dcp_funcao.csv.gz',
        'rito': 'Parametros/DCP_RITO.csv.gz',
        'serventia_2': 'Parametros/DCP_Serventias.csv.gz',
        'tipo_acao_cnj': 'Parametros/DCP_TIPO_ACAO_CNJ.csv.gz',
        'tipo_acao': 'Parametros/DCP_TIPO_ACAO.csv.gz ',
        'tipo_andamento_1': 'Parametros/DCP_TIPO_ANDAMENTO_Created.csv.gz',
        'tipo_andamento_2': 'Parametros/DCP_TIPO_ANDAMENTO.csv.gz',
        'tipo_andamento_local': 'Parametros/DCP_TIPOANDAMENTOLOCAL.csv.gz',
        'tipo_categoria_docto_juntada': 'Parametros/DCP_TIPO_CATEGORIA_DOCTO_JUNTADA.csv.gz',
        'tipo_decisao': 'Parametros/DCP_TIPO_DECISAO.csv.gz',
        'tipo_decisao_recurso': 'Parametros/DCP_TIPO_DECISAO_RECURSO.csv.gz',
        'tipo_entidade': 'Parametros/DCP_TIPO_ENTIDADE.csv.gz',
        'tipo_movimento': 'Parametros/dcptipomovimento-Created.csv.gz',
        'tipo_movimento_2': 'Parametros/dcptipomovimento.csv.gz',
        'tipo_personagem': 'Parametros/DCP_TIPOPERSONAGEM.csv.gz',
        'grupo_processamento_2': 'Parametros/DCP_GRUPOPROCESSAMENTO.csv.gz',
        'tipo_resultado_audiencia': 'Parametros/dcp_TipoResultadoAudiencia.csv.gz',
        'funcionario': 'Parametros/funcionario.csv.gz',
        'tipo_documento': 'Parametros/PROCOORP_TIPODOCUMENTO.csv.gz',
        'tipo_documento_juntada': 'Parametros/TIPODOCUMENTOJUNTADA.csv.gz',
        'tipo_personagem': 'Parametros/tipopersonagem.csv.gz',
        'tipo_andamento_3': 'Parametros/DCP_TipoAndamento_created.csv.gz',
        'processo_unico': 'ProcessoUnico.csv.gz',
    }

    @staticmethod
    def andamento_processo_clob(serventia, ano):
        return f'AndamentoProcessoClobServAno/AndamentoProcesso_Cod_Serv_{serventia}_ano_{ano}.csv.gz'

    @staticmethod
    def andamento_processo(serventia, ano):
        return f'AndamentoProcessoServAno/AndamentoProcesso_Cod_Serv_{serventia}_ano_{ano}.csv.gz'

    @staticmethod
    def processo(serventia, ano):
        return f'ProcessoServAno/Processo_Cod_Serv_{serventia}_ano_{ano}.csv.gz'

    @staticmethod
    def read_csv(file, **kwargs):
        chunksize = kwargs.get('chunksize')
        usecols = kwargs.get('usecols')
        return pd.read_csv(os.path.join('/tj_files', file), encoding='latin1', sep=';', chunksize=chunksize, usecols=usecols)

    @staticmethod
    def nan_to_int(series):
        series = series.fillna(-1)
        series = series.astype(int)
        series = series.astype(str)
        series = series.replace('-1', np.nan)
        return series

    @staticmethod
    def to_utf8(series):
        return series.apply(lambda x: x.encode('utf8').decode())

    @staticmethod
    def to_utf8_bytes(series):
        return series.apply(lambda x: x.strip().encode('utf8') if not pd.isnull(x) else x)

    @staticmethod
    def to_json(df):
        return json.loads(df.to_json(orient='records'))


def setup_env():
    # exibe até 500 colunas
    pd.set_option('display.max_columns', 500)
    pd.set_option('display.max_rows', 500)

    # adiciona os path dos modulos do django
    sys.path.append('/app')
    sys.path.append('/tj_files')

    # configura ambiente django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()


class ElisAPI:
    def __init__(self, host, username, password):
        r = requests.post(f'{host}/auth/login', json={
            "username": str(username),
            "password": str(password)
        })
        rawdata = json.loads(r.text)
        self.host = host
        self.token = rawdata['token']
        self.username = rawdata['user']['username']
        self.email = rawdata['user']['email']
        self.id = rawdata['user']['id']
        resources = requests.get(self.host+'/api')
        self.resources = json.loads(resources.text)
        self.headers = {
            'Authorization': f'token {self.token}',
            'charset':'utf-8'
        }

    def head(self, resource, detail=""):
        response = requests.head(f'{self.resources[resource]}{str(detail)}',
                                 headers=self.headers)
        return response

    def get(self, resource, detail=""):
        response = requests.get(f'{self.resources[resource]}{str(detail)}',
                                headers=self.headers)
        return json.loads(response.text), response

    def post(self, resource, data):
        response = requests.post(self.resources[resource],
                                 json=data,
                                 headers=self.headers)
        return response

    def put(self, resource, detail, data):
        response = requests.put(f'{self.resources[resource]}{str(detail)}/',
                                json=data,
                                headers=self.headers)
        return response

    def patch(self, resource, detail, data):
        response = requests.patch(f'{self.resources[resource]}{str(detail)}/',
                                  json=data,
                                  headers=self.headers)
        return response

    def concurrent_request(self, request, resource, data_list,**kwargs):
        self.responses = []
        detail = kwargs.get('detail')
        with ThreadPoolExecutor(max_workers=9) as executor:
            if request == self.get or request == self.patch or request == self.put:
                future_request = {executor.submit(
                request, resource, data[detail] if detail else "" , data): data for data in data_list}
            else:
                future_request = {executor.submit(
                request, resource, data): data for data in data_list}
            for future in as_completed(future_request):
                response = future_request[future]
                try:
                    data = future.result()
                except Exception as exc:
                    self.responses.append((response, exc))
                else:
                    self.responses.append((response, data))
        return self.responses

    @staticmethod
    def get_erros(responses,expected_code):
        return list(filter(lambda x : x[1].status_code != expected_code,responses))

# def handle_assunto_pai_error(r):
#     # processa cod_assunto_pai que ocorreu erro
#     r_error = json.loads(r.text)
#     r_error = pd.DataFrame(r_error)
#     r_error.assunto_pai = r_error.assunto_pai.astype(str)
#     r_error.assunto_pai = r_error.assunto_pai.str.extract(r'([0-9]+)')
#     r_error = r_error[~pd.isna(r_error.assunto_pai)]
#     r_error.assunto_pai = r_error.assunto_pai.astype(int)
#     error_set = set()
#     r_error.assunto_pai.apply(lambda x : error_set.add(x))
#     error_set = list(error_set)
#     return error_set



# tj.Funcionario.objects.all().delete()
# tj.Cargo.objects.all().delete()
# tj.TipoAndamento.objects.all().delete()
# tj.TipoMovimento.objects.all().delete()
# tj.ClasseAssunto.objects.all().delete()
# tj.Classe.objects.all().delete()
# tj.Assunto.objects.all().delete()
# tj.TipoPersonagem.objects.all().delete()
# tj.Competencia.objects.all().delete()
# tj.Serventia.objects.all().delete()
# tj.Comarca.objects.all().delete()
