
const moment = require('moment');
const fs = require('fs').promises
const logger = require('./logger');

const taskfile = './csv/task.json';
const memofile = './csv/memo.json';
const settingfile = './csv/setting.json';


let dataAccessor = {};

// CSV書き込み
dataAccessor.writeData = async(datatype,data) => {
  let datafile = "";
  switch(datatype){
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
  try{
    await fs.writeFile(datafile,data);
    let m = moment();
    const backupfile = datafile+m.format('YYYYMMDD');
    await fs.copyFile(datafile, backupfile);
  } catch(e){
    console.log(e);
    logger.writelog(e);
  }
}

// CSV取得
dataAccessor.readData = async(datatype) => {
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
    logger.writelog(e);
  }
}

module.exports = dataAccessor;



