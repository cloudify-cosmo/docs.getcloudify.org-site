// this directive helps us display the sidebar in collision with the footer.
// when the footer is displayed, we shorten the sidebar.
angular.module('getcloudify').directive('cfySidebar', function( $interval  ){

    return {
        restrict: 'C',

        link: function( $scope, element ){

            var screenBigEnough = function() { // not mobile view?
                // Check if matchMedia exists
                if (window.matchMedia) {
                    return window.matchMedia('(min-width: 768px)').matches;
                } else {
                    return $(window).width() > 768;
                }
            };
            // also fix footer position here

            function fixFooterPosition(){
                try {
                    var current = $('.footer').position().top;
                    var proper = $(window).height() - $('.footer').outerHeight();

                    console.log('proper,current', proper, current);
                    if (current <= proper) {
                        $('.footer').css({'position': 'fixed', 'bottom': 0});
                    } else {
                        $('.footer').css({'position': 'inherit', 'bottom': 'initial'});
                    }
                }catch(e){}

            }


            var autoFitSidebar = function () {
                //console.log('auto fit sidebar');
                fixFooterPosition();
                try {
                    if (screenBigEnough()) {
                        // Find the offset top of the bottom of the screen
                        var windowTop = $(window).scrollTop();
                        var footerTop = $('.footer').offset().top;
                        var windowBottom = windowTop + $(window).height();
                        $(element).css('bottom', Math.max(0, windowBottom - footerTop));
                    }
                }catch(e){
                    // fail silently
                }

            };

            $(window).scroll(autoFitSidebar);

            $(window).resize(autoFitSidebar);

            $scope.$watch(function(){
                try {
                    //console.log($('.footer').offset().top);
                    return $('.footer').offset().top;
                }catch(e){
                    return null;
                }
            } , autoFitSidebar); // does not work with zoom in/out


            //$interval(fixFooterPosition,1000);
            autoFitSidebar();

        }
    }
});
