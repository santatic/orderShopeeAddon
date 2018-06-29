app.controller("print-controller", function ($scope, $routeParams, moment) {

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
        window.print()
        $("#line").remove()
        $("#trackno").css({
            "font-size": "15px"
        })
    }

    $scope.print = function(){
        window.print()
    }

    var saleUrl = chrome.extension.getURL("options.html#/");

    docRef = firestore.collection("orderShopee").doc(id);

    $('button#saveNote').click(function () {
        var note = $('#noteEdit').val();
        if (!note) {

        } else {
            docRef.update({
                "note": note
            }).then(function () {
                console.log("done");
                var options = {
                    type: "basic",
                    title: "Đã cập nhật note",
                    message: new Date().toString(),
                    iconUrl: "../../../images/notification.png"
                }
                chrome.notifications.create("notify", options, callback);

                function callback() {}
            })
        }
    })
    $('button#cancelNote').click(function () {
        $('#noteEdit').val("")
    })

    $('select#selectStatus').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        console.log(valueSelected);
        if (!valueSelected) {

        } else {
            var selectedExpTags = [valueSelected];
            var names = selectedExpTags.map(x => arrayFilter.find(y => y.vietnamese === x).english)
            console.log(names);
            docRef.update({
                "own_status": {
                    status: names[0],
                    create_at: new Date()}
            }).then(function () {
                console.log("done");
                $('label#status').text(valueSelected)
            })
        }

    });


    docRef.get().then(
        function (doc) {
            if (doc.exists) {
                const data = doc.data();
                console.log(data.own_status);
                $scope.trackingNo = data.shipping_traceno;
                $scope.nickName = data.user.name;
                data['order-items'].forEach((item, index) => {
                    console.log(item.snapshotid + " = " + item.modelid);
                    let product = data['products'].find(o => o.id === item.snapshotid);
                    console.log(product);
                    // let productImage = data['products'].find(o => o.id === item.images[0]);
                    let model = data['item-models'].find(o => o.id === item.modelid)
                    var productsObj = new Object();
                    productsObj = {
                        name: product.name,
                        model: model.name,
                        amount: item.amount,
                        imageUrl: "https://cf.shopee.vn/file/" + product.images[0] + "_tn"

                    }
                    products.push(productsObj)
                });
                console.log(products);
                $scope.products = products;
                var selectedExpTags = [data.own_status.status];
                var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).vietnamese)
                $scope.status = names[0];
                $scope.date = moment(data.create_at.seconds * 1000).format("DD-MM-YYYY");
                $scope.carrier = data.actual_carrier
                $scope.name = data.buyer_address_name;
                $scope.address = data.shipping_address;
                $scope.phone = data.buyer_address_phone;
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
                    correctLevel: QRCode.CorrectLevel.H
                });

                function makeCode() {
                    qrcode.makeCode(id);
                }
                makeCode();

            } else {
                alert("Đơn này chưa có trong database");
                window.close()
            }
            $scope.$apply()
        }).catch(function(error) {
            new Noty({
                layout: 'bottomRight',
                timeout: 5000,
                theme: "relax",
                type: 'error',
                text: error
              }).show();
        });

});