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
    if(status === CONST.BOARDID.DONE){
        offset = CONST.OFFSET.DONE;
    }

    var json = {
        [CONST.TITLE.ID]:      nextid + offset,
        [CONST.TITLE.STATUS]:  status,  
        [CONST.TITLE.DATE]:    "",
        [CONST.TITLE.PROJECT]: "",
        [CONST.TITLE.CATEGORY]:"",
        [CONST.TITLE.TITLE]:   title,
        [CONST.TITLE.PLANH]:   "",
        [CONST.TITLE.PLANM]:   "",
        [CONST.TITLE.SPENT]:   "",
        [CONST.TITLE.START]:   "",
        [CONST.TITLE.END]:     "",
    };

    return json;
  };

  var dropTask = function(el){

      var taskid = $(el).attr(CONST.ATTR.ID);
      var boardid = KanbanTest.getParentBoardID(taskid);
      var status = CONST.BOARDID_TO_TASK[boardid];
      var date = $(el).attr(CONST.ATTR.DATE);
      var start = $(el).attr(CONST.ATTR.START);
      var end = $(el).attr(CONST.ATTR.END);

      switch(status){
        case CONST.TASK_STATUS.DONE:
          date = moment().format("YYYY/MM/DD");
          if(start.length===0) start = moment().format("HH:mm");
          end = moment().format("HH:mm");
          break;
        case CONST.TASK_STATUS.WORK:
          date = moment().format("YYYY/MM/DD");
          start = moment().format("HH:mm");
          end = "";
          break;
        case CONST.TASK_STATUS.WAIT:
          date = moment().format("YYYY/MM/DD");
          start = "";
          end = "";
          break;
        case CONST.TASK_STATUS.NEW:
          date = "";
          start = "";
          end = "";
          break;
      }

      $(el).attr(CONST.ATTR.STATUS,status);
      $(el).attr(CONST.ATTR.DATE,date);
      $(el).attr(CONST.ATTR.START,start);
      $(el).attr(CONST.ATTR.END,end);

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
    var today = moment().format("YYYY-MM-DD 00:00:00");
    pastDoneData = [];
    mergeddata.forEach(function(json){
      if(json[CONST.TITLE.STATUS]===CONST.TASK_STATUS.DONE){
        if(json[CONST.TITLE.DATE]===today){
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
            var json = {
                [CONST.TITLE.ID]:      $(task).attr(CONST.ATTR.ID),
                [CONST.TITLE.STATUS]:  $(task).attr(CONST.ATTR.STATUS),
                [CONST.TITLE.DATE]:    $(task).attr(CONST.ATTR.DATE),
                [CONST.TITLE.PROJECT]: $(task).attr(CONST.ATTR.PROJECT),
                [CONST.TITLE.CATEGORY]:$(task).attr(CONST.ATTR.CATEGORY),
                [CONST.TITLE.TITLE]:   $(task).text(),
                [CONST.TITLE.PLANH]:   $(task).attr(CONST.ATTR.PLANH),
                [CONST.TITLE.PLANM]:   $(task).attr(CONST.ATTR.PLANM),
                [CONST.TITLE.SPENT]:   $(task).attr(CONST.ATTR.SPENT),
                [CONST.TITLE.START]:   $(task).attr(CONST.ATTR.START),
                [CONST.TITLE.END]:     $(task).attr(CONST.ATTR.END),
            }    
            mergeddata.push(json);
        });
    });

    pastDoneData.forEach(function(json){
      mergeddata.push(json);
    });



  };