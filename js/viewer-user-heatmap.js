//
// cel-viewer/viewer-user-heatmap.js
//
// This is very user/dataset specific information
// for, USC


var inputData=[]; // this is in Matrix format [[..][..][..]]
var inputSamples=[];
var inputGenes=null;

var outputXlabel=null;
var outputYlabel=null;
var genesAt=null;

var orderedLeaf=[];
var orderedXlabel=[];
var orderedYlabel=[];
var tmpLabel=[];

    // red to black to green
var celColor= [ [0, 'rgb(255,0,0)'],
                 [0.3, 'rgb(100,0,0)'],
                 [0.5, 'rgb(0,0,0)'],
                 [0.7, 'rgb(0,100,0)'],
                 [1, 'rgb(0,255,0)'] ];

var grColor= [ 'rgb(0,139,0)', 'rgb(139,0,0)'];
var rgColor= [ 'rgb(139,0,0)', 'rgb(0,139,0)' ];

var withContour=false;

// json blob format
//{
// "meta": {
// "type": "heatmap" 
//},
//"data": {
//"symbol": [...],
//"probeset": [ ...],
//"samples": [{ "name":"10.5M.", "data":[...]},
//            { "name":"... } ]
//}}

function initData() {
  inputGenes=null;
  inputData=[];
  inputSamples=[];
  genesAt='horizontal';
  outputXlabel=null;
  outputYlabel=null;
  withContour=false;
}

// not really in use
function loadHeatmapCSVFromFile(url) {
  var tmp=ckExist(url);
  var data=$.csv.toArrays(tmp);
  var r=convertCELData(data);
  inputSamples=r.samples;
  inputGenes=r.genes;
  inputData=r.data;
  genesAt=r.type;
// althouth gene in input is in horizontal, the data is transposed and so
// the x axis is actually the samples while gene is at y axis
  if (genesAt == 'horizontal') {
    outputYlabel=inputGenes;
    outputXlabel=inputSamples;
    } else {
    outputYlabel=inputSamples;
    outputXlabel=inputGenes;
  }

  window.console.log("samples are..",inputSamples);
  window.console.log("genes are..", inputGenes);
}

// blob is in json blob
function convertCELBlobData(blob) {
  initData();
  var heatmap=blob.data;
  inputGenes=heatmap.symbol;

  var slist=heatmap.samples;
  var keys=Object.keys(slist);
  var cnt=keys.length;
  for(var i=0; i<cnt; i++) {
     var s=slist[i];
     var sname=s.name;
     var data=s.data;
     window.console.log(sname);
     window.console.log(data);
     inputSamples.push(sname);
     inputData.push(data);
     // transpose it
  }
  genesAt='vertical';
  fixValue(inputGenes);
  outputXlabel=inputGenes;
  outputYlabel=inputSamples;
}


// csv format, return 
//     samples
//     genes
//     2D array of data
// input format,
//    TYPE: A
//     ""      gene1 gene2
//     sample1 ...
//     sample2 ...
//    TYPE: B
//     ""      sample1 sample2
//     gene1
//     gene2
//

function convertCELData(iData) {
  var rData=[]; // rownames
  var cData=[]; // columnnames
  var oData=[];
  var sz=iData.length;
  for(var i=0; i<sz; i++) {
     var t=iData[i]; // Arrays
     var tmp=t.shift();
     if(tmp === "") {  // grab column names
     // skip this one
       cData=t;
       continue;
     }
     if(tmp == "mysymbol") { // special case..
        cData=t;
        } else { // regular row, rowname, and data..
          rData.push(tmp);
          var tt=floatValue(t);
          oData.push(tt);
//          window.console.log(tt);
     }
  }

  // return sample, gene list, and data matrix
  if(cData.length > rData.length) {
     fixValue(cData);
     return { 'samples':rData, 'genes':cData, 'data':oData, 'type':'horizontal' };
     } else {
        fixValue(rData);
        return { 'samples':cData, 'genes':rData, 'data':oData, 'type':'vertical' };
  }
}



function fixValue(data) {
  var sz=data.length;
  for(var i=0;i<sz;i++) {
     var p=data[i]+"_"+i;
     data[i]=p;
  }
}


//http://stackoverflow.com/questions/11655021/javascript-clusterfck-metric
function postOrder(orig,t) {
  if (t == null) {
    return;
  } else {
    var l=t.left;
    var c=t.canonical;
    var s=t.size;
    postOrder(orig,t.left);
    postOrder(orig,t.right);
    if (t.left == null && t.right == null) {
        orderedLeaf.push(t.canonical);
        var i=orig.indexOf(t.canonical);
        tmpLabel.push(i);
    } else { return; }
  }
}

function reorderLabels(labellist, ilist) {
  if(labellist.length != ilist.length) {
    window.console.log("WRONG axis label..");
  }
  var n_labellist=[];
  for(var i=0;i<ilist.length;i++) {
    var j=ilist[i];
    n_labellist.push(labellist[j]);
  }
  return n_labellist;
}

function resetOrderedData() {
  orderedLeaf=[];
  orderedXlabel=[];
  orderedYlabel=[];
  tmpLabel=[];
}

// rowOrder, columnOrder
function callHclust(distanceColumn,distanceRow,linkColumn,linkRow) {
  resetOrderedData();

  var data = inputData;
  if(genesAt == 'vertical') {
  // transpose it
    data=transpose(data);
  } 
  var rowOrder, columnOrder;
// cluster genes
  var tree = clusterfck.hcluster(data, distanceColumn,linkColumn);
  // tree is an array 
  postOrder(data,tree[0]);

  window.console.log("new order-->");
  window.console.log(tmpLabel.toString());

  var n_leaf=orderedLeaf; orderedLeaf=[];

  orderedXlabel=reorderLabels(outputXlabel,tmpLabel);

  tmpLabel=[];
  n_data=transpose(n_leaf);
// cluster samples
  var n_tree = clusterfck.hcluster(n_data, distanceRow, linkRow);
  postOrder(n_data,n_tree[0]);
  orderedYlabel=reorderLabels(outputYlabel,tmpLabel);
}


function addCELHeatmap() {
  // distanceColumn, distanceRow,linkColumn,linkRow
  callHclust(clusterfck.EUCLIDEAN_DISTANCE, clusterfck.EUCLIDEAN_DISTANCE,
                     clusterfck.COMPLETE_LINKAGE, clusterfck.COMPLETE_LINKAGE);

  var _zval= orderedLeaf;
  var _xlabel= orderedXlabel;
  var _ylabel= orderedYlabel;
  var _colors=celColor;

  var _data=getHeatmapAt(_zval, _xlabel, _ylabel, _colors);
  var _layout=getHeatmapDefaultLayout(1000,500);
  var _aPlot=addHeatmapPlot(_data,_layout);
  return _aPlot;
}


// there must be a heatmapplot
function toggleContour() { 
  var _p=saveAHeatmapPlot;
  if(_p) {
    var _c = document.getElementById('contourBtn');
    withContour = !withContour;
    if(withContour) {
      addStyleChangesHeatmap(_p, "contour", null);
      _c.style.color='red';
      _c.value='no Contour';
      } else {
      addStyleChangesHeatmap(_p, "heatmap", null);
      _c.style.color='black';
      _c.value='Contour';
    }
  }
}

function updateGeneCluster(newDistance) { // this is to change the gene(column distance only)
// newDistance, 'Eucliidean', 'Manhattan', or 'Max'
   if(newDistance == 'Euclidean') {
window.console.log("call foo Euclidean");
     return;
   }
   if(newDistance == 'Manhattan') {
window.console.log("call foo Manhattan");
     return;
   }
   if(newDistance == 'Max') {
window.console.log("call foo Max");
     return;
   }

}

function addStyleChangesHeatmap(aPlot, contour, target) 
{
  var _update = { type: contour };
  restyleHeatmapPlot(aPlot,_update, target);
}


function setupHeatmapControl() {
  var _c = document.getElementById('heatmapControlBlock');
  _c.style.display = '';
}


/*********************************************/

// making lines..
var saveTraceName=[]; // name of traces
var saveY=[]; // data traces
var saveX=[]; // data traces
var saveColor=[];

function resetBuildData() {
  saveTraceName=[];
  saveY=[];
  saveX=[];
  saveColors=[];
}

function buildDataComplete() {
   resetBuildData();
   var _data=inputData;
   var rows=_data.length;
   for( var i=0; i< rows; i++) {
//     var vals = Object.values(_data[i]);
     var vals = _data[i];
     var fvals= vals.map(function(v) { return parseFloat(v); } );
     saveY.push(fvals);
   };
   var mergedY = [].concat.apply([], saveY);
   saveY=mergedY;
   saveColor.push(getColor(rows-1));
}

function buildDataByGenes() {
   resetBuildData();
   var _data=inputData;
   if(genesAt == 'horizontal') { 
     _data=transpose(inputData);
   }
   var rows=_data.length;
   for( var i=0; i< rows; i++) {
     var vals = Object.values(_data[i]);
     var fvals= vals.map(function(v) { return parseFloat(v); } );
     saveTraceName.push(inputGenes[i]);
     saveColor.push(getColor(saveY.length-1));
     saveY.push(fvals);
     saveX.push(inputSamples);
   }
}

function buildDataBySamples() {
   resetBuildData();
   var _data=inputData;
   if(genesAt == 'vertical') { 
     _data=transpose(inputData);
   }
   var rows=_data.length;
   for( var i=0; i< rows; i++) {
     var vals = Object.values(_data[i]);
     var fvals= vals.map(function(v) { return parseFloat(v); } );
     saveTraceName.push(inputSamples[i]);
     saveColor.push(getColor(saveY.length-1));
     saveY.push(fvals);
     var list=[];
     for (var j = 0; j < fvals.length; j++) {
        list.push(j);
     };
     saveX.push(list);
   }
}


// initial set
function addCELLineChart(byGenes) {
  if(byGenes) {
    buildDataByGenes();
    } else { 
      buildDataBySamples();
  }

  var _x=saveX;
  var _y=saveY;
  var _keys=saveTraceName;
  var _colors=saveColor;

  var _data=getLinesAt(_x, _y,_keys,_colors);
  var _layout=getLinesDefaultLayout(1000, 300);
  addLinePlot(_data,_layout);
}

/*********************************************/
// a single histogram
// histogram on a sample,
function addCELHistogram(idx) {
  buildDataBySamples();

  var cnt=saveTraceName.length;
  if(cnt < idx) return;

  var _xtitle=saveTraceName[idx];
  var _ytitle='count';
  var _x=saveY[idx];
  var _max=Math.max.apply(Math,_x)+1;
  var _min=Math.min.apply(Math,_x)-1;

  var _data=getHistogramAt(_x,getColor(idx));
  var _layout=getHistogramDefaultLayout(1000,300, _xtitle, _ytitle, [_min,_max]);
  addHistogramPlot(_data,_layout);
}

// includes all the data points
// split into above and below 0 traces
function addCELAllHistogram() {
  buildDataComplete();

  var _xtitle="Complete set";
  var _ytitle="Count";
  var _x=saveY;
  var _pos=[];
  var _neg=[];
  var cnt=_x.length;

  for(var i=0; i< cnt; i++) {
    if(_x[i]>0)
      _pos.push(_x[i]);
      else 
        _neg.push(_x[i]);
  }
  
  var _max=Math.max.apply(Math,_x)+1;
  var _min=Math.min.apply(Math,_x)-1;

  var _data=getHistogramsAt( [_pos, _neg], grColor,[_min,_max]);
  var _layout=getHistogramsDefaultLayout(1000,300, _xtitle, _ytitle, [_min,_max]);
  addHistogramPlot(_data,_layout);
}


/*********************************************/
