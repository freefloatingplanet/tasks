var KanbanTest = new jKanban({
    element: "#myKanban",
    gutter: "5px",
    widthBoard: "340px",
    itemHandleOptions:{
      enabled: true,
    },
    click: function(el) {
      console.log("Trigger on all items click!");
    },
    dblclick: function(el) {
      moveTask(el);
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
      console.log(el);
      console.log(boardId);
      // create a form to enter element
      var formItem = document.createElement("form");
      formItem.setAttribute("class", "itemform");
      formItem.innerHTML =
        '<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>';

      KanbanTest.addForm(boardId, formItem);
      formItem.addEventListener("submit", function(e) {
        e.preventDefault();
        var text = e.target[0].value;
        KanbanTest.addElement(boardId, createTask(boardId, text));
        formItem.parentNode.removeChild(formItem);
      });
      document.getElementById("CancelBtn").onclick = function() {
        formItem.parentNode.removeChild(formItem);
      };
    },
    itemAddOptions: {
      enabled: true,
      content: '+ Add New Card',
      class: 'custom-button',
      footer: true
    },
    boards: [
      {
        id: "_new",
        title: "New",
        class: "info,good",
        item: []
      },
      {
        id: "_waiting",
        title: "ToDo",
        class: "warning",
        item: []
      },
      {
        id: "_working",
        title: "Working",
        class: "warning",
        item: []
      },
      {
        id: "_done",
        title: "Done(Today)",
        class: "success",
        item: []
      },
      {
        id: "_pending",
        title: "Pending",
        class: "info",
        item: []
      }

    ]
  });



  var createTask = function(boardId, title){

    var status = CONST.BOARDID_TO_TASK[boardId];
    var nextid = KanbanTest.getBoardElements.length;
    var offset = CONST.OFFSET.DEFAULT;

    var t = new Task(title);
    t.create(status);
    t.setId(nextid+offset);

    return t.getTask();
  };

  var moveTask = function(el){
    var elid = $(el).attr(CONST.ATTR.ID);
    var boardid = KanbanTest.getParentBoardID(elid);
    var no = CONST.BOARDID_TO_NO[boardid];
    var nextno = (Number(no) + 1)%CONST.NUMBER_STATUS;
    var nextboardid = CONST.NO_TO_BOARDID[nextno];
    KanbanTest.removeElement(elid);
    KanbanTest.addElement(nextboardid, convElementToJson(el));
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
  }


  var myjkanban_tabkanban_event = function(){
    //NEW
    KanbanTest.removeBoard(CONST.BOARDID.NEW);
    KanbanTest.addBoards([
        {
            id: CONST.BOARDID.NEW,
            title: "New",
            class: "info,good",
            item: []
        }
      ]);
    mergeddata.forEach(function(json){
        if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.NEW){
          if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
          if(json[CONST.TITLE.CATEGORY].length!==0){
            if(json['header']) json['header'] += '.';
            json['header'] += json[CONST.TITLE.CATEGORY];
          }
          KanbanTest.addElement(CONST.BOARDID.NEW,json);
        }
    });

    //WAIT
    KanbanTest.removeBoard(CONST.BOARDID.WAIT);
    KanbanTest.addBoards([
        {
            id: CONST.BOARDID.WAIT,
            title: "ToDo",
            class: "warning",
            item: []
        }
      ]);
    mergeddata.forEach(function(json){
      if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.WAIT){
        if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
        if(json[CONST.TITLE.CATEGORY].length!==0){
          if(json['header']) json['header'] += '.';
          json['header'] += json[CONST.TITLE.CATEGORY];
        }
        KanbanTest.addElement(CONST.BOARDID.WAIT,json);
      }
    });

    //WORK
    KanbanTest.removeBoard(CONST.BOARDID.WORK);
    KanbanTest.addBoards([
        {
            id: CONST.BOARDID.WORK,
            title: "Working",
            class: "warning",
            item: []
        }
      ]);
    mergeddata.forEach(function(json){
      if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.WORK){
        if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
        if(json[CONST.TITLE.CATEGORY].length!==0){
          if(json['header']) json['header'] += '.';
          json['header'] += json[CONST.TITLE.CATEGORY];
        }
        KanbanTest.addElement(CONST.BOARDID.WORK,json);
      }
    });

    //DONE
    KanbanTest.removeBoard(CONST.BOARDID.DONE);
    KanbanTest.addBoards([
        {
            id: CONST.BOARDID.DONE,
            title: "Done(Today)",
            class: "success",
            item: []
        }
      ]);
    var todaycal = moment().format("YYYY-MM-DD 00:00:00");
    var today = moment().format("YYYY/MM/DD");
    pastDoneData = [];
    mergeddata.forEach(function(json){
      if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.DONE){
        if([today, todaycal].includes(json[CONST.TITLE.DATE])){
          if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
          if(json[CONST.TITLE.CATEGORY].length!==0){
            if(json['header']) json['header'] += '.';
            json['header'] += json[CONST.TITLE.CATEGORY];
          }
          KanbanTest.addElement(CONST.BOARDID.DONE,json);
        }else{
          pastDoneData.push(json);
        }
      }
    });

    //PEND
    KanbanTest.removeBoard(CONST.BOARDID.PEND);
    KanbanTest.addBoards([
        {
            id: CONST.BOARDID.PEND,
            title: "Pending",
            class: "info",
            item: []
        }
      ]);
    mergeddata.forEach(function(json){
      if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.PEND){
        if(json[CONST.TITLE.PROJECT].length!==0) json['header'] = json[CONST.TITLE.PROJECT];
        if(json[CONST.TITLE.CATEGORY].length!==0){
          if(json['header']) json['header'] += '.';
          json['header'] += json[CONST.TITLE.CATEGORY];
        }
        KanbanTest.addElement(CONST.BOARDID.PEND,json);
      }
    });

  
  };
 
  var myjkanban_tabtask_event = function(){
    var new_task = KanbanTest.getBoardElements(CONST.BOARDID.NEW);
    var wait_task = KanbanTest.getBoardElements(CONST.BOARDID.WAIT);
    var work_task = KanbanTest.getBoardElements(CONST.BOARDID.WORK);
    var done_task = KanbanTest.getBoardElements(CONST.BOARDID.DONE);
    var pend_task = KanbanTest.getBoardElements(CONST.BOARDID.PEND);

    mergeddata=[];
    
    [new_task,wait_task,work_task,done_task,pend_task].forEach(function(tasks, index, array){
        tasks.forEach(function(task){
            var json = convElementToJson(task);
            mergeddata.push(json);
        });
    });

    pastDoneData.forEach(function(json){
      mergeddata.push(json);
    });



  };
  var convElementToJson = function(task){

    var text = $(task).text();
    var header = $(task).find('#data-header').text();
    if(header.lenth !== 0) text = text.replace(new RegExp(header,'g'),'');

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
    };

    if(header.length !== 0) json['header'] = header;

    return json;    
  }

  var getLatestEndTime = function(){
    var done_task = KanbanTest.getBoardElements(CONST.BOARDID.DONE);
    var today = moment().format('YYYY/MM/DD');
    var todayZeroTime = moment(today+'T00:00:00','YYYY/MM/DDTHH:mm:ss');
    var latestEndTime = todayZeroTime;

    done_task.forEach(function(task, index, array){
      if($(task).attr(CONST.ATTR.END).length>0){
        var endTime = moment(today+'T'+$(task).attr(CONST.ATTR.END)+'00','YYYY/MM/DDTHH:mm:ss');
        if(endTime.isAfter(latestEndTime)) latestEndTime = endTime;
      }
    });

    if(latestEndTime.isSame(todayZeroTime)){
      latestEndTime = moment();
    }

    return latestEndTime.format('HH:mm');
  }

