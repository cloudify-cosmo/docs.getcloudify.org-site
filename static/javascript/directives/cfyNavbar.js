angular.module('getcloudify').directive('cfyNavbar', function(  $timeout, $http, $log ){

    return {
        restrict: 'A',
        templateUrl: '/views/directives/navbar.html',
        link: function( $scope/*, element*/ ){

            $scope.dropdowns = {
                docs : {},
                product: {},
                resources: {}

            };

            $scope.term = '';
            //http://search-api.swiftype.com/api/v1/public/engines/search.embed?callback=jQuery1810689011468552053_1446378189017&spelling=strict&per_page=10&page=1&q=instant&engine_key=MdeBSe5BbjKxTiXEYcxH&filters%5Bpage%5D%5Bsection%5D%5B%5D=guide3.1&filters%5Bpage%5D%5Bsection%5D%5B%5D=gen&filters%5Bpage%5D%5Bsection%5D%5B%5D=blog&functional_boosts%5Bpage%5D%5Bscore%5D=exponential&_=1446378194110


            $scope.getSearchResults = function( search ){
                $log.info('getting search results', search);
                var swiftypeData = {'q':search,'engine_key':'4Bepa_eR9C3qKoub7af9',
                    "fetch_fields" : { page: ['highlight','title'] },
                    "page":1,
                    "per_page":20};
                return $http({
                    method: 'POST',
                    url :'https://api.swiftype.com/api/v1/public/engines/suggest.json',
                    data: swiftypeData
                }).then(function success( result ){
                    //$log.info('swiftype result', result.data);
                    return result.data.records.page;
                }, function error(result){
                    $log.error('error searching swiftype', result.data);
                });
            };

            $scope.open = function( name ){
                // timeout is required here to support mobile. not sure why though..
                $timeout(function(){$scope.dropdowns[name].isOpen = true;},0);
            };

            $scope.close = function( name ){
                $scope.dropdowns[name].isOpen = false;
            };

            $scope.docsIsOpen = true;

            $timeout(function(){
                $scope.docsIsOpen = true;
            }, 1000);


        }
    }
});
