//
// cel-viewer, heatmap
//
// Usage example:
//   http://localhost/cel-viewer/heatmap.html?
//                   url=http://localhost/data/CEL/HeatmapData.json

/*****MAIN*****/
jQuery(document).ready(function() {
  var args=document.location.href.split('?');
  if (args.length === 2) {
    var url=processArgs(args);
    window.console.log("got this url for arg..",url);
    var blob=loadBlobFromJsonFile(url);
    convertCELBlobData(blob);
    addCELAllHistogram();
    addCELHeatmap();
  } else {
window.console.log("humm...");
  }
})


