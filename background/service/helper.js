app.service('helper_center', function() {
    //lắng nghe 
    // 
    this.checkUrlContainSubstring = function(url, arraySubstring){
        var bool = true
        arraySubstring.forEach(function(sub){
            if(url.indexOf(sub) == -1) {
                bool = false
            }
        })
        // console.log(url);
        return bool
    }

    this.httpGet = function httpGet(theUrl, headers) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        for (var i = 0; i < headers.length; i++) {
          xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
        }
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText);
      }

});