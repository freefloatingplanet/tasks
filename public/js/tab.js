$(function() {
    let tabs = $(".tab"); // tabのクラスを全て取得し、変数tabsに配列で定義
    $(".tab").on("click", function() { // tabをクリックしたらイベント発火
      $(".active").removeClass("active"); // activeクラスを消す
      $(this).addClass("active"); // クリックした箇所にactiveクラスを追加
      const index = tabs.index(this); // クリックした箇所がタブの何番目か判定し、定数indexとして定義
      $(".content").removeClass("show").eq(index).addClass("show"); // showクラスを消して、contentクラスのindex番目にshowクラスを追加
    })
  })


var memodata = "";
var mergeddata = [];


$(function(){
  $('#tabkanban').on('click' , function(){
    taskchute_tabkanban_event();
    myjkanban_tabkanban_event();
    memo_tabkanban_event();
    writeCSV(createCSVWriteData());

  });
  $('#tabtask').on('click' , function(){
    myjkanban_tabtask_event();
    taskchute_tabtask_event();
    memo_tabtask_event();
    writeCSV(createCSVWriteData());
  });

  init();
});

var init = function(){

  readCSV(function(){
    taskchute_initdata();
    $("#memodata").val(memodata);
    myjkanban_tabkanban_event();
  });
}

var createCSVWriteData = function(){

  var output = {};

  output.task = mergeddata;
  output.memo = memodata;
  return output;

}

var writeCSV = function(inputdata){
  $.ajax({
    type: "post",
    url:"/csvwrite/",
    data: JSON.stringify(inputdata),
    contentType: 'application/json',
    dataType:"json"
  }).done((data => {
    console.log(data);
  })).fail((data) => {
    console.log('cannot access url');
  })
}

var readCSV = function(callback){
  $.ajax({
    type: "post",
    url:"/csvread/",
    dataType:"json"
  }).done((data => {
    console.log(data);
    mergeddata = data.task;
    memodata = data.memo;
    callback();
  })).fail((data) => {
    console.log('cannot access url');
  })
}

var convKeyCellNo = function(keyTitleData){

  var output = []

  keyTitleData.forEach(function(task){
    var json = {
      [CONST.CELL_NO.ID]:      task[CONST.TITLE.ID],
      [CONST.CELL_NO.STATUS]:  task[CONST.TITLE.STATUS],
      [CONST.CELL_NO.DATE]:    task[CONST.TITLE.DATE],
      [CONST.CELL_NO.PROJECT]: task[CONST.TITLE.PROJECT],
      [CONST.CELL_NO.CATEGORY]:task[CONST.TITLE.CATEGORY],
      [CONST.CELL_NO.TITLE]:   task[CONST.TITLE.TITLE],
      [CONST.CELL_NO.PLANH]:   task[CONST.TITLE.PLANH],
      [CONST.CELL_NO.PLANM]:   task[CONST.TITLE.PLANM],
      [CONST.CELL_NO.SPENT]:   task[CONST.TITLE.SPENT],
      [CONST.CELL_NO.START]:   task[CONST.TITLE.START],
      [CONST.CELL_NO.END]:     task[CONST.TITLE.END]
    };
    output.push(json);
  });

  return output;

}