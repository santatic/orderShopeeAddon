'use strict';

firebase.initializeApp({
  apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
  projectId: "nguoitimship",

  // apiKey: "AIzaSyDVNIaP7FBvbf5MuQ0snFvus83BJYCkLnc",
  // projectId: "shopngocanh-2018",

  // apiKey: "AIzaSyDQGNExQfK_QGLyGrqGZ4RE247-l3M84bA",
  // projectId: "ext-chrome-6aaac"
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

var app = angular.module("app", ["ngRoute", 'ui.bootstrap', "chart.js", 'ui.grid.treeView', 'ui.grid.rowEdit', "ui.grid", 'ui.grid.grouping', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.grid.importer', 'ui.grid.exporter', "ui.grid.edit", "ui.grid.pagination", "angularMoment"]);

app.config(function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.service('helper', function () {

  this.validateExportOrder = function (arrayOrders) {
    var n = new Noty({
      layout: 'bottomRight',
      theme: "relax",
      type: 'warning',
      text: 'ĐANG KIỂM TRA...'
    }).show();
    var arrCarrier = [{
        id: 1,
        carrier: "Giao Hàng Tiết Kiệm"
      }, {
        id: 2,
        carrier: "Viettel Post"
      }, {
        id: 3,
        carrier: "Giao Hàng Nhanh"
      },
      {
        id: 4,
        carrier: "VNPost Tiết Kiệm"
      }, {
        id: 5,
        carrier: "VNPost Nhanh"
      }
    ]
    var arrayTempExportId = []
    var arrExportId = []
    var arrElse = []
    var date = new Date()
    var first = true
    var dataSingle = []
    var carrier
    chrome.storage.local.get('data', function (keys) {
      dataSingle = keys.data
      act(dataSingle)
    })
    //   chrome.storage.onChanged.addListener(function (changes) {
    //     dataSingle = changes.data.newValue
    // })


    function act(dataSingle) {
      arrayOrders.forEach(function (val) {
        // var docRef = firestore.collection("orderShopee").doc(val.id.toString());
        // docRef.get().then(function (doc) {
        let index = dataSingle.findIndex(x => x.id == val.id)
        const data = dataSingle[index]
        if (first) {
          arrayTempExportId.push(data.actual_carrier);
          first = false
        }
        if (!data.exportId && $.inArray(data.actual_carrier, arrayTempExportId) == 0) {
          carrier = data.actual_carrier
          arrExportId.push(val.id)
        } else {
          n.close()
          console.log("no" + data.actual_carrier);
          arrElse.push(val.id)
          new Noty({
            layout: 'bottomRight',
            timeout: 5000,
            theme: "relax",
            type: 'success',
            text: 'ĐƠN ' + val.id + ' KHÁC ĐƠN VỊ VẬN CHUYỂN HOẶC ĐÃ CÓ EXPORTID'
          }).show();
        }
        // })
      })
    }

    var timer = setInterval(function ()  {
      if (arrExportId.length == arrayOrders.length) {
        clearInterval(timer)
        console.log(arrExportId);
        // var selectedExpTags = [arrayOrders[0].carrier];
        // var names = selectedExpTags.map(x => arrCarrier.find(y => y.id === x).carrier)
        var batch = firestore.batch()
        var exCol = firestore.collection("exportCode").doc(date.getTime().toString())
        batch.set(exCol, {
                "orders": arrExportId,
                "shipper": "",
                "create_at": date,
                "status": "MỚI",
                "carrier": carrier
        })
        var check = []
        arrExportId.forEach(function (val, i) {
          var docEx = firestore.collection("orderShopee").doc(val.toString());

          batch.update(docEx, {
            "exportId": date.getTime().toString()
          })
          check.push(i)
        })
        var timerSec = setInterval(function () {
          if (check.length == arrExportId.length) {
            clearInterval(timerSec)
           
            batch.commit().then(function () {
                n.close()
                var win = window.open(chrome.extension.getURL("options.html#/export/") + date.getTime(), "_blank");
                win.focus()
              })

            ;
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
  // console.log($scope.isActive);
  // chrome.storage.local.get('data', function (keys) {    
  //   $rootScope.$apply(function () {
  //     $rootScope.dataOrders = keys.data
  //   });
  // })
  $scope.isDisabled = false;

  $('#rightDiv').on('hidden.bs.collapse', function (e) {
    $('#leftDiv').css({
      "width":"100%"
    })
    $('nav.right').css({
      "margin-left": "45px"
    })
  })
  $('#rightDiv').on('shown.bs.collapse', function (e) {
    $('#leftDiv').css({
      "width":"83.333333%"
    })
    $('nav.right').css({
      "margin-left": "0px"
    })
  })

  $scope.init = function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
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
    console.log("signing");
    $scope.isDisabled = true;
    console.log($scope.firebaseUser);
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
      console.log($scope.firebaseUser);
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