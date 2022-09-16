import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './ducks';

const Store = {
  store: null,
  init(initialState) {
    const rootReducer = combineReducers(reducers);
    Store.store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk)
    );
    return Store.store;
  },
  get() {
    return Store.store;
  }
}

export default Store;
