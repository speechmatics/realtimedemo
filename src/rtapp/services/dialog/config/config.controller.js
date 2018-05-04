import './config.style.scss'

export default class ConfigDialogController {
  /* @ngInject */
  constructor ($scope, $mdDialog, config) {
    $scope.fieldsets = {
      app: {
        debug: {
          label: 'Debug (show application state)',
          type: 'checkbox'
        },
        listen: {
          label: 'Listen (use headphones!)',
          type: 'checkbox'
        }
      },
      api: {
        host: {
          label: 'API Host (Port)',
          type: 'text'
        },
        user_id: {
          label: 'User ID',
          type: 'number'
        },
        auth_token: {
          label: 'Token',
          type: 'text'
        }
      }
    }
    $scope.config = config
    $scope.save = function () {
      $mdDialog.hide($scope.config)
    }
    $scope.cancel = function () {
      $mdDialog.cancel()
    }
  }
}
