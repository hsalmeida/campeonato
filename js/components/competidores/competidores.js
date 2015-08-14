campeonato
	.controller('CompetidoresController', 
		['$scope', 'Competidor', function($scope, Competidor){

        $scope.init = function() {
          
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
          
          $scope.listaGraduacoes = 
          ['Branca','Ponta Amarela',
          'Amarela','Ponta Verde',
          'Verde','Ponta Azul','Azul',
          'Ponta Vermelha','Vermelha',
          'Ponta Preta','1º Dan', '2º Dan', 
          '3º Dan', '4º Dan', '5º Dan', '6º Dan'];
          
          $scope.listaImagens = ['10.png','9.png','8.png','7.png','6.png','5.png','4.png','3.png','2.png','1.png',
          'd1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png'];

          $scope.competidor = {
            nome: "",
            academia : "",
            pais: {"name": "Brasil","code": "BR","continent": "South America","filename": "brasil"},
            estado: {"name": "Rio de Janeiro","code": "RJ"},
            idade : 20,
            sexo: "m",
            graduacao: 1,
            peso: 36.6,
            formato: 0
          };
          
          $scope.paisChangeFn = function() {
            
            if($scope.competidor.pais.code != 'BR') {
              $scope.competidor.estado = {};
            }
          };
          
          $scope.addCompetidor = function (){
            
          };


        };
          $scope.viewInit = function(){
            var list = Competidor.query();
            $scope.competidor = list.get(function ( data ){
              console.log( data );
            });
          }
        $scope.initList = function(){
          $scope.competidores = Competidor.query();
        }

  }]);