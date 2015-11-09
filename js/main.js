var campeonato = angular.module('campeonato', [
	'ui.router','ngResource', 'admin', 'grade', 'ui.bootstrap-slider', 'mongolabResourceHttp', 'ui.bootstrap'
])
.run(function ($rootScope) {

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;

		if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
			event.preventDefault();
			// get me a login modal!
		}
	});
})
.constant('MONGOLAB_CONFIG',{API_KEY:'YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh', DB_NAME:'ltdb'})
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "views/home.html",
			data : {
				requiredlogin : false
			}
		})
		.state('welcome', {
			url: "/welcome",
			templateUrl: "views/padrao.html",
			data : {
				requiredlogin : true
			}
		})
		.state('admin', {
			url: "/admin",
			templateUrl: "views/admin/admin.html",
			controller: 'AdminController',
			data : {
				requiredlogin : true
			}
		})
		.state('categorias', {
			url: "/categorias",
			templateUrl: "views/categoria/categorias.html",
			controller: 'CategoriasController',
			data : {
				requiredlogin : true
			}
		})
		.state('viewCategoria', {
			url: "/categorias/:id/view",
			templateUrl: "views/categoria/categoria-view.html",
			controller: 'CategoriasController',
			data : {
				requiredlogin : true
			}
		})
		.state('newCategoria', {
			url: "/categorias/new",
			templateUrl: "views/categoria/categoria-add.html",
			controller: 'CategoriasController',
			data : {
				requiredlogin : true
			}
		})
		.state('editCategoria', {
			url: "/categorias/:id/edit",
			templateUrl: "views/categoria/categoria-edit.html",
			controller: 'CategoriasController',
			data : {
				requiredlogin : true
			}
		})
		.state('competidores', {
			url: "/competidores",
			templateUrl: "views/competidor/competidores.html",
			controller: 'CompetidoresController',
			data : {
				requiredlogin : true
			}
		})
		.state('viewCompetidor', {
			url: "/competidores/:id/view",
			templateUrl: "views/competidor/competidor-view.html",
			controller: 'CompetidoresController',
			data : {
				requiredlogin : true
			}
		})
		.state('newCompetidor', {
			url: "/competidores/new",
			templateUrl: "views/competidor/competidor-add.html",
			controller: 'CompetidoresController',
			data : {
				requiredlogin : true
			}
		})
		.state('editCompetidor', {
			url: "/competidores/:id/edit",
			templateUrl: "views/competidor/competidor-edit.html",
			controller: 'CompetidoresController',
			data : {
				requiredlogin : true
			}
		})
		.state('controle', {
			url: "/controle",
			templateUrl: "views/controle/controle.html",
			controller: 'ControleController',
			data : {
				requiredlogin : true
			}
		})
		.state('grade', {
			url: "/grade",
			templateUrl: "views/grade.html",
			controller: "GradeController",
			data : {
				requiredlogin : true
			}
		})
		.state('telao', {
			url: "/telao",
			templateUrl: "views/telao/telao.html",
			controller: "TelaoController",
			data : {
				requiredlogin : false
			}
		})
		.state('equipes', {
			url: "/equipes",
			templateUrl: "views/equipes/equipes.html",
			controller: 'EquipesController',
			data : {
				requiredlogin : true
			}
		})
		.state('viewEquipe', {
			url: "/equipes/:id/view",
			templateUrl: "views/equipes/equipe-view.html",
			controller: 'EquipesController',
			data : {
				requiredlogin : true
			}
		})
		.state('newEquipe', {
			url: "/equipes/new",
			templateUrl: "views/equipes/equipe-add.html",
			controller: 'EquipesController',
			data : {
				requiredlogin : true
			}
		})
		.state('editEquipe', {
			url: "/equipes/:id/edit",
			templateUrl: "views/equipes/equipe-edit.html",
			controller: 'EquipesController',
			data : {
				requiredlogin : true
			}
		});
});