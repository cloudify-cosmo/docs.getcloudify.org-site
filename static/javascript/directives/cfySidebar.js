// this directive helps us display the sidebar in collision with the footer.
// when the footer is displayed, we shorten the sidebar.
angular.module('getcloudify').directive('cfySidebar', function(   ){

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

            var autoFitSidebar = function () {
                if (screenBigEnough()) {
                    // Find the offset top of the bottom of the screen
                    var windowTop = $(window).scrollTop();
                    var footerTop = $('.footer').offset().top;
                    var windowBottom = windowTop + $(window).height();
                    $(element).css('bottom',Math.max(0, windowBottom - footerTop ));
                }

            };

            $(window).scroll(autoFitSidebar);


            autoFitSidebar();

        }
    }
});
