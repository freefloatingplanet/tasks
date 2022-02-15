// 日付領域
$(function() {
  $('#today').val(moment().format("YYYY-MM-DD"));
  $('#today').datepicker({
    defaultDate: new Date(), // 2020/8/5を表示
    numberOfMonths:1,                // 表示される月の数:2
    dateFormat: 'yy-mm-dd',      // yyyy年mm月dd日
    onClose: function(date, datepicker){
      updateDateArea();
    }
  });
});

$(function(){
  $('#wbsmode').change(function() {
    wbsMode();
  });
});


// テーブル領域
// ショートカット用
var insertRow = function(){
  insertFunc(false);
}

var deleteRow = function(){
  var selectedRows = table.getSelectedRows(true);
  var selectedColumns = table.getSelectedColumns();
  if(selectedRows.length===1){
    var row = selectedRows[0];
    var col = selectedColumns[0];
    table.deleteRow(selectedRows[0],1);
    table.updateSelectionFromCoords(col,row,col,row);
  }
}

var copyRow = function(){
  insertFunc(true);
}

var insertFunc = function(isCopy){

  var selectedRows = table.getSelectedRows(true);
  if(selectedRows.length===1){
    var row = selectedRows[0];
    var array = [];
    if(isCopy){
      array = table.getRowData(row);
    }
    table.insertRow(array,Number(row));
  }
}

var setCurrentDate = function(){
  var date = moment().format("YYYY-MM-DD 00:00:00");
  setValueOnSelectedCell(date);
}

var setCurrentTime = function(){
  var time = moment().format("hh:mm");
  setValueOnSelectedCell(time);
}

var setValueOnSelectedCell = function(value){
  var selectedRows = table.getSelectedRows(true);
  var selectedColumns = table.getSelectedColumns();
  if(selectedRows.length===1){
    var row = selectedRows[0];
    var col = selectedColumns[0];
    table.setValueFromCoords(col,row,value,true);
  }
}

// テーブルイベント
var insertRow4Table = function(instance, y){
  var status = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.STATUS,y+1]));
  if(status.length===0){
    table.setValueFromCoords(CONST.CELL_NO.STATUS,y+1,CONST.TASK_STATUS.NEW,true);
    table.setValueFromCoords(CONST.CELL_NO.PLANH,y+1,0,true);
    table.setValueFromCoords(CONST.CELL_NO.PLANM,y+1,0,true);
    table.setValueFromCoords(CONST.CELL_NO.SPENT,y+1,0,true);
  }
  updateid();
}


var editioned4Table = function(instance, cell, x, y, value) {
  var cellName = table.getHeader(x);
  switch(cellName){
    case CONST.TITLE.END:
      openclose();
      updateid();
      break;
    case CONST.TITLE.PLANH:
      var planh = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.PLANH,y]));
      var planm = planh * 60;
      table.setValueFromCoords(CONST.CELL_NO.PLANM,y,planm,true);
      break;
    case CONST.TITLE.PLANM:
      var planm = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.PLANM,y]));
      var planh = planm / 60;
      table.setValueFromCoords(CONST.CELL_NO.PLANH,y,planh,true);
      break;  
  }

  updateDateArea();
}

// 日付領域の更新
var updateDateArea = function(){

  var date = $('#today').val();
  var format = 'YYYY-MM-DD';
  var todaycal = moment(date, format).format(`${format} 00:00:00`);
  var sumPlanTime = 0;
  var sumSpentTime = 0;

  for(var y=0;y<table.getColumnData(CONST.CELL_NO.ID).length;y++){

    var date = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.DATE,y]));
    if(todaycal === date){
      sumPlanTime += Number(table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.PLANM,y])));
      sumSpentTime += Number(table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.SPENT,y])));
    }
  }

  // 日付領域の更新
  $('#plantime').text((sumPlanTime/60).toFixed(1));
  $('#spenttime').text((sumSpentTime/60).toFixed(1));
}

var openclose = function(){
  for(var y=0;y<table.getColumnData(CONST.CELL_NO.ID).length;y++){
    highlight(y);
  }
}

var highlight = function(y){
    var start = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.START,y]));
    var end = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.END,y]));
    var dt = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.DATE,y]));
    var st = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.STATUS,y]));
    var spent_m = "";

    var status = CONST.TASK_STATUS.NEW;
    var color = 'white';

    if(st === CONST.TASK_STATUS.PEND){
        status = CONST.TASK_STATUS.PEND;
        color = 'cornflowerblue';
    }else if(start.length !== 0 && end.length !== 0){
      status = CONST.TASK_STATUS.DONE;
      var st_dt = moment('2000-01-01T'+start,'YYYY-MM-DDThh:mm');
      var en_dt = moment('2000-01-01T'+end,'YYYY-MM-DDThh:mm');
      spent_m = en_dt.diff(st_dt,'minutes');

      color = 'grey';
    }else if(start.length !== 0 ){
      status = CONST.TASK_STATUS.WORK;
    }else if(dt.length !==0 ){
      status = CONST.TASK_STATUS.WAIT;
    }

    for(var x=CONST.CELL_NO.ID;x<=table.getRowData(y).length;x++){
      table.setStyle(jexcel.getColumnNameFromId([x,y]),'background-color',color);
    }
    table.setValueFromCoords(CONST.CELL_NO.STATUS,y,status,true);
    table.setValueFromCoords(CONST.CELL_NO.SPENT,y,spent_m,true);
}

var updateid = function(){
  for(var y=0;y<table.getColumnData(1).length;y++){
    var id = 0;
    var offset = CONST.OFFSET.DEFAULT;
    id = y + offset;
    
    table.setValueFromCoords(CONST.CELL_NO.ID,y,id,true);
    
  }
}

var sortbyid = function(){
  table.orderBy(CONST.CELL_NO.ID,false);
}

var wbsMode = function(){
    // prop()でチェックの状態を取得
    var wbsModeIsOn = $('#wbsmode').prop('checked');

    if(wbsModeIsOn){
      wbsModeOn();
    }else{
      wbsModeOff();
    }
}

var wbsModeOn = function(){
  table.orderBy(CONST.CELL_NO.CATEGORY,false);
  table.orderBy(CONST.CELL_NO.PROJECT,false);

  var nowValue1 = "";
  var prevValue1 = "";
  var nowValue2 = "";
  var prevValue2 = "";
  for(var y=0;y<table.getColumnData(CONST.CELL_NO.ID).length;y++){

    nowValue1 = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.PROJECT,y]));
    nowValue2 = table.getValue(jexcel.getColumnNameFromId([CONST.CELL_NO.CATEGORY,y]));

    if(nowValue1.length !==0 && nowValue1 === prevValue1){
      table.setStyle(jexcel.getColumnNameFromId([CONST.CELL_NO.PROJECT,y]),'color','transparent');
      if(nowValue2.length !==0 && nowValue2 === prevValue2) table.setStyle(jexcel.getColumnNameFromId([CONST.CELL_NO.CATEGORY,y]),'color','transparent');
    }
    prevValue1 = nowValue1;
    prevValue2 = nowValue2;

  }
}
var wbsModeOff = function(){
  for(var y=0;y<table.getColumnData(CONST.CELL_NO.ID).length;y++){

    table.setStyle(jexcel.getColumnNameFromId([CONST.CELL_NO.PROJECT,y]),'color','black');
    table.setStyle(jexcel.getColumnNameFromId([CONST.CELL_NO.CATEGORY,y]),'color','black');

  }
}

var taskchute_initdata = function(){
  table.setData({});
  table.setData(convKeyCellNo(mergeddata));
  openclose();
  sortbyid();
  updateDateArea();
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
        { type: 'calendar', title:'date'    , width:100 ,options: { format:'YYYY-MM-DD' }},
        { type: 'text'    , title:'project' , width:100 ,align:'left' },
        { type: 'text'    , title:'category', width:100 ,align:'left' },
        { type: 'text'    , title:'title'   , width:300 ,align:'left'},
        { type: 'numeric' , title:'plan_h'  , width:70},
        { type: 'numeric' , title:'plan_m'  , width:70},
        { type: 'numeric' , title:'spent_m' , width:70},
        { type: 'text'    , title:'start'   , width:100 },
        { type: 'text'    , title:'end'     , width:100 },
     ],
     oneditionend : editioned4Table,
     oninsertrow : insertRow4Table,
    });
}());
