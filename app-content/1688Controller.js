app.controller("1688Ctrl", ['$scope', 'moment',
  function($scope, moment) {
   
    
    $scope.urlToPromise = function(url) {
        return new Promise(function(resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    // chưa xử lý trường hợp thông báo lỗi khi rớt mạng không thể download
    $scope.download_images = function(){
        var zip = new JSZip();
        var folderName = '';

        folderName = $('meta[name="b2c_auction"]').attr('content');
        var zip = new JSZip(); 
        // var count
        $('img[src$="32x32.jpg"]').each(function (index){
            var originalImageURL = $(this).attr('src').replace('32x32.', '');
            var filename = originalImageURL.replace(/.*\//g, "");
            zip.file(folderName + '/classify/' + filename, $scope.urlToPromise(originalImageURL), {binary:true});
            //console.log();
        });        
        $('img[src$="60x60.jpg"],img[src$="400x400.jpg"]').each(function (index){
            var originalImageURL = $(this).attr('src').replace('60x60.', '').replace('400x400.', '');
            var filename = originalImageURL.replace(/.*\//g, "");
            zip.file(folderName + '/main/' + filename, $scope.urlToPromise(originalImageURL), {binary:true});
            //console.log();
        });
        $('img[src$=".jpg"]').not('[src$="32x32.jpg"],[src$="60x60.jpg"],[src$="400x400.jpg"]').each(function (index){
            // var originalImageURL = ;
            var filename = $(this).attr('src').replace(/.*\//g, "");
            zip.file(folderName + '/' + filename, $scope.urlToPromise($(this).attr('src')), {binary:true});
            //console.log();
        });
        zip.generateAsync({type:"blob"}).then(function (zipFile) {
          saveAs(zipFile, folderName + '.zip');
        });   
    }
  }]
);
