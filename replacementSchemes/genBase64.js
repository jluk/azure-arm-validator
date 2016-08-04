var module = require('module')
var Guid = require('guid');

var conf = require('../modules/config');

var replacementScheme = {'indicator': 'BASE64_REPLACE_INDICATOR', 'value': 'test'};

module.exports = {'replacementScheme': replacementScheme}