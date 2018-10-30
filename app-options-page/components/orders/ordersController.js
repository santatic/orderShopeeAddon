app.controller("orders-controller", ordersController)
    .filter('mapGender', mapGender)
app.controller("orders-controller", ordersController)
    .filter('mapCarrier', mapCarrier)

// ordersController.$inject = ['$scope', '$timeout', 'moment', 'uiGridConstants', 'helper'];

function ordersController($scope, $timeout, moment, uiGridConstants, helper) {
    $scope.loading = true;
    $('.navbar').css({
        "margin-bottom": "15px"
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

    var now = moment((new Date()).getTime()).format('hh:mm_DD/MM/YYYY');

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
                field: "nickname",
            }, {
                name: "Dự kiến thu",
                enableCellEdit: false,
                field: "paid",
                width: '100'
            }, {
                name: "Mã đơn hàng",
                enableCellEdit: false,
                field: "orderId",
                cellTooltip: function (row) {
                    return row.entity.orderId;
                },
                visible: false
                // width: '100'
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
                field: "shippingFee",
                // visible: false
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
                },
                visible: false
            },
            statusDef, {
                name: "Trễ",
                field: "fromNow",
                type: "number",
                width: 60
            }
        ],
        enableFiltering: true,
        showGridFooter: true,
        exporterCsvFilename: 'ExportFromOrders' + now + '.csv',
        exporterMenuAllData: false,
        exporterMenuVisibleData: false,
        exporterMenuExcel: false,
        exporterMenuPdf: false,
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
    }, {
        title: "QUÉT SCAN",
        action: function () {
            $scope.BulkChangeStatus = []
            $scope.BulkStatusRadio = null
            // if (selected.length > 1) {

            $('#changeBulkStatus').modal()


            $("#changeBulkStatus").on("hidden.bs.modal", function () {
                $scope.BulkStatusRadio = null
                $scope.BulkChangeStatus = []
            })
            $scope.toggle = function (event) {
                console.log(event.currentTarget.checked);
                checkboxes = document.getElementsByName('scanId');
                for (var i = 0, n = checkboxes.length; i < n; i++) {
                    checkboxes[i].checked = event.currentTarget.checked;
                }
            }
            $scope.removeScan = function (target) {
                $this = target.currentTarget;
                $scope.BulkChangeStatus = $scope.BulkChangeStatus.filter(obj => obj.id !== angular.element($this).parent().attr('id'));
                angular.element($this).parent().remove()
                console.log($scope.BulkChangeStatus);
            }
            $scope.createExport = function () {
                var arrayCreateEx = []
                $('input[name="scanId"]:checked').each(function () {
                    arrayCreateEx.push({
                        id: $(this).val()
                    })
                })
                var timer = setInterval(function () {
                    if (arrayCreateEx.length > 0) {
                        clearInterval(timer)
                        helper.validateExportOrder(arrayCreateEx)
                    }
                })


            }

            // } else alert("Vui lòng chọn nhiều hơn 1 sản phẩm")
        }        
    },{
        title: "CHIA ĐƠN",
        action: function () { 
            $scope.users = []
            var selected = $scope.gridApi.selection.getSelectedRows();
            if(selected.length > 0){
                $('#chiadon').modal()
                
                firestore.collection("usersMobile").get().then(col=>{
                    col.forEach(doc=>{
                        console.log(doc.data());
                        $scope.users.push({
                            name: doc.data().displayName? doc.data().displayName: "null",
                            email: doc.data().email,
                            uid: doc.data().uid
                        })   
                        $scope.$apply()             
                    })
                })
                $scope.chiadon = function(){
                    $('#selectUser input:checkbox:checked').each(function(){
                        // console.log($(this).attr("id"))
                    })
                    var orders1 = []
                    selected.forEach(val=>{
                        var obj = dataForPro.find(ol=> {return ol.id == val.id})
                        // console.log(obj);
                        obj['order-items'].forEach(function(o) {  
                            orders1.push(o)
                        })
                    })

                    // var averageItem = (orders.length)/($('#selectUser input:checkbox:checked').length)
                    // console.log(averageItem);

                }
            }else{
                alert("Vui lòng chọn đơn cần chia cho người làm")
            }
        }
    }
]
    $('#bulkStatus input:radio').change(function (e) {
        var confirmChange = confirm("BẠN CÓ CHẮC MUỐN ĐỔI TRẠNG THÁI CÁC ĐƠN ĐÃ CHỌN")
        if (confirmChange) {
            var that = this
            var n = new Noty({
                layout: 'bottomRight',
                theme: "relax",
                type: 'warning',
                text: 'ĐANG THAY ĐỔI TRẠNG THÁI...'
            }).show();
            var batch = firestore.batch()
            var arrayAfterChange = $scope.BulkChangeStatus
            $('input[name="scanId"]:checked').each(function () {
                console.log($(that).val())
                let selectedExpTags = [$(that).val()];
                let names = selectedExpTags.map(x => arrayFilter.find(y => y.english == x).id)
                let status = selectedExpTags.map(x => arrayFilter.find(y => y.english == x).vietnamese)
                var docRef = firestore.collection("orderShopee").doc($(this).val())
                var obj = {
                    "own_status": {
                        status: names[0],
                        create_at: new Date()
                    }
                }
                batch.update(docRef, obj)
                let index = arrayAfterChange.findIndex(x => x.id == $(this).val())
                arrayAfterChange[index].new_status = status[0]

            })
            batch.commit().then(() => {
                n.close()
                $scope.BulkStatusRadio = null
                $scope.BulkChangeStatus = arrayAfterChange
                $('#checkall').prop('checked', false);
                $('input[name="scanId"]:checked').prop('checked', false);
                $scope.$apply()
                new Noty({
                    layout: 'bottomRight',
                    timeout: 1500,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐÃ THAY ĐỔI TRẠNG THÁI!'
                }).show();
            })
        } else $scope.BulkStatusRadio = null


    })
    var timeout = null;
    $('#testScan').on('keyup', function () {
        var that = this;
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(function () {
            var inputScan = $(that).val()
            if (inputScan && $.isNumeric(inputScan)) {
                let indexAfterScan = $scope.BulkChangeStatus.findIndex(x => x.id == inputScan)
                if (indexAfterScan == -1) {
                    $scope.BulkChangeStatus.unshift({
                        id: inputScan,
                        status: "",
                        new_status: ""
                    })
                    $(that).val("")
                    console.log($scope.BulkChangeStatus);
                    $scope.$apply()
                    let index = dataForPro.findIndex(x => x.id == inputScan)
                    if (index !== -1) {
                        const data = dataForPro[index]
                        let selectedExpTags = [data.own_status.status];
                        let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                        let indexPromise = $scope.BulkChangeStatus.findIndex(x => x.id == inputScan)
                        $scope.BulkChangeStatus[indexPromise].status = names[0]
                        $scope.$apply()
                    } else {
                        firestore.collection("orderShopee").doc(inputScan).get().then(function (doc) {
                            if (doc.exists) {
                                console.log("from DB");
                                const data = doc.data()
                                let selectedExpTags = [data.own_status.status];
                                let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                                let indexPromise = $scope.BulkChangeStatus.findIndex(x => x.id == inputScan)
                                $scope.BulkChangeStatus[indexPromise].status = names[0]
                                $scope.$apply()
                            } else {
                                alert("Đơn này không tồn tại trong hệ thống")
                                $(that).val("")
                            }
                        }).catch(function (error) {
                            alert("LỖI: " + error)
                        })
                    }

                } else {
                    alert("Đơn này đã có trong danh sách quét")
                    $(that).val("")
                }


                // let index = dataForPro.findIndex(x => x.id == inputScan)
                // const data = dataForPro[index]
                // let indexAfterScan = $scope.BulkChangeStatus.findIndex(x => x.id == inputScan)
                // if (indexAfterScan == -1) {

                //     let selectedExpTags = [data.own_status.status];
                //     let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                //     $scope.BulkChangeStatus.unshift({
                //         id: inputScan,
                //         status: names[0],
                //         new_status: ""
                //     })
                //     $scope.$apply()
                //     $(that).val("")
                // } else {
                //     alert("Đơn này đã có trong danh sách quét")
                //     $(that).val("")
                // }
            }

        }, 100);
    });


    $scope.options.multiSelect = true;
    var now = new Date
    var dataForPro = []

    chrome.runtime.sendMessage({
        mission: "ready"
    }, function (response) {
        chrome.storage.local.get('data', function (keys) {
            getData(keys.data)
            dataForPro = keys.data
        })
    })


    chrome.storage.onChanged.addListener(function (changes) {
        getData(changes.data.newValue);
        dataForPro = changes.data.newValue
    })
    $scope.options.gridMenuCustomItems.push({
        title: "IN SẢN PHẨM",
        action: function () {

            var selected = $scope.gridApi.selection.getSelectedRows();

            var products = []

            var condi = true

            selected.forEach(function (val) {
                var obj = dataForPro.find(function (obj) {
                    return obj.id == val.id;
                });

                if (!val.exId && val.ownStatus == 1) {} else {
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
                        orders: []
                    }
                    var orderObj = {
                        order: obj.shipping_traceno,
                        one: ""
                    }
                    if (obj['order-items'].length == 1 && productsObj.name.indexOf("Combo") == -1) {
                        orderObj.one = "only"
                    }
                    var found = products.some(function (el) {
                        return el.name == productsObj.name && el.model == productsObj.model;
                    });
                    if (!found) {
                        productsObj.orders.push(orderObj)
                        products.push(productsObj)
                    } else {
                        let index = products.findIndex(x => x.name == productsObj.name && x.model == productsObj.model)
                        products[index].amount = products[index].amount + productsObj.amount
                        products[index].orders.push(orderObj)
                    };

                });

            })
            if (condi) {
                console.log(products);
                products.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
                })
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
                    $('#changeBulkStatus').css("display", "block")
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
                        $('#changeBulkStatus').css("display", "none")
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

    $scope.createEx = function (name) {  
        let names = $scope.arr4.filter(y => y.name == name)
        console.log(name, names[0].orders);
        helper.validateExportOrder(names[0].orders)
    }

    function getData(data) {
        var sources = []
        var arrStt = []
        var arrNPP = []
        var arr4 = []
        data.forEach(function (doc) {
            const myData = doc
            if (jQuery.inArray(myData.own_status.status, arrStt) == -1) {
                arrStt.push(myData.own_status.status)
            }

            if (!myData.exportId && myData.own_status.status == 4) {
                if (jQuery.inArray(myData.actual_carrier, arrNPP) == -1) {
                    arrNPP.push(myData.actual_carrier)
                }
                arr4.push({
                    carrier: myData.actual_carrier,
                    id: myData.id
                })
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
                fromNow: Math.round((now - start) / (1000 * 60 * 60 * 24)),
                size: myData.order_items.length,
                orderId: myData.ordersn,
                lengthClassify: myData["order-items"].length
            }
            sources.push(obj)
        })

        $scope.arr4 = []

        arrNPP.forEach(function (val) {
            let selectedExpTags = [val];
            let names = arr4.filter(y => y.carrier == val)
            console.log(val, names);
            $scope.arr4.push({
                name: val,
                orders: names
            })
            $scope.$apply()
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

