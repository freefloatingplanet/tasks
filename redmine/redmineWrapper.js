const Redmine = require('node-redmine');


let redmineWrapper = {};

redmineApiBase = function(settingJson){
  var hostName = settingJson['setting-redmine-child-baseurl'];
  var config = {
    apiKey: settingJson['setting-redmine-child-apikey']
  }
  var redmine = new Redmine(hostName, config);

  return redmine;

}

redmineWrapper.getIssues = (queryJson) => {
  return new Promise((resolve, reject) => {
    console.log(queryJson);
    var redmine = redmineApiBase(queryJson.setting);
    var toString = Object.prototype.toString;
    try{
      var query = JSON.parse(queryJson.query);
    } catch(e){
      console.error(e);
    }
    redmine.issues(query,(error,data) => {
      console.log(data.issues);
      if(error) reject(error);
      else resolve(data.issues);
    })
  })
}

/*
  "time_entry":{
    "issue_id": "17",
    "spent_on": "2022-02-23"  ,
    "hours": 1.0,
    "comments": "abcd"
  }
*/
redmineWrapper.createTimeEntry = (createJson) => {
  return new Promise((resolve, reject) => {
    var json = {
      "issue_id": createJson.issue_id,
      "spent_on": createJson.date ,
      "hours": Number(createJson.spent_m)/60,
      "comments": createJson.title
    };
    var redmine = redmineApiBase(createJson.setting);
    redmine.create_time_entry({
      "time_entry": json
    },(error,data) => {
      if(error) reject(error);
      else resolve(createJson);
    });
    
  })

}

/*
  "issue":{
    "status_id": "3",
    "done_ratio": 100,
  }
*/
redmineWrapper.updateIssue = (updateJson) => {
  return new Promise((resolve, reject) => {
    
    var json = {
      "status_id": updateJson.status_id,
      "done_ratio": updateJson.done_ratio
    };
    if(json.done_ratio === 100) json['status_id'] = 3;
    else if(json.done_ratio === 0) json['status_id'] = 1;

    var redmine = redmineApiBase(updateJson.setting);
    redmine.update_issue(
      updateJson.issue_id,
      {
      "issue":json
    },(error, data) => {
      if(error) reject(error);
      else resolve(updateJson);  
    });
  
  })
}
module.exports = redmineWrapper;



