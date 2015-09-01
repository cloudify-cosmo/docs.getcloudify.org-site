angular.module('getcloudify').directive('cfyNavbar', function(  $timeout ){

    return {
        restrict: 'A',
        templateUrl: '/views/directives/navbar.html',
        link: function( $scope/*, element*/ ){

            $scope.dropdowns = {
                docs : {},
                product: {},
                resources: {}

            };
            //
            $scope.open = function( name ){
                // timeout is required here to support mobile. not sure why though..
                $timeout(function(){$scope.dropdowns[name].isOpen = true;},0);
            };

            $scope.close = function( name ){
                $scope.dropdowns[name].isOpen = false;
            };

            $scope.docsIsOpen = true;
            $scope.name = 'guy';

            $timeout(function(){
                $scope.docsIsOpen = true;
                $scope.name = 'mograbi';
            }, 1000);


        }
    }
});
