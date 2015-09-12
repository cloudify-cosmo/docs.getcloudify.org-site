angular.module('getcloudify').directive('cfyMenu', function( $http, $log, CfyVersion, $rootScope, $compile ){


    // based on POC I did at : http://plnkr.co/edit/ISeDfEisPm9x9y8qKhPa?p=preview
    // did not find any good tree directive that I liked
    return {
        restrict: 'A',
        scope:{},
        templateUrl: '/views/directives/menu.html',
        link: function( $scope, element ){


            var treeTemplate = element.find('[tree-template]');
            var nodeHtml = treeTemplate.html();
            treeTemplate.html(''); // reset

            $scope.nodeClicked = function( node ){
                console.log('node clicked');
                node.expand = !node.expand;
            };


            function generateNodeHtml( node, root ){

                var newScope = $scope.$new();
                newScope.node = node;
                var newElement = angular.element(nodeHtml);
                root.append($compile(newElement)(newScope));

                if ( node.children ){
                    buildTree(node.children, newElement.find('[tree-node-children]')  );
                }
            }


            function buildTree( treeData, root ) {
                _.each(treeData, function (node) {
                    generateNodeHtml(node, root);
                });

                setTimeout(function(){
                    treeTemplate.addClass('animate');
                }, 1000);
            }





            //var articles = null;
            //
            //$scope.find = '';
            //
            //// todo, need to do this per version!
            var categoriesOrder = [ // this is just for the order
                { 'title' : 'installation', icon: 'fa fa-download'},
                { 'title' : 'a quick tutorial', icon: 'fa fa-bicycle'},
                { 'title' : 'what is cloudify?', icon: 'fa fa-cloud'},
                { 'title': 'Getting Started', 'icon': 'fa fa-road'},
                { 'title': 'Product Overview', 'icon' : 'fa fa-eye'},
                { 'title' : 'Command-Line Interface', 'icon' : 'fa fa-terminal' },
                { 'title' : 'Web Interface', 'icon' : 'fa fa-globe' },
                { 'title' : 'Manager Blueprints', 'icon' : 'fa fa-inbox' },
                { 'title' : 'Blueprints', 'icon' : 'fa fa-map' },
                { 'title' : 'Blueprints DSL', 'icon' : 'fa fa-language' },
                { 'title' : 'Workflows', 'icon' : 'fa fa-random' },
                { 'title' : 'Plugins', 'icon' : 'fa fa-plug' },
                //{ 'id' : 'Official Plugins', 'icon' : 'fa fa-diamond' },
                //{ 'id' : 'Contributed Plugins', 'icon' : 'fa fa-gift' },
                { 'title' : 'Policies', 'icon' : 'fa fa-map-signs' },
                { 'title' : 'Agents', 'icon' : 'fa fa-suitcase' },
                { 'title' : 'Guides', 'icon' : 'fa fa-book' },
                { 'title' : 'Reference', 'icon' : 'fa fa-graduation-cap' },
                { 'title' : 'APIs', 'icon' : 'fa fa-cubes' },
                { 'title' : 'Troubleshooting','icon' : 'fa fa-life-ring' }
            ];
            //
            //// use lower case to overcome mistakes. Product overview and Product Overview should be treated the same.
            //// keep reference to camel case representation using a map.
            var categoriesMap = {};
            _.each(categoriesOrder, function(x){
                x.uid = x.title.toLowerCase();
                categoriesMap[x.uid] =  x ;
            });

            // we organize the categories by their index in the above array
            function sortCategories(a, b) {
                var indexA = categoriesOrder.indexOf(categoriesMap[a.uid]);
                var indexB = categoriesOrder.indexOf(categoriesMap[b.uid]);
                if (indexA < 0) {
                    $log.error(a.title, ' cannot find category');
                }
                return indexA - indexB;
            }

            var currentVersion = CfyVersion.getVersion();

            var articles = []; // keep here for later filtering

            $http.get('/'+currentVersion+'/articles.json').then(function(result){

                // first lets build the tree, then lets sort things
                var tree = [];

                function sortArticles(a,b){ return a.pageord - b.pageord; }

                var currentNode = null;
                // convert to list. friendlier for the following algorithm
                articles = _.map( result.data , function(v,k){
                    v.path=k;
                    v.href= v.path+'.html';

                    v.current = document.location.href.indexOf(v.path + '.html') > 0;
                    if (v.current){
                        currentNode = v; // to expand the tree
                    }



                    if ( !v.uid && !!v.title ){
                        v.uid = v.title.toLowerCase();
                    }

                    return v;
                });

                // remove unpublished artices
                articles = _.filter(articles, function(i){ return i.publish });

                var nodes = {}; // keep a title==>article map, because parent/child rel. between posts is identified by title
                _.each(articles, function(a){
                    nodes[a.uid] = a;
                });
                _.each(categoriesOrder, function(c){
                    if ( !nodes.hasOwnProperty(c.uid) ){
                        nodes[c.uid] = c; // add virtual nodes
                        articles.push(c);
                    }else{
                        _.merge(nodes[c.uid],c); // add info
                    }
                });

                _.each(articles, function(a){
                    if (a.category){
                        var parent = nodes[a.category.toLowerCase()];
                        if ( !!parent ) {
                            parent.children = [].concat(parent.children || [], [a]);
                            a.parent = parent; // to expand the tree
                            parent.children.sort(sortArticles);
                        }else{
                            $log.error('category ', a.category, ' is used in ', a.path , ' but could not find a match ');
                        }
                    }else{
                        tree.push(a); // upper level node
                    }
                });

                tree.sort(sortCategories);
                console.log('this is tree', tree);

                var item = currentNode;
                while(item){
                    item.expand = true;
                    item = item.parent;
                }

                buildTree(tree, treeTemplate);

            });

            $scope.$watch('find', function(){
                var patt = new RegExp($scope.find,'i');

                var displayed = [];

                _.each(articles, function( item ){
                    item.hidden = !patt.test(item.title);
                    if ( !item.hidden ){
                        displayed.push(item);
                    }
                });

                // mark the entire path to the parent as displayed..
                _.each(displayed, function( disp ){
                    var item = disp.parent;
                    while (item){
                        item.hidden = false;
                        item = item.parent;
                    }
                });
            });

            $scope.current = function(node){
                return node.current;
            };

    }}
});
