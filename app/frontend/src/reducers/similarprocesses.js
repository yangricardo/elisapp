import { GET_PROCESS, CLEAR_SEARCHED_PROCESS } from "../actions/types";

const initialState = {
    searchedProcess : {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PROCESS: 
            return {
                ...state,
                searchedProcess : action.payload.results[0] || {}
            }
        case CLEAR_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : {}
            }
        default:
            return state
    }
}