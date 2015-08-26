var campeonato = angular.module('campeonato', [
	'ui.router','ngResource', 'categorias', 'admin', 'grade', 'ui.bootstrap-slider', 'mongolabResourceHttp'
])
.constant('MONGOLAB_CONFIG',{API_KEY:'YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh', DB_NAME:'ltdb'})
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "views/padrao.html"
		})
		.state('admin', {
			url: "/admin",
			templateUrl: "views/admin/admin.html",
			controller: 'AdminController'
		})
		.state('categorias', {
			url: "/categorias",
			templateUrl: "views/categoria/categorias.html",
			controller: 'CategoriasController'
		})
		.state('viewCategoria', {
			url: "/categorias/:id/view",
			templateUrl: "views/categoria/categoria-view.html",
			controller: 'CategoriasController'
		})
		.state('newCategoria', {
			url: "/categorias/new",
			templateUrl: "views/categoria/categoria-add.html",
			controller: 'CategoriasController'
		})
		.state('editCategoria', {
			url: "/categorias/:id/edit",
			templateUrl: "views/categoria/categoria-edit.html",
			controller: 'CategoriasController'
		})
		.state('competidores', {
			url: "/competidores",
			templateUrl: "views/competidor/competidores.html",
			controller: 'CompetidoresController'
		})
		.state('viewCompetidor', {
			url: "/competidores/:id/view",
			templateUrl: "views/competidor/competidor-view.html",
			controller: 'CompetidoresController'
		})
		.state('newCompetidor', {
			url: "/competidores/new",
			templateUrl: "views/competidor/competidor-add.html",
			controller: 'CompetidoresController'
		})
		.state('editCompetidor', {
			url: "/competidores/:id/edit",
			templateUrl: "views/competidor/competidor-edit.html",
			controller: 'CompetidoresController'
		})

		.state('grade', {
			url: "/grade",
			templateUrl: "views/grade.html",
			controller: "GradeController"
		});
})
.directive( 'goClick', function ( $state ) {
	return function ( scope, element, attrs ) {
		var path;
		var _id;

		attrs.$observe( 'goClick', function (val) {
			var split = val.split(':');
			path = split[0];
			_id = split[1];
		});

		element.bind( 'click', function () {
			scope.$apply( function () {
				$state.go( path, {"id" : _id});
			});
		});
	};
});