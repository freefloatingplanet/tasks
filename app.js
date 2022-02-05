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


// その他のリクエストに対する404エラー
app.use((req, res) => {
  res.sendStatus(404);
});

