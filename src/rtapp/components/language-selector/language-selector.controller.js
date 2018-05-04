export default class LanguageSelectorController {
  /* @ngInject */
  constructor ($analytics) {
    this.$analytics = $analytics
  }
  onLanguageChanged ($event) {
    this.$analytics.eventTrack('Language Changed', { label: this.selected })
  }
}
