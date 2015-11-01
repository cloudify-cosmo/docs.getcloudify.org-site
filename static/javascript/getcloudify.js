angular.module('getcloudify',['ui.bootstrap','ngRoute']).config(function($locationProvider, $routeProvider ){
    //$locationProvider.hashPrefix('!'); // this will make anchor links active again! yey!!
    $locationProvider.html5Mode( { enabled: true, requireBase: false} );

    var firstLoadPost = angular.element('.post');

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $routeProvider.when('/:doc*', {
        controller: function(){},
        template: function( routeParams ){

            function highlight(root){
                _.each(root.find('pre code'), function(elem){

                    $(elem).html($(elem).html().trim()); // remove extra lines hugo adds in pre/code..

                    hljs.highlightBlock(elem)
                });
            }

            if ( firstLoadPost ){
                highlight(firstLoadPost);
                var result = firstLoadPost.html();
                firstLoadPost = null;

                return result;
            }
            return $http.get('/' + routeParams.doc).then(function( result ){
                 var post = angular.element(result.data).find('.post');
                highlight(post);
                return post.html();
            });
        }
    });
}).run(function( $rootScope ){

        $rootScope.$on('$routeChangeStart', function(){
            $rootScope.isRouteLoading = true;
        });

        $rootScope.$on('$routeChangeSuccess', function(){
            $rootScope.isRouteLoading = false;
        });
});
