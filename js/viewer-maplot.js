//
// cel-viewer, maplot
//
// Usage example:
//   http://localhost/cel-viewer/maplot.html?
//                   url=http://localhost/data/CEL/newMAplotData.json


// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
// okay
//      window.console.log("okay in readyState..");
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
};

// for sure that it is X.json
function chopForStub(url){
  var s=url.split('/').pop();
  var ss=s.slice(0, -5);
  return ss;
}

/*****MAIN*****/
jQuery(document).ready(function() {
  var args=document.location.href.split('?');
  if (args.length === 2) {
     setupColorMap();
     var url=processArgs(args);
     var blob=loadBlobFromJsonFile(url);
     convertMAplotBlobData(blob);
     addCELMAplot();
  } else {
window.console.log("humm...");
  }
})


function processArgs(args) {
  var url="";
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      url=param.replace(new RegExp('/$'),'').trim();
      } else {
        var kvp = param.split('=');
        switch (kvp[0].trim()) {
          case 'url':
            {
             url=kvp[1].replace(new RegExp('/$'),'').trim();
             break;
             }
          default:
             {
window.console.log("bad arg..",kvp[0].trim());
             }
       }
    }
  }
  return url;
}
