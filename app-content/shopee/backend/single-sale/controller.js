// app.config(function($compileProvider){
//     $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
//   });
  //co phai app nay ko. tét di
  //e nghĩ phải là trong options page, vì cái url là của ext@@.
  //ủa @@

app.controller("item-shopee-saleCtrl", ['$scope', 'moment',
    function ($scope,  moment) {
    
        $('#linkOpenOptionsPage').click(function(){console.log(chrome.runtime.getURL('options.html')); window.open(chrome.runtime.getURL('options.html'));        return false; });
         
        url = $(location).attr('href').match(/\d+/);
        url = url.toString();

        console.log(url);     
        $scope.url = url;

        var optionsUrl = chrome.extension.getURL("options.html#/orders/"+url);      
      
        $scope.printLink = optionsUrl;
        chrome.runtime.sendMessage({
            mission: "checkExist",
            url: url
        }, function (response) {
            setTimeout(() => {
                // $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ÐON NÀY</a>');
                $('.order-notes .shopee-button--primary').on("click", function () {
                    chrome.runtime.sendMessage({
                        mission: "updateNote",
                        url: url,
                        note: $('.order-notes .ember-content-editable').text()
                    }, function (response) {})
                })
            }, 2000)

            if (response.check == "hello") {               
                chrome.runtime.sendMessage({
                    mission: "detailOrder",
                    url: url
                })
            }
            if (response.check == "update") { 
                new Noty({layout: 'bottomRight', timeout: 2500, theme: "relax", type: 'success', text: 'ĐƠN ĐÃ ĐƯỢC THEO DÕI'}).show();
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