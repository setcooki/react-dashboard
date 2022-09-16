import {combineReducers} from 'redux';
import types from './types';

const initialState = {
  data: [],
  loading: false,
  error: null
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.FETCH_CLIENT:
      return Object.assign({}, state, {
        loading: true,
        data: [],
        error: null,
        success: null
      });
    case types.FETCH_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: action.payload.data,
        error: null,
        success: null
      });
    case types.FETCH_CLIENT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        data: action.payload.data,
        error: action.payload.error,
        success: null
      });
    case types.CREATE_CLIENT:
      return Object.assign({}, state, {
        loading: true,
        data: [],
        error: null,
        success: null
      });
    case types.CREATE_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: action.payload.data,
        error: null,
        success: true
      });
    case types.CREATE_CLIENT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        data: [],
        error: action.payload.error,
        success: null
      });
    case types.DELETE_CLIENT:
      return Object.assign({}, state, {
        loading: true,
        data: state.data,
        error: null,
        success: null
      });
    case types.DELETE_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: state.data.filter(item => item.id !== action.payload.data),
        error: null,
        success: true
      });
    case types.DELETE_CLIENT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        data: state.data,
        error: action.payload.error,
        success: null
      });
    case types.UPDATE_CLIENT:
      return Object.assign({}, state, {
        loading: true,
        data: [],
        error: null,
        success: null
      });
    case types.UPDATE_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: action.payload.data,
        error: null,
        success: true
      });
    case types.UPDATE_CLIENT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        data: [],
        error: action.payload.error,
        success: null
      });
    default:
      return state;
  }
};

export default combineReducers({
  client: reducer,
});
