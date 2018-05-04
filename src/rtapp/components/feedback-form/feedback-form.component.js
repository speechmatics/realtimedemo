import './feedback-form.style.scss'
import template from './feedback-form.tmpl.html'
import controller from './feedback-form.controller'

export default {
  template,
  controller,
  bindings: {
    ngDisabled: '=',
    ngModel: '='
  }
}
