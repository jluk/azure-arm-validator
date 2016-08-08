var Guid = require('guid');

module.exports = {'indicator': 'GEN-BASE64', 'value': new Buffer (Guid.raw()).toString('base64')};
