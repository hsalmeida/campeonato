campeonato
.controller('ControleController', ['$scope', 'Categorias', 'Competidores', '$stateParams', '$state',
    function($scope, Categorias, Competidores, $stateParams, $state) {

        var quantidadeRounds = {
            "1" : 0, "2" : 1, "4" : 2, "8" : 3, "16" : 4, "32" : 5,
            "64" : 6, "128" : 7
        };

        function powerOfTwo(numero) {
            return !(numero == 0) && !(numero & (numero - 1))
        }

        function getQuantidadePartidas(len) {
            if(powerOfTwo(len)) {
                var ret = quantidadeRounds[len];
                console.log(ret);
                return ret;
            } else {
                len++;
                return getQuantidadePartidas(len);
            }
        }

        $scope.initControle = function(){
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
            var margin = {top: 20, right: 120, bottom: 20, left: 120},
                width = 960 - margin.right - margin.left, halfWidth = width / 2,
                height = 800 - margin.top - margin.bottom;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.line().interpolate('step')
                .x(function (d) { return d.x; })
                .y(function (d) { return d.y; });

            /*
            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });
            */

            var svg = d3.select("#elimination-bracket").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                console.log(partidas);
                for(var a = 0; a < partidas.length; a++) {
                    var loopPai = partidas[a].length;
                    var pais = partidas[a];
                    var idx = 0;
                    for(var b = 0; b < loopPai; b++) {
                        if(partidas[(a + 1)]){
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
                //var json = angular.toJson(partidas[0][0]);
                var json = partidas[0][0];
                json.x0 = height / 2;
                json.y0 = width / 2;

                var nodes = tree.nodes(json),
                    links = tree.links(nodes);

                var link = svg.selectAll("path.link")
                    .data(links)
                    .enter()
                    .append('svg:path', 'g')
                    .duration(self.duration)
                    .attr('d', function (d) {
                        return self.diagonal([{
                            y: d.source.x,
                            x: d.source.y
                        }, {
                            y: d.target.x,
                            x: d.target.y
                        }]);
                    })
                    .attr("class", "link");
                    //.attr("d", diagonal);

                var node = svg.selectAll("g.node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

                node.append("circle")
                    .attr("r", 4.5);

                node.append("text")
                    .attr("dx", function(d) { return d.children ? -8 : 8; })
                    .attr("dy", 3)
                    .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
                    .text(function(d) { return d.name; });
            });

        };

    }]);
