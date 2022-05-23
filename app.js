/**
 * /app.js
 */ 
// express モジュールのインスタンス作成
const express = require('express');
const app = express();
// パス指定用モジュール
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs').promises
// redmine用モジュール
const redmineWrapper = require('./redmine/redmineWrapper');
const moment = require('moment');

const taskfile = './csv/task.json';
const memofile = './csv/memo.json';
const settingfile = './csv/setting.json';
const logfile = './csv/log.txt';

// 8080番ポートで待ちうける
app.listen(8080, () => {
  console.log('Running at Port 8080...');
});

const writelog = async(message) => {
  try{
    let m = moment();
    await fs.writeFile(logfile,`[${m.format('YYYY/MM/DD hh:mm:ss')}] ${message}`);
  }catch{
    console.log(e);
  }
}

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

// CSV書き込み
const writeData = async(datafile,data) => {
  try{
    await fs.writeFile(datafile,data);
    let m = moment();
    const backupfile = datafile+m.format('YYYYMMDD');
    await fs.copyFile(datafile, backupfile);
  } catch(e){
    console.log(e);
    writelog(e);
  }
}


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/csvwrite/',(req,res) => {
  console.log(req.body);
  if(req.body && Object.keys(req.body).length===1){
    let key = Object.keys(req.body)[0];
    let datafile = "";
    switch(key){
      case "task":
        datafile = taskfile;
        break;
      case "memo":
        datafile = memofile;
        break;
      case "setting":
        datafile = settingfile;
        break;
    }
    writeData(datafile,JSON.stringify(req.body));
    res.send("Received Post Data");

  }else{
    writelog(`illigal request format: ${req.body}`);
  }
});

// CSV取得
const readData = async(datatype) => {
  try{
    let readfile;
    switch(datatype){
      case "task":
        readfile = taskfile;
        break;
      case "memo":
        readfile = memofile;
        break;
      case "setting":
        readfile = settingfile;
        break;
    }
    const output = await fs.readFile(readfile,'utf8');
    return output;
  } catch(e){
    console.log(e);
    writelog(e);
  }
}

app.post('/csvread/task/',(req,res) => {
  console.log(req.body);
  const data = readData("task");
  data.then(d=>res.send(d));
});

app.post('/csvread/memo/',(req,res) => {
  console.log(req.body);
  const data = readData("memo");
  data.then(d=>res.send(d));
});

app.post('/csvread/setting/',(req,res) => {
  console.log(req.body);
  const data = readData("setting");
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
      writelog(error);   
    })
});

// 作業時間登録
app.post('/create-time-entry/',(req,res) => {
  redmineWrapper.createTimeEntry(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);
      writelog(error);
    })
});

// チケット更新
app.post('/update-issue/',(req,res) => {
  redmineWrapper.updateIssue(req.body)
    .then(data => {
      res.send(data);    
    }).catch(error => {
      res.send(error);
      writelog(error);
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
    writelog(error);
  });
});


// その他のリクエストに対する404エラー
app.use((req, res) => {
  res.sendStatus(404);
});

