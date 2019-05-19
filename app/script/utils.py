import json
import os
import sys
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from os import listdir
from os.path import isfile, join
from datetime import datetime
import pytz
import django
import numpy as np
import pandas as pd
import requests
import itertools
import ftfy
import gc

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
        'processo_unico': 'ProcessoUnico/ProcessoUnico.csv.gz',
    }

    @staticmethod
    def andamento_processo_clob(serventia=r'(\d+)', ano=r'(\d+)'):
        return r'(AndamentoProcessoClobServAno/)?AndamentoProcesso(Clob)?_Cod_Serv_{}_ano_{}.csv.gz'.format(serventia, ano)

    @staticmethod
    def andamento_processo(serventia=r'(\d+)', ano=r'(\d+)'):
        return r'(AndamentoProcessoServAno/)?AndamentoProcesso(Clob)?_Cod_Serv_{}_ano_{}.csv.gz'.format(serventia, ano)

    @staticmethod
    def processo(serventia=r'(\d+)', ano=r'(\d+)'):
        return r'(ProcessoServAno/)?Processo_Cod_Serv_{}_ano_{}.csv.gz'.format(serventia, ano)

    @staticmethod
    def read_csv(file, **kwargs):
        return pd.read_csv(os.path.join('/tj_files', file),
                           encoding='latin1', sep=';',
                           chunksize=kwargs.get('chunksize'),
                           usecols=kwargs.get('usecols'),
                           low_memory=kwargs.get('low_memory'),
                           nrows=kwargs.get('nrows')
                           )

    @staticmethod
    def count_lines(file):
        return sum(1 for line in open(os.path.join('/tj_files',file), encoding='latin1'))

    @staticmethod
    def extract_serventia_ano_tuple(file_regex, file):
        regex = re.compile(file_regex())
        search = regex.search(file)
        return (int(search.groups()[-2]), int(search.groups()[-1])) if search else tuple()

    @staticmethod
    def list_files_in_serventias_anos(file_regex, servs_anos):
        dirpath = re.search(
            r'\((\w+/)\)', file_regex()).group(1)
        fulldirpath = os.path.join('/tj_files', dirpath)
        onlyfiles = [
            os.path.join(dirpath, f) for f in os.listdir(fulldirpath)
            if os.path.isfile(os.path.join(fulldirpath, f))
            and TJData.extract_serventia_ano_tuple(file_regex, f) in servs_anos
        ]
        return onlyfiles

    @staticmethod
    def get_servs_anos(file_format, cod_serventias, range_anos):
        servs_anos = list(map(
            lambda x: TJData.extract_serventia_ano_tuple(file_format, x),
            TJData.list_files_in_serventias_anos(file_format, 
                TJData.build_serventias_anos_list(cod_serventias, range_anos)))
        )
        return servs_anos

    @staticmethod
    def build_serventias_anos_list(cod_serventias, range_anos):
        return list(itertools.product(cod_serventias, range_anos))

    @staticmethod
    def nan_to_int(series):
        series = series.fillna(-1)
        series = series.astype(int)
        series = series.astype(str)
        series = series.replace('-1', np.nan)
        return series

    @staticmethod
    def max_length(series):
        return series.apply(lambda x: len(str(x))).agg(['max'])

    @staticmethod
    def to_utf8(series):
        return series.apply(lambda x: x.encode('utf8').decode())

    @staticmethod
    def to_utf8_bytes(series):
        return series.apply(lambda x: x.strip().encode('utf8') if not pd.isna(x) else None)

    @staticmethod
    def to_json(df):
        return json.loads(df.to_json(orient='records'))

    @staticmethod
    def to_datetime_iso_format(series, format="%d/%m/%Y %H:%M:%S"):
        # converte a serie de datetime para o formato iso8601 ajustado para o timezone America/Sao_Paulo
        return series.apply(lambda x: pytz.timezone('America/Sao_Paulo').localize(datetime.strptime(x, format)).isoformat() if not pd.isna(x) else np.nan)

    @staticmethod
    def concurrent_read(handle_df,files_list, kwargs):
        dfs = []
        with ThreadPoolExecutor(max_workers=12) as executor:
            future_read = {executor.submit(handle_df, file, kwargs):file for file in files_list}
            for future in as_completed(future_read):
                dfs.append(future.result())
        return dfs

    @staticmethod
    def clean_processo(file, kwargs):
        df = TJData.read_csv(file,usecols=kwargs.get('usecols'))
        df = df.rename(columns=lambda x : x.lower())
        df = df.rename(columns={'cod_comp':'competencia','cod_serv':'serventia','cod_assunto':'assunto'})
        # df.cod_proc = TJData.to_utf8_bytes(df.cod_proc)
        df.id_proc = df.id_proc.apply(lambda x : str(x))
        df.serventia = df.serventia.apply(lambda x : str(x))
        df.data_cad = TJData.to_datetime_iso_format(df.data_cad)
        df.data_cad = TJData.to_utf8_bytes(df.data_cad)
        return df

    @staticmethod
    def clob_to_merge(file, files_list, pattern):
        serv_ano = TJData.extract_serventia_ano_tuple(pattern,file)
        regex = re.compile(pattern(serv_ano[0],serv_ano[1]))
        return list(filter(lambda x : regex.match(x), files_list))[0]

    @staticmethod
    def clean_andamentos(file, kwargs):
        usecols = kwargs.get('usecols')
        merge_on = kwargs.get('merge_on')
        files_clob_list = kwargs.get('files_clob_list')
        clob_pattern = kwargs.get('clob_pattern')
        juizes = kwargs.get('juizes')
        tipos_andamento = kwargs.get('tipos_andamento')
        df = TJData.read_csv(file,usecols=usecols)
        df = df.rename(columns=lambda x : x.lower())
        # filtra pelas sentenças
        df = df[df.cod_tip_ato=='2']
        usecols = list(map(lambda x : x.lower(),usecols))
        try:
            # se existir planilha clob auxiliar, realiza a junção das tabelas para completar o TXT_DESCR
            df_clob = TJData.read_csv(TJData.clob_to_merge(file,files_clob_list,clob_pattern))
            df_clob = df_clob.rename(columns=lambda x : str(x).lower())
            df.ordem = df.ordem.astype(str)
            df_clob.ordem = df_clob.ordem.astype(str)
            df = df.merge(df_clob, on=merge_on, how='outer')
            df.cod_tip_and = df.cod_tip_and.apply(lambda x : str(1))
            df.cod_tip_ato = df.cod_tip_ato.apply(lambda x : str(2))
            df.cod_serv = df.cod_serv.apply(lambda x : df.cod_serv.iloc[0])
            # preenche os campos nulos de TXT_DESCR
            df.txt_descr_x = df.txt_descr_x.fillna(df.txt_descr_y)
            df = df.rename(columns={'txt_descr_x':'txt_descr'})
            usecols = list(df.columns)
            usecols.remove('num_seq')
            usecols.remove('txt_descr_y')
            df = df[usecols]
        finally:
            # limpa linhas sujas
            df = df[df.cod_proc.str.match(r'\d{4}.\d{3}.\d{6}-\d\w?')]
            # se por algum motivo TXT_DESCR ainda estiver nulo, utiliza TXT_DESCR_RES para preencher
            df.txt_descr = df.txt_descr.fillna(df.txt_descr_res)
            # ajusta codificação para utf8 (texto ainda com escapes)
            df.txt_descr = df.txt_descr.apply(lambda x : ftfy.fix_encoding(str(x)).strip().encode('latin1').decode('latin1').encode('utf8').decode('utf8').encode() if x is not np.nan else x)
            df.dt_ato = TJData.to_datetime_iso_format(df.dt_ato,'%d/%m/%Y')
            df = df[~pd.isna(df.txt_descr)]
            df = df.rename(columns={
                'cod_proc':'processo',
                'cod_tip_and' : 'tipo_andamento',
                'num_matr_juiz' : 'juiz',
                'cod_tip_ato' :  'tipo_ato_juiz',
                'cod_ato' : 'ato_juiz',
                'cod_serv' : 'serventia',
                'cod_tip_dec_rec' : 'tipo_decisao_recurso',   
                })
            df.juiz = df.juiz.apply(lambda x : x if x in juizes else np.nan)
            df = df.assign(txt_descr_len = df.txt_descr.apply(lambda x : len(str(x)) if not pd.isna(x) else 0 ))
            # df.tipo_andamento = df.tipo_andamento.apply(lambda x : x if x in tipos_andamento else np.nan)
            usecols = list(df.columns)
            usecols.remove('txt_descr_res')
            return df[usecols].sort_values(['processo','ordem']).reset_index(drop=True)

    



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
        self.host = host
        self.resources = json.loads(requests.get(self.host+'/auth').text)
        self.resources.update(json.loads(
            requests.get(self.host+'/api/models').text))
        r = requests.post(self.resources['login'], json={
            "username": str(username),
            "password": str(password)
        })
        rawdata = json.loads(r.text)
        if type(rawdata) is not dict:
            raise ValueError(r.status_code, rawdata)
        self.token = rawdata['token']
        self.username = rawdata['user']['username']
        self.email = rawdata['user']['email']
        self.id = rawdata['user']['id']
        self.headers = {
            'Authorization': f'token {self.token}',
            'charset': 'utf-8'
        }

    def head(self, resource, detail=""):
        response = requests.head(f'{self.resources[resource]}{str(detail)}',
                                 headers=self.headers)
        return response

    def get(self, resource, detail=""):
        response = requests.get(f'{self.resources[resource]}{str(detail)}',
                                headers=self.headers)
        return response

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

    def concurrent_request(self, request, resource, data_list, **kwargs):
        responses = []
        detail = kwargs.get('detail')
        with ThreadPoolExecutor(max_workers=9) as executor:
            if request == self.get or request == self.patch or request == self.put:
                future_request = {executor.submit(
                    request, resource, data[detail] if detail else "", data): data for data in data_list}
            else:
                future_request = {executor.submit(
                    request, resource, data): data for data in data_list}
            data_list.clear()
            del data_list
            gc.collect()
            for future in as_completed(future_request):
                response = future_request[future]
                try:
                    data = future.result()
                except Exception as exc:
                    responses.append(exc)
                else:
                    if (request == self.post and data.status_code != 201) or (request == self.patch and data.status_code != 200):
                        responses.append(data)
                    else:
                        del response
                        del data
                gc.collect()
            del future_request
            gc.collect()
        return responses

    @staticmethod
    def response_to_json(response):
        return json.loads(response.text)

    @staticmethod
    def concurrent_responses_to_json(responses):
        return list(map(lambda x: json.loads(x[1].text), responses))

    @staticmethod
    def get_erros(responses, expected_code):
        return list(filter(lambda x: x[1].status_code != expected_code, responses))

    @staticmethod
    def describe_attribute_error(error_list, attribute):
        # converte para objeto o string json
        erros = list(map(lambda x: json.loads(x[1].text), error_list))
        # remove registros que não ocorreram erro
        erros = list(map(lambda lst: list(
            filter(lambda x: x != {}, lst)), erros))
        # seleciona e remove erros duplicados referente ao atributo
        erros = list(map(lambda lst: list(
            map(lambda lst2: lst2[attribute], lst)), erros))
        erros = [list(error_lst[0]) for error_lst in erros]
        erros = set(map(lambda x: x[0], erros))
        return erros

    @staticmethod
    def list_pk_errors(erros):
        return list(map(lambda x: re.search(r'(\d+)', x).group(), erros))

    @staticmethod
    def split_list(lst, max_size_group):
        return [lst[i::max_size_group] for i in range(max_size_group)]

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
