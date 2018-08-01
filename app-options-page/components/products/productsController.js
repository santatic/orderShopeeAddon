app.controller("products-controller", productsController)

function productsController($scope, $q, $timeout, moment, uiGridConstants) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");

    var data = [];
    docRef = firestore.collection("products");
    chrome.storage.local.get('products', obj => {
        data = obj.products;
        getDataForTable(obj.products);
    })

    chrome.storage.onChanged.addListener(function (changes) {
        getDataForTable(changes.products.newValue);
        data = changes.products.newValue;
        dataForPro = changes.products.newValue
    })

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        enableGridMenu: true,
        showTreeExpandNoChildren: false,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        rowHeight: 60,
        columnDefs: [{
            name: "STT",
            field: "stt",
            width: 40
        }, {
            name: "Hình ảnh",
            cellTemplate: "<img ng-if='row.entity.img' src='{{row.entity.img}}' ng-class='{imgageRight: row.entity.$$treeLevel == 1, imgageLeft: row.entity.$$treeLevel == 0 }' alt='{{row.entity.name}}'/><span ng-if='!row.entity.img' class='imgClassify'>Không có ảnh</span>",
            enableCellEdit: false,
        }, {
            name: "Tên sản phẩm/Phân loại",
            cellTemplate: "<span ng-class='{nameLeft: row.entity.$$treeLevel == 1}'>{{row.entity.name}}</span>",
            // field: "name",
        }, {
            name: "SKU",
            enableCellEdit: false,
            cellTemplate: "<span ng-class='{nameLeft: row.entity.$$treeLevel == 1}'>{{row.entity.sku}}</span>",
        }, {
            name: "Action",
            cellTemplate: '<button class="btn btn-info" ng-click="">Delete</button>',
            visible: false,
        }],
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                // console.log(row);
                // // $scope.gridApi.selection.selectRow($scope.options.data[3]);
                // if(row.treeLevel == 0){
                //     if(row.isSelected == true){
                //         console.log('a');
                //     }else {
                //         console.log("b");
                //     }
                // }
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                // console.log(rows);
            });
            gridApi.rowEdit.on.saveRow($scope, function (rowEntity) {
                // console.log(rowEntity['Tên sản phẩm/Phân loại']);
                // console.log(rowEntity);
                // console.log(newValue);
                var promise = $q.defer();
                $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
                if (rowEntity.$$treeLevel == 0) {
                    var jobskill_query = firestore.collection('products').doc(rowEntity.sku)
                    jobskill_query.update({
                        "productName": rowEntity['Tên sản phẩm/Phân loại']
                    }).then(function () {
                        new Noty({
                            layout: 'bottomRight',
                            theme: 'relax',
                            timeout: 3000,
                            type: 'success',
                            text: 'ĐÃ CẬP NHẬT THÀNH CÔNG'
                        }).show();
                    });
                }
                if (rowEntity.$$treeLevel == 1) {
                    // console.log(data);
                    // var checks = false;
                    data.every(obj => {
                        var found = obj.classify.forEach(function (el, index) {
                            if (el.original_sku == rowEntity.sku) {
                                console.log(obj.id); 
                                el.name =  (rowEntity['Tên sản phẩm/Phân loại']).toUpperCase()
                                obj.classify[index] = el
                                console.log(obj.classify);
                                firestore.collection('products').doc(obj.id).update({
                                    "classify" :  obj.classify
                                }).then(function () {
                                    new Noty({
                                        layout: 'bottomRight',
                                        theme: 'relax',
                                        timeout: 3000,
                                        type: 'success',
                                        text: 'ĐÃ CẬP NHẬT THÀNH CÔNG'
                                    }).show();
                                    return false;                                    
                                });
                                // return false
                                
                            } else {
                                return true;
                            }
                            // var jobskill_query = firestore.collection('products').doc(obj.id)
                            // jobskill_query.update({
                            //     "classify": rowEntity['Tên sản phẩm/Phân loại']
                            // }).then(function () {
                            //     new Noty({
                            //         layout: 'bottomRight',
                            //         theme: 'relax',
                            //         timeout: 3000,
                            //         type: 'success',
                            //         text: 'ĐÃ CẬP NHẬT THÀNH CÔNG'
                            //     }).show();
                            // });
                        });
                        return found ? false : true;
                    })
                    // rowEntity.sku
                }
            });
        },
    };

    function getDataForTable(storage) {
        var dataui = [];
        var stt = 1;
        storage.forEach(data => {
            dataui.push({
                img: data.imagesPreview ? data.imagesPreview[0] : '',
                name: data.productName,
                sku: data.id,
                stt: stt,
                $$treeLevel: 0
            });
            stt++;
            data.classify.map(x => {
                dataui.push({
                    img: x.image ? x.image : '',
                    name: x.name,
                    sku: x.original_sku,
                    $$treeLevel: 1
                })
            })
            $scope.gridApi.core.refresh();
        });
        $scope.options.data = dataui;
        $scope.gridApi.core.refresh();
    }

    $scope.options.gridMenuCustomItems = [{
            title: "THÊM SẢN PHẨM",
            action: function () {
                $('#myModal').modal()
                var currentTab = 0; // Current tab is set to be the first tab (0)
                showTab(currentTab); // Display the current tab

                function showTab(n) {
                    // This function will display the specified tab of the form ...
                    var x = document.getElementsByClassName("tab");
                    x[n].style.display = "block";
                    // ... and fix the Previous/Next buttons:
                    if (n == 0) {
                        document.getElementById("prevBtn").style.display = "none";
                    } else {
                        document.getElementById("prevBtn").style.display = "inline";
                    }
                    if (n == (x.length - 1)) {
                        document.getElementById("nextBtn").innerHTML = "SUBMIT";
                    } else {
                        document.getElementById("nextBtn").innerHTML = "<span class='glyphicon glyphicon-chevron-right'></span>";
                    }
                    // ... and run a function that displays the correct step indicator:
                    fixStepIndicator(n)
                }

                var imagePreviewUrl = []
                var skuPreviewUrl = []

                $scope.addPreviewImage = function () {
                    var n = new Noty({
                        closeWith: [],
                        // timeout: 2000,
                        layout: "topLeft",
                        text: `<input placeholder="Nhập trực tiếp url ảnh..." id="imageUrl" type="text">
                            <p><input type="file" id="uploadPreview" class="imgur" accept="image/*"/></p>`,
                        buttons: [
                            Noty.button('ADD', 'btn btn-success', function () {
                                let urlPreview = $('input#imageUrl').val()
                                if (urlPreview && (jQuery.inArray(urlPreview, imagePreviewUrl) == -1)) {
                                    imagePreviewUrl.push($('input#imageUrl').val().toString())
                                    $('p#previewImage').append('<img width="121" class="imgPreview" height="121" src="' + urlPreview + '" >')
                                }
                                n.close()

                            }, {
                                id: 'button1',
                                'data-status': 'ok'
                            }),

                            Noty.button('CANCEL', 'btn btn-error', function () {
                                n.close();
                            })
                        ]
                    }).show();
                    upload()
                }
                $scope.addSkuPreview = function () {
                    var n = new Noty({
                        closeWith: [],
                        // timeout: 2000,
                        layout: "topLeft",
                        text: `<input placeholder="Nhập trực tiếp url ảnh..." id="imageUrl" type="text">
                            <p><input type="file" id="uploadPreview" class="imgur" accept="image/*"/></p>`,
                        buttons: [
                            Noty.button('ADD', 'btn btn-success', function () {
                                let urlPreview = $('input#imageUrl').val()
                                if (urlPreview && (jQuery.inArray(urlPreview, skuPreviewUrl) == -1)) {
                                    skuPreviewUrl.push($('input#imageUrl').val().toString())
                                    $('button.skuPreviewUrl').css({
                                        "background-image": "url(" + urlPreview + ")",
                                        "background-size": "cover"
                                    })
                                    $('p#addSku span.glyphicon-picture').css({
                                        "color": "#0000"
                                    })
                                }
                                n.close()

                            }, {
                                id: 'button1',
                                'data-status': 'ok'
                            }),

                            Noty.button('CANCEL', 'btn btn-error', function () {
                                n.close();
                            })
                        ]
                    }).show();
                    upload()

                }

                $scope.addSku = function () {

                    $('p#addSku span.glyphicon-picture').css({
                        "color": "#000000"
                    })
                    var skuName = $('input#skuName').val()
                    if (skuName) {
                        var bg = $("button.skuPreviewUrl").css('background-image');
                        bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
                        var id = (new Date()).getTime()
                        var element = `
                            <li class="list-group-item" id="` + id + `" >
                                <button id="Sku" class="previewSku">
                                    <span class="glyphicon glyphicon-picture" style="color: #000"></span>
                                </button>
                                <span id="skuNameSpan" style="width: 77%;margin-right: 6px;background: #ddd;display: inline-block;padding: 12px;font-size: 17px;">` + skuName.toUpperCase() + `</span>
                                <button class="removeLi" id="Sku" style="margin-right:0px">
                                    <span class="glyphicon glyphicon-remove" style="color: #e51e1e; "></span>
                                </button>
                            </li>
                            `
                        $('ul.list-sku').prepend(element)
                        $('li#' + id + ' button.previewSku').css({
                            "background-image": "url(" + bg + ")",
                            "background-size": "cover"
                        })

                        $('li#' + id + ' button.removeLi').click(function () {
                            $(this).parent('li#' + id + '').remove()
                        })

                        if (bg !== "") {
                            $('li#' + id + ' span.glyphicon-picture').css({
                                "color": "#0000"
                            })
                        }

                    } else {
                        alert("Vui lòng nhập tên Phân Loại")
                    }
                    $('input#skuName').focus()
                    $('button.skuPreviewUrl').css({
                        "background-image": "url('')",
                        "background-size": "cover"
                    })
                }

                function upload() {
                    $('input#uploadPreview[type=file]').on("change", function () {
                        var $files = $(this).get(0).files;
                        var n2 = new Noty({
                            layout: 'topLeft',
                            theme: "relax",
                            type: 'warning',
                            text: 'ĐANG UPLOAD...'
                        }).on('afterShow', function () {
                            // Reject big files
                            // Begin file upload
                            console.log("Uploading file to Imgur..");
                            // Replace ctrlq with your own API key
                            var settings = {
                                async: false,
                                crossDomain: true,
                                processData: false,
                                contentType: false,
                                type: 'POST',
                                url: 'https://api.imgur.com/3/image',
                                headers: {
                                    Authorization: 'Client-ID 1a75998a3de24bd',
                                    Accept: 'application/json'
                                },
                                mimeType: 'multipart/form-data'
                            };

                            var formData = new FormData();
                            formData.append("image", $files[0]);
                            settings.data = formData;
                            $.ajax(settings).done(function (response) {
                                n2.close()
                                new Noty({
                                    layout: 'topLeft',
                                    timeout: 2000,
                                    theme: "relax",
                                    type: 'success',
                                    text: 'ĐÃ UPLOAD THÀNH CÔNG!'
                                }).show()
                                var obj = JSON.parse(response)
                                console.log(obj.data.link);
                                $('input#imageUrl').val(obj.data.link)
                            });


                        }).show()
                    });
                }
                $scope.nextPrev = function (n) {
                    // This function will figure out which tab to display
                    var x = document.getElementsByClassName("tab");
                    // Exit the function if any field in the current tab is invalid:
                    if (n == 1 && !validateForm()) return false;
                    // Hide the current tab:
                    x[currentTab].style.display = "none";
                    // Increase or decrease the current tab by 1:
                    currentTab = currentTab + n;
                    // if you have reached the end of the form... :
                    if (currentTab >= x.length) {
                        //...the form gets submitted:
                        // document.getElementById("regForm").submit();
                        var productName = $('input#productName').val()
                        var objProduct = {
                            productName: $('input#productName').val().toString(),
                            id: ((new Date()).getTime()).toString(),
                            imagesPreview: imagePreviewUrl,
                            classify: [],
                            linked_classify: [],
                        }
                        $('ul.list-sku .list-group-item').each(function (index) {
                            let bg = $(this).find('button.previewSku').css('background-image');
                            bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
                            bg = bg.indexOf('chrome-extension://') !== -1 ? "" : bg
                            objProduct.classify.push({
                                original_sku: $(this).attr('id').toString(),
                                name: $(this).find('span#skuNameSpan').text(),
                                image: bg
                            })
                            objProduct.create_at = new Date()
                        })
                        $('#myModal').modal('hide');
                        console.log(objProduct);
                        firestore.collection('products').doc(objProduct.id).set(objProduct)
                            .then(function () {
                                new Noty({
                                    layout: 'bottomRight',
                                    timeout: 1500,
                                    theme: "relax",
                                    type: 'success',
                                    text: 'ĐÃ ĐĂNG SẢN PHẨM THÀNH CÔNG!'
                                }).show()
                            })
                        return false;
                    }
                    // Otherwise, display the correct tab:
                    showTab(currentTab);
                }
                $("#myModal").on("hidden.bs.modal", function () {
                    $('input#productName').val("");
                    $('ul.list-sku').html("")
                    $('input#skuName').val("")
                    $('p#previewImage img.imgPreview').remove()
                })

                function validateForm() {
                    // This function deals with validation of the form fields
                    var x, y, i, valid = true;
                    x = document.getElementsByClassName("tab");
                    y = x[currentTab].getElementsByTagName("input");
                    // A loop that checks every input field in the current tab:
                    for (i = 0; i < y.length; i++) {
                        // If a field is empty...
                        if (y[i].value == "") {
                            // add an "invalid" class to the field:
                            y[i].className += " invalid";
                            // and set the current valid status to false:
                            valid = false;
                        }
                    }
                    // If the valid status is true, mark the step as finished and valid:
                    if (valid) {
                        document.getElementsByClassName("step")[currentTab].className += " finish";
                    }
                    return valid; // return the valid status
                }

                function fixStepIndicator(n) {
                    // This function removes the "active" class of all steps...
                    var i, x = document.getElementsByClassName("step");
                    for (i = 0; i < x.length; i++) {
                        x[i].className = x[i].className.replace(" active", "");
                    }
                    //... and adds the "active" class to the current step:
                    x[n].className += " active";
                }
            }
        },
        {
            title: "XÓA SẢN PHẨM",
            action: function () {

            }
        }
    ];

    // $scope.saveRow = 


}