import angular from 'angular'
import moment from 'moment'

import ConfigDialogController from './config/config.controller'
import ConfigDialogTemplate from './config/config.tmpl.html'
import ConnectionErrorDialogTemplate from './connection-error/connection-error.tmpl.html'
import RequirementsErrorDialogTemplate from './requirements-error/requirements-error.tmpl.html'
import FeedbackDialogTemplate from './feedback/feedback.tmpl.html'
import FeedbackDialogController from './feedback/feedback.controller'

import './requirements-error/requirements-error.style.scss'

export default class DialogService {
  /* @ngInject */
  constructor (
    $analytics,
    $interpolate,
    $mdDialog,
    $window,
    ConfigLoaderService,
    StringService
  ) {
    this.$analytics = $analytics
    this.$interpolate = $interpolate
    this.$mdDialog = $mdDialog
    this.$window = $window
    this.StringService = StringService
    this.ConfigLoaderService = ConfigLoaderService

    this.multiple = true
  }
  handleError (event) {
    // Ignore
  }
  showConnectionError (params) {
    this.$analytics.eventTrack('Dialog', { label: 'Connection Error' })
    return this.$mdDialog
      .show(
        this.$mdDialog
          .alert()
          .multiple(this.multiple)
          .parent(angular.element(this.$window.document.body))
          .clickOutsideToClose(true)
          .title('Connection Error')
          .htmlContent(this.$interpolate(ConnectionErrorDialogTemplate)(params))
          .ariaLabel('Alert Connection Error')
          .ok('OK')
      )
      .catch(this.handleError.bind(this))
  }
  showMinimumRequirementsFailed (params) {
    this.$analytics.eventTrack('Dialog', {
      label: 'Minimum Requirements Failed'
    })
    return this.$mdDialog
      .show({
        multiple: this.multiple,
        template: RequirementsErrorDialogTemplate,
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        controller: class RequirementsErrorDialogController {
          /* @ngInject */
          constructor ($scope, features) {
            $scope.features = features
          }
        },
        resolve: {
          features: () => {
            return params
          }
        }
      })
      .catch(this.handleError.bind(this))
  }
  showHeavyLoad (params) {
    this.$analytics.eventTrack('Dialog', {
      label: this.StringService.get().dialog.heavyload.title
    })
    return this.$mdDialog
      .show(
        this.$mdDialog
          .alert()
          .multiple(this.multiple)
          .parent(angular.element(this.$window.document.body))
          .clickOutsideToClose(true)
          .title(this.StringService.get().dialog.heavyload.title)
          .htmlContent(this.StringService.get().dialog.heavyload.textContent)
          .ariaLabel(this.StringService.get().dialog.heavyload.ariaLabel)
          .ok(this.StringService.get().dialog.heavyload.actions.ok)
      )
      .catch(this.handleError.bind(this))
  }
  showTimeLimitReached (params) {
    this.$analytics.eventTrack('Dialog', {
      label: this.StringService.get().dialog.timelimit.title
    })
    return this.$mdDialog
      .show(
        this.$mdDialog
          .confirm()
          .multiple(this.multiple)
          .parent(angular.element(this.$window.document.body))
          .clickOutsideToClose(true)
          .title(this.StringService.get().dialog.timelimit.title)
          .textContent(
            this.$interpolate(
              this.StringService.get().dialog.timelimit.textContent
            )({
              limit: moment
                .duration(params.duration_limit, 'seconds')
                .humanize()
            })
          )
          .ariaLabel(this.StringService.get().dialog.timelimit.ariaLabel)
          .ok(this.StringService.get().dialog.timelimit.actions.ok)
          .cancel(this.StringService.get().dialog.timelimit.actions.cancel)
      )
      .catch(this.handleError.bind(this))
  }
  showAccuracyDiscalimer () {
    this.$analytics.eventTrack('Dialog', {
      label: this.StringService.get().dialog.accuracy.analytics.label
    })
    return this.$mdDialog
      .show(
        this.$mdDialog
          .alert()
          .title(this.StringService.get().dialog.accuracy.title)
          .htmlContent(this.StringService.get().dialog.accuracy.htmlContent)
          .multiple(this.multiple)
          .parent(angular.element(document.body))
          .clickOutsideToClose(false)
          .ariaLabel(this.StringService.get().dialog.accuracy.aria.label)
          .ok('Got it!')
      )
      .catch(this.handleError.bind(this))
  }
  showFeedbackQuestionnaire (transcripts) {
    this.$analytics.eventTrack('Dialog', {
      label: this.StringService.get().dialog.feedback.title
    })
    let jobIds = transcripts.map(transcript => transcript.id)
    return this.$mdDialog
      .show({
        multiple: this.multiple,
        template: FeedbackDialogTemplate,
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        controller: FeedbackDialogController,
        resolve: {
          content: () => {
            return this.StringService.get().dialog.feedback
          },
          jobIds: () => {
            return jobIds
          }
        }
      })
      .catch(this.handleError.bind(this))
  }
  showConfigurationEditor (params) {
    this.$analytics.eventTrack('Dialog', { label: 'Configuration Editor' })
    return this.ConfigLoaderService.get().then(config => {
      return this.$mdDialog
        .show({
          multiple: this.multiple,
          controller: ConfigDialogController,
          template: ConfigDialogTemplate,
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          resolve: {
            config: () => {
              return config
            }
          }
        })
        .then(config => {
          this.ConfigLoaderService.save(config)
        })
        .catch(this.handleError.bind(this))
    })
  }
}
