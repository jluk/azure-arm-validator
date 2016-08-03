var module = require('module')
var Guid = require('guid');

var conf = require('../modules/config');

var replacementScheme = {'indicator': 'GUID_REPLACE_INDICATOR', 'value': Guid.raw()};

module.exports = {'replacementScheme': replacementScheme}