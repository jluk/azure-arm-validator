var Guid = require('guid');
// generate a 36 char guid then encode it into base64
module.exports = {'indicator': 'GEN-BASE64', 'value': new Buffer (Guid.raw()).toString('base64')};
