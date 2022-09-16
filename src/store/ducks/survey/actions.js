import types from "./types";

const fetchSurvey = () => ({
  type: types.FETCH_SURVEY,
});

const fetchSurveySuccess = (data) => ({
  type: types.FETCH_SURVEY_SUCCESS,
  payload: {data}
});

const fetchSurveyFailure = (error) => ({
  type: types.FETCH_SURVEY_FAILURE,
  payload: {error}
});

const createSurvey = () => ({
  type: types.CREATE_SURVEY
});

const createSurveySuccess = (data) => ({
  type: types.CREATE_SURVEY_SUCCESS,
  payload: {data}
});

const createSurveyFailure = (error) => ({
  type: types.CREATE_SURVEY_FAILURE,
  payload: {error}
});

const deleteSurvey = () => ({
  type: types.DELETE_SURVEY
});

const deleteSurveySuccess = (data) => ({
  type: types.DELETE_SURVEY_SUCCESS,
  payload: {data}
});

const deleteSurveyFailure = (error) => ({
  type: types.DELETE_SURVEY_FAILURE,
  payload: {error}
});

const updateSurvey = () => ({
  type: types.UPDATE_SURVEY
});

const updateSurveySuccess = (data) => ({
  type: types.UPDATE_SURVEY_SUCCESS,
  payload: {data}
});

const updateSurveyFailure = (error) => ({
  type: types.UPDATE_SURVEY_FAILURE,
  payload: {error}
});

const connectSurvey = () => ({
  type: types.CONNECT_SURVEY
});

const connectSurveySuccess = (data) => ({
  type: types.CONNECT_SURVEY_SUCCESS,
  payload: {data}
});

const connectSurveyFailure = (error) => ({
  type: types.CONNECT_SURVEY_FAILURE,
  payload: {error}
});

export default {
  fetchSurvey,
  fetchSurveySuccess,
  fetchSurveyFailure,
  createSurvey,
  createSurveySuccess,
  createSurveyFailure,
  deleteSurvey,
  deleteSurveySuccess,
  deleteSurveyFailure,
  updateSurvey,
  updateSurveySuccess,
  updateSurveyFailure,
  connectSurvey,
  connectSurveySuccess,
  connectSurveyFailure
};
