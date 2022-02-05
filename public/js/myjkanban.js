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
        title: "Done",
        class: "success",
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
      $(el).attr(CONST.ATTR.STATUS,status);
  }


  var myjkanban_tab2_event = function(){
    KanbanTest.removeBoard("_new");
    KanbanTest.addBoards([
        {
            id: "_new",
            title: "New",
            class: "info,good",
            item: []
        }
      ]);
    newdata.forEach(function(json){
        KanbanTest.addElement("_new",json);
    });

    KanbanTest.removeBoard("_waiting");
    KanbanTest.addBoards([
        {
            id: "_waiting",
            title: "ToDo",
            class: "warning",
            item: []
        }
      ]);
    waitdata.forEach(function(json){
        KanbanTest.addElement("_waiting",json);
    });


    KanbanTest.removeBoard("_working");
    KanbanTest.addBoards([
        {
            id: "_working",
            title: "Working",
            class: "warning",
            item: []
        }
      ]);
    workdata.forEach(function(json){
        KanbanTest.addElement("_working",json);
    });

    KanbanTest.removeBoard("_done");
    KanbanTest.addBoards([
        {
            id: "_done",
            title: "Done",
            class: "success",
            item: []
        }
      ]);
    donedata.forEach(function(json){
        KanbanTest.addElement("_done",json);
    });
  };
 
  var myjkanban_tab1_event = function(){
    var new_task = KanbanTest.getBoardElements("_new");
    var wait_task = KanbanTest.getBoardElements("_waiting");
    var work_task = KanbanTest.getBoardElements("_working");
    var done_task = KanbanTest.getBoardElements("_done");

    mergeddata=[];
    
    [new_task,wait_task,work_task,done_task].forEach(function(tasks, index, array){
        tasks.forEach(function(task){
            var json = {
                [CONST.CELL_NO.ID]:      $(task).attr(CONST.ATTR.ID),
                [CONST.CELL_NO.STATUS]:  $(task).attr(CONST.ATTR.STATUS),
                [CONST.CELL_NO.DATE]:    $(task).attr(CONST.ATTR.DATE),
                [CONST.CELL_NO.PROJECT]: $(task).attr(CONST.ATTR.PROJECT),
                [CONST.CELL_NO.CATEGORY]:$(task).attr(CONST.ATTR.CATEGORY),
                [CONST.CELL_NO.TITLE]:   $(task).text(),
                [CONST.CELL_NO.PLANH]:   $(task).attr(CONST.ATTR.PLANH),
                [CONST.CELL_NO.PLANM]:   $(task).attr(CONST.ATTR.PLANM),
                [CONST.CELL_NO.SPENT]:   $(task).attr(CONST.ATTR.SPENT),
                [CONST.CELL_NO.START]:   $(task).attr(CONST.ATTR.START),
                [CONST.CELL_NO.END]:     $(task).attr(CONST.ATTR.END),
            }    
            mergeddata.push(json);
        })
    })


  };