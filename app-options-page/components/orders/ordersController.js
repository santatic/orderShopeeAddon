app.controller("orders-controller", ordersController)
    .filter('mapGender', mapGender)

ordersController.$inject = ['$scope', '$timeout', 'moment', 'uiGridConstants'];

function ordersController($scope, $timeout, moment, uiGridConstants) {
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
            vietnamese: "hủy"
        },
    ]

    $scope.options = {
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        columnDefs: [{
                name: "OrderId",
                field: "id",
                enableCellEdit: false,
                width: '100',
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{grid.getCellValue(row, col)}}">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "TrackNo",
                enableCellEdit: false,
                width: '200',
                field: "trackno"
                // cellTemplate: '<div class="ui-grid-cell-contents" ><a href="#">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "NickName",
                enableCellEdit: false,
                width: '150',
                field: "nickname"
            }, {
                name: "Buyer Paid",
                enableCellEdit: false,
                field: "paid",
                width: '100'
            },
            {
                name: "Shipping Fee",
                enableCellEdit: false,
                width: '100',
                field: "shippingFee"
            }, {
                name: "Status Shopee",
                enableCellEdit: false,
                field: "status",
                cellTooltip: function (row) {
                    return row.entity.status;
                }
            }, {
                name: "Status Time",
                enableCellEdit: false,
                width: '100',
                field: "updateTime"
            },
            {
                name: "Own Status",
                field: "ownStatus",
                width: '160',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                            value: "1",
                            label: "Đơn mới"
                        },
                        {
                            value: "2",
                            label: "Đủ hàng"
                        },
                        {
                            value: "3",
                            label: "Thiếu hàng"
                        },
                        {
                            value: "4",
                            label: "Đã đóng gói"
                        },
                        {
                            value: "5",
                            label: "Đã gửi đi"
                        },
                        {
                            value: "6",
                            label: "khách đã nhận"
                        },
                        {
                            value: "7",
                            label: "Đang hoàn hàng"
                        },
                        {
                            value: "8",
                            label: "Đã hoàn về kho"
                        },
                        {
                            value: "9",
                            label: "Đã thanh toán"
                        },
                        {
                            value: "10",
                            label: "Đã hoàn tiền"
                        },
                        {
                            value: "11",
                            label: "Đã hủy"
                        },
                    ]
                },
                cellFilter: 'mapGender'
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
            $timeout(function () {
                window.print();
            }, 500)
        }

    }]

    $scope.options.multiSelect = true;
    var sources = []

    docRef = firestore.collection("orderShopee");
    docRef.get().then(
        function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const myData = doc.data();
                ctime = moment((myData.logistic["logistics-logs"][0].ctime) * 1000).format('YYYY-MM-DD');
                obj = new Object();
                obj = {
                    id: doc.id,
                    trackno: myData.shipping_traceno,
                    nickname: myData.user.name,
                    paid: ((myData.buyer_paid_amount * 100) / 100).toLocaleString(),
                    shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
                    status: myData.logistic["logistics-logs"][0].description,
                    updateTime: ctime,
                    ownStatus: myData.own_status
                }
                sources.push(obj)
            })
            $scope.data = sources
            $scope.options.data = $scope.data;
            $scope.loading = false
            $scope.gridApi.core.refresh();
            sources.forEach(function (row, index) {
                switch (row.ownStatus) {
                    case "NEW":
                        row.ownStatus = "1"
                        break
                    case "PREPARED":
                        row.ownStatus = "2"
                        break
                    case "UNPREPARED":
                        row.ownStatus = "3"
                        break
                    case "PACKED":
                        row.ownStatus = "4"
                        break
                    case "SHIPPED":
                        row.ownStatus = "5"
                        break
                    case "DELIVERED":
                        row.ownStatus = "6"
                        break
                    case "RETURNING":
                        row.ownStatus = "7"
                        break
                    case "RETURNED":
                        row.ownStatus = "8"
                        break
                    case "PAID":
                        row.ownStatus = "9"
                        break
                    case "REFUNDED":
                        row.ownStatus = "10"
                        break
                    case "CANCELED":
                        row.ownStatus = "11"
                        break
                }
                // var selectedExpTags = [parseInt(value.ownStatus)];
                // var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                // value.own_Status = names[0];
            })
            // console.log(querySnapshot.size);
        }
    ).then(function () {
        console.log($scope);

        //$scope.apply();
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
        10: "Đã hoàn tiền",
        11: "Hủy"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};