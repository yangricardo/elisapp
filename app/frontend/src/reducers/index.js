import { combineReducers } from "redux";
import leadReducer from './leads';
import errorReducer from './errors';
import snackbarReducer from './snackbar'
import messageReducer from './message'
import authReducer from './auth'

export default combineReducers({
    leadReducer,
    errorReducer,
    snackbarReducer,
    messageReducer,
    authReducer,
});