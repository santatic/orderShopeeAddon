app.controller("products-controller", productsController)

function productsController($scope, $q, $timeout, moment, uiGridConstants) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");

    docRef = firestore.collection("1688_products");

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        showTreeExpandNoChildren: false,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        rowHeight: 60,
        columnDefs: [{
            name: "STT",
            field: "stt",
            width: 40
        }, {
            name: "Hình ảnh",
            cellTemplate: "<img ng-if='row.entity.img' src='{{row.entity.img}}' ng-class='{imgageRight: row.entity.$$treeLevel == 1, imgageLeft: row.entity.$$treeLevel == 0 }' alt='{{row.entity.name}}'/><span ng-if='!row.entity.img'>Không có ảnh</span>",
            enableCellEdit: false,
        }, {
            name: "Tên sản phẩm",
            field: "name",
        }, {
            name: "SKU",
            enableCellEdit: false,
            field: "sku",
        }, {
            name: "Action",
            cellTemplate: '<button class="btn btn-info" ng-click="">Delete</button>'
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
        },

        // [{
        //     img: "https://cbu01.alicdn.com/img/ibank/2016/641/751/3365157146_1945083708.32x32.jpg",
        //     name: "hihi",
        // }]
    };

    var dataui = [];
    docRef.get().then(query => {
        var stt = 1;
        query.forEach(doc => {
            var data = doc.data();
            console.log(data);
            docRef.doc(data.SKU_name).collection('SKU_classify').get().then(query2 => {
                dataui.push({
                    img: data.images ? data.images[0].replace('400x400', '50x50') : '',
                    name: data.name,
                    sku: data.SKU_name,
                    stt: stt,
                    $$treeLevel: 0
                });
                stt++;
                query2.forEach(doc2 => {
                    var data2 = doc2.data();
                    dataui.push({
                        img: data2.skuUrl_Image.replace('jpg', '50x50.jpg'),
                        name: '',
                        sku: data2.spSku,
                        $$treeLevel: 1
                    })
                });
                $scope.gridApi.core.refresh();
            })
            // return {img: data.images[0], name: data.name}
        });
        console.log(dataui);
        $scope.options.data = dataui;
        // $scope.loading = false;
        $scope.gridApi.core.refresh();
    })

    $scope.options.gridMenuCustomItems = [{
        title: "THÊM SẢN PHẨM",
        action: function () {
            var n = new Noty({
                closeWith: [],
                text: 'Product name? <input id="nameProduct" style="display:block" type="text">',
                buttons: [
                    Noty.button('YES', 'btn btn-success', function () {
                        var input = $('input#nameProduct').val()
                        if (input) {
                            var d = new Date();
                            var mseconds = d.getTime().toString();
                            docRef.doc(mseconds).set({
                                "SKU_name": mseconds,
                                "name": input
                            }).then(function () {
                                n.close();
                            })
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
