var module = require('module')
var Guid = require('guid');

var conf = require('../modules/config');

var replacementScheme = {'indicator': 'BASE64_REPLACE_INDICATOR', 'value': Guid.raw().subString(0,5).toString('base64')};

module.exports = {'replacementScheme': replacementScheme}