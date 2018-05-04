import angular from 'angular'

import AppComponent from './app/app.component'
import AppController from './app/app.controller'
import AppState from './app/app.state'
import FeedbackFormComponent from './feedback-form/feedback-form.component'
import LanguageSelectorComponent from './language-selector/language-selector.component'
import MicrophoneButtonComponent from './microphone-button/microphone-button.component'
import TranscriptComponent from './transcript/transcript.component'
import TranscriptComponentEvent from './transcript/transcript.event'

export default angular
  .module('sm.rtapp.components', ['ngMaterial'])
  .component('appComponent', AppComponent)
  .component('languageSelectorComponent', LanguageSelectorComponent)
  .component('microphoneButtonComponent', MicrophoneButtonComponent)
  .component('feedbackFormComponent', FeedbackFormComponent)
  .component('transcriptComponent', TranscriptComponent)
  .constant('AppState', AppState)
  .constant('TranscriptComponentEvent', TranscriptComponentEvent)
  .controller('AppController', AppController)
