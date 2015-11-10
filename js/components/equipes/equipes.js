campeonato
    .controller('EquipesController',
        ['$scope', 'Equipes', 'Competidores', '$stateParams', '$state', 'Listas',
            function($scope, Equipes, Competidores, $stateParams, $state, Listas){

            $scope.listaFormatos = Listas.listaFormatosFull;

            $scope.objSexo = Listas.objSexo;

            $scope.listaGraduacoes = Listas.listaGraduacoes;

            $scope.listaImagens = Listas.listaImagens;

            $scope.nascimentoFn = function() {
                var idade = _calculateAge($scope.competidor.nascimento);
                if(idade) {
                    $scope.competidor.idade = idade;
                }
            };

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

                $scope.paisChangeFn = function() {
                    if($scope.equipe.pais.code != 'BR') {
                        $scope.equipe.estado = {};
                    }
                };
                $scope.closeAddCompetidor = function(){
                    $scope.dialogAddClass = 'close';
                };
                $scope.openAddCompetidor = function(equipe) {
                    console.log('open');
                    var array = [];
                    if(equipe && equipe.competidores) {
                        equipe.competidores.forEach(function(competidor){
                            array.push(competidor.nome);
                        });
                    }
                    var notIn = {
                        "nome" : {
                            "$nin" : array
                        }
                    };
                    Competidores.query(notIn).then(function(competidores) {
                        $scope.competidoresExtras = competidores;
                    });

                    $scope.dialogAddClass = 'open in';
                }
            }

            $scope.init = function() {

                buildCompetidor($scope);

                $scope.equipe = new Equipes();

                $scope.equipe.nome = "";
                $scope.equipe.academia = "";
                $scope.equipe.sexo = "m";
                $scope.equipe.graduacao = 1;
                $scope.equipe.formato = 0;
                $scope.equipe.tipo = 1;

                $scope.addCompetidor = function (){
                    $scope.equipe.$save().then(function (){
                        $state.go('competidores');
                    });
                };

            };

            $scope.initEdit = function(){

                buildCompetidor($scope);
                Competidores.getById($stateParams.id).then(function(equipe){
                    $scope.equipe = equipe;
                });

                $scope.editCompetidor = function (){
                    $scope.equipe.$saveOrUpdate().then(function(){
                        $state.go('competidores');
                    });
                };
            };

            $scope.viewInit = function(){
                Equipes.getById($stateParams.id).then(function(equipe){
                    $scope.equipe = equipe;
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

                $scope.open = function(equipe) {
                    $scope.dialogClass = 'open in';
                    $scope.exEquipe = equipe;
                };

                $scope.delete = function() {
                    $scope.exEquipe.$remove().then(function(){
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