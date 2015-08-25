campeonato
    .factory('Competidores', function($mongolabResourceHttp){
        return $mongolabResourceHttp('competidores');
    })
    .factory('Categorias', function($mongolabResourceHttp) {
        return $mongolabResourceHttp('categorias');
    });
