import { CACHE_SIMILAR_PROCESS, SET_SEARCHED_PROCESS, SET_SIMILAR_PROCESS, CLEAR_SEARCHED_PROCESS, 
    SET_SIMILAR_PROCESS_RESULTS, CLEAR_SELECTED_SIMILAR_PROCESSES, SELECT_SIMILAR_PROCESSES,
    GET_SIMILAR_GROUPS,MULTI_SELECT_SIMILAR_PROCESSES, NEW_SIMILAR_GROUP, LIST_SIMILAR,
    GET_CLASSES_ASSUNTOS, GET_ADVOGADOS, GET_ANOS, GET_COMARCAS_SERVENTIAS, GET_JUIZES, GET_PERSONAGENS
} from "../actions/types";

const initialState = {
    searchedProcess : {},
    similarProcess : {},
    similarGroups : [],
    listSimilar : [],
    selectedSimilarProcesses : [],
    cachedSimilarProcesses : {},
    cachedProcesses : {},
    comarcas : [],
    serventias: [],
    anos : [],
    classes : [],
    assuntos : [],
    advogados : [],
    personagens : [],
    juizes : [],
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
        case GET_COMARCAS_SERVENTIAS:
            return {
                ...state,
                comarcas : [...new Set(payload.map((comarcaServentia)=>{
                    return  comarcaServentia.comarca
                }))],
                serventias : [...new Set(payload.map((comarcaServentia)=>{
                    return  comarcaServentia.serventia
                }))],
            }
            case GET_CLASSES_ASSUNTOS:
                return {
                    ...state,
                    classes : [...new Set(payload.map((classeAssunto)=>{
                        return  classeAssunto.classe
                    }))],
                    assuntos : [...new Set(payload.map((classeAssunto)=>{
                        return  classeAssunto.assunto
                    }))],
                }
        case GET_ANOS:
            return {
                ...state,
                anos : [...new Set(payload.map((anos)=>{
                    return  anos.anos
                }))],
            }
        case GET_ADVOGADOS:
                return {
                    ...state,
                    advogados : [...new Set(payload.map((advogado)=>{
                        return  advogado.nome
                    }))],
                }
        case GET_JUIZES:
            return {
                ...state,
                juizes :[...new Set(payload.map((juiz)=>{
                    return  juiz.nome_juiz
                }))],
            }
        case GET_PERSONAGENS:
                return {
                    ...state,
                    personagens :[...new Set(payload.map((personagem)=>{
                        return  personagem.nome_personagem
                    }))],
                }
        default:
            return state
    }
}