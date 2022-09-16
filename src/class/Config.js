class Config {

  constructor() {
    this._config = {};
  }

  init(config) {
    this._config = config;
  }

  set(name, value) {
    this._config[name] = value;
  }

  get(name, _default) {
    if (name in this._config) {
      return this._config[name];
    } else {
      return _default || undefined;
    }
  }

  has(name) {
    return (name in this._config);
  }

  is(name) {
    if (name in this._config) {
      let value = this._config[name];
      if (value !== '' && value !== undefined) {
        return true;
      }
    }
    return false;
  }

  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
  }
}

export default new Config();
