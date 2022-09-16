import {combineReducers} from 'redux';
import types from './types';

const initialState = {
  data: {
    user: localStorage.getItem('currentUser') || null
  }
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.UPDATE_RUNTIME:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
};

export default combineReducers({
  runtime: reducer,
});
