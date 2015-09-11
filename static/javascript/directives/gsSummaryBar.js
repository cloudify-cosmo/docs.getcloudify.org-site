angular.module('getcloudify').directive('gsSummaryBar', function( ){

    return {
        restrict: 'A',
        template: '<li ng-repeat="item in items"><a href="#{{item.id}}">{{item.text}}</a></li>',
        link: function( $scope/*, element*/ ){

            $scope.items = [];
            $scope.$watch( function(){return $('h1[id]').length; }, function(){
                $('h1[id]').each(function(index,elem){
                    var $elem = $(elem);
                    $scope.items.push({ 'id' : $elem.attr('id') , 'text' : $elem.text() });
                });
            });

        }
    }
});
