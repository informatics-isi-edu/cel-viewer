//
// viewer-plotly-heatmaps.js
// 
// zval is a matrix, [ [...][...][...] ]
//

function addHeatmapPlot(_data,_layout) {
   var _w=_layout.width;
   var _h=_layout.height;
   var aPlot=addAPlot('#myViewer',_data, _layout,_w,_h, {displaylogo: false});
   return aPlot;
}

function removeHeatmapPlot() {
   $('#myViewer').empty();
}

function relayoutHeatmapPlot(aHeatmapPlot,update) {
  relayoutAPlot(aHeatmapPlot,update);
}

function restyleHeatmapPlot(aHeatmapPlot, update, target) {
  restyleAPlot(aHeatmapPlot,update,target);
}



function getHeatmapAt(zval,xlabel,ylabel,cval) {
  var maxList=[];
  var minList=[];
  zval.forEach(function(arr) {
      maxList.push(Math.max(...arr));
      minList.push(Math.min(...arr));
  });
  var _max=Math.max(...maxList);
  var _min=Math.min(...minList);
  
  var t= [{ z: zval,
            x: xlabel,
            y: ylabel,
            zmin: _min,
            zmax: _max,
            colorbar: { tickangle: -90 },
            colorscale: cval,
//           type:"contour" }];
           type:"heatmap" }];
  return t;
}

function getHeatmapDefaultLayout(w,h){
  var p= {
        width: w,
        height: h,
        margin:{
          b:150,
       }
//        xaxis: { tickangle: 30 }

        };
  return p;
}

