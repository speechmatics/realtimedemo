export default class FeedbackFormController {
  /* @ngInject */
  constructor (StringService) {
    this.strings = StringService.get().components.feedbackForm
  }
}
