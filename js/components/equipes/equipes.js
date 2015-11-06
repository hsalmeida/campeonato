campeonato
    .controller('EquipesController',
        ['$scope', 'Equipes', '$stateParams', '$state', 'Listas', function($scope, Equipes, $stateParams, $state, Listas){

            $scope.listaFormatos = Listas.listaFormatosFull;

            $scope.objSexo = Listas.objSexo;

            $scope.listaGraduacoes = Listas.listaGraduacoes;

            $scope.listaImagens = Listas.listaImagens;

            $scope.nascimentoFn = function() {
                var idade = _calculateAge($scope.competidor.nascimento);
                if(idade) {
                    $scope.competidor.idade = idade;
                }
            }

            function _calculateAge(birthday) { // birthday is a date
                var ageDifMs = new Date(2015, 10, 7) - birthday.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            }


            function buildCompetidor($scope){
                $.getJSON('js/countries.json', function( data ){
                    $scope.paises = data;
                });

                $.getJSON('js/estados.json', function( data ){
                    $scope.estados = data;
                });

                $scope.graduacaoOption = {
                    min: 1,
                    max: 16,
                    step: 1
                };
                $scope.valorGraduacao = 1;


                $scope.paisChangeFn = function() {

                    if($scope.competidor.pais.code != 'BR') {
                        $scope.competidor.estado = {};
                    }
                };
            }

            $scope.init = function() {

                buildCompetidor($scope);

                $scope.competidor = new Competidores();

                $scope.competidor.nome = "";
                $scope.competidor.academia = "";
                $scope.competidor.sexo = "m";
                $scope.competidor.graduacao = 1;
                $scope.competidor.formato = 0;
                $scope.competidor.tipo = 1;

                $scope.addCompetidor = function (){
                    $scope.competidor.$save().then(function (){
                        $state.go('competidores');
                    });
                };
            };

            $scope.initEdit = function(){

                buildCompetidor($scope);
                Competidores.getById($stateParams.id).then(function(competidor){
                    $scope.competidor = competidor;
                });

                $scope.editCompetidor = function (){
                    $scope.competidor.$saveOrUpdate().then(function(){
                        $state.go('competidores');
                    });
                };
            };

            $scope.viewInit = function(){
                Competidores.getById($stateParams.id).then(function(competidor){
                    $scope.competidor = competidor;
                });
            };
            $scope.initList = function(){

                $scope.predicate = 'nome';
                $scope.reverse = false;

                $scope.order = function(predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };

                var query = {
                    "tipo" : 1
                };

                Equipes.query(query).then(function(equipes){
                    $scope.equipes = equipes;
                });

                $scope.open = function(competidor) {
                    $scope.dialogClass = 'open';
                    $scope.exCompetidor = competidor;
                };

                $scope.delete = function() {
                    $scope.exCompetidor.$remove().then(function(){
                        Competidores.query(query).then(function(equipes){
                            $scope.dialogClass = 'close';
                            $scope.equipes = equipes;
                        });
                    });
                }

            };

            $scope.parseEstado = function(nomeEstado){
                if(nomeEstado) {
                    return '- ' + nomeEstado + ' /';
                }
                return '';
            };

            $scope.parseGraduacao = function(graduacao) {
                return $scope.listaGraduacoes[ graduacao ];
            };

            $scope.parseSexo = function(sexo) {
                return $scope.objSexo[sexo];
            }
        }]);