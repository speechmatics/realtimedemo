import './language-selector.style.scss'
import template from './language-selector.tmpl.html'
import controller from './language-selector.controller'

export default {
  template,
  controller,
  bindings: {
    disabled: '<',
    languages: '<',
    selected: '='
  }
}
