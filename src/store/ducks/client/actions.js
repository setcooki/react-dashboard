import types from "./types";

const fetchClient = () => ({
  type: types.FETCH_CLIENT,
});

const fetchClientSuccess = (data) => ({
  type: types.FETCH_CLIENT_SUCCESS,
  payload: {data}
});

const fetchClientFailure = (error) => ({
  type: types.FETCH_CLIENT_FAILURE,
  payload: {error}
});

const createClient = () => ({
  type: types.CREATE_CLIENT
});

const createClientSuccess = (data) => ({
  type: types.CREATE_CLIENT_SUCCESS,
  payload: {data}
});

const createClientFailure = (error) => ({
  type: types.CREATE_CLIENT_FAILURE,
  payload: {error}
});

const deleteClient = () => ({
  type: types.DELETE_CLIENT
});

const deleteClientSuccess = (data) => ({
  type: types.DELETE_CLIENT_SUCCESS,
  payload: {data}
});

const deleteClientFailure = (error) => ({
  type: types.DELETE_CLIENT_FAILURE,
  payload: {error}
});

const updateClient = () => ({
  type: types.UPDATE_CLIENT
});

const updateClientSuccess = (data) => ({
  type: types.UPDATE_CLIENT_SUCCESS,
  payload: {data}
});

const updateClientFailure = (error) => ({
  type: types.UPDATE_CLIENT_FAILURE,
  payload: {error}
});

export default {
  fetchClient,
  fetchClientSuccess,
  fetchClientFailure,
  createClient,
  createClientSuccess,
  createClientFailure,
  deleteClient,
  deleteClientSuccess,
  deleteClientFailure,
  updateClient,
  updateClientSuccess,
  updateClientFailure
};
