const configFilePath = require('../../config.json')

export default class ConfigLoaderService {
  /* @ngInject */
  constructor ($http, $q, $window) {
    this.$http = $http
    this.$q = $q
    this.$window = $window
  }
  get () {
    let deferred = this.$q.defer()
    if (this.config) {
      deferred.resolve(this.config)
      return deferred.promise
    } else {
      return this._load()
    }
  }
  save (config) {
    let deferred = this.$q.defer()
    this.config = config
    for (var key in config) {
      if (!isNaN(parseInt(config[key]))) {
        config[key] = parseInt(config[key])
      }
    }
    deferred.resolve(this.config)
    return deferred.promise
  }
  _load () {
    // Capture 'this'
    var that = this
    return new Promise(function(resolve, reject) {
      that.config = configFilePath

        if (that.config.api.host === true) {
          that.config.api.host = that.$window.location.hostname
        }
        resolve(that.config)
      }
    )
  }
}
