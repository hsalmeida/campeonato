campeonato
.controller('ControleController', ['$scope', 'Categorias', 'Competidores', '$stateParams', '$state',
    function($scope, Categorias, Competidores, $stateParams, $state) {

        $scope.initControle = function(){
            Categorias.all().then(function(categorias){
                categorias.forEach(function( categoria ){
                    var query = {
                        "graduacao" : {
                            "$gte" : categoria.graduacao[0],
                            "$lte" : categoria.graduacao[1]
                        },
                        "idade" : {
                            "$gte" : categoria.idade[0],
                            "$lte" : categoria.idade[1]
                        },
                        "peso" : {
                            "$gte" : categoria.peso[0],
                            "$lte" : categoria.peso[1]
                        },
                        "formato" : {
                            "$in" : [categoria.formato, 2]
                        }
                    };
                    Competidores.query(query).then(function(competidores){
                        categoria.competidores = competidores;
                    });
                });
                $scope.categorias = categorias;
            });

            Competidores.all().then(function(competidores){
                $scope.competidores = competidores;

                var arr = angular.copy(competidores);

                var comp = [];

                var prime = arr.length % 2;

                while(arr.length) {
                    comp.push(arr.shift());
                    comp.push(arr.pop());
                }

                if(prime) {
                    comp.pop();
                }

                $scope.comp = comp;

                var data = {};

                var teams = [];

                var nomes = angular.copy(comp);

                while(nomes.length) {
                    var array = [];
                    var nome1 = nomes.shift();
                    if(nome1) {
                        array.push(nome1.nome);
                    }
                    var nome2 = nomes.shift()
                    if(nome2) {
                        array.push(nome2.nome);
                    }

                    teams.push(array);
                }

                data.teams = teams;

                $("#chaves").bracket({
                    init: data,
                    skipConsolationRound : true
                })

            });
        };

    }]);
