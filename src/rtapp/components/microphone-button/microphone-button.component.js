import template from './microphone-button.tmpl.html'

export default {
  template,
  bindings: {
    disabled: '<',
    recording: '<',
    onActivated: '&'
  }
}
