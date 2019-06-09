import axios from 'axios';
import {CLEAR_SEARCHED_PROCESS, SET_SEARCHED_PROCESS, LOAD_ASYNC, CACHE_SIMILAR_PROCESS} from './types';
import { tokenConfig } from './auth';
import { returnError } from './message';


export const urlRE = new RegExp('https?:\\/\\/(\\w\\.?)+');
export const similarProcessURLRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');

export const loadSimilarProcesses = () => (dispatch, getState) => {
    const {searchedProcess} = getState().similarProcessesReducer
    for (let processo of searchedProcess.processos_similares) {
        const {cachedSimilarProcesses} = getState().similarProcessesReducer
        const similarProcessURL = processo.id.replace(urlRE,"")
        const id = similarProcessURLRE.exec(processo.id)[2]
        console.log(id)
        if (!(id in cachedSimilarProcesses)){
            dispatch({type: LOAD_ASYNC})
            axios.get(similarProcessURL, tokenConfig(getState))
            .then(res => {
                dispatch ({
                    type : CACHE_SIMILAR_PROCESS,
                    payload : res.data
                })
                dispatch({type: LOAD_ASYNC})
            })
            .catch(err => {
                returnError(err.response.data, err.response.status);
                dispatch({type: LOAD_ASYNC})
            });
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