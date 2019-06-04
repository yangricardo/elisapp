import { LOAD_ASYNC } from "../actions/types";


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
        default:
            return state;
    }
}
    