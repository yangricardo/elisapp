import { LOAD_ASYNC, LOAD_ASYNC_FALSE, LOAD_ASYNC_TRUE } from "../actions/types";


const initialState = {
    isLoading: false
}


export default (state = initialState, action) => {
    switch(action.type) {
        case LOAD_ASYNC: 
            return {
                ...state,
                isLoading: !state.isLoading,
            }
        case LOAD_ASYNC_FALSE: 
            return {
                ...state,
                isLoading: false,
            }
        case LOAD_ASYNC_TRUE: 
            return {
                ...state,
                isLoading: true,
            }
        default:
            return state;
    }
}
    