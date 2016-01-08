campeonato
    .controller('TelaoController', ['$scope','App', 'Categorias',
        'Competidores', 'Chaves', '$stateParams', '$state', '$interval', 'Listas', '$cookies', '$timeout',
        function ($scope, App, Categorias, Competidores,
                  Chaves, $stateParams, $state, $interval, Listas, $cookies, $timeout) {

            $scope.initTeloes = function(){
                waitingDialog.show();
                var nomeCampeonato = $cookies.get('nomeCampeonatoKey');
                var query = {
                    "nome" : nomeCampeonato ? nomeCampeonato : "Campeonato Teste"
                };

                App.query(query).then(function(campeonato){
                    $scope.campeonato = campeonato[0];
                    $scope.teloes = [];

                    var query = {
                      "ativa" : true
                    };
                    var options = {
                        "sort" : {
                            "telao" : 1
                        }
                    }
                    Categorias.query(query, options).then(function(categorias){
                        for(var idxtelao = 0; idxtelao < $scope.campeonato.teloes; idxtelao++) {
                            var telaoId = Number(idxtelao + 1);
                            var telao = {};
                            telao.numero = telaoId;
                            telao.ativo = false;
                            for(var index = 0; index < categorias.length; index++) {
                                if(telaoId === categorias[index].telao){
                                    telao.ativo = true;
                                    telao.categoria = categorias[index];
                                }
                            }

                            $scope.teloes.push(telao);
                            telaoId++;
                        }
                        waitingDialog.hide();
                    });
                });
            };


            $scope.dialogClass = "";

            var quantidadeRounds = Listas.quantidadeRounds;

            $scope.listaGraduacoes = Listas.listaGraduacoes;

            $scope.listaImagens = Listas.listaImagens;

            $scope.listaFormatos = Listas.listaFormatos;

            $scope.objSexo = Listas.objSexo;

            var globalRodadas;

            var margin = {top: 10, right: 10, bottom: 10, left: 10}

            var minWidth = window.innerWidth > 1200 ? window.innerWidth : 1200;
            var minHeight = window.innerHeight > 800 ? window.innerHeight : 800;
            var width = minWidth - margin.right - margin.left;
            var height = minHeight - margin.top - margin.bottom;
            var halfWidth = width / 2;

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

            var svg;

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

            function updateBrackets(categoriaAtivada) {
                //nao possui chaves
                if (!categoriaAtivada.arvore) {

                } else {
                    montarArvore(categoriaAtivada.arvore);
                }

            }

            function montarArvore(arvore) {

                d3.select("#elimination-bracket").select("svg").remove();

                desenharSVG();

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

                //declaro.
                var node = svg.selectAll("g.node").data(nodes);
                //entro nos nos nos nos
                var nodeEnter =  node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + d.y0 + "," + d.x0 + ")";
                    });

                nodeEnter.append("rect")
                    .attr("y", -25)
                    .attr("x", 0)
                    .attr("height", 50)
                    .attr("width", 175)
                    .attr("fill", function (d) {
                        return d.vencedor && d.vencedor === true ? "#DD4B5E" : "#ABABAB";
                    })
                    .attr("class", "match-container");

                nodeEnter.append("text")
                    //.attr("dx", function(d) { return d.children ? -8 : 8; })
                    .attr("dx", 4)
                    .attr("dy", -4)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-name")
                    .text(function (d) {
                        if(d.nome.length > 14) {
                            return d.nome.substring(0, 14) + "...";
                        } else {
                            return d.nome;
                        }
                    });

                nodeEnter.append("text")
                    .attr("dx", 4)
                    .attr("dy", 12)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-academia")
                    .text(function (d) {
                        return d.academia;
                    });

                nodeEnter.append("text")
                    .attr("dx", -25)
                    .attr("dy", -5)
                    .attr("text-anchor", "left")
                    .attr("class", "competidor-rodada")
                    .text(function (d) {
                        return d.rodada ? "#" + d.rodada : "";
                    });

                nodeEnter.append("rect")
                    .attr("y", -25)
                    .attr("x", 175)
                    .attr("height", 50)
                    .attr("width", 50)
                    .attr("fill", "#28303f");

                nodeEnter.append("text")
                    .attr("dx", 195)
                    .attr("dy", 5)
                    .attr("text-anchor", "left")
                    .attr("fill", "#8f9198")
                    .attr("style", "font-size: 16px")
                    .text(function (d) {
                        return d.pontuacao ? d.pontuacao : "0";
                    });

                var nodeUpdate = nodeEnter.transition()
                    .duration(500)
                    .attr("transform", function (d) {
                        return "translate(" + d.y0 + "," + d.x0 + ")";
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);
            }

            function desenharSVG(){
                var scale = .8;
                svg = d3.select("#elimination-bracket").append("svg")
                    .attr("width", width - margin.left - margin.right)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + (margin.left + margin.right) + "," + margin.top + ")scale(" + scale + ")");
            }

            function showTelao() {
                $scope.dialogClass = 'open in';
                $timeout(function(){
                    $scope.dialogClass = '';
                }, 60000);
            }

            $scope.initTelao = function () {

                desenharSVG();

                $interval(function () {
                    var query = {
                        "ativa": true,
                        "telao" : Number($stateParams.id)
                    };
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
                }, 5000);

                $interval(function () {
                    var query = {
                        "chaveTelao.ativa": true,
                        "telao" : Number($stateParams.id)
                    };
                    Categorias.query(query).then(function (categoria) {
                        categoria = categoria[0];
                        if (categoria) {
                            if ($scope.categoriaAtivada) {
                                if ($scope.categoriaAtivada._id.$oid === categoria._id.$oid &&
                                    $scope.categoriaAtivada.chaveTelao.atualizacao === categoria.chaveTelao.atualizacao) {
                                    return;
                                }
                            }

                            $scope.categoriaAtivada.chaveTelao = categoria.chaveTelao;

                            if ($scope.categoriaAtivada.chaveTelao) {
                                showTelao();
                            }
                        }
                    });
                }, 8000);

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
