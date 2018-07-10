app.service('request_center', function (helper_center) {
    //lắng nghe request
    this.request_trigger = function () {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                // console.log(details);
                // console.log(helper_center.checkUrlContainSubstring(details.url, ["banhang.shopee.vn/api/v2/orders/", "limit=40", "offset"]));
                // if(helper_center.checkUrlContainSubstring(details.url, ["banhang.shopee.vn/api/v2/orders/?", "limit=40", "offset"]) == true){
                //     console.log("done");
                //     let data = helper_center.httpGet(details.url,[])
                // }   
                var match_orderid = details.url.match(/\/orders\/(\d+)\//i) == null ? 0 : details.url.match(/\/orders\/(\d+)\//);

                var match_itemid = details.url.match(/\?item\_id\=(\d+)\&shop_id/i) == null ? 0 : details.url.match(/\?item\_id\=(\d+)\&shop_id/i);
                var match_shopid = details.url.match(/\&shop_id\=(\d+)/i) == null ? 0 : details.url.match(/\&shop_id\=(\d+)/i);
                if (match_itemid.length > 1 && match_shopid.length > 1) { //day la request lay thong tin 1 sp
                    for (var i = 0; i < details.requestHeaders.length; ++i) {
                        if (details.requestHeaders[i].name === 'If-None-Match-') {

                            var colSp_product = firestore.collection("sp_product").doc(match_itemid[1]);

                            console.log(match_itemid[1]);
                            colSp_product.get().then(function (doc) {
                                if (doc.exists) {
                                    console.log("Document data:", doc.data());
                                } else {
                                    console.log("No such document!");
                                    // console.log(i);
                                    // console.log(details.requestHeaders[8].value);
                                    var objRes = httpGet(details.url, [
                                        ['If-None-Match-', details.requestHeaders[i - 1].value]
                                    ]);
                                    objRes = JSON.stringify(objRes)
                                    objRes = JSON.parse(objRes)
                                    objRes.key = details.requestHeaders[i - 1].value;
                                    objRes.createdTime = firebase.database.ServerValue.TIMESTAMP;
                                    console.log(objRes);
                                    // Add a new document in collection "cities"
                                    colSp_product.set(objRes)
                                        .then(function () {
                                            console.log("Document successfully written!");
                                        })
                                        .catch(function (error) {
                                            console.error("Error writing document: ", error);
                                        });


                                    // doc.data() will be undefined in this case

                                }
                            }).catch(function (error) {
                                console.log("Error getting document:", error);
                            });


                        }
                    }
                }

                // return {requestHeaders: details.requestHeaders};
            }, {
                urls: ["https://shopee.vn/api/v1/item_detail*", "https://banhang.shopee.vn/api/v2/orders*"]
            }, ["blocking", "requestHeaders"]);
    }

    // chrome.runtime.onMessage.addListener(
    //     function (request, sender, sendResponse) {
    //         switch (request.mission) {
    //             case "updateList":
    //                 request_trigger_shopee_backend_orders_list(request, sendResponse)
    //                 return true;
    //                 break;
    //         }
    //     })

    this.request_trigger_shopee_backend_orders_list = function () {
        var arrIdExisted = [],
            arrIdNotExisted = []
        var checkArr
        var obj = new Object()
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                if (helper_center.checkUrlContainSubstring(details.url, ["banhang.shopee.vn/api/v2/orders/?", "limit=40", "offset"]) == true) {
                    console.log("done");
                    // var docRef = firestore.collection("orderShopee");
                    // let data = helper_center.httpGet(details.url, [])
                    // data.orders.forEach(function (val) {
                    //     docRef.doc((val.id).toString()).get().then(function (doc) {
                    //         if (doc.exists) {
                    //             arrIdExisted.push(val.id)
                    //             // console.log(doc.data());
                    //         } else {
                    //             arrIdNotExisted.push(val.id)
                    //             // console.log("not existed");
                    //         }
                    //     }).then(function () {})
                    // })
                    // var timer = setInterval(function () {
                    //     if (arrIdExisted.length + arrIdNotExisted.length == data.orders.length) {
                    //         var res = new Object()
                    //         res = {
                    //             exist: arrIdExisted,
                    //             notExist: arrIdNotExisted
                    //         }
                    //         // return res
                    //         clearInterval(timer)
                    //     }
                    // }, 100)
                }
            }, {
                urls: ["https://banhang.shopee.vn/api/v2/orders*"]
            }, ["blocking", "requestHeaders"]);

       
    }

});