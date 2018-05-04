import navigator from 'navigator'

const bufferSize = 4096
const numberOfInputChannels = 1
const numberOfOutputChannels = 1

export default class AudioCaptureService {
  /* @ngInject */
  constructor ($window, $rootScope, AudioCaptureEvent) {
    this.$window = $window
    this.$rootScope = $rootScope
    this.AudioCaptureEvent = AudioCaptureEvent
    this.audioContext = new ($window.AudioContext ||
      $window.webkitAudioContext)()
    this.scriptProcessorNode = this.audioContext.createScriptProcessor(
      bufferSize,
      numberOfInputChannels,
      numberOfOutputChannels
    )
    this.scriptProcessorNode.onaudioprocess = this.handleAudioProcess.bind(this)
  }
  getSampleRate () {
    return this.audioContext.sampleRate
  }
  startCapture (listen = false) {
    return new Promise((resolve, reject) => {
      function handleMediaStream (mediaStream) {
        this.mediaStream = mediaStream
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(
          this.mediaStream
        )
        this.mediaStreamSource.connect(this.scriptProcessorNode)
        if (listen) {
          this.mediaStreamSource.connect(this.audioContext.destination)
        }
        this.scriptProcessorNode.connect(this.audioContext.destination)
        resolve(this.mediaStream)
      }
      if ('mediaDevices' in navigator) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(handleMediaStream.bind(this))
          .catch(reject)
      } else if ('getUserMedia' in navigator) {
        navigator.getUserMedia(
          { audio: true },
          handleMediaStream.bind(this),
          reject
        )
      } else {
        reject(new Error('getUserMedia not supported.'))
      }
    })
  }
  handleAudioProcess (audioProcessEvent) {
    this.$rootScope.$broadcast(this.AudioCaptureEvent.INCOMING_AUDIO_BUFFER, {
      pcmData: audioProcessEvent.inputBuffer.getChannelData(0),
      sampleRate: this.audioContext.sampleRate
    })
  }
  stopCapture () {
    if (this.scriptProcessorNode) {
      this.scriptProcessorNode.disconnect()
    }
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect()
    }
    if (this.mediaStream) {
      for (let track of this.mediaStream.getTracks()) {
        track.stop()
      }
    }
  }
}
