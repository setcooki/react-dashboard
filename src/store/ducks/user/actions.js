import types from "./types";

const fetchUser = () => ({
  type: types.FETCH_USER,
});

const fetchUserSuccess = (data) => ({
  type: types.FETCH_USER_SUCCESS,
  payload: {data}
});

const fetchUserFailure = (error) => ({
  type: types.FETCH_USER_FAILURE,
  payload: {error}
});

const createUser = () => ({
  type: types.CREATE_USER
});

const createUserSuccess = (data) => ({
  type: types.CREATE_USER_SUCCESS,
  payload: {data}
});

const createUserFailure = (error) => ({
  type: types.CREATE_USER_FAILURE,
  payload: {error}
});

const updateUser = () => ({
  type: types.UPDATE_USER
});

const updateUserSuccess = (data) => ({
  type: types.UPDATE_USER_SUCCESS,
  payload: {data}
});

const updateUserFailure = (error) => ({
  type: types.UPDATE_USER_FAILURE,
  payload: {error}
});

const deleteUser = () => ({
  type: types.DELETE_USER
});

const deleteUserSuccess = (data) => ({
  type: types.DELETE_USER_SUCCESS,
  payload: {data}
});

const deleteUserFailure = (error) => ({
  type: types.DELETE_USER_FAILURE,
  payload: {error}
});

export default {
  fetchUser,
  fetchUserSuccess,
  fetchUserFailure,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure
};
