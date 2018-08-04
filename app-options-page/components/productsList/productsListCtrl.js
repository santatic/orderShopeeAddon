app.controller("productsList-controller", productsList)

productsList.$inject = ['$scope', '$q', '$timeout', 'moment', 'uiGridConstants'];

function productsList($scope, $q, $timeout, moment, uiGridConstants) {
    $scope.loading = true;
    var saleUrl = chrome.extension.getURL("options.html#/");

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        columnDefs: [{
            name: "Ảnh mô tả",
            width: 30,
            enableFiltering: false,
            // field: "size",
            cellTemplate: "<img class='previewImg' src='{{row.entity.imgPreview}}' width=30 height=30 />"
        }, {
            name: "Tên sản phẩm",
            field: "productName",
            enableCellEdit: true
        }, {
            name: "Phân loại",
            enableCellEdit: false,
            field: "countClassify",
            cellTemplate: '<div class="ui-grid-cell-contents" ><span title="click xem chi tiết các phân loại" ng-click = "grid.appScope.showClassify(row)" style="cursor:pointer;color:#31708f" class="glyphicon glyphicon-cog"></span>&nbsp;&nbsp; <b>{{row.entity.countClassify}}</b> Phân loại</div>'
        }, {
            name: "Ngày tạo",
            enableCellEdit: false,
            field: "time",
            sort: {
                direction: 'desc',
                priority: 0
            }
        }, {
            name: "Nhà Phân Phối",
            field: "countDistribution",
            enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><span title="click xem chi tiết các nhà phân phối" ng-click = "grid.appScope.addDistribution(row)" style="cursor:pointer;color:#31708f" class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp; <b><span ng-click = "grid.appScope.showDistribution(row)" style="cursor:pointer" > {{row.entity.countDistribution}}</span></b></div>'
        }, {
            name: "Mã sku",
            field: "skuProduct",
            enableCellEdit: false
        }],
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                console.log(rows);
            });
            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    // angular.element(document.getElementsByClassName('grid')[0]).css('height', '900px');
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.showClassify = function (row) {
        // console.log(row);
        const data = row.entity
        $scope.titleProductName = data.productName
        $scope.listClassify = data.classify
        var linked_data = data.linked_classify
        $("#showClassify").modal();
        $("#showClassify").on("hidden.bs.modal", function () {
            $scope.listClassify = []
            // $('ul#listClassify').html("")
        })
        var timer2 = setInterval(function () {
            console.log("notyet");
            if ($('img.previewSkuImg').length) {
                clearInterval(timer2)
                $('img.previewSkuImg').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'left',
                    content: function () {
                        let img = $(this).attr('src')
                        return img == "https://i.imgur.com/NWUJZb1.png" ? '<span>Phân loại này không có hình ảnh</span>' : '<img min-width="100px" width="100%" src="' + img + '" />';
                        
                    },
                    template: '<div class="popover preview-classify" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                });
            }
        }, 1000)
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
                        if (urlPreview) {
                            $('button.skuPreviewUrl img').attr('src', urlPreview)
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
            let img = $('.skuPreviewUrl img').attr('src')
            let skuNameToAdd = $('input#addClassifyName').val()

            if (skuNameToAdd) {
                $scope.listClassify.push({
                    name: skuNameToAdd.toString(),
                    image: img == 'https://i.imgur.com/NWUJZb1.png' ? "" : img,
                    original_sku: (new Date()).getTime().toString()
                })
                $('input#addClassifyName').val("")
                $('.skuPreviewUrl img').attr('src', 'https://i.imgur.com/NWUJZb1.png')
            } else {
                alert("Vui lòng nhập tên Phân Loại")
            }
        }

        $scope.saveClassify = function () {
            var arrClassify = []
            if ($('li.classifyItem').length > 0) {
                $('li.classifyItem').each(function (element) {
                    let img = $(this).find('img').attr('src')
                    let obj = {
                        name: $(this).find('input').val().toString().toUpperCase(),
                        image: img == "https://i.imgur.com/NWUJZb1.png" ? "" : img,
                        original_sku: $(this).attr('id')
                    }
                    arrClassify.push(obj)
                })
            }
            // console.log(arrClassify);
            firestore.collection('products').doc(data.skuProduct).update({
                "classify": arrClassify,
                "linked_classify": linked_data
            }).then(function () {
                new Noty({
                    layout: 'bottomRight',
                    timeout: 1500,
                    theme: "relax",
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT PHÂN LOẠI!'
                }).show()
                $('#showClassify').modal('hide');
            })
        }
        // console.log(linked_data);
        $scope.removeClassify = function (target) {
            $this = target.currentTarget;
            linked_data = linked_data.filter(obj => obj.original_sku !== angular.element($this).parent().attr('id'));
            angular.element($this).parent().remove()
            console.log(linked_data);
        }

    }


    $scope.addDistribution = function (row) {
        const data = row.entity
        $scope.titleProductName = data.productName
        $scope.classifyToDis = data.classify
        $('#addDistributor').modal()
        $scope.toggle = function (event) {
            console.log(event.currentTarget.checked);
            checkboxes = document.getElementsByName('classify');
            for (var i = 0, n = checkboxes.length; i < n; i++) {
                checkboxes[i].checked = event.currentTarget.checked;
            }
        }

        $("#addDistributor").on("hidden.bs.modal", function () {
            $('#checkall').prop('checked', false);
            $('input#Disname').val("")
            $('input#Disid').val("")
            // $('ul#listClassify').html("")
        })
        $scope.addDis = function () {
            var disName = $('input#Disname').val().toString().toUpperCase()
            var id = $('input#Disid').val().toString()
            if (disName && id) {
                $('input[name="classify"]:checked').each(function () {
                    var selectedExpTags = [$(this).val()];
                    var names = selectedExpTags.map(x => data.classify.find(y => y.name === x).original_sku)
                    console.log(names[0]);
                    data.linked_classify.push({
                        name: disName,
                        id: id,
                        original_sku: names[0].toString()
                    })
                })
                firestore.collection('products').doc(data.skuProduct).update({
                    "linked_classify": data.linked_classify
                }).then(function () {
                    new Noty({
                        layout: 'bottomRight',
                        timeout: 1500,
                        theme: "relax",
                        type: 'success',
                        text: 'ĐÃ THÊM NHÀ PHÂN PHỐI!'
                    }).show()
                    $('#addDistributor').modal('hide');
                })

            } else {
                alert("Vui lòng điền đủ thông tin")
            }
        }
    }

    $scope.showDistribution = function (row) {
        $('#showDistributor').modal()
        $scope.titleProductName = row.entity.productName
        $scope.linkedToShow = row.entity.linked_filltered
        $scope.linked_classify = row.entity.linked_classify
        $scope.classify = row.entity.classify
        console.log($scope.linkedToShow);
        var timer3 = setInterval(function () {
            console.log("notyet");
            if ($('li.disItem').length) {
                clearInterval(timer3)
                // $('li.disItem').each(function(){
                //     let id = $(this).attr('id')
                //     let linked_data = $scope.linked_classify.filter(obj => obj.id == id);
                //     console.log(linked_data);
                //     var arrOrigin = []
                //     linked_data.forEach(function(val){
                //         arrOrigin.push(val.original_sku)
                //     })                    
                //     var names = arrOrigin.map(x => $scope.classify.find(y => y.original_sku === x).name)
                //     console.log(names);
                // })
                $('li.disItem span.disName').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'left',
                    content: function () {
                        let id = $(this).parent().attr('id')
                        let linked_data = $scope.linked_classify.filter(obj => obj.id == id);
                        var arrOrigin = []
                        linked_data.forEach(function (val) {
                            arrOrigin.push(val.original_sku)
                        })
                        var names = arrOrigin.map(x => $scope.classify.find(y => y.original_sku === x).name)
                        // $scope.names = names
                        return '<span style="background: #1fc2fa" class= "itemLinked">'+id+'</span><span class= "itemLinked">' + names.join('</span><span class= "itemLinked">')+'</span>'
                        
                    },
                    template: '<div class="popover preview-dis" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                });
            }
        }, 1000)
        $scope.removeDis = function (target) {
            $this = target.currentTarget;
            $scope.linked_classify = $scope.linked_classify.filter(obj => obj.id !== angular.element($this).parent().attr('id'));
            angular.element($this).parent().remove()
            console.log(linked_data);
        }
        $scope.saveDis = function(){
            firestore.collection('products').doc(row.entity.skuProduct).update({
                "linked_classify": $scope.linked_classify
            }).then(function () {
                new Noty({
                    layout: 'bottomRight',
                    theme: 'relax',
                    timeout: 1500,
                    type: 'success',
                    text: 'ĐÃ CẬP NHẬT NHÀ PHÂN PHỐI!'
                }).show();
                $('#showDistributor').modal('hide');
            });
        }
    }

    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        var jobskill_query = firestore.collection('products').doc(rowEntity.skuProduct)
        jobskill_query.update({
            "productName": rowEntity.productName
        }).then(function () {
            new Noty({
                layout: 'bottomRight',
                theme: 'relax',
                timeout: 1500,
                type: 'success',
                text: 'ĐÃ CẬP NHẬT TÊN SẢN PHẨM!'
            }).show();
        });
    };

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
                var selected = $scope.gridApi.selection.getSelectedRows();
                if (selected.length > 0) {
                    var confirmToDel = confirm("Bạn có chắc muốn xóa những sản phẩm đã chọn?");

                    if (confirmToDel) {
                        var batch = firestore.batch();
                        selected.forEach(function (val) {
                            var laRef = firestore.collection("products").doc(val.skuProduct);
                            batch.delete(laRef);
                        })
                        batch.commit().then(function () {
                            console.log("done");
                        });
                    }
                } else alert("Vui lòng chọn sản phẩm cần xóa")

            }
        }
    ];


    $scope.options.multiSelect = true;

    chrome.storage.local.get('products', function (keys) {
        getProducts(keys.products)
    })

    chrome.storage.onChanged.addListener(function (changes) {
        getProducts(changes.products.newValue);
    })


    function getProducts(arr) {
        var sources = []

        arr.forEach(function (myData) {
            var arrDis = []
            // console.log(myData);
            time = moment(myData.create_at.seconds * 1000).format("MM-DD-YYYY")

            myData.linked_classify.forEach(function (linked) {
                var found = arrDis.some(function (el) {
                    return el.id == linked.id;
                });
                if (!found) {
                    arrDis.push({
                        id: linked.id,
                        name: linked.name
                    })
                }
            })

            console.log(arrDis);
            obj = {
                skuProduct: myData.id,
                time: time,
                countDistribution: arrDis.length + " Nhà Phân Phối",
                countClassify: myData.classify.length,
                productName: myData.productName,
                classify: myData.classify,
                linked_classify: myData.linked_classify,
                linked_filltered: arrDis,
                imgPreview: myData.imagesPreview[0] ? myData.imagesPreview[0] : "https://i.imgur.com/NWUJZb1.png"
            }

            sources.push(obj)
        })
        console.log(sources);
        $scope.data = sources
        $scope.options.data = $scope.data;
        $scope.loading = false
        $scope.gridApi.core.refresh();
        var timer = setInterval(function () {
            console.log("notyet");
            if ($('img.previewImg').length) {
                clearInterval(timer)
                $('img.previewImg').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'bottom',
                    //placement: 'bottom',
                    content: function () {
                        let img = $(this).attr('src')
                        return img == "https://i.imgur.com/NWUJZb1.png" ? '<span>Sản phẩm này không có hình ảnh</span>' : '<img width="100%" src="' + img + '" />';

                    },
                    template: '<div class="popover awesome-popover-class" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'

                });

            }
        }, 100)

    }





}