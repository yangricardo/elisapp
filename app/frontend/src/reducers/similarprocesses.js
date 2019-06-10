import { CACHE_SIMILAR_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, CLEAR_SEARCHED_PROCESS, SET_SIMILAR_PROCESS_RESULTS } from "../actions/types";

const initialState = {
    searchedProcess : {},
    similarProcess : {},
    cachedSimilarProcesses : {},
    cachedProcesses : {}
}

export default function(state = initialState, action) {
    const similarProcessIDRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');
    var id;
    switch(action.type) {
        case CACHE_SIMILAR_PROCESS: 
            return {
                ...state,
                cachedProcesses : {
                    ...state.cachedProcesses, 
                    [action.payload.processo_tj]: action.payload
                }
            }
        case SET_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : action.payload,
            }
        case SET_SIMILAR_PROCESS:
            return {
                ...state,
                similarProcess : action.payload,
            }
        case SET_SIMILAR_PROCESS_RESULTS:
            const payload = action.payload
            const processoTJ =  Array.isArray(payload) ? payload[0].processo_base_tj : payload.processo_tj
            return {
                ...state,
                cachedSimilarProcesses : {
                    ...state.cachedSimilarProcesses, 
                    [processoTJ]: action.payload
                }
            }
        case CLEAR_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : {},
                similarProcess : {}
            }
        default:
            return state
    }
}