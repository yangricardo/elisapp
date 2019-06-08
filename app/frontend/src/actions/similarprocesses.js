import axios from 'axios';
import {CLEAR_SEARCHED_PROCESS, SET_SEARCHED_PROCESS} from './types';
import { tokenConfig } from './auth';
import { returnError } from './message';

export const setLoadingProcess = (loading) => (dispatch) => {
    dispatch({
        type : LOADING_PROCESS_DATA,
        payload : loading
    })
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
    // preload
}