
// matrix.config.js 

var selectLabel=[ "E10.5_Mnd_D", "E10.5_Mnd_P", "E10.5_Max_D", "E10.5_Max_P",
            "E11.5_Mnd_D", "E11.5_Mnd_P", "E11.5_Max_D", "E11.5_Max_P",
            "E12.5_Mnd_D", "E12.5_Mnd_P", "E12.5_Max_D", "E12.5_Max_P",
            "E13.5_Mnd_D", "E13.5_Mnd_P", "E13.5_Max_D", "E13.5_Max_P",
            "E14.5_Mnd_D", "E14.5_Mnd_P", "E14.5_Max_D", "E14.5_Max_P" ];

var ageStages = [10.5, 11.5, 12.5, 13,5, 14.5];
var anatomyBone = [ 'maxilla','mandible' ]; // (Max,Mnd) 
var comparePlace = [ 'distal', 'proximal' ]; // (D,P)
var compareOn = ["place", "bone", "age"];
var summary=[ 'Z', 'A', 'M' ];
var logType=[ 0, 1 ]; // "log"(0), "log2"(1) 

var config = { sel:["E10.5_Mnd_D","E10.5_Mnd_P"],
               comp:"place", // place, bone, age
               invert_place:"normal",  //normal, invert
               invert_bone:"normal",
               invert_age:"normal",
                             // "all probesets" = "Z"
                             // "most highly expressed probeset" = "A"
                             // "most differentially expressed probeset" = "M")
               summary:"Z",
               fdr:0.01,
               fc:2.0,
               max:"Inf",
               log:1,        // "log"(0), "log2"(1) 
               heatcol:"rg",  // "rg", "gr"
               col1:"",
               col2:"",
               col3:"",
               col4:"",
               col5:"",
               gene1:"",
               gene2:"",
               gene3:"",
               gene4:"",
               gene5:"" };

// app.R shorten the labels
var labeltbl = { '10.5MndD':"E10.5_Mnd_D", '10.5MndP':"E10.5_Mnd_P",
               '10.5MaxD':"E10.5_Max_D", '10.5MaxP':"E10.5_Max_P",
               '11.5MndD':"E11.5_Mnd_D", '11.5MndP':"E11.5_Mnd_P",
               '11.5MaxD':"E11.5_Max_D", '11.5MaxP':"E11.5_Max_P",
               '12.5MndD':"E12.5_Mnd_D", '12.5MndP':"E12.5_Mnd_P",
               '12.5MaxD':"E12.5_Max_D", '12.5MaxP':"E12.5_Max_P",
               '13.5MndD':"E13.5_Mnd_D", '13.5MndP':"E13.5_Mnd_P",
               '13.5MaxD':"E13.5_Max_D", '13.5MaxP':"E13.5_Max_P",
               '14.5MndD':"E14.5_Mnd_D", '14.5MndP':"E14.5_Mnd_P",
               '14.5MaxD':"E14.5_Max_D", '14.5MaxP':"E14.5_Max_P" }; 
 
 
