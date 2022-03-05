/**
 * /app.js
 */ 
// express モジュールのインスタンス作成
const express = require('express');
const app = express();
// パス指定用モジュール
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')
// redmine用モジュール
const redmineWrapper = require('./redmine/redmineWrapper');



// 8080番ポートで待ちうける
app.listen(8080, () => {
  console.log('Running at Port 8080...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

// CSV書き込み
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/csvwrite/',(req,res) => {
  console.log(req.body);
  fs.writeFile('./csv/task.json',JSON.stringify(req.body),(err)=>{
    if(err){
      console.log(err);
      throw err;
    }
  });
  res.send("Received Post Data");
});

// CSV取得
app.post('/csvread/',(req,res) => {
  console.log(req.body);
  fs.readFile('./csv/task.json','utf8',(err,data) => {
    if(err){
      console.log(err);
      throw err;
    }
    console.log(data);
    res.send(data);
  })
});

// チケット取得
app.post('/get-issues/',(req,res) => {
  console.log(req.body);
  redmineWrapper.getIssues(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);    
    })
});

// 作業時間登録
app.post('/create-time-entry/',(req,res) => {
  redmineWrapper.createTimeEntry(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);    
    })
});

// チケット更新
app.post('/update-issue/',(req,res) => {
  redmineWrapper.updateIssue(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);    
    })
});

// チケット更新
app.post('/regist-result/',(req,res) => {
  redmineWrapper.createTimeEntry(req.body).then(() =>
  { 
    return redmineWrapper.updateIssue(req.body);
  })
  .then((result) => 
  {
    res.send(result);
  })
  .catch((error) => 
  {
    res.send(error);    
  });
});


// その他のリクエストに対する404エラー
app.use((req, res) => {
  res.sendStatus(404);
});

