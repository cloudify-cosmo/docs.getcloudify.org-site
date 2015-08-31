angular.module('getcloudify').directive('cfyVersions', function( $http, $log, CfyVersion ){

    return {
        restrict: 'A',
        scope:{},
        template: '<select ng-model="showVersion" ng-change="redirectToVersion(showVersion)" ng-options="v.name for v in versions"></select>',
        link: function( $scope/*, element*/ ){
            var currentVersion = CfyVersion.getVersion();
            $log.info('loading versions');
            $http.get('/versions.json').then(function(result){
                $scope.versions = result.data;
                _.each(result.data, function( item ){
                    if ( item.name === currentVersion ){
                        $scope.showVersion = item;
                    }
                });

                if ( !$scope.showVersion ){
                    $scope.showVersion = _.find($scope.versions, function(v){
                        return v.name === 'master';
                    });
                }
            });

            $scope.redirectToVersion = function( version ){
                $log.info(version);
                document.location = document.location.origin + '/' + version.name;
            }
        }
    }
});
