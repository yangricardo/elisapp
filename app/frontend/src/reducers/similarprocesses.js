import { GET_PROCESS, SET_SEARCHED_PROCESS, CLEAR_SEARCHED_PROCESS } from "../actions/types";

const initialState = {
    searchedProcess : {},
    cachedSimilarProcesses : {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PROCESS: 
            return {
                ...state,
                searchedProcess : action.payload.results[0] || {}
            }
        case SET_SEARCHED_PROCESS:
                const similarProcessIDRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');
                const id = similarProcessIDRE.exec(action.payload.id)[2]

            return {
                ...state,
                searchedProcess : action.payload,
                cachedSimilarProcesses : {
                    ...state.cachedSimilarProcesses, 
                    [id]: action.payload
                }
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