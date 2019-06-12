import axios from 'axios';
import { returnError } from "./message";
import {USER_LOADED, CREATE_MESSAGE, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_FAIL, LOAD_ASYNC_FALSE, LOAD_ASYNC_TRUE } from './types'

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
	// User Loading
	dispatch({ type: LOAD_ASYNC_TRUE });

	axios
	.get("/auth/user/", tokenConfig(getState))
	.then(res => {
		dispatch({
			type: USER_LOADED,
			payload: res.data
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
			type: AUTH_ERROR
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
	});
};

// LOGIN USER
export const login = (username, password) => (dispatch, getState) => {
	// Headers
	const config = {
	headers: {
		"Content-Type": "application/json"
	}
	};

	// Request Body
	const body = JSON.stringify({ username, password });
	dispatch({ type: LOAD_ASYNC_TRUE });
	axios
	.post("/auth/login/", body, config)
	.then(res => {
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
	  })
	  .catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({ type: LOAD_ASYNC_FALSE })
		dispatch({
		  	type: LOGIN_FAIL
		})
		dispatch({
			type: CREATE_MESSAGE,
			payload: { authError: "Verifique o seu nome de usuário e senha e tente novamente." }
		})
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
	dispatch({ type: LOAD_ASYNC_TRUE });
	axios
	.post("/auth/register/", body, config)
	.then(res => {
		dispatch({
			type: CREATE_MESSAGE,
			payload: { register: "Seja bem vindo, seu cadastro foi feito com sucesso!" }
		})
		dispatch({
		type: REGISTER_SUCCESS,
		payload: res.data
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
		type: REGISTER_FAIL
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
		dispatch({
			type: CREATE_MESSAGE,
			payload: { authError: "Por favor, verifique os seus dados de registro!" }
		})
	});
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
	dispatch({ type: LOAD_ASYNC_TRUE });
	axios
	.post("/auth/logout/", null, tokenConfig(getState))
	.then(res => {
		dispatch({
			type: CREATE_MESSAGE,
			payload: { logout: "Logged Out" }
		})
		dispatch({ type: 'CLEAR_LEADS' });
		dispatch({
		type: LOGOUT_SUCCESS
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
	})
	.catch(err => {
		dispatch(returnError(err.response.data, err.response.status));
		dispatch({
			type: AUTH_ERROR
		});
		dispatch({ type: LOAD_ASYNC_FALSE });
		dispatch({
			type: CREATE_MESSAGE,
			payload: { authError: "Credenciais inválidas, entre com seu nome de usuário e senha novamente" }
		})
	});
};

export const buildTokenHeader = token => {
	// Headers
	const config = {
		headers: {
			"Content-Type": "application/json",
		}
	};

	// If token, add to headers config
	if (token) {
	config.headers["Authorization"] = `Token ${token}`;
	}

	return config;
}

// Setup config with token - helper function
export const tokenConfig = getState => {
	// Get token from state
	const token = getState().authReducer.token;
	return buildTokenHeader(token);
};