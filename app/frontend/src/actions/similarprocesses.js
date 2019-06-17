import axios from 'axios';
import {CREATE_MESSAGE,SELECT_SIMILAR_PROCESSES, CLEAR_SELECTED_SIMILAR_PROCESSES,SUBMIT_RATING_FAIL, 
    SUBMIT_RATING_SUCCESS, CLEAR_SEARCHED_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, 
    LOAD_ASYNC, CACHE_SIMILAR_PROCESS, SET_SIMILAR_PROCESS_RESULTS, GET_SIMILAR_GROUPS,NEW_SIMILAR_GROUP
} from './types';
import { tokenConfig } from './auth';
import { returnError } from './message';


export const urlRE = new RegExp('https?:\\/\\/(\\w\\.?)+');
export const similarProcessURLRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');


export const searchProcess = (searchProcess,setSimilarProcessResults,loadSimilarProcesses,clearSearchedProcess,setLoading,returnError) => (dispatch, getState)=>{
    setLoading();
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
        dispatch({type:LOAD_ASYNC})
    })
    .catch(err => {
        dispatch({type:LOAD_ASYNC})
        returnError(err.response.data, err.response.status);
    });
}

export const loadSimilarProcesses = (processoBaseTJ, onSearch=false) => (dispatch, getState) => {
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
                }
            })
            .catch(err => {
                returnError(err.response.data, err.response.status);
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { loadingFail: `Falha ao carregar dados do processo similar ${processo.processo_similar_tj}` }
                })
            });
        }
    }

    if (onSearch) {
        fetchProcessData(similarProcesses[0])
    } else {
        if (similarProcesses !== undefined)
            for (let processo of similarProcesses) {
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
    axios.post('/api/models/avaliacoes/',rating, tokenConfig(getState))
    .then( res =>{
        dispatch({
			type: CREATE_MESSAGE,
			payload: { ratingSuccess: `Avaliação de Similaridade enviada com sucesso` }
		})
        dispatch({
            type : SUBMIT_RATING_SUCCESS
        })
    })
    .catch(err =>{
        dispatch({
			type: CREATE_MESSAGE,
			payload: { ratingFail: `Falha ao enviar Avaliação de Similaridade` }
		})
        dispatch({
            type : SUBMIT_RATING_FAIL
        })
        dispatch(returnError(err.response.data, err.response.status))
    })
}

export const getSimilarGroups = () => (dispatch,getState) => {
    axios.get('/api/models/gruposimilares/', tokenConfig(getState))
    .then( res =>{
        dispatch({
            type: GET_SIMILAR_GROUPS,
            payload: res.data.map(data=>data.grupo)
        })
    })
    .catch(err =>{
        dispatch({
			type: CREATE_MESSAGE,
			payload: { fetchError: `Falha ao obter grupos de similaridade registrados` }
		})
    })
}

export const addSimilarProcessesToGroup = (similarProcesses,grupo) => (dispatch, getState) => {

    const postProcessToGroup = (similarProcesses,groupId) => {
        const id = similarProcessURLRE.exec(similarProcesses.id).groups[2]
        console.log(id,grupo.id)
        // axios.post('/api/models/processosgruposimilares/',{descricao:grupo.value},tokenConfig(getState))
        //     .then(res => {

        //     })
        //     .catch(err=>{

        //     })
    }
    for (let grupo of grupos) {
        // console.log(grupo)
        if (grupo.label === grupo.value) {
            axios.post('/api/models/gruposimilares/',{descricao:grupo.value},tokenConfig(getState))
            .then(res => {
                console.log(res.data)
                dispatch({
                    type: NEW_SIMILAR_GROUP,
                    payload : res.data
                })
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { similarGroupCreated: `Grupo ${grupo.label} criado com sucesso` }
                })
                postProcessToGroup(similarProcesses,res.data)
            })
            .catch(err=>{
                console.error(err)
                dispatch({
                    type: CREATE_MESSAGE,
                    payload: { fetchError: `Falha ao criar grupos de similaridade` }
                })
            })
        } else {
            postProcessToGroup(similarProcesses,grupo.value)
        }
    }
}
