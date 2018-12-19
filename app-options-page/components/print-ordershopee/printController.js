
app.controller("print-controller", function ($scope, $rootScope, $routeParams, helper,moment) {
    $scope.printProducts = false
    var arrayFilter = [{
            id: 1,
            english: "NEW",
            vietnamese: "Đơn mới"
        },
        {
            id: 2,
            english: "PREPARED",
            vietnamese: "Đủ hàng"
        },
        {
            id: 3,
            english: "UNPREPARED",
            vietnamese: "Thiếu hàng"
        },
        {
            id: 4,
            english: "PACKED",
            vietnamese: "Đã đóng gói"
        },
        {
            id: 5,
            english: "SHIPPED",
            vietnamese: "Đã gửi đi"
        },
        {
            id: 6,
            english: "DELIVERED",
            vietnamese: "Khách đã nhận"
        },
        {
            id: 7,
            english: "RETURNING",
            vietnamese: "Đang hoàn hàng"
        },
        {
            id: 8,
            english: "RETURNED",
            vietnamese: "Đã hoàn về kho"
        },
        {
            id: 9,
            english: "PAID",
            vietnamese: "Đã thanh toán"
        },
        {
            id: 10,
            english: "REFUNDED",
            vietnamese: "Đã hoàn tiền"
        },
        {
            id: 11,
            english: "CANCELED",
            vietnamese: "Đã hủy"
        },
    ]

    var id = $routeParams.id;

    var products = []

    function myPrint() {
        $("#left").append("<div id='line' class='row' style='margin-top: 20px; border-bottom: #000 dashed 1px; margin-bottom: 25px;'></div>")
        $("#trackno").css({
            "font-size": "30px"
        })
        console.log($scope.printProducts);
        if($scope.printProducts){
            $('.rowProducts').removeClass('noprint')
            $('.rowProducts').addClass('print')
            $('.imageProduct').css({
                "display": "none"
            })
        }
        setTimeout(function(){
            window.print()
            $("#line").remove()
            $('.rowProducts').removeClass('print')
            $('.rowProducts').addClass('noprint')
            $('.imageProduct').css({
                "display": "block"
            })
            $("#trackno").css({
            "font-size": "15px"
        })
        },500)
        
        
    }

    $scope.print = function () {
        myPrint()
    }

    var saleUrl = chrome.extension.getURL("options.html#/");

    $('button#saveNote').click(function () {
        var note = $('#noteEdit').val();
        
            firestore.collection("orderShopee").doc(id).update({
                "note": note
            }).then(function () {
                console.log("done");
                new Noty({
                    layout: 'topLeft',
                    theme: "relax",
                    timeout: 2500,
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT NOTE'
                }).show();
            })
        
    })
    $('button#cancelNote').click(function () {
        $('#noteEdit').val("")
    })

    $('.form-group-status input:radio').change(function (e) {
        console.log((this.value));
        var selectedExpTags = [this.value];
        var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
        console.log(names);
        var n = new Noty({
            layout: 'topLeft',
            theme: "relax",
            type: 'warning',
            text: 'ĐANG THAY ĐỔI TRẠNG THÁI....'
        }).show();
        firestore.collection("orderShopee").doc(id).update({
            "own_status": {
                status: names[0],
                create_at: new Date()
            }
        }).then(function () {
            new Noty({
                layout: 'topLeft',
                timeout: 2000,
                theme: "relax",
                type: 'success',
                text: 'TRẠNG THÁI ĐƠN ĐÃ ĐƯỢC CẬP NHẬT'
            }).show();
            $('.noty_layout').addClass('noprint')            
            n.close()
            myPrint()
        })

    });
    chrome.storage.local.get('data', function (keys) {
        dataOrders = keys.data
        var found = dataOrders.some(function (el) {
            return el.id == id;
        });
        if (found) {
            let index = dataOrders.findIndex(x => x.id == id)
            getDetail(dataOrders[index])
        } else {
            let n = new Noty({
                layout: 'bottomRight',
                theme: "relax",
                type: 'success',
                text: 'ĐANG TRUY VẤN TỪ SERVER...'
            }).show();
            firestore.collection("orderShopee").doc(id).get().then(function (doc) {
                if(doc.exists){
                    n.close()
                    getDetail(doc.data())
                }else{
                    n.close()
                    new Noty({
                        layout: 'bottomRight',
                        theme: "relax",
                        type: 'error',
                        text: 'ĐƠN KHÔNG TỒN TẠI'
                    }).show();
                }                
            })
        }
    })

    function getDetail(data) {
        console.log(data);
        // const data = dataOrders[index]
        // console.log(data.own_status);
        $scope.transaction = data.own_transaction ? data.own_transaction : [];
        $scope.trackingNo = data.shipping_traceno;
        $scope.nickName = data.user.name;
        data['order-items'].forEach((item, index) => {
            // console.log(item.snapshotid + " = " + item.modelid);
            let product = data['products'].find(o => o.id === item.snapshotid);
            // console.log(product);
            // let productImage = data['products'].find(o => o.id === item.images[0]);
            let model = data['item-models'].find(o => o.id === item.modelid)
            var productsObj = new Object();
            productsObj = {
                name: product.name,
                model: model.name,
                amount: item.amount,
                imageUrl: "https://cf.shopee.vn/file/" + product.images[0] + "_tn",
                productUrl:  "https://shopee.vn/!-i." + product.shopid + "." +product.itemid
            }
            products.push(productsObj)
        });
        // console.log(products);
        $scope.products = products;
        $scope.showStatus = data.own_status.status
        var selectedExpTags = [data.own_status.status];
        var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).english)
        var statusLonhon6 = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
        $scope.statusLonhon6 = statusLonhon6[0]
        $scope.statusRadio = names[0]
        $scope.exportId = data.exportId
        $scope.showEx = false
        if($scope.exportId){           
            $scope.showEx = true                        
        }
        $scope.date = moment(data.create_at.seconds * 1000).format("DD-MM-YYYY");
        $scope.carrier = data.actual_carrier
        $scope.name = data.buyer_address_name;
        $scope.address = data.shipping_address;
        $scope.phone = data.buyer_address_phone;

        $scope.packer = data.packer? data.packer.name:"Chưa có người đóng gói"        

        $scope.shop = (helper.myShop.find(x=> x.id == data.shopid)).name

        console.log(helper.myShop);
        
        $scope.orderId = data.ordersn;
        $scope.urlId = id;
        $scope.logistics = data.logistic['logistics-logs'][0].description
        $scope.pay = ((data.buyer_paid_amount) * 100 / 100).toLocaleString();
        $scope.note = data.note;
        $scope.showNote = false;
        if ($scope.note) {
            $scope.showNote = true
        } else {
            $scope.showNote = false
        }
        var qrcode = new QRCode("qrcode", {
            width: 100,
            height: 100,
            correctLevel: QRCode.CorrectLevel.H
        });

        function makeCode() {
            qrcode.makeCode(id);
        }
        makeCode();
        $scope.$apply()
    }


    function httpGet(theUrl, headers) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        for (var i = 0; i < headers.length; i++) {
          xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
        }
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText);
      }


});