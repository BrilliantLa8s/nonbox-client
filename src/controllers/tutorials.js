nClient.controller('TutorialsCtrl', function($scope, Tutorials){
  $scope.showMode = false;

  // for mobile app view enter
  $scope.$on('$ionicView.enter', function(e) {
    getTutorials();
  });

  getTutorials();

  function getTutorials(){
    Tutorials.then(function(tutorials){
      $scope.tutorials = tutorials;
    });
    $scope.show = function(tutorial){
      $scope.showMode = true;
      $scope.tutorial = tutorial;
    }
  }
})
