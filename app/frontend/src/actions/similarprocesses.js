import axios from 'axios';
import {CREATE_MESSAGE,SELECT_SIMILAR_PROCESSES, CLEAR_SELECTED_SIMILAR_PROCESSES,SUBMIT_RATING_FAIL, 
    SUBMIT_RATING_SUCCESS, CLEAR_SEARCHED_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, 
    LOAD_ASYNC_TRUE, LOAD_ASYNC_FALSE, CACHE_SIMILAR_PROCESS, SET_SIMILAR_PROCESS_RESULTS, GET_SIMILAR_GROUPS,
    NEW_SIMILAR_GROUP, LIST_SIMILAR, GET_ADVOGADOS, GET_ANOS, GET_CLASSES_ASSUNTOS, GET_COMARCAS_SERVENTIAS,
    GET_JUIZES, GET_PERSONAGENS, AUTH_ERROR, OPEN_GROUP_DIALOG
} from './types';
import { tokenConfig } from './auth';
import { returnError } from './message';


export const urlRE = new RegExp('https?:\\/\\/(\\w\\.?)+');
export const similarProcessURLRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');


export const searchProcess = (searchProcess,setSimilarProcessResults,loadSimilarProcesses,clearSearchedProcess,setLoading,returnError) => (dispatch, getState)=>{
    // setLoading();
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/processossimilaresreport/?processo_tj=${searchProcess}`, tokenConfig(getState))
    .then(res => {
        const found = res.data.results !== undefined
        if (found) {
            const {results} = res.data
            setSimilarProcessResults(results);
            loadSimilarProcesses(results[0]['processo_base_tj'], true)
        } else {
            clearSearchedProcess();
        }
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err => {
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        dispatch({type:LOAD_ASYNC_FALSE})
        returnError(err.response.data, err.response.status);
    });
}

export const loadSimilarProcessFromList = (similarProcessesData) => (dispatch,getState) => {
    const {cachedProcesses} = getState().similarProcessesReducer
    const {processo_base_tj,processo_similar_tj} = similarProcessesData
    if(cachedProcesses.hasOwnProperty(processo_base_tj) && cachedProcesses.hasOwnProperty(processo_similar_tj) ){
        dispatch({
            type : SET_SEARCHED_PROCESS,
            payload : cachedProcesses[processo_base_tj]
        })
        dispatch({
            type : SET_SIMILAR_PROCESS,
            payload : cachedProcesses[processo_similar_tj]
        })
    } else {
        var similarProcessURL;
        try {
            similarProcessURL = similarProcessesData.id.replace(urlRE,"")
        } catch{
            similarProcessURL = `/api/models/processossimilaresreport/${similarProcessesData.processos_similares}`
        }
        axios.get(similarProcessURL, tokenConfig(getState))
        .then(res => {
            if (res.data !== undefined){
                const {processo_base, processo_similar} = res.data
                dispatch({
                    type : SET_SEARCHED_PROCESS,
                    payload : processo_base
                })
                dispatch({
                    type : SET_SIMILAR_PROCESS,
                    payload : processo_similar
                })
                dispatch ({
                    type : CACHE_SIMILAR_PROCESS,
                    payload : processo_base
                })
                dispatch ({
                    type : CACHE_SIMILAR_PROCESS,
                    payload : processo_similar
                })
                dispatch({
                    type : SET_SIMILAR_PROCESS_RESULTS,
                    payload : processo_similar.processos_similares
                })
            }
        })
        .catch(err => {
            if (err.status === 401){
                dispatch({type:AUTH_ERROR})
            }
            if (err.response !== undefined){ 
                returnError(err.response.data, err.response.status)
            }
            dispatch({
                type: CREATE_MESSAGE,
                payload: { loadingFail: `Falha ao carregar dados do processo similar ${processo.processo_similar_tj}` }
            })
        })
    }
}

export const loadSimilarProcesses = (processoBaseTJ, onSearch=false, onList=false) => (dispatch, getState) => {
    const {cachedSimilarProcesses,cachedProcesses} = getState().similarProcessesReducer
    const similarProcesses = cachedSimilarProcesses[processoBaseTJ]
    
    const fetchProcessData = (processo) =>{
        const similarProcessURL = processo.id.replace(urlRE,"")
        const id = similarProcessURLRE.exec(processo.id)[2]
        if (!(id in cachedSimilarProcesses) || !(id in cachedProcesses) ){
            axios.get(similarProcessURL, tokenConfig(getState))
            .then(res => {
                if (res.data !== undefined){
                    const {processo_base, processo_similar} = res.data
                    if (processo_similar.processo_tj === similarProcesses[0].processo_similar_tj){
                        dispatch({
                            type : SET_SEARCHED_PROCESS,
                            payload : processo_base
                        })
                        dispatch({
                            type : SET_SIMILAR_PROCESS,
                            payload : processo_similar
                        })
                    }
                    dispatch ({
                        type : CACHE_SIMILAR_PROCESS,
                        payload : processo_base
                    })
                    dispatch ({
                        type : CACHE_SIMILAR_PROCESS,
                        payload : processo_similar
                    })
                    dispatch({
                        type : SET_SIMILAR_PROCESS_RESULTS,
                        payload : processo_similar.processos_similares
                    })
                    dispatch({type:LOAD_ASYNC_FALSE})
                }
            })
            .catch(err => {
                if (err.status === 401){
                    dispatch({type:AUTH_ERROR})
                }
                returnError(err.response.data, err.response.status);
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { loadingFail: `Falha ao carregar dados do processo similar ${processo.processo_similar_tj}` }
                })
                dispatch({type:LOAD_ASYNC_FALSE})
            });
        }
    }

    if (onSearch) {
        dispatch({type:LOAD_ASYNC_TRUE})
        fetchProcessData(similarProcesses[0])
    }
    else {
        if (similarProcesses !== undefined)
            for (let processo of similarProcesses) {
                dispatch({type:LOAD_ASYNC_TRUE})
                fetchProcessData(processo)
            }
    }
}

export const clearSearchedProcess = () => (dispatch) => {
    dispatch({
        type : CLEAR_SEARCHED_PROCESS,
    })
}

export const setSearchedProcess = (searchedProcess) => dispatch => {
    dispatch({
        type : SET_SEARCHED_PROCESS,
        payload : searchedProcess
    })
}

export const setSimilarProcess = (similarProcess) => dispatch => {
    dispatch({
        type : SET_SIMILAR_PROCESS,
        payload : similarProcess
    })
}

export const setSimilarProcessResults = (similarProcessResults) => dispatch => {
    dispatch({
        type : SET_SIMILAR_PROCESS_RESULTS,
        payload : similarProcessResults
    })
}

export const selectSimilarProcesses = (selectedSimilarProcesses) => (dispatch, getState) => {
    dispatch({
        type : SELECT_SIMILAR_PROCESSES,
        payload : selectedSimilarProcesses
    })
}

export const clearSelectedSimilarProcesses = () => (dispatch) => {
    dispatch({type:CLEAR_SELECTED_SIMILAR_PROCESSES})
}

export const submitRating = (processo_similar, inicial, contestacao, sentenca, comentario) => (dispatch, getState) => {
    const rating = {
        processo_similar : similarProcessURLRE.exec(processo_similar.id)[2],
        inicial,
        contestacao,
        sentenca,
        comentario,
    }
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.post('/api/models/avaliacoes/',rating, tokenConfig(getState))
    .then( res =>{
        dispatch({
			type: CREATE_MESSAGE,
			payload: { ratingSuccess: `Avaliação de Similaridade enviada com sucesso` }
		})
        dispatch({
            type : SUBMIT_RATING_SUCCESS
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err =>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        dispatch({
			type: CREATE_MESSAGE,
			payload: { ratingFail: `Falha ao enviar Avaliação de Similaridade` }
		})
        dispatch({
            type : SUBMIT_RATING_FAIL
        })
        dispatch(returnError(err.response.data, err.response.status))
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const getSimilarGroups = () => (dispatch,getState) => {
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get('/api/models/gruposimilares/', tokenConfig(getState))
    .then( res =>{
        dispatch({
            type: GET_SIMILAR_GROUPS,
            payload: res.data.map(data=>data.grupo)
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err =>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        dispatch({
			type: CREATE_MESSAGE,
			payload: { fetchError: `Falha ao obter grupos de similaridade registrados` }
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const addSimilarProcessesToGroup = (similarProcesses,grupos) => (dispatch, getState) => {
    const _similarProcesses = similarProcesses.hasOwnProperty('id') ? [similarProcesses] : similarProcesses
    for (let grupo of grupos) {
        if (_similarProcesses.length>1){
            dispatch({
                type: CREATE_MESSAGE,
                payload: { similarGroupCreated: `Adicionando processos similares ao grupo ${grupo.label} com sucesso` }
            })      
        }
        if (grupo.label === grupo.value) {
            dispatch({type:LOAD_ASYNC_TRUE})
            axios.post('/api/models/gruposimilares/',{descricao:grupo.label},tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: NEW_SIMILAR_GROUP,
                    payload : res.data
                })
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { similarGroupCreated: `Grupo ${grupo.label} criado com sucesso` }
                })
                dispatch({type:LOAD_ASYNC_FALSE})
                for(let similarProcess of _similarProcesses){
                    const id = similarProcessURLRE.exec(similarProcess.id)[2]
                    const payload = {
                        grupo:res.data.id,
                        processos_similares:id
                    }
                    dispatch({type:LOAD_ASYNC_TRUE})
                    axios.post('/api/models/processosgruposimilares/',payload,tokenConfig(getState))
                    .then(res => {
                        dispatch({
                            type: CREATE_MESSAGE,
                            payload: { similarGroupCreated: `Processos similares ${similarProcess.processo_base_tj} e ${similarProcess.processo_similar_tj} adicionados ao grupo ${grupo.label} com sucesso` }
                        })      
                        dispatch({type:LOAD_ASYNC_FALSE})
                    })
                    .catch(err=>{
                        if (err.status === 401){
                            dispatch({type:AUTH_ERROR})
                        }
                        if (err.response.status === 400) {
                            // TODO RESOLVE BUG - não está notificando o usuário
                            dispatch({
                                type: CREATE_MESSAGE,
                                payload: { similarGroupFail: `Processos similares ${similarProcess.processo_base_tj} e ${similarProcess.processo_similar_tj} já pertencem ao grupo ${grupo.label}` }
                            }) 
                        }
                        dispatch({type:LOAD_ASYNC_FALSE})
                        console.log(err.response)
                    })
                }
            })
            .catch(err=>{
                if (err.status === 401){
                    dispatch({type:AUTH_ERROR})
                }
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { fetchError: `Falha ao criar grupos de similaridade` }
                })
                dispatch({type:LOAD_ASYNC_FALSE})
            })
        }else {
            if (_similarProcesses.length>1){
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { similarGroupCreated: `Adicionando processos similares ao grupo ${grupo.label} com sucesso` }
                })      
            }
            for(let similarProcess of _similarProcesses){
                const id = similarProcessURLRE.exec(similarProcess.id)[2]
                const payload = {
                    grupo:grupo.value,
                    processos_similares:id
                }
                dispatch({type:LOAD_ASYNC_TRUE})
                axios.post('/api/models/processosgruposimilares/',payload,tokenConfig(getState))
                .then(res => {
                    if (_similarProcesses.length==1){
                        dispatch({
                            type: CREATE_MESSAGE,
                            payload: { similarGroupCreated: `Processos similares ${similarProcess.processo_base_tj} e ${similarProcess.processo_similar_tj} adicionados ao grupo ${grupo.label} com sucesso` }
                        })      
                    } 
                    dispatch({type:LOAD_ASYNC_FALSE})
                })
                .catch(err=>{
                    if (err.status === 401){
                        dispatch({type:AUTH_ERROR})
                    }
                    if (err.response.status === 400) {
                        // TODO RESOLVE BUG - não está notificando o usuário
                        dispatch({
                            type: CREATE_MESSAGE,
                            payload: { similarGroupFail: `Processos similares ${similarProcess.processo_base_tj} e ${similarProcess.processo_similar_tj} já pertencem ao grupo ${grupo.label}` }
                        }) 
                    }
                    dispatch({type:LOAD_ASYNC_FALSE})
                    console.log(err.response)
                })
            }
        } 
    }
}

export const getGroupProcesses = group => (dispatch, getState) => {
    console.log(group)
    axios.get(`/api/models/processosgruposimilares/?grupo=${group.id}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: LIST_SIMILAR,
            payload: res.data
        })
    }).catch(err=>console.log(err))
}

export const buildQueryListSimilarProcesses = (queryParams) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('comarca')?`comarca=${queryParams.comarca.hasOwnProperty('label')? queryParams.comarca.value : queryParams.comarca}&` : ''
    query += queryParams.hasOwnProperty('serventia')?`serventia=${queryParams.serventia.hasOwnProperty('label')? queryParams.serventia.value : queryParams.serventia}&` : ''
    query += queryParams.hasOwnProperty('ano')?`ano=${queryParams.ano.hasOwnProperty('label')? queryParams.ano.value : queryParams.ano}&` : ''
    query += queryParams.hasOwnProperty('classe')?`classe=${queryParams.classe.hasOwnProperty('label')? queryParams.classe.value : queryParams.classe}&` : ''
    query += queryParams.hasOwnProperty('assunto')?`assunto=${queryParams.assunto.hasOwnProperty('label')? queryParams.assunto.value : queryParams.assunto}&` : ''
    query += queryParams.hasOwnProperty('personagem')?`personagem=${queryParams.personagem.hasOwnProperty('label')? queryParams.personagem.value : queryParams.personagem}&` : ''
    query += queryParams.hasOwnProperty('advogado')?`advogado=${queryParams.advogado.hasOwnProperty('label')? queryParams.advogado.value : queryParams.advogado}&` : ''
    query += queryParams.hasOwnProperty('juiz')?`juiz=${queryParams.juiz.hasOwnProperty('label')? queryParams.juiz.value : queryParams.juiz}&` : ''
    query += `similaridade_minima=${queryParams.similaridade[0]}&`
    query += `similaridade_maxima=${queryParams.similaridade[1]}&`
    return query
}

export const listSimilarProcesses = (queryParams) => (dispatch, getState) => {
    dispatch({type:LOAD_ASYNC_TRUE})
    // let query = buildQueryListSimilarProcesses(queryParams)    
    axios.get(`/api/models/processossimilaresreport/?${queryParams}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type: LIST_SIMILAR,
            payload: res.data
        })
        if (res.data.count > 500 ){
            dispatch({
                type: CREATE_MESSAGE,
                payload: { loading: `Foram encontrados ${res.data.count} resultados, reduza o intervalo de similaridade!` }
            })
        }
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const getComarcasServentias = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('comarca')?`comarca=${queryParams.comarca.hasOwnProperty('label')? queryParams.comarca.value : queryParams.comarca}&` : ''
    query += queryParams.hasOwnProperty('serventia')?`serventia=${queryParams.serventia.hasOwnProperty('label')? queryParams.serventia.value : queryParams.serventia}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/comarcasserventiasdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_COMARCAS_SERVENTIAS,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const getClassesAssuntos = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('classe')?`classe=${queryParams.classe.hasOwnProperty('label')? queryParams.classe.value : queryParams.classe}&` : ''
    query += queryParams.hasOwnProperty('assunto')?`assunto=${queryParams.assunto.hasOwnProperty('label')? queryParams.assunto.value : queryParams.assunto}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/classesassuntosdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_CLASSES_ASSUNTOS,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}


export const getAno = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('ano')?`ano=${queryParams.ano.hasOwnProperty('label')? queryParams.ano.value : queryParams.ano}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/anosdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_ANOS,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}


export const getAdvogados = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('advogado')?`advogado=${queryParams.advogado.hasOwnProperty('label')? queryParams.advogado.value : queryParams.advogado}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/advogadossdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_ADVOGADOS,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const getPersonagens = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('personagem')?`personagem=${queryParams.personagem.hasOwnProperty('label')? queryParams.personagem.value : queryParams.personagem}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/personagensdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_PERSONAGENS,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const getJuizes = (queryParams) => (dispatch,getState) => {
    var query = ""
    query += queryParams.hasOwnProperty('page')?`page=${queryParams.page}&` : ''
    query += queryParams.hasOwnProperty('juiz')?`juiz=${queryParams.juiz.hasOwnProperty('label')? queryParams.juiz.value : queryParams.juiz}&` : ''
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.get(`/api/models/juizessdisponiveis/?${query}`,tokenConfig(getState))
    .then(res=>{
        dispatch({
            type: GET_JUIZES,
            payload: res.data.results
        })
        dispatch({type:LOAD_ASYNC_FALSE})
    })
    .catch(err=>{
        if (err.status === 401){
            dispatch({type:AUTH_ERROR})
        }
        console.log(err)
        dispatch({type:LOAD_ASYNC_FALSE})
    })
}

export const openGroupDialog = () => (dispatch,getState)=>{
    dispatch({
        type : OPEN_GROUP_DIALOG,
        payload : !(getState().similarProcessesReducer.openGroupDialog)
    })
}


const postProcessToGroup = (similarProcesses,group,dispatch,getState) => {
    const id = similarProcessURLRE.exec(similarProcesses.id)[2]
    const payload = {
        grupo:group.id,
        processos_similares:id
    }
    dispatch({type:LOAD_ASYNC_TRUE})
    axios.post('/api/models/processosgruposimilares/',payload,tokenConfig(getState))
        .then(res => {
            // TODO RESOLVE BUG - não está notificando o usuário
            dispatch({
                type: CREATE_MESSAGE,
                payload: { similarGroupCreated: `Processos similares ${similarProcesses.processo_base_tj} e ${similarProcesses.processo_similar_tj} adicionados ao grupo ${grupo.label} com sucesso` }
            })      
            dispatch({type:LOAD_ASYNC_FALSE})
        })
        .catch(err=>{
            if (err.status === 401){
                dispatch({type:AUTH_ERROR})
            }
            if (err.response.status === 400) {
                // TODO RESOLVE BUG - não está notificando o usuário
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { similarGroupFail: `Processos similares ${similarProcesses.processo_base_tj} e ${similarProcesses.processo_similar_tj} já pertencem ao grupo ${grupo.label}` }
                }) 
            }
            dispatch({type:LOAD_ASYNC_FALSE})
            console.log(err.response)
        })
}