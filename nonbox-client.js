(function() {'use strict'

angular.module('nonbox-client', ['ui.router']);

var nClient = angular.module('nonbox-client');

nClient.run(function($rootScope){
  // assume nonbox isn't connected until known otherwise
  $rootScope.nbConnected = false;

  // nonbox router and api endpoints
  $rootScope.nbServer = 'http://192.168.42.1:8080/'
  $rootScope.nbApi    = 'https://nonbox.co/'

  $rootScope.$on('loading:start', function (){
    $rootScope.isLoading = true;
  });
  $rootScope.$on('loading:finish', function (){
    $rootScope.isLoading = false;
  });
})

nClient.config(function($sceProvider, $httpProvider){
  // prevent caching on $http responses
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {
      'Cache-Control':'no-cache',
      'Pragma':'no-cache'
    };
  };
  $sceProvider.enabled(false);
  // Inject auth token into the headers of each request
  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:start');
        return config || $q.when(config);
      },
      response: function (response) {
        $rootScope.$broadcast('loading:finish');
        return response || $q.when(response);
      },
      responseError: function(response) {
        $rootScope.$broadcast('loading:finish');
        return $q.reject(response);
      }
    };
  });
});

nClient.config(function($locationProvider, $stateProvider, $urlRouterProvider){
  $stateProvider
  .state('device', {
    url:'/',
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
    console.log(popup)
    if(popup != null){
      if(action === 'open' ) popup.showModal();
      if(action === 'close') popup.close();
      console.log('here')
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

nClient.service('Wifi', function($rootScope, $http){
  return {
    scan: function(){
      return $http.get($rootScope.nbServer+'scan',
        { timeout:5000 }
      ).then(function(resp){
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
      return $http.get($rootScope.nbServer+'status',
        { timeout:5000 }
      ).then(function(resp){
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
      return $http.delete($rootScope.nbServer+'reset',
        { timeout:7000 }
      ).then(function(resp){
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