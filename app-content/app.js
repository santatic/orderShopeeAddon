// var config = {
// 	apiKey: 'AIzaSyB5a-MpgrGUzsGUntJW6vSE_oryGxeN7jw',
// 	authDomain: 'shopee.vn',
// 	databaseURL: 'https://test-f8d9d.firebaseio.com',
// 	storageBucket: 'test-f8d9d.appspot.com'
// };
// firebase.initializeApp(config);
'use strict';
var app = angular.module("myapp", ['angularMoment']); //"firebase"

app.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.service('getList', function () {
    this.getList = function () {
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

        function httpGet(theUrl, headers, i) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            for (var i = 0; i < headers.length; i++) {
                xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
            }
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        }

        function getListFromStorage() {


            chrome.storage.local.get('data', function (keys) {
                keys.data
                var timer = setInterval(function () {
                    $('div.order-items').not('.loading').find(".order-items__item").each(function (index, value) {
                        var _this = $(this);
                        var id = $(this).attr("href");
                        if (id) {
                            id = id.match(/(\d+)/g).toString();
                            clearInterval(timer);
                            var obj = keys.data.find(function (obj) {
                                return obj.id == id;
                            });

                            var optionsUrl = chrome.extension.getURL("options.html#/");

                            _this.find(".ct-buyer > div").find('span#test').remove()
                            if (obj) {
                                var exportId
                                if (!obj.exportId) {
                                    exportId = "Chưa có Mã Phiếu Xuất"
                                } else {
                                    exportId = obj.exportId
                                }
                                if (obj.logistic["logistics-logs"].length > 0  && obj.logistic['logistics-logs'][0].description !== "") {
                                    var logistics = obj.logistic['logistics-logs'][0].description
                                    logistics = logistics.indexOf('[Vietnam]') !== -1 ? logistics.replace('[Vietnam]', '') : logistics
                                    console.log(logistics);
                                    _this.find(".ct-status").html(logistics)
                                    if (logistics.indexOf('Thành công - Phát thành công') !== -1 || logistics.indexOf('Đã giao hàng/Chưa đối soát') !== -1) {
                                        // var ItemId = []
                                        obj['order-items'].forEach((item, index) => {
                                            // console.log(item.snapshotid + " = " + item.modelid);
                                            let product = obj['products'].find(o => o.id === item.snapshotid);
                                            // console.log(product);
                                            // let productImage = data['products'].find(o => o.id === item.images[0]);
                                            let model = obj['item-models'].find(o => o.id === item.modelid)
                                            var promise = new Promise(function (resolve, reject) {
                                                resolve((httpGet("https://shopee.vn/api/v1/comment_list/?item_id=" + model.itemid + "&shop_id=20340126&limit=50", [])).comments)
                                            })
                                            promise.then(function (comments) {
                                                var found = comments.find(el => el.username == obj.user.name);
                                                if (found) {
                                                    // console.log(found);
                                                    var linkcomment = "https://shopee.vn/" + product.name + "-i.20340126." + model.itemid
                                                    _this.find(".item:eq(" + index + ")").find(".ct-item-product-inner").append("<b style='font-size:18px;color:#000'><a target='_blank' href='" + linkcomment + "'>" + found.rating_star + "<span style='color:#ff5722'>&bigstar;</span></a></b>" + "<span title='" + found.comment + "'>" + found.comment + "</span>")
                                                } else {
                                                    // _this.find(".ct-buyer > div").append("Khách chưa đánh giá")
                                                    console.log("notFound");
                                                }
                                                // ItemId.push({
                                                //     comments: found,
                                                //     modelId : model.itemid,
                                                //     name: product.name,
                                                //     model: model.name,
                                                //     imageUrl: "https://cf.shopee.vn/file/" + product.images[0] + "_tn"                            
                                                // })
                                            })
                                        });
                                        // console.log(id, ItemId);

                                    }
                                }

                                var status
                                if (obj.own_status.status == 1 || obj.own_status.status == 4 || obj.own_status.status == 5) {
                                    var selectedExpTags = [obj.own_status.status];
                                    var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                    status = obj.own_status.status == 4? '<a style="background: rgba(46, 192, 20, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names[0] + ' </a>' : obj.own_status.status == 5?'<a style="background: rgb(255, 87, 34);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names[0] + ' </a>': '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names[0] + ' </a>'
                                } else {
                                    status = ""
                                }
                                _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((obj.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((obj.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + obj.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank" href="' + optionsUrl + "export/" + exportId + '">#' + exportId + '</a>' + status + '</b></span>')
                            } else {
                                _this.find(".ct-buyer > div").find('#'+id+'').remove()
                                _this.find(".ct-buyer > div").find('.'+id+'').remove()
                                if(_this.find('.ct-logistics div.label.green').length > 0){
                                    chrome.runtime.sendMessage({
                                        mission: "getSingle",
                                        id: id
                                    }, function (response){
                                        if(response.state){
                                            _this.find(".ct-buyer > div").find('#'+id+'').remove()
                                            _this.find(".ct-buyer > div").find('.'+id+'').remove()
                                            var selectedExpTags = [response.status];
                                            var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                            var status = names[0]
                                            _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((response.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((response.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + response.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank">#' + response.exportId + '</a>' + '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + status + ' </a>' + '</b></span>')
                                            
                                        }else{
                                            chrome.runtime.sendMessage({
                                                mission: "detailOrder",
                                                url: id
                                            }, function (response) {
                                                
                                                console.log(response);
                                                if(response.check == "success"){
                                                    _this.find(".ct-buyer > div").find('#'+id+'').remove()
                                                    _this.find(".ct-buyer > div").find('.'+id+'').remove()
                                                    var selectedExpTags = [response.status];
                                                    var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                                    var status = names[0]
                                                    _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((response.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((response.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + response.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank">#' + response.exportId + '</a>' + '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + status + ' </a>' + '</b></span>')
                                                    
                                                }else{
                                                    alert("đơn chưa có mã phiếu xuất")
                                                    _this.find(".ct-buyer > div").find('#'+id+'').css({
                                                        "display": "block"
                                                    })
                                                    _this.find(".ct-buyer > div").find('.'+id+'').text("CHƯA ĐƯỢC THEO DÕI")
                                                }
                                            })
                                        }
                                        
                                    })
                                }else{
                                    _this.find(".ct-buyer > div").append(' <span style="background: #ff3d3e;border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;" class="'+id+'">&nbsp<b>CHƯA ĐƯỢC THEO DÕI</b>&nbsp</span>')
                                    _this.find(".ct-actions").click(function(){
                                        console.log(id);
                                        var timer = setInterval(function () {  
                                            if(_this.find('.ct-logistics div.label.green').length > 0){
                                                clearInterval(timer)
                                                console.log("sending...");
                                                chrome.runtime.sendMessage({
                                                    mission: "detailOrder",
                                                    url: id
                                                }, function (response) {
                                                    
                                                    console.log(response);
                                                    if(response.check == "success"){
                                                        new Noty({
                                                            layout: 'bottomRight',
                                                            theme: "relax",
                                                            type: 'success',
                                                            timeout: 1500,
                                                            text: 'Thêm Đơn Thành Công'
                                                        }).show();
                                                        _this.find(".ct-buyer > div").find('#'+id+'').remove()
                                                        _this.find(".ct-buyer > div").find('.'+id+'').remove()
                                                        var selectedExpTags = [response.status];
                                                        var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                                        var status = names[0]
                                                        _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((response.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((response.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + response.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank">#' + response.exportId + '</a>' + '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + status + ' </a>' + '</b></span>')
                                                        
                                                    }else{
                                                        
                                                    }
                                                })
                                            }
                                        },1000)
                                    })
                                    // $('a#'+id+'').click(function(){
                                    // if( _this.find('div.label.green').length > 0){
                                    //     console.log($(this).attr("id"));
                                    //     _this.find(".ct-buyer > div").find('#'+id+'').css({
                                    //         "display": "none"
                                    //     })
                                    //     _this.find(".ct-buyer > div").find('.'+id+'').text("ĐANG THEO DÕI...")
                                        
                                    // }
                                        
                                    // })
                                }
                                
                            }
                        }

                    })
                }, 1000)
            })
        }
        getListFromStorage()
        $('a.tabs__tab').on('click', function () {
            getListFromStorage()
        });

        var appear = setInterval(function () {
            var pan = $('.shopee-pagination--footer ul li').text()
            if (pan) {
                clearInterval(appear);
                $('.shopee-pagination--footer ul li').click(function () {
                    getListFromStorage()
                })
            }
        }, 1000)

    }
})

app.service('Chat', function () {
    this.getSuggests = function () {
        var states = []
        chrome.storage.local.get('suggests', function (keys) {
            states = []
            keys.suggests.forEach(function (val) {
                states.push(val.suggest_chat)
            })
        })
        chrome.storage.onChanged.addListener(function (changes) {
            states = []
            // console.log(changes.suggests);
            // if(typeof changes.suggests.newValue !== undefined){
                changes.suggests.newValue.forEach(function (val) {
                    states.push(val.suggest_chat)
                    // console.log(val.suggest_chat);
                });
            // }
            
        })


        // var states = Chat;
        var timer = setInterval(function () {

            var input = $('.shopee-chat-root .chat-panel textarea')
            input.keyup(function (e) {
                setTimeout(function () {
                    $('.shopee-chat-root .shopee-chat__scrollable').scrollTop($('.shopee-chat-root .shopee-chat__scrollable')[0].scrollHeight)
                }, 200)

            })

            if (input.length && (states.length > 0)) {

                // $('div.chat-panel').prepend('<div class="suggest"></div>')

                console.log("here");

                clearInterval(timer)

                input.autocomplete({
                    delay: 100,
                    minLength: 1,
                    autoFocus: true,
                    source: states,
                    appendTo: 'div.chat-content',
                    focus: function (event, ui) {
                        // prevent autocomplete from updating the textbox
                        console.log(ui.item.label);
                        $('li.ui-menu-item').css("color", "black")
                        $('li:contains("' + ui.item.label + '")').css("color", "red")

                    },
                }).data("ui-autocomplete")._renderItem = function (ul, item) {

                    $('.ui-helper-hidden-accessible').css({
                        "display": "none"
                    })

                    return $("<li style='cursor: pointer' >" + item.label + "</li>").appendTo(ul);
                };




            } else {
                console.log("notyet");
            }
        }, 1000)
    }

})

//autocomplete sản phẩm 1688
app.service('titleProducts', function () {
    this.SKU = '';
    this.getSKU = function () {
        return SKU;
    }
    this.getSuggests = function () {
        var states = []

        //lấy từ storage

        // chrome.storage.local.get('suggests', function (keys) {
        //     keys.suggests.forEach(function (val) {
        //         states.push(val.suggest_chat)
        //     })
        // })
        // var states = Chat;

        //lấy từ firestore
        chrome.runtime.sendMessage({
            mission: "getProducts"
        }, function (response) {
            // console.log(response.data);
            states = response.data;
        })

        var timer = setInterval(function () {

            var input = $('input#product_name')

            if (input.length && (states.length > 0)) {

                // console.log("here");

                clearInterval(timer)

                input.autocomplete({
                    delay: 100,
                    minLength: 1,
                    source: states.map(x => x.name),
                    appendTo: 'div.suggestProducts',
                    select: function (event, ui) {
                        states.map(x => {
                            if (x.name == ui.item.value) {
                                SKU = x.SKU;
                                // console.log(SKU);
                            }
                        })
                    }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var img = '';
                    states.map(x => {
                        if (x.name == item.label) {
                            img = x.image.replace('400x400', '30x30');
                        }
                    })
                    return $("<li style='cursor: pointer' ><img src='" + img + "'>" + item.label + "</li>").appendTo(ul);
                };
            } else {
                console.log("notyet");
            }
        }, 500)
    }

})



app.factory('dataService', function () {
    // var users = [
    //     { id: 1, username: 'john' }
    // ];
    var xxx = GLOBAL_FIRST_RESPONSE;
    return {
        getItem: function (id) {
            return GLOBAL_FIRST_RESPONSE === null ? null : GLOBAL_FIRST_RESPONSE;
            // for (i=0; i<users.length; i++) {
            //     if (users[i].id === id) {
            //         return users[i];
            //     }
            // }
        }
    };
});
// app.factory("Auth", ["$firebaseAuth",
//   function($firebaseAuth) {
//     return $firebaseAuth();
//   }
// ]);