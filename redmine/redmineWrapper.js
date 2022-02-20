const redmine = require('./redmine-api-base');

let redmineWrapper = {};

redmineWrapper.getIssues = function(queryJson){
  redmine.issues(queryJson,(error,data) => {
    if(error) return error;
    else return data.issues;
  });
}

redmineWrapper.createTimeEntry = function(createJson){
  redmine.create_time_entry({
    "time_entry": createJson
  },(error,data) => {
    if(error) return error;
    else return {"result" : "ok"};
  });
}

redmineWrapper.updateIssue = function(id,updateJson){
  redmine.update_issue(
    id,
    {
    "issue":updateJson
  }, (error, data) => {
    if(error) return error;
    else return {"result" : "ok"};  
  });
}

module.exports = redmineWrapper;

// Issue を5件取得する
/*
redmine.issues({
  limit: 5
}, (error, data) => {
  if(error) throw error;
  
  // JSON を2スペースで整形して表示する
  data.issues.forEach((issue) => {
    console.log(JSON.stringify(issue, null, '  '));
  });
});
*/
/*
redmine.create_time_entry({
  "time_entry":{
    "issue_id": "17",
    "spent_on": "2022-02-22"  ,
    "hours": 1.0,
    "comments": "abcd",
    "activity_id": "7",
    "user_id": 5
  }
}, (error, data) => {
  if(error) throw error;

  console.log('ok');

});
*/

redmine.update_issue(
  17,
  {
  "issue":{
    "status_id": "3",
    "done_ratio": 100,
  }
}, (error, data) => {
  if(error) throw error;

  console.log('ok');

});
