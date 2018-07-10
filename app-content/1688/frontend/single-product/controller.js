app.controller("1688Ctrl", ['$scope', 'moment', 'titleProducts',
    function ($scope, moment, titleProducts) {


        $scope.urlToPromise = function (url) {
            return new Promise(function (resolve, reject) {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
        // chưa xử lý trường hợp thông báo lỗi khi rớt mạng không thể download
        $scope.download_images = function () {
            var zip = new JSZip();
            var folderName = '';

            folderName = $('meta[name="b2c_auction"]').attr('content');
            var zip = new JSZip();
            // var count
            $('img[src$="32x32.jpg"]').each(function (index) {
                var originalImageURL = $(this).attr('src').replace('32x32.', '');
                var filename = originalImageURL.replace(/.*\//g, "");
                zip.file(folderName + '/classify/' + filename, $scope.urlToPromise(originalImageURL), { binary: true });
                //console.log();
            });
            $('img[src$="60x60.jpg"],img[src$="400x400.jpg"]').each(function (index) {
                var originalImageURL = $(this).attr('src').replace('60x60.', '').replace('400x400.', '');
                var filename = originalImageURL.replace(/.*\//g, "");
                zip.file(folderName + '/main/' + filename, $scope.urlToPromise(originalImageURL), { binary: true });
                //console.log();
            });
            $('img[src$=".jpg"]').not('[src$="32x32.jpg"],[src$="60x60.jpg"],[src$="400x400.jpg"]').each(function (index) {
                // var originalImageURL = ;
                var filename = $(this).attr('src').replace(/.*\//g, "");
                zip.file(folderName + '/' + filename, $scope.urlToPromise($(this).attr('src')), { binary: true });
                //console.log();
            });
            zip.generateAsync({ type: "blob" }).then(function (zipFile) {
                saveAs(zipFile, folderName + '.zip');
            });
        }

        var images = [];
        var SKU_classify = [];
        var id1688 = '';
        var read_data = function () {
            var i = 1;
            $(".mod-detail-gallery #dt-tab .nav-tabs .tab-trigger").each(function (index) {
                if (index < 5) {
                    images.push(JSON.parse($(this).attr('data-imgs')).preview)
                }
            })
            $('[data-sku-config]').each(function (index) {
                SKU_classify.push({
                    skuName: JSON.parse($(this).attr('data-sku-config')).skuName,
                    skuUrl_Image: $(this).find("img").attr('src').replace('.32x32.', '.')
                })
            })
            SKU_classify.map(x => {
                x.height = 0;
                x.long = 0;
                x.weight = 0;
                x.width = 0;
                var d = new Date();
                x.spSku = d.getTime() + i;
                i++;
            })
            id1688 = $('meta[name=b2c_auction]').attr("content");
            // console.log(SKU_classify);
        }

        // thêm sản phẩm
        titleProducts.getSuggests();
        $scope.add_products = function () {
            var n = new Noty({
                closeWith: [],
                // timeout: 2000,
                text: 'Product name? <input id="product_name" style="display: block" type="text"><div class="suggestProducts"></div>',
                buttons: [
                    Noty.button('YES', 'btn btn-success', function () {
                        read_data();
                        chrome.runtime.sendMessage({
                            mission: "pushFirestore",
                            SKU_name: titleProducts.getSKU()? titleProducts.getSKU(): '',
                            images: images,
                            id1688: id1688,
                            SKU_classify: SKU_classify
                        }, function (response) {
                            n.close();
                        })
                    }, { id: 'button1', 'data-status': 'ok' }),

                    Noty.button('NO', 'btn btn-error', function () {
                        $('input#suggest').val("")
                        n.close();
                    })
                ]
            }).show();
        }

    }]
);
