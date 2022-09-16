import actions from "./actions";
import Api from "../../../class/Api";

const fetchClient = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchClient());
    return Api.get(`/client/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchClientSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchClientFailure(error)))
  }
};

const fetchClients = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchClient());
    return Api.get('/clients', params)
      .then(response => {
        dispatch(actions.fetchClientSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchClientFailure(error)))
  }
};

const createClient = (data) => {
  return (dispatch) => {
    dispatch(actions.createClient());
    return Api.post('/client', data)
      .then(response => {
        dispatch(actions.createClientSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createClientFailure(error)))
  }
};

const updateClient = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateClient());
    return Api.patch(`/client/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateClientSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateClientFailure(error)))
  }
};

const deleteClient = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteClient());
    return Api.delete(`/client/${id}/${uid}`, {})
      .then(response => {
        dispatch(actions.deleteClientSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteClientFailure(error)))
  }
};

export default {
  fetchClient,
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
};
