var getIssues = function(queryJson){
    var deferred = new $.Deferred;
    $.ajax({
      type: "post",
      url:"/get-issues/",
      data: JSON.stringify(queryJson),
      contentType: 'application/json',
      dataType:"json"
    }).done((data => {
        deferred.resolve(data);
    })).fail((data) => {
        deferred.reject(data);
    });

    return deferred.promise();
  };

var registResult = function(json){
    var deferred = new $.Deferred;
    $.ajax({
        type: "post",
        url:"/regist-result/",
        data: JSON.stringify(json),
        contentType: 'application/json',
        dataType:"json"
      }).done((data => {
        deferred.resolve(data);
      })).fail((data) => {
        deferred.reject(data);
      });

      return deferred.promise();
  }

$('#getIssues').on('click',function(){
    fetchRedmine(getIssues);
});

$('#registResult').on('click',function(){
    registToRedmine(registResult);
});
