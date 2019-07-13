import { USER_LOADING, AUTH_ERROR, USER_LOADED, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";

function setCookie(cookieName, cookieValue, cookieExdays) {
    var d = new Date();
    d.setTime(d.getTime() + (cookieExdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
           c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}


const initialState = {
    token: getCookie('token'),
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
            setCookie('token', action.payload.token, 30)
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
            eraseCookie(name);
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
