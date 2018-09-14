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
            field: "shipping_traceId[0].id",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span style="color:blue">{{row.entity.shipping_traceId[0].id}}</span></div>'
        }, {
            name: "Tạo Ngày",
            field: "create_at"
        }, {
            name: "Giá Đơn",
            field: "sumPaidOriginal"
        }, {
            name: "Tiền Việt",
            field: "vndPrice"
        }, {
            name: "Trạng Thái",
            field: "statusName"
        }],
        showGridFooter: true,
        enableFiltering: true,
        gridFooterTemplate: "<div style='margin-left: 12px;'><span id='count'></span> ĐƠN - <span id='vndPrice'></span> VNĐ - <span id='price'></span> CNY</div>",
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var selected = $scope.gridApi.selection.getSelectedRows();
                console.log(selected);
                $('span#count').text("0")
                $('span#vndPrice').text("")
                $('span#price').text("")
                if(selected.length !== 0){
                    $('span#count').text(selected.length)
                    function amountVND(item) {
                        return item.vnd;
                    }
                    
                    function amountCNY(item) {
                        return item.sumPaid;
                    }    
    
                    function sum(prev, next) {
                        return parseInt(prev) + parseInt(next);
                    }
    
                    $('span#vndPrice').text(selected.map(amountVND).reduce(sum).toLocaleString());
                    $('span#price').text(selected.map(amountCNY).reduce(sum));
                }

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                console.log(rows);
            });
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
        $scope.options = false
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
        $scope.status = obj.status.status

        $scope.editWeight = function(event){

            var $this = $(event.currentTarget);
            var id = $this.parent().attr("id");

            let index = $scope.traceNo.findIndex(x => x.id == id)
            console.log(obj);
            var shippingNo = prompt("Mã Vận Đơn",$scope.traceNo[index].id);
            if (shippingNo != null) {
                var weightOfShippingNo = prompt("Cân nặng (Kg)", $scope.traceNo[index].weight)
                if(weightOfShippingNo !== null){
                    $scope.traceNo[index].id = shippingNo
                    $scope.traceNo[index].weight = weightOfShippingNo
                    firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
                        "shipping_traceId": JSON.parse(angular.toJson($scope.traceNo))
                    }).then(() => {
                        new Noty({
                            layout: 'bottomRight',
                            timeout: 1000,
                            theme: "relax",
                            type: 'success',
                            text: 'ĐÃ THAY ĐỔI THÔNG TIN VẬN ĐƠN '
                        }).show()
                    })
                }
                
            }

        }

        $scope.addShippingNo = function () {
                    
            var shippingNo = prompt("Nhập Mã Vận Đơn");
            if (shippingNo != null) {
                var weightOfShippingNo = prompt("Nhập cân nặng (Kg)")
                if(weightOfShippingNo !== null){
                    var found = $scope.traceNo.some(function (el) {
                        return el.id == shippingNo.toString();
                    });
                    if (found) {
                        alert("Mã vận đơn này đã tồn tại")
                    }else{
                        var obj = {
                            id: shippingNo.toString(),
                            weight: weightOfShippingNo,
                            time: new Date()
                        }
                        $scope.traceNo.push(obj)
                        firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
                            "shipping_traceId": JSON.parse(angular.toJson($scope.traceNo))
                        }).then(() => {
                            new Noty({
                                layout: 'bottomRight',
                                timeout: 1000,
                                theme: "relax",
                                type: 'success',
                                text: 'ĐÃ THÊM MÃ VẬN ĐƠN '
                            }).show()
                        })
                    }
                }
                
            }
        }

    }
    $('div.itemInvoice select').on('change', function () {
        console.log(this.value);
        var confirmChange = confirm("BẠN CÓ CHẮC MUỐN ĐỔI TRẠNG THÁI ĐƠN")
        if (confirmChange) {
            if (this.value == 8) {
                $('table.itemInvoicePreview tbody tr').each(function () {
                    var orsku = $(this).attr("id")
                    var newPrice = $(this).find("input[name='priceItem']").val()
                    var newQuantity = $(this).find("input[name='quantityItem']").val()

                    let index = $scope.models.findIndex(x => x.original_sku == orsku)

                    if (newPrice !== $scope.models[index].price || newQuantity !== $scope.models[index].quantity) {
                        $scope.models[index].price = newPrice;
                        $scope.models[index].quantity = newQuantity
                    }

                })
                firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
                    "status": {
                        status: parseInt(this.value),
                        time: new Date()
                    },
                    "models": $scope.models
                }).then(() => {
                    $scope.models.forEach(function (val) {
                        delete val.price
                    })
                    var id = (new Date()).getTime().toString()
                    firestore.collection("stock").doc(id).set({
                        id: id,
                        create_at: new Date,
                        invoiceId: ($scope.invoiceId).toString(),
                        plots: JSON.parse(angular.toJson($scope.models))
                    }).then(() => {
                        $('#showInvoice').modal("hide")
                        new Noty({
                            layout: 'bottomRight',
                            timeout: 1000,
                            theme: "relax",
                            type: 'success',
                            text: 'ĐÃ CHUYỂN TRẠNG THÁI ĐƠN VÀ LƯU KHO '
                        }).show()

                    })


                })
            } else {
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
            element.sumPaidOriginal = parseInt(element.sumPaid).toLocaleString() + " " + element.currency
            element.vndPrice = element.vnd? parseInt(element.vnd).toLocaleString() + " VNĐ": "CHƯA SET TỈ GIÁ"

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
        title: "SET TỈ GIÁ",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            var n = new Noty({
                closeWith: [],
                // timeout: 2000,
                layout: "topRight",
                text: `<input placeholder="Nhập tỉ giá ..." id="currency_rate" type="number">`,
                buttons: [
                    Noty.button('APPLY', 'btn btn-success', function () {
                        var currency_rate = $('input#currency_rate').val()
                        if (!currency_rate) {
                            alert("Vui lòng nhập tỉ giá cần đổi...")
                        } else {
                            var batch = firestore.batch()
                            selected.forEach(function (invoice) {
                                var doc = firestore.collection("invoiceBuy").doc(invoice.id);
                                var newRate = parseInt(currency_rate) * parseInt(invoice.sumPaid.match(/\d+/))
                                console.log(newRate);
                                batch.update(doc, {
                                    "vnd": newRate.toString()
                                });
                            })
                            // console.log(selected);
                            batch.commit().then(function () {
                                n.close()
                            });
                        }

                    }, {
                        id: 'button1',
                        'data-status': 'ok'
                    }),

                    Noty.button('CANCEL', 'btn btn-error', function () {
                        n.close();
                    })
                ]
            }).show();
        }

    }]
})