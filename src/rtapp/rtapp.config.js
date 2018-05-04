/* @ngInject */
export default ($analyticsProvider, $mdThemingProvider) => {
  $mdThemingProvider.definePalette('speechmatics-navy', {
    '50': 'e0e4e7',
    '100': 'b3bac4',
    '200': '808d9d',
    '300': '4d5f76',
    '400': '263c58',
    '500': '001a3b',
    '600': '001735',
    '700': '00132d',
    '800': '000f26',
    '900': '000819',
    A100: '5871ff',
    A200: '2546ff',
    A400: '0025f1',
    A700: '0021d7',
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200'],
    contrastLightColors: [
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'A100',
      'A200',
      'A400',
      'A700'
    ]
  })

  $mdThemingProvider.definePalette('speechmatics-cambridge', {
    '50': 'f2f8f7',
    '100': 'deedeb',
    '200': 'c9e2de',
    '300': 'b3d6d1',
    '400': 'a2cdc7',
    '500': '92c4bd',
    '600': '8abeb7',
    '700': '7fb6ae',
    '800': '75afa6',
    '900': '63a298',
    A100: 'ffffff',
    A200: '92c4bd',
    A400: 'a9e2da',
    A700: 'abe8e0',
    contrastDefaultColor: 'light',
    contrastDarkColors: [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'A100',
      'A200',
      'A400',
      'A700'
    ],
    contrastLightColors: []
  })

  $mdThemingProvider.definePalette('speechmatics-storm', {
    '50': 'fbfbfb',
    '100': 'f0f0f0',
    '200': 'd9d9d9',
    '300': 'b4b3b3',
    '400': '898989',
    '500': '575756',
    '600': '454545',
    '700': '363636',
    '800': '2d2d2d',
    '900': '242423',
    A100: 'ffffff',
    A200: '000000',
    A400: '303030',
    A700: '616161',
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', 'A100', 'A200'],
    contrastLightColors: [
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'A400',
      'A700'
    ]
  })

  $mdThemingProvider
    .theme('default')
    .primaryPalette('speechmatics-navy')
    .accentPalette('speechmatics-cambridge')
    .warnPalette('red')
    .backgroundPalette('speechmatics-storm')

  $analyticsProvider.firstPageview(true)
  $analyticsProvider.withAutoBase(true)
}
