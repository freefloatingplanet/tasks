
const moment = require('moment');
const fs = require('fs').promises
const logger = require('./logger');


let dataAccessor = {};

dataAccessor.TASKFILE = './csv/task.json';
dataAccessor.MEMOFILE = './csv/memo.json';
dataAccessor.SETTINGFILE = './csv/setting.json';

// CSV書き込み
dataAccessor.writeData = async(datatype,data) => {
  let datafile = dataAccessor.getDataFileName(datatype);
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
  let readfile = dataAccessor.getDataFileName(datatype);
  try{
    const output = await fs.readFile(readfile,'utf8');
    return output;
  } catch(e){
    console.log(e);
    logger.writelog(e);
  }
}

dataAccessor.getDataFileName = (datatype) => {
  let filename = "";
  switch(datatype){
    case "task":
      filename = dataAccessor.TASKFILE;
      break;
    case "memo":
      filename = dataAccessor.MEMOFILE;
      break;
    case "setting":
      filename = dataAccessor.SETTINGFILE;
      break;
  }
  return filename;
}

module.exports = dataAccessor;



