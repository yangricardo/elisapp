import { createStore, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middeware = [thunk];

const actionSanitizer = (action) => (
    (
      action.type === 'CACHE_SIMILAR_PROCESS' || 
      action.type === 'SET_SIMILAR_PROCESS_RESULTS'  ||
      action.type === 'SET_SIMILAR_PROCESS' || 
      action.type === 'SET_SEARCHED_PROCESS'  
      ) && action.payload ?
    { ...action, payload: '<<LONG_BLOB>>' } : action
);

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionSanitizer,
        stateSanitizer: (state) => state.payload ? { ...state, payload: '<<LONG_BLOB>>' } : state
    }) : compose;

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middeware))
);

export default store;