campeonato
    .controller('CompetidoresController',
    ['$scope', 'Competidores', '$stateParams', '$state', 'Listas', '$cookies', '$modal',
        function ($scope, Competidores, $stateParams, $state, Listas, $cookies, $modal) {

            $scope.listaFormatos = Listas.listaFormatosFull;

            $scope.objSexo = Listas.objSexo;

            $scope.listaGraduacoes = Listas.listaGraduacoes;

            $scope.listaImagens = Listas.listaImagens;

            $scope.nascimentoFn = function () {
                $scope.competidor.idade = _calculateAge($scope.competidor.nascimento);
            };

            function _calculateAge(birthday) { // birthday is a date
                if (birthday) {
                    var dataCampeonato = new Date($cookies.getObject("CampeonatoObject").data);
                    var ageDifMs = dataCampeonato - birthday.getTime();
                    var ageDate = new Date(ageDifMs); // miliseconds from epoch
                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                } else {
                    return Math.abs(new Date().getUTCFullYear() - 1970);
                }
            }


            function buildCompetidor($scope) {
                $.getJSON('js/countries.json', function (data) {
                    $scope.paises = data;
                });

                $.getJSON('js/estados.json', function (data) {
                    $scope.estados = data;
                });

                $scope.graduacaoOption = {
                    min: 1,
                    max: 16,
                    step: 1
                };
                $scope.valorGraduacao = 1;


                $scope.paisChangeFn = function () {

                    if ($scope.competidor.pais.code != 'BR') {
                        $scope.competidor.estado = {};
                    }
                };
            }

            $scope.enviarCompetidores = function () {
                $modal.open({
                    templateUrl: "views/modal/upload-competidores.html",
                    controller: function ($scope, competidores) {
                        $scope.cancelarUpload = function () {
                            $scope.$dismiss();
                        };
                        $scope.confirmarUpload = function () {
                            $scope.$close(true);
                        };
                    },
                    resolve: {
                        competidores: function () {
                            return Competidores;
                        }
                    }
                }).result.then(function () {
                        $state.reload();
                    }, function () {

                    });
            };

            $scope.init = function () {

                buildCompetidor($scope);

                $scope.competidor = new Competidores();

                $scope.competidor.nome = "";
                $scope.competidor.academia = "";
                $scope.competidor.pais = {
                    "name": "Brasil",
                    "code": "BR",
                    "continent": "South America",
                    "filename": "brasil"
                };
                $scope.competidor.estado = {"name": "Rio de Janeiro", "code": "RJ"};
                $scope.competidor.idade = 25;
                $scope.competidor.sexo = "m";
                $scope.competidor.graduacao = 1;
                $scope.competidor.peso = 36.6;
                $scope.competidor.formato = 0;
                $scope.competidor.nascimento = new Date(1990, 0, 1);
                $scope.competidor.tipo = 0;

                $scope.addCompetidor = function () {
                    $scope.competidor.$save().then(function () {
                        $state.go('competidores');
                    });
                };
            };

            $scope.initEdit = function () {

                buildCompetidor($scope);
                Competidores.getById($stateParams.id).then(function (competidor) {
                    competidor.nascimento = new Date(competidor.nascimento);
                    $scope.competidor = competidor;
                });

                $scope.editCompetidor = function () {
                    $scope.competidor.$saveOrUpdate().then(function () {
                        $state.go('competidores');
                    });
                };
            };

            $scope.viewInit = function () {
                Competidores.getById($stateParams.id).then(function (competidor) {
                    $scope.competidor = competidor;
                });
            };
            $scope.initList = function () {
                waitingDialog.show();
                $scope.predicate = 'nome';
                $scope.reverse = false;

                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };

                var query = {
                    "tipo": 0
                };

                Competidores.query(query).then(function (competidores) {
                    $scope.competidores = competidores;
                    waitingDialog.hide();
                });

                $scope.open = function (competidor) {
                    $scope.dialogClass = 'open in';
                    $scope.exCompetidor = competidor;
                };

                $scope.delete = function () {
                    waitingDialog.show();
                    $scope.exCompetidor.$remove().then(function () {
                        Competidores.query(query).then(function (competidores) {
                            $scope.dialogClass = '';
                            $scope.competidores = competidores;
                            waitingDialog.hide();
                        });
                    });
                }

            };

            $scope.parseEstado = function (nomeEstado) {
                if (nomeEstado) {
                    return '- ' + nomeEstado + ' /';
                }
                return '';
            };

            $scope.parseGraduacao = function (graduacao) {
                return $scope.listaGraduacoes[graduacao];
            };

            $scope.parseSexo = function (sexo) {
                return $scope.objSexo[sexo];
            }
        }]);