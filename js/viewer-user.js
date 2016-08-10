//
// cel-viewer/viewer-user.js
//
// This is very user/dataset specific information
// for, USC

var orderedLeaf=[];
var orderedXlabel=[];
var orderedYlabel=[];
var tmpLabel=[];
    // red to black to green
var celColor= [ [0, 'rgb(255,0,0)'],
                 [0.3, 'rgb(139,0,0)'],
                 [0.5, 'rgb(0,0,0)'],
                 [0.7, 'rgb(0,100,0)'],
                 [1, 'rgb(5,275,5)'] ];
//  return 
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
function callHclust() {
  resetOrderedData();
  var rowOrder, columnOrder;
  var data = inputData;
  var tree = clusterfck.hcluster(data, clusterfck.EUCLIDEAN_DISTANCE, clusterfck.COMPLETE_LINKAGE);
  // tree is an array 
  postOrder(data,tree[0]);

  window.console.log("new order-->");
  window.console.log(tmpLabel.toString());

  var n_leaf=orderedLeaf; orderedLeaf=[];

  orderedXlabel=reorderLabels(outputXlabel,tmpLabel);

  tmpLabel=[];
  n_data=transpose(n_leaf);
  var n_tree = clusterfck.hcluster(n_data, clusterfck.EUCLIDEAN_DISTANCE, clusterfck.COMPLETE_LINKAGE);
  postOrder(n_data,n_tree[0]);
  orderedYlabel=reorderLabels(outputYlabel,tmpLabel);
}


function addCELHeatmap() {
  callHclust();

  var _zval= orderedLeaf;
  var _xlabel= orderedXlabel;
  var _ylabel= orderedYlabel;
  var _colors=celColor;

  var _data=getHeatmapsAt(_zval, _xlabel, _ylabel, _colors);
  var _layout=getHeatmapsDefaultLayout(1000,400);
  addHeatmapPlot(_data,_layout);
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
     var vals = Object.values(_data[i]);
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
  var _layout=getLinesDefaultLayout(1000, 400);
  addLinePlot(_data,_layout);
}

/*********************************************/
// a single histogram
// histogram on a sample,
function addCELHistogram(idx) {
  buildDataBySamples();

  var cnt=saveTraceName.length;
  if(cnt < idx) return;

  var _key=saveTraceName[idx];
  var _x=saveY[idx];
  var _max=Math.max.apply(Math,_x)+1;
  var _min=Math.min.apply(Math,_x)-1;

  var _data=getHistogramAt(_x,saveColor[idx]);
  var _layout=getHistogramDefaultLayout(1000,300, _key, [_min,_max]);
  addHistogramPlot(_data,_layout);
}

// includes all the data points
function addCELAllHistogram() {
  buildDataComplete();

  var _key="Complete Set";
  var _x=saveY;
  var _max=Math.max.apply(Math,_x)+1;
  var _min=Math.min.apply(Math,_x)-1;

  var _data=getHistogramAt(_x, saveColor[0]);
  var _layout=getHistogramDefaultLayout(1000,300, _key, [_min,_max]);
  addHistogramPlot(_data,_layout);
}


/*********************************************/
