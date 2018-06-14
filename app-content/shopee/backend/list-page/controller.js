app.controller("list-shopee-saleCtrl", ['$scope', 'moment',
    function ($scope, moment) {

        function getList() {

            $scope.notExist = []

            var timer = setInterval(function () {
                $('div.order-items').not('.loading').find(".order-items__item").each(function (index, value) {
                    var _this = $(this);
                    var id = $(this).attr("href");
                    if (id) {
                        id = id.match(/(\d+)/g).toString();
                        clearInterval(timer);
                        chrome.runtime.sendMessage({
                            mission: "updateList",
                            id: id
                        }, function (response) {
                            // console.log(_this);
                            var optionsUrl = chrome.extension.getURL("options.html#/orders/" + response.id);
                            // console.log(response);
                            if (response.check == "exist") {
                                // console.log("EXIST");
                                _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b> ' + response.user_paid + " VNĐ - " + response.shipping_fee + " VNĐ - " + response.status + ' <a target="_blank" href="' + optionsUrl + '">' + response.id + '</a></b></span>')
                            }
                            if (response.check == "not exist") {
                                $scope.notExist.push(response.id)
                                $scope.$apply();
                                // console.log("NOT");
                                _this.find(".ct-buyer > div").append(' <span id="test">&nbsp<b>NOT EXIST</b></span>')
                            }
                        })
                        $scope.$apply();
                    }

                })
            }, 1000)
        }
        getList();

        $('button#open').click(function () {
            $.each($scope.notExist, function (index, value) {
                // console.log(value);
                chrome.runtime.sendMessage({
                    mission: "checkExist",
                    url: value
                }, function (response) {

                    if (response.check == "hello") {
                        chrome.runtime.sendMessage({
                            mission: "detailOrder",
                            url: value
                        })
                    }
                    if (response.check == "update") {
                        chrome.runtime.sendMessage({
                            mission: "update",
                            url: value
                        })
                    }
                    setTimeout(() => {
                        location.reload()
                    }, 1000)

                })
            });
        })


        $('a.tabs__tab').on('click', function () {
            //$(this).off('click');
            getList()
        });

        var appear = setInterval(function () {
            var pan = $('.shopee-pagination--footer ul li').text()
            if (pan) {
                clearInterval(appear);
                $('.shopee-pagination--footer ul li').click(function () {
                    getList()
                })
            }
        })

    }
])