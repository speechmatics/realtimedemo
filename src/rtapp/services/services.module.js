import angular from 'angular'

import AudioCaptureEvent from './audio-capture/audio-capture.event'
import AudioCaptureService from './audio-capture/audio-capture.service'
import ConfigLoaderService from './config-loader/config-loader.service'
import DebugTriggerService from './debug-trigger/debug-trigger.service'
import DialogService from './dialog/dialog.service'
import LanguageService from './language/language.service'
import RealtimeAPIErrorType from './realtime-api/error-type.constant'
import RealtimeAPIEvent from './realtime-api/realtime-api.event'
import RealtimeAPIMessageType from './realtime-api/message-type.constant'
import RealtimeAPIService from './realtime-api/realtime-api.service'
import RealtimeAPIWarningType from './realtime-api/warning-type.constant'
import StringService from './string/string.service'

export default angular
  .module('sm.rtapp.services', [])
  .constant('AudioCaptureEvent', AudioCaptureEvent)
  .constant('RealtimeAPIErrorType', RealtimeAPIErrorType)
  .constant('RealtimeAPIErrorType', RealtimeAPIErrorType)
  .constant('RealtimeAPIEvent', RealtimeAPIEvent)
  .constant('RealtimeAPIMessageType', RealtimeAPIMessageType)
  .constant('RealtimeAPIWarningType', RealtimeAPIWarningType)
  .service('AudioCaptureService', AudioCaptureService)
  .service('ConfigLoaderService', ConfigLoaderService)
  .service('DebugTriggerService', DebugTriggerService)
  .service('DialogService', DialogService)
  .service('LanguageService', LanguageService)
  .service('RealtimeAPIService', RealtimeAPIService)
  .service('StringService', StringService)
