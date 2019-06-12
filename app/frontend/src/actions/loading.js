import { LOAD_ASYNC_FALSE, LOAD_ASYNC_TRUE } from './types';

export const setLoadingTrue = () => (dispatch, getState) => {
    dispatch({ type: LOAD_ASYNC_TRUE,});
}
export const setLoadingFalse = () => (dispatch, getState) => {
    dispatch({ type: LOAD_ASYNC_FALSE,});
}