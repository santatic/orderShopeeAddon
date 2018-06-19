app.controller("logisticCtrl", ['$scope',
    function ($scope) {
        function httpGet(theUrl, headers) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            for (var i = 0; i < headers.length; i++) {
                xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
            }
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        }

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
                vietnamese: "hủy"
            },
        ]
        console.log();
        chrome.runtime.sendMessage({
            mission: "getHomepage"
        }, function (response) {
            console.log(response.data);
            var data = response.data;
            data.forEach(function (val) {

            })
            // var selectedExpTags = [parseInt(value.ownStatus)];
            // var names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
            // value.own_Status = names[0];
            $scope.data = data
            $scope.$apply()
        })
        $scope.update = function (status) {
            new Noty({layout: 'bottomRight', theme: "relax", type: 'success', text: 'Đang cập nhật, khi nào xong sẽ tự load lại trang!'}).show();
            var idsDaGiao = []
            var updateLogShopee = []
            var selectedExpTags = [status];
            var names = selectedExpTags.map(x => $scope.data.find(y => y.status === x).logistics)
            console.log(names[0]);
            $.each(names[0], function (i, val) {
                // console.log(val.logistics);
                var sub = "Đã giao hàng"
                if (val.logistics.indexOf(sub) !== -1) {
                    idsDaGiao.push(val.id)
                } else {
                    var data = httpGet("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + val.id, [])
                    // console.log(data);
                    var obj = new Object()
                    obj = {
                        id: val.id,
                        log: data
                    }
                    updateLogShopee.push(obj)
                }
            })
            
            chrome.runtime.sendMessage({
                mission: "updateLogFromContent",
                idsDaGiao: idsDaGiao,
                updateLogShopee: updateLogShopee
            }, function (response) {
                location.reload()
                console.log("done");
            })
        }
    }

])