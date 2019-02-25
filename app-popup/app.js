'use strict';
firebase.initializeApp({
    apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
    projectId: "nguoitimship"
});
const firestore = firebase.firestore();
const settings = { /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);
var app = angular.module("app", ["ngRoute", "angularMoment"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "/app-popup/template/home.html",
		controller : "homeCtrl"
    })
    .when("/feed", {
        templateUrl : "/app-popup/template/feed.html",
        controller : "feedCtrl"
    })
    // .when("/orders", {
    //     templateUrl : "app-options-page/template/orders.html",
    //     controller : "ordersCtrl"
    // });
});
app.config(function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.controller("headerCtrl",  ['$scope', '$location',  function($scope, $location, $firebaseObject) {
    $scope.isActive = function(route) {
		//console.log(route+"_"+$location.path());
		return route === $location.path();
		
    }
    $scope.linkOptionPage = chrome.extension.getURL("options.html#/orders")
    console.log($scope.linkOptionPage);
    $scope.isDisabled = false;

    $scope.init = function(){
      firebase.auth().onAuthStateChanged(function(user) {
        // console.log(user.displayName);
        // console.log('da log usser');
        if (user) {
            $scope.$apply(function () {  
                $scope.firebaseUser = user;
                $scope.textButton = 'Sign Out';  
                $scope.isDisabled = true;              
            });

        } else {
            $scope.$apply(function () { 
                $scope.textButton = 'ĐĂNG NHẬP BẰNG GOOGLE';
                $scope.isDisabled = false;
            });
        }
        
      });

    }
    $scope.init();
    $scope.startAuth = function startAuth(interactive) {
          // Request an OAuth token from the Chrome Identity API.
          chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
            if (chrome.runtime.lastError && !interactive) {
              console.log('It was not possible to get a token programmatically.');
            } else if(chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (token) {
              // Authrorize Firebase with the OAuth Access Token.
              var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
              firebase.auth().signInWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                  chrome.identity.removeCachedAuthToken({token: token}, function() {
                    startAuth(interactive);
                  });
                }
              });
            } else {
              console.error('The OAuth Token was null');
            }
          });
    }

    $scope.startSignIn = function startSignIn() {
      console.log('xxxxx');
      $scope.isDisabled = true;
      
      if (firebase.auth().currentUser) {
        console.log('thoat');
        firebase.auth().signOut().then(function() {
            $scope.$apply(function () {  
                $scope.firebaseUser = null;
                $scope.isDisabled = false;
            });
          console.log('Signed Out');
        }, function(error) {
          console.error('Sign Out Error', error);
        });;

      } else {
        console.log('dnhap');
        $scope.startAuth(true);
      }
    }

}]);