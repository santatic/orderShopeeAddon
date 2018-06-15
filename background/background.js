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

function updatePayment(response, sendResponse) {
  var check = []
  var batch = firestore.batch()
  $.each(response.id, function (i, id) {
    console.log(id);
    var docRef = firestore.collection("orderShopee").doc(id);
    batch.update(docRef, {
      "own_status": "PAID"
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
  },500)
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
          obj = {
            vc: voucher_price,
            money: parseInt(((data.buyer_paid_amount) * 100) / 100) - voucher_price,
            shipping_fee: parseInt(((data.shipping_fee) * 100) / 100),
            id: doc.id
          }
          resOrdersn.push(obj)
        })
      } else {
        obj = {
          money: "chua co trong Firestore",
          shipping_fee: "chua co trong Firestore",
          id: ""
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
  var id = response.id;
  // var shopee = httpGet("https://banhang.shopee.vn/api/v2/orders/" + response.id, [])
  // console.log(shopee.order.shipping_traceno);
  var docRef = firestore.collection("orderShopee").doc(id)
  docRef.get().then(function (doc) {
    if (doc.exists) {
      const data = doc.data()
      console.log(doc.id, "=>", doc.data());
      sendResponse({
        check: "exist",
        id: doc.id,
        traceno: data.shipping_traceno,
        shipping_fee: ((data.shipping_fee * 100) / 100).toLocaleString(),
        status: data.own_status,
        user_paid: ((data.buyer_paid_amount * 100) / 100).toLocaleString()
      })
    } else {
      console.log(doc.id + " not exist");
      sendResponse({
        check: "not exist",
        id: id
      })
    }
  })

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
  var docRef = firestore.collection("orderShopee").doc(response.url);
  docRef.get().then(function (doc) {
    if (doc.exists) {
      const data = doc.data();
      // var badge = data.idClasstify_urls.length;
      console.log(data.ordersn);
      // var id = response.url.toString()
      var date = formatDate(data.create_at).toString()
      sendResponse({
        check: "update",
        note: data.note,
        user: data.user.name,
        money: data.buyer_paid_amount
      })
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