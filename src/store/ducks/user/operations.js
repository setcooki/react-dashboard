import actions from "./actions";
import Api from "../../../class/Api";

const fetchUser = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchUser());
    return Api.get(`/user/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchUserFailure(error)))
  }
};

const fetchUsers = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchUser());
    return Api.get('/users', params)
      .then(response => {
        dispatch(actions.fetchUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchUserFailure(error)))
  }
};

const createUser = (data) => {
  return (dispatch) => {
    dispatch(actions.createUser());
    return Api.post('/user', data)
      .then(response => {
        dispatch(actions.createUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createUserFailure(error)))
  }
};

const updateUser = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateUser());
    return Api.patch(`/user/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateUserFailure(error)))
  }
};

const deleteUser = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteUser());
    return Api.delete(`/user/${id}/${uid}`, {})
      .then(response => {
        dispatch(actions.deleteUserSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteUserFailure(error)))
  }
};

const updateUserPassword = (id, uid, password) => {
  return (dispatch) => {
    dispatch(actions.updateUser());
    return Api.patch(`/user/${id}/${uid}/${password}`, null)
      .then(response => {
        dispatch(actions.updateUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateUserFailure(error)))
  }
};

const fetchUserGroups = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchUser());
    return Api.get('/user/groups', params)
      .then(response => {
        dispatch(actions.fetchUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchUserFailure(error)))
  }
};

const fetchUserGroup = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchUser());
    return Api.get(`/user/group/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchUserFailure(error)))
  }
};

const createUserGroup = (data) => {
  return (dispatch) => {
    dispatch(actions.createUser());
    return Api.post('/user/group', data)
      .then(response => {
        dispatch(actions.createUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createUserFailure(error)))
  }
};

const updateUserGroup = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateUser());
    return Api.patch(`/user/group/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateUserFailure(error)))
  }
};

const deleteUserGroup = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteUser());
    return Api.delete(`/user/group/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.deleteUserSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteUserFailure(error)))
  }
};

const fetchUserClients = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchUser());
    return Api.get('/user/clients', params)
      .then(response => {
        dispatch(actions.fetchUserSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchUserFailure(error)))
  }
};

export default {
  fetchUser,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  fetchUserGroups,
  fetchUserGroup,
  updateUserGroup,
  createUserGroup,
  deleteUserGroup,
  fetchUserClients,
};
