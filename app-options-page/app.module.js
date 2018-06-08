'use strict';

firebase.initializeApp({
    apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
    projectId: "nguoitimship"

    // apiKey: "AIzaSyDVNIaP7FBvbf5MuQ0snFvus83BJYCkLnc",
    // projectId: "shopngocanh-2018"
});
const firestore = firebase.firestore();
const settings = { /* your settings... */
    timestampsInSnapshots: true
};
firestore.settings(settings);
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

var app = angular.module("app", ["ngRoute", "ui.grid", "ui.grid.edit", "ui.grid.pagination", "angularMoment"]);

app.config(function($compileProvider) {  
  $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.controller("header-controller",  ['$scope', '$location',  function($scope, $location, $firebaseObject) {
    $scope.isActive = function(route) {
		  return route === $location.path();
    }

    $scope.isDisabled = false;

    $scope.init = function(){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.$apply(function () {  
                $scope.firebaseUser = user;
                $scope.textButton = 'Đăng Xuất';                
            });
        } else {
            $scope.$apply(function () { 
                $scope.textButton = 'Đăng Nhập Bằng Google';
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
        $scope.startAuth(true);
      }
    }
    app.config( [
      '$compileProvider',
      function( $compileProvider )
      {   
          $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
          // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
      }
    ]);
    
}]);