campeonato
    .factory('Competidor',function($resource){
        return $resource('js/components/services/competidores.json', {id : '@_id'});
    });
