export default class RealtimeAPIService {
  /* @ngInject */
  constructor (
    $rootScope,
    $window,
    ConfigLoaderService,
    RealtimeAPIErrorType,
    RealtimeAPIEvent,
    RealtimeAPIMessageType
  ) {
    this.$rootScope = $rootScope
    this.$window = $window
    this.ConfigLoaderService = ConfigLoaderService
    this.RealtimeAPIMessageType = RealtimeAPIMessageType
    this.RealtimeAPIEvent = RealtimeAPIEvent
    this.RealtimeAPIErrorType = RealtimeAPIErrorType

    this.WebSocket = this.$window.WebSocket || this.$window.MozWebSocket
    this.seqNoOut = 0
    this.seqNoIn = 0
  }
  _handleWebSocketOpen (event) {
    console.debug('_handleWebSocketOpen', event)
    if (this.connectResolve) this.connectResolve()
  }
  _handleWebSocketError (event) {
    console.debug('_handleWebSocketError', event)
  }
  _handleWebSocketClose (event) {
    console.debug('_handleWebSocketClose', event)
    if (this.connectReject) this.connectReject(event)
    if (this.startRecognitionReject) this.startRecognitionReject(event)
    if (this.stopRecognitionResolve) this.stopRecognitionResolve(event)
    this._removeWebSocketEventListeners(this.socket)
    this.$rootScope.$broadcast(this.RealtimeAPIEvent.DISCONNECTED, event)
  }
  _handleWebSocketMessage (event) {
    let data = JSON.parse(event.data)
    console.debug('_handleWebSocketMessage', data.seq_no, data.message)
    switch (data.message) {
      case this.RealtimeAPIMessageType.RECOGNITION_STARTED:
        this.startRecognitionResolve(data)
        break
      case this.RealtimeAPIMessageType.DATA_ADDED:
        if (data.seq_no === this.seqNoIn) {
          this.seqNoIn++
        } else {
          throw new Error('Unexpected sequence number from API', event)
        }
        break
      case this.RealtimeAPIMessageType.WARNING:
        this.$rootScope.$broadcast(this.RealtimeAPIEvent.WARNING, data)
        break
      case this.RealtimeAPIMessageType.ADD_PARTIAL_TRANSCRIPT:
        this.$rootScope.$broadcast(
          this.RealtimeAPIEvent.PARTIAL_TRANSCRIPT_RECEIVED,
          data.transcript
        )
        break
      case this.RealtimeAPIMessageType.ADD_TRANSCRIPT:
        this.$rootScope.$broadcast(
          this.RealtimeAPIEvent.FULL_TRANSCRIPT_RECEIVED,
          data.transcript
        )
        break
      case this.RealtimeAPIMessageType.ERROR:
        this.$rootScope.$broadcast(this.RealtimeAPIEvent.ERROR, data)
        break
      case this.RealtimeAPIMessageType.END_OF_TRANSCRIPT:
        this.socket.close()
        break
    }
  }
  _addWebSocketEventListeners (socket) {
    socket.addEventListener('open', this._handleWebSocketOpen.bind(this))
    socket.addEventListener('error', this._handleWebSocketError.bind(this))
    socket.addEventListener('close', this._handleWebSocketClose.bind(this))
    socket.addEventListener('message', this._handleWebSocketMessage.bind(this))
  }
  _removeWebSocketEventListeners (socket) {
    socket.removeEventListener('open', this._handleWebSocketOpen.bind(this))
    socket.removeEventListener('error', this._handleWebSocketError.bind(this))
    socket.removeEventListener('close', this._handleWebSocketClose.bind(this))
    socket.removeEventListener(
      'message',
      this._handleWebSocketMessage.bind(this)
    )
  }
  connect (apiUrl, userId, authToken) {
    this.ConfigLoaderService.get().then(config => {
      this.config = config
    })

    this.apiUrl = apiUrl
    this.userId = userId
    this.authToken = authToken
    this.socket = new this.WebSocket(this.apiUrl)
    this.socket.binaryType = 'arraybuffer'

    this.$window.onbeforeunload = () => {
      this.socket.close()
    }

    this.seqNoOut = 0
    this.seqNoIn = 0

    this._addWebSocketEventListeners(this.socket)

    return new Promise((resolve, reject) => {
      this.connectResolve = resolve
      this.connectReject = reject
    })
  }
  startRecognition (languageCode, sampleRate) {
    if (this.socket.readyState !== this.WebSocket.OPEN) {
      Promise.reject(new Error('Socket not open.'))
    }
    this.socket.send(
      JSON.stringify({
        audio_format: {
          type: 'raw',
          encoding: 'pcm_f32le',
          sample_rate: sampleRate
        },
        user: this.userId,
        auth_token: this.authToken,
        message: 'StartRecognition',
        model: languageCode,
        output_format: {
          type: 'json'
        }
      })
    )
    return new Promise((resolve, reject) => {
      this.startRecognitionResolve = resolve
      this.startRecognitionReject = reject
    })
  }
  sendAudioBuffer (pcmData, sampleRate) {
    if (this.socket.readyState !== this.WebSocket.OPEN) return
    this.socket.send(
      JSON.stringify({
        message: this.RealtimeAPIMessageType.ADD_DATA,
        offset: 0,
        seq_no: this.seqNoOut,
        size: pcmData.byteLength
      })
    )
    this.seqNoOut++
    this.socket.send(pcmData.buffer)
  }
  stopRecognition () {
    if (this.socket) {
      if (this.socket.readyState !== this.WebSocket.OPEN) {
        return Promise.resolve()
      }
      this.socket.send(
        JSON.stringify({
          message: this.RealtimeAPIMessageType.END_OF_STREAM,
          last_seq_no: this.seqNoOut
        })
      )
    }
    return new Promise((resolve, reject) => {
      this.stopRecognitionResolve = resolve
      this.stopRecognitionReject = reject
    })
  }
}
