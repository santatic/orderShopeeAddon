// var config = {
// 	apiKey: 'AIzaSyB5a-MpgrGUzsGUntJW6vSE_oryGxeN7jw',
// 	authDomain: 'shopee.vn',
// 	databaseURL: 'https://test-f8d9d.firebaseio.com',
// 	storageBucket: 'test-f8d9d.appspot.com'
// };
// firebase.initializeApp(config);


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

                            // console.log(obj);
                            var optionsUrl = chrome.extension.getURL("options.html#/orders/" + id);
                            if (obj) {
                                var selectedExpTags = [obj.own_status.status];
                                var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((obj.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((obj.shipping_fee) * 100) / 100).toLocaleString() + " VNĐ - " + names[0] + ' | <a target="_blank" href="' + optionsUrl + '">' + obj.id + '</a></b></span>')
                            } else {
                                _this.find(".ct-buyer > div").append(' <span style="background: #ff3d3e;color: #fff;" id="test">&nbsp<b>CHƯA ĐƯỢC THEO DÕI</b>&nbsp</span>')
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
        },1000)

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
            changes.suggests.newValue.forEach(function (val) {
                states.push(val.suggest_chat)
                console.log(val.suggest_chat);
            });
            $('.shopee-chat-root .chat-panel textarea').autocomplete({
                delay: 100,
                minLength: 1,
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
        }, 500)
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