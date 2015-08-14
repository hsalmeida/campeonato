(function(){
	var app = angular.module('categorias', [])

	.controller('CategoriasController', 
			['$scope', function($scope){

        
        $scope.init = function() {
          //define que o slide vai ser range
          $scope.range = true;
          
          $scope.idadeOptions = {
            min: 1,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            tooltipseparator: ':',
            tooltipsplit: false
          };
          $scope.valorIdade = [2, 20];
          
          $scope.graduacaoOption = {
            min: 1,
            max: 16,
            step: 1,
            orientation: 'horizontal',
            tooltipseparator: ':',
            tooltipsplit: false
          };
          $scope.valorGraduacao = [1, 3];
          
          $scope.listaGraduacoes = 
          ['Branca','Ponta Amarela',
          'Amarela','Ponta Verde',
          'Verde','Ponta Azul','Azul',
          'Ponta Vermelha','Vermelha',
          'Ponta Preta','1º Dan', '2º Dan', 
          '3º Dan', '4º Dan', '5º Dan', '6º Dan'];
          
          $scope.listaImagens = ['10.png','9.png','8.png','7.png','6.png','5.png','4.png','3.png','2.png','1.png',
          'd1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png'];
          
          $scope.pesoOption = {
            min: 1,
            max: 200,
            step: 0.5
          };
          $scope.valorPeso = [20, 40];
          
          $scope.categoria = {
            nome : "",
            idade : [],
            graduacao : [],
            peso: [],
            formato : 0,
            sexo: "m"
          };
          
        };
        
  }]);
  
})();