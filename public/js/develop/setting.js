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
        leave_tabsetting_event();
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
    try{
        JSON.parse(json.query);
    }catch(e){
        alert(e);
        return false;
    }
    callback(json)
    .done(function(data){
        var output = ""; 
        data.issues.forEach(function(is){
            var array = [];
            array.push(is.id               || null);
            array.push(is.project.name     || null);
            if(is.status.name) array.push(is.status.name);
            else array.push(null);
            if(is.assigned_to) array.push(is.assigned_to.name);
            else array.push(null);
            array.push(is.subject          || null);
            array.push(is.start_date       || null);
            array.push(is.due_date         || null);
            array.join(',')
            output += array + '\n';
        })
        alert(output);
    })
    .fail(function(data){
      alert(data);
    })
   }
  