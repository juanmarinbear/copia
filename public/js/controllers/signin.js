angular.module('app')
.controller('SignInController', ["$scope", '$location', 'Sanitizer',
  
  function($scope, $location, Sanitizer){

  
    $scope.signIn = function(){
      var credentials = {
        username: $scope.email,
        password: $scope.password
      };
      credentials = Sanitizer.sanitize(credentials);
    };

    $scope.splashPage = function(){
      $location.path( "/" );
    };

}]);