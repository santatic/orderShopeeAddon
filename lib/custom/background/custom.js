function httpGet(theUrl, headers)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    for(var i=0; i<headers.length; i++){
        xmlHttp.setRequestHeader(headers[i][0], headers[i][1]);
    }
    xmlHttp.send( null );
    return xmlHttp.responseText;
}