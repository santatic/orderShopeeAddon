window.addEventListener("load", myMain, false);

function myMain(evt) {
    var jsInitChecktimer = setInterval(checkForJS_Finish, 1500);

    function checkForJS_Finish() {
        if (document.readyState === 'complete' //document.querySelector (".footer__policy-item")  && $('a').filter(function() {return this.href.match(/\/.*i\.\d+\.\d+/);}).length > 5
        ) {
            clearInterval(jsInitChecktimer);
            //set attribute to use angularjs
            document.getElementsByTagName("body")[0].setAttribute("ng-app", "myapp");
            document.getElementsByTagName("body")[0].setAttribute("ng-csp", "");

            switch (true) {

                case $(location).attr('href').indexOf('work.1688.com/home/buyer.htm?') !== -1:
                    $.get(chrome.extension.getURL('app-content/1688/backend/listOrders/ordersList.html'), function (data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });
                    break

                case $(location).attr('href').indexOf('https://banhang.shopee.vn/portal/sale?') !== -1:
                    $.get(chrome.extension.getURL('app-content/shopee/backend/list-page/template.html'), function (data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });
                    break;
                case $(location).attr('href') == 'https://banhang.shopee.vn/':
                    $.get(chrome.extension.getURL('app-content/shopee/backend/homepage/template.html'), function (data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });
                    break;
                case $(location).attr('href').indexOf('detail.1688.com/offer/') !== -1: // trang xem 1 sản phẩm 1688
                    zoom_in_thumbnail_32x32(); //orderShopeeAddon\js\custom-shopee.js
                    $.get(chrome.extension.getURL('app-content/1688/frontend/single-product/template.html'), function (data) {

                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });
                    // start code cho phep copy so luong hang
                    var tds = document.getElementsByTagName('td');

                    for (var i = 0; i < tds.length; i++) {
                        var td = tds[i];
                        if (td.className.indexOf('name') !== -1) { // những td có class là name là những td chứa phân loại hàng sku 
                            td.onclick = function () {
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
                                    .filter(function () {
                                        return this.href.match(/https\:\/\/.*\.1688\.com\/page\/companyinfo.htm/); //https\:\/\/.*\.1688\.com\/page\/companyinfo.htm
                                    }).attr('href').replace('https://', '').replace('.1688.com/page/companyinfo.htm', '').replace('.1688.com/page/0701/tg.html', '');
                                // nếu không có ảnh thì lấy ảnh avatar
                                var strImage = $(this).find('img').length === 0 ? '=image("' + $('a[trace="largepic"] img').attr('src').replace('400x400.', '') + '")' :
                                    '=image("' + $(this).find('img').first().attr('src').replace('32x32.', '') + '")';

                                var strClassify = $(this).find('img').length === 0 ? $.trim($(this).text()) : $(this).find('img').first().attr('alt');

                                textArea.value = strSupplier + '\t' + strImage + '\t' + strClassify + '\t' + $(location).attr('href') + '\t5\t' + strPrice;
                                //console.log(textArea.value);
                                document.body.appendChild(textArea);

                                textArea.select();

                                try {
                                    var successful = document.execCommand('copy');
                                    var msg = successful ? new Noty({
                                        timeout: 3500,
                                        type: 'success',
                                        text: 'Copied'
                                    }).show() : new Noty({
                                        timeout: 3500,
                                        type: 'error',
                                        text: 'Copy Failed'
                                    }).show();
                                    // console.log('Copying text command was ' + msg);

                                } catch (err) {
                                    new Noty({
                                        timeout: 3500,
                                        type: 'error',
                                        text: 'Oops, unable to copy'
                                    }).show();
                                }

                                document.body.removeChild(textArea);
                            }
                        }
                    }
                    new Noty({
                        timeout: 5000,
                        type: 'success',
                        text: 'Có thể click vào phân loại hàng để copy'
                    }).show();
                    // end code cho phep copy so luong hang
                    break;
                case /https:\/\/shopee.vn\/.*i\.\d+\.\d+/.test(window.location.href): //https://shopee.vn/-4-M%C3%A0u-B%E1%BA%A1c-%C4%90en-H%E1%BB%93ng-Cam-H%E1%BB%93ng-Balo-Ulzzang-C%E1%BA%B7p-S%C3%A1ch-Th%E1%BB%9Di-Trang-Si%C3%AAu-C%C3%A1-T%C3%ADnh-!-i.20340126.665841685
                    console.log("heelo");
                    $.get(chrome.extension.getURL('app-content/shopee/frontend/single-product/template.html'), function (data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);
                    });
                    break;
                case /https:\/\/banhang.shopee.vn\/portal\/sale\/\d+/.test(window.location.href): //https://shopee.vn/-4-M%C3%A0u-B%E1%BA%A1c-%C4%90en-H%E1%BB%93ng-Cam-H%E1%BB%93ng-Balo-Ulzzang-C%E1%BA%B7p-S%C3%A1ch-Th%E1%BB%9Di-Trang-Si%C3%AAu-C%C3%A1-T%C3%ADnh-!-i.20340126.665841685
                    //https://banhang.shopee.vn/portal/sale/524619140
                    console.log("loop");
                    $.get(chrome.extension.getURL('app-content/shopee/backend/single-sale/template.html'), function (data) {
                        $(data).prependTo('body');
                        angular.bootstrap($('.panel-1688-shopee'), ['myapp']);

                    });
                    break;


            }
        }

    }

}