import { LOAD_ASYNC } from './types';

export const setLoading = () => (dispatch, getState) => {
    dispatch({ type: LOAD_ASYNC,});
}