angular.module('getcloudify').service('CfyVersion', function(){
    var currentVersion = document.location.pathname.split('/')[1];

    this.getVersion = function(){ return currentVersion; }
});
