campeonato
    .controller('CategoriasController',
    ['$scope', 'Categorias', 'Competidores', '$stateParams', '$state', 'Listas', function($scope, Categorias, Competidores, $stateParams, $state, Listas){

      $scope.listaGraduacoes = Listas.listaGraduacoes;

      $scope.listaImagens = Listas.listaImagens;

      $scope.listaFormatos = Listas.listaFormatos;

      $scope.objSexo = Listas.objSexo;

      $scope.formatoClick = function(formato){
        $scope.showPeso = formato === 1 ? false : true;
      };

      function buildCategoria($scope, buildDefault, categoria){
        $scope.range = true;

        $scope.idadeOptions = {
          min: 1,
          max: 100,
          step: 1
        };

        $scope.graduacaoOption = {
          min: 1,
          max: 16,
          step: 1
        };

        $scope.pesoOption = {
          min: 1,
          max: 200,
          step: 0.5
        };

        if(buildDefault) {
          $scope.valorIdade = [2, 20];
          $scope.valorGraduacao = [1, 3];
          $scope.valorPeso = [20, 40];
        } else {
          $scope.valorIdade = categoria.idade;
          $scope.valorGraduacao = categoria.graduacao;
          $scope.valorPeso = categoria.peso;
        }

      }

      $scope.initList = function(){

        $scope.predicate = 'nome';
        $scope.reverse = false;

        $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
        };

        Categorias.all().then(function(categorias){
          $scope.categorias = categorias;
        });

        $scope.open = function(categoria) {
          console.log('open');
          $scope.dialogClass = 'open in';
          $scope.exCategoria = categoria;
        };

        $scope.delete = function() {
          $scope.exCategoria.$remove().then(function(){
            Categorias.all().then(function(categorias){
              $scope.dialogClass = 'close';
              $scope.categorias = categorias;
            });
          });
        }

      };

      $scope.viewInit = function(){
        Categorias.getById($stateParams.id).then(function(categorias){
          $scope.categoria = categorias;

          var query = {
            "graduacao" : {
              "$gte" : $scope.categoria.graduacao[0],
              "$lte" : $scope.categoria.graduacao[1]
            },
            "idade" : {
              "$gte" : $scope.categoria.idade[0],
              "$lte" : $scope.categoria.idade[1]
            },
            "formato" : {
              "$in" : [$scope.categoria.formato, 2]
            }
          };

          if($scope.categoria.sexo !== "i") {
            query.sexo = $scope.categoria.sexo;
          }

          var peso = {};
          if($scope.categoria.formato === 0) {
            peso = {
              "$gte" : $scope.categoria.peso[0],
              "$lte" : $scope.categoria.peso[1]
            };
            query.peso = peso;
          }

          Competidores.query(query).then(function(competidores){
            $scope.competidores = competidores;
          });

        });
      };

      $scope.initEdit = function(){

        Categorias.getById($stateParams.id).then(function(categoria){
          $scope.categoria = categoria;
          buildCategoria($scope, false, categoria);
        });

        $scope.updateCategoria = function (){
          $scope.categoria.$saveOrUpdate().then(function(){
            $state.go('categorias');
          });
        };
      };

      $scope.init = function() {
        //define que o slide vai ser range
        buildCategoria($scope, true);

        $scope.categoria = new Categorias();

        $scope.categoria.nome = "";
        $scope.categoria.idade = [];
        $scope.categoria.graduacao = [];
        $scope.categoria.peso = [];
        $scope.categoria.formato = 0;
        $scope.categoria.sexo = "m";
        $scope.showPeso = true;

        $scope.addCategoria = function (){
          $scope.categoria.$save().then(function(){
            $state.go('categorias');
          });
        };

      };


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

    }]);