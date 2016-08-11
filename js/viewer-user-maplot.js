//
// cel-viewer/viewer-user-maplot.js
//
// This is very user/dataset specific information
// for, USC

// input format,
//     ""      x y
//     gene1
//     gene2
//

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
  var _x=[inputXdata];
  var _y=[inputYdata];
  var _keys=inputGenes;
  var _colors=[getColor(0)];

  var _data=getLinesAt(_x, _y,_keys,_colors);
  var _layout=getLinesDefaultLayout(1000, 400);
  addLinePlot(_data,_layout);
}

