app.controller("export-controller", ordersController)
    .filter('mapGender', mapGender)

ordersController.$inject = ['$scope', '$timeout', 'moment', '$routeParams', 'uiGridConstants', 'helper'];

function ordersController($scope, $timeout, moment, $routeParams, uiGridConstants, helper) {
    $scope.loading = true;
    $scope.cancel = true
    var id = $routeParams.id
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
        vietnamese: "đã đóng gói chờ gửi đi"
    },
    {
        id: 5,
        english: "SHIPPED",
        vietnamese: "đã gửi đi"
    },
    {
        id: 6,
        english: "DELIVERED",
        vietnamese: "khách đã nhận hàng"
    },
    {
        id: 7,
        english: "RETURNING",
        vietnamese: "đang hoàn hàng chưa về đến kho"
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
        name: "Own Status",
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
        showGridFooter: false,
        columnDefs: [statusDef, {
            name: "OrderId",
            field: "id",
            enableCellEdit: false,
            width: '100',
            cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.id}}">{{row.entity.id}}</a></div>'
        }, {
                name: "TrackNo",
                enableCellEdit: false,
                width: '200',
                field: "trackno",
                cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.id}}">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
                name: "NickName",
                enableCellEdit: false,
                field: "nickname"
            }, {
                name: "Buyer Paid",
                enableCellEdit: false,
                field: "paid",
                width: '100'
            },
            {
                name: "Shipping Fee",
                enableCellEdit: false,
                width: '100',
                field: "shippingFee"
            },
            // {
            //     name: "Status Shopee",
            //     enableCellEdit: false,
            //     field: "status",
            //     cellTooltip: function (row) {
            //         return row.entity.status;
            //     }
            // }, 
            // {
            //     name: "Status Time",
            //     enableCellEdit: false,
            //     width: '100',
            //     field: "updateTime"
            // },


        ],
        enableFiltering: true,
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

    $('input:radio').change(function (e) {
        var valueSelected = this.value;
        console.log(valueSelected);
        if (valueSelected == "CANCEL") {
            console.log("cancel");
            var docRef = firestore.collection("orderShopee").where("exportId", "==", id);
            docRef.get().then(
                function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        firestore.collection("orderShopee").doc(doc.id).update({
                            "exportId": ""
                        })
                    })
                }).then(function () {
                    firestore.collection("exportCode").doc(id).update({
                        "status": "HỦY PHIẾU"
                    }).then(function () {
                        new Noty({
                            layout: 'bottomRight',
                            timeout: 1500,
                            theme: "relax",
                            type: 'success',
                            text: 'ĐÃ HỦY PHIẾU'
                        }).on('afterShow', function () {
                            window.close()
                        }).show();
                        $('label#status').text("ĐÃ HỦY")
                        $scope.cancel = false
                        $scope.$apply()
                    })

                })

        } else if(valueSelected == "DONE"){

            

        }else{
            firestore.collection("exportCode").doc(id).update({
                "status": valueSelected
            }).then(function () {
                console.log("done");
                $('label#status').text(valueSelected)
                new Noty({
                    layout: 'bottomRight',
                    timeout: 2000,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT TRẠNG THÁI CỦA PHIẾU'
                }).show();
                $('.noty_layout').addClass('noprint')
            })
        }



    });

    $scope.printEx = function () {  
        $('#haveQR').append('<td id="qrcodeEx" ></td>')
                $scope.id = id;
                var qrcode = new QRCode("qrcodeEx", {
                    width: 100,
                    height: 100,
                    correctLevel: QRCode.CorrectLevel.H
                });

                function makeCode() {
                    qrcode.makeCode(id);
                }
                makeCode();
                $timeout(function () {
                    window.print();
                    $('#qrcode').remove()
                }, 500)
    }

    $scope.options.gridMenuCustomItems = [
        {
            title: "IN PHIẾU XUẤT",
            action: function () {
                $('#haveQR').append('<td id="qrcodeEx" ></td>')
                $scope.id = id;
                var qrcode = new QRCode("qrcodeEx", {
                    width: 100,
                    height: 100,
                    correctLevel: QRCode.CorrectLevel.H
                });

                function makeCode() {
                    qrcode.makeCode(id);
                }
                makeCode();
                $timeout(function () {
                    window.print();
                    $('#qrcode').remove()
                }, 500)
            }
        },
        {
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
                // if (condi) {
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

                // dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
                //     evt.preventDefault();
                // };

                // dropContainer.ondrop = function (evt) {
                //     // pretty simple -- but not for IE :(
                //     fileInput.files = evt.dataTransfer.files;
                //     evt.preventDefault();
                // };
                // $("#upfile").click(function () {
                //     $("#fileInput").trigger('click');
                // });

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
                // } else {
                //     alert("ĐƠN BẠN CHỌN KHÔNG PHẢI ĐƠN MỚI HOẶC ĐÃ CÓ MÃ PHIẾU XUẤT")
                // }


            }
        }

    ]

    $scope.options.multiSelect = true;


    $('#shipperName').keyup(function (eventObj) {
        if (eventObj.which == 13) {
            firestore.collection("exportCode").doc(id).update({
                "shipper": $(this).val()
            }).then(function () {
                new Noty({
                    layout: 'bottomRight',
                    timeout: 2000,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT TÊN NGƯỜI NHẬN HÀNG'
                }).show();
                $('.noty_layout').addClass('noprint')
            })
        }
    });
    var dataForPro = []
    // firestore.collection("orderShopee").where("exportId", "==", id.toString()).get()
    // .then(function(querySnapshot) {
    //     getData(querySnapshot)
    // })
    var ordersInEx
    chrome.storage.local.get('data', function (keys) {
        
        firestore.collection("exportCode").doc(id.toString()).get().then(function (doc) {
            const data = doc.data()
            $scope.originLength = data.orders.length
            $scope.id = doc.id
            $scope.shipperName = data.shipper;
            ordersInEx = data.orders
            if (data.status == "HỦY PHIẾU") {
                $scope.cancel = false
                $scope.status = "PHIẾU NÀY ĐÃ BỊ HỦY"
            } else {
                $scope.status = data.status
                switch (data.status){
                    case "MỚI":
                        $scope.status = "NEW"
                        break
                    case "ĐÃ GIAO":
                        $scope.status = "SHIPPED"
                        break
                }
            }
            $scope.date = moment(data.create_at.seconds * 1000).format("DD-MM-YYYY HH:mm");
            $scope.$apply()
            getData(ordersInEx, keys.data)
        })
        // .catch(function (error) {
        //     new Noty({
        //         layout: 'bottomRight',
        //         theme: "relax",
        //         type: 'error',
        //         text: error
        //     }).show();
        // })

    })
    chrome.storage.onChanged.addListener(function (changes) {
        $scope.options.data = []
        $scope.$apply()
        getData(ordersInEx, changes.data.newValue);
    })
    var sources = []
    function getData(ordersInExport, arrayData) {
        // console.log(arrayData);
        // console.log(ordersInExport);

        var arrTraceno = []
        var arrShipped = []
        var arrDone = []
        // var dataOrders = arrayData.filter(function (event) {
        //     return event.exportId == id;
        // })
        if (arrayData) {
            var arrStt = []
            ordersInExport.forEach(function (idOrder) {
                var found = arrayData.some(function (el) {
                    return el.id == idOrder;
                });
                if (found) {
                    let index = arrayData.findIndex(x => x.id == idOrder)
                    data(arrayData[index])
                } else {
                    // console.log(idOrder, "ko thaays");
                    firestore.collection("orderShopee").doc(idOrder.toString()).get().then(function (docOrder) {
                        data(docOrder.data())
                    }).then(function(){
                        $scope.run = true
                        console.log("from Server");
                    })
                }

                function data(myData) {
                    dataForPro.push(myData)
                    // console.log(myData);
                    if (jQuery.inArray(myData.own_status.status, arrStt) == -1) {
                        arrStt.push(myData.own_status.status)
                    }

                    obj = new Object();
                    obj = {
                        id: idOrder,
                        trackno: myData.shipping_traceno,
                        nickname: myData.user.name + " - " + myData.buyer_address_name,
                        carrier: myData.actual_carrier,
                        paid: ((myData.buyer_paid_amount * 100) / 100).toLocaleString(),
                        shippingFee: ((myData.shipping_fee * 100) / 100).toLocaleString(),
                        ownStatus: myData.own_status.status == 11? "11": myData.own_status.status
                    }
                    if (myData.own_status.status == 5) {
                        arrShipped.push(idOrder)
                    }
                    if (myData.own_status.status == 8||myData.own_status.status == 9||myData.own_status.status == 11) {
                        arrDone.push(idOrder)
                    }

                    sources.push(obj)
                    $scope.options.data.push(obj)
                    $scope.gridApi.core.refresh();
                    $scope.size = $scope.originLength
                    $scope.$apply()
                    arrTraceno.push((obj.trackno))
                    
                }
            })
            var arrStatus = []
            

            
            if (arrShipped.length == sources.length) {
                $('span#shipped').css({
                    "padding": "5px",
                    "background": " #45da0a",
                    "color": "#fff"
                })
            } else {
                $('span#shipped').css({
                    "padding": "5px",
                    "background": " #000",
                    "color": "#fff"
                })
            }

            $scope.arrShipped = arrShipped
            $scope.arrDone = arrDone            
            $scope.carrier = sources[0].carrier
            $scope.arrTraceno = arrTraceno
            
            // console.log(arrayData.length);
            
            // console.log($scope.arrTraceno);
            // $scope.options.data = $scope.data;
            $scope.loading = false  
            // console.log($scope.options.data);  
            var timer = setInterval(function () {  
                if($scope.options.data.length == $scope.originLength && $scope.run){
                    clearInterval(timer)
                    arrStt.forEach(function (val) {
                        let selectedExpTags = [val];
                        let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                        let obj = {
                            value: val==11? "11":val,
                            label: names[0]
                        }
                        arrStatus.push(obj)
                    })
                    statusDef.filter.selectOptions = arrStatus
                    console.log(statusDef.filter.selectOptions);
                    console.log($scope.options.data);
                    
                }
            })        
            
        } else {
            $scope.loading = false
        }
    }
    var timer = setInterval(function () {
        if($scope.arrDone.length == $scope.size && $scope.status !== "DONE"&& $scope.status !== "CANCEL"){
            clearInterval(timer)
            console.log("ok");
            var n = new Noty({
                layout: 'bottomRight',
                theme: "relax",
                type: 'success',
                text: 'ĐANG CHUYỂN TRẠNG THÁI PHIẾU VỀ HOÀN THÀNH...'
            }).on("afterShow", function () {
                firestore.collection("exportCode").doc(id).update({
                    "status": "DONE"
                }).then(()=>{
                    n.close()
                    $scope.status = "DONE"
                    $scope.$apply()
                })
            }).show()
        }else{
            setTimeout(function( ) { clearInterval( timer ); }, 10000);
        }
    })


}


function mapGender() {
    var genderHash = {
        1: "Đơn mới",
        2: "Đã nhặt đủ hàng để chờ đóng gói",
        3: "Chưa nhặt đủ hàng",
        4: "Đã đóng gói chờ gửi đi",
        5: "Đã gửi đi",
        6: "Khách đã nhận hàng",
        7: "Đang hoàn hàng chưa về đến kho",
        8: "Đã hoàn về kho",
        9: "Đã thanh toán",
        "HT": "Đã hoàn tiền",
        "11": "Đã hủy"
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
};
