campeonato
	.controller('CompetidoresController', 
		['$scope', 'Competidores', '$stateParams', '$state', function($scope, Competidores, $stateParams, $state){

          $scope.listaFormatos = ['Luta', 'Forma', 'Ambas (Forma e Luta)'];

          $scope.objSexo = {"m" : "Masculino", "f" : "Feminino"};

          $scope.listaGraduacoes =
              ['Branca','Ponta Amarela',
                'Amarela','Ponta Verde',
                'Verde','Ponta Azul','Azul',
                'Ponta Vermelha','Vermelha',
                'Ponta Preta','1º Dan', '2º Dan',
                '3º Dan', '4º Dan', '5º Dan', '6º Dan'];

          $scope.listaImagens = ['10.png','9.png','8.png','7.png','6.png','5.png','4.png','3.png','2.png','1.png',
            'd1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png'];

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
          $scope.competidor.pais = {"name": "Brasil","code": "BR","continent": "South America","filename": "brasil"};
          $scope.competidor.estado = {"name": "Rio de Janeiro","code": "RJ"};
          $scope.competidor.idade = 20;
          $scope.competidor.sexo = "m";
          $scope.competidor.graduacao = 1;
          $scope.competidor.peso = 36.6;
          $scope.competidor.formato = 0;

          $scope.addCompetidor = function (){
            $scope.competidor.$save();
            $state.go('competidores');
          };

        };

        $scope.initEdit = function(){

          buildCompetidor($scope);
          Competidores.getById($stateParams.id).then(function(competidor){
            $scope.competidor = competidor;
          });

          $scope.editCompetidor = function (){
            $scope.competidor.$saveOrUpdate();
            $state.go('competidores');
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

          Competidores.all().then(function(competidores){
            $scope.competidores = competidores;
          });

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