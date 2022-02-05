$(function() {
    let tabs = $(".tab"); // tabのクラスを全て取得し、変数tabsに配列で定義
    $(".tab").on("click", function() { // tabをクリックしたらイベント発火
      $(".active").removeClass("active"); // activeクラスを消す
      $(this).addClass("active"); // クリックした箇所にactiveクラスを追加
      const index = tabs.index(this); // クリックした箇所がタブの何番目か判定し、定数indexとして定義
      $(".content").removeClass("show").eq(index).addClass("show"); // showクラスを消して、contentクラスのindex番目にshowクラスを追加
    })
  })


var newdata = {};
var waitdata = {};
var workdata = {};
var donedata = {};
var mergeddata = [];


$(function(){
  $('#tab2').on('click' , function(){
    taskchute_tab2_event();
    myjkanban_tab2_event();
    writeCSV(mergeddata);

  });
  $('#tab1').on('click' , function(){
    myjkanban_tab1_event();
    taskchute_tab1_event();
    writeCSV(mergeddata);
  });
});

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