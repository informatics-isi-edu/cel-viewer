//
// cel-viewer/viewer-user-maplot.js
//
// This is very user/dataset specific information
// for, USC

// input json format
// {
// "meta": {
//      "title": "10.5MndP 10.5MndD",
//      "config": { // from configIt.R } 
//         },
//  "data" : {
//      "blackPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] },
//      "otherPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..], "color":[...] },
//      "topPts": { "x": [ 10.317,..], "y": [ ...], "symbol":[..] }
//         }
// }

// blackPts
var inputXdata=null; 
var inputYdata=null; 
var inputGenes=null;
var inputTitle=null;

// topPts
var inputPXXdata=null; 
var inputPYYdata=null; 
var inputPGGenes=null;

var inputNXXdata=null; 
var inputNYYdata=null; 
var inputNGGenes=null;

var inputXlabel=null;
var inputYlabel=null;

var grTriColor= [ getColor(0), 'rgb(0,139,0)', 'rgb(139,0,0)' ];
var rgTriColor= [ getColor(0), 'rgb(139,0,0)', 'rgb(0,139,0)' ];

function initData() {
// blackPts
inputXdata=null;
inputYdata=null;
inputGenes=null;
inputTitle=null;

// topPts
inputPXXdata=null;
inputPYYdata=null;
inputPGGenes=null;

inputNXXdata=null;
inputNYYdata=null;
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

  var _inputXdata=inputXdata.slice(0,3000);
  var _inputYdata=inputYdata.slice(0,3000);

  var _x=[_inputXdata, inputPXXdata, inputNXXdata];
  var _y=[_inputYdata, inputPYYdata, inputNYYdata];
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



/** Change the displayed value for min, max and range when slider changes.
 @param event
 @param ui
 @param string slider: Selector for the slider element
 @param strign slider_min: Selector for the slider min label element
 @param strign slider_min: Selector for the slider max label element
 **/
function changeSliderInputs(event, ui, slider, slider_min, slider_max){
  var max=$(slider).slider("option","max"); // max value
  var min=$(slider).slider("option","min"); // min value
  var t=$(slider).slider("option","range"); // range value

  var _min, _max; // values to be shown as min and max.
  if(t === "max"){
    _max = checkMax(ui.values[0], max, min) ? max : "";
    _min = checkMin(ui.values[0], max, min) ? min : "";
    $(slider+' span.ui-slider-handle').attr('data-before', ui.values[0]);
  }else{
    _max = checkMax(ui.values[0], max, min) && checkMax(ui.values[1], max, min) ? max : "";
    _min = checkMin(ui.values[0], max, min) && checkMin(ui.values[1], max, min) ? min : "";

    $(slider+' span.ui-slider-handle:nth-of-type(1)').attr('data-before', ui.values[0]);
    $(slider+' span.ui-slider-handle:nth-of-type(2)').attr('data-before', ui.values[1]);
  }
  $(slider_min).text(_min);
  $(slider_max).text(_max);
}

/*Check the value to see if it's appropriate to show maximum value in slider or not*/
function checkMax(val, max, min){
  return (max-val)/(max-min) > 0.1;
}
/*Check the value to see if it's appropriate to show minimum value in slider or not*/
function checkMin(val, max, min){
  return (val-min)/(max-min) > 0.1;
}

function setupMAplotControl() {
  var _c = document.getElementById('maplotControlBlock');
  if(_c)
    _c.style.display = '';

  var _min=0;
  var _max=inputXdata.length;
  var _tmp=1;
  _max.toString(10).split("").reduce(function(tmp) {
       _tmp=_tmp*10;
  });
  var _step=_tmp/10;
  var _start=_min
  var _end=_start+(_step*3);
window.console.log(_start, " to ",_end);
  jQuery("#blackPts_slider").slider({
    min: _min,
    step: _step,
    max: _max,
    values: [_min, _max],
    change: function(event,ui) {
      changeSliderInputs(event, ui, "#blackPts_slider", "#sliderBlackPtsMin", "#sliderBlackPtsMax");
    },
    slide: function(event, ui){
      changeSliderInputs(event, ui, "#blackPts_slider", "#sliderBlackPtsMin", "#sliderBlackPtsMax");
    },
    stop:function(event,ui) {
        updateBlackPts(ui.values);
    },
    create:function(event,ui) {
        $("#sliderBlackPtsMin").text(_min);
        $("#sliderBlackPtsMax").text(_max);
    }
  });
  $("#blackPts_slider" ).slider( "option", "values", [_start,_end] );
}



function updateBlackPts(range) {
  var _newXdata=inputXdata.slice(range[0], range[1]); 
  var _newYdata=inputYdata.slice(range[0], range[1]); 
  var _update = {
    x:[_newXdata],
    y:[_newYdata],
  };
window.console.log("here..",_newXdata.length);
  restyleLinePlot(saveAMAplot,_update,[0]);
}

