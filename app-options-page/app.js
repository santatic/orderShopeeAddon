'use strict';

firebase.initializeApp({
    apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
    projectId: "nguoitimship"
});
  // Initialize Cloud Firestore through Firebase
// const  firestore = firebase.firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// firestore.settings(settings);
// firestore.collection("users").add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });

var app = angular.module("app", ["ngRoute", "data-table"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "app-options-page/template/main.html",
		controller : "mainCtrl"
    })
    .when("/configuration", {
        templateUrl : "app-options-page/template/configuration.html",
        controller : "configurationCtrl"
    })
    .when("/orders", {
        templateUrl : "app-options-page/template/orders.html",
        controller : "ordersCtrl"
    });
});

app.controller("headerCtrl",  ['$scope', '$location',  function($scope, $location, $firebaseObject) {
    $scope.isActive = function(route) {
		//console.log(route+"_"+$location.path());
		return route === $location.path();
		
    } 
    $scope.isDisabled = false;

    $scope.init = function(){
      firebase.auth().onAuthStateChanged(function(user) {
        // console.log(user.displayName);
        // console.log('da log usser');
        if (user) {
            $scope.$apply(function () {  
                $scope.firebaseUser = user;
                $scope.textButton = 'Sign Out';                
            });

        } else {
            $scope.$apply(function () { 
                $scope.textButton = 'Sign In With Google';
            });
        }
        $scope.isDisabled = false;
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