nClient.controller('DevicesCtrl', function($scope, $window, $rootScope, Device, $injector){
  $scope.devices = [];
  $scope.device  = {};

  $scope.preventSpace = function(e) {
    if(e.keyCode === 32) e.preventDefault();
  }
  // for mobile
  $scope.$on('$ionicView.enter', function(e) {
    $injector.get('$ionicModal').fromTemplateUrl('templates/serial.html', {
  		scope: $scope
  	}).then(function(modal) {
  		$scope.modal = modal;
  	});
    listDevices();
  });

  $scope.removeDevice = function(device) {
    Device.remove(device);
    listDevices();
  };

  $scope.saveDevice = function(device) {
    Device.findOrCreate(device).then(function(resp){
      listDevices();
      $scope.modal.hide();
    })
	};

  $scope.listDevices = function(){
    listDevices()
  }

  function listDevices(){
    Device.all().then(function(devices){
      $scope.devices = devices;
    }).finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
})
