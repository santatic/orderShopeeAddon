app.controller("payment-controller", function ($scope, uiGridConstants) {
  // $scope.refresh = false;
  $scope.gridOptions = {
    paginationPageSizes: [15, 30, 45],
    paginationPageSize: 15,
    enableSorting: true,
    showGridFooter: false,
    // showGridHeader: false
  };


})
app.directive("fileread", [function () {
  return {
    scope: {
      opts: '='
    },
    link: function ($scope, $elm, $attrs) {
      $elm.on('change', function (changeEvent) {
        var reader = new FileReader();

        reader.onload = function (evt) {
          $scope.$apply(function () {
            var data = evt.target.result;

            var workbook = XLSX.read(data, {
              type: 'binary'
            });

            var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
              header: 1
            })[0];

            var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            $scope.opts.onRegisterApi = function (gridApi) {
              $scope.gridApi = gridApi
            }

            $scope.opts.columnDefs = [];
            headerNames.forEach(function (h) {
              $scope.opts.columnDefs.push({
                field: h
              });
            }); 
            $scope.opts.columnDefs.push({
              name: "Dự kiến thu",
              field: "moneyEx"
            },
            {
              name: "Phí ship",
              field: "shippingFee"
            },{
              name: "Trợ giá",
              field: "vc"
            },{
              name: "Đối soát",
              field: "offset"
            })      

            var sendOrderno = []
            var totalShopeeMoney = []
            var totalOwnMoney = []
            var arrayId = []

            data.forEach(function (value, i) {
              var orderKey = Object.keys(value)[3];
              var ordernoStr = value[orderKey];
              var index = ordernoStr.indexOf('#');
              var orderno = ordernoStr.substr(index + 1);
              // console.log(traceno);
              sendOrderno.push(orderno)
            })
            chrome.runtime.sendMessage({
              mission: "payment",
              arrayOrderno: sendOrderno
            }, function (response) {
              
              (response.moneyEx).forEach(function (val, i) {
                console.log(val);
                data[i].moneyEx = val.money;
                if(val.money == "chua co trong Firestore"){
                  data[i].offset = "null"
                }else{
                  arrayId.push(val.id)
                  var shopeeMoney = data[i][Object.keys(data[i])[2]];
                  totalShopeeMoney.push(shopeeMoney);
                  totalOwnMoney.push(val.money)
                  data[i].vc = val.vc
                  data[i].offset = parseInt(shopeeMoney) - val.money ;                  
                }
                // console.log(data[i].offset);
                data[i].shippingFee = val.shipping_fee
              })

              var sumShopee = 0;
              var sumOwn = 0;
              $.each(totalShopeeMoney,function(){sumShopee += parseInt(this)});
              $.each(totalOwnMoney,function(){sumOwn += parseInt(this)});

              // alert(sumShopee + "-"+ sumOwn)
              $('#shpm').text(sumShopee.toLocaleString())
              $('#ownm').text(sumOwn.toLocaleString())
              $("#offset").text((sumShopee - sumOwn).toLocaleString())
              var myData = data
              $scope.opts.data = myData;
              $scope.$apply()   
              $('button.update').click(function(){
                chrome.runtime.sendMessage({
                  mission: "updatePayment",
                  id: arrayId
                }, function (response) {
                  console.log("done");
                  new Noty({layout: 'bottomRight', timeout: 2500, theme: "relax", type: 'success', text: 'Đã cập nhật trạng thái các đơn về "đã thanh toán"'}).show();
                })         
              })              
              // $scope.gridApi.core.refresh()
            })            
            // $scope.opts.data = data;
            $elm.val(null);
          });
        };

        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]);