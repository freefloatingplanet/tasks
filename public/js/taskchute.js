
var insertrow = function(instance, y){
    table.setValueFromCoords(CONST.CELL_NO.STATUS,y+1,'new',true);
    updateid();
}

var editionend = function(instance, cell, x, y, value) {
  var cellName = table.getHeader(x);
  if(cellName === 'end'){
    openclose();
    updateid();
  }
}
var openclose = function(){
    for(var y=0;y<table.getColumnData(CONST.CELL_NO.ID).length;y++){
        highlight(y);
    }
}
var highlight = function(y){
    var start = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.START,y]));
    var end = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.END,y]));
    if(start.length !== 0 && end.length !== 0){
      close(y);
    }else{
      open(y);
  }
}
var close = function(y){
  for(var x=CONST.CELL_NO.ID;x<=table.getRowData(y).length;x++){
    table.setStyle(jexcel.getColumnNameFromId([x,y]),'background-color','grey');
  }
  table.setValueFromCoords(CONST.CELL_NO.STATUS,y,'done',true);
}
var open = function(y){
  for(var x=CONST.CELL_NO.ID;x<=table.getRowData(y).length;x++){
    table.setStyle(jexcel.getColumnNameFromId([x,y]),'background-color','white');
  }
  table.setValueFromCoords(CONST.CELL_NO.STATUS,y,'working',true);
}

var updateid = function(){
  for(var y=0;y<table.getColumnData(1).length;y++){
    console.log(y);
    var id = 0;
    var status = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.STATUS,y]));
    var offset = CONST.OFFSET.DEFAULT;
    if(status === "done"){
      offset = CONST.OFFSET.DONE;
    }
    id = y + offset;
    
    table.setValueFromCoords(CONST.CELL_NO.ID,y,id,true)
    
  }
}

var sortbyid = function(){
  table.orderBy(CONST.CELL_NO.ID,true);
}

var taskchute_initdata = function(){
  table.setData({});
  table.setData(convKeyCellNo(mergeddata));
}

var taskchute_tabtask_event = function(){
  taskchute_initdata();
};


var taskchute_tabkanban_event = function(){
    var headers = table.getHeaders().split(',');
    var datum = table.getData(false);
    mergeddata = [];
    datum.forEach(function(data){
        var json = {};
        for(var i=0; i<data.length; i++){
            json[headers[i]]=data[i];
        }
        mergeddata.push(json);
    });
}

var table = "";

(function(){
  var data = [
    ['11000','working','2019-02-12','projctX','coding','Jazz', '1','60','60','12:00',  '13:00'],
    ['21000','done','2018-07-11','projctY','design','Civic', '2','120','60','13:00',  '14:00'],
  ];
  
  table = jspreadsheet(document.getElementById('spreadsheet'), {
    data:data,
    columns: [
        { type: 'numeric' , title:'id'      , width:0},
        { type: 'text'    , title:'status'  , width:100},
        { type: 'calendar', title:'date'    , width:100 },
        { type: 'text'    , title:'project' , width:100 ,align:'left' },
        { type: 'text'    , title:'category', width:100 ,align:'left' },
        { type: 'text'    , title:'title'   , width:300 ,align:'left'},
        { type: 'numeric' , title:'plan_h'  , width:70},
        { type: 'numeric' , title:'plan_m'  , width:70},
        { type: 'numeric' , title:'spent_m' , width:70},
        { type: 'text'    , title:'start'   , width:100 },
        { type: 'text'    , title:'end'     , width:100 },
     ],
     oneditionend : editionend,
     oninsertrow : insertrow,
    });
}());
