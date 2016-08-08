var Guid = require('guid');

module.exports = {'indicator': 'BASE64_REPLACE_INDICATOR', 'value': new Buffer (Guid.raw()).toString('base64')};
