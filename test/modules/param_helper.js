/*global describe, it*/
/*jshint multistr: true */
var fs = require('fs');
var assert = require('assert');
require('../helpers/setup_env');
var conf = require('../../modules/config');

describe('Parameter Helper Tests', () => {

  it('Should replace ' + conf.get('PARAM_REPLACE_INDICATOR') + ' placeholder with a unique 16 character parameter', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = conf.get('PARAM_REPLACE_INDICATOR');
    assert(parameterString.match(new RegExp(placeholder, 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.json \
      Expected ./test/assets/dokku-vm/azuredeploy.parameters.json to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);

    parameters = paramHelper.replaceKeyParameters(parameters);

    // check dnsName is 18 chars
    assert.equal(parameters.parameters.dnsNameForPublicIP.value.length, 18,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.dnsNameForPublicIP.length to be 18.');
    // check storageAccountName is 18 chars
    assert.equal(parameters.parameters.newStorageAccountName.value.length, 18,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.newStorageAccountName.length to be 18.');
    // check dnsName is not the same as storageAccountName
    assert.notEqual(parameters.parameters.dnsNameForPublicIP.value, parameters.parameters.newStorageAccountName.value,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.newStorageAccountName and parameters.paramters.dnsNameForPublicIP to not be equal.');

    parameterString = JSON.stringify(parameters);

    assert.equal(parameterString.match(new RegExp(placeholder, 'g')), null, 'In \
      ./test/assets/dokku-vm/azuredeploy.parameters.json \
      Expected all GEN-UNIQUE parameters to be replaced');
  });

  it('Should replace ' + conf.get('PARAM_REPLACE_INDICATOR') + '-[N] placeholder with a unique [N] character parameter', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = conf.get('PARAM_REPLACE_INDICATOR');

    assert(parameterString.match(new RegExp(placeholder + '-\\d+', 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json \
      Expected ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);

    parameters = paramHelper.replaceKeyParameters(parameters);

    assert.equal(parameters.parameters.dnsNameForPublicIP.value.length, 24,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.dnsNameForPublicIP.length to be 24.');
    assert.equal(parameters.parameters.adminUsername.value.length, 8,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.adminUsername.length to be 8.');
    assert.equal(parameters.parameters.newStorageAccountName.value.length, 8,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.newStorageAccountName.length to be 8.');

    parameterString = JSON.stringify(parameters);

    // check all placeholders are gone
    assert.equal(parameterString.match(new RegExp(placeholder + '-\\d+'), null, 'Expected all ' + placeholder + '-[N] parameters to be replaced'));
  });

  it('Should fail to parse ' + conf.get('PARAM_REPLACE_INDICATOR') + '-[N] placeholders with invalid lengths', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = conf.get('PARAM_REPLACE_INDICATOR');

    assert(parameterString.match(new RegExp(placeholder + '-\\d+', 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json \
      Expected to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);
    // inject bad parameter
    parameters.parameters.adminUsername = conf.get('PARAM_REPLACE_INDICATOR') + '-33';

    assert.throws(() => {
      paramHelper.replaceKeyParameters(parameters);
    });
    // inject bad parameter
    parameters.parameters.adminUsername = conf.get('PARAM_REPLACE_INDICATOR') + '-1';

    assert.throws(() => {
      paramHelper.replaceKeyParameters(parameters);
    });

    // inject bad parameter
    parameters.parameters.adminUsername = conf.get('PARAM_REPLACE_INDICATOR') + '-2';

    assert.throws(() => {
      paramHelper.replaceKeyParameters(parameters);
    });

    // inject good parameter
    parameters.parameters.adminUsername = conf.get('PARAM_REPLACE_INDICATOR') + '-12';

    assert.doesNotThrow(() => {
      paramHelper.replaceKeyParameters(parameters);
    });
  });

  // TEST SSH-KEY
  it('Should replace GEN-SSH-PUB-KEY with an ssh key.', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = 'GEN-SSH-PUB-KEY';

    // check the specific gen-xxxx exists in conf and azuredeploy.json
    assert(parameterString.match(new RegExp(placeholder, 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json \
Expected ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);

    parameters = paramHelper.replaceKeyParameters(parameters);

    assert.equal(parameters.parameters.sshKeyData.value.length, 394,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.sshKeyData.length to be 394. SSHKEY: ' + parameters.parameters.sshKeyData.value);

    parameterString = JSON.stringify(parameters);

    // check all placeholders are gone
    assert.equal(parameterString.match(new RegExp(placeholder + '-\\d+'), null, 'Expected all ' + placeholder + ' gen-guid parameters to be replaced'));
  });

  // TEST GEN-GUID
  it('Should replace ' + conf.get('GUID_REPLACE_INDICATOR') + ' with a guid placeholder for a guid required parameter.', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = conf.get('GUID_REPLACE_INDICATOR');

    // check the specific gen-xxxx exists in conf and azuredeploy.json
    assert(parameterString.match(new RegExp(placeholder, 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json \
      Expected ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);

    parameters = paramHelper.replaceKeyParameters(parameters);

    // check jobId is 36 chars
    assert.equal(parameters.parameters.jobId.value.length, 36,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected parameters.parameters.jobId.length to be 36. GUID: ' + parameters.parameters.jobId.value);

    parameterString = JSON.stringify(parameters);

    // check all placeholders are gone
    assert.equal(parameterString.match(new RegExp(placeholder + '-\\d+'), null, 'Expected all ' + placeholder + ' gen-guid parameters to be replaced'));
  });

  // TEST GEN-BASE64
  it('Should replace ' + conf.get('BASE64_REPLACE_INDICATOR') + ' with a guid placeholder for a guid required parameter.', () => {
    // first read the sample template
    var paramHelper = require('../../modules/param_helper');
    var parameterString = fs.readFileSync('./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json', {
      encoding: 'utf8'
    }).trim();

    var placeholder = conf.get('BASE64_REPLACE_INDICATOR');

    // check the specific gen-xxxx exists in conf and azuredeploy.json
    assert(parameterString.match(new RegExp(placeholder, 'g')).length > 0,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json \
      Expected ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json to have GEN-UNIQUE placeholders');
    var parameters = JSON.parse(parameterString);

    parameters = paramHelper.replaceKeyParameters(parameters);

    // check base64 string is 48 chars after encoding a 36 char string
    assert.equal(parameters.parameters.base64.value.length, 48,
      'In ./test/assets/dokku-vm/azuredeploy.parameters.gen_unique_var.json Expected base64 encoded string: ' + parameters.parameters.base64.value);

    parameterString = JSON.stringify(parameters);

    // check all placeholders are gone
    assert.equal(parameterString.match(new RegExp(placeholder + '-\\d+'), null, 'Expected all ' + placeholder + ' gen-guid parameters to be replaced'));
  });

});
