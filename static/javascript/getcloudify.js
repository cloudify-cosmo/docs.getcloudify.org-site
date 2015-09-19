angular.module('getcloudify',['ui.bootstrap','ngRoute']).config(function($locationProvider, $routeProvider ){
    //$locationProvider.hashPrefix('!'); // this will make anchor links active again! yey!!
    $locationProvider.html5Mode( { enabled: true, requireBase: false} );

    var firstLoadPost = angular.element('.post');

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $routeProvider.when('/:doc*', {
        controller: function(){},
        template: function( routeParams ){

            if ( firstLoadPost ){
                var result = firstLoadPost.html();
                firstLoadPost = null;
                return result;
            }
            return $http.get('/' + routeParams.doc).then(function( result ){
                 var post = angular.element(result.data).find('.post');

                var blocks = post.find('pre code');
                _.each(blocks, hljs.highlightBlock);

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
