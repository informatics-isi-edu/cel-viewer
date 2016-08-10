//
// cel-viewer
//
// Usage example:
//   http://localhost/cel-viewer/view.html?
//                   http://localhost/data/CEL/newDatHeatT.csv


var inputData=null; // this is in Matrix format [[..][..][..]]
var inputSamples=null;
var inputGenes=null;

var outputXlabel=null;
var outputYlabel=null;
var genesAt=null;

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
// okay
//      window.console.log("okay in readyState..");
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
};

// for sure that it is X.json
function chopForStub(url){
  var s=url.split('/').pop();
  var ss=s.slice(0, -5);
  return ss;
}

// fname is simple json data file converted
function loadBlobFromJsonFile(fname) {
  var tmp=ckExist(fname);
  var blob=(JSON.parse(tmp));
  return blob;
}

/*****MAIN*****/
jQuery(document).ready(function() {
  var args=document.location.href.split('?');
  if (args.length === 2) {
     var url=processArgs(args);
     window.console.log("got this url for arg..",url);
     loadCSVFromFile(url);
     // byGenes
//     for(var i=0; i<inputSamples.length; i++) {
//       addCELHistogram(i);
//     }
//     addCELAllHistogram();
//     addCELLineChart(1); // byGenes
//     addCELLineChart(0); // bySamples
     addCELHeatmap();
  } else {
window.console.log("humm...");
  }
})


function processArgs(args) {
  var url="";
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      url=param.replace(new RegExp('/$'),'').trim();
      } else {
        var kvp = param.split('=');
        switch (kvp[0].trim()) {
          case 'url':
            {
             url=kvp[1].replace(new RegExp('/$'),'').trim();
             break;
             }
          default:
             {
window.console.log("bad arg..",kvp[0].trim());
             }
       }
    }
  }
  return url;
}


function loadCSVFromFile(url) {
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
