var KanbanTest = new jKanban({
  element: "#myKanban",
  gutter: "5px",
  widthBoard: "340px",
  itemHandleOptions:{
    enabled: true,
  },
  click: function(el) {
    console.log("Trigger on all items click!");
/**      if(el.style.backgroundColor === "lightgray"){
        el.style.backgroundColor = "white";
      }else{
        el.style.backgroundColor = "lightgray";
      }
*/
  },
  clickedit: function(el) {
    console.log("click at edit!");
    editTaskTitle(el.parentElement.parentElement.parentElement.parentElement);
  },
  clickfinish: function(el) {
    console.log("click at finish!");
    moveTask(el.parentElement.parentElement.parentElement.parentElement,"done");
  },
  clickdelete: function(el) {
    console.log("click at delete!");
    removeTask(el.parentElement.parentElement.parentElement.parentElement);
  },
  dblclick: function(el) {
    if($('input[name="kanban-double"]:checked').val() === "done"){
      moveTask(el,"done");
    }else{
      moveTask(el,"next");
    }
  },
  context: function(el, e) {
    console.log("Trigger on all items right-click!");
  },
  dropEl: function(el, target, source, sibling){
    console.log(target.parentElement.getAttribute('data-id'));
    console.log(el, target, source, sibling)
    dropTask(el);
  },
  buttonClick: function(el, boardId) {
    addTaskForm(el, boardId);
  },
  itemAddOptions: {
    enabled: false,
    content: '+ Add New Card',
    class: 'custom-button',
    footer: true
  },
  boards: [
    CONST.BOARD_CONTENT[CONST.BOARDID.NEW],
    CONST.BOARD_CONTENT[CONST.BOARDID.WAIT],
    CONST.BOARD_CONTENT[CONST.BOARDID.WORK],
    CONST.BOARD_CONTENT[CONST.BOARDID.DONE],
    CONST.BOARD_CONTENT[CONST.BOARDID.PEND]
  ]
});


  var addTaskForm = function(el, boardId){
    console.log(el);
    console.log(boardId);
    // create a form to enter element
    var formItem = document.createElement("form");
    formItem.setAttribute("class", "itemform");
    formItem.innerHTML =
      '<div class="form-group"><textarea id="task-title'+boardId+'" class="form-control" rows="2" style="width:100%" placeholder="Type title and Press Enter" autofocus></textarea></div><div class="form-group"><button type="submit" id="task-submit-btn'+boardId+'" class="btn btn-primary btn-xs pull-right" style="display:none">Submit</button></div>';

    KanbanTest.addForm(boardId, formItem);
    formItem.addEventListener("submit", function(e) {
      e.preventDefault();
      var text = e.target[0].value;
      // ここはformも含めてカウントする
      var itemCount = KanbanTest.getBoardElements(boardId).length
      KanbanTest.addElement(boardId, createTask(boardId, text),itemCount-1);
    });
    // enterでsubmit、shift+enterで改行
    var $ta = $("#task-title"+boardId);
    
    $(document).on("keydown", "#task-title"+boardId, function(e) {
      
      if (e.keyCode == 13) { // Enterが押された
        if (e.shiftKey) { // Shiftキーも押された
          $.noop();
        } else if ($ta.val().replace(/\s/g, "").length > 0) {
          $("#task-submit-btn"+boardId).click();
          $ta.val("");
          return false;
        }
      } else {
        $.noop();
      }
    });
  }

var createTask = function(boardId, title){
  var status = CONST.BOARDID_TO_TASK[boardId];
  var nextid = getAllElementCount()-1;
  var offset = CONST.OFFSET.DEFAULT;
  var t = new Task(title);
  t.create(status);
  t.setId(nextid+offset);
  return t.getTask();
}
var editTaskTitle = function(el){
  var message = "修正後のタイトルを入力してください。";
  var beforeTitle = $(el).find('#data-title').text()
  beforeTitle = beforeTitle.replace(/[\^$.*+?()[]{}|]/g, '\$&');
  var afterTitle = prompt(message,beforeTitle);
  afterTitle = afterTitle.replace(/[\^$.*+?()[]{}|]/g, '\$&');

  if(afterTitle){
    $(el).find('#data-title').text(afterTitle)
  }else{
    alert("1文字以上のタイトルを入力してください。");
  }
}

var removeTask = function(el){
  var elid = $(el).attr(CONST.ATTR.ID);
  KanbanTest.removeElement(elid);
}
var moveTask = function(el,toBoard){
  var elid = $(el).attr(CONST.ATTR.ID);
  var nextboardid;
  if(toBoard === "done"){
    nextboardid = CONST.BOARDID.DONE;
  }else{
    var boardid = KanbanTest.getParentBoardID(elid);
    var no = CONST.BOARDID_TO_NO[boardid];
    var nextno = (Number(no) + 1)%CONST.NUMBER_STATUS;
    nextboardid = CONST.NO_TO_BOARDID[nextno];  
  }
  // ここはformも含めてカウントする
  var itemCount = KanbanTest.getBoardElements(nextboardid).length
  KanbanTest.removeElement(elid);
  KanbanTest.addElement(nextboardid, convElementToJson(el), itemCount - 1);
  var nextel = KanbanTest.findElement(elid);
  dropTask(nextel);
};
var dropTask = function(el){
    var taskid = $(el).attr(CONST.ATTR.ID);
    var boardid = KanbanTest.getParentBoardID(taskid);
    var status = CONST.BOARDID_TO_TASK[boardid];
    var title = $(el).attr(CONST.ATTR.TITLE);
    var start = $(el).attr(CONST.ATTR.START);
    var t = new Task(title);
    t.setTask(convElementToJson(el));
    t.updateStatusTo(status);
    if(status === CONST.TASK_STATUS.DONE && start.length===0){
      start = getLatestEndTime();
      t.setStart(start);
      t.updateSpentTime();
    }
    var json = t.getTask();
    $(el).attr(CONST.ATTR.STATUS,json[CONST.TITLE.START]);
    $(el).attr(CONST.ATTR.DATE,json[CONST.TITLE.DATE]);
    $(el).attr(CONST.ATTR.START,json[CONST.TITLE.START]);
    $(el).attr(CONST.ATTR.END,json[CONST.TITLE.END]);
    if(status === CONST.TASK_STATUS.DONE) createRepeatKanbanTask(json);
}
var createRepeatKanbanTask = function(json){
  if(json[CONST.TITLE.TITLE].indexOf('repeats')>0){
    var message = "何日後にタスクを作成しますか？";
    var value = 1;
    offsetDay = prompt(message,value);
  
    if(offsetDay > 0){
      json[CONST.TITLE.STATUS] = CONST.TASK_STATUS.NEW;
      json[CONST.TITLE.DATE] = moment().add(offsetDay, 'd').format('YYYY-MM-DD');
      json[CONST.TITLE.SPENT] = 0;
      json[CONST.TITLE.START] = "";
      json[CONST.TITLE.END] = "";
      json[CONST.TITLE.DONERATIO] = 0;
      json[CONST.TITLE.REGIST] = "";
      KanbanTest.addElement(CONST.BOARDID.NEW, json);
    }
  }
}

var visit_tabkanban_event = function(){

  //merge
  var todaycal = moment().format("YYYY-MM-DD 00:00:00");
  pastDoneData = [];

  Object.values(CONST.BOARDID).forEach(boardid => {
    // ボードの作り直し
    KanbanTest.removeBoard(boardid);
    KanbanTest.addBoards([
      CONST.BOARD_CONTENT[boardid]
    ]);

    // データ登録
    mergeddata.forEach(function(json){
        if(json[CONST.TITLE.STATUS]===CONST.BOARDID_TO_TASK[boardid]){
          // doneに過去に終了したタスクも含まれているので退避
          var isDone = (json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.DONE);
          var isToday = (todaycal === json[CONST.TITLE.DATE]);
          if(isDone && !isToday){
            pastDoneData.push(json);
            return false;
          }

          if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
          if(json[CONST.TITLE.CATEGORY].length!==0){
            if(json['header']) json['header'] += '.';
            json['header'] += json[CONST.TITLE.CATEGORY];
          }
          KanbanTest.addElement(boardid,json);
        }
    });
    // textareaを出すためにbuttonClickイベントを引く
    KanbanTest.options.buttonClick("",boardid);  
  });
};

var leave_tabkanban_event = function(){
  mergeddata=[];
  
  Object.values(CONST.BOARDID).forEach(val => {
    getTasksFromBoardElements(KanbanTest.getBoardElements(val)).forEach(task => {
      var json = convElementToJson(task);
      mergeddata.push(json);
    });
  });
  pastDoneData.forEach(function(json){
    mergeddata.push(json);
  });
};
var getAllElementCount = function(){
  var count = 0;
  Object.values(CONST.BOARDID).forEach(val => {
    count = count + getTasksFromBoardElements(KanbanTest.getBoardElements(val)).length;
  });
  count = count + pastDoneData.length
  return count;
}
var convElementToJson = function(task){
  var text = $(task).text();
  var header = $(task).find('#data-header').text();
  // 特殊文字エスケープ
  if(header){
    header = header.replace(/[\^$.*+?()[]{}|]/g, '\$&');
    text = text.replace(new RegExp(header,'g'),'');
  }
  var json = {
    [CONST.TITLE.ID]:      $(task).attr(CONST.ATTR.ID),
    [CONST.TITLE.STATUS]:  $(task).attr(CONST.ATTR.STATUS),
    [CONST.TITLE.DATE]:    $(task).attr(CONST.ATTR.DATE),
    [CONST.TITLE.PROJECT]: $(task).attr(CONST.ATTR.PROJECT),
    [CONST.TITLE.CATEGORY]:$(task).attr(CONST.ATTR.CATEGORY),
    [CONST.TITLE.TITLE]:   text,
    [CONST.TITLE.PLANH]:   $(task).attr(CONST.ATTR.PLANH),
    [CONST.TITLE.PLANM]:   $(task).attr(CONST.ATTR.PLANM),
    [CONST.TITLE.SPENT]:   $(task).attr(CONST.ATTR.SPENT),
    [CONST.TITLE.START]:   $(task).attr(CONST.ATTR.START),
    [CONST.TITLE.END]:     $(task).attr(CONST.ATTR.END),
    [CONST.TITLE.ISSUEID]: $(task).attr(CONST.ATTR.ISSUEID),
    [CONST.TITLE.DONERATIO]:$(task).attr(CONST.ATTR.DONERATIO),
    [CONST.TITLE.REGIST]:  $(task).attr(CONST.ATTR.REGIST),
  };
  if(header.length !== 0) json['header'] = header;
  return json;    
}
var getLatestEndTime = function(){
  var done_task = getTasksFromBoardElements(KanbanTest.getBoardElements(CONST.BOARDID.DONE));
  var today = moment().format('YYYY-MM-DD');
  var todayZeroTime = moment(today+'T00:00:00','YYYY-MM-DDTHH:mm:ss');
  var latestEndTime = todayZeroTime;
  done_task.forEach(function(task, index, array){
    if($(task).attr(CONST.ATTR.END).length>0){
      var endTime = moment(today+'T'+$(task).attr(CONST.ATTR.END)+'00','YYYY-MM-DDTHH:mm:ss');
      if(endTime.isAfter(latestEndTime)) latestEndTime = endTime;
    }
  });
  if(latestEndTime.isSame(todayZeroTime)){
    latestEndTime = moment();
  }
  return latestEndTime.format('HH:mm');
}
var getTasksFromBoardElements = function(boardElements){
  var output=[];
  if(boardElements){
  
    boardElements.forEach(function(elem, index, array){
      if(elem.classList.contains('kanban-item')){
        output.push(elem);
      }
    });   
  }
  return output;
}