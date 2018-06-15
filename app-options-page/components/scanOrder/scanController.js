app.controller("scan-controller", function ($scope, $routeParams) {
    angular.element(document).ready(function() {
        angular.element('#reader').html5_qrcode(function(data) { // start webcam
              console.log(data); // print QR code content
            //   angular.element("#reader").html5_qrcode_stop(); // stop webcam 
              var saleUrl = chrome.extension.getURL("options.html#/orders/");
              var win = window.open(saleUrl + data, '_blank');
              win.focus()
            },
            function(error) {
              console.log(error);
            },
            function(videoError) {
              console.log(videoError);
            }
        );
    });
})