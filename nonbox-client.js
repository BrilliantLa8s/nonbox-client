(function() {'use strict'

angular.module('nonbox-client', ['ui.router']);

var nClient = angular.module('nonbox-client');

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

nClient.controller('DeviceCtrl', function($scope, $rootScope, Nonbox, Wifi) {
  $scope.assigned = {total: 10, remaining: 2, devices:[{}]}
  // check if nonbox is connected
  $scope.check = function(){
    Nonbox.check().then(function(status){
      $rootScope.nbConnected = status;
    }).catch(function(status){
      $rootScope.nbConnected = status;
    });
    Wifi.status();
  }
  $scope.check();
});

nClient.controller('ReportsCtrl', function($state, $scope, Report){
  $scope.message = {}

  $scope.submit = function(body){
    Report.submit(body, $state.current.name).then(function(resp){
      if(resp.status == 200){
        $scope.message = {
          text:"Thanks! We'll take a look.",
          icon:'check',
          color:'green'
        }
      } else {
        $scope.message = {
          text:'Error submitting. Check internet connection.',
          color:'red'
        }
      }
    }).catch(function(err){
      $scope.message = {
        text:'Error submitting. Check internet connection.',
        color:'red'
      }
    });
    $scope.$apply;
  }
})

nClient.service('Tutorials', function(){
  return [
    {
      title: 'Test Tutorial One',
      description: 'Test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description',
      icon: 'key',
      steps: [
        {
          order:1,
          text:'First you have to do this',
          image: ''
        },
        {
          order:2,
          text:'Then you have to do that',
          image:''
        },
        {
          order:3,
          text:'And there you have it folks. Power on and rock the house',
          image:''
        }
      ]
    },
    {
      title: 'Test Tutorial Two',
      description: 'Test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description',
      icon: 'lamp',
      steps: [
        {
          order:1,
          text:'First you have to do this',
          image: ''
        },
        {
          order:2,
          text:'Then you have to do that',
          image:''
        },
        {
          order:3,
          text:'And there you have it folks. Power on and rock the house',
          image:''
        }
      ]
    },
    {
      title: 'Test Tutorial Three',
      description: 'Test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description',
      icon: 'tools',
      steps: [
        {
          order:1,
          text:'First you have to do this',
          image: ''
        },
        {
          order:2,
          text:'Then you have to do that',
          image:''
        },
        {
          order:3,
          text:'And there you have it folks. Power on and rock the house',
          image:''
        }
      ]
    },
    {
      title: 'Test Tutorial Four',
      description: 'Test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description test turial one description',
      icon: 'cog',
      steps: [
        {
          order:1,
          text:'First you have to do this',
          image: ''
        },
        {
          order:2,
          text:'Then you have to do that',
          image:''
        },
        {
          order:3,
          text:'And there you have it folks. Power on and rock the house',
          image:'cog'
        }
      ]
    }
  ]
});

nClient.controller('WifiCtrl', function($scope, $state, Nonbox, Wifi) {
  $scope.connectSecure = false;
  $scope.currentAp = {};
  $scope.networks = [];
  $scope.error = '';
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
        $scope.connecting = true;
      });
      $state.reload();
    } else {
      passwordDialog().showModal();
    }
  }
  $scope.secureConnect = function(ap){
    Wifi.connect(ap).then(function(resp){
      passwordDialog().close();
      $scope.connecting = true;
      delete $scope.currentAp.password;
    });
  }
  $scope.cancelConnect = function(el){
    passwordDialog().close();
  }
  $scope.disconnect = function(){
    Wifi.disconnect().then(function(resp){
      scan();
    });
  }
  $scope.reset = function(){
    Wifi.reset().then(function(resp){
      scan();
    });
  }

  function passwordDialog(){
    return document.getElementById('passwordDialog');
  }

  function scan(){
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
  }
  scan();
});

nClient.service('Nonbox', function($rootScope, $http){
  return {
    check: function(){
      return $http.get($rootScope.nbServer).then(function(resp){
        if(resp.status === 200 && resp.data === 'nonbox server'){
          return true;
        } else { return false; }
      }).catch(function(err){
        return false;
      });
    },
    info: function(){
      return $http.post($rootScope.nbServer+'info')
      .then(function(resp){
        return resp;
      }).catch(function(err){
        return err;
      });
    }
  }
})

nClient.service('Report', function($rootScope, $http){
  return {
    submit: function(body, path){
      return $http.post($rootScope.nbApi+'report/'+path, body)
      .then(function(resp){ return resp;}, function (err) {
        return err;
      }).catch(function(err){
        return err;
      });
    }
  }
})

nClient.service('Wifi', function($rootScope, $http){
  return {
    scan: function(){
      return $http.get($rootScope.nbServer+'scan').then(function(resp){
        return resp;
      }).catch(function(err){
        return err;
      });
    },
    connect: function(ap){
      return $http.post($rootScope.nbServer+'connect', {ap:ap})
      .then(function(resp){
        return resp;
      }).catch(function(err){
        return err;
      });
    },
    status: function(){
      return $http.get($rootScope.nbServer+'status').then(function(resp){
        $rootScope.online = resp.data.success;
        return resp.data;
      }).catch(function(err){
        $rootScope.online = false;
        return err;
      });
    },
    disconnect: function(){
      return $http.delete($rootScope.nbServer+'disconnect').then(function(resp){
        $rootScope.online = false;
        return resp;
      }).catch(function(err){
        return err;
      });
    },
    reset: function(){
      return $http.delete($rootScope.nbServer+'reset').then(function(resp){
        $rootScope.online = resp.data.success;
        return resp.data;
      }).catch(function(err){
        $rootScope.online = false;
        return err;
      });
    }
  }
})

})();