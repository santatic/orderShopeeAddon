window.addEventListener("load", myMain, false);

function myMain(evt) {
    var jsInitChecktimer = setInterval(checkForJS_Finish, 100);

    function script(u, i) {
        var d = document;
        if (!d.getElementById(i)) {
            var s = d.createElement('script');
            s.src = u;
            s.id = i;
            d.head.appendChild(s);
        }
    }
    //script('//code.jquery.com/jquery-3.2.1.min.js', 'jquery')
    //-------------------------  

    function checkForJS_Finish() {
        if (document.readyState === 'complete' //document.querySelector (".footer__policy-item")  && $('a').filter(function() {return this.href.match(/\/.*i\.\d+\.\d+/);}).length > 5
        ) {
            clearInterval(jsInitChecktimer);

            //set attribute to use angularjs
            document.getElementsByTagName("body")[0].setAttribute("ng-app", "myapp");

            switch (true) {
                case $(location).attr('href').indexOf('orders/waybill') !== -1:

                    $('table.instruction').remove()

                    $('button').css({
                        'background': '#00d45f',
                        'color': '#fff',
                        'font-weight': '900',
                        'border': 'none',
                        'margin-bottom': '3px',
                        'cursor': 'pointer'
                    })

                    $('div.A4 div.page:eq(0)').addClass('no-print').css({
                        'display': 'none'
                    })

                    $('div.A4.landscape').append(`
                <div class="page no-print">
                    <div class="page-inner" style="border: none;font-family: arial;" >
                        <div class="order section" id="left" style="height: auto">
                            <div class="full emphasis" style="border: #000 solid 1px;padding: 0 0" >
                            <table>
                            </table>                            
                            </div>                           
                            
                        </div>
                        <div class="order section" id="products" style="height: auto">
                            <div class="full emphasis" style="border: #000 solid 1px; padding: 0 0" >
                                <table>
                                    
                                </table>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="vline"></div>
                <div class="page no-print">
                    <div class="page-inner" style="border: none;font-family: arial" >
                        <div class="order section" id="head" style="height: auto">
                            <div class="full emphasis" style="border: #000 solid 1px; padding: 0 0" >
                                <table>
                                </table>

                            </div>                            
                        </div>
                        <div class="order section" id="products" style="height: auto">
                            <div class="full emphasis" style="border: #000 solid 1px; padding: 0 0" >
                                <table>
                                    
                                </table>
                            </div>
                        </div>
                        <div class="order section" id="note">
                            <div class="full emphasis" style="border: #000 solid 1px">
                                
                            </div>
                        </div>
                    </div>
                </div>
                `)
                    $('#qrcode').css({
                        'width': '160px',
                        'height': '160px',
                        'margin-top': '15px'
                    })
                    $('.page').css({
                        'font-size': '14px'
                    })

                    //------------------------------------

                    $barcode = $('div.barcode')

                    var orderId = $barcode.find('p.order-sn').text();
                    orderId = orderId.replace("Mã đơn hàng: ", "")

                    var trackingId = $barcode.find('p.tracking-no').text();
                    trackingId = trackingId.replace("Mã vận đơn: ", "")
                    //-----------------------------------

                    var price = $('div.shipment p.price').text()
                    price = price.match(/\d+/).toString();
                    //-----------------------------------

                    url = $(location).attr('href');
                    url = url.toString();
                    url = url.substring(url.indexOf('[') + 1, url.indexOf(']'));
                    //-----------------------------------



                    $to = $('div.address div.wide.emphasis');

                    var name = $to.find('p:eq(1)').text();
                    var address = $to.find('p:eq(2)').text();
                    var phone = $to.find('p:eq(3)').text();
                    phone = phone.match(/\d+/).toString();
                    //------------------------------------

                    $products = $('div.order.section').find('p.item');
                    products = []

                    $half = $('#head table')
                    $half.append('<tr><td>' + trackingId + '</td><td>' + phone + '</td></tr>')
                    $half.append('<tr><td>' + orderId + '</td><td>' + url + '</td><td id="cod"></td></tr>')
                    $half.append('<tr><td>' + name + '</td><td>' + address + '</td><td id="qrcode"></td></tr>')

                    $('#left div.full').append('<tr id= "mvd" style="font-size: 35px; text-align: center" ><td>' + trackingId + '</td></tr>')

                    $('.section').css({
                        'min-height': '0'
                    })

                    var qrcode = new QRCode("qrcode");

                    function makeCode() {
                        qrcode.makeCode(url);
                    }
                    makeCode();


                    $products.each(function () {
                        var item = $(this).text();
                        var productName;
                        var classify;
                        var quantity;
                        if (item.indexOf('-') == -1) {
                            productName = item.substring(1, item.indexOf('.') - 1);
                            classify = "";
                        } else {
                            productName = item.substring(1, item.indexOf('-') - 1)
                            classify = item.substring(item.indexOf('-') + 2, item.indexOf('.'));
                        }
                        quantity = item.substring(item.indexOf('.') + 5);

                        var item = new Object();
                        item.name = productName;
                        item.classify = classify;
                        item.quantity = quantity;
                        products.push(item)

                        $('#products table').append('<tr><td>' + productName + '</td><td>' + classify + '</td><td>' + quantity + '</td></tr>')
                    })

                    $('#products table, #head table, #left table').css({
                        'border-collapse': 'collapse',
                        'width': '100%'
                    })

                    $('#products td,#left td, #head td').css({
                        'border': '1px solid #dddddd',
                        'text-align': 'left',
                        'padding': '8px'
                    })


                    //-----------------------------------



                    // $.get('https://banhang.shopee.vn/portal/sale/' + url, function (response) {
                    //     console.log(response);
                    // });

                    $('textarea').keyup(function () {
                        var keyed = $(this).val().replace(/\n/g, '<br/>');
                        $('a.anote').html(keyed);
                        if (!$.trim($("textarea").val())) {
                            $('div#note b').css({
                                'display': 'none'
                            })
                        } else {
                            $('div#note b').css({
                                'display': 'inline-block'
                            })
                        }
                    });
                    if (!$.trim($("textarea").val())) {
                        $('div#note b').css({
                            'display': 'none'
                        })
                    }
                    var note = $('a.anote').text()

                    chrome.runtime.sendMessage({
                        mission: "checkExist",
                        url: url,
                    }, function (response) {
                        $('#left div.full').append('<tr><td style="padding-left: 10px;">' + response.user + '</td></tr>')
                        $('#cod').html(response.money + ' (COD)')
                        if (response.note !== "") {
                            $('a.anote').html(response.note)
                            $('#left, #head').append('<div style="border: #000 solid 1px;padding: 0 0" ><a style="padding-left: 10px">' + response.note + '</a></div>')
                        }
                        $('div.A4 div.page:eq(1),div.A4 div.page:eq(2)').removeClass('no-print')
                    });

                    $('button').click(function () {
                        chrome.runtime.sendMessage({
                            mission: "updateNote",
                            url: url,
                            note: $('textarea').val()
                        }, function (response) {})
                    })
                    break;
                case $(location).attr('href').indexOf('portal/sale/') !== -1:

                    url = $(location).attr('href').match(/\d+/);

                    url = url.toString();
                    console.log(url);
                    chrome.runtime.sendMessage({
                        mission: "checkExist",
                        url: url
                    }, function (response) {

                        if (response.check == "hello") {
                            setTimeout(() => {
                                $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ĐƠN NÀY</a>');
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
                                $('.main-header .inline-list').append('<a href="https://banhang.shopee.vn/api/v1/orders/waybill/?orderids=[' + url + ']" style="color: #ff5722; font-weight: 700;" class="shopee-button" target="_blank">IN ĐƠN NÀY</a>');
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
                        setTimeout(() => {
                            $('.main-header .inline-list').append('<a style="color: red" class="shopee-button cancel">HỦY</a>');
                            $('a.cancel').on("click", () => {
                                chrome.runtime.sendMessage({
                                    mission: "cancel",
                                    url: url
                                })
                            })
                        }, 3000)

                    })
                    break;
                case $(location).attr('href').indexOf('portal/sale?type=shipping') !== -1:

                    setInterval(function(){
                        $(".order-items__item").each(function(){
                            console.log($(this).attr("href"));
                        })
                    }, 3000)
                    // setTimeout(()=>{

                    // },)
                    break;

                case $(location).attr('href').indexOf('detail.1688.com/offer/') !== -1:
                    zoom_in_thumbnail_32x32(); //orderShopeeAddon\js\custom-shopee.js
                    $.get(chrome.extension.getURL('app-content/template/item-1688.html'), function(data) {
                        
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    }); 
                    break;
                case /https:\/\/shopee.vn\/.*i\.\d+\.\d+/.test(window.location.href): //single page
                    $.get(chrome.extension.getURL('app-content/template/item-shopee.html'), function(data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });            
                break;
            }





            switch(true){
            	case $(location).attr('href').indexOf('shopee.vn') !== -1:
		            var sitems = {};

		            $('a')
		                .filter(function() {
		                    return this.href.match(/\/.*i\.\d+\.\d+/);
		                })
		                .each(function(index, element) {//'a[class="shopee-item-card--link"][href^="/"]'
		                    var regex = /\/.+i\.(\d+\.\d+)/g;
		                    var matchs = regex.exec($(element).attr('href'));
		                    if(matchs.length === 2){
		                        var shopid_itemid = matchs[1].split('.');
		                        sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                            //var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    }
		                }); 

		            // check type of page: single page or other page
		            switch (true){
		                case /https:\/\/shopee.vn\/.*i\.\d+\.\d+/.test(window.location.href): //single page
		                    var regex = /\/.+i\.(\d+\.\d+)/g;
		                    var matchs = regex.exec(window.location.href);
		                    if(matchs.length === 2){
		                        var shopid_itemid = matchs[1].split('.');
		                        sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                            //var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    }


		                    // var links = window.location.href.match(/i\.(\d+)\.(\d+)/g); //"https://shopee.vn/Xả-Kho-bán-buôn-Tủ-vải-2-tầng-3-ngăn-kéo-i.868d9909.52050d386" ==> [ '8689909.52050386' ]
		                    // var shopid_itemid = links !== null ? links[0].split('.') : [];
		                    // if(shopid_itemid.length > 0){
		                    //     sitems[shopid_itemid[1]] = {itemid: shopid_itemid[1], shopid: shopid_itemid[0]};
		                    // }                    
		                    
		                    break;
		                default: //other page
		                    // var win = window.open('https://shopee.vn' + $(element).attr('href'), '_blank');
		                    break;
		                
		            }


		            //highlight div by shopid(s)
		            chrome.storage.sync.get('todo', function(keys) {
		                if (keys.todo != null) {
		                    console.log(keys);
		                    for (var i = 0; i < keys.todo.length; i++) {
		                        $('a[href*=".' + keys.todo[i]['content'] + '"]').parent().css({"border": "2px solid orange"});
		                    }
		                    // _this.data = keys.todo;
		                    // for (var i=0; i<_this.data.length; i++) {
		                    //     _this.data[i]['id'] = i + 1;
		                    // }
		                    // console.log(_this.data);
		                    // callback(_this.data);
		                }
		            });                

		            console.log('gui tin nhan');
		            //send message to background.js
					chrome.runtime.sendMessage({mission: "sendShopIdAndItemId", data: sitems}, function(response) {//lấy thông tin cấu hình của trang định lấy nội dung
		                //changeScope(response);

		                var sel = 'div[ng-controller="' + 'mainCtrl' + '"]';
		                $scope =  angular.element(sel).scope();
		                // console.log($scope);
		                $scope.GLOBAL_FIRST_RESPONSE = response;
		                $scope.$apply();
		                for(var key in response) {
		                    if(response[key] !== null){
		                        $('a[href*=".' + key + '"]').before("<span>sold " + response[key]['sold'] + ' updated ' + moment(response[key]['createdTime']).fromNow() + "</span>");
		                    }
		                }
					    
		                $('a')
		                    .each(function(index, element) {//'a[class="shopee-item-card--link"][href^="/"]'
		                        $(element).attr('onclick','window.open("' + $(element).attr('href') + '");return false;');
		                        $(element).attr('href','#');

		                    }); 
					});
            		break;
            	case $(location).attr('href').indexOf('1688.com') !== -1:        		
			        var tds = document.getElementsByTagName('td');
			        
			        for(var i = 0; i < tds.length; i++) {
			            var td = tds[i];
			            if(td.className.indexOf('name') !== -1){// những td có class là name là những td chứa phân loại hàng sku 
			                td.onclick = function() {
								  var textArea = document.createElement("textarea"); 
								 
								  textArea.style.position = 'fixed';
								  textArea.style.top = 0;
								  textArea.style.left = 0;

								  // Ensure it has a small width and height. Setting to 1px / 1em
								  // doesn't work as this gives a negative w/h on some browsers.
								  textArea.style.width = '2em';
								  textArea.style.height = '2em';

								  // We don't need padding, reducing the size if it does flash render.
								  textArea.style.padding = 0;

								  // Clean up any borders.
								  textArea.style.border = 'none';
								  textArea.style.outline = 'none';
								  textArea.style.boxShadow = 'none';

								  // Avoid flash of white box if rendered for any reason.
								  textArea.style.background = 'transparent';

								  var strPrice = $(this).next().find('em.value').text(); //parents('td').first()
								  var strSupplier = $('a')
									  .filter(function() {
									  return this.href.match(/https\:\/\/.*\.1688\.com\/page\/companyinfo.htm/); //https\:\/\/.*\.1688\.com\/page\/companyinfo.htm
								  }).attr('href').replace('https://', '').replace('.1688.com/page/companyinfo.htm', '').replace('.1688.com/page/0701/tg.html','');
									// nếu không có ảnh thì lấy ảnh avatar
								  var strImage = $(this).find('img').length === 0 ? '=image("' + $('a[trace="largepic"] img').attr('src').replace('400x400.', '') + '")'
								  		: '=image("' + $(this).find('img').first().attr('src').replace('32x32.', '') + '")';
								  
								  var strClassify = $(this).find('img').length === 0 ? $.trim($(this).text()) : $(this).find('img').first().attr('alt');
								  
								  textArea.value = strSupplier + '\t' + strImage + '\t' + strClassify + '\t' + $(location).attr('href') + '\t5\t' + strPrice;
								  //console.log(textArea.value);
								  document.body.appendChild(textArea);

								  textArea.select();

								  try {
								    var successful = document.execCommand('copy');
								    var msg = successful ? new Noty({timeout: 3500, type: 'success', text: 'Copied'}).show() : new Noty({timeout: 3500, type: 'error', text: 'Copy Failed'}).show();
								    // console.log('Copying text command was ' + msg);
								    
								  } catch (err) {
								  	new Noty({timeout: 3500, type: 'error', text: 'Oops, unable to copy'}).show();
								  }

								  document.body.removeChild(textArea);
								}
			            }
			        }
			        new Noty({timeout: 5000, type: 'success', text: 'Có thể click vào phân loại hàng để copy'}).show();

            		break;
            }





        }

    }

}


