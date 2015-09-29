campeonato
.controller('ControleController', ['$scope', 'Categorias', 'Competidores', '$stateParams', '$state', 'Listas',
    function($scope, Categorias, Competidores, $stateParams, $state, Listas) {

        var quantidadeRounds = Listas.quantidadeRounds;

        var globalRodadas;

        var chaveGlobal = [];

        $scope.listaGraduacoes = Listas.listaGraduacoes;

        $scope.listaImagens = Listas.listaImagens;

        $scope.listaFormatos = Listas.listaFormatos;

        $scope.objSexo = Listas.objSexo;

        $scope.parseSexo = function(sexo) {
            return $scope.objSexo[sexo];
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

        function powerOfTwo(numero) {
            return !(numero == 0) && !(numero & (numero - 1))
        }

        function getQuantidadePartidas(len) {
            if (powerOfTwo(len)) {
                return quantidadeRounds[len];
            } else {
                len++;
                return getQuantidadePartidas(len);
            }
        }

        function criarArvore(categoria) {
            //verifica se possui competidores
            if(categoria.competidores) {
                var nos = [];
                categoria.competidores.forEach(function (competidor) {
                    var comp = angular.copy(competidor);
                    var no = {
                        nome: comp.nome,
                        academia: comp.academia,
                        children: []
                    };
                    nos.push(no);
                });
                //quantidade de nos
                var len = nos.length;
                var rodadas = len;
                //verifico se a chave é perfeita ou pode gerar baias futuras ou iniciais.
                var chavePerfeita = powerOfTwo(len);
                //pego a quantidade de nos, menos 1, e vejo a quantidade de partidas,
                //partidas informa os pulos nos nós.
                var qtdPartidas = getQuantidadePartidas(len);
                //para saber se a quantidade de competidores é par, faço mod de 2.
                //isso vai me dizer se tem um competidor na baia.

                //global para uso fora do algoritmo.
                globalRodadas = rodadas;
                var partidas = [];
                var loopPartidas = 0;

                qtdPartidas = qtdPartidas === 2 ? 3 : qtdPartidas;


                for (var i = 0; i < qtdPartidas; i++) {
                    var partida = [];
                    //partida vencedora.
                    if (i === 0) {
                        partida.push({"nome": "Campeão", "academia": "", "rodadas" : rodadas, "partidas": qtdPartidas, vencedor: false});
                        partidas.push(partida);
                        loopPartidas = 1;
                    } else {
                        loopPartidas = loopPartidas * 2;
                        for (var j = 0; j < loopPartidas; j++) {
                            //ultimo item da qtdPartidas
                            if (i === (qtdPartidas - 1)) {
                                partida.push({"nome": nos[j].nome, "academia": nos[j].academia, vencedor: false});
                            } else {
                                //ainda esta no loop de qtdPartidas
                                partida.push({"nome": "Vencedor " + j, "academia": "", vencedor: false});
                            }
                        }
                        partidas.push(partida);
                    }
                }
                //loop nas partidas, lembrando que é multidimensional;
                for (var a = 0; a < partidas.length; a++) {
                    var loopPai = partidas[a].length;
                    var pais = partidas[a];
                    var idx = 0;
                    for (var b = 0; b < loopPai; b++) {
                        if (partidas[(a + 1)]) {
                            globalRodadas--;
                            var filho1 = partidas[(a + 1)][idx];
                            filho1.rodada = globalRodadas;
                            idx++;
                            filho1.pai = {"nome" : pais[b].nome, "rodada" : pais[b].rodada};
                            var filho2 = partidas[(a + 1)][idx];
                            filho2.rodada = globalRodadas;
                            idx++;
                            filho2.pai = {"nome" : pais[b].nome, "rodada" : pais[b].rodada};
                            pais[b].children = [];
                            pais[b].children.push(filho1);
                            pais[b].children.push(filho2);
                        }
                    }
                }
                //possui baia
                if (!chavePerfeita) {
                    //verificar se foi par o impar a quantidade.
                    //quando par, tenho que criar uma nova chave e impar adiciono somente o competidor.
                    var lenPartidas = partidas.length;
                    var lenUltimaPartida = partidas[(lenPartidas - 1)].length;
                    var difNosLenPartidas = len - lenUltimaPartida;
                    globalRodadas--;
                    //comentei para pensar melhor depois .. para impares o algoritmo tambem funciona, parcialmente.
                    //if(!even) {
                    //par
                    //mais simples e coloca as baias na proxima luta.
                    nos.reverse();
                    for (var z = 0; z < difNosLenPartidas; z++) {
                        var nomeOriginal = partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].nome;
                        var academiaOriginal = partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].academia;

                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].nome = "Vencedor";
                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].academia = "";

                        var filhoMovido = {"nome": nomeOriginal, "academia": academiaOriginal, "rodada" : globalRodadas, vencedor: false};
                        var filhoNovo = {"nome": nos[z].nome, "academia": nos[z].academia, "rodada" : globalRodadas, vencedor: false};

                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children = [];
                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoMovido);
                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoNovo);

                        globalRodadas--;

                    }
                    //}
                }
                categoria.arvore = partidas[0][0];
                categoria.chaves = [];

            }
        }

        function criarChave(categoria) {
            chaveGlobal = [];
            //crio a chave final.
            //id da chave é a rodada dela.
            var chave = {};
            chave.rodada = categoria.arvore.rodada;
            chave.final = true;
            chave.vencedor = false;
            chave.competidor1 = {"nome": "Campeão"};
            chaveGlobal.push(chave);
            criarChavesRecus(categoria.arvore.children);
        }

        function criarChavesRecus(children) {
            if(children) {

                var chave = {};
                chave.rodada = children[0].rodada;
                chave.final = false;
                chave.vencedor = false;
                chave.competidor1 = {
                    "nome": children[0].nome,
                    "pontuacao": 0,
                    "vencedor": false
                };
                chave.competidor2 = {
                    "nome": children[1].nome,
                    "pontuacao": 0,
                    "vencedor": false
                };
                chaveGlobal.push(chave);

                criarChavesRecus(children[0].children);
                criarChavesRecus(children[1].children);
            }
        }

        function initQuery(){
            Categorias.all({ sort: {ativa: -1} }).then(function(categorias){
                $scope.categorias = categorias;
                categorias.forEach(function(categoria){
                    if(categoria.ativa) {
                        $scope.categoriaAtiva = categoria;

                        //if(!$scope.categoriaAtiva.chaves || $scope.categoriaAtiva.chaves.length === 0) {
                            criarChave($scope.categoriaAtiva);
                            $scope.categoriaAtiva.chaves = [];
                            $scope.categoriaAtiva.chaves = chaveGlobal;
                        //}

                    }
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
                        categoria.quantidadeCompetidores = competidores.length;
                    });
                });
            });
        }

        var recursiveNode = [];
        function atualizarArvore(chave) {
            recursiveNode = [];
            localizarNo($scope.categoriaAtiva.arvore, chave.rodada);
            console.log(recursiveNode);
        }

        function localizarNo(no, rodada) {

            if(no.rodada !== undefined && no.rodada === rodada) {
                recursiveNode.push(no);
            } else {
                if(angular.isArray(no)) {
                    for (var i = 0; i < no.length; i++) {
                        localizarNo(no[i], rodada);
                    }
                } else {
                    if(no.children) {
                        localizarNo(no.children, rodada);
                    }
                }
            }
        }

        $scope.initControle = function(){

            initQuery();

            $scope.filtroChave = function(chave){
                return !chave.final;
            };

            $scope.playCategoria = function(categoria) {

                categoria.ativa = true;
                categoria.atualizacao = Date.now();
                //verifica se possui chave
                //if(!categoria.arvore || !categoria.arvore.children) {
                    criarArvore(categoria);
                //}
                categoria.$saveOrUpdate().then(function (){
                    if($scope.categoriaAtiva) {
                        $scope.categoriaAtiva.ativa = false;
                        $scope.categoriaAtiva.$saveOrUpdate().then(function (){
                        });
                    }
                    initQuery();
                    $state.go('controle');
                });

            };

            $scope.stopCategoria = function(categoria) {
                categoria.ativa = false;
                categoria.$saveOrUpdate().then(function (){
                    $state.go('controle');
                });
            };

            $scope.open = function(chave) {
                $scope.dialogClass = 'open';

                chave.competidorVencedor = 0;

                if(chave.competidor1.vencedor) {
                    chave.competidorVencedor = 1
                }
                if(chave.competidor2.vencedor) {
                    chave.competidorVencedor = 2;
                }

                $scope.chave = angular.copy(chave);

            };

            $scope.cancelar = function(){
                $scope.dialogClass = 'close'
            };

            $scope.salvarChave = function(chave) {

                atualizarArvore(chave);

                $scope.dialogClass = 'close'
            };

        };

    }]);
