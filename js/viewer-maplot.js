//
// cel-viewer, maplot
//
// Usage example:
//   http://localhost/cel-viewer/maplot.html?
//                   url=http://localhost/data/CEL/MAplotData.json

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
