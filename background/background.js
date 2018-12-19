
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
console.log("run");

// navigator.usb.requestDevice({ filters: [] }).then(function (device) {

// console.log(device);

// });

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

var exArr = [{
  id: 1,
  status: 'MỚI'
}, {
  id: 2,
  status: 'ĐÃ GIAO'
}, {
  id: 3,
  status: 'DONE'
}, {
  id: 4,
  status: 'HỦY PHIẾU'
}]


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
  // var dataOnSnapshot = []
  var dataOnSnapshot = [];
  var dataSet = [];
  var dataSuggests = [];
  var dataExport = [];
  var exportSet = [];
  var productsSet = [];
  var dataProducts = [];
  var invoiceSet = []
  var dataInvoice = []
  var stockSet = []
  var dataStock = []

  var check = true
  chrome.storage.local.get('export', function (obj) {
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
      chrome.storage.local.set({
        export: []
      }, function () {
        console.log('Export is stored in Chrome storage');
      });
      chrome.storage.local.set({
        products: []
      });
      chrome.storage.local.set({
        invoices: []
      });
      chrome.storage.local.set({
        stocks: []
      });

      chrome.storage.local.get('data', function (obj) {
        dataOnSnapshot = obj.data;
        // console.log(dataOnSnapshot);
      });
      chrome.storage.local.get('export', function (obj) {
        dataExport = obj.export;
        // console.log(dataOnSnapshot);
      });
      chrome.storage.local.get('suggests', function (obj) {
        dataSuggests = obj.suggests;
        console.log(dataSuggests);
      });
      chrome.storage.local.get('products', function (obj) {
        dataProducts = obj.products;
      })
      chrome.storage.local.get('invoices', function (obj) {
        dataInvoices = obj.invoices;
      })
      chrome.storage.local.get('stocks', function (obj) {
        dataStock = obj.stocks;
      })
    } else {
      dataExport = obj.export;
      console.log(dataExport);
      chrome.storage.local.get('data', function (obj) {
        dataOnSnapshot = obj.data;
        // console.log(dataOnSnapshot);
      })
      // console.log(dataOnSnapshot);
      chrome.storage.local.get('suggests', function (obj) {
        dataSuggests = obj.suggests;
        console.log(dataSuggests);
      });
      chrome.storage.local.get('products', function (obj) {
        dataProducts = obj.products;
      })
      chrome.storage.local.get('invoices', function (obj) {
        dataInvoices = obj.invoices;
      })
      chrome.storage.local.get('stocks', function (obj) {
        dataStock = obj.stocks;
      })
    }
  });

  firestore.collection("exportCode").get()
  .then((querySnapshot)=>{
    querySnapshot.forEach(doc=>{
      if(doc.data().status == "MỚI"){
        firestore.collection("exportCode").doc(doc.id).update({
          "status": 1
        }).then(()=>{
          console.log("1");
        })
      }
      else if(doc.data().status == "SHIPPED"){
        firestore.collection("exportCode").doc(doc.id).update({
          "status": 2
        }).then(()=>{
          console.log("2");
        })
      }
      if(doc.data().status == "DONE"){
        firestore.collection("exportCode").doc(doc.id).update({
          "status": 3
        }).then(()=>{
          console.log("3");
        })
      }
    })
  })


  request_center.request_trigger()

  function filterData(obj, arr){
    var returnObj = new Object
    arr.forEach((e)=>{
      returnObj[e] = obj[e]
    })
    return returnObj
  }

  var isRunOnSnapshot = true
  chrome.tabs.onActivated.addListener(function (tabId) {
    var url;
    var tab_id = tabId.tabId;
    chrome.tabs.get(tab_id, function (tab) {


      url = tab.url.toString();
      if (isRunOnSnapshot && (url.indexOf("banhang.shopee.vn") !== -1 || url.indexOf("chrome-extension://") !== -1 || url.indexOf("detail.1688.com") !== -1)) {
        isRunOnSnapshot = false;
        console.log("RUN", url);
        console.log(dataSet);
        chrome.notifications.create('reminder', {
          type: 'basic',
          iconUrl: '../../images/get_started32.png',
          title: 'THÔNG BÁO NÀ !!!',
          message: 'Tiến trình theo dõi dữ liệu đã diễn ra...Thông báo này sẽ ẩn khi hoàn thành theo dõi'
        }, function (reminder) {
          console.log("created notification");
        })
        firestore.collection("orderShopee")
        .where("own_status.status", "<=", 6)
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              if (change.type === "added") {
                dataSet.push(filterData(obj, ["shopid", "packer", "id","actual_carrier", "actual_price", "buyer_address_name", "buyer_paid_amount","create_at","exportId", "own_status","item-models", "logistic","note","order-items","ordersn","products","shipping_fee","shipping_address","shipping_traceno","user","importMoneyId"]))
              }
              if (change.type === "modified") {
                let index = dataSet.findIndex(x => x.id == obj.id)
                // console.log("modified", obj);
                dataSet[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = dataSet.findIndex(x => x.id == obj.id)
                // console.log("removed", obj);
                dataSet.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.data = dataSet
                $scope.storageFirestore.syncOrders()
                dataOnSnapshot = dataSet
                check = true
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
        firestore.collection("exportCode")
        .where("status", "<=", 2)
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              obj.id = change.doc.id
              if (change.type === "added") {
                // var found = dataExport.some(function (el) {
                //   return el.id == obj.id;
                // });
                // if (!found) {
                // console.log("added", obj);
                exportSet.push(obj)
                // }

              }
              if (change.type === "modified") {
                let index = exportSet.findIndex(x => x.id == obj.id)
                console.log("modified", obj);
                exportSet[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = exportSet.findIndex(x => x.id == obj.id)
                console.log("removed", obj);
                exportSet.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.exports = exportSet
                $scope.storageFirestore.syncExports()
              }
            });
          })
        firestore.collection("products")
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              obj.id = change.doc.id
              if (change.type === "added") {
                productsSet.push(obj)
              }
              if (change.type === "modified") {
                let index = productsSet.findIndex(x => x.id == obj.id)
                console.log("modified", obj);
                productsSet[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = productsSet.findIndex(x => x.id == obj.id)
                console.log("removed", obj);
                productsSet.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.products = productsSet;
                $scope.storageFirestore.syncProducts();
              }
            });
          })
        firestore.collection("invoiceBuy")
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              obj.id = change.doc.id
              if (change.type === "added") {
                invoiceSet.push(obj)
              }
              if (change.type === "modified") {
                let index = invoiceSet.findIndex(x => x.id == obj.id)
                console.log("modified", obj);
                invoiceSet[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = invoiceSet.findIndex(x => x.id == obj.id)
                console.log("removed", obj);
                invoiceSet.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.invoices = invoiceSet;
                $scope.storageFirestore.syncInvoices();
              }
            });
          })
        firestore.collection("stock")
          .onSnapshot(function (snapshot) {
            console.log("connected");
            snapshot.docChanges.forEach(function (change, i) {
              var obj = change.doc.data()
              obj.id = change.doc.id
              if (change.type === "added") {
                stockSet.push(obj)
              }
              if (change.type === "modified") {
                let index = stockSet.findIndex(x => x.id == obj.id)
                console.log("modified", obj);
                stockSet[index] = obj
              }
              // console.log(change);
              if (change.type === "removed") {
                let index = stockSet.findIndex(x => x.id == obj.id)
                console.log("removed", obj);
                stockSet.splice(index, 1);
                // let index = dataOnSnapshot.findIndex(x => x.id == obj.id)
                // dataOnSnapshot[index] = obj
              }
              if ((i + 1) == snapshot.docChanges.length) {
                $scope.storageFirestore.stocks = stockSet;
                $scope.storageFirestore.syncStock();
              }
            });
        })
      }


    });

  });

  chrome.storage.onChanged.addListener(function (changes) {
    dataOnSnapshot = changes.data.newValue
  })
  var check = false



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
          return true;
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
          return true;
          break;
        case "getProducts":
          getProducts(request, sendResponse)
          return true
          break;
        case "pushFirestore":
          pushFirestore(request, sendResponse);
          return true;
          break;
        case "getSingle":
          getSingle(request, sendResponse)
          return true
          break
        case "saveProductNew":
          saveProductNew(request, sendResponse)
          return true
          break
        case "ready":
          ready(request, sendResponse)
          return true
          break
        case "updateEx":
          updateEx(request, sendResponse)
          return true
          break
        case "updateExFromHome":
          updateExFromHome(request, sendResponse)
          return true
          break
        case "updatePro":
          updatePro(request, sendResponse)
          return true
          break
      }
    });

  function updatePro(response, sendResponse){
    console.log(response.id, response.classify);
    firestore.collection("products").doc(response.id).set({
      "linked_classify": response.linked_classify,
      "classify": response.classify
    },{
      merge: true
    }).then(()=>{
      sendResponse()
    })
  }


  function updateExFromHome(response, sendResponse) {
    var count = 0
    var batch = firestore.batch()
    chrome.storage.local.get('export', function (keys) {
      response.exs.forEach(function (ex, index1) {
        var selectedExpTags = [ex];
        var names = selectedExpTags.map(x => keys.export.find(y => y.id == x).orders)
        var okey = []
        names[0].forEach(function (order, index2) {
          firestore.collection("orderShopee").doc(order.toString()).get()
            .then(function (doc) {
              const data = doc.data()
              var status = data.own_status.status
              if (status == 5 || status == 6 || status == 11) {
                okey.push(order)
              }
              if (okey.length == names[0].length) {
                console.log(ex, names[0]);
                var docRef = firestore.collection("exportCode").doc(ex)
                batch.update(docRef, {
                  "status": 2
                })
                count = count + 1
              }
              if ((index1 + 1) == response.exs.length && (index2 + 1) == names[0].length) {
                batch.commit().then(() => {
                  sendResponse()
                  alert("ĐÃ CHUYỂN " + count + " PHIẾU XUẤT VỀ ĐÃ GIAO")
                })
              }
            })
        })
      });
    })
  }

  function updateEx(response, sendResponse) {
    var dataRes = []
    response.data.forEach(function (item, index1) {
      var okey = []

      item.orders.forEach(function (orId, index2) {
        // console.log(item.exId,orId);
        firestore.collection("orderShopee").doc(orId.toString()).get()
          .then(function (doc) {
            const data = doc.data()
            var status = data.own_status.status
            if (status == 9 || status == 11 || status == 8) {
              okey.push(orId)
              // console.log(okey);              
            }
          }).then(() => {
            if (okey.length == item.orders.length) {

              if (jQuery.inArray(item.exId, dataRes) == -1) {
                dataRes.push(item.exId)
              }
            }
            console.log(index1 + 1, response.data.length, index2 + 1, item.orders);
            if ((index1 + 1) == response.data.length && (index2 + 1) == item.orders.length) {
              console.log(dataRes);
              var batch = firestore.batch()
              dataRes.forEach(function (data, i) {
                var docRef = firestore.collection("exportCode").doc(data)
                batch.update(docRef, {
                  "status": 3
                })
                if ((i + 1) == dataRes.length) {
                  batch.commit().then(() => {
                    alert("ĐÃ CHUYỂN " + dataRes.length + " PHIẾU XUẤT VỀ HOÀN THÀNH")
                  })
                }
              })
            }
          })
      })
      // 
    })




    // var timer = setInterval(function () {  
    //   console.log(count);
    //   if(dataRes.length == count){
    //     clearInterval(timer)
    //     console.log(dataRes);
    //     sendResponse({dataRes: dataRes})
    //   }
    // },1000)
  }

  function ready(response, sendResponse) {
    var checkready = setInterval(function () {

      if (check) {
        clearInterval(checkready)
        console.log("READY");
        sendResponse()
      }
    }, 1000)
  }



  function saveProductNew(response, sendResponse) {
    response.obj.create_at = new Date()
    console.log(response);
    firestore.collection("products").doc(response.obj.id).set(
      response.obj
    ).then(function () {
      sendResponse()
    })  
  }

  function getSingle(response, sendResponse) {
    firestore.collection("orderShopee").doc(response.id.toString()).get()
      .then(function (doc) {
        if (doc.exists) {
          const data = doc.data()
          sendResponse({
            state: true,
            buyer_paid_amount: data.buyer_paid_amount,
            shipping_fee: data.shipping_fee,
            id: response.id,
            exportId: data.exportId ? data.exportId : "Chưa có Mã Phiếu Xuất",
            status: data.own_status.status
          })
        } else {
          sendResponse({
            state: false
          })
        }

      })
  }

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
    var arrExId = []
    var batch = firestore.batch()

    $.each(response.updateLogShopee, function (i, val) {
      var log = val.log;
      console.log(log);
      log = log ? log : ""
      var test = log

      var docRef = firestore.collection("orderShopee").doc(val.id.toString());
      batch.update(docRef, {
        "logistics_status": log
      })

      if (log == 2) {
        let own_log = 5;
        var docRef = firestore.collection("orderShopee").doc(val.id.toString());
        batch.update(docRef, {
          "own_status": {
            status: own_log,
            create_at: new Date()
          }
        })
      } else if (log == 5) {
        let own_log = 6;
        var docRef = firestore.collection("orderShopee").doc(val.id.toString());
        batch.update(docRef, {
          "own_status": {
            status: own_log,
            create_at: new Date()
          }
        })
      }

      if (test != log) {
        console.log(log);
      }
      var docRef = firestore.collection("orderShopee").doc(val.id.toString());
      batch.update(docRef, {
        "logistic": val.logistics
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
    console.log("hompe");
    const promise = request_center.request_trigger_shopee_backend_homepage
    // new Promise(function (resolve, reject) {
    //   resolve() = request_center.request_trigger_shopee_backend_homepage()
    //   return resolve()
    // })
    promise.then(function () {
        chrome.storage.local.get('shopCurrent', function (keys) {
          if (keys.shopCurrent.length > 0) {
            var res = [];
            var loop = [
              1,
              4,
              5
            ]


            $.each(loop, function (i, val) {
              console.log(val);
              var logistics = [];
              var homeArray = dataOnSnapshot.filter(function (event) {
                return event.own_status.status == val && event.shopid == keys.shopCurrent[0].shopid;
              });
              console.log(homeArray);
              var ids = []
              homeArray.forEach(function (doc) {
                const data = doc
                var obj = new Object()
                obj = {
                  id: doc.id,
                  logistics: data.logistic['logistics-logs'].length > 0 ? data.logistic['logistics-logs'][0].description : "",
                  logistics_status: data.logistics_status,
                  exId: data.exportId ? data.exportId : ""
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
            console.log(res);
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
        });
      }

    )

  }

  function getProducts(response, sendResponse) {
    var states = []
    firestore.collection("1688_products").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const data = doc.data();
        states.push({
          name: data.name,
          SKU: data.SKU_name,
          image: data.images ? data.images[0] : ''
        });
      })
    }).then(function () {
      // console.log(states);
      sendResponse({
        data: states
      })
    });
  }

  function pushFirestore(response, sendResponse) {
    // console.log(response);
    var docRef = firestore.collection("1688_products").doc(response.SKU_name.toString());
    docRef.set({
      "images": response.images,
      "id1688": response.id1688,
      "name": response.name,
      "SKU_name": response.SKU_name,
      "SKU_classify": response.SKU_classify
      // }).then(function () {
      //   var docSKUc = docRef.collection('SKU_classify');
      //   response.SKU_classify.map(x => {
      //     docSKUc.doc(x.spSku.toString()).set(x);
      //   })
    }).then(sendResponse())
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
      "orders": response.id,
      "shopeePaid": response.sumShopeePaid,
      "buyerPaid": response.sumBuyerPaid
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
            var money = parseInt(((data.buyer_paid_amount) * 100) / 100)
            money = data.voucher_absorbed_by_seller ? money - voucher_price : money
            var selectedExpTags = [data.own_status.status];
            var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
            obj = {
              orderId: val,
              vc: voucher_price,
              money: money,
              shipping_fee: parseInt(((data.shipping_fee) * 100) / 100),
              id: doc.id,
              status: names[0],
              traceno: data.shipping_traceno
            }
            resOrdersn.push(obj)
          })
        } else {
          obj = {
            orderId: val,
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
          ).then((doc) => {
            console.log("save successful");
            sendResponse({
              check: "success",
              buyer_paid_amount: val.buyer_paid_amount,
              shipping_fee: val.shipping_fee,
              id: response.url,
              exportId: "Chưa có Mã Phiếu Xuất",
              status: val.own_status.status
            })
          })
        })
      } else sendResponse({
        check: "fail"
      })

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
    var found = dataOnSnapshot.some(function (el) {
      return el.id == response.url;
    });
    if (found) {
      let index = dataOnSnapshot.findIndex(x => x.id == response.url)
      getDetail(dataOnSnapshot[index])
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

      if (data.exportId) {
        firestore.collection("exportCode").doc(data.exportId).get()
          .then(function (doc) {
            sendResponse({
              check: "update",
              note: data.note,
              user: data.user.name,
              money: data.buyer_paid_amount,
              status: names[0],
              exportId: data.exportId,
              exDate: doc.data().create_at.seconds * 1000
            })
          })

      } else {
        sendResponse({
          check: "update",
          note: data.note,
          user: data.user.name,
          money: data.buyer_paid_amount,
          status: names[0],
          exportId: "CHƯA GIAO ĐƠN",
          exDate: (new Date()).getTime()
        })
      }

    }

    function callback() {}

  }

});