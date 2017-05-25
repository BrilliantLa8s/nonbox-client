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
