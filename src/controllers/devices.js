nClient.controller('DevicesCtrl', function($scope, $window, $rootScope, Device, $injector){
  $scope.devices = [];
  $scope.device  = {};
  var confirmRemove;

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
    confirmRemove = $injector.get('$ionicPopup').confirm({
      title: 'Remove Device',
      template: 'Are you sure you want to remove this device?',
      cancelText: 'Cancel',
      cancelType: 'button-default',
      okText: 'Remove',
      okType: 'button-assertive'
    });
    confirmRemove.then(function(res) {
      if(res) {
        Device.remove(device);
        listDevices();
      } else {
        // dont remove
      }
    });
  };

  $scope.saveDevice = function(device) {
    Device.findOrCreate(device).then(function(resp){
      listDevices();
      $scope.modal.hide();
    })
	};

  $scope.setCurrent = function(device) {
    Device.setCurrent(device).then(function(resp){
      console.log(JSON.stringify(resp))
    })
  }

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

  listDevices();
})
