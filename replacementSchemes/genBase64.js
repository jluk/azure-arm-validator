var module = require('module')
var generaterandom = require('generaterandom');

var conf = require('../modules/config');

var replacementScheme = {'indicator': 'BASE64_REPLACE_INDICATOR', 'value': Guid.raw().subString(0,5).toString('base64')};

module.exports = {'replacementScheme': replacementScheme}