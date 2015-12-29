campeonato.directive('header', function(){
   return {
       restrict : 'A',
       replace: true,
       templateUrl: 'views/directives/header.html',
       controller : ['$scope', '$filter', function($scope, $filter){

       }]
   }
});