//
// cel-viewer, heatmap
//
// Usage example:
//   http://localhost/cel-viewer/view.html?
//         url=http://localhost/data/CEL/HeatmapData.json
//         &url=http://localhost/data/CEL/MAplotData.json


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

// fname is simple json data file converted
function loadBlobFromJsonFile(fname) {
  var tmp=ckExist(fname);
  var blob=(JSON.parse(tmp));
  return blob;
}

/*****MAIN*****/
jQuery(document).ready(function() {
  var args=document.location.href.split('?');
  if (args.length === 2) {
    var urls=processArgs(args);
    for(var i=0;i<urls.length;i++) {
      var blob=loadBlobFromJsonFile(urls[i]);
window.console.log("processing --",blob.meta.type);
      if(blob.meta.type == "heatmap") {
        convertCELBlobData(blob);
        addCELAllHistogram();
        addCELHeatmap();
        } else {
          setupColorMap();
          var blob=loadBlobFromJsonFile(urls[i]);
          convertMAplotBlobData(blob);
          addCELMAplot();
      }
    }
  } else {
window.console.log("humm...");
  }
})


function processArgs(args) {
  var urls=[];
  var url=null;;
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
    urls.push(url);
  }
  return urls;
}
