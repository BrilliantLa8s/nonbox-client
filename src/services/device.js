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
