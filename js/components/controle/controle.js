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
            if(powerOfTwo(len)) {
                var ret = quantidadeRounds[len];
                return ret;
            } else {
                len++;
                return getQuantidadePartidas(len);
            }
        }

        function powerOfTwo(numero) {
            return !(numero == 0) && !(numero & (numero - 1))
        }

        function getQuantidadePartidas(len) {
            if (powerOfTwo(len)) {
                var ret = quantidadeRounds[len];
                return ret;
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
                    }
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
                                partida.push({"nome": "Vencedor", "academia": "", vencedor: false});
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
                            var filho2 = partidas[(a + 1)][idx];
                            filho2.rodada = globalRodadas;
                            idx++;
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
            chave.competidor1 = {"nome": "Campeão"};
            chaveGlobal.push(chave);
            criarChavesRecus(categoria.arvore.children);
        }

        function criarChavesRecus(children) {
            if(children) {

                var chave = {};
                chave.rodada = children[0].rodada;
                chave.final = false;
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

            $scope.open = function() {
                $scope.dialogClass = 'open';
            };
            /*

            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = 1200 - margin.right - margin.left, halfWidth = width / 2,
                height = 800 - margin.top - margin.bottom;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.line().interpolate('step')
                .x(function (d) { return d.x; })
                .y(function (d) { return d.y; });

            var calcLeft = function(d){
                var l = d.y;
                l = d.y-halfWidth;
                l = halfWidth - l;
                return {x : d.x, y : l};
            };

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

            var scale = .85;

            var svg = d3.select("#elimination-bracket").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")scale(" + scale + ")");

            Categorias.all().then(function(categorias){
                var nos = [];
                categorias.forEach(function( categoria ){
                    var cat = angular.copy(categoria);
                    var no = {
                        name : cat.nome,
                        children : []
                    }
                    nos.push(no);
                });

                //quantidade de nos
                var len = nos.length;
                //verifico se a chave é perfeita ou pode gerar baias futuras ou iniciais.
                var chavePerfeita = powerOfTwo(len);
                //pego a quantidade de nos, menos 1, e vejo a quantidade de partidas,
                //partidas informa os pulos nos nós.
                var qtdPartidas = getQuantidadePartidas(len);
                //para saber se a quantidade de competidores é par, faço mod de 2.
                //isso vai me dizer se tem um competidor na baia.
                var even = nos.length % 2;
                var partidas = [];
                var loopPartidas = 0;
                for (var i = 0; i < qtdPartidas; i++) {
                    var partida = [];
                    //partida vencedora.
                    if(i === 0) {
                        partida.push({"name": "Campeão"});
                        partidas.push(partida);
                        loopPartidas = 1;
                    } else {
                        loopPartidas = loopPartidas * 2;
                        for(var j = 0; j < loopPartidas; j++) {
                            //ultimo item da qtdPartidas
                            if(i === (qtdPartidas - 1)) {
                                partida.push({"name": nos[j].name});
                            } else {
                                //ainda esta no loop de qtdPartidas
                                partida.push({"name": "Vencedor"});
                            }
                        }
                        partidas.push(partida);
                    }
                }
                //loop nas partidas, lembrando que é multidimensional;
                for(var a = 0; a < partidas.length; a++) {
                    var loopPai = partidas[a].length;
                    var pais = partidas[a];
                    var idx = 0;
                    for(var b = 0; b < loopPai; b++) {
                        if(partidas[(a + 1)]) {
                            var filho1 = partidas[(a + 1)][idx];
                            idx++;
                            var filho2 = partidas[(a + 1)][idx];
                            idx++;
                            pais[b].children = [];
                            pais[b].children.push(filho1);
                            pais[b].children.push(filho2);
                        }
                    }
                }
                //possui baia
                if(!chavePerfeita) {
                    //verificar se foi par o impar a quantidade.
                    //quando par, tenho que criar uma nova chave e impar adiciono somente o competidor.
                    var lenPartidas = partidas.length;
                    var lenUltimaPartida = partidas[(lenPartidas - 1)].length;
                    var difNosLenPartidas = len - lenUltimaPartida;
                    //comentei para pensar melhor depois .. para impares o algoritmo tambem funciona, parcialmente.
                    //if(!even) {
                        //par
                        //mais simples e coloca as baias na proxima luta.
                        nos.reverse();
                        for(var z = 0; z < difNosLenPartidas; z++) {
                            var nomeOriginal = partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].name;
                            partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].name = "Vencedor";
                            var filhoMovido = {"name" : nomeOriginal};
                            var filhoNovo = {"name" : nos[z].name};
                            partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children = [];
                            partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoMovido);
                            partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoNovo);
                        }
                    //}
                }
                //var json = angular.toJson(partidas[0][0]);
                var json = partidas[0][0];
                json.x0 = height / 2;
                json.y0 = width / 2;

                var nodes = tree.nodes(json).reverse(),
                    links = tree.links(nodes);

                nodes.forEach(function(d) {
                    var p = calcLeft(d);
                    d.x0 = p.x;
                    d.y0 = p.y;
                });

                var link = svg.selectAll("path.link")
                    .data(links)
                    .enter()
                    .append('svg:path', 'g')
                    .attr('d', function (d) {
                        return diagonal([{
                            y: d.source.x0,
                            x: d.source.y0
                        }, {
                            y: d.target.x0,
                            x: d.target.y0
                        }]);
                    })
                    .attr("class", "link");
                    //.attr("d", diagonal);

                var node = svg.selectAll("g.node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.y0 + "," + d.x0 + ")"; });

                node.append("circle")
                    .attr("r", 4.5);

                node.append("rect")
                    .attr("y", -25)
                    .attr("x", 0)
                    .attr("height", 50)
                    .attr("width", 175)
                    .attr("fill", "#ABABAB")
                    .attr("class", "match-container");

                node.append("text")
                    //.attr("dx", function(d) { return d.children ? -8 : 8; })
                    .attr("dx", 4)
                    .attr("dy", -4)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-name")
                    .text(function(d) { return d.name; });

                node.append("text")
                    .attr("dx", 4)
                    .attr("dy", 12)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-academia")
                    .text("Academia");

             });*/

        };

    }]);
