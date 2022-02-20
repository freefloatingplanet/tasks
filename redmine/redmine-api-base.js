const Redmine = require('node-redmine');

const hostName = 'http://192.168.11.160/';  // Redmine の URL
const config = {
  apiKey: '74220fe40c4b5b8ee5c97cc99e54d8e3e02e15bd'
};
const redmine = new Redmine(hostName, config);

module.exports = redmine;
