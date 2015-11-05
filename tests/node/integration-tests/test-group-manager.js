/**
 * Copyright (C) 2015 Regents of the University of California.
 * @author: Jeff Thompson <jefft0@remap.ucla.edu>
 * @author: From ndn-group-encrypt unit tests
 * https://github.com/named-data/ndn-group-encrypt/blob/master/tests/unit-tests/group-manager.t.cpp
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
var GroupManager = require('../../..').GroupManager;
var GroupManagerDbSqlite3 = require('../../..').GroupManagerDbSqlite3;
var EncryptedContent = require('../../..').EncryptedContent;
var EncryptParams = require('../../..').EncryptParams;
var EncryptAlgorithmType = require('../../..').EncryptAlgorithmType;
var RsaKeyParams = require('../../..').RsaKeyParams;
var RsaAlgorithm = require('../../..').RsaAlgorithm;
var AesAlgorithm = require('../../..').AesAlgorithm;
var PublicKey = require('../../..').PublicKey;
var Name = require('../../..').Name;
var Blob = require('../../..').Blob;
var TlvWireFormat = require('../../..').TlvWireFormat;
var MemoryIdentityStorage = require('../../..').MemoryIdentityStorage;
var MemoryPrivateKeyStorage = require('../../..').MemoryPrivateKeyStorage;
var KeyChain = require('../../..').KeyChain;
var IdentityManager = require('../../..').IdentityManager;
var NoVerifyPolicyManager = require('../../..').NoVerifyPolicyManager;
var IdentityCertificate = require('../../..').IdentityCertificate;
var Common = require('../unit-tests/unit-tests-common.js').UnitTestsCommon;

var SIG_INFO = new Buffer([
  0x16, 0x1b, // SignatureInfo
      0x1b, 0x01, // SignatureType
          0x01,
      0x1c, 0x16, // KeyLocator
          0x07, 0x14, // Name
              0x08, 0x04,
                  0x74, 0x65, 0x73, 0x74,
              0x08, 0x03,
                  0x6b, 0x65, 0x79,
              0x08, 0x07,
                  0x6c, 0x6f, 0x63, 0x61, 0x74, 0x6f, 0x72
]);

var SIG_VALUE = new Buffer([
  0x17, 0x80, // SignatureValue
      0x2f, 0xd6, 0xf1, 0x6e, 0x80, 0x6f, 0x10, 0xbe, 0xb1, 0x6f, 0x3e, 0x31, 0xec,
      0xe3, 0xb9, 0xea, 0x83, 0x30, 0x40, 0x03, 0xfc, 0xa0, 0x13, 0xd9, 0xb3, 0xc6,
      0x25, 0x16, 0x2d, 0xa6, 0x58, 0x41, 0x69, 0x62, 0x56, 0xd8, 0xb3, 0x6a, 0x38,
      0x76, 0x56, 0xea, 0x61, 0xb2, 0x32, 0x70, 0x1c, 0xb6, 0x4d, 0x10, 0x1d, 0xdc,
      0x92, 0x8e, 0x52, 0xa5, 0x8a, 0x1d, 0xd9, 0x96, 0x5e, 0xc0, 0x62, 0x0b, 0xcf,
      0x3a, 0x9d, 0x7f, 0xca, 0xbe, 0xa1, 0x41, 0x71, 0x85, 0x7a, 0x8b, 0x5d, 0xa9,
      0x64, 0xd6, 0x66, 0xb4, 0xe9, 0x8d, 0x0c, 0x28, 0x43, 0xee, 0xa6, 0x64, 0xe8,
      0x55, 0xf6, 0x1c, 0x19, 0x0b, 0xef, 0x99, 0x25, 0x1e, 0xdc, 0x78, 0xb3, 0xa7,
      0xaa, 0x0d, 0x14, 0x58, 0x30, 0xe5, 0x37, 0x6a, 0x6d, 0xdb, 0x56, 0xac, 0xa3,
      0xfc, 0x90, 0x7a, 0xb8, 0x66, 0x9c, 0x0e, 0xf6, 0xb7, 0x64, 0xd1
]);

var dKeyDatabaseFilePath;
var eKeyDatabaseFilePath;
var intervalDatabaseFilePath;
var groupKeyDatabaseFilePath;
var decryptKeyBlob;
var encryptKeyBlob;
var certificate = new IdentityCertificate();
var keyChain;

describe ("TestGroupManager", function() {
  before(function(done) {
    dKeyDatabaseFilePath = "policy_config/manager-d-key-test.db";
    try {
      fs.unlinkSync(dKeyDatabaseFilePath);
    } catch (e) {}

    eKeyDatabaseFilePath = "policy_config/manager-e-key-test.db";
    try {
      fs.unlinkSync(eKeyDatabaseFilePath);
    } catch (e) {}

    intervalDatabaseFilePath = "policy_config/manager-interval-test.db";
    try {
      fs.unlinkSync(intervalDatabaseFilePath);
    } catch (e) {}

    groupKeyDatabaseFilePath = "policy_config/manager-group-key-test.db";
    try {
      fs.unlinkSync(groupKeyDatabaseFilePath);
    } catch (e) {}

    var params = new RsaKeyParams();
    var memberDecryptKey = RsaAlgorithm.generateKey(params);
    decryptKeyBlob = memberDecryptKey.getKeyBits();
    var memberEncryptKey = RsaAlgorithm.deriveEncryptKey(decryptKeyBlob);
    encryptKeyBlob = memberEncryptKey.getKeyBits();

    // generate certificate
    certificate.setName(new Name("/ndn/memberA/KEY/ksk-123/ID-CERT/123"));
    var contentPublicKey = new PublicKey(encryptKeyBlob);
    certificate.setPublicKeyInfo(contentPublicKey);
    certificate.encode();

    var signatureInfoBlob = new Blob(SIG_INFO, false);
    var signatureValueBlob = new Blob(SIG_VALUE, false);

    var signature = TlvWireFormat.get().decodeSignatureInfoAndValue
      (signatureInfoBlob.buf(), signatureValueBlob.buf());
    certificate.setSignature(signature);

    certificate.wireEncode();

    // Set up the keyChain.
    var identityStorage = new MemoryIdentityStorage();
    var privateKeyStorage = new MemoryPrivateKeyStorage();
    keyChain = new KeyChain
      (new IdentityManager(identityStorage, privateKeyStorage),
       new NoVerifyPolicyManager());
    var identityName = new Name("TestGroupManager");
    keyChain.createIdentityAndCertificate(identityName);
    keyChain.getIdentityManager().setDefaultIdentity(identityName);

    done();
  });
  
  after(function(done) {
    try {
      fs.unlinkSync(dKeyDatabaseFilePath);
    } catch (e) {}
    try {
      fs.unlinkSync(eKeyDatabaseFilePath);
    } catch (e) {}
    try {
      fs.unlinkSync(intervalDatabaseFilePath);
    } catch (e) {}
    try {
      fs.unlinkSync(groupKeyDatabaseFilePath);
    } catch (e) {}

    done();
  });

  it("CreateDKeyData", function(done) {
    // Create the group manager.
    var manager = new GroupManager
      (new Name("Alice"), new Name("data_type"),
       new GroupManagerDbSqlite3(dKeyDatabaseFilePath), 2048, 1, keyChain);

    var newCertificateBlob = certificate.wireEncode();
    var newCertificate = new IdentityCertificate();
    newCertificate.wireDecode(newCertificateBlob);

    var encryptedNonce;
    var dataContent;
    var decryptParams;

    // Encrypt the D-KEY.
    return manager.createDKeyDataPromise_
      ("20150825T000000", "20150827T000000", new Name("/ndn/memberA/KEY"),
       decryptKeyBlob, newCertificate.getPublicKeyInfo().getKeyDer())
    .then(function(data) {
      // Verify the encrypted D-KEY.
      dataContent = data.getContent();

      // Get the nonce key.
      // dataContent is a sequence of the two EncryptedContent.
      encryptedNonce = new EncryptedContent();
      encryptedNonce.wireDecode(dataContent);
      assert.ok(0 == encryptedNonce.getInitialVector().size());
      assert.ok(EncryptAlgorithmType.RsaPkcs == encryptedNonce.getAlgorithmType());

      var blobNonce = encryptedNonce.getPayload();
      decryptParams = new EncryptParams(EncryptAlgorithmType.RsaPkcs);
      return RsaAlgorithm.decryptPromise(decryptKeyBlob, blobNonce, decryptParams);
    })
    .then(function(nonce) {
      // Get the D-KEY.
      // Use the size of encryptedNonce to find the start of encryptedPayload.
      var payloadContent = dataContent.buf().slice
        (encryptedNonce.wireEncode().size());
      var encryptedPayload = new EncryptedContent();
      encryptedPayload.wireDecode(payloadContent);
      assert.ok(16 == encryptedPayload.getInitialVector().size());
      assert.ok(EncryptAlgorithmType.AesCbc == encryptedPayload.getAlgorithmType());

      decryptParams.setAlgorithmType(EncryptAlgorithmType.AesCbc);
      decryptParams.setInitialVector(encryptedPayload.getInitialVector());
      var blobPayload = encryptedPayload.getPayload();
      return AesAlgorithm.decryptPromise(nonce, blobPayload, decryptParams);
    })
    .then(function(largePayload) {
      assert.ok(largePayload.equals(decryptKeyBlob));

      return Promise.resolve();
    })
    // When done is called, Mocha displays errors from assert.ok.
    .then(done, done);
  });
});
