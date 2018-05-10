app.service('request_center', function() {
    //lắng nghe request
    this.request_trigger = function () {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function(details) {
              var match_orderid = details.url.match(/\/orders\/(\d+)\//i) == null ? 0 : details.url.match(/\/orders\/(\d+)\//);
            
                var match_itemid = details.url.match(/\?item\_id\=(\d+)\&shop_id/i)==null?0:details.url.match(/\?item\_id\=(\d+)\&shop_id/i);
                var match_shopid = details.url.match(/\&shop_id\=(\d+)/i)==null?0:details.url.match(/\&shop_id\=(\d+)/i);      
                if(match_itemid.length > 1 && match_shopid.length > 1){//day la request lay thong tin 1 sp
                    for (var i = 0; i < details.requestHeaders.length; ++i) {
                        if (details.requestHeaders[i].name === 'If-None-Match-') {
                            

                            //firebase.database().ref('/sitems/' + match_itemid[1]).update(objRes);
            
                            // //console.log(match_itemid[1] + ", " + );
                            // //details.requestHeaders.splice(i, 1);
                            
                            var colSp_product = firestore.collection("sp_product");
                            
                            console.log(match_itemid[1]);
                            colSp_product.doc(match_itemid[1]).get().then(function(doc, details) {
                                console.log(details);
                                if (doc.exists) {
                                    console.log("Document data:", doc.data());
                                } else {
                                            var objRes = httpGet(details.url, [['If-None-Match-', details.requestHeaders[i].value]]);
                                            objRes.key = details.requestHeaders[i].value;
                                            objRes.createdTime = firebase.database.ServerValue.TIMESTAMP;
                                            console.log(objRes);
                                            // Add a new document in collection "cities"
                                            colSp_product.doc(match_itemid[1]).set(objRes)
                                            .then(function() {
                                                console.log("Document successfully written!");
                                            })
                                            .catch(function(error) {
                                                console.error("Error writing document: ", error);
                                            });


                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                }
                            }).catch(function(error) {
                                console.log("Error getting document:", error);
                            });


                        }
                    }
                }
            
              // return {requestHeaders: details.requestHeaders};
            },
            {urls: ["https://shopee.vn/api/v1/item_detail*", "https://banhang.shopee.vn/api/v2/orders*"]},
            ["blocking", "requestHeaders"]);
    }
});