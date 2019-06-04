import { combineReducers } from "redux";
import errorReducer from './errors';
import snackbarReducer from './snackbar'
import messageReducer from './message'
import authReducer from './auth'
import similarProcessesReducer from './similarprocesses'
import loadingReducer from './loading'

export default combineReducers({
    loadingReducer,
    errorReducer,
    snackbarReducer,
    messageReducer,
    authReducer,
    similarProcessesReducer
});