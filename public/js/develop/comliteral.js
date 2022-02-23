const CONST = {
    CELL_NO : {
        ID: 0,
        STATUS: 1,
        DATE: 2,
        PROJECT: 3,
        CATEGORY: 4,
        TITLE: 5,
        PLANH: 6,
        PLANM: 7,
        SPENT: 8,
        START: 9,
        END: 10,
        ISSUEID: 11,
        DONERATIO: 12,
        REGIST: 13
    },
    TITLE:{
        ID:       'id',
        STATUS:   'status',
        DATE:     'date',
        PROJECT:  'project',
        CATEGORY: 'category',
        TITLE:    'title',
        PLANH:    'plan_h',
        PLANM:    'plan_m',
        SPENT:    'spent_m',
        START:    'start',
        END:      'end',
        ISSUEID:  'issue_id',
        DONERATIO:'done_ratio',
        REGIST:   'regist'
    },
    ATTR:{
        ID:       'data-eid',
        STATUS:   'data-status',
        DATE:     'data-date',
        PROJECT:  'data-project',
        CATEGORY: 'data-category',
        TITLE:    'data-title',
        PLANH:    'data-plan_h',
        PLANM:    'data-plan_m',
        SPENT:    'data-spent_m',
        START:    'data-start',
        END:      'data-end',
        ISSUEID:  'data-issue_id',
        DONERATIO:'data-done_ratio',
        REGIST:   'data-regist'
    },
    TASK_STATUS:{
        NEW: 'new',
        WAIT: 'waiting',
        WORK: 'working',
        DONE: 'done',
        PEND: 'pending'
    },
    BOARDID:{
        NEW: '_new',
        WAIT: '_waiting',
        WORK: '_working',
        DONE: '_done',
        PEND: '_pending'
    },
    BOARDID_TO_TASK:{
        _new: 'new',
        _waiting: 'waiting',
        _working: 'working',
        _done: 'done',
        _pending: 'pending'
    },
    NO_TO_BOARDID:{
        0: '_new',
        1: '_waiting',
        2: '_working',
        3: '_done',
        4: '_pending'
    },
    BOARDID_TO_NO:{
        _new:    '0',
        _waiting:'1',
        _working:'2',
        _done:   '3',
        _pending:'4'
    },
    NUMBER_STATUS: 5,
    OFFSET:{
        DEFAULT: 10000,
        DONE: 30000
    }
};
