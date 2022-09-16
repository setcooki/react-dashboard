import {authHeader} from '../functions/authHeader';
import {authentication} from "../services/authentication";
import Store from "../store/store";

const axios = require('axios').default;

class Api {

  constructor() {
    this.tkey = null;
    this.ckey = null;
    this.client = null;
    this.clientKey = null;
    this.clientEndpoint = null;
  }

  init() {
    if ('irr' in window && 'REACT_APP_API_KEY' in window.irr) {
      this.clientKey = window.irr['REACT_APP_API_KEY'];
    } else {
      this.clientKey = process.env.REACT_APP_API_KEY;
    }
    if ('irr' in window && 'REACT_APP_API_ENDPOINT' in window.irr) {
      this.clientEndpoint = window.irr['REACT_APP_API_ENDPOINT'];
    } else {
      this.clientEndpoint = process.env.REACT_APP_API_ENDPOINT;
    }
    this.client = axios.create({
      baseURL: this.clientEndpoint,
      timeout: 5000,
    });
    Store.store.subscribe(() => {
      let state = Store.store.getState();
      if ('client' in state.runtime.runtime.data && state.runtime.runtime.data.client) {
        this.ckey = state.runtime.runtime.data.client.ckey;
      } else {
        this.ckey = null;
      }
      if ('tenant' in state.runtime.runtime.data && state.runtime.runtime.data.tenant) {
        this.tkey = state.runtime.runtime.data.tenant.tkey;
      } else {
        this.tkey = null;
      }
    })
    this.client.interceptors.request.use((config) => {
      if (this.ckey || this.tkey) {
        config.params = config.params || {};
      }
      if (this.ckey) {
        config.params['ckey'] = this.ckey;
      }
      if (this.tkey) {
        config.params['tkey'] = this.tkey;
      }
      return config;
    });
    this.client.interceptors.response.use((response) => {
      return response;
    }, error => {
      if ([401, 403].indexOf(error.response.status) !== -1 && authentication.isCurrentUser) {
        authentication.logout();
        window.location.reload(true);
      }
      return error;
    });
  }

  get(path, params) {
    params = params || null;
    return new Promise((resolve, reject) => {
      path = path += `?apiKey=${this.clientKey}`;
      this.client.get(path, {
        params: params,
        headers: authHeader()
      })
        .then((response) => {
          return this.handleResponse(response, resolve, reject);
        })
        .catch((error) => {
          return this.handleError(error, reject);
        });
    });
  }

  post(path, data) {
    return new Promise((resolve, reject) => {
      path += `?apiKey=${this.clientKey}&ts=${(new Date().getTime())}`;
      this.client.post(path, data, {
        headers: Object.assign({}, {
            'Content-Type': 'multipart/form-data'
          }, authHeader()
        )
      })
        .then((response) => {
          return this.handleResponse(response, resolve, reject);
        })
        .catch((error) => {
          return this.handleError(error, reject);
        });
    });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      path += `?apiKey=${this.clientKey}&ts=${(new Date().getTime())}`;
      this.client.delete(path, {
          headers: authHeader()
        }
      ).then((response) => {
        return this.handleResponse(response, resolve, reject);
      })
        .catch((error) => {
          return this.handleError(error, reject);
        });
    });
  }

  patch(path, data) {
    return new Promise((resolve, reject) => {
      path += `?apiKey=${this.clientKey}&ts=${(new Date().getTime())}`;
      this.client.patch(path, data, {
        headers: Object.assign({}, {
          'Content-Type': 'multipart/form-data'
        }, authHeader())
      })
        .then((response) => {
          return this.handleResponse(response, resolve, reject);
        })
        .catch((error) => {
          return this.handleError(error, reject);
        });
    });
  }

  login(data) {
    return new Promise((resolve, reject) => {
      let path = `/user/login?apiKey=${this.clientKey}`;
      this.client.post(path, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        if (response.status === 200) {
          if ('data' in response && response.data) {
            if ('success' in response.data && response.data.success) {
              if ('token' in response.data.data && response.data.data.token) {
                return resolve(response.data.data);
              }
            }
          }
        }
        return reject()
      }).catch(error => {
        return reject(error);
      });
    });
  }

  ping() {
    return new Promise((resolve, reject) => {
      let path = `/user/ping?apiKey=${this.clientKey}`;
      this.client.post(path, {}, {
        headers: authHeader()
      }).then(response => {
        console.log(response);
      }).catch(error => {
        return reject(error);
      });
    });
  }

  checkUrl = async (url) => {
    try {
      const response = await axios.head(url);
      return response.status;
    } catch (error) {
      if (error.response) {
        return error.response.status;
      } else if (error.request) {
        return false;
      } else {
        return false;
      }
    }
  }

  handleError(error, reject) {
    return reject(error.message);
  }

  handleResponse(response, resolve, reject) {
    if (response && 'status' in response) {
      if ([401, 403].indexOf(response.status) !== -1) {
        authentication.logout();
        window.location.reload(true);
      } else {
        if ('data' in response && response.data) {
          if ('success' in response.data && response.data.success) {
            return resolve(response.data.data || null);
          } else if ('success' in response.data && !response.data.success && 'errors' in response.data && Array.isArray(response.data.errors)) {
            return reject(response.data.errors[0].detail || 'Invalid API response');
          }
        }
        return reject('Invalid API response');
      }
    } else {
      return reject('Invalid API response');
    }
  }
}

export default new Api();
