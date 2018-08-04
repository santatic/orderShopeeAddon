app.controller("orders-controller", ordersController)
    .filter('mapGender', mapGender)
app.controller("orders-controller", ordersController)
    .filter('mapCarrier', mapCarrier)

// ordersController.$inject = ['$scope', '$timeout', 'moment', 'uiGridConstants', 'helper'];

function ordersController($scope, $timeout, moment, uiGridConstants, helper) {
    $scope.loading = true;
    $('.navbar').css({
        "margin-bottom": "0"
    })
    var saleUrl = chrome.extension.getURL("options.html#/");
    var arrayFilter = [{
        id: 1,
        english: "NEW",
        vietnamese: "đơn mới"
    },
    {
        id: 2,
        english: "PREPARED",
        vietnamese: "đã nhặt đủ hàng để chờ đóng gói"
    },
    {
        id: 3,
        english: "UNPREPARED",
        vietnamese: "chưa nhặt được hàng vì lý do nào đó (ghi lý do vào noteWarehouse)"
    },
    {
        id: 4,
        english: "PACKED",
        vietnamese: "đã đóng gói"
    },
    {
        id: 5,
        english: "SHIPPED",
        vietnamese: "đã gửi đi"
    },
    {
        id: 6,
        english: "DELIVERED",
        vietnamese: "khách đã nhận"
    },
    {
        id: 7,
        english: "RETURNING",
        vietnamese: "đang hoàn hàng"
    },
    {
        id: 8,
        english: "RETURNED",
        vietnamese: "đã hoàn về kho"
    },
    {
        id: 9,
        english: "PAID",
        vietnamese: "đã thanh toán"
    },
    {
        id: 10,
        english: "REFUNDED",
        vietnamese: "đã hoàn tiền"
    },
    {
        id: 11,
        english: "CANCELED",
        vietnamese: "đã hủy"
    },
    ]

    var statusDef = {
        name: "Trạng Thái",
        field: "ownStatus",
        width: '160',
        // cellTemplate:'<div class="ui-grid-cell-contents" > {{row.entity.ownStatus}}</div>',
        filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: []
        },
        cellFilter: 'mapGender'
    }

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        columnDefs: [{
            name: "ID",
            field: "id",
            enableCellEdit: false,
            width: '100',
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
        }, {
            name: "Số Vận Đơn",
            enableCellEdit: false,
            field: "trackno",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span title="click để chỉnh sửa nhanh trạng thái" ng-click = "grid.appScope.doSomething(row)" style="cursor:pointer" class="glyphicon glyphicon-cog"></span>&nbsp;&nbsp; <a target="_blank" title="{{row.entity.trackno}}" href="options.html#/orders/{{row.entity.id}}">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            name: "UserName",
            enableCellEdit: false,
            width: '150',
            field: "nickname"
        }, {
            name: "Dự kiến thu",
            enableCellEdit: false,
            field: "paid",
            width: '100'
        }, {
            name: "Nhà Vận Chuyển",
            width: "150",
            field: "carrier",
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: 1,
                    label: "Giao Hàng Tiết Kiệm"
                },
                {
                    value: 2,
                    label: "Viettel Post"
                },
                {
                    value: 3,
                    label: "Giao Hàng Nhanh"
                },
                {
                    value: 4,
                    label: "VNPost Tiết Kiệm"
                }, {
                    value: 5,
                    label: "VNPost Nhanh"
                }
                ]
            },
            cellFilter: 'mapCarrier'
        },
        {
            name: "Phí Ship",
            enableCellEdit: false,
            width: '100',
            field: "shippingFee"
        }, {
            name: "Phiếu Xuất",
            field: "exId",
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/export/{{row.entity.exId}}">{{row.entity.exId}}</a></div>'
        },
        // {
        //     name: "Phiếu Thu",
        //     field: "importId",
        //     cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/import/{{row.entity.importId}}">{{row.entity.importId}}</a></div>'
        // },
        {
            name: "Logistics Shopee",
            enableCellEdit: false,
            field: "status",
            cellTooltip: function (row) {
                return row.entity.status;
            }
        }, {
            name: "Thời gian của Logistics",
            enableCellEdit: false,
            width: '100',
            field: "updateTime",
            sort: {
                direction: 'asc',
                priority: 0
            }
        },
            statusDef, {
            name: "Trễ",
            field: "fromNow"
        }
        ],
        enableFiltering: true,
        showGridFooter: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                console.log(rows);
            });
        }
    };
    // angular.element(document.getElementsByClassName('grid')[0]).css('height', '900px');
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.doSomething = function (row) {
        // console.log(row);
        // jQuery.noConflict(); 
        $scope.showStatus = row.entity.ownStatus
        var selectedExpTags = [row.entity.ownStatus];
        var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
        $scope.statusRadio = names[0]
        var obj = dataForPro.find(function (obj) {
            return obj.id == row.entity.id;
        });
        var amount = 0
        obj['order-items'].forEach((item, index) => {
            amount += item.amount
        })
        console.log(amount);
        // $scope.$apply()
        $('#myModal').modal();
        $('h4.modal-single').html('<span id="rowId">' + row.entity.id + '</span>' + ' - <span style="background:#00bfa5; color: #fff;padding: 0 7px;"># ' + row.entity.trackno + '</span> - ' + row.entity.nickname)
        $('.modal-footer.modal-single').html('<b>ĐƠN NÀY CÓ TẤT CẢ ' + row.entity.size + ' MẶT HÀNG, TỔNG SỐ LƯỢNG: ' + amount + '</b>')
        
    }
    $('.singleStatus input:radio').change(function (e) {
        // console.log((this.value));
        var selectedExpTags = [this.value];
        var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
        // console.log($('span#rowId').text());
        var n = new Noty({
            layout: 'bottomRight',
            theme: "relax",
            type: 'warning',
            text: 'ĐANG THAY ĐỔI TRẠNG THÁI...<br>HOÀN THÀNH KHI THÔNG BÁO NÀY BIẾN MẤT'
        }).show();
        firestore.collection("orderShopee").doc($('span#rowId').text()).update({
            "own_status": {
                status: names[0],
                create_at: new Date()
            }
        }).then(function () {
            $('#myModal').modal('hide');
            n.close()
            $('.noty_layout').addClass('noprint')
        })

    });
    var BulkChangeStatus = []
    $scope.options.gridMenuCustomItems = [{
        title: "IN ĐƠN",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            // console.log(selected);
            // $.each(selected, function (i, value) {
            //     var selectedExpTags = [parseInt(value.ownStatus)];
            //     var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
            //     value.own_Status = names[0];
            // })
            selected.sort(function (a, b) {
                return (a.trackno > b.trackno) ? 1 : ((b.trackno > a.trackno) ? -1 : 0)
            })
            $scope.rowSelected = selected;
            // window.onload = function () {
            selected.forEach(function (val) {
                // console.log(val.id);
                var timer = setInterval(function () {
                    if (($("#" + val.id)).length) {
                        clearInterval(timer)
                        console.log(val.id);
                        var qrcode = new QRCode(document.getElementById(val.id), {
                            width: 60,
                            height: 60,
                            correctLevel: QRCode.CorrectLevel.H
                        });

                        function makeCode() {
                            qrcode.makeCode(val.id.toString());
                        }
                        makeCode();
                    }
                })


            })
            // }

            $timeout(function () {
                window.print();
                $scope.rowSelected = []
            }, 500)
        }
    }, {
        title: "TẠO PHIẾU XUẤT",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            if (selected.length > 0) {
                helper.validateExportOrder(selected)
            } else {
                alert("vui lòng tick chọn đơn hàng cần tạo phiếu xuất")
            }

            // $.each(selected, function (i, value) {
            //     console.log(value.id);
            //     docRef = firestore.collection("orderShopee");
            //     docRef.get().then(function (doc) {
            //         const data = doc.data()
            //         if(data.exportId){

            //         }else{

            //         }
            //     })
            // })
        },        
    },{
        title: "ĐỔI TRẠNG THÁI",
        action: function() {
            
            var selected = $scope.gridApi.selection.getSelectedRows();            
            $scope.BulkChangeStatus = selected
            BulkChangeStatus = selected
            if(selected.length>1){
                                
                $('#changeBulkStatus').modal()
                $("#changeBulkStatus").on("hidden.bs.modal", function () {
                    $scope.BulkStatusRadio = null
                })

            }else alert("Vui lòng chọn nhiều hơn 1 sản phẩm")

           
        }
    }]
    $('#bulkStatus input:radio').change(function (e) {
        var n = new Noty({
            layout: 'bottomRight',
            theme: "relax",
            type: 'warning',
            text: 'ĐANG THAY ĐỔI TRẠNG THÁI HÀNG LOẠT...<br>HOÀN THÀNH KHI THÔNG BÁO NÀY BIẾN MẤT'
        }).show();
        
        var selectedExpTags = [this.value];
        var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
        console.log(names[0], BulkChangeStatus)
        var batch = firestore.batch();
        BulkChangeStatus.forEach(function(val){
            var DocRef = firestore.collection("orderShopee").doc(val.id.toString())
            batch.update(DocRef,{
                "own_status": {
                    status: names[0],
                    create_at: new Date()
                }
            })
        })
        batch.commit().then(function(){
            n.close()
            $("#changeBulkStatus").modal("hide")
        })

    })

    $scope.options.multiSelect = true;
    var now = new Date
    var dataForPro = []
    chrome.storage.local.get('data', function (keys) {
        getData(keys.data)
        dataForPro = keys.data
    })
    chrome.storage.onChanged.addListener(function (changes) {
        getData(changes.data.newValue);
        dataForPro = changes.data.newValue
    })
    $scope.options.gridMenuCustomItems.push({
        title: "IN SẢN PHẨM",
        action: function () {

            var selected = $scope.gridApi.selection.getSelectedRows();
            // console.log(selected);
            var products = []

            var condi = true

            selected.forEach(function (val) {
                var obj = dataForPro.find(function (obj) {
                    return obj.id == val.id;
                });

                if (!val.exId && val.ownStatus == 1) { } else {
                    condi = false
                }

                console.log(obj['order-items']);
                obj['order-items'].forEach((item, index) => {
                    // console.log(item.snapshotid + " = " + item.modelid);
                    let product = obj['products'].find(o => o.id === item.snapshotid);
                    // let regrex = /([A-Z])([0-9])/g
                    // console.log(product.name);

                    // let productImage = data['products'].find(o => o.id === item.images[0]);
                    let model = obj['item-models'].find(o => o.id === item.modelid)
                    var productsObj = new Object();
                    productsObj = {
                        name: product.name.replace(/([\s\S]*?)[[\s\S]*?]/g, '').replace("^^", ""),
                        model: model.name,
                        amount: item.amount,
                        imageUrl: "https://cf.shopee.vn/file/" + product.images[0] + "_tn",
                        orders: [obj.shipping_traceno]
                    }
                    var found = products.some(function (el) {
                        return el.name == productsObj.name && el.model == productsObj.model;
                    });
                    if (!found) {
                        products.push(productsObj)
                    } else {
                        let index = products.findIndex(x => x.name == productsObj.name && x.model == productsObj.model)
                        products[index].amount = products[index].amount + productsObj.amount
                        products[index].orders.push(obj.shipping_traceno)
                    };

                });

            })
            if (condi) {
                console.log(products);
                products.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) })
                products.unshift({
                    imageUrl: "TỔNG",
                    name: selected.length + " ĐƠN, " + products.length + " MẶT HÀNG",
                    model: "",
                    amount: ""
                })
                console.log(products);
                $scope.products = products
                $("#modalProduct").on("hidden.bs.modal", function () {
                    // put your default event here

                    $(".previewPro").html("")
                    $('canvas').remove()
                    $('.printBut').css("display", "none")
                    element.css("display", "block")
                    $scope.products = []
                    $scope.$apply()
                });


                var element = $("#html2image"); // global variable
                let getCanvas
                var timer = setInterval(function () {
                    if ($scope.products.length > 0) {
                        clearInterval(timer)
                        $('.printBut').css("display", "block")
                        $('#modalProduct').modal()

                        html2canvas(element, {
                            onrendered: function (canvas) {

                                var context = canvas.getContext("2d");
                                var img = new Image()
                                var elements = document.getElementsByClassName('imgPro')
                                for (var i = 0; i < elements.length; i++) {

                                    var offsets = elements[i].getBoundingClientRect();
                                    // console.log(offsets);
                                    var imgTop = offsets.top;
                                    var imgLeft = offsets.left;

                                    //Find actual position with parent cotainer
                                    var offsetsContainer = document.getElementById('html2image').getBoundingClientRect();
                                    imageLeft = parseInt(imgLeft) - parseInt(offsetsContainer.left);
                                    imageTop = parseInt(imgTop) - parseInt(offsetsContainer.top);
                                    // console.log(offsetsContainer);
                                    img.src = elements[i].src; // specifies the location of the image

                                    context.drawImage(img, imageLeft, imageTop, 80, 80); // draws the image at the specified x and y location
                                    // console.log(imageLeft, imageTop);
                                }
                                // document.body.appendChild(canvas);
                                console.log(canvas);
                                $("#previewPro").html(canvas);
                                getCanvas = canvas;
                                // canvas = null                        
                                element.css("display", "none")
                            }
                        });
                    }
                }, 300)

                dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
                    evt.preventDefault();
                };

                dropContainer.ondrop = function (evt) {
                    // pretty simple -- but not for IE :(
                    fileInput.files = evt.dataTransfer.files;
                    evt.preventDefault();
                };
                $("#upfile").click(function () {
                    $("#fileInput").trigger('click');
                });

                $('#fileInput').on("change", function () {

                    var $files = $(this).get(0).files;
                    var n2 = new Noty({
                        layout: 'topLeft',
                        theme: "relax",
                        type: 'warning',
                        text: 'ĐANG UPLOAD...'
                    }).on('afterShow', function () {
                        var settings = {

                            async: false,
                            crossDomain: true,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            url: 'https://api.imgur.com/3/image',
                            headers: {
                                Authorization: 'Client-ID 1a75998a3de24bd',
                                Accept: 'application/json'
                            },
                            mimeType: 'multipart/form-data'
                        };

                        var formData = new FormData();
                        formData.append("image", $files[0]);
                        settings.data = formData;

                        $.ajax(settings).done(function (response) {
                            n2.close()
                            var obj = JSON.parse(response)
                            var $temp = $("<input>");
                            $("body").append($temp);
                            $temp.val(obj.data.link).select();
                            var successful = document.execCommand('copy');
                            var msg = successful ? new Noty({
                                layout: 'topLeft',
                                timeout: 4000,
                                theme: "relax",
                                type: 'success',
                                text: 'ĐÃ COPY LINK ẢNH'
                            }).show() : new Noty({
                                timeout: 3500,
                                layout: 'topLeft',
                                theme: "relax",
                                type: 'error',
                                text: 'Copy LỖI'
                            }).show()
                            $temp.remove();
                            $(this).val("")
                            $('.noty_layout').addClass('noprint')
                        });
                    }).show();
                    console.log("Uploading file to Imgur..");
                    // Replace ctrlq with your own API key

                    // $("#btn-Download-Image").attr("download", selected.length + "orders-"+ $scope.products.length + "products.png").attr("href", newData);
                });
                $scope.printProduct = function () {
                    $timeout(function () {
                        window.print()
                    }, 500)
                }
            } else {
                alert("ĐƠN BẠN CHỌN KHÔNG PHẢI ĐƠN MỚI HOẶC ĐÃ CÓ MÃ PHIẾU XUẤT")
            }


        }
    })



    function getData(data) {
        var sources = []
        var arrStt = []
        data.forEach(function (doc) {
            const myData = doc
            if (jQuery.inArray(myData.own_status.status, arrStt) == -1) {
                arrStt.push(myData.own_status.status)
            }

            if (myData.logistic["logistics-logs"].length > 0) {
                ctime = moment((myData.logistic["logistics-logs"][0].ctime) * 1000).format('YYYY-MM-DD');
                description = myData.logistic["logistics-logs"][0].description
                description = description.indexOf('[Vietnam]') !== -1 ? description.replace('[Vietnam]', '') : description
            } else {
                let date = new Date()
                ctime = moment(date.getTime()).format('YYYY-MM-DD');
                description = ""
            }
            // console.log(ctime);
            obj = new Object();
            var start = new Date(myData.own_status.create_at.seconds * 1000)
            obj = {
                id: myData.id,
                trackno: myData.shipping_traceno,
                nickname: myData.user.name,
                name: myData.buyer_address_name,
                paid: ((myData.buyer_paid_amount * 100) / 100).toLocaleString(),
                carrier: myData.actual_carrier,
                shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
                exId: myData.exportId,
                status: description,
                updateTime: ctime,
                importId: myData.importMoneyId,
                ownStatus: myData.own_status.status,
                fromNow: Math.round((now - start) / (1000 * 60 * 60 * 24)) + " ngày",
                size: myData.order_items.length
            }
            sources.push(obj)
        })
        var arrStatus = []
        arrStt.forEach(function (val) {
            let selectedExpTags = [val];
            let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
            let obj = {
                value: val,
                label: names[0]
            }
            arrStatus.push(obj)
        })
        console.log(arrStatus);
        $scope.data = sources
        statusDef.filter.selectOptions = arrStatus
        $scope.options.data = $scope.data;
        $scope.loading = false
        $scope.gridApi.core.refresh();


        sources.forEach(function (row, index) {
            switch (row.carrier) {
                case "Giao Hàng Tiết Kiệm":
                    row.carrier = 1;
                    break;
                case "Viettel Post":
                    row.carrier = 2
                    break
                case "Giao Hàng Nhanh":
                    row.carrier = 3
                    break
                case "VNPost Tiết Kiệm":
                    row.carrier = 4
                    break
                case "VNPost Nhanh":
                    row.carrier = 5
                    break
            }


        })
    }
}



function mapCarrier() {
    var genderHash = {
        1: "Giao Hàng Tiết Kiệm",
        2: "Viettel Post",
        3: "Giao Hàng Nhanh",
        4: "VNPost Tiết Kiệm",
        5: "VNPost Nhanh"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};

function mapGender() {
    var genderHash = {
        1: "Đơn mới",
        2: "Đã nhặt đủ hàng để chờ đóng gói",
        3: "Chưa nhặt đủ hàng",
        4: "Đã đóng gói",
        5: "Đã gửi đi",
        6: "Khách đã nhận hàng",
        7: "Đang hoàn hàng chưa về đến kho",
        8: "Đã hoàn về kho",
        9: "Đã thanh toán",
        "HT": "Đã hoàn tiền",
        "0": "Đã hủy"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};