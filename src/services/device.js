nClient.service('Nonbox', function($rootScope, $http){
  return {
    check: function(){
      return $http.get($rootScope.nbServer, { timeout:7000 })
      .then(function(resp){
        if(resp.status === 200 && resp.data === 'nonbox server'){
          return true;
        } else { return false; }
      }).catch(function(err){
        return false;
      });
    },
    info: function(){
      return $http.get($rootScope.nbServer+'info')
      .then(function(resp){
        if(resp.status === 200) return resp.data;
        return;
      }).catch(function(err){
        return err;
      });
    },
    removeDevice: function(device){
      return $http.post($rootScope.nbServer+'device', device)
      .then(function(resp){
        console.log(resp)
        if(resp.status === 200) return resp.data;
        return;
      }).catch(function(err){
        return err;
      });
    }
  }
})
