import { CACHE_SIMILAR_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, CLEAR_SEARCHED_PROCESS, 
    SET_SIMILAR_PROCESS_RESULTS, CLEAR_SELECTED_SIMILAR_PROCESSES, SELECT_SIMILAR_PROCESSES,
    GET_SIMILAR_GROUPS,MULTI_SELECT_SIMILAR_PROCESSES, NEW_SIMILAR_GROUP, LIST_SIMILAR
} from "../actions/types";

const initialState = {
    searchedProcess : {},
    similarProcess : {},
    similarGroups : [],
    listSimilar : [],
    selectedSimilarProcesses : [],
    cachedSimilarProcesses : {},
    cachedProcesses : {}
}

// const similarProcessIDRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');
// var id;


export default function(state = initialState, action) {
    const payload = action.payload
    switch(action.type) {
        case CACHE_SIMILAR_PROCESS: 
            return {
                ...state,
                cachedProcesses : {
                    ...state.cachedProcesses, 
                    [payload.processo_tj]: payload
                }
            }
        case SET_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : payload,
            }
        case SET_SIMILAR_PROCESS:
            return {
                ...state,
                similarProcess : payload,
            }
        case SET_SIMILAR_PROCESS_RESULTS:
            const processoTJ =  Array.isArray(payload) ? payload[0].processo_base_tj : payload.processo_tj
            return {
                ...state,
                cachedSimilarProcesses : {
                    ...state.cachedSimilarProcesses, 
                    [processoTJ]: payload
                }
            }
        case SELECT_SIMILAR_PROCESSES :
            return {
                ...state,
                selectedSimilarProcesses : [payload]
            }
        case MULTI_SELECT_SIMILAR_PROCESSES :
            return {
                ...state,
                selectedSimilarProcesses : [
                    ...state.selectedSimilarProcesses,
                    payload
                ]
            }
        case CLEAR_SELECTED_SIMILAR_PROCESSES:
            return {
                ...state,
                selectedSimilarProcesses : []
            }
        case CLEAR_SEARCHED_PROCESS:
            return {
                ...state,
                searchedProcess : {},
                similarProcess : {}
            }
        case GET_SIMILAR_GROUPS:
            return {
                ...state,
                similarGroups : payload
            }
        case NEW_SIMILAR_GROUP:
            return {
                ...state,
                similarGroups : [
                    ...state.similarGroups,
                    payload
                ]
            }
        case LIST_SIMILAR:
            return {
                ...state,
                listSimilar : payload
            }
        default:
            return state
    }
}