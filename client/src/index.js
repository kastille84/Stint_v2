import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {createLogger}  from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';

import rootReducer from './reducers';
import App from './App';

//import './api/agent';

 const middlewares = [thunk]
 export const store = createStore(rootReducer, applyMiddleware(...middlewares, createLogger()))

ReactDOM.render(
  <Provider store={store}>
    <Router history={createHistory()} >
      <App />    
    </Router>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
