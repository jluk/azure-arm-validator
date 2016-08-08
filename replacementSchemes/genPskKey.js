var random = require("random-js");

module.exports = {'indicator': 'GEN-PSK-KEY', 'value': random.string()(random.engines.nativeMath,64)};
