//
// viewer-lines.js
//
// multiple lines, x,y,trace are all array of individual parts

var saveLinePlot=null;
function addLinePlot(_data,_layout) {
   saveLinePlot=addAPlot('#myViewer',_data, _layout, {displaylogo: false});
}

function relayoutLinePlot(update) {
  relayoutAPlot(saveLinePlot,update);
}

function restyleLinePlot(update, target=null) {
  restyleAPlot(saveLinePlot,update,target);
}


function makeOne(xval,yval,cval) {
  var marker_val = { 
      size:10, symbol:'circle', color:cval, opacity: 0.6,
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
