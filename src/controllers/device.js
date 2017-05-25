nClient.controller('DeviceCtrl', function($scope, $rootScope, Nonbox, Wifi) {
  $scope.assigned = {total: 10, remaining: 2, devices:[{}]}
  // check if nonbox is connected
  $scope.check = function(){
    Nonbox.check().then(function(status){
      $rootScope.nbConnected = status;
    }).catch(function(status){
      $rootScope.nbConnected = status;
    }).finally(function(){
      Wifi.status();
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.check();
});
