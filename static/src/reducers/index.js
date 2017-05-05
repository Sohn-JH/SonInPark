import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import dataReducer from './dataReducer';

const rootReducer = combineReducers({
    routing: routerReducer,
    dataReducer: dataReducer,
});

export default rootReducer;
