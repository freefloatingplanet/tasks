$(function(){
    checkOn_redmine_enable();
  });

checkOn_redmine_enable = function(){
    $('input:checkbox[name="redmine-enabled"]').change(function() {
        const isEnabled = $('input:checkbox[name="redmine-enabled"]').prop('checked');
        onOffRedmine(isEnabled);
        $('[id*="setting-redmine-child"]').prop('readonly',!isEnabled);
    });
}

leave_tabsetting_event = function(){
    var json = {};
    var selectdata1 = $('[id*="setting-redmine-child"]');
    selectdata1.each(function(i,data){
        json[$(data).attr('id')] = $(data).val();
    });
    var selectdata2 = $('[id*="setting-redmine-enabled"]');
    json[selectdata2.attr('id')] = selectdata2.prop('checked');
    settingData = json;
}

visit_tabsetting_event = function(){
    var json = settingData;
    Object.keys(json).forEach(function(key){
        if(key === 'setting-redmine-enabled'){
            $('#setting-redmine-enabled').prop('checked',json[key]);
        }else{
            $('#'+key).val(json[key]);
        }
    });
}
