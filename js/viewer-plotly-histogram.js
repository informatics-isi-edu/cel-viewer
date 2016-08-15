//
//  viewer-histograms.js
//


function addHistogramPlot(_data,_layout) {
   savePlot=addAPlot('#myViewer',_data, _layout, {displaylogo: false});
}

function getHistogramAt(x, color) {
  var data= [ { "x": x,
                "marker": {
                  "color":color,
                },
                "type" :"histogram" } ];
  return data;
}

function getHistogramDefaultLayout(w,h,xtitle,range){
  var tmp;
  if(range) {
    tmp= { "title":xtitle, "range": range };
    } else {
      tmp= { "title":xtitle };
  }
  var p= {
        "width": w,
        "height": h,
        "bargap": 0.2,
        "xaxis": tmp,
        "yaxis": { "title":"count"} ,
        };
  return p;
}

