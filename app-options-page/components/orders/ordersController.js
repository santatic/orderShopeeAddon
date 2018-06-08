app.controller("orders-controller", ordersController)
    .filter('mapGender', mapGender)

ordersController.$inject = ['$scope', 'moment', 'uiGridConstants'];

function ordersController($scope, moment, uiGridConstants) {
    var saleUrl = chrome.extension.getURL("options.html#/");
    $scope.options = {
        paginationPageSizes: [10, 20, 30],
        paginationPageSize: 10,
        enableSorting: true,
        columnDefs: [{
                name: "OrderId",
                field: "id",
                enableCellEdit: false,
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{grid.getCellValue(row, col)}}">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "TrackNo",
                enableCellEdit: false,
                field: "trackno"
                // cellTemplate: '<div class="ui-grid-cell-contents" ><a href="#">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "NickName",
                enableCellEdit: false,
                field: "nickname"
            }, {
                name: "Buyer Paid",
                enableCellEdit: false,
                field: "paid"
            },
            {
                name: "Shipping Fee",
                enableCellEdit: false,
                field: "shippingFee"
            }, {
                name: "Status Shopee",
                enableCellEdit: false,
                field: "status"
            }, {
                name: "Status Time",
                enableCellEdit: false,
                field: "updateTime"
            },
            {
                name: "Own Status",
                field: "ownStatus",
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: '1',
                        label: 'NEW'
                    }, {
                        value: '2',
                        label: 'PREPARED'
                    }, {
                        value: '3',
                        label: 'UNPREPARED'
                    }, {
                        value: '4',
                        label: 'PACKED'
                    }, {
                        value: '5',
                        label: 'SHIPPED'
                    }, {
                        value: '6',
                        label: 'DELIVERED'
                    }, {
                        value: '7',
                        label: 'RETURNING'
                    }, {
                        value: '8',
                        label: 'RETURNED'
                    }, {
                        value: '9',
                        label: 'PAID'
                    }, {
                        value: '10',
                        label: 'REFUNDED'
                    }, {
                        value: '11',
                        label: 'CANCELED'
                    }]
                },
                cellFilter: 'mapGender'
            }
        ],
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

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
        1: "NEW" ,   
        2: "PREPARED",
        3: "UNPREPARED",
        4: "PACKED",
        5: "SHIPPED",
        6: "DELIVERED",
        7: "RETURNING",
        8: "RETURNED",
        9: "PAID",
        10: "REFUNDED",
        11: "CANCELED"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};