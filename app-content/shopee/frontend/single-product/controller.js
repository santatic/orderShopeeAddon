
app.controller("shopeeCtrl", ['$scope', 'moment',
    function ($scope, moment) {
        function httpGet(theUrl, headers) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            for (var i = 0; i < headers.length; i++) {
                xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
            }
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        }

        $(".shopee-modal__content").ready(function () {
            console.log("I showed up");
        });
        var timer
        var func = function () {
            if ($("div._3TtC8T").length > 0) {
                clearInterval(timer)
                // $("._3FzHnX").prepend("<button id='copy'>COPY IMAGE</button>")
                function getImg(){
                    var $divImg = $("._3FzHnX div._3TtC8T")
                    var Img = $divImg.css("background-image")
                    Img = Img.replace('url(', '').replace(')', '').replace(/\"/gi, "");
                    return Img.toString()
                } 
                
                var append = setInterval(function(){
                    if(getImg() !== "none"){
                        clearInterval(append)
                        $("._3FzHnX").append("<img id='img' width='100%' src='" + getImg() + "'>")
                    }
                },500)              
                

                $('._2ZLnVl').click(function () {
                    var last = getImg()
                    var timerImg = setInterval(function(){
                        $('img#img').attr('src', getImg())
                        if(getImg() !== last) clearInterval(timerImg)
                    },500)
                    setTimeout(function( ) { clearInterval( timerImg ); }, 5000);
                                     
                })
                var timer2 = setInterval(function () {
                    if ($("div._3TtC8T").length == 0) {
                        clearInterval(timer2)
                        timer = setInterval(func, 1000)
                    }
                })
                // console.log($(".shopee-modal__content"));
            }
        }
        timer = setInterval(func, 1000)

        $scope.item = {};
        $scope.init = function () {
            var regex = /\/.+i\.(\d+\.\d+)/g;
            var matchs = regex.exec(window.location.href);
            //console.log(matchs)       ;
            if (matchs !== null) {
                var shopid_itemid = matchs[1].split('.');

                $scope.item.itemid = shopid_itemid[1];
                $scope.item.shopid = shopid_itemid[0];
                console.log($scope.item.itemid);
                console.log($scope.item.shopid);
            }
        }
        $scope.init();

        var request = httpGet('https://shopee.vn/api/v1/item_detail/?item_id=' + $scope.item.itemid + '&shop_id=' + $scope.item.shopid, []);
        $scope.sold = request.sold
        console.log(request);
        // $scope.timeSubtract = function () {
        //     if (request.hasOwnProperty('ctime')) {
        //         return moment(request['ctime']*1000).fromNow();
        //     } else
        //         return 'loading';
        // }

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
        // $('._19OC6A').each(function () {
        //     var url = $(this).find('img').attr('src')
        //     var filename = url.replace(/.*\//g, "");
        //     console.log(filename);
        // })

        $scope.download_images = function () {
            var zip = new JSZip();
            var folderName = '';

            folderName = $scope.item.itemid + "-" + $scope.item.shopid;
            // console.log($scope.GLOBAL_FIRST_RESPONSE[$scope.item.itemid]);
            request.image_list.forEach(function (val) {
                var url = "https://cf.shopee.vn/file/" + val + "_tn"
                var filename = val
                zip.file(filename + '.jpg', $scope.urlToPromise(url), {
                    binary: true
                });
            })

            zip.generateAsync({
                type: "blob"
            }).then(function (zipFile) {
                saveAs(zipFile, folderName + '.zip');
            });



        }
    }
]);