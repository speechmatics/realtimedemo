import angular from 'angular'

import './rtapp.style.scss'

import DirectivesModule from './directives/directives.module'
import ComponentsModule from './components/components.module'
import ServicesModule from './services/services.module'
import AppConfig from './rtapp.config'

export default angular
  .module('sm.rtapp', [
    'ngSanitize',
    require('angulartics'),
    require('angulartics-google-analytics'),
    DirectivesModule.name,
    ComponentsModule.name,
    ServicesModule.name
  ])
  .config(AppConfig)
