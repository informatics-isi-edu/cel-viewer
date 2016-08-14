//
// viewer-util.js
//


var colorMap=[]; // master set

// create a colormap of about 24 colors
function setupColorMap() {
  var c3=colorbrewer.Dark2[8];
  var c1=colorbrewer.Set1[8];
  var c2=colorbrewer.Paired[8];
  colorMap.push('#1347AE'); // the default blue
  for( var i=0; i<8; i++) {
    colorMap.push(c1[i]);
  }
  for( var i=0; i<8; i++) {
    colorMap.push(c2[i]);
  }
  for( var i=0; i<8; i++) {
    colorMap.push(c3[i]);
  }
}

function getColor(idx) {
  var maxColors=colorMap.length;
  return colorMap[idx % maxColors];
}
/*********************************************/
// fname is simple json data file converted
function loadBlobFromJsonFile(fname) {
  var tmp=ckExist(fname);
  var blob=(JSON.parse(tmp));
  return blob;
}

/*********************************************/

function floatValue(data) {
  var n = data.map(function (v) {
    return (parseFloat(v));
  });
  return n;
}

function absValue(data) {
  var n = data.map(function (v) {
    return (Math.abs(v));
  });
  return n;
}

//stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
function transpose(a) {
    return a[0].map(function (_, c) { return a.map(function (r) { return r[c]; }); });
}

/*********************************************/
/* chop off entries that is not within the min, max range */
function rangeItByValue(p,min,max) {
//var _p=getData(key);
    var _p=p;
    var _cnt=_p.length;
    var _v;
    var _new=[];
    for( i=0; i< _cnt; i++) {
      _v=_p[i];
      if( _v > min && _v < max) {
         _new.push(_v);
      }
    }
    return _new;
}

/* chop off entries that are not within the index min,max */
function rangeItByTime(p,minIdx,maxIdx) {
//var _p=getData(key);
    var _p=p;
    var _new=_p.slice(minIdx, maxIdx);
    return _new;
}



