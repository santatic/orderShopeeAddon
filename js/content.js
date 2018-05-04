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
    script('//code.jquery.com/jquery-3.2.1.min.js', 'jquery')
    //-------------------------  

    function checkForJS_Finish() {
        if (document.readyState === 'complete' //document.querySelector (".footer__policy-item")  && $('a').filter(function() {return this.href.match(/\/.*i\.\d+\.\d+/);}).length > 5
        ) {
            clearInterval(jsInitChecktimer);

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
            }
        }

    }

}