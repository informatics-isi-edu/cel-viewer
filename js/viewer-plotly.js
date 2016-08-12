//
//  viewer-plotly.js
//

var PLOT_WIDTH=600;
var PLOT_HEIGHT=600;

function getScatterSetAt(xkey, ykey) {
  var x=getData(xkey);
  var y=getData(ykey);
  var data= [ { "x": x,
                "y": y,
                "mode": "markers",
                "marker": {
                    "color": "green",
                    "size": 10,
                    "line": {"color": "black", "width": 3},
                    "opacity": 0.7
                  },
                "type":"scatter" } ];
  return data;
}

function getScatterSetDefaultLayout(xkey,ykey,xrange,yrange){
  var tmpx, tmpy;
  if(xrange && yrange) {
    tmpx= { "title":xkey+"(log)", "type":"log", "range": xrange };
    tmpy= { "title":ykey+"(log)", "type":"log", "range": yrange };
    } else {
      tmpx= { "title":xkey+"(log)", "type":"log" };
      tmpy= { "title":ykey+"(log)", "type":"log" };
//      tmpx= { "title":xkey+"(log)"};
//      tmpy= { "title":ykey+"(log)"};
  }
  var p= {
      "width": PLOT_WIDTH,
      "height": PLOT_HEIGHT,
      "plot_bgcolor": 'rgb(223, 223, 223)',
      "xaxis": tmpx,
      "yaxis": tmpy
      };
  return p;
}


//https://plot.ly/javascript/2d-density-plots/
function getMixedSetAt(xkey, ykey) {
  var x=getData(xkey);
  var y=getData(ykey);
  var data= [ { "x": x,
                "y": y,
                "name": "points",
                "mode": "markers",
                "marker": {
                    "color": "green",
                    "size": 5,
                    "line": {"color": "black", "width": 1},
                    "opacity": 0.4
                },
                "type":"scatter" },
              { "x": x,
                "y": y,
                "name": "points",
                "ncontours": 20,
                "colorscale": "Hot",
                "reversescale": true,
                "showscale": false,
                "type": "histogram2dcontour" },
              { "x": x,
                "name": "x count",
                 "marker": { "color": "blue"},
                 "yaxis": "y2",
                 "type": "histogram" },
              { "y": y,
                "name": "y count",
                 "marker": { "color": "red"},
                 "xaxis": "x2",
                 "type": "histogram" }
          ];
  return data;
}

function getMixedSetDefaultLayout(xkey,ykey,xrange,yrange,xrange2,yrange2){
  var tmpx, tmpy, tmpx2, tmpy2;
  if(xrange) {
    tmpx= { "domain": [0, 0.85], "showgrid": true, "title": xkey,
              "range": xrange, "autorange":false, "zeroline": false };
    } else {
      tmpx= { "domain": [0, 0.85], "showgrid": true, "title": xkey,
              "zeroline": false };
  }
  if(yrange) {
    tmpy= { "domain": [0, 0.85], "showgrid": true, "title": ykey,
              "range": yrange,"autorange":false, "zeroline": false };
    } else {
      tmpy= { "domain": [0, 0.85], "showgrid": true, "title": ykey,
               "zeroline": false };
  }
  if(xrange2) {
    tmpx2 = { "domain": [0.85, 1], "showgrid": false,
              "range": xrange2, "autorange":false, "zeroline": false };
    } else {
      tmpx2 = { "domain": [0.85, 1], "showgrid": false, "zeroline": false };
  }

  if(yrange2) {
    tmpy2= { "domain": [0.85, 1], "showgrid": false,
              "range": yrange2, "autorange":false, "zeroline": false };
    } else {
      tmpy2= { "domain": [0.85, 1], "showgrid": false, "zeroline": false };
  }
  var p= {
      "width": PLOT_WIDTH,
      "height": PLOT_HEIGHT,
      "plot_bgcolor": 'rgb(223, 223, 223)',
      "showlegend": false,
      "autosize": false,
      "margin": {"t": 100},
      "hovermode": "closest",
      "bargap": 0.2,
      "xaxis": tmpx,
      "yaxis": tmpy,
      "xaxis2": tmpx2,
      "yaxis2": tmpy2
  };
  return p;
}

// fname is plotly.js data json file
// including 'data' part and 'layout' part
//{
//  "data": [ { "x": [ 73.51636505, 17.98786163,..],"y": ],
//  "layout": { "title":.. }
//}
function loadPlotlyDataFromFile(fname) {
  var tmp=ckExist(fname);
  var blob=(JSON.parse(tmp));
  var d = blob ['data'];
  var p = blob ['layout'];
  return [d, p];
}

function addAPlot(divname, data, layout, w, h) {
  var d3 = Plotly.d3;
  var gd3 = d3.select(divname)
    .append('div')
    .style({
        width: w,
        height: h,
        visibility: 'inherit'
    });

  var gd = gd3.node();
  Plotly.newPlot(gd, data, layout);
  return gd;
// Plotly.newPlot(divname, data, layout);
}

function relayoutAPlot(gd, update) {
  Plotly.relayout(gd,update);
}

function restyleAPlot(gd, update, target) {
  Plotly.restyle(gd,update, target);
}


function getData(key) {
  var vals = Object.values(inputData[key]);
  var first=vals.shift(); // skip the first one
  var fvals= vals.map(function(v) { return parseFloat(v); } );
  return fvals;
}

// scatter
function addTwoD(keyX,keyY) {
  var _data=getScatterSetAt(keyX, keyY);

  var _layout=getScatterSetDefaultLayout(keyX,keyY,null,null);
  var saveScatterPlot=addAPlot('#myViewer',_data, _layout, PLOT_WIDTH,PLOT_HEIGHT);
}

// scatter with histogram subplots
function addMixed(keyX, keyY) {
  var _data=getMixedSetAt(keyX, keyY);

  var _layout=getMixedSetDefaultLayout(keyX, keyY,null,null);
  var saveMixPlot=addAPlot('#myViewer',_data, _layout, PLOT_WIDTH, PLOT_HEIGHT);
}
