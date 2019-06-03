import { USER_LOADING, AUTH_ERROR, USER_LOADED, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";


const initialState = {
    token: sessionStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case USER_LOADING: 
            return {
                ...state,
                isLoading: true,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            sessionStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
        case AUTH_ERROR:
            sessionStorage.removeItem('token')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        default:
            return state;
    }
}
