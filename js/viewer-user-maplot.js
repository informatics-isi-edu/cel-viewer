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
//      "ylabel": "proximal               Log2 Fold Change               distal" 
//         },
//  "data" : {
//      "blackPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] },
//      "otherPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..], "color":[...] },
//      "topPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] }
//         }
// }

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
  inputXlabel=blob.meta.xlabel;
  inputYlabel=blob.meta.ylabel;
  inputTitle=blob.meta.title;
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

/* --> in csv format
    ""     X   Y
    gene1
    gene2
*/
function convertMAplotData(iData) {
  var _data=transpose(iData);
  var gData=[]; // columnnames
  var xData=[];
  var yData=[];
  var sz=_data.length;
  for(var i=0; i<sz; i++) {
     var t=_data[i]; // Arrays
     var tmp=t.shift();
     if(tmp === "") {  // grab column names
       gData=t;
       continue;
       } else { // regular row, rowname, and data..
         var tt=floatValue(t);
         if(tmp === "X") { 
            xData=tt;
            } else {
              yData=tt;
         }
     }
  }
  return { 'genes':gData, 'x':xData, 'y':yData };
}


function addCELMAplot() {
  var _xlabel=inputXlabel;
  var _ylabel=inputYlabel;
  var _title=inputTitle;
  var _x=[inputXdata, inputPXXdata, inputNXXdata];
  var _y=[inputYdata, inputPYYdata, inputNYYdata];
  var _colors=[getColor(0), getColor(1), getColor(3)];
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
  var _layout=getLinesDefaultLayout(1000, 500);
  addLinePlot(_data,_layout);
  addRestyleChanges(_text, [1,2]);
  addLayoutChanges(_title, _xmin, _xmax, _xlabel, [_xmin,_xmax],
                      2, -2, _ylabel, [_ymin,_ymax]);
}

function addRestyleChanges(_text, target) {
  var _update = {
    text:_text,
    textfont : { family:'Times New Roman' },
    textposition: ['top center','bottom center'],
    mode: [ 'markers+text', 'markers+text' ]
  }
  restyleLinePlot(_update,target);
}

function addLayoutChanges(_title,_x0,_x1,xtitle,xrange,_y0,_y1,ytitle,yrange) {
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
  relayoutLinePlot(_update);
}

