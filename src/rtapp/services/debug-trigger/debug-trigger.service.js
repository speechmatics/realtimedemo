export default class DebugTriggerService {
  /* @ngInject */
  constructor ($document, $rootScope, DialogService) {
    this.$document = $document
    this.$rootScope = $rootScope
    this.DialogService = DialogService
    this.buffer = ''
    this.listener = null
    this.maxLength = 0
    this.bindings = {
      config: this.handleConfig.bind(this),
      feedback: this.handleFeedback.bind(this),
      timelimit: this.handleTimelimit.bind(this)
    }
    for (let binding in this.bindings) {
      this.maxLength = Math.max(this.maxLength, binding.length)
    }
  }
  enable () {
    this.$document.on('keydown', this.handleKeyDown.bind(this))
  }
  disable () {
    this.$document.off('keydown', this.handleKeyDown.bind(this))
  }
  handleConfig () {
    this.$rootScope.$apply(() => {
      this.DialogService.showConfigurationEditor()
    })
  }
  handleFeedback () {
    this.$rootScope.$apply(() => {
      this.DialogService.showFeedbackQuestionnaire([])
    })
  }
  handleTimelimit () {
    this.$rootScope.$apply(() => {
      this.DialogService.showTimeLimitReached({ duration_limit: 120 })
    })
  }
  checkBuffer () {
    if (!this.buffer.length) return
    for (let binding in this.bindings) {
      if (this.buffer.includes(binding)) {
        this.bindings[binding]()
        this.buffer = ''
        return
      }
    }
    console.log(this.buffer.length, this.maxLength)
    if (this.buffer.length >= this.maxLength) {
      this.buffer = ''
    }
  }
  handleKeyDown ($event) {
    let key = String.fromCharCode($event.which).toLowerCase()
    this.buffer += key
    for (let binding in this.bindings) {
      if (binding.indexOf(this.buffer) !== 0) {
        continue
      }
      if (binding.indexOf(this.buffer) === 0) {
        if (this.buffer === binding) {
          this.bindings[binding]()
        } else {
          return
        }
      }
    }
    this.buffer = key
  }
}
