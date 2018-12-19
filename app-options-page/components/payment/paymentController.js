app.controller("payment-controller", paymentController)
  .filter('mapGender', mapGender)

function paymentController($scope, moment, uiGridConstants) {
  // $scope.refresh = false;
  var now = moment((new Date()).getTime()).format('hh:mm_DD/MM/YYYY');
  $scope.gridOptions = {
    enableRowSelection: true,
    enableSelectAll: true,
    paginationPageSizes: [15, 30, 45],
    paginationPageSize: 15,
    enableSorting: true,
    showGridFooter: false,
    enableFiltering: true,
    enableGridMenu: true,
    exporterCsvFilename: 'ExportFromPaymentCheck_' + now + '.csv',
    exporterMenuAllData: false,
    exporterMenuVisibleData: false,
    exporterMenuExcel: false,
    exporterMenuPdf: false,
    columnDefs: [{
      name: "Trạng thái riêng",
      field: "statuss",
      // cellTemplate:'<div class="ui-grid-cell-contents" > {{row.entity.ownStatus}}</div>',
      filter: {
        type: uiGridConstants.filter.SELECT,
        selectOptions: []
      },
      cellFilter: 'mapGender'
    }]
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


}
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

            if(data.length < 500 ){
              $scope.opts.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi
              }
  
              // $scope.opts.columnDefs = [];
              headerNames.forEach(function (h) {
                $scope.opts.columnDefs.push({
                  field: h
                });
              });
              $scope.opts.columnDefs[5].visible = false
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
                name: "Hoàn tiền",
                field: "refund"
              })
  
              var sendOrderno = []
              var totalShopeeMoney = []
              var totalOwnMoney = []
              var arrayId = []
              var notExist = []
  
              data.forEach(function (value, i) {
                var orderKey = Object.keys(value)[3];
                var ordernoStr = value[orderKey];
                var index = ordernoStr.indexOf('#');
                var orderno = ordernoStr.substr(index + 1);
                // console.log(traceno);
                sendOrderno.push(orderno)
              })
              var arrStt = []
              chrome.runtime.sendMessage({
                mission: "payment",
                arrayOrderno: sendOrderno
              }, function (response) {
  
                (response.moneyEx).forEach(function (val, i) {
                  data[i].moneyEx = val.money;
                  data[i].refund = 0
                  var shopeeMoney = data[i][Object.keys(data[i])[2]];
                  totalShopeeMoney.push(shopeeMoney);
                  if (val.money == "chua co trong Firestore") {
                    notExist.push(val.orderId)
                    data[i].offset = "null"
                  } else {
                    let obj = new Object()
                    
                    totalOwnMoney.push(val.money)
                    data[i].vc = val.vc
                    if (val.status == "PAID") {
                      data[i].offset = shopeeMoney;
                    } else {
                      $("button.update").attr("disabled", false);
                      if ((parseInt(shopeeMoney) - val.money) < 0) {
                        var promise2 = new Promise(function (resolve, reject) {
                          resolve(httpGet("https://banhang.shopee.vn/api/v2/orders/" + val.id, []))
                        })
                        promise2.then(function (data2) {
                          // console.log(val.id, data);
                          var refund = 0
                          data2["order-items"].forEach(function (item) {
                            if (item.status == 4) {
                              refund = refund + ((item.item_price) * 100 / 100)
  
                              // console.log(data[i].moneyEx);                         
                            }
                          })
                          data[i].moneyEx = val.money - refund
                          data[i].offset = parseInt(shopeeMoney) - parseInt(data[i].moneyEx)
                          data[i].refund = refund
                          console.log(val.id, data[i].moneyEx, refund)
                        })
                      } else {
                        data[i].offset = parseInt(shopeeMoney) - parseInt(data[i].moneyEx)
                      }
                    }
  
                    data[i].orderId = val.id;
                    data[i].traceno = val.traceno
  
                    var selectedExpTags = [val.status];
                    var names = selectedExpTags.map(x => arrayFilter.find(y => y.english === x).id)
                    data[i].statuss = names[0]
                    if (jQuery.inArray(names[0], arrStt) == -1) {
                      arrStt.push(names[0])
                    }
                    obj = {
                      id: val.id,
                      shopeeMoney: shopeeMoney,
                      exMoney: data[i].moneyEx.toString(),
                      shopeePayPre: val.shopeePayPre,
                      content: data[i][Object.keys(data[i])[1]] + ", " + data[i][Object.keys(data[i])[3]],
                      own_transaction : val.own_transaction
                    }
                    arrayId.push(obj)
                  }
                  // console.log(data[i].offset);
                  data[i].shippingFee = val.shipping_fee
  
                })
  
                console.log(notExist);
                var sumShopee = 0;
                var sumOwn = 0;
                $.each(totalShopeeMoney, function () {
                  sumShopee += parseInt(this)
                });
                $.each(totalOwnMoney, function () {
                  sumOwn += parseInt(this)
                });
  
                // alert(sumShopee + "-"+ sumOwn)
  
                if (notExist.length == 0) {
                  $('p#pNull').remove()
                } else {
                  $('#null').text(notExist.length)
                }
                $('#shpm').text(sumShopee.toLocaleString())
                $('#ownm').text(sumOwn.toLocaleString())
                $("#offset").text((sumShopee - sumOwn).toLocaleString())
                var myData = data
                // $scope.disableButtonUpdate = disable
                $scope.opts.data = myData;
                var arrStatus = []
                arrStt.forEach(function (val) {
                  let selectedExpTags = [val];
                  let names = selectedExpTags.map(x => arrayFilter.find(y => y.id === x).vietnamese)
                  let obj = {
                    value: val,
                    label: names[0]
                  }
                  arrStatus.push(obj)
                })
                $scope.opts.columnDefs[0].filter.selectOptions = arrStatus
                console.log(arrStatus);
                // statusDef.filter.selectOptions = arrStatus
                $scope.notExist = notExist
                $scope.$apply()
  
                function httpGet(theUrl, headers) {
                  var xmlHttp = new XMLHttpRequest();
                  xmlHttp.open("GET", theUrl, false); // false for synchronous request
                  for (var i = 0; i < headers.length; i++) {
                    xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
                  }
                  xmlHttp.send(null);
                  return JSON.parse(xmlHttp.responseText);
                }
                $('span.update').click(function () {
                  var promise = new Promise(function (resolve, reject) {
                    var n = new Noty({
                      layout: 'bottomRight',
                      theme: "relax",
                      type: 'warning',
                      text: 'ĐANG THEO DÕI ' + notExist.length + ' ĐƠN...'
                    }).on('afterShow', function () {
                      var arrId = []
                      notExist.forEach(function (val) {
                        console.log("hi", val);
                        var headers = []
                        var xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("GET", "https://banhang.shopee.vn/api/v2/orders/hint/?keyword=" + val, false); // false for synchronous request
                        for (var i = 0; i < headers.length; i++) {
                          xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
                        }
                        xmlHttp.send(null);
                        let hint = JSON.parse(xmlHttp.responseText)
                        arrId.push(hint['order-hint'].orders[0])
                      })
                      resolve(arrId)
                    }).show();
                  })
                  promise.then(function (dataOrderId) {
                    // console.log(dataOrderId);
                    dataOrderId.forEach(function (valid, i) {
                      var val;
                      var user = new Object();
                      console.log("hello", valid);
                      var promise1 = new Promise(function (resolve, reject) {
                        resolve(httpGet("https://banhang.shopee.vn/api/v2/orders/" + valid, []))
                      })
                      promise1.then(function (data) {
                        val = data
                      }).then(function () {
                        user = {
                          id: val.users[0].id,
                          name: val.users[0].username,
                          phone: val.users[0].phone,
                          email: val.users[0].email,
                          gender: val.users[0].gender,
                          create_at: val.users[0].ctime,
                          birth: val.users[0].birth_timestamp
                        }
                        delete val['bundle-deals'];
                        delete val['users'];
                        val.own_status = {
                          status: 1,
                          create_at: new Date()
                        }
                        val.user = user
                        val.create_at = new Date();
                        val.note = "";
                        val.cancel_status = false;
                        val.logistic = httpGet("https://banhang.shopee.vn/api/v2/tracking/logisticsHistories/" + valid, []);
                        // console.log(val);
                        for (var key in val['order']) {
                          if (val['order'].hasOwnProperty(key)) {
                            val[key] = val['order'][key];
                          }
                        }
  
                      }).then(function () {
                        delete val['order'];
                        firestore.collection("orderShopee").doc(valid.toString()).set(
                          val
                        ).then(function () {
                          firestore.collection("userShopee").doc(user.id.toString()).set(
                            user
                          ).then(() => {
                            console.log("save successful");
                            $('#null').text(notExist.length - (i + 1))
                          })
                        })
                      })
                    })
                  })
  
  
                })
  
                $('.updatePay').on('click', function () {
  
                  if ($('#bank').text() == "Chọn Ngân Hàng") {
                    alert("Vui lòng chọn Ngân Hàng")
                  } else {
                    $('#loading').text('loading....')
  
                    chrome.runtime.sendMessage({
                      mission: "updatePayment",
                      id: arrayId,
                      date: $('#datepicker').val(),
                      bank: $('#bank').text(),
                      sumShopeePaid: sumShopee,
                      sumBuyerPaid: sumOwn
                    }, function (response) {
                      var arrEx = []
                      var dataExToSend = []
                      chrome.storage.local.get('data', function (obj) {
                        chrome.storage.local.get('export', function (obj1) {
                          arrayId.forEach(function (orderId) {
                            firestore.collection("orderShopee").doc(orderId.id).get()
                              .then(function (doc) {
                                var exportId = doc.data().exportId ? doc.data().exportId : ""
                                if (exportId !== "" && jQuery.inArray(exportId, arrEx) == -1) {
                                  arrEx.push(exportId)
                                  var selectedExpTags1 = [exportId];
                                  var names1 = selectedExpTags1.map(x => obj1.export.find(y => y.id == x).orders)
                                  dataExToSend.push({
                                    exId: exportId,
                                    orders: names1[0]
                                  })
                                }
                              })
                          })
                          console.log(dataExToSend);
                          chrome.runtime.sendMessage({
                            mission: "updateEx",
                            data: dataExToSend
                          }, function (response) {
                            // console.log(response.exIdRes);
                            $('#loading').text("")
                            new Noty({
                              layout: 'bottomRight',
                              timeout: 2500,
                              theme: "relax",
                              type: 'success',
                              text: 'Đã cập nhật trạng thái các đơn về "đã thanh toán" và tạo Phiếu thu'
                            }).show();
  
                          })
                        })
                      })
                    })
                  }
                })
                // $scope.gridApi.core.refresh()
              })
              // $scope.opts.data = data;
              $elm.val(null);
            }else{
              alert("Vui lòng giảm lượng rows xuống dưới 500")
              location.reload()
            }

            
          });
        };

        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]);

function mapGender() {
  var genderHash = {
    1: "Đơn mới",
    2: "Đã nhặt đủ hàng để chờ đóng gói",
    3: "Chưa nhặt đủ hàng",
    4: "Đã đóng gói chờ gửi đi",
    5: "Đã gửi đi",
    6: "Khách đã nhận hàng",
    7: "Đang hoàn hàng chưa về đến kho",
    8: "Đã hoàn về kho",
    9: "Đã thanh toán",
    "HT": "Đã hoàn tiền",
    "0": "Đã hủy" 
  };

  return function (input) {
    if (!input) {
      return '';
    } else {
      return genderHash[input];
    }
  }
};
