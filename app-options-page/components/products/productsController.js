app.controller("products-controller", productsController)

function productsController($scope, $q, $timeout, moment, uiGridConstants) {
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
        }, {
            name: "Số lượng đơn",
            field: "size",
        }, {
            name: "Ngày",
            enableCellEdit: false,
            field: "time",
        }, {
            name: "Ngân hàng",
            field: "bank",
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

    $scope.options.gridMenuCustomItems = [{
        title: "THÊM SẢN PHẨM",
        action: function () {
            var n = new Noty({
                closeWith: [],
                text: 'Product name? <input id="suggest" style="display:block" type="text">',
                buttons: [
                    Noty.button('YES', 'btn btn-success', function () {
                        var input = $('input#suggest').val()
                        if (input) {
                            // docRef.doc().set({
                            //     "suggest_chat": input
                            // }).then(function () {
                            //     getSuggest()
                            //     n.close();
                            // })
                        }
                    }, { id: 'button1', 'data-status': 'ok' }),

                    Noty.button('NO', 'btn btn-error', function () {
                        $('input#suggest').val("")
                        n.close();
                    })
                ]
            }).show();

        }

    },];

}
