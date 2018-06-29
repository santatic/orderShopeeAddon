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

var app = angular.module("app", ["ngRoute", 'ui.bootstrap', "chart.js", 'ui.grid.rowEdit', "ui.grid", 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.grid.importer', "ui.grid.edit", "ui.grid.pagination", "angularMoment"]);

app.config(function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.service('helper', function () {

  this.validateExportOrder = function (arrayOrders) {
    var arrayTempExportId = []
    var arrExportId = []
    var arrElse = []
    var date = new Date()
    var first = true
    arrayOrders.forEach(function (val) {
      docRef = firestore.collection("orderShopee").doc(val.id);
      docRef.get().then(function (doc) {
        const data = doc.data()
        if (first) {
          arrayTempExportId.push(data.actual_carrier);
          first = false
        }
        if (!data.exportId && $.inArray(data.actual_carrier, arrayTempExportId) == 0) {
          arrExportId.push(doc.id)
        } else {
          console.log("no" + data.actual_carrier);
          arrElse.push(doc.id)
          new Noty({
            layout: 'bottomRight',
            timeout: 5000,
            theme: "relax",
            type: 'success',
            text: 'ĐƠN ' + doc.id + ' KHÁC ĐƠN VỊ VẬN CHUYỂN HOẶC ĐÃ CÓ EXPORTID'
          }).show();
        }
      })
    })
    var timer = setInterval(function () {
      if (arrExportId.length == arrayOrders.length) {
        clearInterval(timer)
        console.log(arrExportId);
        var batch = firestore.batch()
        var check = []
        arrExportId.forEach(function (val, i) {
          var docEx = firestore.collection("orderShopee").doc(val);
          batch.update(docEx, {
            "exportId": date.getTime().toString()
          })
          check.push(i)
        })
        var timerSec = setInterval(function () {
          if (check.length == arrExportId.length) {
            clearInterval(timerSec)
            batch.commit().then(function () {
              firestore.collection("exportCode").doc(date.getTime().toString()).set({
                "orders": arrExportId,
                "shipper": "",
                "create_at": date,
                "status": "MỚI"
              }).then(function(){
                new Noty({
                  layout: 'bottomRight',
                  timeout: 5000,
                  theme: "relax",
                  type: 'success',
                  text: 'ĐÃ THÊM MÃ PHIẾU XUẤT'
                }).show();
              }).then(function(){
                location.reload()
              })
              
            });
          }
        }, 500)

      }
    }, 500)


  }
})

app.controller("header-controller", ['$scope', '$location', function ($scope, $location, $firebaseObject) {
  $scope.isActive = function (route) {
    return route === $location.path();
  }

  $scope.isDisabled = false;

  $scope.init = function () {
    firebase.auth().onAuthStateChanged(function (user) {
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
    chrome.identity.getAuthToken({
      interactive: !!interactive
    }, function (token) {
      if (chrome.runtime.lastError && !interactive) {
        console.log('It was not possible to get a token programmatically.');
      } else if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else if (token) {
        // Authrorize Firebase with the OAuth Access Token.
        var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInWithCredential(credential).catch(function (error) {
          // The OAuth token might have been invalidated. Lets' remove it from cache.
          if (error.code === 'auth/invalid-credential') {
            chrome.identity.removeCachedAuthToken({
              token: token
            }, function () {
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
      firebase.auth().signOut().then(function () {
        $scope.$apply(function () {
          $scope.firebaseUser = null;
          $scope.isDisabled = false;
        });
        console.log('Signed Out');
      }, function (error) {
        console.error('Sign Out Error', error);
      });;

    } else {
      $scope.startAuth(true);
    }
  }
  app.config([
    '$compileProvider',
    function ($compileProvider) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
      // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
  ]);

}]);