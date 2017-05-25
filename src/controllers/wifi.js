nClient.controller('WifiCtrl', function($injector, $scope, $state, $timeout, Nonbox, Wifi) {
  $scope.connectSecure = false;
  $scope.currentAp = {};
  $scope.networks  = [];
  $scope.error  = '';
  $scope.status = '';

  // color strength based on signal
  $scope.colorStrength = function(value){
    var strength;
    if(value > 80){
      strength = value * .01;
    } else {
      strength = (value - 15) * .01;
    }
    return 'rgba(253,188,64,'+ strength +')';
  }
  $scope.connect = function(ap){
    $scope.currentAp = ap;
    if(!ap.security){
      Wifi.connect(ap).then(function(resp){
      });
      $scope.scan();
    } else {
      passwordDialog('open');
    }
  }
  $scope.secureConnect = function(ap){
    passwordDialog('close');
    Wifi.connect(ap).then(function(resp){
      delete $scope.currentAp.password;
      console.log(resp.status)
      if(resp.status === 500){
        passwordDialog('open');
      } else {
        $scope.scan();
      }
    });
  }
  $scope.cancelConnect = function(el){
    passwordDialog('close');
  }
  $scope.disconnect = function(){
    Wifi.disconnect().then(function(resp){
      $scope.scan();
    });
  }
  // avoid the reset function for now
  $scope.reset = function(){
    Wifi.reset().then(function(resp){
      $scope.scan()
    });
  }

  $scope.scan = function(){
    Wifi.status().then(function(resp){
      if(resp.success == true){
        $scope.current = resp;
      } else {
        $scope.current = {ssid:false};
      }
    });
    Wifi.scan().then(function(resp){
      if(resp.data && resp.data.success == true) {
        $scope.networks = resp.data.networks.filter(function(network){
          return network.ssid !== 'nonbox';
        });
      } else if(resp.data) {
        $scope.error = resp.data.msg;
      } else {
        // $state.go('device');
      }
    }).catch(function(err){ $state.go('device');})
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  function passwordDialog(action){
    var popup = document.getElementById('passwordDialog');
    if(popup != null){
      if(action === 'open' ) popup.showModal();
      if(action === 'close') popup.close();
    } else {
      if(action === 'close'){
        return
      } else {
        $injector.get('$ionicPopup').show({
          template: '<input type="password" ng-model="currentAp.password">',
          title: 'Connect to '+$scope.currentAp.ssid,
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: 'Connect',
              type: 'button-dark',
              onTap: function(e) {
                if (!$scope.currentAp.password) {
                  e.preventDefault();
                } else {
                  $scope.secureConnect($scope.currentAp);
                }
              }
            }
          ]
        });
      }
    }
  }

  $scope.$on('$ionicView.enter', function() {
    $scope.scan();
  });

  $scope.scan();
});
