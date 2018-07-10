firebase.initializeApp({
  apiKey: "AIzaSyCSjrlqzY5ogerTPlDPEp-A1OLRCUnudWM",
  projectId: "nguoitimship"
  // apiKey: "AIzaSyDVNIaP7FBvbf5MuQ0snFvus83BJYCkLnc",
  // projectId: "shopngocanh-2018"
});
// Initialize Cloud Firestore through Firebase
const firestore = firebase.firestore();
const settings = { /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);

//   console.log(data);
var arrayFilter = [{
    id: 1,
    english: "NEW",
    vietnamese: "đơn mới"
  },
  {
    id: 2,
    english: "PREPARED",
    vietnamese: "đã nhặt đủ hàng để chờ đóng gói"
  },
  {
    id: 3,
    english: "UNPREPARED",
    vietnamese: "chưa nhặt được hàng vì lý do nào đó (ghi lý do vào noteWarehouse)"
  },
  {
    id: 4,
    english: "PACKED",
    vietnamese: "đã đóng gói chờ gửi đi"
  },
  {
    id: 5,
    english: "SHIPPED",
    vietnamese: "đã gửi đi"
  },
  {
    id: 6,
    english: "DELIVERED",
    vietnamese: "khách đã nhận hàng"
  },
  {
    id: 7,
    english: "RETURNING",
    vietnamese: "đang hoàn hàng chưa về đến kho"
  },
  {
    id: 8,
    english: "RETURNED",
    vietnamese: "đã hoàn về kho"
  },
  {
    id: 9,
    english: "PAID",
    vietnamese: "đã thanh toán"
  },
  {
    id: 10,
    english: "REFUNDED",
    vietnamese: "đã hoàn tiền"
  },
  {
    id: 11,
    english: "CANCELED",
    vietnamese: "đã hủy"
  },
]

// var Col = firestore.collection('orderShopee')
// var bat = firestore.batch()
// var pushar = []
// Col.get().then(function (querySnapshot) {
//   console.log(querySnapshot.size);
//   querySnapshot.forEach(function (doc) {
//     const data = doc.data()
//     var status = data.own_status.status
// var selectedExpTags = [status];
// var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
//     console.log(status);
//     var Doc = firestore.collection('orderShopee').doc(doc.id).update({
//       "own_status": {
//         "status": names[0],
//         "create_at": new Date()
//       }
//     })
//     pushar.push(doc.id)
//   })
//   console.log(pushar);
//   var timer3 = setInterval(function () {
//     if (pushar.length == querySnapshot.size) {

//       console.log("update done");

//       clearInterval(timer3)
//     }
//   }, 500)
// })


var app = angular.module('app', []);
app.controller('mainCtrl', function ($scope, $q, storageFirestore, request_center, helper_center) {
  // helper_center.doesConnectionExist()
  $scope.storageFirestore = storageFirestore
  //   chrome.storage.local.clear(function() {
  //     console.log("done clear");
  //     var error = chrome.runtime.lastError;
  //     if (error) {
  //         console.error(error);
  //     }
  // });
  var dataOnSnapshot = []
  var dataToAdd = []
  var dataSuggests = []
  chrome.storage.local.get('data', function (obj) {
    // console.log(obj);
    if (Object.keys(obj).length === 0) {
      chrome.storage.local.set({
        data: []
      }, function () {
        console.log('Data is stored in Chrome storage');
      });
      chrome.storage.local.set({
        suggests: []
      }, function () {
        console.log('Suggest is stored in Chrome storage');
      });
      chrome.storage.local.get('data', function (obj) {
        dataOnSnapshot = obj.data;
        console.log(dataOnSnapshot);
      })
      chrome.storage.local.get('suggests', function (obj) {
        dataSuggests = obj.suggests;
        console.log(dataSuggests);
      })
    } else {
      dataOnSnapshot = obj.data;
      console.log(dataOnSnapshot);
      chrome.storage.local.get('suggests', function (obj) {
        dataSuggests = obj.suggests;
        console.log(dataSuggests);
      })
    }
  });

  request_center.request_trigger()

  var isRunOnSnapshot = true

  chrome.tabs.onActivated.addListener(function (tabId) {
    var url;
    var tab_id = tabId.tabId;
    chrome.tabs.get(tab_id, function (tab) {
      url = tab.url.toString();
      if (isRunOnSnapshot && (url.indexOf("banhang.shopee.vn") !== -1 || url.indexOf("chrome-extension://") !== -1)) {
        isRunOnSnapshot = false;
        console.log("RUN", url);
        firestore.collection("orderShopee").where("own_status.status", "<=", 6)
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              if (change.type === "added") {
                // var found = dataOnSnapshot.some(function (el) {
                //   return el.id == obj.id;
                // });
                // if (!found) {
                dataToAdd.push(obj)
                // }

              }
              if (change.type === "modified") {
                let index = dataToAdd.findIndex(x => x.id == obj.id)
                // console.log("modified", obj);
                dataToAdd[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = dataToAdd.findIndex(x => x.id == obj.id)
                // console.log("removed", obj);
                dataToAdd.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.data = dataToAdd
                $scope.storageFirestore.syncOrders()
              }
            });
          })




        firestore.collection("suggest")
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = {
                suggest_chat: change.doc.data().suggest_chat,
                id: change.doc.id
              }
              if (change.type === "added") {
                var found = dataSuggests.some(function (el) {
                  return el.id == obj.id;
                });
                if (!found) {
                  // console.log("added", obj);
                  dataSuggests.push(obj)
                }

              }
              if (change.type === "modified") {
                let index = dataSuggests.findIndex(x => x.id == obj.id)
                console.log("modified", obj);
                dataSuggests[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = dataSuggests.findIndex(x => x.id == obj.id)
                console.log("removed", obj);
                dataSuggests.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.suggests = dataSuggests
                $scope.storageFirestore.syncSuggests()
              }
            });
          })
      }

    });

  });


  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      switch (request.mission) {
        case "checkExist":
          console.log("check");
          checkExist(request, sendResponse)
          return true;
          break;
        case "detailOrder":
          detailOrder(request, sendResponse)
          break;
        case "update":
          update(request, sendResponse)
          break;
        case "updateNote":
          updateNote(request, sendResponse)
          break;
        case "cancel":
          cancel_status(request, sendResponse)
          break;
        case "updateList":
          updateList(request, sendResponse);
          return true;
          break;
        case "payment":
          paymentCheck(request, sendResponse);
          return true;
          break;
        case "updatePayment":
          updatePayment(request, sendResponse);
          return true
          break;
        case "getHomepage":
          getHomepage(request, sendResponse);
          return true
          break;
        case "updateLogFromContent":
          updateLogFromContent(request, sendResponse);
          return true
          break;
        case "getSuggest":
          getSuggest(request, sendResponse)
          return true
          break;
        case "updateStatusFromShopee":
          updateStatusFromShopee(request, sendResponse)
          return true
          break
      }
    });

  function updateStatusFromShopee(response, sendResponse) {
    console.log(response);
    firestore.collection("orderShopee").doc(response.url).update({
      "own_status": {
        status: response.status,
        create_at: new Date()
      }
    }).then(function (doc) {
      sendResponse()
    })
  }

  function httpGet(theUrl, headers) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    for (var i = 0; i < headers.length; i++) {
      xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
    }
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  }

  function updateLogFromContent(response, sendResponse) {
    console.log(response.updateLogShopee);
    var check = []
    var batch = firestore.batch()

    $.each(response.updateLogShopee, function (i, val) {
      var log = val.log['logistics-logs'][0].description;
      // console.log(log);
      var test = log

      if (log.indexOf('Bưu cục gốc:Nhập Phiếu Gủi') !== -1 || log.indexOf('Đóng bảng kê đi') !== -1 || log.indexOf('Đã điều phối giao hàng') !== -1 || log.indexOf('Đã lấy hàng/Đã nhập kho') !== -1 || log.indexOf('Giao hàng lần') !== -1) {
        log = 5;
        var docRef = firestore.collection("orderShopee").doc(val.id.toString());
        batch.update(docRef, {
          "own_status": {
            status: log,
            create_at: new Date()
          }
        })
      } else if (log.indexOf('Thành công - Phát thành công') !== -1) {
        log = 6;
        var docRef = firestore.collection("orderShopee").doc(val.id.toString());
        batch.update(docRef, {
          "own_status": {
            status: log,
            create_at: new Date()
          }
        })
      }

      if (test != log) {
        console.log(log);
      }
      var docRef = firestore.collection("orderShopee").doc(val.id.toString());
      batch.update(docRef, {
        "logistic": val.log
      })
      check.push(i)
    })

    $.each(response.idsDaGiao, function (i, id) {
      // console.log(id);
      var docRef = firestore.collection("orderShopee").doc(id.toString());
      batch.update(docRef, {
        "own_status": {
          status: 6,
          create_at: new Date()
        }
      })
      check.push(i)
    });
    console.log(check.length);
    console.log(response.idsDaGiao.length);
    console.log(response.updateLogShopee.length);

    var timer = setInterval(function () {
      if (check.length == (response.idsDaGiao.length + response.updateLogShopee.length)) {
        clearInterval(timer)
        batch.commit().then(function () {
          sendResponse()
        });
      }
    }, 500)
  }

  function getHomepage(response, sendResponse) {

    var res = [];
    var loop = [
      1,
      4,
      5
    ]
    

    $.each(loop, function (i, val) {
      console.log(val);
      var logistics = [];
      var homeArray = dataToAdd.filter(function (event) {
        return event.own_status.status == val;
      });
      console.log(homeArray);
      // var colRef = firestore.collection("orderShopee").where("own_status.status", "==", val)
      // colRef.get().then(function (querySnapshot) {
      //   console.log(querySnapshot.size);
      var ids = []
      homeArray.forEach(function (doc) {
        const data = doc
        var obj = new Object()
        obj = {
          id: doc.id,
          logistics: data.logistic['logistics-logs'].length > 0 ? data.logistic['logistics-logs'][0].description : ""
        }
        logistics.push(obj)
      })
      var obj = new Object();
      var selectedExpTags = [val];
      var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
      obj = {
        status: names[0],
        size: homeArray.length,
        logistics: logistics
      }
      res.push(obj)
      // })
    })
    var timer = setInterval(function () {
      if (res.length == 3) {
        console.log(res);
        sendResponse({
          data: res
        })
        clearInterval(timer)
      }
    }, 500)

  }


  function updatePayment(response, sendResponse) {
    var date = new Date()
    console.log(date.getTime().toString());
    var check = []
    var batch = firestore.batch()
    var ImRef = firestore.collection("importCode").doc(date.getTime().toString());
    batch.set(ImRef, {
      "myBank": response.bank,
      "reciveMoneyAt": response.date,
      "orders": response.id
    })
    $.each(response.id, function (i, id) {
      console.log(id);
      var docRef = firestore.collection("orderShopee").doc(id.id);

      batch.update(docRef, {
        "own_status": {
          status: 9,
          create_at: new Date()
        },
        "actual_money_shopee_paid": id.shopeeMoney,
        "importMoneyId": date.getTime().toString()
      })
      check.push(i)
    });

    var timer = setInterval(function () {
      if (check.length == response.id.length) {
        clearInterval(timer)
        batch.commit().then(function () {
          sendResponse()
        });
      }
    }, 500)
  }

  function paymentCheck(response, sendResponse) {
    // console.log("recived");
    var ordersn = response.arrayOrderno;
    // console.log(ordersn);
    var resOrdersn = []

    $.each(ordersn, function (i, val) {
      var colRef = firestore.collection("orderShopee").where("ordersn", "==", val);
      colRef.get().then(function (querySnapshot) {
        if (querySnapshot.size == 1) {
          querySnapshot.forEach(function (doc) {
            const data = doc.data();
            var obj = new Object();
            var voucher_price = parseInt(((data.voucher_price) * 100) / 100)
            var selectedExpTags = [data.own_status.status];
            var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
            obj = {
              vc: voucher_price,
              money: parseInt(((data.buyer_paid_amount) * 100) / 100) - voucher_price,
              shipping_fee: parseInt(((data.shipping_fee) * 100) / 100),
              id: doc.id,
              status: names[0],
              traceno: data.shipping_traceno
            }
            resOrdersn.push(obj)
          })
        } else {
          obj = {
            money: "chua co trong Firestore",
            shipping_fee: "chua co trong Firestore",
            id: "",
            status: "chua co trong Firestore",
            traceno: "chua co trong Firestore"
          }
          resOrdersn.push(obj)
        }
      }).catch(function (error) {
        console.log("Error getting documents: ", error)
      })
    })
    console.log(resOrdersn);
    var timer = setInterval(function () {
      if (resOrdersn.length == ordersn.length) {
        clearInterval(timer)
        sendResponse({
          moneyEx: resOrdersn
        })
      }
    }, 500)


    // console.log(ordersn)
  }

  function updateList(response, sendResponse) {

    // 
    // var shopee = httpGet("https://banhang.shopee.vn/api/v2/orders/" + response.id, [])
    // console.log(shopee.order.shipping_traceno);
    // var docRef = firestore.collection("orderShopee").doc(id)
    // docRef.get().then(function (doc) {
    //   if (doc.exists) {
    //     const data = doc.data()
    //     // console.log(doc.id, "=>", doc.data());
    //     sendResponse({
    //       check: "exist",
    //       id: doc.id,
    //       traceno: data.shipping_traceno,
    //       shipping_fee: ((data.shipping_fee * 100) / 100).toLocaleString(),
    //       status: data.own_status.status,
    //       user_paid: ((data.buyer_paid_amount * 100) / 100).toLocaleString()
    //     })
    //   } else {
    //     console.log(doc.id + " not exist");
    //     sendResponse({
    //       check: "not exist",
    //       id: id
    //     })
    //   }
    // })

  }

  function cancel_status(response, sendResponse) {

    firestore.collection("orderShopee").doc(response.url).update({
      "cancel_status": true
    })
  }

  function updateNote(response, sendResponse) {
    firestore.collection("orderShopee").doc(response.url).update({
      "note": response.note
    }).then(function () {})
  }

  function update(response, sendRespose) {

    $.getJSON("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, function (logistic) {

      firestore.collection("orderShopee").doc(response.url).update({
        "logistic": $.parseJSON(JSON.stringify(logistic))
      }).then(function () {})
    })
  }

  function detailOrder(response, sendResponse) { //add đơn vào db

    var val;
    var user = new Object();
    console.log("hello");
    var promise = new Promise(function (resolve, reject) {
      resolve(httpGet("https://banhang.shopee.vn/api/v2/orders/" + response.url, []))
    })

    promise.then(function (data) {
      val = data
    }).then(function () {
      user = {
        id: val.users[0].id,
        name: val.users[0].username,
        phone: val.users[0].phone,
        email: val.users[0].email,
        gender: val.users[0].gender,
        create_at: val.users[0].ctime,
        birth: val.users[0].birth_timestamp
      }
      delete val['bundle-deals'];
      delete val['users'];
      val.own_status = {
        status: 1,
        create_at: new Date()
      }
      val.user = user
      val.create_at = new Date();
      val.note = "";
      val.cancel_status = false;
      val.logistic = httpGet("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, []);
      // console.log(val);
      for (var key in val['order']) {
        if (val['order'].hasOwnProperty(key)) {
          val[key] = val['order'][key];
        }
      }

    }).then(function () {
      delete val['order'];
      if (val.shipping_traceno) {
        firestore.collection("orderShopee").doc(response.url).set(
          val
        ).then(function () {
          firestore.collection("userShopee").doc(user.id.toString()).set(
            user
          ).then(() => {
            console.log("save successful");
          })
        })
      } else console.log("chua co mvd");

    })
  }

  function checkExist(response, sendResponse) {

    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
      hour = d.getHours();
      minutes = d.getMinutes()

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [day, month, year].join('-') + " " + [hour, minutes].join(':');
    }
    console.log(response.url);
    var found = dataToAdd.some(function (el) {
      return el.id == response.url;
    });
    if (found) {
      let index = dataToAdd.findIndex(x => x.id == response.url)
      getDetail(dataToAdd[index])
    } else {
      firestore.collection("orderShopee").doc(response.url).get().then(function (doc) {
        if (doc.exists) {
          console.log("from DB");
          getDetail(doc.data())
        } else {
          console.log("No such document!");
          sendResponse({
            check: "hello"
          })
        }
      })
    }

    function getDetail(data) {
      // var badge = data.idClasstify_urls.length;
      // console.log(data);
      // var id = response.url.toString()
      var selectedExpTags = [data.own_status.status];
      var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
      var date = formatDate(data.create_at).toString()
      sendResponse({
        check: "update",
        note: data.note,
        user: data.user.name,
        money: data.buyer_paid_amount,
        status: names[0]
      })
    }

    function callback() {}

  }

});