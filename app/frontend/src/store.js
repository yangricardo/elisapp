import { createStore, applyMiddleware,compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middeware = [thunk];

const actionSanitizer = (action) => (
    (
      ['CREATE_MESSAGE','SELECT_SIMILAR_PROCESSES', 'CLEAR_SELECTED_SIMILAR_PROCESSES',
      'SUBMIT_RATING_FAIL','SUBMIT_RATING_SUCCESS', 'CLEAR_SEARCHED_PROCESS', 'SET_SEARCHED_PROCESS', 
      'SET_SIMILAR_PROCESS','LOAD_ASYNC', 'CACHE_SIMILAR_PROCESS', 'SET_SIMILAR_PROCESS_RESULTS', 
      'GET_SIMILAR_GROUPS','NEW_SIMILAR_GROUP', 'LIST_SIMILAR', 'GET_ADVOGADOS', 'GET_ANOS', 
      'GET_CLASSES_ASSUNTOS', 'GET_COMARCAS_SERVENTIAS', 'GET_JUIZES', 'GET_PERSONAGENS']
      .includes(action.type)
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