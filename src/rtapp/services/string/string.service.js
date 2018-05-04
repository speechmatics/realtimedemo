import Strings from 'json-loader!../../strings.json'

export default class StringService {
  /* @ngInject */
  constructor (ConfigLoaderService) {
    this.ConfigLoaderService = ConfigLoaderService
  }
  get () {
    return Strings
  }
}
