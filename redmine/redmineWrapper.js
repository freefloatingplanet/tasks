const redmine = require('./redmine-api-base');

let redmineWrapper = {};

redmineWrapper.getIssues = (queryJson) => {
  return new Promise((resolve, reject) => {
    redmine.issues(queryJson,(error,data) => {
      console.log(data);
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
    }  ;
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



