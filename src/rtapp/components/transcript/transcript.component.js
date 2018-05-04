import './transcript.style.scss'
import template from './transcript.tmpl.html'

export default {
  template,
  bindings: {
    model: '<',
    index: '<',
    state: '<'
  },
  controller: class TranscriptController {
    /* @ngInject */
    constructor ($scope, TranscriptComponentEvent, AppState) {
      this.$scope = $scope
      this.TranscriptComponentEvent = TranscriptComponentEvent
      this.AppState = AppState
    }
    handleCloseClicked ($event) {
      this.$scope.$emit(this.TranscriptComponentEvent.CLOSE, this)
    }
  }
}
