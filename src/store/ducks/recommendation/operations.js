import actions from "./actions";
import Api from "../../../class/Api";

const fetchRecommendation = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get(`/recommendation/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const fetchRecommendations = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get('/recommendations', params)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const createRecommendation = (data) => {
  return (dispatch) => {
    dispatch(actions.createRecommendation());
    return Api.post('/recommendation', data)
      .then(response => {
        dispatch(actions.createRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createRecommendationFailure(error)))
  }
};

const updateRecommendation = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateRecommendation());
    return Api.patch(`/recommendation/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateRecommendationFailure(error)))
  }
};

const deleteRecommendation = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteRecommendation());
    return Api.delete(`/recommendation/${id}/${uid}`, {})
      .then(response => {
        dispatch(actions.deleteRecommendationSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteRecommendationFailure(error)))
  }
};

const fetchRecommendationBundles = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get('/recommendation/bundles', params)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const fetchRecommendationBundle = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get(`/recommendation/bundle/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const createRecommendationBundle = (data) => {
  return (dispatch) => {
    dispatch(actions.createRecommendation());
    return Api.post('/recommendation/bundle', data)
      .then(response => {
        dispatch(actions.createRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createRecommendationFailure(error)))
  }
};

const updateRecommendationBundle = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateRecommendation());
    return Api.patch(`/recommendation/bundle/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateRecommendationFailure(error)))
  }
};

const deleteRecommendationBundle = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteRecommendation());
    return Api.delete(`/recommendation/bundle/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.deleteRecommendationSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteRecommendationFailure(error)))
  }
};

const fetchRecommendationBlock = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get(`/recommendation/block/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const fetchRecommendationBlocks = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get('/recommendation/blocks', params)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const createRecommendationBlock = (data) => {
  return (dispatch) => {
    dispatch(actions.createRecommendation());
    return Api.post('/recommendation/block', data)
      .then(response => {
        dispatch(actions.createRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createRecommendationFailure(error)))
  }
};

const updateRecommendationBlock = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateRecommendation());
    return Api.patch(`/recommendation/block/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateRecommendationFailure(error)))
  }
};

const deleteRecommendationBlock = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteRecommendation());
    return Api.delete(`/recommendation/block/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.deleteRecommendationSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteRecommendationFailure(error)))
  }
};

const fetchRecommendationCategories = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get('/recommendation/categories', params)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const fetchRecommendationCategory = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get(`/recommendation/category/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

const createRecommendationCategory = (data) => {
  return (dispatch) => {
    dispatch(actions.createRecommendation());
    return Api.post('/recommendation/category', data)
      .then(response => {
        dispatch(actions.createRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.createRecommendationFailure(error)))
  }
};

const updateRecommendationCategory = (id, uid, data) => {
  return (dispatch) => {
    dispatch(actions.updateRecommendation());
    return Api.patch(`/recommendation/category/${id}/${uid}`, data)
      .then(response => {
        dispatch(actions.updateRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.updateRecommendationFailure(error)))
  }
};

const deleteRecommendationCategory = (id, uid) => {
  return (dispatch) => {
    dispatch(actions.deleteRecommendation());
    return Api.delete(`/recommendation/category/${id}/${uid}`, null)
      .then(response => {
        dispatch(actions.deleteRecommendationSuccess(id));
        return id;
      })
      .catch(error => dispatch(actions.deleteRecommendationFailure(error)))
  }
};

const fetchRecommendationTags = (params) => {
  return (dispatch) => {
    dispatch(actions.fetchRecommendation());
    return Api.get('/recommendation/tags', params)
      .then(response => {
        dispatch(actions.fetchRecommendationSuccess(response));
        return response;
      })
      .catch(error => dispatch(actions.fetchRecommendationFailure(error)))
  }
};

export default {
  fetchRecommendation,
  fetchRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  fetchRecommendationBundle,
  fetchRecommendationBundles,
  createRecommendationBundle,
  updateRecommendationBundle,
  deleteRecommendationBundle,
  fetchRecommendationBlock,
  fetchRecommendationBlocks,
  createRecommendationBlock,
  updateRecommendationBlock,
  deleteRecommendationBlock,
  fetchRecommendationCategory,
  fetchRecommendationCategories,
  createRecommendationCategory,
  updateRecommendationCategory,
  deleteRecommendationCategory,
  fetchRecommendationTags
};
