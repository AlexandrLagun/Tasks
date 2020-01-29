import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
//import './index.css';
import App from './components/App';
import inputReducer from './reducers/cityReducer';
//import * as serviceWorker from './serviceWorker';

const rootReducer = combineReducers({inputReducer});
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
   document.getElementById('root')
);

//serviceWorker.unregister();