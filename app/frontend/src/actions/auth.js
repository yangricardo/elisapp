import axios from 'axios';
import { returnError, createMessage } from "./message";

import {USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_FAIL } from './types'


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
	// User Loading
	dispatch({ type: USER_LOADING });

	axios
	.get("/auth/user/", tokenConfig(getState))
	.then(res => {
		dispatch({
		type: USER_LOADED,
		payload: res.data
		});
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
		type: AUTH_ERROR
		});
	});
};

// LOGIN USER
export const login = (username, password) => dispatch => {
	// Headers
	const config = {
	headers: {
		"Content-Type": "application/json"
	}
	};

	// Request Body
	const body = JSON.stringify({ username, password });

	axios
	.post("/auth/login/", body, config)
	.then(res => {
		dispatch(createMessage({ login: "Login Success" }));
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
	  })
	  .catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
		  	type: LOGIN_FAIL
		});
	});
};

// REGISTER USER
export const register = ({ username, password, email }) => dispatch => {
	// Headers
	const config = {
	headers: {
		"Content-Type": "application/json"
	}
	};

	// Request Body
	const body = JSON.stringify({ username, email, password });

	axios
	.post("/auth/register/", body, config)
	.then(res => {
		dispatch(createMessage({ register: "Register Success" }));
		dispatch({
		type: REGISTER_SUCCESS,
		payload: res.data
		});
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
		type: REGISTER_FAIL
		});
	});
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
	axios
	.post("/auth/logout/", null, tokenConfig(getState))
	.then(res => {
		dispatch(createMessage({ logout: "Logged Out" }));
		dispatch({ type: 'CLEAR_LEADS' });
		dispatch({
		type: LOGOUT_SUCCESS
		});
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
	});
};

// Setup config with token - helper function
export const tokenConfig = getState => {
	// Get token from state
	const token = getState().authReducer.token;

	// Headers
	const config = {
	credentials: 'include',
	mode: 'same-origin',
	headers: {
		"Content-Type": "application/json",
		"X-CSRFToken": csrftoken
	}
	};

	// If token, add to headers config
	if (token) {
	config.headers["Authorization"] = `Token ${token}`;
	}

	return config;
};