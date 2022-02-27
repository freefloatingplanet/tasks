$(function(){
    redmine_enable_event();
    redmine_testFetch_event();
  });

redmine_enable_event = function(){
    $('input:checkbox[name="redmine-enabled"]').change(function() {
        const isEnabled = $('input:checkbox[name="redmine-enabled"]').prop('checked');
        onOffRedmine(isEnabled);
        $('[id*="setting-redmine-child"]').prop('readonly',!isEnabled);
    });
}

redmine_testFetch_event = function(){
    $('#testFetch').click(function(){
        testFetchRedmine(getIssues);
    })
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

// redmineからタスクの取得
var testFetchRedmine = function(callback){
    var json = {};
    json['query'] = settingData['setting-redmine-child-query'];
    json['setting'] = settingData;
    callback(json)
    .done(function(issues){
        var output = ""; 
        issues.forEach(function(is){
            var array = [is.id,is.project.name,is.status.name,is.assigned_to.name,is.subject,is.start_date,is.due_date];
            array.join(',')
            output += array + '\n';
        })
        alert(output);
    })
    .fail(function(data){
      alert(data);
    })
   }
  