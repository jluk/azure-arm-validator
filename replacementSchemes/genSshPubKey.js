var module = require('module')
var conf = require('../modules/config');
var assert = require('assert')

assert.equal(0,1, conf.get('SSH_PUBLIC_KEY'));
module.exports = {'indicator': 'GEN-SSH-PUB-KEY', 'value': conf.get('SSH_PUBLIC_KEY')};
