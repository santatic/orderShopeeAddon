app.controller("completed-orders-controller", ordersController)
    .filter('mapGender', mapGender)
app.controller("completed-orders-controller", ordersController)
    .filter('mapCarrier', mapCarrier)
app.controller("completed-orders-controller", ordersController)
    .filter('mapPayment', mapPayment)

function ordersController($scope, $q, $timeout, moment, uiGridConstants, helper) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");
    $scope.change = true
    var arrPay = [{
        id: 4,
        status: "Chưa thanh toán"
    }, {
        id: 1,
        status: "Thiếu"
    }, {
        id: 2,
        status: "Đủ"
    }, {
        id: 3,
        status: "Thừa"
    }]
    var arrCarrier = [{
        id: 1,
        carrier: "Giao Hàng Tiết Kiệm"
    }, {
        id: 2,
        carrier: "Viettel Post"
    }, {
        id: 3,
        carrier: "Giao Hàng Nhanh"
    }, {
        id: 4,
        carrier: "VNPost Tiết Kiệm"
    }, {
        id: 5,
        carrier: "VNPost Nhanh"
    }, {
        id: 6,
        carrier: "J&T Express"
    }]
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
            vietnamese: "đã đóng gói"
        },
        {
            id: 5,
            english: "SHIPPED",
            vietnamese: "đã gửi đi"
        },
        {
            id: 6,
            english: "DELIVERED",
            vietnamese: "khách đã nhận"
        },
        {
            id: 7,
            english: "RETURNING",
            vietnamese: "đang hoàn hàng"
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

    var statusDef = {
        name: "trang thai",
        field: "ownStatus",
        // cellTemplate:'<div class="ui-grid-cell-contents" > {{row.entity.ownStatus}}</div>',
        filter: {
            type: uiGridConstants.filter.SELECT,
        },
        cellFilter: 'mapGender'
    }
    var carrierDef = {
        name: "Nha van chuyen",
        field: "carrier",
        filter: {
            type: uiGridConstants.filter.SELECT
        },
        cellFilter: 'mapCarrier'
    }
    var paymentDef = {
        name: "TTTT",
        field: "paymentStatus",
        filter: {
            type: uiGridConstants.filter.SELECT
        },
        cellFilter: 'mapPayment'
    }
    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        enableFiltering: true,
        exporterCsvFilename: 'ExportCompleted.csv',
        exporterMenuAllData: false,
        exporterMenuVisibleData: false,
        exporterExcelFilename: 'myFile.xlsx',
        exporterExcelSheetName: 'Sheet1',
        // exporterMenuExcel: false,
        exporterMenuPdf: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    // $scope.optionsNotPay = $scope.options
    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        var jobskill_query = firestore.collection('exportCode').doc(rowEntity.id)
    };
    $scope.options.columnDefs = [{
            name: "PHIEU XUAT",
            field: "exportCode",
            enableCellEdit: false,
            visible: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.exportCode}}">{{row.entity.exportCode}}</a></div>'
        }, {
            name: "ID",
            field: "id",
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
        }, {
            name: "id don hàng",
            field: "ordersn",
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{row.entity.ordersn}}</a></div>'
        }, {
            name: "ma van don",
            field: "shippingId",
        }, {
            name: "NHA VAN CHUYEN",
            field: "carrier",
            visible: false
        }, {
            name: "PHIEU THU",
            field: "importCode",
            visible: false
        }, {
            name: "A.Doanh Thu",
            field: "paid_amount"
        }, {
            name: "B.Shopee Tra",
            field: "actual_recive",
        }, {
            name: "A - B",
            field: "offset",
        }, {
            name: "Voucher",
            field: "sellerVoucher",
            visible: false
        }, carrierDef, statusDef,
        {
            name: "tre",
            field: "fromNow",
            // type: "number",
            width: 60,
            sort: {
                direction: 'desc',
                priority: 0
            }
        },
        paymentDef, {
            name: "NGAY",
            enableCellEdit: false,
            field: "time",
            visible: false,
            sort: {
                direction: 'desc',
                priority: 0
            }
        }
    ]

    function filterData(obj, arr) {
        var returnObj = new Object
        arr.forEach((e) => {
            returnObj[e] = obj[e]
        })
        return returnObj
    }
    $scope.arrfilterStatus = []
    $scope.arrfilterCarrier = []
    $scope.arrfilterPayment = []
    $scope.options.multiSelect = true;
    var now = moment((new Date()).getTime());
    // $scope.ordersDefault = function () {
    $scope.options.data = []

    chrome.storage.local.get('dataPayment1', function (keys) {
        getOrders(keys.dataPayment1)
        console.log(keys.dataPayment1);
    })

    chrome.storage.onChanged.addListener(function (changes) {
        if (changes.dataPayment1) 
            // location.reload()
            getOrders(changes.dataPayment1.newValue);
    })

    function getOrders(arr) {
        arr.forEach(function (doc) {
            // console.log(doc);
            doc = filterData(doc, ["actual_money_shopee_paid","paymentStatus", "own_status", "actual_carrier", "id", "buyer_paid_amount", "create_at", "exportId", "ordersn", "shipping_fee", "shipping_traceno"])
            getData(doc)
        })
        // console.log($scope.options.data);
        statusDef.filter.selectOptions = $scope.arrfilterStatus
        carrierDef.filter.selectOptions = $scope.arrfilterCarrier
        paymentDef.filter.selectOptions = $scope.arrfilterPayment
        console.log($scope.arrfilterPayment, $scope.arrfilterStatus);
        $scope.change = true
    }
    var ind = 0
    // firestore.collection("orderShopee").where("actual_money_shopee_paid", "==", 0)
    //         .where("own_status.status", ">=", 5).where("own_status.status", "<", 7)
    //         // .limit(30)
    //         .get()
    //         .then(function (querty) {
    //             console.log(querty.size);
    //             querty.forEach(function (doc) {
    //                 ind++
    //                 var myData = doc.data()
    //                 getData(myData)
    //                 if(ind == querty.size) {
    //                     statusDef.filter.selectOptions = $scope.arrfilterStatus
    //                     carrierDef.filter.selectOptions = $scope.arrfilterCarrier
    //                     paymentDef.filter.selectOptions = $scope.arrfilterPayment 
    //                     $scope.loading = false
    //                     $scope.$apply()
    //                 }
    //             })
    //         }).catch(function (error) {
    //             console.log("lỗi", error)
    //         })
    
    
    function getData(myData) {

        // myData = filterData(myData, ["paymentStatus", "own_status", "actual_carrier", "id", "buyer_paid_amount", "create_at", "exportId", "ordersn", "shipping_fee", "shipping_traceno"])
        let start = moment(myData.create_at.seconds * 1000)
        let carrier = arrCarrier.find(x => x.carrier == myData.actual_carrier).id
        let statusLabel = arrayFilter.find(x => x.id == myData.own_status.status).vietnamese
        let idPayment = myData.paymentStatus ? myData.paymentStatus.status? myData.paymentStatus.status : 4:4;           
        let statusPayment = arrPay.find(x => x.id == idPayment).status
        if ($scope.arrfilterStatus.findIndex(x => x.value == myData.own_status.status) == -1) {
            $scope.arrfilterStatus.push({
                value: myData.own_status.status,
                label: statusLabel
            })
        }
        if ($scope.arrfilterPayment.findIndex(x => x.value == idPayment) == -1) {
            $scope.arrfilterPayment.push({
                value: idPayment,
                label: statusPayment
            })
        }
        if ($scope.arrfilterCarrier.findIndex(x => x.value == carrier) == -1) {
            $scope.arrfilterCarrier.push({
                value: carrier,
                label: myData.actual_carrier
            })
        }
        obj = {
            id: myData.id,
            shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
            ownStatus: myData.own_status.status,
            fromNow: now.diff(start, 'days') + " ngay",
            orderId: myData.ordersn,
            ordersn: myData.ordersn,
            time: start.format("YYYY-MM-DD"),
            paid_amount: Number(myData.buyer_paid_amount)
                .toFixed(0)
                .replace(/./g, function (c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }),
            actual_recive: myData.actual_money_shopee_paid === undefined ?0: Number(myData.actual_money_shopee_paid)
                .toFixed(0)
                .replace(/./g, function (c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }),
            exportCode: myData.exportId,
            shippingId: myData.shipping_traceno,
            carrier: carrier,
            importCode: myData.importMoneyId ? myData.importMoneyId[0] : "chưa thanh toán",
            sellerVoucher: myData.voucher_absorbed_by_seller ? Number(myData.voucher_price).toFixed(0)
                .replace(/./g, function (c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }) : 0,
            offset: myData.actual_money_shopee_paid === undefined ? Number(myData.buyer_paid_amount): (Number(myData.buyer_paid_amount) - Number(myData.actual_money_shopee_paid)).toFixed(0).replace(/./g, function (c, i, a) {
                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            }),
            paymentStatus: idPayment
        }
        // console.log(myData.actual_money_shopee_paid, obj.actual_recive);
        $scope.options.data.push(obj)        
        // $scope.$apply()
        // }
    }
}


function mapCarrier() {
    var genderHash = {
        1: "Giao Hàng Tiết Kiệm",
        2: "Viettel Post",
        3: "Giao Hàng Nhanh",
        4: "VNPost Tiết Kiệm",
        5: "VNPost Nhanh",
        6: "J&T Express"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};

function mapPayment() {
    var genderHash = {

        1: "Thiếu",
        2: "Đủ",
        3: "Thừa",
        4: "Chưa thanh toán"
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
        4: "Đã đóng gói",
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