var get_memodata_fromId = function(){
    memodata = $("#memodata").val();
}

var leave_tabfree_event = function(){
    get_memodata_fromId();
}

var visit_tabfree_event = function(){
    $("#memodata").val(memodata);
}