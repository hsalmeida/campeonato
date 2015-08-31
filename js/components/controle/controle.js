campeonato
.controller('ControleController', ['$scope', 'Categorias', 'Competidores', '$stateParams', '$state',
    function($scope, Categorias, Competidores, $stateParams, $state) {
        var query = {
            "graduacao" : {
                "$gte" : 5,
                "$lte" : 8
            },
            "idade" : {
                "$gte" : 17,
                "$lte" : 34
            },
            "peso" : {
                "$gte" : 50,
                "$lte" : 83
            },
            "formato" : {
                "$in" : [0, 2]
            }
        };
        Competidores.query(query).then(function(competidores){
            robin();
            $scope.competidores = competidores;
        });
    }]);
