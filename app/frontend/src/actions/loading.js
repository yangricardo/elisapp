import { LOAD_ASYNC } from './types';

import store from '../store';

export const setLoading = () => (dispatch, getState) => {
    dispatch({ type: LOAD_ASYNC,});
}