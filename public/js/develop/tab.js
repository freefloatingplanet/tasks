let memodata = "";
let mergeddata = [];
let pastDoneData = [];
let settingData = {};


$(function() {
    let tabs = $(".tab"); // tabのクラスを全て取得し、変数tabsに配列で定義
    $(".tab").on("click", function() { // tabをクリックしたらイベント発火
      var fromTab = $(".active").attr('id');
      $(".active").removeClass("active"); // activeクラスを消す
      $(this).addClass("active"); // クリックした箇所にactiveクラスを追加
      const index = tabs.index(this); // クリックした箇所がタブの何番目か判定し、定数indexとして定義
      $(".content").removeClass("show").eq(index).addClass("show"); // showクラスを消して、contentクラスのindex番目にshowクラスを追加
      var toTab = $(".active").attr('id');
      switchTab(fromTab,toTab);
    });
    init();
})

$(function(){
  setInterval("autoSave()", 3600000);
})

var autoSave = function(){
  var fromTab = $(".active").attr('id');
  fromFunction(fromTab);
}

var switchTab = function(fromTab,toTab){
  fromFunction(fromTab);
  toFunction(toTab);
}

var fromFunction = function(tabid){
  let output = {};
  switch(tabid){
    case 'tabkanban':
      leave_tabkanban_event();
      output['task'] = mergeddata;
      break;
    case 'tabtask':
      leave_tabtask_event();
      output['task'] = mergeddata;
      break;
    case 'tabfree':
      leave_tabfree_event();
      output['memo'] = memodata;
      break;
    case 'tabsetting':
      leave_tabsetting_event();
      output['setting'] = settingData;
      break;
  }
  writeCSV(output);
}

var toFunction = function(tabid){
  switch(tabid){
    case 'tabkanban':
      visit_tabkanban_event();
      break;
    case 'tabtask':
      visit_tabtask_event();
      break;
    case 'tabfree':
      visit_tabfree_event();
      break;
  }
}

var init = function(){

  readCSV(function(){
    visit_tabsetting_event();
    visit_tabtask_event();
    visit_tabfree_event();
    visit_tabkanban_event();
  });
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
  let param1 = {
    type: "post",
    url:"/csvread/task/",
    dataType:"json"
  };
  let param2 = {
    type: "post",
    url:"/csvread/memo/",
    dataType:"json"
  };
  let param3 = {
    type: "post",
    url:"/csvread/setting/",
    dataType:"json"
  };

  $.when(
    $.ajax(param1),
    $.ajax(param2),
    $.ajax(param3)
  ).done((res1,res2,res3) => {
    mergeddata = res1[0].task;
    memodata = res2[0].memo;
    settingData = res3[0].setting;
    callback();
  }).fail((data) => {
    console.log('cannot access url');
  });
}

var convKeyCellNo = function(keyTitleData){

  var output = [];

  if(keyTitleData){
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
        [CONST.CELL_NO.END]:     task[CONST.TITLE.END],
        [CONST.CELL_NO.ISSUEID]: task[CONST.TITLE.ISSUEID],
        [CONST.CELL_NO.DONERATIO]:task[CONST.TITLE.DONERATIO],
        [CONST.CELL_NO.REGIST]:  task[CONST.TITLE.REGIST]
      };
      output.push(json);
    });  
  }

  return output;

}

var convKeyArray = function(task){

  var array = [
    task[CONST.TITLE.ID],
    task[CONST.TITLE.STATUS],
    task[CONST.TITLE.DATE],
    task[CONST.TITLE.PROJECT],
    task[CONST.TITLE.CATEGORY],
    task[CONST.TITLE.TITLE],
    task[CONST.TITLE.PLANH],
    task[CONST.TITLE.PLANM],
    task[CONST.TITLE.SPENT],
    task[CONST.TITLE.START],
    task[CONST.TITLE.END],
    task[CONST.TITLE.ISSUEID],
    task[CONST.TITLE.DONERATIO],
    task[CONST.TITLE.REGIST]
  ];
  return array;

}