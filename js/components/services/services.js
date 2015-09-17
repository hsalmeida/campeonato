campeonato
    .factory('Competidores', function($mongolabResourceHttp){
        return $mongolabResourceHttp('competidores');
    })
    .factory('Categorias', function($mongolabResourceHttp) {
        return $mongolabResourceHttp('categorias');
    })
    .factory('Chaves', function($mongolabResourceHttp) {
        return $mongolabResourceHttp('chaves');
    })
    .factory('Listas', function(){
        return {
            listaGraduacoes : ['Branca','Ponta Amarela',
                'Amarela','Ponta Verde',
                'Verde','Ponta Azul','Azul',
                'Ponta Vermelha','Vermelha',
                'Ponta Preta','1� Dan', '2� Dan',
                '3� Dan', '4� Dan', '5� Dan', '6� Dan'],
            listaImagens : ['10.png','9.png','8.png','7.png','6.png','5.png','4.png','3.png','2.png','1.png',
                'd1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png'],
            listaFormatos : ['Luta', 'Forma', 'Ambas (Forma e Luta)'],
            listaFormatosFull : ['Luta', 'Forma', 'Ambas (Forma e Luta)'],
            objSexo : {"m" : "Masculino", "f" : "Feminino", "i" : "Indiferente"},
            parseGraduacao : function (graduacao) {
                return listaGraduacoes[ graduacao ];
            }
        }
    });

