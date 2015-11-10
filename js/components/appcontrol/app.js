campeonato
    .controller('AppController',['$scope', 'App', '$rootScope', 'Users', '$cookies',
        function($scope, App, $rootScope, Users, $cookies){
        $scope.init = function(){
            var nomeCampeonato = $cookies.get('nomeCampeonatoKey');
            var query = {
              "nome" : nomeCampeonato ? nomeCampeonato : "Campeonato Teste"
            };

            App.query(query).then(function(campeonato){
                $scope.campeonato = campeonato[0];
            });
        };
    }]);