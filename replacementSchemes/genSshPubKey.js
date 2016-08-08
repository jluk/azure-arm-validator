var module = require('module')
var conf = require('../modules/config');

module.exports = {'indicator': 'SSH_KEY_REPLACE_INDICATOR', 'value': conf.get('SSH_PUBLIC_KEY')};
