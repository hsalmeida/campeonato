campeonato
    .controller('TelaoController', ['$scope', 'Categorias', 'Competidores', 'Chaves', '$stateParams', '$state', '$interval', 'Listas',
        function ($scope, Categorias, Competidores, Chaves, $stateParams, $state, $interval, Listas) {

            $scope.dialogClass = "";

            var quantidadeRounds = Listas.quantidadeRounds;

            $scope.listaGraduacoes = Listas.listaGraduacoes;

            $scope.listaImagens = Listas.listaImagens;

            $scope.listaFormatos = Listas.listaFormatos;

            $scope.objSexo = Listas.objSexo;

            var globalRodadas;

            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = 1200 - margin.right - margin.left, halfWidth = width / 2,
                height = 800 - margin.top - margin.bottom;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.line().interpolate('step')
                .x(function (d) {
                    return d.x;
                })
                .y(function (d) {
                    return d.y;
                });

            var calcLeft = function (d) {
                var l = d.y;
                l = d.y - halfWidth;
                l = halfWidth - l;
                return {x: d.x, y: l};
            };

            var quantidadeRounds = {
                "1": 0, "2": 1, "4": 2, "8": 3, "16": 4, "32": 5,
                "64": 6, "128": 7
            };

            var svg;

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

            function updateBrackets(categoriaAtivada) {
                //nao possui chaves
                if (!categoriaAtivada.chaves) {
                    var nos = [];

                    var query = {
                        "graduacao": {
                            "$gte": categoriaAtivada.graduacao[0],
                            "$lte": categoriaAtivada.graduacao[1]
                        },
                        "idade": {
                            "$gte": categoriaAtivada.idade[0],
                            "$lte": categoriaAtivada.idade[1]
                        },
                        "peso": {
                            "$gte": categoriaAtivada.peso[0],
                            "$lte": categoriaAtivada.peso[1]
                        },
                        "formato": {
                            "$in": [categoriaAtivada.formato, 2]
                        }
                    };
                    Competidores.query(query, {sort: {academia: 1}}).then(function (competidores) {

                        competidores.forEach(function (competidor) {
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
                        globalRodadas = rodadas;
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
                            if (i === 0) {
                                partida.push({"nome": "Campeão", "academia": "", "rodadas" : rodadas, "partidas": qtdPartidas});
                                partidas.push(partida);
                                loopPartidas = 1;
                            } else {
                                loopPartidas = loopPartidas * 2;
                                for (var j = 0; j < loopPartidas; j++) {
                                    //ultimo item da qtdPartidas
                                    if (i === (qtdPartidas - 1)) {
                                        partida.push({"nome": nos[j].nome, "academia": nos[j].academia});
                                    } else {
                                        //ainda esta no loop de qtdPartidas
                                        partida.push({"nome": "Vencedor", "academia": ""});
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

                                var filhoMovido = {"nome": nomeOriginal, "academia": academiaOriginal, "rodada" : globalRodadas};
                                var filhoNovo = {"nome": nos[z].nome, "academia": nos[z].academia, "rodada" : globalRodadas};

                                partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children = [];
                                partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoMovido);
                                partidas[(lenPartidas - 1)][((lenUltimaPartida - 1) - z)].children.push(filhoNovo);

                                console.log(globalRodadas);

                                globalRodadas--;

                            }
                            //}
                        }
                        categoriaAtivada.arvore = partidas[0][0];
                        montarArvore(categoriaAtivada.arvore);
                    });

                } else {
                    montarArvore(categoriaAtivada.arvore);
                }

            }

            function montarArvore(arvore) {
                console.log(JSON.stringify(arvore));
                var json = arvore;

                json.x0 = height / 2;
                json.y0 = width / 2;

                var nodes = tree.nodes(json).reverse(),
                    links = tree.links(nodes);

                nodes.forEach(function (d) {
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


                var node = svg.selectAll("g.node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + d.y0 + "," + d.x0 + ")";
                    });

                node.append("rect")
                    .attr("y", -25)
                    .attr("x", 0)
                    .attr("height", 50)
                    .attr("width", 175)
                    .attr("fill", function (d) {
                        return d.vencedor && d.vencedor === true ? "#DD4B5E" : "#ABABAB";
                    })
                    .attr("class", "match-container");

                node.append("text")
                    //.attr("dx", function(d) { return d.children ? -8 : 8; })
                    .attr("dx", 4)
                    .attr("dy", -4)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-name")
                    .text(function (d) {
                        return d.nome;
                    });

                node.append("text")
                    .attr("dx", 4)
                    .attr("dy", 12)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-academia")
                    .text(function (d) {
                        return d.academia;
                    });

                node.append("text")
                    .attr("dx", -25)
                    .attr("dy", 5)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-rodada")
                    .text(function (d) {
                        return d.rodada ? "#" + d.rodada : "";
                    });

            }

            $scope.initTelao = function () {

                var scale = .85;

                svg = d3.select("#elimination-bracket").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")scale(" + scale + ")");

                $interval(function () {
                    var query = {
                        "ativa": true
                    }
                    Categorias.query(query).then(function (categoria) {
                        categoria = categoria[0];
                        if (categoria) {
                            if ($scope.categoriaAtivada) {

                                if ($scope.categoriaAtivada._id.$oid === categoria._id.$oid &&
                                    $scope.categoriaAtivada.atualizacao === categoria.atualizacao) {
                                    return;
                                }
                            }

                            $scope.categoriaAtivada = categoria;
                            if ($scope.categoriaAtivada) {
                                updateBrackets($scope.categoriaAtivada);
                            }

                        }
                    });
                }, 10000);

                /*
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



                 });
                 */

            };

        }]);
