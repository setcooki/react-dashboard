import types from "./types";

const fetchAsset = () => ({
  type: types.FETCH_ASSET,
});

const fetchAssetSuccess = (data) => ({
  type: types.FETCH_ASSET_SUCCESS,
  payload: {data}
});

const fetchAssetFailure = (error) => ({
  type: types.FETCH_ASSET_FAILURE,
  payload: {error}
});

const createAsset = () => ({
  type: types.CREATE_ASSET
});

const createAssetSuccess = (data) => ({
  type: types.CREATE_ASSET_SUCCESS,
  payload: {data}
});

const createAssetFailure = (error) => ({
  type: types.CREATE_ASSET_FAILURE,
  payload: {error}
});

const deleteAsset = () => ({
  type: types.DELETE_ASSET
});

const deleteAssetSuccess = (data) => ({
  type: types.DELETE_ASSET_SUCCESS,
  payload: {data}
});

const deleteAssetFailure = (error) => ({
  type: types.DELETE_ASSET_FAILURE,
  payload: {error}
});

const updateAsset = () => ({
  type: types.UPDATE_ASSET
});

const updateAssetSuccess = (data) => ({
  type: types.UPDATE_ASSET_SUCCESS,
  payload: {data}
});

const updateAssetFailure = (error) => ({
  type: types.UPDATE_ASSET_FAILURE,
  payload: {error}
});

export default {
  fetchAsset,
  fetchAssetSuccess,
  fetchAssetFailure,
  createAsset,
  createAssetSuccess,
  createAssetFailure,
  deleteAsset,
  deleteAssetSuccess,
  deleteAssetFailure,
  updateAsset,
  updateAssetSuccess,
  updateAssetFailure
};
