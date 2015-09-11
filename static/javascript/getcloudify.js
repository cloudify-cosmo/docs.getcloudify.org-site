angular.module('getcloudify',['ui.bootstrap']).config(function($locationProvider){
    $locationProvider.hashPrefix('!'); // this will make anchor links active again! yey!!
});
