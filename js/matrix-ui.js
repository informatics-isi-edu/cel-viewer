//
// cel-viewer, server.html
//  causes R script to be called to generate the 2 json
//  data files for cel-viewer 
//
// Usage example:
//   https://localhost/cel-viewer/matrix.html?
//         url=https://localhost/data/CEL/PLOTS/usc/plot-list.json
//

var plotDataPath=null; // usually where the json file is
function chopPath(_url)
{
  var _a = document.createElement("a");
  _a.href = _url;
  var _path=_a.pathname;
// in IE case, path does not have leading '/'
  if(_path[0] != '/')
    _path="/"+_path;
  var _i= _path.lastIndexOf("/");
window.console.log(_path);
window.console.log(_i);
  if(_i) {
    _path=_path.substr(0,_i+1);
  }
  window.console.log("_path is", _path);
  return _path;
};

/*****MAIN*****/
jQuery(document).ready(function() {
  setupMatrixTable();
  //grab the data location
  var args=document.location.href.split('?');
//  var localhref=args[0];
//  window.console.log("localhref is...",localhref);
  if (args.length === 2) {
    var _urls=processArgs(args);
    for(var i=0; i<_urls.length; i++) {
      var _url=_urls[i];
      var _blob=loadBlobFromJsonFile(_url);
      plotDataPath=chopPath(_url); 
      var _blist=_blob.list;
      for(var j=0; j<_blist.length; j++) {
         var _c=_blist[j].col;
         var _r=_blist[j].row;
         var _cc = labeltbl[_c]; 
         var _rr= labeltbl[_r];
         replaceCell(_cc,_rr);
      }
    }
    } else {
      window.console.log("no data location??");
  }
})

function _makeCellId(cLabel,rLabel) {
  var _id=cLabel+'_'+rLabel+'_c';
  return _id;
}
function _makeColId(cLabel) {
  var _id=cLabel+"_h";
  return _id;
}
function _makeRowId(rLabel) {
  var _id=rLabel+"_r";
  return _id;
}

function _makeHeader(cLabel) {
  var _name=_makeColId(cLabel);
  var _h='<th class="text-center rotate"> <div class="head-div col-head" id="'+_name+'" title="'+cLabel+'" >'+cLabel+'</div></th>';
  return _h;
}

function _makeEmptyCell(cLabel,rLabel) {
  var _name=_makeCellId(cLabel,rLabel);
//window.console.log("making cell's id..",_name);
  var _c= '<td id="'+_name+'">&nbsp;</td>';
  return _c;
}

function _makeRow(rLabel) {
  var _name=_makeRowId(rLabel);
  var _labels=selectLabel;
  var _rlist='<th class="row-header head-div" id="'+_name+'" title="'+rLabel+'" >'+rLabel+'</div></th>';
  for(var i=0;i<_labels.length;i++) {
    var _c=_makeEmptyCell(_labels[i], rLabel);
    _rlist += _c;
  }
  return "<tr>"+_rlist+"</tr>";
}

function setupMatrixTableBody() { 
  var _labels=selectLabel;
  var _rlist="";
  for(var i=0; i<_labels.length;i++) {
   var _r=_makeRow(_labels[i]);
   _rlist += _r;
  }
  return _rlist;
}

function setupMatrixTable() {
  var _htbl = document.getElementById('matrixTableHeader');
  var _h=setupMatrixTableHeader();
  _htbl.innerHTML = _h;

  var _btbl = document.getElementById('matrixTableBody');
  var _b=setupMatrixTableBody();
  _btbl.innerHTML = _b;
}

function setupMatrixTableHeader() {
  var _labels=selectLabel;
  var _mheader = document.getElementById('matrixTableHeader');
  // add an empty, <th class="rotate">&nbsp;</th>
  var _hlist='<th class="rotate">&nbsp;</th>';
  for(var i=0;i<_labels.length; i++) {
    var _l=_labels[i];
    var _h=_makeHeader(_l);
    _hlist=_hlist+_h;
  }
  return '<tr class="feature">'+_hlist+'</tr>';
}

// E10.5_Mnd_P into 10.5MndP
function shortName(name) {
  var _s;
  if(name[0]=='E') {
    _s = name.substr(1);
  }
  _s=_s.replace(/_/g,"");  
  return _s;
}

function cellModal(cLabel, rLabel) {
  var _title=cLabel+" + "+rLabel;
  var _c = shortName(cLabel);
  var _r = shortName(rLabel);
  var _dirpath = plotDataPath+_c+'_'+_r;
  var _datapath='view.html?data='+_dirpath+'/MAplotData.json';
  var _datapath2='view.html?data='+_dirpath+'/HeatmapData.json';

  var _c='<div class="exp-div" data-toggle="modal" title="'+_title+
		   '" data-target="#exp-modal" >';
      _c += '<div class="two-exp exp-color-1"></div> <div class="two-exp exp-color-8"></div> <div class="modal-content">';
      _c += '<h5> <a target="_blank" href="'+_datapath+'"> MAplot </a> </h5>';
      _c += '<h5> <a target="_blank" href="'+_datapath2+'"> Heatmap </a> </h5>';
      _c += ' </div> </div>';
      return _c;
}

function replaceCell(cLabel,rLabel) {
  var _id=_makeCellId(cLabel,rLabel);
  var _cell = document.getElementById(_id);
  if(_cell) {
    var _n=cellModal(cLabel, rLabel);
    _cell.innerHTML = _n;
  }
}

