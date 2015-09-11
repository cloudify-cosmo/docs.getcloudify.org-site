angular.module('getcloudify').directive('gsSummaryBar', function( ){

    return {
        restrict: 'A',
        replace:false,
        template: '<ul  class="nav nav-pills" style="border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee; padding:25px 0;" id="summarypanel"><li ng-repeat="item in items"><a href="#{{item.id}}">{{item.text}}</a></li></ul>',
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
