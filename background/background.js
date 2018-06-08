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

var app = angular.module('app', []);
app.controller('mainCtrl', function ($scope, request_center, message_center) {
  request_center.request_trigger();
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.mission) {
      case "checkExist":
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
    }
  });

function httpGet(theUrl, headers) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  for (var i = 0; i < headers.length; i++) {
    xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
  }
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

// console.log(httpGet("https://banhang.shopee.vn/api/v2/orders/509962928", []))  

function cancel_status(response, sendResponse) {
  var logistic_update
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
    val.own_status = "NEW"
    val.user = user
    val.create_at = new Date();
    val.note = "";
    val.cancel_status = false;
    val.logistic = httpGet("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, []);
    console.log(val);
    for (var key in val['order']) {
      if (val['order'].hasOwnProperty(key)) {
        val[key] = val['order'][key];
      }
    }

  }).then(function () {
    delete val['order'];
    console.log(val);
    firestore.collection("orderShopee").doc(response.url).set(
      val
    ).then(function () {
      firestore.collection("userShopee").doc(user.id.toString()).set(
        user
      ).then(() => {
        console.log("save successful");
      })
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

  var docRef = firestore.collection("orderShopee").doc(response.url);
  docRef.get().then(function (doc) {
    if (doc.exists) {
      const data = doc.data();
      // var badge = data.idClasstify_urls.length;
      console.log(data.ordersn);
      // var id = response.url.toString()
      var date = formatDate(data.create_at).toString()
      var options = {
        type: "list",
        title: 'Đơn: "' + data.ordersn + '" (đã có)',
        message: "Đã tồn tại trong Firestore",
        iconUrl: "../images/notification.png",
        items: [{
            title: "Mã vận đơn: ",
            message: data.shipping_traceno
          },
          {
            title: "Create at: ",
            message: date
          }
        ]
      }
      chrome.notifications.create("notify", options, callback);
      if(data.shipping_traceno){
        sendResponse({
          check: "update",
          note: data.note,
          user: data.user.name,
          money: data.buyer_paid_amount
        })
      }else{
        sendResponse({
          check: "hello"
        })
      }    


    } else {
      console.log("No such document!");
      sendResponse({
        check: "hello"
      })
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });

  function callback() {}

}