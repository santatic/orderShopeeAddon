app.controller("orders-controller", ordersController)
    .filter('mapGender', mapGender)
app.controller("orders-controller", ordersController)
    .filter('mapCarrier', mapCarrier)

ordersController.$inject = ['$scope', '$timeout', 'moment', 'uiGridConstants', 'helper'];

function ordersController($scope, $timeout, moment, uiGridConstants, helper) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");
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

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        columnDefs: [{
                name: "ID",
                field: "id",
                enableCellEdit: false,
                width: '100',
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
            }, {
                name: "Số Vận Đơn",
                enableCellEdit: false,
                width: '200',
                field: "trackno",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "UserName",
                enableCellEdit: false,
                width: '150',
                field: "nickname"
            }, {
                name: "Dự kiến thu",
                enableCellEdit: false,
                field: "paid",
                width: '100'
            }, {
                name: "Nhà Vận Chuyển",
                width: "150",
                field: "carrier",
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                            value: 1,
                            label: "Giao Hàng Tiết Kiệm"
                        },
                        {
                            value: 2,
                            label: "Viettel Post"
                        }
                    ]
                },
                cellFilter: 'mapCarrier'
            },
            {
                name: "Phí Ship",
                enableCellEdit: false,
                width: '100',
                field: "shippingFee"
            }, {
                name: "Phiếu Xuất",
                field: "exId",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.exId}}">{{row.entity.exId}}</a></div>'
            }, {
                name: "Phiếu Thu",
                field: "importId",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/import/{{row.entity.importId}}">{{row.entity.importId}}</a></div>'
            },
            {
                name: "Logistics Shopee",
                enableCellEdit: false,
                field: "status",
                cellTooltip: function (row) {
                    return row.entity.status;
                }
            }, {
                name: "Thời gian của Logistics",
                enableCellEdit: false,
                width: '100',
                field: "updateTime",
                sort: {
                    direction: 'asc',
                    priority: 0
                }
            },
            {
                name: "Trạng Thái",
                field: "ownStatus",
                width: '160',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                            value: 1,
                            label: "Đơn mới"
                        },
                        // {
                        //     value: 2,
                        //     label: "Đủ hàng"
                        // },
                        // {
                        //     value: 3,
                        //     label: "Thiếu hàng"
                        // },
                        {
                            value: 4,
                            label: "Đã đóng gói"
                        },
                        {
                            value: 5,
                            label: "Đã gửi đi"
                        },
                        {
                            value: 6,
                            label: "Khách đã nhận"
                        },
                        // {
                        //     value: 7,
                        //     label: "Đang hoàn hàng"
                        // },
                        // {
                        //     value: 8,
                        //     label: "Đã hoàn về kho"
                        // },
                        // {
                        //     value: 9,
                        //     label: "Đã thanh toán"
                        // },
                        // {
                        //     value: "HT",
                        //     label: "Đã hoàn tiền"
                        // },
                        // {
                        //     value: "0",
                        //     label: "Đã hủy"
                        // }
                    ]
                },
                cellFilter: 'mapGender'
            }, {
                name: "Trễ",
                field: "fromNow"
            }
        ],
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                console.log(rows);
            });
        }
    };
    // angular.element(document.getElementsByClassName('grid')[0]).css('height', '900px');
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;

    $scope.options.gridMenuCustomItems = [{
        title: "IN ĐƠN",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            console.log(selected);
            $.each(selected, function (i, value) {
                var selectedExpTags = [parseInt(value.ownStatus)];
                var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                value.own_Status = names[0];
            })
            console.log(selected);
            $scope.rowSelected = selected;
            // window.onload = function () {
            selected.forEach(function (val) {
                console.log(val.id);
                var timer = setInterval(function () {
                    if (($("#" + val.id)).length) {
                        clearInterval(timer)
                        var qrcode = new QRCode(document.getElementById(val.id), {
                            width: 60,
                            height: 60,
                            correctLevel: QRCode.CorrectLevel.H
                        });

                        function makeCode() {
                            qrcode.makeCode(val.id);
                        }
                        makeCode();
                    }
                })


            })
            // }

            $timeout(function () {
                window.print();
                $scope.rowSelected = []
            }, 500)
        }
    }, {
        title: "TẠO PHIẾU XUẤT",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            helper.validateExportOrder(selected)
            // $.each(selected, function (i, value) {
            //     console.log(value.id);
            //     docRef = firestore.collection("orderShopee");
            //     docRef.get().then(function (doc) {
            //         const data = doc.data()
            //         if(data.exportId){

            //         }else{

            //         }
            //     })
            // })
        }
    }]

    $scope.options.multiSelect = true;
    var now = new Date
    chrome.storage.local.get('data', function (keys) {
        getData(keys.data)
    })
    chrome.storage.onChanged.addListener(function (changes) {
        getData(changes.data.newValue);
    })



    function getData(data) {
        var sources = []
        data.forEach(function (doc) {
            const myData = doc

            if (myData.logistic["logistics-logs"].length > 0) {
                ctime = moment((myData.logistic["logistics-logs"][0].ctime) * 1000).format('YYYY-MM-DD');
                description = myData.logistic["logistics-logs"][0].description
            } else {
                let date = new Date()
                ctime = moment(date.getTime()).format('YYYY-MM-DD');
                description = ""
            }
            // console.log(ctime);
            obj = new Object();
            var start = new Date(myData.own_status.create_at.seconds * 1000)
            obj = {
                id: myData.id,
                trackno: myData.shipping_traceno,
                nickname: myData.user.name,
                name: myData.buyer_address_name,
                paid: ((myData.buyer_paid_amount * 100) / 100).toLocaleString(),
                carrier: myData.actual_carrier,
                shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
                exId: myData.exportId,
                status: description,
                updateTime: ctime,
                importId: myData.importMoneyId,
                ownStatus: myData.own_status.status,
                fromNow: Math.round((now - start) / (1000 * 60 * 60 * 24)) + " ngày"
            }
            sources.push(obj)
        })
        $scope.data = sources
        $scope.options.data = $scope.data;
        $scope.loading = false
        $scope.gridApi.core.refresh();
        var checkFilter = true
        $('input[type="text"].ui-grid-filter-input').keyup(function () {
            var rows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid)
            if (checkFilter && rows.length == 0) {
                console.log("NO ROWS");

                checkFilter = false
                var n = new Noty({
                    closeWith: [],
                    layout: "bottomRight",
                    text: 'NHẬP CHÍNH XÁC MÃ VẬN ĐƠN ĐỂ TÌM TIẾP? <br><input id="searchByTraceNo" type="text">',
                    buttons: [
                        Noty.button('YES', 'btn btn-success', function () {
                            let input = $('input[type="text"]#searchByTraceNo').val()
                            firestore.collection("orderShopee").where("shipping_traceno", "==", input.toString())
                                .get().then(function (querySnapshot) {
                                    console.log(querySnapshot);
                                    if (querySnapshot.size > 0) {
                                        querySnapshot.forEach(function (doc) {
                                            $scope.gridApi.grid.clearAllFilters();
                                            var win = window.open(chrome.extension.getURL("options.html#/orders/")+doc.id, "_blank");
                                            win.focus()
                                        })
                                    } else {
                                        alert("404...ĐƠN NÀY CHƯA CÓ TRONG HỆ THỐNG")
                                    }
                                }).then(function(){
                                    n.close()
                                })
                        }, {
                            id: 'button1',
                            'data-status': 'ok'
                        }),

                        Noty.button('NO', 'btn btn-error', function () {
                            checkFilter = true
                            $scope.gridApi.grid.clearAllFilters();
                            n.close();
                        })
                    ]
                }).show();
                $('input[type="text"]#searchByTraceNo').focus()
            }
        })

        sources.forEach(function (row, index) {
            switch (row.carrier) {
                case "Giao Hàng Tiết Kiệm":
                    row.carrier = 1;
                    break;
                case "Viettel Post":
                    row.carrier = 2
                    break
            }

            switch (row.ownStatus) {
                case "NEW":
                    row.ownStatus = 1
                    break
                case "PREPARED":
                    row.ownStatus = 2
                    break
                case "UNPREPARED":
                    row.ownStatus = 3
                    break
                case "PACKED":
                    row.ownStatus = 4
                    break
                case "SHIPPED":
                    row.ownStatus = 5
                    break
                case "DELIVERED":
                    row.ownStatus = 6
                    break
                case "RETURNING":
                    row.ownStatus = 7
                    break
                case "RETURNED":
                    row.ownStatus = 8
                    break
                case "PAID":
                    row.ownStatus = 9
                    break
                case "REFUNDED":
                    row.ownStatus = "HT"
                    break
                case "CANCELED":
                    row.ownStatus = "0"
                    break
            }
        })
    }
}



function mapCarrier() {
    var genderHash = {
        1: "Giao Hàng Tiết Kiệm",
        2: "Viettel Post",

    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};

function mapGender() {
    var genderHash = {
        1: "Đơn mới",
        2: "Đã nhặt đủ hàng để chờ đóng gói",
        3: "Chưa nhặt đủ hàng",
        4: "Đã đóng gói chờ gửi đi",
        5: "Đã gửi đi",
        6: "Khách đã nhận hàng",
        7: "Đang hoàn hàng chưa về đến kho",
        8: "Đã hoàn về kho",
        9: "Đã thanh toán",
        "HT": "Đã hoàn tiền",
        "0": "Đã hủy"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};