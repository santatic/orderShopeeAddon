app.controller("scan-controller", function ($scope, $routeParams) {


  $scope.typeUrl = "addon"


  let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
  });
  scanner.addListener('scan', function (content) {
    console.log(content);
    document.getElementById('play-beep').play()  
    
    var url 
    switch ($scope.typeUrl) {
      case "addon":
        url = chrome.extension.getURL("options.html#/orders/") + content
        break;
      case "shopee":
        url = "https://banhang.shopee.vn/portal/sale/" + content
        break
      case "exportCode":
        url = chrome.extension.getURL("options.html#/export/") + content
      break
    }

    var win = window.open(url,"_self");
    win.focus()
  });
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      new Noty({layout: 'bottomRight', theme: "relax", type: 'error', text: 'Không tìm thấy Camera!'}).show();
    }
  }).catch(function (e) {
    console.error(e);
  });
  // angular.element(document).ready(function() {
  //     angular.element('#reader').html5_qrcode(function(data) { // start webcam
  //           console.log(data); // print QR code content

  //         },
  //         function(error) {
  //           console.log(error);
  //         },
  //         function(videoError) {
  //           console.log(videoError);
  //         }
  //     );
  // });
})