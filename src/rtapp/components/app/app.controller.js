import angular from 'angular'
import moment from 'moment'
import Modernizr from 'modernizr'
import speechmaticsLogoSrc from 'file-loader!../../../assets/logo/speechmatics-logo-light.svg'

let requiredFeatures = {
  getusermedia: {
    name: 'Media Capture and Streams',
    supported: undefined
  },
  webaudio: {
    name: 'Web Audio API',
    supported: undefined
  },
  websockets: {
    name: 'WebSockets',
    supported: undefined
  },
  websocketsbinary: {
    name: 'Binary WebSockets',
    supported: undefined
  }
}

export default class AppController {
  /* @ngInject */
  constructor (
    $analytics,
    $filter,
    $mdToast,
    $scope,
    AppState,
    AudioCaptureEvent,
    AudioCaptureService,
    ConfigLoaderService,
    DebugTriggerService,
    DialogService,
    LanguageService,
    RealtimeAPIErrorType,
    RealtimeAPIEvent,
    RealtimeAPIService,
    RealtimeAPIWarningType,
    StringService,
    TranscriptComponentEvent
  ) {
    this.$analytics = $analytics
    this.$filter = $filter
    this.$mdToast = $mdToast
    this.$scope = $scope
    this.AppState = AppState
    this.AudioCaptureEvent = AudioCaptureEvent
    this.AudioCaptureService = AudioCaptureService
    this.ConfigLoaderService = ConfigLoaderService
    this.DebugTriggerService = DebugTriggerService
    this.DialogService = DialogService
    this.LanguageService = LanguageService
    this.RealtimeAPIErrorType = RealtimeAPIErrorType
    this.RealtimeAPIEvent = RealtimeAPIEvent
    this.RealtimeAPIService = RealtimeAPIService
    this.RealtimeAPIWarningType = RealtimeAPIWarningType
    this.StringService = StringService
    this.TranscriptComponentEvent = TranscriptComponentEvent

    this.incomingAudioBufferListener = null
    this.partialTranscriptReceivedListener = null
    this.fullTranscriptReceivedListener = null
    this.errorListener = null
    this.disconnectedListener = null
    this.timeLimitReachedListener = null

    this.state = this.AppState.DISCONNECTED
    this.options = {
      languages: []
    }
    this.params = {}
    this.recording = false
    this.paragraphIndex = 0
    this.transcripts = []
    this.error = false
    this.feedbackDialogTriggered = false
    this.speechmaticsLogoSrc = speechmaticsLogoSrc
    this.year = new Date().getFullYear()

    this.initialise()
  }
  meetsMinimumRequirements () {
    let passed = true
    for (let requiredFeature in requiredFeatures) {
      requiredFeatures[requiredFeature].supported = Modernizr[requiredFeature]
      passed =
        passed && !Modernizr[requiredFeature]
          ? Modernizr[requiredFeature]
          : passed
    }
    return passed
  }
  initialise () {
    if (!this.meetsMinimumRequirements()) {
      this.DialogService.showMinimumRequirementsFailed(requiredFeatures)
      this.error = true
      return
    }
    this.LanguageService.get().then(languages => {
      this.options.languages = languages
      let defaultLanguages = this.$filter('filter')(this.options.languages, {
        default: true
      })
      if (defaultLanguages) {
        this.params.language = defaultLanguages[0].code
      }
    })
    this.ConfigLoaderService.get().then(config => {
      this.config = config
      if (this.config.app.debug) {
        this.DebugTriggerService.enable()
      }
    })
    this.strings = this.StringService.get()
    this.addEventListeners()
  }
  handleReceivedTranscript (event, paragraph) {
    this.$scope.$apply(() => {
      switch (event.name) {
        case this.RealtimeAPIEvent.PARTIAL_TRANSCRIPT_RECEIVED:
          this.transcripts[0].paragraphs[this.paragraphIndex] = {
            text: paragraph,
            type: 'partial'
          }
          break
        case this.RealtimeAPIEvent.FULL_TRANSCRIPT_RECEIVED:
          if (paragraph) {
            this.transcripts[0].paragraphs[this.paragraphIndex] = {
              text: paragraph,
              type: 'full'
            }
            this.paragraphIndex++
          }
          break
      }
    })
  }
  showFeedbackQuestionnaire (transcripts) {
    this.stopTranscribing()
    this.feedbackDialogTriggered = true
    this.DialogService.showFeedbackQuestionnaire(transcripts)
  }
  onFeedbackClicked ($event) {
    this.showFeedbackQuestionnaire(this.transcripts)
  }
  showAccuracyDiscalimer () {
    this.stopTranscribing()
    this.DialogService.showAccuracyDiscalimer()
  }
  onAccuracyClicked ($event) {
    this.showAccuracyDiscalimer()
  }
  handleIncomingAudioBuffer (event, data) {
    this.RealtimeAPIService.sendAudioBuffer(data.pcmData, data.sampleRate)
  }
  handleError (event, data) {
    switch (data.type) {
      case this.RealtimeAPIErrorType.JobError:
        this.DialogService.showHeavyLoad()
        break
      default:
        this.$mdToast.show(
          this.$mdToast
            .simple()
            .textContent(data.reason)
            .hideDelay(3000)
        )
        break
    }
  }
  handleDisconnected (event) {
    this.updateState(this.AppState.DISCONNECTED)
  }
  handleCloseTranscript (event, component) {
    let transcriptIndex = this.transcripts.indexOf(component.model)
    if (transcriptIndex !== -1) {
      this.transcripts.splice(transcriptIndex, 1)
    }
  }
  handleWarning (event, data) {
    switch (data.type) {
      default:
        console.warn(data)
        break
      case this.RealtimeAPIWarningType.DURATION_LIMIT_EXCEEDED:
        this.stopTranscribing()
        this.DialogService.showTimeLimitReached(data).then(() => {
          this.showFeedbackQuestionnaire(this.transcripts)
        })
        break
    }
  }
  addEventListeners () {
    this.incomingAudioBufferListener = this.$scope.$on(
      this.AudioCaptureEvent.INCOMING_AUDIO_BUFFER,
      this.handleIncomingAudioBuffer.bind(this)
    )
    this.partialTranscriptReceivedListener = this.$scope.$on(
      this.RealtimeAPIEvent.PARTIAL_TRANSCRIPT_RECEIVED,
      this.handleReceivedTranscript.bind(this)
    )
    this.fullTranscriptReceivedListener = this.$scope.$on(
      this.RealtimeAPIEvent.FULL_TRANSCRIPT_RECEIVED,
      this.handleReceivedTranscript.bind(this)
    )
    this.errorListener = this.$scope.$on(
      this.RealtimeAPIEvent.ERROR,
      this.handleError.bind(this)
    )
    this.disconnectedListener = this.$scope.$on(
      this.RealtimeAPIEvent.DISCONNECTED,
      this.handleDisconnected.bind(this)
    )
    this.transcriptCloseListener = this.$scope.$on(
      this.TranscriptComponentEvent.CLOSE,
      this.handleCloseTranscript.bind(this)
    )
    this.timeLimitReachedListener = this.$scope.$on(
      this.RealtimeAPIEvent.WARNING,
      this.handleWarning.bind(this)
    )
  }
  removeEventListeners () {
    this.incomingAudioBufferListener()
    this.partialTranscriptReceivedListener()
    this.fullTranscriptReceivedListener()
    this.errorListener()
    this.disconnectedListener()
  }
  updateState (state) {
    this.state = state
    this.$analytics.eventTrack('AppState', { label: this.state })
    if (
      !this.feedbackDialogTriggered &&
      this.state === this.AppState.DISCONNECTED &&
      this.transcripts.length >= this.config.app.feedback_limit
    ) {
      this.showFeedbackQuestionnaire(this.transcripts)
    }
  }
  applyState (state) {
    // Use this method if change occurs outside of the $digest cycle.
    this.$scope.$apply(() => {
      this.updateState(state)
    })
  }
  createNewTranscript (jobId) {
    this.paragraphIndex = 0
    this.transcripts.unshift({
      id: jobId,
      date: moment().format('MMMM Do YYYY, h:mm:ss a'),
      paragraphs: [],
      language: this.$filter('filter')(this.options.languages, {
        code: this.params.language
      })[0]
    })
  }
  startTranscribing () {
    this.updateState(this.AppState.CONNECTING)
    this.RealtimeAPIService.connect(
      `wss://${this.config.api.host}`,
      this.config.api.user_id,
      this.config.api.auth_token
    )
      .then(event => {
        this.applyState(this.AppState.CONNECTED)
        this.RealtimeAPIService.startRecognition(
          this.params.language,
          this.AudioCaptureService.getSampleRate()
        )
          .then(data => {
            this.applyState(this.AppState.GETTING_USER_MEDIA)
            this.AudioCaptureService.startCapture(this.config.app.listen).then(
              () => {
                this.applyState(this.AppState.CAPTURING_AUDIO)
                this.createNewTranscript(data.id)
              }
            )
          })
          .catch(event => {})
      })
      .catch(error => {
        console.error(error)
        this.DialogService.showConnectionError({
          host: this.config.api.host
        })
      })
  }
  stopTranscribing () {
    this.AudioCaptureService.stopCapture()
    this.RealtimeAPIService.stopRecognition()
  }
  toggleTranscribing () {
    if (this.state === this.AppState.DISCONNECTED) {
      this.startTranscribing()
    } else {
      this.stopTranscribing()
    }
  }
  onMicrophoneButtonActivated ($event) {
    this.toggleTranscribing()
  }
}
