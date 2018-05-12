app.controller("item-shopee-saleCtrl", ['$scope', 'moment',
    function ($scope, moment) {
        
        url = $(location).attr('href').match(/\d+/);
        url = url.toString();
        console.log(url);     
        $scope.url = url;
        $('#print').click(() => {
            var win = window.open('https://banhang.shopee.vn/api/v1/orders/'+ url +'/waybill', '_blank');
            win.focus();
        })

        chrome.runtime.sendMessage({
            mission: "checkExist",
            url: url
        }, function (response) {

            if (response.check == "hello") {
                setTimeout(() => {
                    // $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ÐON NÀY</a>');
                    $('.order-notes .shopee-button--primary').on("click", function () {
                        chrome.runtime.sendMessage({
                            mission: "updateNote",
                            url: url,
                            note: $('.order-notes .ember-content-editable').text()
                        }, function (response) {})
                    })
                }, 3000)
                chrome.runtime.sendMessage({
                    mission: "detailOrder",
                    url: url
                })
            }
            if (response.check == "update") {
                
                setTimeout(() => {
                    // $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ÐON NÀY</a>');
                    $('.order-notes .shopee-button--primary').on("click", function () {
                        chrome.runtime.sendMessage({
                            mission: "updateNote",
                            url: url,
                            note: $('.order-notes .ember-content-editable').text()
                        }, function (response) {})
                    })
                }, 3000)
                chrome.runtime.sendMessage({
                    mission: "update",
                    url: url
                })
            }
            // setTimeout(() => {
            //     $('.main-header .inline-list').append('<a style="color: red" class="shopee-button cancel">H?Y</a>');
            //     $('a.cancel').on("click", () => {
            //         chrome.runtime.sendMessage({
            //             mission: "cancel",
            //             url: url
            //         })
            //     })
            // }, 3000)

        })
    }
]);