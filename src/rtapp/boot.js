import angular from 'angular'
import rtapp from './rtapp.module'

angular.element(document).ready(() => {
  angular.bootstrap(document, [rtapp.name], {
    strictDi: true
  })
})
