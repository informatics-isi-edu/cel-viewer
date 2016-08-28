//
// cel-viewer/viewer-user-heatmap.js
//
// This is very user/dataset specific information
// for, USC


var inputData=[]; // this is in Matrix format [[..][..][..]], original 
var inputSamples=[];
var inputGenes=null;

var yyLabel=null;
var title=null;

var outputXlabel=null;
var outputYlabel=null;
var genesAt=null;

var orderedLeaf=[];
var orderedXlabel=[];
var orderedYlabel=[];
var tmpLabel=[];

var saveGENEClusterDistance=null;
var saveGENELinkage=null;
var saveGENEScaledData=null; // pts to inputData, inputDataMeanCenter, inputDataZScore
var inputDataMeanCenter=null; 
var inputDataZScore=null; 

    // red to black to green
var celColor= [ [0, 'rgb(255,0,0)'],
                 [0.3, 'rgb(100,0,0)'],
                 [0.5, 'rgb(0,0,0)'],
                 [0.7, 'rgb(0,100,0)'],
                 [1, 'rgb(0,255,0)'] ];

var celColor2= [ [0, 'rgb(0,0,255)'],
                 [0.3, 'rgb(0,0,100)'],
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
// "config" : { from configIt.R }
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
  yyLabel=null;
  genesAt='horizontal';
  outputXlabel=null;
  outputYlabel=null;
  withContour=false;

  saveGENEClusterDistance=null;
  saveGENELinkage=null;
  saveGENEScaledData=inputData;
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
  var _meta=blob.meta;
  var _config=_meta.config;
  
  yyLabel=config2foldType(_config);
  title=config2mainTitle(_config);

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

  saveGENEScaledData=inputData;
//  inputDataMeanCenter=makeMeanCenterData(inputData);
//  inputDataZScore=makeZScoreData(inputData); 
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
function callHclust(_inputData,distanceColumn,distanceRow,linkColumn,linkRow) {
  resetOrderedData();

  var data = _inputData;
  if(genesAt == 'vertical') {
  // transpose it
    data=transpose(data);
  } 
  var rowOrder, columnOrder;
// cluster genes
  if(distanceColumn!=null) {
    var tree = clusterfck.hcluster(data, distanceColumn,linkColumn);
  // tree is an array 
    postOrder(data,tree[0]);
    } else { // no need to cluster, just keep it in order
      for(var i=0; i<data.length;i++)
        tmpLabel.push(i);
      orderedLeaf=data;
  }

  window.console.log("new X order-->");
  window.console.log(tmpLabel.toString());

  var n_leaf=orderedLeaf; orderedLeaf=[];

  orderedXlabel=reorderLabels(outputXlabel,tmpLabel);

  tmpLabel=[];
  n_data=transpose(n_leaf);
// cluster samples
  if(distanceRow!=null) {
    var n_tree = clusterfck.hcluster(n_data, distanceRow, linkRow);
    postOrder(n_data,n_tree[0]);
    } else {
      for(var i=0; i<n_data.length; i++) {
        tmpLabel.push(i);
      }
      orderedLeaf = n_data;
  }
  orderedYlabel=reorderLabels(outputYlabel,tmpLabel);
  window.console.log("new Y order-->",tmpLabel.toString());
}


// default case
function addCELHeatmap() {
  addCELAllHistogram();

  // distanceColumn, distanceRow,linkColumn,linkRow
  callHclust(saveGENEScaledData, null, null, null, null);

  var _zval= orderedLeaf;
  var _xlabel= orderedXlabel;
  var _ylabel= orderedYlabel;
  var _colors=celColor;

  var _data=getHeatmapAt(_zval, _xlabel, _ylabel, _colors);
  var _layout=getHeatmapDefaultLayout(1000,500);
  var _aPlot=addHeatmapPlot(_data,_layout);
  return _aPlot;
}

function updateCELHeatmapClustering(distanceColumn, distanceRow, 
linkColumn, linkRow){
  removeHeatmapPlot();
  addCELAllHistogram();

  callHclust(saveGENEScaledData, distanceColumn, distanceRow, linkColumn, linkRow);

  var _zval= orderedLeaf;
  var _xlabel= orderedXlabel;
  var _ylabel= orderedYlabel;
  var _colors=celColor;

  var _data=getHeatmapAt(_zval, _xlabel, _ylabel, _colors);
  var _layout=getHeatmapDefaultLayout(1000,500);
  var _aPlot=addHeatmapPlot(_data,_layout); // heatmap by default
  return _aPlot;
}

// there must be a heatmapplot
function toggleContour(stype) { 
  var _p=saveAHeatmapPlot;
  if(_p) {
    if(stype == 'Contour') {  // to Contour
      if(withContour) {  // do nothing
        return;
        } else {
          withContour = !withContour;
          addStyleChangesHeatmapType(_p, "contour", null);
      }
      } else {  // to Heatmap
        if(!withContour) {  // do nothing
          return;
          } else {
            withContour = !withContour;
            addStyleChangesHeatmapType(_p, "heatmap", null);
        }
    }
  }
}

function updateHeatmapPlot() {
  var _aPlot=updateCELHeatmapClustering(saveGENEClusterDistance,
      clusterfck.EUCLIDEAN_DISTANCE, saveGENELinkage, clusterfck.COMPLETE_LINKAGE);
  return _aPlot;
}

// this is to change the gene(column distance only)
// newDistance, 'Euclidean', 'Manhattan', or 'Max'
function updateGeneCluster(newDistance) { 
  if(newDistance == 'Euclidean') {
    saveGENEClusterDistance=clusterfck.EUCLIDEAN_DISTANCE;
  } else if(newDistance == 'Manhattan') {
    saveGENEClusterDistance=clusterfck.MANHATTAN_DISTANCE;
  }else if(newDistance == 'Pearson Correlation') {
    saveGENEClusterDistance=clusterfck.CORRELATION_DISTANCE;
  }else if(newDistance == 'Absolute Correlation') {
    saveGENEClusterDistance=clusterfck.ABS_CORRELATION_DISTANCE;
  } else if(newDistance == 'Unordered') {
    saveGENEClusterDistance=null;
  } else {
    saveAHeatmapPlot=null;
    return;
  }
  saveAHeatmapPlot=updateHeatmapPlot();
  if(withContour) {
    addStyleChangesHeatmapType(saveAHeatmapPlot, "contour", null);
  }
}

// only for genes side
// newLinkage, 'Complete', 'Single', or 'Average'
function updateGeneLinkage(newLinkage) { 
  if(newLinkage == 'Complete') {
    saveGENELinkage=clusterfck.COMPLETE_LINKAGE;
  } else if(newLinkage == 'Single') {
    saveGENELinkage=clusterfck.SINGLE_LINKAGE;
  }else if(newLinkage == 'Average') {
    saveGENELinkage=clusterfck.AVERAGE_LINKAGE;
  } else {
    saveAHeatmapPlot=null;
    return;
  }
  saveAHeatmapPlot=updateHeatmapPlot();
  if(withContour) {
    addStyleChangesHeatmapType(saveAHeatmapPlot, "contour", null);
  }
}

function updateGeneScaling(newScaling) { 
  if(newScaling == 'None') {
    saveGENEScaledData=inputData;
  } else if(newScaling == 'Mean-centering') {
    saveGENEScaledData=inputDataMeanCenter;
  }else if(newScaling == 'Z-score') {
    saveGENEScaledData=inputDataZScore;
  } else {
    saveAHeatmapPlot=null;
    return;
  }
  saveAHeatmapPlot=updateHeatmapPlot();
  if(withContour) {
    addStyleChangesHeatmapType(saveAHeatmapPlot, "contour", null);
  }
}

// "contour" or "heatmap"
function addStyleChangesHeatmapType(aPlot, newtype, target) 
{
  var _update = { type: newtype };
  restyleHeatmapPlot(aPlot,_update, target);
}


function setupHeatmapControl() {
  saveGENEClusterDistance=null;
  saveGENELinkage=clusterfck.COMPLETE_LINKAGE;
  saveGENEScaledData=inputData;

  var _c = document.getElementById('heatmapControlBlock');
  _c.style.display = '';
  $("#geneClustering :input").change(function() {
    updateGeneCluster(this.id);
  });
  $("#geneLinkage :input").change(function() {
    updateGeneLinkage(this.id);
  });
  $("#geneScaling :input").change(function() {
    updateGeneScaling(this.id);
  });
/*
  $("#heatmapStyling :input").change(function() {
     toggleContour(this.id); 
  });
*/
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
   var _data=saveGENEScaledData;
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
   var _data=saveGENEScaledData;
   if(genesAt == 'horizontal') { 
     _data=transpose(saveGENEScaledData);
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
   var _data=saveGENEScaledData;
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

  var _xtitle=yyLabel;
  var _ytitle="";
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
  // make layout's trace name to be disabled
  _data[0].name="";
  _data[1].name="";
 
  _layout.hovermode="closest";
  _layout.title=title;
  addHistogramPlot(_data,_layout);
}


/*********************************************/
function makeMeanCenterData(iMatrix) { // takes array of arrays
  var matrixData=iMatrix; 
  var iArray= matrixData.reduce(function(curr, next){ 
         return curr.concat(next);
        });
  var mean=getMean(iArray);

  window.console.log(mean);
  // create an matrix of z-score
  var mMatrix=[];
  for(var i=0; i<iMatrix.length; i++) {
    var n=iMatrix[i];
    // (val - mean)
    var nn=n.map(function(val) {
       return (val - mean); 
    });
    mMatrix.push(nn);
  }
  return mMatrix;
}

function makeZScoreData(iMatrix) { // takes array of arrays
  var matrixData=iMatrix; 
  var iArray= matrixData.reduce(function(curr, next){ 
         return curr.concat(next);
        });
  var r=getMeanAndStandardDev(iArray);
  var mean=r[0];
  var sd=r[1];
  window.console.log(mean);
  window.console.log(sd);
  // create an matrix of z-score
  var zMatrix=[];
  for(var i=0; i<iMatrix.length; i++) {
    var n=iMatrix[i];
    // (val - mean)/sd
    var nn=n.map(function(val) {
       return (val - mean)/sd; 
    });
    zMatrix.push(nn);
  }
  return zMatrix;
}

function getMean(inputArr) {
   var _inputData=inputArr;
   var total=0;

   for(var i=0;i<_inputData.length;i+=1){
       total+=_inputData[i];
   }
   var mean = total/_inputData.length;
   return mean;
}

//http://stackoverflow.com/questions/7343890/standard-deviation-javascript
function getMeanAndStandardDev(inputArr) {
   var _inputData=inputArr;

   var diffSqredArr = [];
   var mean = getMean(_inputData);

   for(var j=0;j<_inputData.length;j+=1){
       diffSqredArr.push(Math.pow((_inputData[j]-mean),2));
   }
   var sd=(Math.sqrt(diffSqredArr.reduce(function(curr, next){
            return curr + next;
          })/_inputData.length));

   return [ mean, sd ];
};
