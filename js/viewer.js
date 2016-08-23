//
// cel-viewer, heatmap
//
// Usage example:
//   http://localhost/cel-viewer/view.html?
//         url=http://localhost/data/CEL/HeatmapData.json
//         &url=http://localhost/data/CEL/MAplotData.json

var saveAHeatmapPlot=null;
var saveAMAplot=null;

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
        saveAHeatmapPlot=addCELHeatmap();
        setupHeatmapControl();
        } else {
          setupColorMap();
          var blob=loadBlobFromJsonFile(urls[i]);
          convertMAplotBlobData(blob);
          saveAMAplot=addCELMAplot();
      }
    }
  } else {
window.console.log("humm...");
  }
})


