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

                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].nome = "Vencedor " + z;
                        partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].academia = "";

                        var filhoMovido = {
                            "nome": nomeOriginal,
                            "academia": academiaOriginal,
                            "rodada" : globalRodadas,
                            vencedor: false,
                            "pai" : {
                                "nome" : partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].nome,
                                "rodada" : partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].rodada
                            }
                        };
                        //filho1.pai = {"nome" : pais[b].nome, "rodada" : pais[b].rodada};

                        var filhoNovo = {
                            "nome": nos[z].nome,
                            "academia": nos[z].academia,
                            "rodada": globalRodadas,
                            vencedor: false,
                            "pai": {
                                "nome": partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].nome,
                                "rodada": partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].rodada
                            }
                        };

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

        function buscaVencedor(children) {
            for(var i = 0; i < children.length; i++) {
                if(children[i].vencedor) {
                    return true;
                }
            }
            return false;
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
                chave.vencedor = buscaVencedor(children);
                chave.competidor1 = {
                    "nome": children[0].nome,
                    "pontuacao": children[0].pontuacao ? children[0].pontuacao : 0,
                    "vencedor": children[0].vencedor ? children[0].vencedor : false
                };
                chave.competidor2 = {
                    "nome": children[1].nome,
                    "pontuacao": children[1].pontuacao ? children[1].pontuacao : 0,
                    "vencedor": children[1].vencedor ? children[1].vencedor : false
                };
                chaveGlobal.push(chave);

                criarChavesRecus(children[0].children);
                criarChavesRecus(children[1].children);
            }
        }

        function initQuery(idTelao){
            $scope.numeroTelao = idTelao;
            var telao = {
                "$or" : [
                    {
                        "$and" : [{
                            "ativa" : true,
                            "telao" : Number(idTelao)
                        }]
                    },
                    {
                        "ativa" : {
                            "$exists" : false
                        }
                    },
                    {
                        "ativa" : false
                    }
                ]
            };
            Categorias.query(telao, { sort: {ativa: -1} }).then(function(categorias){
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

                    var peso = {};
                    if(categoria.formato === 0) {
                        peso = {
                            "$gte" : categoria.peso[0],
                            "$lte" : categoria.peso[1]
                        };
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
                        "peso" : peso,
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
            var vencedor = {};
            //atualiza o no principal
            localizarNo($scope.categoriaAtiva.arvore, chave.rodada, chave);
            console.log(recursiveNode);
            for(var i = 0; i < recursiveNode.length; i++) {
                if(recursiveNode[i].vencedor) {
                    vencedor = recursiveNode[i];
                }
            }
            //atualizar o pai, a proxima partida. ou o resultado final.
            localizarPai($scope.categoriaAtiva.arvore, vencedor.pai, vencedor);
        }

        function localizarPai(no, pai, vencedor) {
            if(no.rodada !== undefined && no.rodada === pai.rodada) {
                //atualizo o pai.
                if(no.nome === pai.nome) {
                    no.nome = vencedor.nome;
                    no.academia = vencedor.academia;
                }
            } else {
                if(angular.isArray(no)) {
                    for (var i = 0; i < no.length; i++) {
                        localizarPai(no[i], pai, vencedor);
                    }
                } else {
                    if(no.children) {
                        localizarPai(no.children, pai, vencedor);
                    }
                }
            }
        }

        function localizarNo(no, rodada, chave) {

            if(no.rodada !== undefined && no.rodada === rodada) {
                recursiveNode.push(no);
                //atualizo ambos competidores.
                if(no.nome === chave.competidor1.nome) {
                    no.vencedor = chave.competidor1.vencedor;
                    no.pontuacao = chave.competidor1.pontuacao;
                }
                if(no.nome === chave.competidor2.nome) {
                    no.vencedor = chave.competidor2.vencedor;
                    no.pontuacao = chave.competidor2.pontuacao;
                }
            } else {
                if(angular.isArray(no)) {
                    for (var i = 0; i < no.length; i++) {
                        localizarNo(no[i], rodada, chave);
                    }
                } else {
                    if(no.children) {
                        localizarNo(no.children, rodada, chave);
                    }
                }
            }
        }

        $scope.initControle = function(){

            initQuery($stateParams.id);

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
                $scope.dialogClass = 'open in';

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

                console.log(chave);

                var possuiVencedor = false;

                if(chave.competidorVencedor === 1 ) {
                    chave.competidor1.vencedor = true;
                    chave.competidor2.vencedor = false;
                    possuiVencedor = true;
                }
                if(chave.competidorVencedor === 2) {
                    chave.competidor1.vencedor = false;
                    chave.competidor2.vencedor = true;
                    possuiVencedor = true;
                }

                if(possuiVencedor) {

                    chave.vencedor = true;

                    for (var i = 0; i < $scope.categoriaAtiva.chaves.length; i++) {
                        if ($scope.categoriaAtiva.chaves[i].rodada === chave.rodada) {
                            $scope.categoriaAtiva.chaves[i] = chave;
                        }
                    }

                    atualizarArvore(chave);

                    $scope.categoriaAtiva.atualizacao = Date.now();

                    $scope.categoriaAtiva.$saveOrUpdate().then(function () {
                        $scope.dialogClass = 'close';
                    });
                } else {
                    $scope.dialogClass = 'close';
                }
            };
        };
    }]);
