import { GET_PROCESS } from "../actions/types";

const initialState = {
    similarprocess : []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PROCESS: 
            return {
                ...state,
                similarprocess : action.payload
            }
        default:
            return state
    }
}