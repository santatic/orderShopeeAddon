console.log('run');

var config = {
    // apiKey: "AIzaSyDVNIaP7FBvbf5MuQ0snFvus83BJYCkLnc",
    // authDomain: "shopngocanh-2018.firebaseapp.com",
    // databaseURL: "https://shopngocanh-2018.firebaseio.com",
    // projectId: "shopngocanh-2018",
    // storageBucket: "shopngocanh-2018.appspot.com",
    // messagingSenderId: "759441836020"
    apiKey: "AIzaSyDQGNExQfK_QGLyGrqGZ4RE247-l3M84bA",
    authDomain: "ext-chrome-6aaac.firebaseapp.com",
    databaseURL: "https://ext-chrome-6aaac.firebaseio.com",
    projectId: "ext-chrome-6aaac",
    storageBucket: "ext-chrome-6aaac.appspot.com",
    messagingSenderId: "661559671750"
};
firebase.initializeApp(config);
var db = firebase.firestore();

// db.collection("orderShopee").get().then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//         $.getJSON("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + doc.id, function (logistic) {
//             console.log(doc.id, '=> ', $.parseJSON(JSON.stringify(logistic)))
//         })
//     })
// })

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
    db.collection("orderShopee").doc(response.url).update({
        "cancel_status": true
    })
}

function updateNote(response, sendResponse) {
    db.collection("orderShopee").doc(response.url).update({
        "note": response.note
    }).then(function () {})
}

function update(response, sendRespose) {

    $.getJSON("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, function (logistic) {

        db.collection("orderShopee").doc(response.url).update({
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
        val.user = user
        val.create_at = new Date();
        val.note = "";
        val.cancel_status = false;
        val.logistic = httpGet("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, []);
        console.log(val);

        // db.collection("orderShopee").doc(response.url).set(
        //     val
        // ).then(function () {
        //     db.collection("userShopee").doc(user.id.toString()).set(
        //         user
        //     )
        // })
    })
    // $.getJSON("https://banhang.shopee.vn/api/v2/orders/" + response.url, function (result) {
    //     (function(){
    //     val = httpGet("https://banhang.shopee.vn/api/v2/orders/" + response.url, [])      

    //     user = {
    //         id: val.users[0].id,
    //         name: val.users[0].username,
    //         phone: val.users[0].phone,
    //         email: val.users[0].email,
    //         gender: val.users[0].gender,
    //         create_at: val.users[0].ctime,
    //         birth: val.users[0].birth_timestamp
    //     }
    //     val.user = user
    //     val.create_at = new Date();
    //     val.note = "";
    //     val.cancel_status = false
    // }).then(function () {
    //     delete val['bundle-deals'];
    //     delete val['users'];
    //     console.log(val);
    // $.getJSON("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + response.url, function (logistic) {
    //     val.logistic = $.parseJSON(JSON.stringify(logistic))
    // }).then(function () {
    //     console.log(val);
    //     console.log(user);
    //     db.collection("orderShopee").doc(response.url).set(
    //         val
    //     ).then(function () {
    //         db.collection("userShopee").doc(user.id.toString()).set(
    //             user
    //         )
    //     })
    // })
    // });
}

// function save(response, sendResponse) {
//     console.log(response.name);
//     db.collection("orderShopee").doc(response.url).set({
//             create_at: new Date(),
//             orderId: response.orderId,
//             trackingId: response.trackingId,
//             name: response.name,
//             address: response.address,
//             phone: response.phone,
//             'priceTotal(vnđ)': response.price,
//             products: response.products,
//             urlId: response.url,
//             note: response.note
//         })
//         .then(function (docRef) {
//             console.log("done!");
//         })
//         .catch(function (error) {
//             console.error("Error adding document: ", error);
//         });
// }

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

    var docRef = db.collection("orderShopee").doc(response.url);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            const data = doc.data();
            // var badge = data.idClasstify_urls.length;
            console.log(data.order.ordersn);
            // var id = response.url.toString()
            var date = formatDate(data.create_at).toString()
            var options = {
                type: "list",
                title: 'Đơn: "' + data.order.ordersn + '" (đã có)',
                message: "Đã tồn tại trong Firestore",
                iconUrl: "../images/notification.png",
                items: [{
                        title: "Mã vận đơn: ",
                        message: data.order.shipping_traceno
                    },
                    {
                        title: "Create at: ",
                        message: date
                    }
                ]
            }
            chrome.notifications.create("notify", options, callback);
            sendResponse({
                check: "update",
                note: data.note,
                user: data.user.name,
                money: data.order.buyer_paid_amount
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