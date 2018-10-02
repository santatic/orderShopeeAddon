app.controller("invoice-controller", function ($q, $scope, moment, uiGridConstants) {
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
        }, {
            id: 9,
            name: "Hủy"
        }
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
            name: "Mã Đơn",
            field: "invoiceId",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span title="click để xem chi tiết đơn" ng-click = "grid.appScope.detailInvoice(row)" style="cursor:pointer" class="glyphicon glyphicon-cog"></span> &nbsp;&nbsp;{{row.entity.invoiceId}}</a></div>'
        }, {
            name: "Id Đơn",
            field: "id",
            enableCellEdit: false,
            visible: false
        }, {
            name: "Trạng Thái",
            enableCellEdit: false,
            field: "statusName"
        }, {
            name: "Ghi Chú",
            field: "note"
        }, {
            name: "Mã Vận Đơn",
            enableCellEdit: false,
            visible: false,
            field: "shipping_traceId[0].id",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span style="color:blue">{{row.entity.shipping_traceId[0].id}}</span></div>'
        }, {
            name: "Giá Đơn (¥)",
            enableCellEdit: false,
            field: "sumPaidOriginal",
            cellTemplate: '<div class="ui-grid-cell-contents"><span style="color:black"><b>{{row.entity.sumPaidOriginal}}</b></span></div>'
        }, {
            name: "Phí Ship (¥)",
            field: "shipping_fee"
        }, {
            name: "Giảm Giá (¥)",
            field: "voucher_price"
        }, {
            name: "Tiền Việt (₫)",
            enableCellEdit: false,
            field: "vndPrice"
        }, {
            name: "Tỉ Giá",
            enableCellEdit: false,
            field: "currency_rate"
        }, {
            name: "Tạo Ngày",
            field: "create_at",
            enableCellEdit: false,
            sort: {
                direction: 'desc',
                priority: 0
            },
        }, ],
        showGridFooter: true,
        enableFiltering: true,
        gridFooterTemplate: "<div style='margin-left: 12px;'><span id='count'></span> ĐƠN - <span id='vndPrice'></span> ₫ - <span id='price'></span> &yen;</div>",
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var selected = $scope.gridApi.selection.getSelectedRows();
                console.log(selected);
                $('span#count').text("0")
                $('span#vndPrice').text("")
                $('span#price').text("")
                if (selected.length !== 0) {
                    $('span#count').text(selected.length)



                    function amountVND(item) {
                        return (Number(item.sumPaid) + Number(item.shipping_fee) - Number(item.voucher_price)) * Number(item.currency_rate);
                    }

                    function amountCNY(item) {
                        return Number(item.sumPaid) + Number(item.shipping_fee) - Number(item.voucher_price);
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
            gridApi.edit.on.afterCellEdit($scope, $scope.saveRow);
            // gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    $scope.optionsDetail = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 8,
        enableSorting: true,
        // showGridFooter: false,
        columnDefs: [
            {
                name: "Id",
                field: "original_sku",
                visible: false
            },
            {
                name: "Ảnh",
                field: "image",
                enableFiltering: false,
                width: "50",
                // field: "size",
                cellTemplate: "<img class='previewImg' src='{{row.entity.image}}' width=30 height=30 />"
            },{
                name: "Tên Sản Phẩm",
                field: "productName",
                width: "300",
                enableCellEdit: false
            },
            {
                name: "Phân Loại",
                field: "name",
                width: "100",
            },
            {
                name: "Số Lượng",
                field: "quantity",
                width: "60",
            },{
                name: "Thực Nhập",
                field: "actual_quantity",
                width: "60",
            },{
                name: "Giá",
                field: "price",
                width: "60",
            },{
                name: "Tổng",
                field: "sum",
                width: "60",
                enableCellEdit: false
            },{
                name: "Chênh lệch",
                field: "offset",
                width: "60",
            }
        ],
        showGridFooter: true,
        // enableFiltering: true,
        // gridFooterTemplate: "<div style='margin-left: 12px;'><span id='count'></span> ĐƠN - <span id='vndPrice'></span> ₫ - <span id='price'></span> &yen;</div>",
        onRegisterApi: function (gridApi) {
            $scope.gridApiDetail = gridApi;

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                console.log(rows);
            });
            gridApi.edit.on.afterCellEdit($scope, $scope.saveRowDetail);
            // gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    $scope.saveRowDetail = function (rowEntity, colDef, newValue, oldValue){
        
        let index = $scope.models.findIndex(x => x.original_sku == rowEntity.original_sku)
        
        if (colDef.field == "quantity") {
            $scope.models[index].quantity = Number(newValue)
        }
        if (colDef.field == "price") {
            $scope.models[index].price = Number(newValue)
        }
        if (colDef.field == "name") {
            $scope.models[index].name = (newValue).toString()
        }  
        if (colDef.field == "actual_quantity") {
            $scope.models[index].actual_quantity = (newValue).toString()
        }      

        let sum = 0
        $scope.models.forEach(function(element,i){    
            $scope.models[i].sum = $scope.models[i].quantity * $scope.models[i].price        
            sum = sum + $scope.models[i].sum            
            delete $scope.models[i].sum
        })

        firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
            "models": $scope.models,
            "sumPaid": sum
        }).then(function () {  
            $scope.sumPaid = sum

            $scope.models.forEach(function(element,i){ 
                $scope.models[i].sum = Number($scope.models[i].quantity) * Number($scope.models[i].price)
                $scope.models[i].offset = (Number($scope.models[i].actual_quantity) - Number($scope.models[i].quantity))*Number($scope.models[i].price)           
            })

            $scope.$apply()

            console.log(sum);           

            $scope.optionsDetail.data = obj.models

            $scope.gridApiDetail.core.refresh()

            new Noty({
                layout: 'bottomRight',
                theme: 'relax',
                timeout: 2000,
                type: 'success',
                text: 'ĐÃ CẬP NHẬT DỮ LIỆU'
            }).show();
        })

        console.log($scope.models);
        
    }
    $scope.saveRow = function (rowEntity, colDef, newValue, oldValue) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        console.log();
        if (colDef.field == "note") {
            var jobskill_query = firestore.collection('invoiceBuy').doc(rowEntity.id)
            jobskill_query.update({
                "note": rowEntity.note
            }).then(function () {

                new Noty({
                    layout: 'bottomRight',
                    theme: 'relax',
                    timeout: 2000,
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT NOTE'
                }).show();
            });
        }
        if (colDef.field == "shipping_fee") {
            var jobskill_query = firestore.collection('invoiceBuy').doc(rowEntity.id)
            jobskill_query.update({
                "shipping_fee": rowEntity.shipping_fee
            }).then(function () {

                new Noty({
                    layout: 'bottomRight',
                    theme: 'relax',
                    timeout: 2000,
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT PHÍ SHIP'
                }).show();
            });
        }
        if (colDef.field == "voucher_price") {
            var jobskill_query = firestore.collection('invoiceBuy').doc(rowEntity.id)
            jobskill_query.update({
                "voucher_price": rowEntity.voucher_price
            }).then(function () {

                new Noty({
                    layout: 'bottomRight',
                    theme: 'relax',
                    timeout: 2000,
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT GIÁ KHUYẾN MẠI'
                }).show();
            });
        }

    };
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.optionsDetail.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    var invoicesData = []
    chrome.storage.local.get('invoices', function (obj) {

        invoicesData = obj.invoices
        console.log(invoicesData);
        getInvoice(obj.invoices);

    })
    chrome.storage.onChanged.addListener(function (changes) {

        console.log("change", changes);
        invoicesData = changes.invoices.newValue
        getInvoice(changes.invoices.newValue);
        console.log(invoicesData);

    })
    var lastSel
    $scope.detailInvoice = function (row) {
        // console.log(row.id,invoicesData);
        $scope.options = false
        var obj = invoicesData.find(y => {
            return y.id === row.entity.id
        })

        $scope.sumPaid = Number(obj.sumPaid)
        $scope.shipping_fee = Number(obj.shipping_fee)
        $scope.voucher = Number(obj.voucher_price)
        $scope.traceNo = obj.shipping_traceId
        obj.models.forEach(function (element, i) {
            obj.models[i].quantity = Number(obj.models[i].quantity)
            obj.models[i].price = Number(obj.models[i].price)
            obj.models[i].sum =  obj.models[i].quantity * obj.models[i].price
            obj.models[i].image = obj.models[i].image? obj.models[i].image : "https://i.imgur.com/NWUJZb1.png",
            obj.models[i].offset = (Number(obj.models[i].actual_quantity) - obj.models[i].quantity)*obj.models[i].price           
        })

        $scope.optionsDetail.data = obj.models

        $scope.models = obj.models

        $scope.arrayStatus = arrayStatus
        $scope.invoiceId = obj.id
        $scope.currency_rate = Number(obj.currency_rate)
        console.log(obj);
        $('#showInvoice').modal()
        $("#showInvoice").on("hidden.bs.modal", function () {
            
            // $('ul#listClassify').html("")
        })
        $('div.itemInvoice select').val(obj.status.status)
        lastSel = obj.status.status
        $scope.status = obj.status.status

        $scope.editWeight = function (event) {

            var $this = $(event.currentTarget);
            var id = $this.parent().attr("id");

            let index = $scope.traceNo.findIndex(x => x.id == id)
            console.log(obj);
            var shippingNo = prompt("Mã Vận Đơn", $scope.traceNo[index].id);
            if (shippingNo != null) {
                var weightOfShippingNo = prompt("Cân nặng (Kg)", $scope.traceNo[index].weight)
                if (weightOfShippingNo !== null) {
                    var FeeOfShippingNo = prompt("Phí Ship (&yen;)", $scope.traceNo[index].shipping_fee)
                    if (FeeOfShippingNo !== null) {
                        $scope.traceNo[index].id = shippingNo
                        $scope.traceNo[index].weight = weightOfShippingNo
                        $scope.traceNo[index].shipping_fee = FeeOfShippingNo
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

        }

        $scope.addShippingNo = function () {

            var shippingNo = prompt("Nhập Mã Vận Đơn");
            if (shippingNo != null) {
                var weightOfShippingNo = prompt("Nhập cân nặng (Kg)")
                if (weightOfShippingNo !== null) {
                    var found = $scope.traceNo.some(function (el) {
                        return el.id == shippingNo.toString();
                    });
                    if (found) {
                        alert("Mã vận đơn này đã tồn tại")
                    } else {
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

        $scope.updateDetail = function () {
            var sumPaid = 0
            $('table.itemInvoicePreview tbody tr').each(function () {
                var orsku = $(this).attr("id")
                var newPrice = $(this).find("input[name='priceItem']").val()
                var newQuantity = $(this).find("input[name='quantityItem']").val()
                sumPaid = sumPaid + (newPrice * newQuantity)

                let index = $scope.models.findIndex(x => x.original_sku == orsku)

                if (newPrice !== $scope.models[index].price || newQuantity !== $scope.models[index].quantity) {
                    $scope.models[index].price = Number(newPrice);
                    $scope.models[index].quantity = Number(newQuantity)
                }

            })
            firestore.collection("invoiceBuy").doc($scope.invoiceId).update({
                "models": $scope.models,
                "shipping_fee": $scope.shipping_fee,
                "voucher_price": $scope.voucher,
                "sumPaid": $scope.sumPaid
            }).then(function () {
                $('#showInvoice').modal("hide")
                new Noty({
                    layout: 'bottomRight',
                    timeout: 1000,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT ĐƠN NHẬP THÀNH CÔNG'
                }).show()
            })

        }
        var timer = setInterval(function () {
            console.log("notyet");
            if ($('img.previewImg').length) {
                clearInterval(timer)
                $('img.previewImg').popover({
                    container: 'body',
                    html: true,
                    trigger: 'hover',
                    placement: 'left',
                    //placement: 'bottom',
                    content: function () {
                        let img = $(this).attr('src')
                        return img == "https://i.imgur.com/NWUJZb1.png" ? '<span>Sản phẩm này không có hình ảnh</span>' : '<img width="300px" src="' + img + '" />';

                    },
                    

                });

            }
        }, 100)

        // var timer = setInterval(function () {
        //     var $input = $('table.itemInvoicePreview input')
        //     console.log($input.length);
        //     if ($input.length > 0) {
        //         clearInterval(timer)
        //         $input.on("keyup change click", function () {

        //             $scope.sumPaid = 0
        //             $('table.itemInvoicePreview tbody tr').each(function () {
        //                 var newPrice = $(this).find("input[name='priceItem']").val()
        //                 var newQuantity = $(this).find("input[name='quantityItem']").val()
        //                 $scope.sumPaid = $scope.sumPaid + (newPrice * newQuantity)
        //                 $scope.$apply()
        //             })
        //             console.log("change", $scope.sumPaid);
        //         })
        //     }
        // })

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
            var InvoicePrice = Number(element.sumPaid) + Number(element.shipping_fee) - Number(element.voucher_price)
            element.sumPaidOriginal = InvoicePrice.toLocaleString()
            element.vndPrice = element.currency_rate ? (InvoicePrice * Number(element.currency_rate)).toLocaleString() : "CHƯA SET TỈ GIÁ"
            element.note = element.note ? element.note : ""

            let selectedExpTags = [parseInt(element.status.status)];
            let names = selectedExpTags.map(x => arrayStatus.find(y => y.id === x).name)
            element.statusName = names[0]

            element.models.forEach(function (valModel, i) {
                var selectedExpTags = [valModel.productId];
                var names = selectedExpTags.map(x => element.products.find(y => y.id === x).name)
                element.models[i].productName = names[0];
                element.models[i].actual_quantity = element.models[i].actual_quantity? element.models[i].actual_quantity: element.models[i].quantity
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
            if (selected.length > 0) {
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
                                    var newRate = parseInt(currency_rate) * parseInt(invoice.sumPaid)
                                    console.log(newRate);
                                    batch.update(doc, {
                                        "currency_rate": currency_rate
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
            } else {
                alert("Vui lòng chọn đơn cần set Tỉ Giá")
            }

        }

    }, {
        title: "TÌM MÃ VẬN ĐƠN",
        action: function(){
            $('#findMVD').modal()
            $('textarea#findMVDarea').focus()
            $('textarea#findMVDarea').bind("paste", function(e){
                var pastedData = e.originalEvent.clipboardData.getData('text');
                console.log(pastedData);
                var splitted = pastedData.split("\n");  
                console.log(splitted);
                var arrayData = []
                for( var i in splitted) { 
                    console.log(splitted[i]); 
                    $scope.options.data.every(function (element, index) {
                        // Do your thing, then:
                        var found = element.shipping_traceId.some(function (el) {
                            return el.id == splitted[i].toString().replace(/\s/g,'');
                        });
                        if (found) {
                            console.log($scope.options.data[index]);
                            var found1 = arrayData.some(function (el) {
                                return el.id == $scope.options.data[index].id;
                            });                          
                            if(!found1){
                                var obj = {
                                    id: $scope.options.data[index].id,
                                    orderId: $scope.options.data[index].invoiceId,
                                    shipping_trace: $scope.options.data[index].shipping_traceId,
                                    note: $scope.options.data[index].note
                                }
                                arrayData.push(obj)
                            }
                            return false
                        } else return true
                    })
                }
                if(arrayData.length > 0){                    
                    $scope.arrayData = arrayData
                    $scope.$apply()
                }else{
                    alert("Không tìm thấy gì cả!!")
                    $scope.arrayData = []
                    $scope.$apply()
                    
                }
            } );
        }
    }]
})