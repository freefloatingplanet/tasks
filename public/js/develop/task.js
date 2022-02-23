class Task {

    #task = {};

    constructor(title){
        this.#task = {
            [CONST.TITLE.ID]:      "",
            [CONST.TITLE.STATUS]:  "",  
            [CONST.TITLE.DATE]:    "",
            [CONST.TITLE.PROJECT]: "",
            [CONST.TITLE.CATEGORY]:"",
            [CONST.TITLE.TITLE]:   title,
            [CONST.TITLE.PLANH]:   "",
            [CONST.TITLE.PLANM]:   "",
            [CONST.TITLE.SPENT]:   "",
            [CONST.TITLE.START]:   "",
            [CONST.TITLE.END]:     "",
            [CONST.TITLE.ISSUEID]:  "",
            [CONST.TITLE.DONERATIO]:"",
            [CONST.TITLE.REGIST]:   ""
        };
    }

    setTitle(title){
        this.#task[CONST.TITLE.TITLE] = title;
    }

    setId(id){
        this.#task[CONST.TITLE.ID] = id;
    }

    setStart(start){
        this.#task[CONST.TITLE.START] = start;
    }

    setDate(date){
        this.#task[CONST.TITLE.DATE] = date;
    }
    setProject(project){
        this.#task[CONST.TITLE.PROJECT] = project;
    }
    setPlanH(planh){
        this.#task[CONST.TITLE.PLANH] = planh;
        this.#task[CONST.TITLE.PLANM] = Number(planh)*60;
    }
    setIssueId(issueid){
        this.#task[CONST.TITLE.ISSUEID] = issueid;
    }

    getStart(){
        return this.#task[CONST.TITLE.START];
    }


    setTask(json){
        this.#task = json;
    }

    getTask(){
        return this.#task;
    }

    create(status){

        this.#task[CONST.TITLE.PLANH] = "0";
        this.#task[CONST.TITLE.PLANM] = "0";
        this.#task[CONST.TITLE.SPENT] = "0";
        this.#task[CONST.TITLE.DONERATIO] = 0;

        this.updateStatusTo(status);

    }

    updateSpentTime(){
        var start = this.#task[CONST.TITLE.START];
        var end = this.#task[CONST.TITLE.END];
        if(start.length !== 0 && end.length !== 0){
            var st_dt = moment('2000-01-01T'+start,'YYYY-MM-DDTHH:mm');
            var en_dt = moment('2000-01-01T'+end,'YYYY-MM-DDTHH:mm');
            var spent_m = en_dt.diff(st_dt,'minutes');

            this.#task[CONST.TITLE.SPENT] = spent_m;
        }
    }

    updateStatusTo(status){
        switch(status){
            case CONST.TASK_STATUS.NEW:
                this.#task[CONST.TITLE.STATUS] = CONST.TASK_STATUS.NEW;
                this.#task[CONST.TITLE.DATE] = "";
                this.#task[CONST.TITLE.START ] = "";
                this.#task[CONST.TITLE.END] = "";
                break;
            case CONST.TASK_STATUS.DONE:
                this.#task[CONST.TITLE.STATUS] = CONST.TASK_STATUS.DONE;
                this.#task[CONST.TITLE.DATE] = moment().format("YYYY-MM-DD 00:00:00");
                if(this.#task[CONST.TITLE.START].lenth>0) this.#task[CONST.TITLE.START] = moment().format("HH:mm");
                this.#task[CONST.TITLE.END] = moment().format("HH:mm");
                break;
            case CONST.TASK_STATUS.WORK:
                this.#task[CONST.TITLE.STATUS] = CONST.TASK_STATUS.WORK;
                this.#task[CONST.TITLE.DATE] = moment().format("YYYY-MM-DD 00:00:00");
                this.#task[CONST.TITLE.START ] = moment().format("HH:mm");
                this.#task[CONST.TITLE.END] = "";
                break;
            case CONST.TASK_STATUS.WAIT:
                this.#task[CONST.TITLE.STATUS] = CONST.TASK_STATUS.WAIT;
                this.#task[CONST.TITLE.DATE] = moment().format("YYYY-MM-DD 00:00:00");
                this.#task[CONST.TITLE.START ] = "";
                this.#task[CONST.TITLE.END] = "";
                break;
            case CONST.TASK_STATUS.PEND:
                this.#task[CONST.TITLE.STATUS] = CONST.TASK_STATUS.PEND;
                break;
        }       
    }


}