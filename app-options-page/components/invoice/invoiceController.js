app.controller("invoice-controller", function ($scope, moment, uiGridConstants) {
    var arrayStatus = [{
            id: 1,
            name: "Đơn Mới"
        },
        {
            id: 2,
            name: "Đã Thanh Toán"
        },
        {
            id: 3,
            name: "Đã Gửi Đi"
        },
        {
            id: 4,
            name: "Đã Nhận TQ"
        },
        {
            id: 5,
            name: "Đã Nhận VN"
        },
        {
            id: 6,
            name: "Đã Về Kho"
        },
        {
            id: 7,
            name: "Thiếu"
        },
        {
            id: 8,
            name: "Đủ"
        },
    ]



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
            name: "Id Đơn",
            field: "id",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span title="click để xem chi tiết đơn" ng-click = "grid.appScope.detailInvoice(row)" style="cursor:pointer" class="glyphicon glyphicon-cog"></span> &nbsp;&nbsp;{{row.entity.id}}</a></div>'
        }, {
            name: "Mã Vận Đơn",
            field: "shipping_traceId",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span style="color:blue">{{row.entity.shipping_traceId}}</span></div>'
        }, {
            name: "Tạo Ngày",
            field: "create_at"
        }, {
            name: "Giá Đơn",
            field: "sumPaid"
        }, {
            name: "Trạng Thái",
            field: "statusName"
        }],
        showGridFooter: true,
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            // gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            // });

            // gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {                
            //     console.log(rows);
            // });
            // gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    var invoicesData = []
    chrome.storage.local.get('invoices', function (obj) {

        getInvoice(obj.invoices);
        invoicesData = obj.invoices
        console.log(invoicesData);

    })
    chrome.storage.onChanged.addListener(function (changes) {

        console.log("change", changes);
        getInvoice(changes.invoices.newValue);
        invoicesData = changes.invoices.newValue
        console.log(invoicesData);

    })
    var lastSel
    $scope.detailInvoice = function (row) {
        // console.log(row.id,invoicesData);
        var obj = invoicesData.find(y => {
            return y.id === row.entity.id
        })
        $scope.traceNo = obj.shipping_traceId
        $scope.models = obj.models
        $scope.arrayStatus = arrayStatus
        $scope.invoiceId = obj.id
        console.log(obj);
        $('#showInvoice').modal()
        $('div.itemInvoice select').val(obj.status.status)
        lastSel = obj.status.status

    }
    $('div.itemInvoice select').on('change', function () {
        console.log(this.value);
        var confirmChange = confirm("BẠN CÓ CHẮC MUỐN ĐỔI TRẠNG THÁI ĐƠN")
        if (confirmChange) {
            if(this.value == 8){
                alert("đủ")
                
            }else{
                firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
                    "status": {
                        status: parseInt(this.value),
                        time: new Date()
                    }
                }).then(() => {
                    $('#showInvoice').modal("hide")
                    new Noty({
                        layout: 'bottomRight',
                        timeout: 1000,
                        theme: "relax",
                        type: 'success',
                        text: 'ĐÃ CHUYỂN TRẠNG THÁI ĐƠN '
                    }).show()
                })
            }
            
        } else {
            $('div.itemInvoice select').val(lastSel)
        }

    });

    function getInvoice(invoices) {
        // console.log(invoices);
        invoices.forEach(element => {
            element.create_at = moment(element.create_at.seconds * 1000).format("MM/DD/YYYY")
            element.sumPaid = element.sumPaid.toLocaleString() + " " + element.currency
            let selectedExpTags = [parseInt(element.status.status)];
            let names = selectedExpTags.map(x => arrayStatus.find(y => y.id === x).name)
            element.statusName = names[0]
            element.models.forEach(function (valModel, i) {
                var selectedExpTags = [valModel.productId];
                var names = selectedExpTags.map(x => element.products.find(y => y.id === x).name)
                element.models[i].productName = names[0]
            })
        });
        console.log(invoices);

        $scope.options.data = invoices
        $scope.gridApi.core.refresh()
    }
    $scope.options.gridMenuCustomItems = [{
        title: "TẠO ĐƠN MỚI",
        action: function () {

        }

    }]
})