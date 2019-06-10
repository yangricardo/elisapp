import axios from 'axios';
import {CLEAR_SEARCHED_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, LOAD_ASYNC, CACHE_SIMILAR_PROCESS, SET_SIMILAR_PROCESS_RESULTS} from './types';
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
            dispatch({type:LOAD_ASYNC})
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
                    dispatch({type:LOAD_ASYNC})
                }
            })
            .catch(err => {
                dispatch({type:LOAD_ASYNC})
                returnError(err.response.data, err.response.status);
            });
        }
    }

    if (onSearch) {
        fetchProcessData(similarProcesses[0])
    } else {
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