import { GET_PROCESS, SET_SEARCHED_PROCESS, CLEAR_SEARCHED_PROCESS, LOADING_PROCESS_DATA } from "../actions/types";

const initialState = {
    searchedProcess : {},
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PROCESS: 
            return {
                ...state,
                searchedProcess : action.payload.results[0] || {}
            }
        case LOADING_PROCESS_DATA: 
            return {
                ...state,
                loading : action.payload
            }
        case SET_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : action.payload
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