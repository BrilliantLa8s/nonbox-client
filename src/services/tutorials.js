nClient.service('Tutorials', function($http, $rootScope){
  return $http.get($rootScope.nbApi+'tutorials').then(function(resp){
    console.log(resp)
    if(resp.status === 200) return resp.data;
    return resp.data;
  }).catch(function(err){
    return;
  });
});
