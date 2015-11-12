/**
 * Copyright (C) 2015 Regents of the University of California.
 * @author: Jeff Thompson <jefft0@remap.ucla.edu>
 * @author: From ndn-group-encrypt unit tests
 * https://github.com/named-data/ndn-group-encrypt/blob/master/tests/unit-tests/consumer-db.t.cpp
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version, with the additional exemption that
 * compiling, linking, and/or using OpenSSL is allowed.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * A copy of the GNU Lesser General Public License is in the file COPYING.
 */

var assert = require("assert");
var fs = require("fs");
var Blob = require('../../..').Blob;
var Name = require('../../..').Name;
var RsaKeyParams = require('../../..').RsaKeyParams;
var RsaAlgorithm = require('../../..').RsaAlgorithm;
var AesKeyParams = require('../../..').AesKeyParams;
var AesAlgorithm = require('../../..').AesAlgorithm;
var ConsumerDbSqlite3 = require('../../..').ConsumerDbSqlite3;

var databaseFilePath;

/**
 * Generate RSA keys and return a Promise which returns an object with fields
 * encryptionKeyBlob and decryptionKeyBlob with the key blobs.
 */
function generateRsaKeysPromise()
{
  var result = {};

  var params = new RsaKeyParams();
  return RsaAlgorithm.generateKeyPromise(params)
  .then(function(decryptKey) {
    result.decryptionKeyBlob = decryptKey.getKeyBits();
    var encryptKey = RsaAlgorithm.deriveEncryptKey(result.decryptionKeyBlob);
    result.encryptionKeyBlob = encryptKey.getKeyBits();

    return Promise.resolve(result);
  });
}

/**
 * Generate AES keys and return an object with fields encryptionKeyBlob and
 * decryptionKeyBlob with the key blobs.
 */
function generateAesKeys()
{
  var result = {};

  var params = new AesKeyParams();
  var memberDecryptKey = AesAlgorithm.generateKey(params);
  result.decryptionKeyBlob = memberDecryptKey.getKeyBits();
  var memberEncryptKey = AesAlgorithm.deriveEncryptKey(result.decryptionKeyBlob);
  result.encryptionKeyBlob = memberEncryptKey.getKeyBits();

  return result;
}

describe ("TestGroupManagerDb", function() {
  before(function(done) {
    databaseFilePath = "policy_config/test.db";
    try {
      fs.unlinkSync(databaseFilePath);
    }
    catch (e) {}

    done();
  });

  after(function(done) {
    try {
      fs.unlinkSync(databaseFilePath);
    }
    catch (e) {}

    done();
  });

  it("OperateAesDecryptionKey", function(done) {
    // Test construction.
    var database = new ConsumerDbSqlite3(databaseFilePath);

    // Generate key blobs.
    keys = generateAesKeys();

    var keyName = new Name
      ("/alice/health/samples/activity/steps/C-KEY/20150928080000/20150928090000!");
    keyName.append(new Name("FOR/alice/health/read/activity!"));
    database.addKeyPromise(keyName, keys.decryptionKeyBlob)
    .then(function() {
      return database.getKeyPromise(keyName);
    })
    .then(function(resultBlob) {
      assert.ok(keys.decryptionKeyBlob.equals(resultBlob));

      return database.deleteKeyPromise(keyName);
    })
    .then(function() {
      return database.getKeyPromise(keyName);
    })
    .then(function(resultBlob) {
      assert.ok(0 == resultBlob.size());

      Promise.resolve();
    })
    // When done is called, Mocha displays errors from assert.ok.
    .then(done, done);
  });

  it("OperateRsaDecryptionKey", function(done) {
    // Test construction.
    var database = new ConsumerDbSqlite3(databaseFilePath);

    var keys;
    var keyName;

    // Generate key blobs.
    return generateRsaKeysPromise()
    .then(function(localKeys) {
      keys = localKeys;

      keyName = new Name
        ("/alice/health/samples/activity/steps/D-KEY/20150928080000/20150928090000!");
      keyName.append(new Name("FOR/test/member/KEY/123!"));
      return database.addKeyPromise(keyName, keys.decryptionKeyBlob);
    })
    .then(function() {
      return database.getKeyPromise(keyName);
    })
    .then(function(resultBlob) {
      assert.ok(keys.decryptionKeyBlob.equals(resultBlob));

      return database.deleteKeyPromise(keyName);
    })
    .then(function() {
      return database.getKeyPromise(keyName);
    })
    .then(function(resultBlob) {
      assert.ok(0 == resultBlob.size());

      Promise.resolve();
    })
    // When done is called, Mocha displays errors from assert.ok.
    .then(done, done);
  });
});
