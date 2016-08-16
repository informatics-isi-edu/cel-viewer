//
//  viewer-plotly-histogram.js
//


function addHistogramPlot(_data,_layout) {
  var aPlot=addAPlot('#myViewer',_data, _layout, {displaylogo: false});
  return aPlot;
}

function getHistogramAt(x, color) {
  var data= [ { "x": x,
                "marker": {
                  "color":color,
                },
                "type" :"histogram" } ];
  return data;
}

function getHistogramDefaultLayout(w,h,xtitle,ytitle,range){
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
        "yaxis": { "title": ytitle },
        };
  return p;
}

// x is an array of x-sets,
// color is an array of color-set
function getHistogramsAt(x, color) {
  var cnt=x.length;
  var tset=[];
  for(var i=0; i<cnt; i++) {
    var trace= { "x": x[i],
                  "marker": {
                  "color":color[i],
                  },
                  "type" :"histogram" };

    tset.push(trace);
  }
  return tset;
}

function getHistogramsDefaultLayout(w,h,xtitle,ytitle,range){
  var tmp;
  if(range) {
    tmp= { title:xtitle, range: range };
    } else {
      tmp= { title:xtitle };
  }
  var p= {
        width: w,
        height: h,
        bargap: 0.2,
        showlegend: false,
        barmode: "overlay",
        xaxis: tmp,
        yaxis: { "title": ytitle } ,
        };
  return p;
}

