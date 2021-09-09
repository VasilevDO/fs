import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducer';
import { checkForBannedWords, checkInputNotEmpty } from './middleware';


export const store = createStore(rootReducer, compose(
    applyMiddleware(
      thunk,
      checkForBannedWords,
      checkInputNotEmpty
    ),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));