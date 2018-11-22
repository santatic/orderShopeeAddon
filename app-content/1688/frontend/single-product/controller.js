
app.controller("1688Ctrl", ['$scope', 'moment',
    function ($scope, moment) {

        $scope.selectedObj = function (selected) {
            console.log(selected);
        };

        var id1688 = $('meta[name=b2c_auction]').attr("content");

        var Products = [];
        chrome.storage.local.get('products', function (obj) {
            getData(obj.products);
            $scope.productsName = obj.products
        })

        chrome.storage.onChanged.addListener(function (changes) {
            getData(changes.products.newValue);
        })

        function getData(Products) {
            console.log(Products);
            found = false;
            console.log(Products.length);
            if (Products.length > 0) {
                Products.forEach(function loop(pro) {
                    if (loop.stop) { return; }

                    let index = pro.linked_classify.findIndex(x => x.id == id1688.toString());
                    console.log(index);
                    if (index !== -1) {
                        loop.stop = true;
                        $scope.dontfound = false
                        console.log(pro.id, pro.linked_classify[index]);
                        $scope.id_products = pro.id
                        $scope.productName = pro.productName
                        $scope.$apply()
                        // break;
                    } else {
                        console.log('không thấy');
                        $scope.dontfound = true
                        $scope.add_products_link = chrome.extension.getURL("options.html#/products/");
                        console.log($scope.add_products_link);
                        $scope.$apply()

                    }

                })
            } else {$scope.dontfound = true; $scope.$apply()}

        }

        $scope.getClassifyCount = 0

        $('div.obj-content').prepend('<div style="display:none"><input type="checkbox"  checked id="checkall"/><span> Chọn hết</span></div> <br/>')

        $('input#checkall').click(function ($event) {
            console.log($event.currentTarget.checked);
            checkboxes = document.getElementsByName('classify');

            for (var i = 0, n = checkboxes.length; i < n; i++) {
                checkboxes[i].checked = $event.currentTarget.checked;
            }

            if ($event.currentTarget.checked) {
                $scope.getClassifyCount = checkboxes.length
                $scope.$apply()
            } else {
                $scope.getClassifyCount = 0
                $scope.$apply()
            }

        })

        $checkType3 = false

        if($('[data-sku-config]').length > 0){
            $('[data-sku-config]').each(function () {
                var skuName = JSON.parse($(this).attr('data-sku-config')).skuName
                $(this).prepend('<input type="checkbox" style="display:none" checked class="checkclassify" name="classify" value="' + skuName + '">')
            })
        }else{
            $('.obj-amount div.d-content').prepend('<input type="checkbox" checked class="checkclassify" style="display:none" name="classify" value="' + id1688 + '">')
            $checkType3 = true
        }

        

        $("input.checkclassify").click(function () {
            console.log("click");
            $scope.getClassifyCount = getClassifyCount()
            $scope.$apply()
            console.log($scope.getClassifyCount);
        })

        function getClassifyCount() {
            return $("input[name='classify']:checked").length
        }



        $scope.showAddName = false

        $scope.addDis = function () {
            // $('#addDistributor').modal()
            $scope.showAddName = true
            $scope.dontfound = false
            // $scope.$apply()
        }


        $scope.addDisNew = function () {

            var arrayClassifyNew = []
            var $checkType2 = $('div.d-content > div.obj-leading')
            
            if($checkType2.length > 0){
                console.log("loại 2");
                var leadingHeader = $checkType2.find('.obj-header').text()
                var leadingSku = $('div.d-content > div.obj-sku').find('.obj-header').text()
                $checkType2.find('ul.list-leading li').each(function () {  
                    var img = $(this).find('img').attr('src')
                    img = img ? img : "https://i.imgur.com/NWUJZb1.png"
                    var original_nameLeading = JSON.parse($(this).find('div.unit-detail-spec-operator').attr('data-unit-config')).name
                    $("input[name='classify']:checked").each(function () {
                        arrayClassifyNew.push({
                            original_name: (leadingHeader + ":" + original_nameLeading).replace(/\s/g,'') + "; " + (leadingSku.replace("（张）",'').replace(/\s/g,'') + ":"+ $(this).val()).replace(/\s/g,''),
                            originalImageURL: img
                        })
                    })
                })
            }else{
                $("input[name='classify']:checked").each(function () {
                    var img = $(this).parent().find("img").attr('src')
                    img = img ? img : "https://i.imgur.com/NWUJZb1.png"
                    arrayClassifyNew.push({
                        original_name: $(this).val(),
                        originalImageURL: img
                    })
    
                })
            }
            
            $scope.preImg = $('a.box-img img').attr('src')
            $scope.arrayClassifyNew = arrayClassifyNew;
            $('#addDistributorToNew').modal()
            $scope.removeClassifyView = function (target) {
                $this = target.currentTarget;
                angular.element($this).parent().remove()
            }
            $scope.submitDisNew = function () {
                var date = new Date()
                var check = false
                var classify = []
                var linked_classify = []
                $('.classifyList li').each(function (i) {
                    check = $(this).find('input').val() ? true : false
                    classify.push({
                        image: $(this).find('img').attr('src') == "https://i.imgur.com/NWUJZb1.png" ? "" : $(this).find('img').attr('src').replace('32x32', '400x400'),
                        name: $(this).find('input').val().toUpperCase(),
                        original_sku: (date.getTime() + i + 1).toString(),
                    })
                    var obj = {
                        id: id1688.toString(),
                        name: (location.hostname).toString(),
                        original_sku: (date.getTime() + i + 1).toString(),
                        skuName: $checkType2.length > 0 ? $(this).find('span#originalSkuName').text():$("input[name='classify']:checked").parents('div.obj-sku').find('div.obj-header span.obj-title').text() + ":" + $(this).find('span#originalSkuName').text()
                    }
                    obj.skuName =  $checkType3 ? id1688.toString() : obj.skuName
                    linked_classify.push(obj)
                     
                })
                if ($('input#newName').val() !== "") {
                    console.log(classify);
                    var obj = {
                        classify: classify,
                        linked_classify: linked_classify,
                        imagesPreview: [$scope.preImg],
                        productName: $('input#newName').val(),
                        id: (date.getTime()).toString()
                    }
                    console.log(obj);
                    if($scope.id_products){
                        console.log($scope.id_products);
                        chrome.runtime.sendMessage({
                            mission: "updatePro",
                            id: $scope.id_products,
                            linked_classify: obj.linked_classify,
                            classify: obj.classify
                        },function(response){
                            new Noty({
                                layout: 'bottomRight',
                                theme: "relax",
                                type: 'success',
                                timeout: 1500,
                                text: 'Đã cập nhật các phân loại'
                            }).show();
                        })
                    }else{
                        chrome.runtime.sendMessage({
                            mission: "saveProductNew",
                            obj: obj
                        }, function (response) {
                            $('#addDistributorToNew').modal('hide')
                            new Noty({
                                layout: 'bottomRight',
                                theme: "relax",
                                type: 'success',
                                timeout: 1500,
                                text: 'Đã tạo sản phẩm mới và thêm nhà phân phối'
                            }).show();
                            setTimeout(function () {
                                location.reload()
                            }, 1000)
                        })
                    }
                    

                } else {
                    alert("please fill all")
                }

            }
            console.log(arrayClassifyNew);
            var timer = setInterval(function () {
                console.log("notyet");
                if ($('img.classify').length) {
                    clearInterval(timer)
                    $('img.classify').popover({
                        html: true,
                        trigger: 'hover',
                        placement: 'left',
                        content: function () {
                            let img = $(this).attr('src').replace("32x32", "400x400")
                            return img == "https://i.imgur.com/NWUJZb1.png" ? '<span>Phân loại này không có hình ảnh</span>' : '<img width="100%" src="' + img + '" />';

                        }
                    });

                }
            }, 100)
        }

        $scope.updatePro = function(id){
            console.log(id);
        }

        $scope.submitDis = function () {

            if ($('input#ex1_value').val() !== "" && $scope.getClassifyCount > 0) {
                $scope.showAddName = false
                $scope.dontfound = true
            } else {
                alert("Vui lòng tìm được sản phẩm đã tạo hoặc có 1 phân loại trở lên")
            }
        }

        //
        var images = [];
        var SKU_classify = [];
        var read_data = function () {
            $(".mod-detail-gallery #dt-tab .nav-tabs .tab-trigger").each(function (index) {
                if (index < 5) {
                    images.push(JSON.parse($(this).attr('data-imgs')).preview)
                }
            })
            $('[data-sku-config]').each(function (i) {
                SKU_classify.push({
                    skuName: JSON.parse($(this).attr('data-sku-config')).skuName,
                    skuUrl_Image: $(this).find("img").attr('src'),
                    // .replace('.32x32.', '.')
                    height: 0,
                    long: 0,
                    weight: 0,
                    width: 0,
                    spSku: new Date().getTime() + i + 2,
                })
            })
            // id1688 = $('meta[name=b2c_auction]').attr("content");
            // console.log(SKU_classify);
        }

        // thêm sản phẩm
        // titleProducts.getSuggests();
        // $scope.add_products = function () {
        //     $('#myModal').modal();
        // var n = new Noty({
        //     closeWith: [],
        //     // timeout: 2000,
        //     text: 'Product name? <input id="product_name" style="display: block" type="text"><div class="suggestProducts"></div>',
        //     buttons: [
        //         Noty.button('Tạo mới', 'btn btn-success', function () {
        //             read_data();
        //             console.log('a');
        //             chrome.runtime.sendMessage({
        //                 mission: "pushFirestore",
        //                 name: $('#product_name').val(),
        //                 SKU_name: new Date().getTime(),
        //                 images: images,
        //                 id1688: id1688,
        //                 SKU_classify: SKU_classify
        //             }, function (response) {
        //                 n.close();
        //             })
        //         }, { id: 'button1', 'data-status': 'ok' }),

        //         Noty.button('NO', 'btn btn-error', function () {
        //             $('input#suggest').val("")
        //             n.close();
        //         })
        //     ]
        // }).show();
        // }

    }]
);
app.controller("1688downloadImg", ['$scope', function ($scope) {
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

}])
