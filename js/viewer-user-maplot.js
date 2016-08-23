//
// cel-viewer/viewer-user-maplot.js
//
// This is very user/dataset specific information
// for, USC

// input json format
// {
// "meta": {
//      "title": "10.5MndP 10.5MndD",
//      "xlabel": "Average Expression",
//      "ylabel": "proximal               Log2 Fold Change               distal", 
//      "config": { // from configIt.R } 
//         },
//  "data" : {
//      "blackPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] },
//      "otherPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..], "color":[...] },
//      "topPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] }
//         }
// }

// blackPts
var inputXData=null; 
var inputYData=null; 
var inputGenes=null;
var inputTitle=null;

// topPts
var inputPXXData=null; 
var inputPYYData=null; 
var inputPGGenes=null;

var inputNXXData=null; 
var inputNYYData=null; 
var inputNGGenes=null;

var inputXlabel=null;
var inputYlabel=null;

var grTriColor= [ getColor(0), 'rgb(0,139,0)', 'rgb(139,0,0)' ];
var rgTriColor= [ getColor(0), 'rgb(139,0,0)', 'rgb(0,139,0)' ];

function initData() {
// blackPts
inputXData=null;
inputYData=null;
inputGenes=null;
inputTitle=null;

// topPts
inputPXXData=null;
inputPYYData=null;
inputPGGenes=null;

inputNXXData=null;
inputNYYData=null;
inputNGGenes=null;

inputXlabel=null;
inputYlabel=null;
}

// blob is in json blob
function convertMAplotBlobData(blob) {
  initData();
  var _meta=blob.meta;
  var _config=_meta.config;

  inputTitle=config2mainTitle(_config);
  inputXlabel=config2exprLabel(_config);
  inputYlabel=config2foldLabel(_config);

  var blackPts=blob.data.blackPts;
  inputGenes=blackPts.symbol;
  var t=blackPts.x
  var tt=floatValue(t);
  inputXdata=tt;
  t=blackPts.y
  tt=floatValue(t);
  inputYdata=tt;

// need to group topPts to two sets
// positive y and negative y
  var topPts=blob.data.topPts;
  var inputGGenes=topPts.symbol;
  t=topPts.x
  tt=floatValue(t);
  var inputXXdata=tt;
  t=topPts.y
  tt=floatValue(t);
  var inputYYdata=tt;

  inputPXXdata=[];
  inputPYYdata=[];
  inputPGGenes=[];
  inputNXXdata=[];
  inputNYYdata=[];
  inputNGGenes=[];
  for(var i=0;i < inputXXdata.length; i++) {
    if(inputYYdata[i] < 0) {
      inputNYYdata.push(inputYYdata[i]);
      inputNXXdata.push(inputXXdata[i]);
      inputNGGenes.push(inputGGenes[i]);
      } else {
        inputPYYdata.push(inputYYdata[i]);
        inputPXXdata.push(inputXXdata[i]);
        inputPGGenes.push(inputGGenes[i]);
    }
  }
}

function addCELMAplot() {
  var _xlabel=inputXlabel;
  var _ylabel=inputYlabel;
  var _title=inputTitle;
  var _x=[inputXdata, inputPXXdata, inputNXXdata];
  var _y=[inputYdata, inputPYYdata, inputNYYdata];
  var _colors=grTriColor;
  var _text=[inputPGGenes, inputNGGenes];


  var _yabs=absValue(inputYdata);
  var _max=Math.max.apply(null,_yabs);
  var _ymin=_max *(-1.20);
  var _ymax=_max *(1.20);
  var _xmax=Math.max.apply(null,inputXdata);
  var _xmin=Math.min.apply(null,inputXdata);
  var _delta=Math.abs((_xmax - _xmin) *0.10);
  _xmin=_xmin - _delta;
  _xmax=_xmax + _delta;

  var _data=getLinesAt(_x, _y, _colors);
  for(var i=0; i<_x.length;i++) {
    _data[i].name="";
  }
  var _layout=getLinesDefaultLayout(1000, 400);
  _layout.hovermode="closest";
  var _aPlot=addLinePlot(_data,_layout);
  addRestyleChangesLinePlot(_aPlot,_text, [1,2]);
  addLayoutChangesLinePlot(_aPlot,_title, _xmin, _xmax, _xlabel, [_xmin,_xmax],
                      2, -2, _ylabel, [_ymin,_ymax]);
  return _aPlot;
}

function addRestyleChangesLinePlot(_aPlot,_text, target) {
  var _update = {
    text:_text,
    textfont : { family:'Times New Roman' },
    textposition: ['top center','bottom center'],
    mode: [ 'markers+text', 'markers+text' ],
  }
  restyleLinePlot(_aPlot,_update,target);
}

function addLayoutChangesLinePlot(_aPlot,_title,_x0,_x1,xtitle,xrange,_y0,_y1,ytitle,yrange) {
  var _update = {
     title: _title,
     xaxis: { title: xtitle, range:xrange},
     yaxis: { title: ytitle, range:yrange},
     shapes: [{ type: 'rect',
              xref: 'x',
              yref: 'y',
              x0: _x0,
              x1: _x1, 
              y0: _y0,
              y1: _y1,
              fillcolor: '#d3d3d3',
              opacity: 0.3,
              line: { width: 1 }
              }]
      };
  relayoutLinePlot(_aPlot,_update);
}

