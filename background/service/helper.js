app.service('helper_center', function() {
    //lắng nghe 

    this.doesConnectionExist = function() {
        var xhr = new XMLHttpRequest();
        var file = "https://www.kirupa.com/blank.png";
        var randomNum = Math.round(Math.random() * 10000);
     
        xhr.open('HEAD', file + "?rand=" + randomNum, true);
        xhr.send();
         
        xhr.addEventListener("readystatechange", processRequest, false);
     
        function processRequest(e) {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 304) {
              alert("connection exists!");
            } else {
              alert("connection doesn't exist!");
            }
          }
        }
    }
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