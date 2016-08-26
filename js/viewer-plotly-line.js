//
// viewer-plotly-lines.js
//
// multiple lines, x,y,trace are all array of individual parts

function addLinePlot(_data,_layout) {
   var _w=_layout.width;
   var _h=_layout.height;
   var aLinePlot=addAPlot('#myViewer',_data, _layout, _w,_h, {displaylogo: false});
   return aLinePlot;
}

function removeLinePlotTrace(aLinePlot,trace_id) {
  var _data=aLinePlot.data;
  if(_data.length <= trace_id) {
    // no special gene trace in there.
    } else {
      Plotly.deleteTraces(aLinePlot, trace_id); //start with 0
  }
}

// for highlighted circles
function addLinePlotTrace(aLinePlot,x,y,color,trace_id) {
//Plotly.addTraces(graphDiv, {y: [2,1,2]});
  var update=makeOne(x,y,color);
  update.mode="markers+text"; 
  update.marker.opacity=1;
  update.marker.size=10;
  update.marker.line.width=2;
  Plotly.addTraces(aLinePlot, update, [trace_id])
}

function relayoutLinePlot(aLinePlot,update) {
  relayoutAPlot(aLinePlot,update);
}

function restyleLinePlot(aLinePlot, update, target) {
  restyleAPlot(aLinePlot,update,target);
}


function makeOne(xval,yval,cval) {
  var marker_val = { 
      size:8, symbol:'circle', color:cval, opacity: 0.8,
      line: {color: "black", width: 1}
      };

  var t= { x:xval,
           y:yval, 
           marker: marker_val, 
           mode: "markers",
           showlegend: false,
           type:"scatter" };
  return t;
}

// trace and text is matching
function getLinesAt(x,y,color) {
  var cnt=y.length;
  var data=[];
  for (var i=0;i<cnt; i++) {
    data.push(makeOne(x[i],y[i],color[i])); 
  }
  return data;
}

function getLinesDefaultLayout(w,h) {
  var p= {
        width: w,
        height: h,
        margin: { t:50, b:40 },
        showlegend: true,
        legend: { traceorder: 'reversed' }
        };
  return p;
}

/*********************************************/
