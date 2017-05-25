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
