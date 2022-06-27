
const moment = require('moment');
const fs = require('fs').promises

const option = {flag : 'a'};

let logger = {};

const logfile = './csv/log.txt';
logger.writelog = async(message) => {
  try{
    let m = moment();
    await fs.writeFile(logfile,`${m.format('YYYY/MM/DD hh:mm:ss')}, ${message}\n`,option);
  }catch{
    console.log(e);
  }
}

module.exports = logger;



