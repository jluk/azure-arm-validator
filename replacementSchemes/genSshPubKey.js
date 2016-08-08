var module = require('module')
var conf = require('../modules/config');

module.exports = {'indicator': 'GEN-SSH-PUB-KEY', 'value': conf.get('SSH_PUBLIC_KEY')};
