app.controller("scan-controller", function ($scope, $routeParams) {



  $scope.typeUrl = "addon"


  let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
  });
  scanner.addListener('scan', function (content) {
    console.log(content);
    document.getElementById('play-beep').play()
    //   angular.element("#reader").html5_qrcode_stop(); // stop webcam 
    // var saleUrl = url()
    console.log($scope.typeUrl);
     

    var win = window.open($scope.typeUrl == "addon"? chrome.extension.getURL("options.html#/orders/")   + content, '_blank');
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