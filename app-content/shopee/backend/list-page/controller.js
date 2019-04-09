app.controller("list-shopee-saleCtrl", ['$scope', 'moment', 'getList', 'Chat',
    function ($scope, moment, getList, Chat) {
        console.log("list");
        // getList.getList()

        Chat.getSuggests()
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
            console.log("loading...");
            chrome.storage.local.get('data', function (keys) {
                $scope.pendings = []
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
                            // console.log(obj);
                            _this.find(".ct-buyer > div").find('span#test').remove()
                            if (obj) {
                                var exportId
                                if (!obj.exportId) {
                                    exportId = "Chưa có Mã Phiếu Xuất"
                                } else {
                                    exportId = obj.exportId
                                }
                                if (obj.logistic["logistics-logs"].length > 0 && obj.logistic['logistics-logs'][0].description !== "") {
                                    var logistics = obj.logistic['logistics-logs'][0].description
                                    logistics = logistics.indexOf('[Vietnam]') !== -1 ? logistics.replace('[Vietnam]', '') : logistics
                                    console.log(logistics);
                                    _this.find(".ct-status").html(logistics)
                                }

                                var status
                                if (obj.own_status.status == 1 || obj.own_status.status == 4 || obj.own_status.status == 5) {
                                    var names = arrayFilter.find(y => y.id === obj.own_status.status).vietnamese
                                    status = obj.own_status.status == 4 ? '<a style="background: rgba(46, 192, 20, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names + ' </a>' : obj.own_status.status == 5 ? '<a style="background: rgb(255, 87, 34);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names + ' </a>' : '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + names + ' </a>'
                                } else {
                                    status = ""
                                }
                                _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((obj.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((obj.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + obj.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank" href="' + optionsUrl + "export/" + exportId + '">#' + exportId + '</a>' + status + '</b></span>')
                            } else {
                                _this.find(".ct-buyer > div").find('#' + id + '').remove()
                                _this.find(".ct-buyer > div").find('.' + id + '').remove()
                                chrome.runtime.sendMessage({
                                    mission: "getSingle",
                                    id: id
                                }, function (response) {
                                    console.log(response.state);
                                    if (response.state) {
                                        _this.find(".ct-buyer > div").find('#' + id + '').remove()
                                        _this.find(".ct-buyer > div").find('.' + id + '').remove()
                                        var status = arrayFilter.find(y => y.id == response.status).vietnamese
                                        _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((response.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((response.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + response.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank">#' + response.exportId + '</a>' + '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + status + ' </a>' + '</b></span>')

                                    } else {
                                        if (_this.find('.ct-logistics div.label.green').length > 0) {
                                    
                                            _this.find(".ct-buyer > div").append(' <span style="background: #ff3d3e;border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;" class="' + id + '">&nbsp<b>CÓ MÃ VẬN ĐƠN NHƯNG CHƯA ĐƯỢC THEO DÕI</b>&nbsp</span>')
                                            // console.log(id);
                                            if(jQuery.inArray( id, $scope.pendings ) == -1){
                                                $scope.pendings.push(id)
                                                $scope.$apply()
                                            }    

                                        } else {
                                            _this.find(".ct-buyer > div").append(' <span style="background:#4e4e4e;border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;" class="' + id + '">&nbsp<b>CHƯA ĐƯỢC THEO DÕI</b>&nbsp</span>')
                                        }
                                                                                    
                                    }
                                })
                                
                                // else {
                                //     // console.log(id);
                                //     _this.find(".ct-buyer > div").append(' <span style="background:#4e4e4e;border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;" class="' + id + '">&nbsp<b>CHƯA ĐƯỢC THEO DÕI</b>&nbsp</span>')
                                //     _this.find(".ct-actions").click(function () {
                                //         var timer = setInterval(function () {  
                                //             console.log("check...");
                                //             if(_this.find('.ct-logistics div.label.green').length > 0){
                                //                 clearInterval(timer)
                                //                 console.log("sending...");
                                //                 chrome.runtime.sendMessage({
                                //                     mission: "detailOrder",
                                //                     url: id
                                //                 }, function (response) {                                                    
                                //                     console.log(response);
                                //                     if(response.check == "success"){
                                //                         new Noty({
                                //                             layout: 'bottomRight',
                                //                             theme: "relax",
                                //                             type: 'success',
                                //                             timeout: 1500,
                                //                             text: 'Thêm Đơn Thành Công'
                                //                         }).show();
                                //                         _this.find(".ct-buyer > div").find('#'+id+'').remove()
                                //                         _this.find(".ct-buyer > div").find('.'+id+'').remove()
                                //                         var status = arrayFilter.find(y => y.id == response.status).vietnamese
                                //                         _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + (((response.buyer_paid_amount) * 100) / 100).toLocaleString() + " VNĐ - " + (((response.shipping_fee) * 100) / 100).toLocaleString() + ' VNĐ | <a target="_blank" href="' + optionsUrl + "orders/" + id + '">' + response.id + '</a> | <a style="background: rgba(44, 9, 188, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px " target="_blank">#' + response.exportId + '</a>' + '<a style="background: rgba(0, 146, 231, 0.65);border-radius:25px ; color: #fff ;padding: 5px 8px;margin-left: 8px;text-transform: uppercase;">' + status + ' </a>' + '</b></span>')
                                                        
                                //                     }else{                                                        
                                //                     }
                                //                 })
                                //             }
                                //         },1000)
                                //     })

                                // }

                            }
                        }

                    })
                }, 1000)
                setTimeout(function () {
                    clearInterval(timer);
                }, 30000);
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

        $scope.updatePendings = function (pendings) {
            if (pendings.length > 0) {
                new Noty({
                    layout: 'bottomRight',
                    theme: "relax",
                    type: 'warning',
                    text: 'ĐANG ĐẨY ĐƠN...,Xong sẽ tự load lại trang'
                }).on('afterShow', function () {
                    chrome.runtime.sendMessage({
                        mission: "batchPendings",
                        arr: pendings
                    }, function (response) {
                        console.log("ok");
                        location.reload()
                    })
                }).show()
            }
        }
    }
])