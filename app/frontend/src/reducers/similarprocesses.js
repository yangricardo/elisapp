import { CACHE_SIMILAR_PROCESS, SET_SEARCHED_PROCESS, CLEAR_SEARCHED_PROCESS } from "../actions/types";

const initialState = {
    searchedProcess : {},
    cachedSimilarProcesses : {}
}

export default function(state = initialState, action) {
    const similarProcessIDRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');
    var id;
    switch(action.type) {
        case CACHE_SIMILAR_PROCESS: 
            id = similarProcessIDRE.exec(action.payload.id)[2]
            return {
                ...state,
                cachedSimilarProcesses : {
                    ...state.cachedSimilarProcesses, 
                    [id]: action.payload
                }
            }
        case SET_SEARCHED_PROCESS:
            id = similarProcessIDRE.exec(action.payload.id)[2]
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