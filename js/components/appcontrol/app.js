campeonato
    .controller('AppController',['$scope', 'App', '$rootScope', 'Users', '$cookies', '$state',
        function($scope, App, $rootScope, Users, $cookies, $state){

        $scope.init = function(){
            waitingDialog.show();
            $scope.newPassword = "";
            $scope.confirmPassword = "";
            $scope.saveUserSuccess = false;
            $scope.saveUserError = false;
            $scope.saveUserErrorMsg = "";
            $scope.saveAppSuccess = false;
            $scope.saveAppError = false;
            $scope.saveAppErrorMsg = "";

            var nomeCampeonato = $cookies.get('nomeCampeonatoKey');
            var query = {
              "nome" : nomeCampeonato ? nomeCampeonato : "Campeonato Teste"
            };

            App.query(query).then(function(campeonato){
                $scope.campeonato = campeonato[0];
                $scope.campeonato.data = new Date(campeonato[0].data);
                $scope.novoNome = $scope.campeonato.nome;
                Users.getById($scope.currentUser._id.$oid).then(function(user){
                    $scope.currentUser = user;
                    waitingDialog.hide();
                })
            });

            $scope.updateApp = function(){
                waitingDialog.show();
                $scope.saveAppSuccess = true;
                $scope.saveAppErrorMsg = "";
                $scope.saveAppError = false;

                if(!$scope.campeonato.data) {
                    $scope.saveAppSuccess = false;
                    $scope.saveAppError = true;
                    $scope.saveAppErrorMsg = "Informe a data do evento";
                }
                if(!$scope.novoNome) {
                    $scope.saveAppSuccess = false;
                    $scope.saveAppError = true;
                    $scope.saveAppErrorMsg = "Informe um nome para o evento";
                }
                if($scope.saveAppSuccess) {
                    var nomeQuery = {
                        campeonato : $scope.campeonato.nome
                    };
                    Users.query(nomeQuery).then(function(usuarios){
                        usuarios.forEach(function(usuario){
                            usuario.campeonato = $scope.novoNome;
                            usuario.$saveOrUpdate().then(function(){

                            });
                        });

                        $scope.campeonato.nome = $scope.novoNome;
                        $scope.campeonato.$saveOrUpdate().then(function(){
                            //atualizar o campeonato por toda app.
                            $cookies.put("nomeCampeonatoKey", $scope.campeonato.nome);
                            $cookies.putObject("CampeonatoObject", $scope.campeonato);
                            $state.go('app');
                        });
                        waitingDialog.hide();
                    });

                }
            };

            $scope.updateUser = function(){
                waitingDialog.show();
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
                              waitingDialog.hide();
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