app.controller('NetworksCtrl', function($scope, $state, Nonbox, Wifi) {
  $scope.connectSecure = false;
  $scope.currentAp = {};
  $scope.networks = [];
  $scope.error = '';
  $scope.status = '';

// function initWifi(){
  const passwordDialog = document.getElementById('passwordDialog');

  // get current connectivity status
  Wifi.status().then(function(resp){
    if(resp.success == true){
      $scope.current = resp;
    } else {
      $scope.current = {ssid:false};
    }
  });
  // scan/return networks except 'non' ssid
  Wifi.scan().then(function(resp){
    // console.log(resp)
    if(resp.data && resp.data.success == true) {
      $scope.networks = resp.data.networks.filter(function(network){
        return network.ssid !== 'non';
      });
    } else if(resp.data) {
      $scope.error = resp.data.msg;
    } else {
      $state.go('device');
    }
  }).catch(function(err){ $state.go('device'); });

  $scope.connect = function(ap){
    $scope.currentAp = ap;
    if(!ap.security){
      Wifi.connect(ap).then(function(resp){
        $scope.connecting = true;
      });
    } else {
      passwordDialog.showModal();
    }
  }
  $scope.secureConnect = function(ap){
    Wifi.connect(ap).then(function(resp){
      passwordDialog.close();
      $scope.connecting = true;
      delete $scope.currentAp.password;
    });
  }
  $scope.cancelConnect = function(el){
    passwordDialog.close();
  }
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
});
