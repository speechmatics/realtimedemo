import emojione from 'emojione'

export default class LanguageService {
  /* @ngInject */
  constructor ($http, $filter) {
    this.$http = $http
    this.$filter = $filter
  }
  get (filterExpression) {
    return new Promise((resolve, reject) => {
      resolve([
        {
          code: 'en-US',
          icon: emojione.shortnameToImage(':flag_us:'),
          name: 'American English',
          default: true
        },
        {
          code: 'en-GB',
          icon: emojione.shortnameToImage(':flag_gb:'),
          name: 'British English'
        },
        {
          code: 'en-AU',
          icon: emojione.shortnameToImage(':flag_au:'),
          name: 'Australian English'
        },
        {
          code: 'it',
          icon: emojione.shortnameToImage(':flag_it:'),
          name: 'Italian'
        },
        {
          code: 'nl',
          icon: emojione.shortnameToImage(':flag_nl:'),
          name: 'Dutch'
        },
        {
          code: 'de',
          icon: emojione.shortnameToImage(':flag_de:'),
          name: 'German'
        },
        {
          code: 'ja',
          icon: emojione.shortnameToImage(':flag_jp:'),
          name: 'Japanese'
        },
        {
          code: 'es',
          icon: emojione.shortnameToImage(':flag_es:'),
          name: 'Spanish'
        },
        {
          code: 'fr',
          icon: emojione.shortnameToImage(':flag_fr:'),
          name: 'French'
        },
        {
          code: 'ru',
          icon: emojione.shortnameToImage(':flag_ru:'),
          name: 'Russian'
        },
        {
          code: 'sv',
          icon: emojione.shortnameToImage(':flag_se:'),
          name: 'Swedish'
        }
      ])
    }).then(languages => {
      return this.$filter('filter')(languages, filterExpression)
    })
  }
}
