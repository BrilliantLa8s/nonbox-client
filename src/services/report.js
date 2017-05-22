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
