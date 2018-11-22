
app.controller("imports-controller", ordersController)

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
            name: "Mã phiếu thu",
            field: "id",
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/import/{{row.entity.id}}">{{row.entity.id}}</a></div>'
        },{
            name: "Số lượng đơn",
            field: "size",
        }, {
            name: "Ngày nhận tiền",
            enableCellEdit: false,
            field: "time",
            sort: {
                direction: 'desc',
                priority: 0
            }
        },{
            name: "Ngân hàng",
            field: "bank",
        },{
            name: "A.Thực Thu",
            field: "shopeePaid",
        },
        {
            name: "B.Dự kiến",
            field: "buyerPaid",
        },
        {
            name: "A-B",
            field: "offset"
        },],
        enableFiltering: true,
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
        title: "IN ĐƠN",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            console.log(selected);


            // $timeout(function () {
            //     window.print();
            //     $scope.rowSelected = []
            // }, 500)
        }

    }]

    $scope.options.multiSelect = true;
    var sources = []
    var docRef = firestore.collection("importCode")
    docRef.get().then(
        function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const myData = doc.data();
                // console.log(myData);
                ctime = myData.reciveMoneyAt
                obj = new Object();
                obj = {
                    id: doc.id,
                    bank: myData.myBank,
                    time: ctime,
                    size: myData.orders.length
                }
                if (myData.shopeePaid && myData.buyerPaid) {
                    obj.shopeePaid = myData.shopeePaid.toLocaleString()
                    obj.buyerPaid = myData.buyerPaid.toLocaleString()
                    obj.offset = (myData.shopeePaid - myData.buyerPaid).toLocaleString()
                }
                sources.push(obj)
            })
            console.log(sources);
            $scope.data = sources
            $scope.options.data = $scope.data;
            $scope.loading = false
            $scope.gridApi.core.refresh();

            // console.log(querySnapshot.size);
        }
    ).then(function () {
        console.log($scope);
        //$scope.apply();
    })

}