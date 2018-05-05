'use strict';
/* // app background
//Initialize the Firebase SDK
var config = {
	apiKey: 'AIzaSyB5a-MpgrGUzsGUntJW6vSE_oryGxeN7jw',
	//authDomain: '<your-auth-domain>',
	databaseURL: 'https://test-f8d9d.firebaseio.com',
	storageBucket: 'test-f8d9d.appspot.com'
};
firebase.initializeApp(config); */


var app = angular.module("app", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "app/template/main.html",
		controller : "mainCtrl"
    })
    .when("/configuration", {
        templateUrl : "app/template/configuration.html",
        controller : "configurationCtrl"
    })
    .when("/orders", {
        templateUrl : "app/template/orders.html",
        controller : "ordersCtrl"
    });
});

app.controller("headerCtrl",  ['$scope', '$location',  function($scope, $location) {
    $scope.isActive = function(route) {
		//console.log(route+"_"+$location.path());
		return route === $location.path();
		
    } 
    

}]);