import types from "./types";

const fetchRecommendation = () => ({
  type: types.FETCH_RECOMMENDATION,
});

const fetchRecommendationSuccess = (data) => ({
  type: types.FETCH_RECOMMENDATION_SUCCESS,
  payload: {data}
});

const fetchRecommendationFailure = (error) => ({
  type: types.FETCH_RECOMMENDATION_FAILURE,
  payload: {error}
});

const createRecommendation = () => ({
  type: types.CREATE_RECOMMENDATION
});

const createRecommendationSuccess = (data) => ({
  type: types.CREATE_RECOMMENDATION_SUCCESS,
  payload: {data}
});

const createRecommendationFailure = (error) => ({
  type: types.CREATE_RECOMMENDATION_FAILURE,
  payload: {error}
});

const deleteRecommendation = () => ({
  type: types.DELETE_RECOMMENDATION
});

const deleteRecommendationSuccess = (data) => ({
  type: types.DELETE_RECOMMENDATION_SUCCESS,
  payload: {data}
});

const deleteRecommendationFailure = (error) => ({
  type: types.DELETE_RECOMMENDATION_FAILURE,
  payload: {error}
});

const updateRecommendation = () => ({
  type: types.UPDATE_RECOMMENDATION
});

const updateRecommendationSuccess = (data) => ({
  type: types.UPDATE_RECOMMENDATION_SUCCESS,
  payload: {data}
});

const updateRecommendationFailure = (error) => ({
  type: types.UPDATE_RECOMMENDATION_FAILURE,
  payload: {error}
});

export default {
  fetchRecommendation,
  fetchRecommendationSuccess,
  fetchRecommendationFailure,
  createRecommendation,
  createRecommendationSuccess,
  createRecommendationFailure,
  deleteRecommendation,
  deleteRecommendationSuccess,
  deleteRecommendationFailure,
  updateRecommendation,
  updateRecommendationSuccess,
  updateRecommendationFailure
};
