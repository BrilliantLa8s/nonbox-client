nClient.controller('DeviceCtrl', function($scope, $rootScope, Nonbox, Wifi, $stateParams) {
  console.log($stateParams.serial)
  // check if nonbox is connected
  $scope.check = function(){
    Nonbox.check().then(function(connected){
      $rootScope.nbConnected = connected;
      if(connected) {
        Nonbox.info().then(function(info){
          $scope.info = info;
          Wifi.status();
        });
      } else {
        $scope.$broadcast('nonbox.notfound');
      }
    }).catch(function(status){
      $rootScope.nbConnected = status;
      $scope.$broadcast('nonbox.notfound');
    }).finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  // kick device of nonbox network
  $scope.removeDevice = function(device, idx){
    $scope.$broadcast('device:remove');
    Nonbox.removeDevice(device).then(function(removed){
      if(removed) {
        $scope.info.devices.splice(idx, 1);
        $scope.$broadcast('device:removed');
      }
    })
  }
  $scope.check();
});
