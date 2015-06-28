angular.module('getcloudify').directive('cfyMenu', function( $http, $log, CfyVersion, $rootScope, $location ){

    return {
        restrict: 'A',
        scope:{},
        templateUrl: '/views/directives/menu.html',
        link: function( $scope/*, element*/ ){

            var articles = null;

            // todo, need to do this per version!
            var categoriesOrder = ['Getting Started',
                'Product Overview',
                'Command-Line Interface',
                'Web Interface',
                'Manager Blueprints',
                'Blueprints',
                'Blueprints DSL',
                'Workflows',
                'Plugins',
                'Official Plugins',
                'Contributed Plugins',
                'Policies',
                'Agents',
                'Guides',
                'Reference',
                'APIs',
                'Troubleshooting'];


            var categories = {};
            var currentCategory;
            var currentVersion = CfyVersion.getVersion();
            $http.get('/'+currentVersion+'/articles.json').then(function(result){
                articles = _.map( result.data , function(v,k){v.path=k; return v;});
                $log.info('all in all articles',articles.length);
                articles = _.filter(articles, function(i){ return i.publish && i.category; });

                articles = articles.sort(function(a, b){return a.pageord- b.pageord});

                $log.info('published articles', articles.length);
                _.each(articles, function(a){
                    var cat = a.category;
                    if ( !categories[cat]){
                        categories[cat] = { links: [] };
                    }
                    var item = { 'href' : a.path + '.html' , 'title' : a.title };
                    categories[cat].links.push(item);
                    if ( document.location.pathname.indexOf(a.path + '.html') > 0 ) {
                        currentCategory = cat;
                        item.active = true;
                    }
                });

                $scope.items = _.map(categories, function(v,k){
                    v.name=k;
                    v.isOpen = k == currentCategory;
                    return v;
                }).sort(function(a,b){
                    indexA = categoriesOrder.indexOf(a.name);
                    indexB = categoriesOrder.indexOf(b.name);
                    if ( indexA < 0 ){
                        console.log(a.name, ' cannot find category');
                    }

                });
                console.log($location);
                debugger;
            });

            $scope.groupClicked = function(item){
                $log.info('group clicked',item);
            }
        }
    }
});
