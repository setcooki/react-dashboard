import actions from "./actions";
import Api from "../../../class/Api";

const fetchAsset = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchAsset());
    return Api.get(`/asset/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchAssetSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchAssetFailure(error)))
  }
};

const fetchAssets = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchAsset());
    return Api.get('/assets', params)
      .then(response => {
        dispatch(actions.fetchAssetSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchAssetFailure(error)))
  }
};

const createAsset = (data) => {
  return (dispatch) => {
    dispatch(actions.createAsset());
    return Api.post('/asset', data)
      .then(response => {
        dispatch(actions.createAssetSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createAssetFailure(error)))
  }
};

const updateAsset = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateAsset());
    return Api.patch(`/asset/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateAssetSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateAssetFailure(error)))
  }
};

const deleteAsset = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteAsset());
    return Api.delete(`/asset/${id}/${uid}`, {})
      .then(response => {
        dispatch(actions.deleteAssetSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteAssetFailure(error)))
  }
};

export default {
  fetchAsset,
  fetchAssets,
  createAsset,
  updateAsset,
  deleteAsset,
};
