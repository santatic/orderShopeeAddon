
app.controller("item-shopee-saleCtrl", ['$scope', 'moment', 'Chat',
    function ($scope, moment, Chat) {
        Chat.getSuggests()

        $scope.showSelect = false
        $scope.showOption = true
        var arrayFilter = [{
                id: 1,
                english: "NEW",
                vietnamese: "Đơn mới"
            },
            {
                id: 2,
                english: "PREPARED",
                vietnamese: "Đủ hàng"
            },
            {
                id: 3,
                english: "UNPREPARED",
                vietnamese: "Thiếu hàng"
            },
            {
                id: 4,
                english: "PACKED",
                vietnamese: "Đã đóng gói"
            },
            {
                id: 5,
                english: "SHIPPED",
                vietnamese: "Đã gửi đi"
            },
            {
                id: 6,
                english: "DELIVERED",
                vietnamese: "Khách đã nhận"
            },
            {
                id: 7,
                english: "RETURNING",
                vietnamese: "Đang hoàn hàng"
            },
            {
                id: 8,
                english: "RETURNED",
                vietnamese: "Đã hoàn về kho"
            },
            {
                id: 9,
                english: "PAID",
                vietnamese: "Đã thanh toán"
            },
            {
                id: 10,
                english: "REFUNDED",
                vietnamese: "Đã hoàn tiền"
            },
            {
                id: 11,
                english: "CANCELED",
                vietnamese: "Đã hủy"
            },
        ]

        function httpGet(theUrl, headers) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            for (var i = 0; i < headers.length; i++) {
              xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
            }
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        }

        


        var beforeRadio
        $('.form-group-status input:radio').mouseup(function () {
            beforeRadio = $('input:radio:checked');
        }).change(function (e) {
            console.log((this.value));
            var thisRadio = $(this)
            var selectedExpTags = [this.value];
            var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
            var beforeRadioArr = [beforeRadio.val()];
            var beforeRadioArray = beforeRadioArr.map(x => arrayFilter.find(y => y.english === x).id)
            if (names[0] < beforeRadioArray[0]) {
                var n = new Noty({
                    closeWith: [],
                    layout: "topLeft",
                    text: 'BẠN CÓ CHẮC MUỐN CHUYỂN TRẠNG THÁI?',
                    buttons: [
                        Noty.button('YES', 'btn btn-success', function () {
                            n.close()
                            var x = new Noty({
                                layout: 'bottomRight',
                                theme: "relax",
                                type: 'warning',
                                text: 'ĐANG THAY ĐỔI TRẠNG THÁI....'
                            }).show();
                            chrome.runtime.sendMessage({
                                mission: "updateStatusFromShopee",
                                url: url,
                                status: names[0]
                            }, function (response) {
                                x.close()                                
                                new Noty({
                                    layout: 'bottomRight',
                                    timeout: 2500,
                                    theme: "relax",
                                    type: 'success',
                                    text: 'ĐÃ CẬP NHẬT TRẠNG THÁI ĐƠN'
                                }).show();
                            })
                            
                        }, {
                            id: 'button1',
                            'data-status': 'ok'
                        }),

                        Noty.button('NO', 'btn btn-error', function () {
                            n.close();
                            thisRadio.prop('checked', false);
                            beforeRadio.prop('checked', true);
                        })
                    ]
                }).show();
            } else {
                var n = new Noty({
                    layout: 'bottomRight',
                    theme: "relax",
                    type: 'warning',
                    text: 'ĐANG THAY ĐỔI TRẠNG THÁI....'
                }).show();
                chrome.runtime.sendMessage({
                    mission: "updateStatusFromShopee",
                    url: url,
                    status: names[0]
                }, function (response) {
                    n.close()
                    new Noty({
                        layout: 'bottomRight',
                        timeout: 2500,
                        theme: "relax",
                        type: 'success',
                        text: 'ĐÃ CẬP NHẬT TRẠNG THÁI ĐƠN'
                    }).show();
                })
            }
        });

        $('#linkOpenOptionsPage').click(function () {
            console.log(chrome.runtime.getURL('options.html'));
            window.open(chrome.runtime.getURL('options.html'));
            return false;
        });

        url = $(location).attr('href').match(/\d+/);
        url = url.toString();

        console.log(url);
        var products = httpGet("https://banhang.shopee.vn/api/v2/orders/" + url, []).products
        console.log(products);

        function findProduct(name){
            var obj = products.find(x=>x.name == name)
            console.log(obj);
            return obj
        }

        

        $scope.url = url;
        $scope.traceno = ''
        var optionsUrl = chrome.extension.getURL("options.html#/orders/" + url);
        $scope.okey = false
        $scope.printLink = optionsUrl;
        chrome.runtime.sendMessage({
            mission: "checkExist",
            url: url
        }, function (response) {
            setTimeout(() => {
                // $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ÐON NÀY</a>');
                $('.order-notes .shopee-button--primary').on("click", function () {
                    chrome.runtime.sendMessage({
                        mission: "updateNote",
                        url: url,
                        note: $('.order-notes .ember-content-editable').text()
                    }, function (response) {})
                })
            }, 2000)

            if (response.check == "hello") {
                chrome.runtime.sendMessage({
                    mission: "detailOrder",
                    url: url
                }, function (response) {  
                    if(response.check == "success"){
                        location.reload()
                    }
                    
                })
            }
            if (response.check == "update") {
                $scope.showSelect = true
                $scope.okey = true
                new Noty({
                    layout: 'bottomRight',
                    timeout: 2500,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐƠN ĐÃ ĐƯỢC THEO DÕI'
                }).show();

                $scope.statusRadio = response.status
                $scope.exId = response.exportId
                $scope.note = response.note                
                $scope.exDate = response.exDate
                $scope.traceno = response.traceno
                $scope.exLink = chrome.extension.getURL("options.html#/export/" + response.exportId);
                $('.product-name').each(function(){
                    var productName = $(this).clone()    //clone the element
                    .children() //select all the children
                    .remove()   //remove all the children
                    .end().text().trim();
                    var product = findProduct(productName)
                    var link = "https://shopee.vn/!-i." + product.shopid + "." +product.itemid
                    var editlink = "https://banhang.shopee.vn/portal/product/"+ product.itemid
                    console.log(link);
                    $(this).html('<a style="color:#0400bf" href="'+ link +'" target="_blank">'+productName+'</> <a style="font-weight: bold;font-size: 16px;" href="'+editlink+'" target="_blank">&#9728;</a>' )
                })
                $scope.$apply()
                chrome.runtime.sendMessage({
                    mission: "update",
                    url: url
                })
            }
            // setTimeout(() => {
            //     $('.main-header .inline-list').append('<a style="color: red" class="shopee-button cancel">H?Y</a>');
            //     $('a.cancel').on("click", () => {
            //         chrome.runtime.sendMessage({
            //             mission: "cancel",
            //             url: url
            //         })
            //     })
            // }, 3000)

        })
    }
]);