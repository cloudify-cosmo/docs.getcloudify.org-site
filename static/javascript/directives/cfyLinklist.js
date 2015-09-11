angular.module('getcloudify').directive('gsLinklist', function(  ){

    return {
        restrict: 'A',
        scope: {
            'selector' : '@gsLinklist'
        },
        template: '<ul><li ng-repeat="item in items"><a href="#{{item.id}}">{{item.text}}</a></li></ul>',
        link: function ($scope, element) {
            $scope.items = [];
            $scope.$watch( function(){return $($scope.selector).length; }, function(){
                debugger;
                $($scope.selector).each(function(index,elem){
                    var $elem = $(elem);
                    $scope.items.push({ 'id' : $elem.attr('id') , 'text' : $elem.text() });
                });
            });
        }
    }
});
