/**
 * /app.js
 */ 
// express モジュールのインスタンス作成
const express = require('express');
const app = express();
// パス指定用モジュール
const path = require('path');
const bodyParser = require('body-parser')
// redmine用モジュール
const redmineWrapper = require('./my_modules/infrastructure/redmine/redmineWrapper');

const logger = require('./my_modules/infrastructure/file/logger');
const da = require('./my_modules/infrastructure/file/dataAccessor');



// 8080番ポートで待ちうける
app.listen(8080, () => {
  console.log('Running at Port 8080...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// 書き込み
app.post('/csvwrite/',(req,res) => {
  console.log(req.body);
  if(req.body && Object.keys(req.body).length===1){
    let datatype = Object.keys(req.body)[0];
    da.writeData(datatype,JSON.stringify(req.body));
    res.send("Received Post Data");

  }else{
    logger.writelog(`illigal request format: ${req.body}`);
  }
});

// 読み込み
app.post('/csvread/task/',(req,res) => {
  console.log(req.body);
  const data = da.readData("task");
  data.then(d=>res.send(d));
});

app.post('/csvread/memo/',(req,res) => {
  console.log(req.body);
  const data = da.readData("memo");
  data.then(d=>res.send(d));
});

app.post('/csvread/setting/',(req,res) => {
  console.log(req.body);
  const data = da.readData("setting");
  data.then(d=>res.send(d));
});


// チケット取得
app.post('/get-issues/',(req,res) => {
  console.log(req.body);
  redmineWrapper.getIssues(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);
      logger.writelog(error);   
    })
});

// 作業時間登録
app.post('/create-time-entry/',(req,res) => {
  redmineWrapper.createTimeEntry(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);
      logger.writelog(error);
    })
});

// チケット更新
app.post('/update-issue/',(req,res) => {
  redmineWrapper.updateIssue(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);
      logger.writelog(error);
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
    logger.writelog(error);
  });
});


// その他のリクエストに対する404エラー
app.use((req, res) => {
  res.sendStatus(404);
});

