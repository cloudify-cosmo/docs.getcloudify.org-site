angular.module('getcloudify').directive('cfyMenu', function( $http, $log, CfyVersion, $rootScope, $location ){

    return {
        restrict: 'A',
        scope:{},
        templateUrl: '/views/directives/menu.html',
        link: function( $scope/*, element*/ ){

            var articles = null;

            $scope.find = '';

            // todo, need to do this per version!
            var categoriesOrder = [
                { 'id': 'none', 'icon': null},

                { 'id' : 'a quick tutorial', icon: 'fa fa-bicycle'},
                { 'id' : 'what is cloudify?', icon: 'fa fa-cloud'},
                { 'id': 'Getting Started', 'icon': 'fa fa-road'},
                { 'id': 'Product Overview', 'icon' : 'fa fa-eye'},
                { 'id' : 'Command-Line Interface', 'icon' : 'fa fa-terminal' },
                { 'id' : 'Web Interface', 'icon' : 'fa fa-globe' },
                { 'id' : 'Manager Blueprints', 'icon' : 'fa fa-inbox' },
                { 'id' : 'Blueprints', 'icon' : 'fa fa-map' },
                { 'id' : 'Blueprints DSL', 'icon' : 'fa fa-language' },
                { 'id' : 'Workflows', 'icon' : 'fa fa-random' },
                { 'id' : 'Plugins', 'icon' : 'fa fa-plug' },
                { 'id' : 'Official Plugins', 'icon' : 'fa fa-diamond' },
                { 'id' : 'Contributed Plugins', 'icon' : 'fa fa-gift' },
                { 'id' : 'Policies', 'icon' : 'fa fa-map-signs' },
                { 'id' : 'Agents', 'icon' : 'fa fa-suitcase' },
                { 'id' : 'Installation', 'icon' : 'fa fa-download' },
                { 'id' : 'Guides', 'icon' : 'fa fa-book' },
                { 'id' : 'Reference', 'icon' : 'fa fa-graduation-cap' },
                { 'id' : 'APIs', 'icon' : 'fa fa-cubes' },
                { 'id' : 'Troubleshooting','icon' : 'fa fa-life-ring' }
            ];

            // use lower case to overcome mistakes. Product overview and Product Overview should be treated the same.
            // keep reference to camel case representation using a map.
            var categoriesMap = {};
            _.each(categoriesOrder, function(x){
                categoriesMap[x.id.toLowerCase()] =  x ;
            });

            var categories = {};
            var currentCategory;
            var currentVersion = CfyVersion.getVersion();
            $http.get('/'+currentVersion+'/articles.json').then(function(result){

                // convert to list. friendlier for the following algorithm
                articles = _.map( result.data , function(v,k){v.path=k; return v;});

                //$log.info('all in all articles',articles.length);

                // remove unpublished artickes
                articles = _.filter(articles, function(i){ return i.publish && i.category; });

                // sort by page order
                articles = articles.sort(function(a, b){return a.pageord- b.pageord});


                //$log.info('published articles', articles.length);

                // turn to a tree like structure. (assuming 1 level..)
                _.each(articles, function(a){
                    var cat = a.category.replace(' root', '').toLowerCase(); // silly convention for nodes in tree with children
                    if ( !categories[cat]){
                        if ( !!categoriesMap[cat] ) {
                            categories[cat] = {links: [], displayed: true};
                        }else{
                            $log.error('category ', cat , ' found in frontmatter but not declared.. will hide content');
                            return;
                        }
                    }

                    if (a.category.indexOf(' root') > 0 ){
                        var me = categories[cat];
                        me.href= a.path + '.html';

                    }else {

                        var item = {
                            'href': a.path + '.html',

                            'name' : a.title, // used for top level items
                            'title': a.title,
                            'displayed': true,
                            'current': document.location.href.indexOf(a.path + '.html') > 0
                        };

                        categories[cat].links.push(item);

                        if (document.location.pathname.indexOf(a.path + '.html') > 0) {
                            currentCategory = cat;
                            item.active = true;
                        }
                    }
                });

                $scope.items = _.map(categories, function(v,k){
                    v.name= categoriesMap[k].id;

                    return v;
                }).sort(function(a,b){
                    var indexA = categoriesOrder.indexOf(categoriesMap[a.name.toLowerCase()]);
                    var indexB = categoriesOrder.indexOf(categoriesMap[b.name.toLowerCase()]);
                    if ( indexA < 0 ){
                        $log.error(a.name, ' cannot find category');
                    }
                    return indexA - indexB;

                });

                // remove cateogry 'none' and make items be at top level

                var noneCategory = $scope.items.splice(0,1)[0];
                _.each(noneCategory.links, function(link){
                    $scope.items.unshift(link);
                });

                _.each($scope.items, function(v){
                    v.isOpen = document.location.href.indexOf(v.href) > 0 || ( !!currentCategory && v.name.toLowerCase() === currentCategory.toLowerCase() ) ;
                    try {
                        v.icon = categoriesMap[v.name.toLowerCase()].icon;
                    }catch(e){}
                });

            });

            $scope.$watch('find', function(){
                var patt = new RegExp($scope.find,'i');

                _.each($scope.items, function( item ){
                    var hasOneDisplayed = false;
                    _.each(item.links, function(link){
                        link.displayed = patt.test(link.title);
                        if (link.displayed ){
                            hasOneDisplayed = true;
                        }
                    });

                    item.displayed =  hasOneDisplayed || patt.test(item.name);
                })
            });

            $scope.groupClicked = function(item){
                $log.info('group clicked',item);
                if ( !!item.href ){
                    document.location.href = item.href;
                }
            }
        }
    }
});
