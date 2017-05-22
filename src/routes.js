nClient.config(function($locationProvider, $stateProvider, $urlRouterProvider){
  $stateProvider
  .state('device', {
    url:'/',
    templateUrl: 'app/views/device.html',
    controller: 'DeviceCtrl'
  })
  .state('networks', {
    url:'/networks',
    templateUrl: 'app/views/networks.html',
    controller: 'WifiCtrl'
  })
  .state('quickstart', {
    url:'/quickstart',
    templateUrl: 'app/views/quickstart.html'
  })
  .state('tutorials', {
    url:'/tutorials',
    templateUrl: 'app/views/tutorials.html',
    controller: function($scope, Tutorials){
      $scope.showMode = false;
      $scope.tutorials = Tutorials;
      $scope.show = function(tutorial){
        $scope.showMode = true;
        $scope.tutorial = tutorial;
      }
    }
  })
  .state('support', {
    url:'/support',
    templateUrl: 'app/views/support.html'
  })
  .state('bugs', {
    url:'/bugs',
    templateUrl: 'app/views/bugreport.html',
    controller: 'ReportsCtrl'
  })
  .state('suggestions', {
    url:'/suggestions',
    templateUrl: 'app/views/suggestion.html',
    controller: 'ReportsCtrl'
  })
  .state('pr', {
    url:'/pr',
    templateUrl: 'app/views/pr.html'
  });
  // catchall route
  $urlRouterProvider.otherwise('/');
});
