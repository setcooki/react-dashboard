import actions from "./actions";
import Api from "../../../class/Api";

const fetchSurvey = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchSurvey());
    return Api.get(`/survey/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchSurveyFailure(error)))
  }
};

const fetchSurveys = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchSurvey());
    return Api.get('/surveys', params)
      .then(response => {
        dispatch(actions.fetchSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchSurveyFailure(error)))
  }
};

const createSurvey = (data) => {
  return (dispatch) => {
    dispatch(actions.createSurvey());
    return Api.post('/survey', data)
      .then(response => {
        dispatch(actions.createSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createSurveyFailure(error)))
  }
};

const updateSurvey = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateSurvey());
    return Api.patch(`/survey/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateSurveyFailure(error)))
  }
};

const deleteSurvey = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteSurvey());
    return Api.delete(`/survey/${id}/${uid}`, {})
      .then(response => {
        dispatch(actions.deleteSurveySuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteSurveyFailure(error)))
  }
};

const connectSurvey = (id, uid, ckey) => {
  return (dispatch) => {
    dispatch(actions.connectSurvey());
    return Api.patch(`/survey/connect/${id}/${uid}/${ckey}`, null)
      .then(response => {
        dispatch(actions.connectSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.connectSurveyFailure(error)))
  }
};

const fetchSurveyGroups = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchSurvey());
    return Api.get('/survey/groups', params)
      .then(response => {
        dispatch(actions.fetchSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchSurveyFailure(error)))
  }
};

const fetchSurveyGroup = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchSurvey());
    return Api.get(`/survey/group/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchSurveyFailure(error)))
  }
};

const createSurveyGroup = (data) => {
  return (dispatch) => {
    dispatch(actions.createSurvey());
    return Api.post('/survey/group', data)
      .then(response => {
        dispatch(actions.createSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createSurveyFailure(error)))
  }
};

const updateSurveyGroup = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateSurvey());
    return Api.patch(`/survey/group/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateSurveyFailure(error)))
  }
};

const deleteSurveyGroup = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteSurvey());
    return Api.delete(`/survey/group/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.deleteSurveySuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteSurveyFailure(error)))
  }
};

const fetchSurveySessions = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchSurvey());
    return Api.get('/survey/sessions', params)
      .then(response => {
        dispatch(actions.fetchSurveySuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchSurveyFailure(error)))
  }
};

export default {
  fetchSurvey,
  fetchSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  connectSurvey,
  fetchSurveyGroups,
  fetchSurveyGroup,
  createSurveyGroup,
  updateSurveyGroup,
  deleteSurveyGroup,
  fetchSurveySessions
};
