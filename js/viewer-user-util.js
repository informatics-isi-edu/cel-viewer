//
// viewer-user-util.js
//
// this mainly is to process the config that is
// specific to this dataset and derive the necessary
// information for decorating the plots with

// basically taking config structure and create
// main label 
// value for one, two 

function config2foldType(config) {
  var _clog=config.log;
  var _tmp;
  if(_clog ==1) {
    _tmp="Log2 Fold Change";
    } else {
      _tmp="Fold Change";
  }
  return _tmp;
}

function config2mainTitle(config) {
  var _sel= config.sel;
  var _tmp=_sel.toString();
  _tmp=_tmp.replace(",","  ");
  return _tmp;
}

function config2exprLabel(config) {
  var _tmp="Average Expression";
  return _tmp;
}

function config2oneAndTwo(config) {
  var _comp=config.comp;
  var _tmp=null;
  if(_comp == 'place') { //(distal vs. proximal)
    if(config.invert_place == 'inverted') {
      _tmp=["distal", "proximal"];
      } else {
        _tmp=["proximal", "distal"];
    }
  } else if (_comp=='bone') { //(maxilla vs. mandible)
    if(config.invert_bone == 'inverted') {
      _tmp=["mandible", "maxilla"]; 
      } else {
        _tmp=["maxilla", "mandible"];
    }
  } else if (_comp=='age') { //eg. E10.5 vs. E11.5
     var _sel=config.sel; //
     var _tmp=[];
     for(var i=0;i<_sel.length; i++) {
       var _t=sel[i];
       _t=_t.substr(1,3);
       window.console.log(_t);
       var _n=parseFloat(_t);
       _tmp.push(_n);
     }
     var _max=Math.max(_tmp);
     var _min=Math.min(_tmp);
     if(_max == _min) 
       _min=10.5;
     _tmp=[ 'E'+_min.toString(), 'E'+_max.toString()]
  } else {
window.console.log("bad config2oneAndTwo");
  }
window.console.log(_tmp.toString());
  return _tmp;
}

// "proximal               Log2 Fold Change               distal",
function config2foldLabel(config) {
   var _s="          ";
   var _r=config2oneAndTwo(config);
   var _m=config2foldType(config);
   var _tmp=_r[0]+_s+_m+_s+_r[1];       
   return _tmp;
}
