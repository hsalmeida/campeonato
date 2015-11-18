campeonato
    .controller('AppController',['$scope', 'App', '$rootScope', 'Users', '$cookies',
        function($scope, App, $rootScope, Users, $cookies){
        $scope.init = function(){
            $scope.newPassword = "";
            $scope.confirmPassword = "";
            $scope.saveUserSuccess = false;
            $scope.saveUserError = false;
            $scope.saveUserErrorMsg = "";
            $scope.saveAppSuccess = false;

            var nomeCampeonato = $cookies.get('nomeCampeonatoKey');
            var query = {
              "nome" : nomeCampeonato ? nomeCampeonato : "Campeonato Teste"
            };

            App.query(query).then(function(campeonato){
                $scope.campeonato = campeonato[0];
                Users.getById($scope.currentUser._id.$oid).then(function(user){
                    $scope.currentUser = user;
                })
            });

            $scope.updateApp = function(){
                $scope.saveAppSuccess = true;
            };

            $scope.updateUser = function(){
                var nPass = $scope.newPassword;
                var cPass = $scope.confirmPassword;
                if(nPass) {
                  //preencheu
                  if(nPass === cPass) {
                      if(nPass.length >= 4) {
                          //minimo 4.
                          $scope.currentUser.password = nPass;
                          $scope.currentUser.$saveOrUpdate().then(function(){
                              $cookies.putObject('angularCookieKeyUsrObj', $scope.currentUser);
                              $scope.newPassword = "";
                              $scope.confirmPassword = "";
                              $scope.saveUserSuccess = true;
                              $scope.saveUserError = false;
                              $scope.saveUserErrorMsg = "Senha alterada com sucesso";
                          });
                      } else {
                          //erro de tamanho.
                          $scope.saveUserError = true;
                          $scope.saveUserErrorMsg = "A senha deve conter no mínimo 4 caracteres";
                      }
                  }else {
                      //novo e confirm diferentes.
                      $scope.saveUserError = true;
                      $scope.saveUserErrorMsg = "Nova senha difere da confirmação";
                  }
                } else {
                  $scope.saveUserError = true;
                  $scope.saveUserErrorMsg = "Preencha nova senha e confirmação";
                }
            };
        };
    }]);