import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';

import { SnackbarProvider } from 'notistack';

import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import reducers from './reducers/index';

const store = createStore(combineReducers(reducers));

ReactDOM
    .render(
        <Provider store={store}>
            <SnackbarProvider maxSnack={2}>
                <App />
            </ SnackbarProvider>
        </Provider>, 
        document.getElementById('root'));