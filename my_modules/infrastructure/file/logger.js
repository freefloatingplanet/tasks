
const moment = require('moment');
const fs = require('fs').promises

let logger = {};

const logfile = './csv/log.txt';
logger.writelog = async(message) => {
  try{
    let m = moment();
    await fs.writeFile(logfile,`[${m.format('YYYY/MM/DD hh:mm:ss')}] ${message}`);
  }catch{
    console.log(e);
  }
}

module.exports = logger;



