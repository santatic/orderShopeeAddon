
app.controller("completed-orders-controller", ordersController)

ordersController.$inject = ['$scope', '$q', '$timeout', 'moment', 'uiGridConstants'];

function ordersController($scope, $q, $timeout, moment, uiGridConstants) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");

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
                name: "PHIEU XUAT",
                field: "exportCode",
                enableCellEdit: false,
                visible: false,
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.exportCode}}">{{row.entity.exportCode}}</a></div>'
            }, {
                name: "ID",
                field: "id",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
            },{
                name: "ID DON HANG",
                field: "ordersn",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{row.entity.ordersn}}</a></div>'
            }, {
                name: "MA VAN DON",
                field: "shippingId",
            },{
                name: "NHA VAN CHUYEN",
                field: "carrier",
                visible: false
            },{
                name: "PHIEU THU",
                field: "importCode"
            },{
                name: "A.Doanh Thu",
                field: "paid_amount"
            },{
                name: "B.Shopee Tra",
                field: "actual_recive",
            },{
                name: "A - B",
                field: "offset",
            },{
                name: "Voucher",
                field: "sellerVoucher"
            }, {
                name: "NGAY",
                enableCellEdit: false,
                field: "time",
                
                sort: {
                    direction: 'desc',
                    priority: 0
                }
            }
        ],
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
    // angular.element(document.getElementsByClassName('grid')[0]).css('height', '900px');
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        var jobskill_query = firestore.collection('exportCode').doc(rowEntity.id)
        // jobskill_query.update({
        //     "shipper": rowEntity.shipper
        // }).then(function () {
        //     new Noty({
        //         layout: 'bottomRight',
        //         theme: 'relax',
        //         timeout: 3000,
        //         type: 'success',
        //         text: 'ĐÃ CẬP NHẬT TÊN SHIPPER'
        //     }).show();
        // });
    };

    

    $scope.options.multiSelect = true;
    
    chrome.storage.local.get('dataPayment1', function (keys) {
        getOrders(keys.dataPayment1)
    })

    chrome.storage.onChanged.addListener(function (changes) {
        getOrders(changes.dataPayment1.newValue);
    })

    function getOrders(arr){
        var sources = []
        arr.forEach(function (doc) {
            const myData = doc
            // console.log(myData);
            ctime = moment(myData.create_at.seconds * 1000).format("YYYY-MM-DD")

            obj = {
                id: myData.id,
                ordersn: myData.ordersn,
                time: ctime,
                paid_amount: Number(myData.buyer_paid_amount)
                .toFixed(0)
                .replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }),            
                actual_recive: Number(myData.actual_money_shopee_paid)
                .toFixed(0)
                .replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }),
                exportCode: myData.exportId,
                shippingId: myData.shipping_traceno,
                carrier: myData.actual_carrier,
                importCode: myData.importMoneyId[0],
                sellerVoucher: myData.voucher_absorbed_by_seller? Number(myData.voucher_price).toFixed(0)
                .replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                }): 0,
                offset: (Number(myData.buyer_paid_amount) - Number(myData.actual_money_shopee_paid)).toFixed(0).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                })
            }            
            sources.push(obj)
        })
        console.log(sources);
        $scope.data = sources
        $scope.options.data = $scope.data;
        $scope.loading = false
        $scope.gridApi.core.refresh();
    }


}