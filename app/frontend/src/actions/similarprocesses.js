import axios from 'axios';
import {GET_PROCESS, CLEAR_SEARCHED_PROCESS} from './types';
import { tokenConfig } from './auth';
import { returnError } from './message';

export const clearSimilarProcess = () => (dispatch) => {
    dispatch({
        type : CLEAR_SEARCHED_PROCESS,
    })
}

export const getProcess = (id) => (dispatch, getState) => {
    axios.get(`/api/models/processossimilaresreport/?processo_tj=${id}`, tokenConfig(getState))
    .then(res => {
        dispatch({
            type : GET_PROCESS,
            payload : res.data
        })
    })
    .catch(err => dispatch(returnError(err.response.data, err.response.status)));
}