
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

    var win = window.open(url, "_blank");
    win.focus()
  });
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      new Noty({
        layout: 'bottomRight',
        theme: "relax",
        type: 'error',
        text: 'Không tìm thấy Camera!'
      }).show();
    }
  }).catch(function (e) {
    console.error(e);
  });
  $scope.searchInput = ""
  $scope.disableBut = true
  
  $('input#search').keyup(function(){
    $scope.searchInput.length >=6 ? $scope.disableBut = false : $scope.disableBut = true;
  })
  $scope.search = function () {
    console.log($scope.searchInput);
    firestore.collection("orderShopee").where("shipping_traceno", "==", $scope.searchInput.toString())
      .get().then(function (querySnapshot) {
        console.log(querySnapshot);
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(function (doc) {
            var win = window.open(chrome.extension.getURL("options.html#/orders/") + doc.id, "_blank");
            win.focus()
          })
        } else {
          alert("404...ĐƠN NÀY CHƯA CÓ TRONG HỆ THỐNG")
        }
      }).then(function () {
      }).catch(function (error) {
        alert("LỖI: " + error)
      })
  }
})