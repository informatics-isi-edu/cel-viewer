//
// viewer-lines.js
//
// multiple lines, x,y,trace are all array of individual parts

function addLinePlot(_data,_layout) {
   savePlot=addAPlot('#myViewer',_data, _layout, {displaylogo: false});
}

function makeOne(xval,yval,trace,cval) {
  var marker_val = { size:10, color:cval};
  var t= { x:xval,
           y:yval, 
           name:trace, 
           marker: marker_val, 
           mode: "markers",
           type:"scatter" };
  return t;
}

function getLinesAt(x,y,trace,color) {
  var cnt=y.length;
  var data=[];
  for (var i=0;i<cnt; i++) {
    data.push(makeOne(x[i],y[i],trace[i],color[i])); 
  }
  return data;
}

function getLinesDefaultLayout(w,h){
  var p= {
        width: w,
        height: h,
        margin: { t:50, b:40 },
        showlegend: true,
        legend: { traceorder: 'reversed' },
        yaxis: { title: 'Intensity'},
        };
  return p;
}

/*********************************************/
