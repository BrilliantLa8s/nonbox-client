nClient.config(function($locationProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', '*://nonbox.co/**', '*://192.168.42.1:8080/**'
  ]);
  $stateProvider
  .state('devices', {
    url:'/',
    templateUrl: templateDir+'/devices.html',
    controller: 'DevicesCtrl'
  })
  .state('device', {
    url:'/device/:serial',
    templateUrl: templateDir+'/device.html',
    controller: 'DeviceCtrl'
  })
  .state('networks', {
    url:'/networks',
    templateUrl: templateDir+'/networks.html',
    controller: 'WifiCtrl'
  })
  .state('quickstart', {
    url:'/quickstart',
    templateUrl: templateDir+'/quickstart.html'
  })
  .state('tutorials', {
    url:'/tutorials',
    templateUrl: templateDir+'/tutorials.html',
    controller: 'TutorialsCtrl'
  })
  .state('support', {
    url:'/support',
    templateUrl: templateDir+'/support.html'
  })
  .state('bugs', {
    url:'/bugs',
    templateUrl: templateDir+'/bugreport.html',
    controller: 'ReportsCtrl'
  })
  .state('suggestions', {
    url:'/suggestions',
    templateUrl: templateDir+'/suggestion.html',
    controller: 'ReportsCtrl'
  })
  .state('pr', {
    url:'/pr',
    templateUrl: templateDir+'/pr.html'
  });
  // catchall route
  $urlRouterProvider.otherwise('/');
});
