app.controller("home-controller", function ($scope, moment) {


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
            <li class="list-group-item" id="`+ id + `" >
                <button id="Sku" class="previewSku">
                    <span class="glyphicon glyphicon-picture" style="color: #000"></span>
                </button>
                <span style="width: 77%;margin-right: 6px;background: #ddd;display: inline-block;padding: 12px;font-size: 17px;">`+skuName.toUpperCase()+`</span>
                <button class="removeLi" id="Sku" style="margin-right:0px">
                    <span class="glyphicon glyphicon-remove" style="color: #e51e1e; "></span>
                </button>
            </li>
            `
            $('ul.list-sku').prepend(element)
            $('li#'+ id +' button.previewSku').css({
                "background-image": "url(" +bg+ ")",
                "background-size": "cover"
            })

            $('li#'+ id +' button.removeLi').click(function(){
              $(this).parent('li#'+ id +'').remove()
            })

            if(bg!== ""){
                $('li#'+ id +' span.glyphicon-picture').css({
                    "color":"#0000"
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
            // var productName = $('input#productName').val()
            // var objProduct = {
            //     productName: $('input#productName').val().toString()

            // }
            $('#myModal').modal('hide');
            return false;
        }
        // Otherwise, display the correct tab:
        showTab(currentTab);
    }

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



    $scope.msg = "I love 34325";
    $('#myModal').modal()
    var todayCount = []
    var yesterdayCount = []
    var today = new Date()
    var date = new Date()
    yesterday = date.setDate(date.getDate() - 1);
    var sevenDay = []
    var sevenCount = []
    for (let i = 1; i <= 7; i++) {
        var seven = new Date()
        var sevenDate = seven.setDate(seven.getDate() - i);
        sevenDay.push(moment(sevenDate).format("YYYY-MM-DD").toString());
    }
    var thisMonth = moment(today).format("YYYY-MM")
    var monthCount = []
    console.log(thisMonth);
    // console.log(moment(date).format("YYYY-MM-DD").toString());
    // console.log(moment(date).format);
    var paidToday = []
    var paidYesterday = []
    var paidSeven = []
    var paidMonth = []

    chrome.storage.local.get('data', function (keys) {
        keys.data.forEach(doc => {
            const data = doc
            var create_at = moment(data.create_at.seconds * 1000).format("YYYY-MM-DD").toString();
            var month = moment(data.create_at.seconds * 1000).format("YYYY-MM").toString()
            var buyer_paid = parseInt((data.buyer_paid_amount) * 100) / 100

            //             if (thisMonth == month) {
            //                 monthCount.push(doc.id)
            //                 paidMonth.push(buyer_paid)
            //             }
            //             // console.log(create_at);
            //             sevenDay.forEach(function (val) {
            //                 if (create_at == val) {
            //                     // console.log("today: ", create_at);
            //                     sevenCount.push(doc.id)
            //                     paidSeven.push(buyer_paid)
            //                 }
            //             })

            if (create_at == moment(today).format("YYYY-MM-DD")) {
                // console.log("today: ", create_at);
                paidToday.push(buyer_paid)
                todayCount.push(doc.id)
            } else if (create_at == moment(yesterday).format("YYYY-MM-DD")) {
                // console.log("yesterday: ", create_at);
                yesterdayCount.push(doc.id)
                paidYesterday.push(buyer_paid)
            }
        })
        var sumToday = 0
        paidToday.forEach(function (num) {
            sumToday += num
        });
        console.log(sumToday.toLocaleString());
        $scope.sumToday = sumToday

        var sumYes = 0
        paidYesterday.forEach(function (num) {
            sumYes += num
        });
        $scope.sumYes = sumYes

        var sumSeven = 0
        paidSeven.forEach(function (num) {
            sumSeven += num
        });
        $scope.sumSeven = sumSeven

        var sumMonth = 0
        paidMonth.forEach(function (num) {
            sumMonth += num
        });


        $scope.sumMonth = sumMonth
        $scope.seven = sevenCount.length
        $scope.today = todayCount.length
        $scope.yesterday = yesterdayCount.length
        $scope.month = monthCount.length
        $scope.$apply()
        var newOrder
        var packedOrder
        newOrder = keys.data.filter(function (event) {
            return event.own_status.status == 1;
        }).length;
        shippedOrder = keys.data.filter(function (event) {
            return event.own_status.status == 5;
        }).length;

        var timer = setInterval(function () {
            if (newOrder > 0) {
                $scope.donutLabels = ["ĐƠN MỚI", "ĐƠN ĐÃ GỬI ĐI"];
                $scope.donutData = [newOrder, shippedOrder];
                $scope.$apply()
                clearInterval(timer)
            }
        }, 500)

    })




});