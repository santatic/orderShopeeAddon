app.controller("exports-controller", ordersController)

ordersController.$inject = ['$scope', '$q', '$timeout', 'moment', 'uiGridConstants'];

function ordersController($scope, $q, $timeout, moment, uiGridConstants) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");

    var arrStatus = [{
        original: 1,
        new: "MỚI"
    }, {
        original: 2,
        new: "ĐÃ GIAO"
    }, {
        original: 3,
        new: "HOÀN THÀNH"
    }, {
        original: 4,
        new: "ĐÃ HỦY"
    }]

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
                field: "id",
                enableCellEdit: false,
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.id}}">{{row.entity.id}}</a></div>'
            }, {
                name: "Size",
                field: "size",
            }, {
                name: "Shiper Name",
                field: "shipper",
            }, {
                name: "Create At (m-d-y)",
                enableCellEdit: false,
                field: "time",

                sort: {
                    direction: 'desc',
                    priority: 0
                }
            }, {
                name: "Nhà vận chuyển",
                field: "carrier"
            },

            {
                name: "Trạng thái",
                field: "status",

            }
        ],
        enableFiltering: true,
        exporterCsvFilename: 'ExportCodes.csv',
        exporterMenuAllData: false,
        exporterMenuVisibleData: false,
        exporterExcelFilename: 'myFile.xlsx',
        exporterExcelSheetName: 'Sheet1',
        // exporterMenuExcel: false,
        exporterMenuPdf: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                console.log(rows);
            });
            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    // angular.element(document.getElementsByClassName('grid')[0]).css('height', '900px');
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        var jobskill_query = firestore.collection('exportCode').doc(rowEntity.id)
        jobskill_query.update({
            "shipper": rowEntity.shipper
        }).then(function () {
            new Noty({
                layout: 'bottomRight',
                theme: 'relax',
                timeout: 3000,
                type: 'success',
                text: 'ĐÃ CẬP NHẬT TÊN SHIPPER'
            }).show();
        });
    };

    $scope.options.gridMenuCustomItems = [{
        title: "IN PHIẾU",
        action: function () {
            $scope.printArr = []
            var selected = $scope.gridApi.selection.getSelectedRows();
            if (selected.length > 0) {
                selected.sort((a, b) => (a.carrier > b.carrier) ? 1 : ((b.carrier > a.carrier) ? -1 : 0));
                console.log(selected);
                chrome.storage.local.get('data', function (keys) {
                    selected.forEach(function (select, i) {
                        select.arrTraceno = []
                        select.orders.forEach(function (id) {
                            let ref = keys.data.find(x => x.id == id)
                            if (ref !== undefined) {
                                select.arrTraceno.push(ref.shipping_traceno)
                            }
                        })
                        if ((i + 1) == selected.length) {
                            $scope.printArr = selected
                            $scope.$apply()
                            window.print();
                        }
                    })
                })

            }
        }

    }]

    $scope.options.multiSelect = true;

    chrome.storage.local.get('export', function (keys) {
        getExport(keys.export)
    })

    chrome.storage.onChanged.addListener(function (changes) {
        getExport(changes.export.newValue);
    })

    function getExport(arr) {
        var sources = []
        arr.forEach(function (doc) {
            const myData = doc;
            ctime = moment(myData.create_at.seconds * 1000).format("YYYY-MM-DD / HH:MM")
            obj = {
                id: doc.id,
                shipper: myData.shipper,
                time: ctime,
                size: myData.orders.length,
                carrier: myData.carrier,
                status: arrStatus.find(x => x.original == myData.status).new,
                orders: myData.orders,
            }

            if (myData.shopeePaid && myData.buyerPaid) {
                obj.shopeePaid = myData.shopeePaid.toLocaleString()
                obj.buyerPaid = myData.buyerPaid.toLocaleString()
                obj.offset = (myData.shopeePaid - myData.buyerPaid).toLocaleString()
            }
            sources.push(obj)
        })
        $scope.data = sources
        $scope.options.data = $scope.data;
        $scope.loading = false
        $scope.gridApi.core.refresh();


    }


}