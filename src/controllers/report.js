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
