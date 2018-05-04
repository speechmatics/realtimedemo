import './feedback.style.scss'

export default class FeedbackDialogController {
  /* @ngInject */
  constructor ($http, $mdDialog, $scope, ConfigLoaderService, content, jobIds) {
    $scope.$ctrl = this
    this.$http = $http
    this.$mdDialog = $mdDialog
    this.content = content
    this.formModel = { jobIds }
    this.submitting = false
    ConfigLoaderService.get().then(config => {
      this.formEndpoint = config.app.form_endpoint
    })
  }
  submit () {
    this.submitting = true
    this.$http.post(this.formEndpoint, this.formModel).then(
      response => {
        this.submitted = true
        this.submitting = false
      },
      response => {
        console.debug(response)
        this.submitting = false
      }
    )
  }
  close () {
    this.$mdDialog.hide()
  }
}
