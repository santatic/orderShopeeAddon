
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
                name: "Export Id",
                field: "exportCode",
                enableCellEdit: false,
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.exportCode}}">{{row.entity.exportCode}}</a></div>'
            }, {
                name: "Id",
                field: "id",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
            },{
                name: "Mã Đơn",
                field: "ordersn",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{row.entity.ordersn}}</a></div>'
            }, {
                name: "Mã Vận Đơn",
                field: "shippingId",
            }, {
                name: "Create At (m-d-y)",
                enableCellEdit: false,
                field: "time",
                
                sort: {
                    direction: 'desc',
                    priority: 0
                }
            },{
                name: "Nhà Vận Chuyển",
                field: "carrier"
            },{
                name: "Mã Phiếu Thu",
                field: "importCode"
            },{
                name: "Tiền Hàng (A)",
                field: "paid_amount"
            },{
                name: "Thực Nhận (B)",
                field: "actual_recive",
            },{
                name: "A - B",
                field: "offset",
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
            ctime = moment(myData.create_at.seconds * 1000).format("MM-DD-YYYY / HH:MM")

            obj = {
                id: myData.id,
                ordersn: myData.ordersn,
                time: ctime,
                paid_amount: Number(myData.buyer_paid_amount).toFixed(0).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                  }),
                actual_recive: Number(myData.actual_money_shopee_paid).toFixed(0).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                  }),
                exportCode: myData.exportId,
                shippingId: myData.shipping_traceno,
                carrier: myData.actual_carrier,
                importCode: myData.importMoneyId[0],
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