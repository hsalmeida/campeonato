campeonato
    .controller('CategoriasController',
    ['$scope', 'Categorias', '$stateParams', '$state', function($scope, Categorias, $stateParams, $state){

      function buildCategoria($scope){
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

        $scope.pesoOption = {
          min: 1,
          max: 200,
          step: 0.5
        };
        $scope.valorPeso = [20, 40];
      }

      $scope.listaGraduacoes =
          ['Branca','Ponta Amarela',
            'Amarela','Ponta Verde',
            'Verde','Ponta Azul','Azul',
            'Ponta Vermelha','Vermelha',
            'Ponta Preta','1º Dan', '2º Dan',
            '3º Dan', '4º Dan', '5º Dan', '6º Dan'];

      $scope.listaImagens = ['10.png','9.png','8.png','7.png','6.png','5.png','4.png','3.png','2.png','1.png',
        'd1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png'];

      $scope.listaFormatos = ['Luta', 'Forma'];

      $scope.objSexo = {"m" : "Masculino", "f" : "Feminino", "i" : "Indiferente"};

      $scope.initList = function(){
        Categorias.all().then(function(categorias){
          $scope.categorias = categorias;
        });

      };

      $scope.viewInit = function(){
        Categorias.getById($stateParams.id).then(function(categorias){
          $scope.categorias = categorias;
        });
      };

      $scope.init = function() {
        //define que o slide vai ser range
        buildCategoria($scope);

        $scope.categoria = new Categorias();

        $scope.categoria.nome = "";
        $scope.categoria.idade = [];
        $scope.categoria.graduacao = [];
        $scope.categoria.peso = [];
        $scope.categoria.formato = 0;
        $scope.categoria.sexo = "m";

        $scope.addCategoria = function (){
          $scope.categoria.$save();
          $state.go('categorias');
        };

      };

      $scope.parseSexo = function(sexo) {
        return $scope.objSexo[sexo];
      }

    }]);