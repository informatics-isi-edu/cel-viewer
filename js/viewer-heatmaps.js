//
// viewer-heatmaps.js
// 
// zval is a matrix, [ [...][...][...] ]
//

function addHeatmapPlot(_data,_layout) {
   savePlot=addAPlot('#myViewer',_data, _layout, {displaylogo: false});
}

function getHeatmapsAt(zval,xlabel,ylabel,cval) {
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

function getHeatmapsDefaultLayout(w,h){
  var p= {
        width: w,
        height: h 
        };
  return p;
}

