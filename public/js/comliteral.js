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
        END: 10
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
        END:      'end'
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
        END:      'data-end'
    },
    TASK_STATUS:{
        NEW: 'new',
        WAIT: 'waiting',
        WORK: 'working',
        DONE: 'done'
    },
    BOARDID:{
        NEW: '_new',
        WAIT: '_waiting',
        WORK: '_working',
        DONE: '_done'
    },
    BOARDID_TO_TASK:{
        _new: 'new',
        _waiting: 'waiting',
        _working: 'working',
        _done: 'done'
    },
    OFFSET:{
        DEFAULT: 10000,
        DONE: 30000
    }
};
