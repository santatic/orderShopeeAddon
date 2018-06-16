app.controller("shopeeCtrl", ['$scope', 'moment',
    function ($scope, moment) {
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

        $scope.GLOBAL_FIRST_RESPONSE = {};
        $scope.timeSubtract = function () {
            if ($scope.GLOBAL_FIRST_RESPONSE.hasOwnProperty($scope.item.itemid)) {
                return moment($scope.GLOBAL_FIRST_RESPONSE[$scope.item.itemid]['createdTime']).fromNow();
            } else
                return 'loading';
        }

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
        $('._19OC6A').each(function () {
            var url = $(this).find('img').attr('src')
            var filename = url.replace(/.*\//g, "");
            console.log(filename);
        })

        $scope.download_images = function () {
            var zip = new JSZip();
            var folderName = '';

            folderName = $scope.item.itemid;
            // console.log($scope.GLOBAL_FIRST_RESPONSE[$scope.item.itemid]);
            if ($('._19OC6A') !== 0) {

                $('._19OC6A').each(function () {
                    var url = $(this).find('img').attr('src')
                    var filename = url.replace(/.*\//g, "");
                    zip.file(filename + '.jpg', $scope.urlToPromise(url), {
                        binary: true
                    });
                });
            } else
                new Noty({
                    layout: 'center',
                    type: 'success',
                    text: 'Bạn phải chờ trang load xong đã'
                }).show();

            zip.generateAsync({
                type: "blob"
            }).then(function (zipFile) {
                saveAs(zipFile, folderName + '.zip');
            });



        }
    }
]);