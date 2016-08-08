var Guid = require('guid');

module.exports = {'indicator': 'PASSWORD_REPLACE_INDICATOR', 'value': 'ciP$ss' + Guid.raw().replace(/-/g, '').substring(0, 16)};

