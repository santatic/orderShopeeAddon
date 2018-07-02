app.controller("exports-controller", ordersController)

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
            field: "id",
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.id}}">{{row.entity.id}}</a></div>'
        },{
            name: "Size",
            field: "size",
        }, {
            name: "Shiper Name",
            field: "shipper",
        }, {
            name: "Create At",
            enableCellEdit: false,
            field: "time"
        },{
            name: "Trạng thái",
            field: "status",
        }],
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
    var docRef = firestore.collection("exportCode")
    docRef.get().then(
        function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const myData = doc.data();
                // console.log(myData);
                ctime = moment(myData.create_at.seconds * 1000).format("DD-MM-YYYY")
                obj = new Object();
                obj = {
                    id: doc.id,
                    shipper: myData.shipper,
                    time: ctime,
                    size: myData.orders.length,
                    status: myData.status
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