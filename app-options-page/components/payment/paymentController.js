app.controller("payment-controller", function ($scope, uiGridConstants) {
  // $scope.refresh = false;

  $scope.gridOptions = {
    paginationPageSizes: [15, 30, 45],
    paginationPageSize: 15,
    enableSorting: true,
    showGridFooter: false,
    enableFiltering: true,
    // showGridHeader: false
  };
  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function () {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();


  $scope.open2 = function () {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function (year, month, day) {
    $scope.dt = new Date(year, month, day);
    console.log($scope.dt);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];


  $scope.popup2 = {
    opened: false
  };


  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  $('select#selectStatus').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    $('label#bank').text(valueSelected)
  });


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
                vietnamese: "đã hủy"
              },
            ]
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
              name: "Mã Id",
              field: "orderId",
              cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="https://banhang.shopee.vn/portal/sale/{{row.entity.orderId}}">{{row.entity.orderId}}</a></div>'
            }, {
              name: "Mã vận đơn",
              field: "traceno",
              cellTemplate: '<div class="ui-grid-cell-contents" ><a target="_blank" href="options.html#/orders/{{row.entity.orderId}}">{{grid.getCellValue(row, col)}}</a></div>'
            }, {
              name: "Dự kiến thu",
              field: "moneyEx"
            }, {
              name: "Phí ship",
              field: "shippingFee"
            }, {
              name: "Trợ giá",
              field: "vc"
            }, {
              name: "Đối soát",
              field: "offset"
            }, {
              name: "Trạng thái riêng",
              field: "statuss"
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
                data[i].moneyEx = val.money;
                var shopeeMoney = data[i][Object.keys(data[i])[2]];
                totalShopeeMoney.push(shopeeMoney);
                if (val.money == "chua co trong Firestore") {
                  data[i].offset = "null"
                } else {
                  let obj = new Object()
                  obj = {
                    id: val.id,
                    shopeeMoney: shopeeMoney
                  }
                  arrayId.push(obj)
                  totalOwnMoney.push(val.money)
                  data[i].vc = val.vc
                  if (val.status == "PAID") {
                    data[i].offset = shopeeMoney;
                  } else {
                    $("button.update").attr("disabled", false);
                    data[i].offset = parseInt(shopeeMoney) - val.money;
                  }
                  data[i].orderId = val.id;
                  data[i].traceno = val.traceno
                  var selectedExpTags = [val.status];
                  var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).vietnamese)
                  data[i].statuss = names[0]
                }
                // console.log(data[i].offset);
                data[i].shippingFee = val.shipping_fee

              })
              var sumShopee = 0;
              var sumOwn = 0;
              $.each(totalShopeeMoney, function () {
                sumShopee += parseInt(this)
              });
              $.each(totalOwnMoney, function () {
                sumOwn += parseInt(this)
              });

              // alert(sumShopee + "-"+ sumOwn)
              $('#shpm').text(sumShopee.toLocaleString())
              $('#ownm').text(sumOwn.toLocaleString())
              $("#offset").text((sumShopee - sumOwn).toLocaleString())
              var myData = data
              // $scope.disableButtonUpdate = disable
              $scope.opts.data = myData;
              $scope.$apply()
              $('button.update').click(function () {
                $('#loading').text('loading....')
                if ($('#bank').text() == "Chọn Ngân Hàng") {
                  alert("Vui lòng chọn Ngân Hàng")
                } else {
                  chrome.runtime.sendMessage({
                    mission: "updatePayment",
                    id: arrayId,
                    date: $('#datepicker').val(),
                    bank: $('#bank').text()
                  }, function (response) {
                    $('#loading').text("")
                    new Noty({
                      layout: 'bottomRight',
                      timeout: 2500,
                      theme: "relax",
                      type: 'success',
                      text: 'Đã cập nhật trạng thái các đơn về "đã thanh toán" và tạo Phiếu thu'
                    }).show();
                  })
                }

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