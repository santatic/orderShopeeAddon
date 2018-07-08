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
        $scope.url = url;

        var optionsUrl = chrome.extension.getURL("options.html#/orders/" + url);

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
                })
            }
            if (response.check == "update") {
                $scope.showSelect = true
                new Noty({
                    layout: 'bottomRight',
                    timeout: 2500,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐƠN ĐÃ ĐƯỢC THEO DÕI'
                }).show();

                $scope.statusRadio = response.status
                if (response.status == "PAID") {
                    $scope.showOption = false
                }
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