app.controller("import-controller", ordersController)
    .filter('mapGender', mapGender)

ordersController.$inject = ['$scope', '$timeout', 'moment', '$routeParams', 'uiGridConstants', 'helper'];

function ordersController($scope, $timeout, moment, $routeParams, uiGridConstants, helper) {
    $scope.loading = true;
    $scope.cancel = true
    var id = $routeParams.id
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
    var now = moment((new Date()).getTime()).format('hh:mm_DD/MM/YYYY');
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
                name: "Id",
                field: "id",
                enableCellEdit: false,
                width: '100',
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
            }, {
                name: "Shipping No",
                enableCellEdit: false,
                field: "trackno",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{grid.getCellValue(row, col)}}</a></div>'
            },
            {
                name: "Order No",
                enableCellEdit: false,
                field: "ordersn"
            }, {
                name: "Nick Name",
                enableCellEdit: false,
                width: '150',
                visible: false,
                field: "nickname"
            }, {
                name: "A.Shopee Price",
                enableCellEdit: false,
                field: "shopeePrice",
                // width: '100'
            }, {
                name: "B.Actual Price",
                enableCellEdit: false,
                field: "paid",
                // width: '100'
            }, {
                name: "Voucher",
                enableCellEdit: false,
                field: "voucherPrice",
                width: '60'
            },
            {
                name: "Shiping Fee",
                enableCellEdit: false,
                width: '100',
                field: "shippingFee"
            },
            {
                name: "A - B",
                enableCellEdit: false,
                field: "offset",
                width: '100'
            },
            {
                name: "Shopee's Status",
                enableCellEdit: false,
                field: "status",
                visible: false,
                cellTooltip: function (row) {
                    return row.entity.status;
                }
            }, {
                name: "Shopee's Status Time",
                enableCellEdit: false,
                width: '100',
                visible: false,
                field: "updateTime"
            },
            {
                name: "My Status",
                field: "ownStatus",
                width: '160',
                visible: false,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                            value: 1,
                            label: "Đơn mới"
                        },
                        {
                            value: 2,
                            label: "Đủ hàng"
                        },
                        {
                            value: 3,
                            label: "Thiếu hàng"
                        },
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
                        {
                            value: 7,
                            label: "Đang hoàn hàng"
                        },
                        {
                            value: 8,
                            label: "Đã hoàn về kho"
                        },
                        {
                            value: 9,
                            label: "Đã thanh toán"
                        },
                        {
                            value: "HT",
                            label: "Đã hoàn tiền"
                        },
                        {
                            value: "0",
                            label: "Đã hủy"
                        }
                    ]
                },
                cellFilter: 'mapGender'
            }
        ],
        enableFiltering: true,
        exporterCsvFilename: 'ExportFromPaymentDetail_' + now + '.csv',
        exporterMenuAllData: false,
        exporterMenuVisibleData: false,
        exporterMenuExcel: false,
        exporterMenuPdf: false,
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


    // $scope.options.gridMenuCustomItems = [{
    //     title: "IN PHIẾU XUẤT",
    //     action: function () {
    //         $('#haveQR').append('<td id="qrcode"></td>')
    //         $scope.id = id;
    //         var qrcode = new QRCode("qrcode", {
    //             width: 100,
    //             height: 100,
    //             correctLevel: QRCode.CorrectLevel.H
    //         });

    //         function makeCode() {
    //             qrcode.makeCode(id);
    //         }
    //         makeCode();
    //         $timeout(function () {
    //             window.print();
    //             $('#qrcode').remove()
    //         }, 500)
    //     }

    // }]

    $scope.options.multiSelect = true;
    var sources = []
    var arrTraceno = []
    var arrOrderId = []
    firestore.collection("importCode").doc(id).get().then(function (doc) {
        const data = doc.data()
        // console.log(data);
        $scope.bank = data.myBank;
        $scope.date = data.reciveMoneyAt;
        $scope.$apply()
        arrOrderId = data.orders
        
    }).then(function(doc){
        arrOrderId.forEach(function (orderId) {
            var docRef = firestore.collection("orderShopee").doc(orderId.id);
            docRef.get().then(
                function (orderDoc) {
                    const myData = orderDoc.data();
                    // console.log(myData);
                    var voucher_price = parseInt(((myData.voucher_price) * 100) / 100)
                    var money = parseInt(((myData.buyer_paid_amount) * 100) / 100)
                    money = myData.voucher_absorbed_by_seller ? money - voucher_price : money
                    ctime = moment((myData.logistic["logistics-logs"][0].ctime) * 1000).format('YYYY-MM-DD');
                    obj = new Object();
                    console.log(myData);
                    obj = {
                        id: orderDoc.id,
                        trackno: myData.shipping_traceno,
                        nickname: myData.user.name + " - " + myData.buyer_address_name,
                        carrier: myData.actual_carrier,
                        paid: money.toLocaleString(),
                        shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
                        status: myData.logistic["logistics-logs"][0].description,
                        updateTime: ctime,
                        voucherPrice: voucher_price,
                        ownStatus: myData.own_status.status,
                        shopeePrice: myData.actual_money_shopee_paid.toLocaleString(),
                        ordersn: myData.ordersn
                    }
                    $scope.carrier = obj.carrier
                    
                    obj.offset = myData.actual_money_shopee_paid - money
                    $scope.options.data.push(obj)
                    $scope.$apply()
                    arrTraceno.push(obj.trackno)
                    // console.log(querySnapshot.size);
                }
            ).then(function () {
                //$scope.apply();
            })

        })
        
        $scope.arrTraceno = arrTraceno
        $scope.size = arrOrderId.length
        $scope.loading = false
        $scope.gridApi.core.refresh();
        sources.forEach(function (row, index) {

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
            // console.log(row.ownStatus);
            // var selectedExpTags = [parseInt(value.ownStatus)];
            // var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
            // value.own_Status = names[0];
        })
    })


}


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