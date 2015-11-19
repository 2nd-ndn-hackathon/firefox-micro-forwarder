/**
 * Copyright (C) 2015 Regents of the University of California.
 * @author: Jeff Thompson <jefft0@remap.ucla.edu>
 * From ndn-cxx security by Yingdi Yu <yingdi@cs.ucla.edu>.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
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

var Name = require('../../name.js').Name;
var Blob = require('../../util/blob.js').Blob;
var Sqlite3Promise = require('../../util/sqlite3-promise.js').Sqlite3Promise;
var KeyLocator = require('../../key-locator.js').KeyLocator;
var SecurityException = require('../security-exception.js').SecurityException;
var IdentityCertificate = require('../certificate/identity-certificate.js').IdentityCertificate;
var IdentityStorage = require('./identity-storage.js').IdentityStorage;
var path = require('path');

/**
 * BasicIdentityStorage extends IdentityStorage to implement basic storage of
 * identity, public keys and certificates using the Node.js sqlite3 module.
 * Create a new BasicIdentityStorage to use the SQLite3 file in the default
 * location, or the optional given file.
 * @param {string} databaseFilePath (optional) The path of the SQLite3 file. If
 * omitted, use the default file (~/.ndn/ndnsec-public-info.db).
 * @constructor
 */
var BasicIdentityStorage = function BasicIdentityStorage(databaseFilePath)
{
  // Call the base constructor.
  IdentityStorage.call(this);

  var databaseFilePath_= databaseFilePath || path.join
    (BasicIdentityStorage.getUserHomePath(), ".ndn", "ndnsec-public-info.db");
  this.database_ = new Sqlite3Promise
    (databaseFilePath, BasicIdentityStorage.initializeDatabasePromise_);
};

BasicIdentityStorage.prototype = new IdentityStorage();
BasicIdentityStorage.prototype.name = "BasicIdentityStorage";

exports.BasicIdentityStorage = BasicIdentityStorage;

/**
 * Check if the specified identity already exists.
 * @param {Name} identityName The identity name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @returns {Promise} A promise which returns true if the identity exists.
 */
BasicIdentityStorage.prototype.doesIdentityExistPromise = function
  (identityName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.doesIdentityExistPromise is only supported for async")));

  return this.database_.getPromise
    ("SELECT count(*) FROM Identity WHERE identity_name=?", identityName.toUri())
  .then(function(row) {
    if (row["count(*)"] > 0)
      return Promise.resolve(true);
    else
      return Promise.resolve(false);
  });
};

/**
 * Add a new identity. Do nothing if the identity already exists.
 * @param {Name} identityName The identity name to be added.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the identity is added.
 */
BasicIdentityStorage.prototype.addIdentityPromise = function(identityName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.addIdentityPromise is only supported for async")));

  var thisStorage = this;
  var identityUri = identityName.toUri();
  return this.doesIdentityExistPromise(identityName)
  .then(function(exists) {
    if (exists)
      return Promise.resolve();

    return thisStorage.database_.runPromise
      ("INSERT INTO Identity (identity_name) VALUES(?)", identityUri);
  });
};

/**
 * Check if the specified key already exists.
 * @param {Name} keyName The name of the key.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns true if the key exists.
 */
BasicIdentityStorage.prototype.doesKeyExistPromise = function(keyName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.doesKeyExistPromise is only supported for async")));

  var keyId = keyName.get(-1).toEscapedString();
  var identityName = keyName.getPrefix(-1);

  return this.database_.getPromise
    ("SELECT count(*) FROM Key WHERE identity_name=? AND key_identifier=?",
     [identityName.toUri(), keyId])
  .then(function(row) {
    if (row["count(*)"] > 0)
      return Promise.resolve(true);
    else
      return Promise.resolve(false);
  });
};

/**
 * Add a public key to the identity storage. Also call addIdentity to ensure
 * that the identityName for the key exists.
 * @param {Name} keyName The name of the public key to be added.
 * @param {number} keyType Type of the public key to be added from KeyType, such
 * as KeyType.RSA..
 * @param {Blob} publicKeyDer A blob of the public key DER to be added.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the key is added, or a
 * promise rejected with SecurityException if a key with the keyName already
 * exists.
 */
BasicIdentityStorage.prototype.addKeyPromise = function
  (keyName, keyType, publicKeyDer, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.addKeyPromise is only supported for async")));

  if (keyName.size() == 0)
    return;

  var thisStorage = this;
  return this.doesKeyExistPromise(keyName)
  .then(function(exists) {
    if (exists)
      return Promise.reject(new SecurityException(new Error
        ("a key with the same name already exists!")));

    var identityName = keyName.getPrefix(-1);
    var identityUri = identityName.toUri();

    return thisStorage.addIdentityPromise(identityName)
    .then(function() {
      var keyId = keyName.get(-1).toEscapedString();
      var keyBuffer = publicKeyDer.buf();
      
      return thisStorage.database_.runPromise
        ("INSERT INTO Key (identity_name, key_identifier, key_type, public_key) VALUES(?,?,?,?)",
         [identityUri, keyId, keyType, keyBuffer]);
    });
  });
};

/**
 * Get the public key DER blob from the identity storage.
 * @param {Name} keyName The name of the requested public key.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns the DER Blob, or a Blob with a null
 * pointer if not found.
 */
BasicIdentityStorage.prototype.getKeyPromise = function(keyName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getKeyPromise is only supported for async")));

  var thisStorage = this;
  return this.doesKeyExistPromise(keyName)
  .then(function(exists) {
    if (!exists)
      return Promise.resolve(new Blob());

    var identityUri = keyName.getPrefix(-1).toUri();
    var keyId = keyName.get(-1).toEscapedString();

    return thisStorage.database_.getPromise
      ("SELECT public_key FROM Key WHERE identity_name=? AND key_identifier=?",
       [identityUri, keyId])
    .then(function(row) {
      return Promise.resolve(new Blob(row.public_key, false));
    });
  });
};

/**
 * Check if the specified certificate already exists.
 * @param {Name} certificateName The name of the certificate.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns true if the certificate exists.
 */
BasicIdentityStorage.prototype.doesCertificateExistPromise = function
  (certificateName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.doesCertificateExistPromise is only supported for async")));

  return this.database_.getPromise
    ("SELECT count(*) FROM Certificate WHERE cert_name=?", certificateName.toUri())
  .then(function(row) {
    if (row["count(*)"] > 0)
      return Promise.resolve(true);
    else
      return Promise.resolve(false);
  });
};

/**
 * Add a certificate to the identity storage.
 * @param {IdentityCertificate} certificate The certificate to be added.  This
 * makes a copy of the certificate.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the certificate is added, or 
 * a promise rejected with SecurityException if the certificate is already
 * installed.
 */
BasicIdentityStorage.prototype.addCertificatePromise = function(certificate, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.addCertificatePromise is only supported for async")));

  var certificateName = certificate.getName();
  var keyName = certificate.getPublicKeyName();

  var thisStorage = this;
  return this.doesKeyExistPromise(keyName)
  .then(function(exists) {
    if (!exists)
      return Promise.reject(new SecurityException(new Error
        ("No corresponding Key record for certificate! " +
         keyName.toUri() + " " + certificateName.toUri())));

    // Check if the certificate already exists.
    return thisStorage.doesCertificateExistPromise(certificateName)
    .then(function(exists) {
      if (exists)
        return Promise.reject(new SecurityException(new Error
          ("Certificate has already been installed!")));
      
      var keyId = keyName.get(-1).toEscapedString();
      var identity = keyName.getPrefix(-1);

      // Check if the public key of the certificate is the same as the key record.
      return thisStorage.getKeyPromise(keyName)
      .then(function(keyBlob) {
        if (keyBlob.isNull() ||
            !keyBlob.equals(certificate.getPublicKeyInfo().getKeyDer()))
          return Promise.reject(new SecurityException(new Error
            ("Certificate does not match public key")));

        // Insert the certificate.

        var signature = certificate.getSignature();
        var signerName = KeyLocator.getFromSignature(signature).getKeyName();
        // Convert from milliseconds to seconds since 1/1/1970.
        var notBefore = Math.floor(certificate.getNotBefore() / 1000.0);
        var notAfter = Math.floor(certificate.getNotAfter() / 1000.0);
        var encodedCert = certificate.wireEncode().buf();

        return thisStorage.database_.runPromise
          ("INSERT INTO Certificate (cert_name, cert_issuer, identity_name, key_identifier, not_before, not_after, certificate_data) " +
           "VALUES (?,?,?,?,?,?,?)",
           [certificateName.toUri(), signerName.toUri(), identity.toUri(), keyId,
            notBefore, notAfter, encodedCert]);
      });
    });
  });
};

/**
 * Get a certificate from the identity storage.
 * @param {Name} certificateName The name of the requested certificate.
 * @param {boolean} allowAny If false, only a valid certificate will be returned,
 * otherwise validity is disregarded.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns the requested IdentityCertificate
 * or null if not found.
 */
BasicIdentityStorage.prototype.getCertificatePromise = function
  (certificateName, allowAny, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getCertificatePromise is only supported for async")));

  var thisStorage = this;
  return this.doesCertificateExistPromise(certificateName)
  .then(function(exists) {
    if (!exists)
      return Promise.resolve(null);

    if (!allowAny)
      return Promise.reject(new Error
        ("BasicIdentityStorage.getCertificate for not allowAny is not implemented"));

    return thisStorage.database_.getPromise
      ("SELECT certificate_data FROM Certificate WHERE cert_name=?",
       certificateName.toUri())
    .then(function(row) {
      var certificate = new IdentityCertificate()
      certificate.wireDecode(new Blob(row.certificate_data, false))
      return Promise.resolve(certificate);
    });
  });
};

/*****************************************
 *           Get/Set Default             *
 *****************************************/

/**
 * Get the default identity.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns the Name of default identity, or a
 * promise rejected with SecurityException if the default identity is not set.
 */
BasicIdentityStorage.prototype.getDefaultIdentityPromise = function(useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getDefaultIdentityPromise is only supported for async")));

  return this.database_.getPromise
    ("SELECT identity_name FROM Identity WHERE default_identity=1")
  .then(function(row) {
    if (row)
      return Promise.resolve(new Name(row.identity_name));
    else
      return Promise.reject(new SecurityException(new Error
        ("BasicIdentityStorage::getDefaultIdentityPromise: The default identity is not defined")));
  });
};

/**
 * Get the default key name for the specified identity.
 * @param {Name} identityName The identity name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns the default key Name, or a promise 
 * rejected with SecurityException if the default key name for the identity is
 * not set.
 */
BasicIdentityStorage.prototype.getDefaultKeyNameForIdentityPromise = function
  (identityName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getDefaultKeyNameForIdentityPromise is only supported for async")));

  return this.database_.getPromise
    ("SELECT key_identifier FROM Key WHERE identity_name=? AND default_key=1",
     identityName.toUri())
  .then(function(row) {
    if (row)
      return Promise.resolve(new Name(identityName).append(row.key_identifier));
    else
      return Promise.reject(new SecurityException(new Error
        ("BasicIdentityStorage::getDefaultKeyNameForIdentityPromise: The default key for the identity is not defined")));
  });
};

/**
 * Get the default certificate name for the specified key.
 * @param {Name} keyName The key name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which returns the default certificate Name, or a 
 * promise rejected with SecurityException if the default certificate name for
 * the key name is not set.
 */
BasicIdentityStorage.prototype.getDefaultCertificateNameForKeyPromise = function
  (keyName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getDefaultCertificateNameForKeyPromise is only supported for async")));

  var keyId = keyName.get(-1).toEscapedString();
  var identityName = keyName.getPrefix(-1);

  return this.database_.getPromise
    ("SELECT cert_name FROM Certificate WHERE identity_name=? AND key_identifier=? AND default_cert=1",
     [identityName.toUri(), keyId])
  .then(function(row) {
    if (row)
      return Promise.resolve(new Name(row.cert_name));
    else
      return Promise.reject(new SecurityException(new Error
        ("BasicIdentityStorage::getDefaultCertificateNameForKeyPromise: The default certificate for the key name is not defined")));
  });
};

/**
 * Append all the key names of a particular identity to the nameList.
 * @param identityName {Name} The identity name to search for.
 * @param nameList {Array<Name>} Append result names to nameList.
 * @param isDefault {boolean} If true, add only the default key name. If false,
 * add only the non-default key names.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the names are added to
 * nameList.
 */
BasicIdentityStorage.prototype.getAllKeyNamesOfIdentityPromise = function
  (identityName, nameList, isDefault, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.getAllKeyNamesOfIdentityPromise is only supported for async")));

  var query;
  if (isDefault)
    query = "SELECT key_identifier FROM Key WHERE default_key=1 and identity_name=?";
  else
    query = "SELECT key_identifier FROM Key WHERE default_key=0 and identity_name=?";

  return this.database_.eachPromise(query, identityName.toUri(), function(err, row) {
    nameList.push(new Name(identityName).append(row.key_identifier))
  });
};

/**
 * Set the default identity.  If the identityName does not exist, then clear the
 * default identity so that getDefaultIdentity() throws an exception.
 * @param {Name} identityName The default identity name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the default identity is set.
 */
BasicIdentityStorage.prototype.setDefaultIdentityPromise = function
  (identityName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.setDefaultIdentityPromise is only supported for async")));

  var thisStorage = this;

  // Reset the previous default identity.
  return this.database_.runPromise
    ("UPDATE Identity SET default_identity=0 WHERE default_identity=1")
  .then(function() {
    // Set the current default identity.
    return thisStorage.database_.runPromise
      ("UPDATE Identity SET default_identity=1 WHERE identity_name=?",
       identityName.toUri());
  });
};

/**
 * Set a key as the default key of an identity. The identity name is inferred
 * from keyName.
 * @param {Name} keyName The name of the key.
 * @param {Name} identityNameCheck (optional) The identity name to check that the
 * keyName contains the same identity name. If an empty name, it is ignored.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the default key name is set.
 */
BasicIdentityStorage.prototype.setDefaultKeyNameForIdentityPromise = function
  (keyName, identityNameCheck, useSync)
{
  useSync = (typeof identityNameCheck === "boolean") ? identityNameCheck : useSync;
  identityNameCheck = (identityNameCheck instanceof Name) ? identityNameCheck : null;

  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.setDefaultKeyNameForIdentityPromise is only supported for async")));

  var keyId = keyName.get(-1).toEscapedString();
  var identityName = keyName.getPrefix(-1);

  if (identityNameCheck != null && identityNameCheck.size() != 0 &&
      !identityNameCheck.equals(identityName))
    return Promise.reject(new SecurityException(new Error
      ("Specified identity name does not match the key name")));

  var thisStorage = this;

  // Reset the previous default key.
  var identityUri = identityName.toUri();
  return this.database_.runPromise
    ("UPDATE Key SET default_key=0 WHERE default_key=1 and identity_name=?",
     identityUri)
  .then(function() {
    // Set the current default key.
    return thisStorage.database_.runPromise
      ("UPDATE Key SET default_key=1 WHERE identity_name=? AND key_identifier=?",
       [identityUri, keyId]);
  });
};

/**
 * Set the default key name for the specified identity.
 * @param {Name} keyName The key name.
 * @param {Name} certificateName The certificate name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the default certificate name
 * is set.
 */
BasicIdentityStorage.prototype.setDefaultCertificateNameForKeyPromise = function
  (keyName, certificateName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.setDefaultCertificateNameForKeyPromise is only supported for async")));

  var keyId = keyName.get(-1).toEscapedString();
  var identityName = keyName.getPrefix(-1);
  var thisStorage = this;

  // Reset the previous default certificate.
  var identityUri = identityName.toUri();
  return this.database_.runPromise
    ("UPDATE Certificate SET default_cert=0 WHERE default_cert=1 AND identity_name=? AND key_identifier=?",
     [identityUri, keyId])
  .then(function() {
    // Set the current default certificate.
    return thisStorage.database_.runPromise
      ("UPDATE Certificate SET default_cert=1 WHERE identity_name=? AND key_identifier=? AND cert_name=?",
       [identityUri, keyId, certificateName.toUri()]);
  });
};

/*****************************************
 *            Delete Methods             *
 *****************************************/

/**
 * Delete a certificate.
 * @param {Name} certificateName The certificate name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the certificate info is
 * deleted.
 */
BasicIdentityStorage.prototype.deleteCertificateInfoPromise = function
  (certificateName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.deleteCertificateInfoPromise is only supported for async")));

  if (certificateName.size() == 0)
    return

  return this.database_.runPromise
    ("DELETE FROM Certificate WHERE cert_name=?", certificateName.toUri());
};

/**
 * Delete a public key and related certificates.
 * @param {Name} keyName The key name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the public key info is
 * deleted.
 */
BasicIdentityStorage.prototype.deletePublicKeyInfoPromise = function
  (keyName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.deletePublicKeyInfoPromise is only supported for async")));

  if (keyName.size() == 0)
    return;

  var thisStorage = this;
  var keyId = keyName.get(-1).toEscapedString();
  var identityName = keyName.getPrefix(-1);

  return this.database_.runPromise
    ("DELETE FROM Certificate WHERE identity_name=? AND key_identifier=?",
     [identityName.toUri(), keyId])
  .then(function() {
    return thisStorage.database_.runPromise
      ("DELETE FROM Key WHERE identity_name=? and key_identifier=?",
       [identityName.toUri(), keyId]);
  });
};

/**
 * Delete an identity and related public keys and certificates.
 * @param {Name} identityName The identity name.
 * @param {boolean} useSync (optional) If true then return a rejected promise
 * since this only supports async code.
 * @return {Promise} A promise which fulfills when the identity info is deleted.
 */
BasicIdentityStorage.prototype.deleteIdentityInfoPromise = function
  (identityName, useSync)
{
  if (useSync)
    return Promise.reject(new SecurityException(new Error
      ("BasicIdentityStorage.deleteIdentityInfoPromise is only supported for async")));

  var thisStorage = this;
  var identity = identityName.toUri();

  return this.database_.runPromise
    ("DELETE FROM Certificate WHERE identity_name=?", identity)
  .then(function() {
    return thisStorage.database_.runPromise
      ("DELETE FROM Key WHERE identity_name=?", identity);
  })
  .then(function() {
    return thisStorage.database_.runPromise
      ("DELETE FROM Identity WHERE identity_name=?", identity);
  });
};

/**
 * Retrieve the user's current home directory
 * @returns {string} path to the user's home directory
 */
BasicIdentityStorage.getUserHomePath = function() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

BasicIdentityStorage.initializeDatabasePromise_ = function(database)
{
  // Check if the ID table exists.
  return database.getPromise
    ("SELECT name FROM sqlite_master WHERE type='table' And name='Identity'")
  .then(function(row) {
    if (row)
      return Promise.resolve();
    else {
      return database.runPromise(BasicIdentityStorage.INIT_ID_TABLE1)
      .then(function() {
        return database.runPromise(BasicIdentityStorage.INIT_ID_TABLE2);
      });
    }
  })
  .then(function() {
    // Check if the Key table exists.
    return database.getPromise
      ("SELECT name FROM sqlite_master WHERE type='table' And name='Key'");
  })
  .then(function(row) {
    if (row)
      return Promise.resolve();
    else {
      return database.runPromise(BasicIdentityStorage.INIT_KEY_TABLE1)
      .then(function() {
        return database.runPromise(BasicIdentityStorage.INIT_KEY_TABLE2);
      });
    }
  })
  .then(function() {
    // Check if the Certificate table exists.
    return database.getPromise
      ("SELECT name FROM sqlite_master WHERE type='table' And name='Certificate'");
  })
  .then(function(row) {
    if (row)
      return Promise.resolve();
    else {
      return database.runPromise(BasicIdentityStorage.INIT_CERT_TABLE1)
      .then(function() {
        return database.runPromise(BasicIdentityStorage.INIT_CERT_TABLE2);
      })
      .then(function() {
        return database.runPromise(BasicIdentityStorage.INIT_CERT_TABLE3);
      });
    }
  });
};

BasicIdentityStorage.INIT_ID_TABLE1 =
"CREATE TABLE IF NOT EXISTS                                           \n" +
"  Identity(                                                          \n" +
"      identity_name     BLOB NOT NULL,                               \n" +
"      default_identity  INTEGER DEFAULT 0,                           \n" +
"                                                                     \n" +
"      PRIMARY KEY (identity_name)                                    \n" +
"  );                                                                 \n" +
"                                                                     \n";
BasicIdentityStorage.INIT_ID_TABLE2 =
"CREATE INDEX identity_index ON Identity(identity_name);              \n";

BasicIdentityStorage.INIT_KEY_TABLE1 =
"CREATE TABLE IF NOT EXISTS                                           \n" +
"  Key(                                                               \n" +
"      identity_name     BLOB NOT NULL,                               \n" +
"      key_identifier    BLOB NOT NULL,                               \n" +
"      key_type          INTEGER,                                     \n" +
"      public_key        BLOB,                                        \n" +
"      default_key       INTEGER DEFAULT 0,                           \n" +
"      active            INTEGER DEFAULT 0,                           \n" +
"                                                                     \n" +
"      PRIMARY KEY (identity_name, key_identifier)                    \n" +
"  );                                                                 \n" +
"                                                                     \n";
BasicIdentityStorage.INIT_KEY_TABLE2 =
"CREATE INDEX key_index ON Key(identity_name);                        \n";

BasicIdentityStorage.INIT_CERT_TABLE1 =
"CREATE TABLE IF NOT EXISTS                                           \n" +
"  Certificate(                                                       \n" +
"      cert_name         BLOB NOT NULL,                               \n" +
"      cert_issuer       BLOB NOT NULL,                               \n" +
"      identity_name     BLOB NOT NULL,                               \n" +
"      key_identifier    BLOB NOT NULL,                               \n" +
"      not_before        TIMESTAMP,                                   \n" +
"      not_after         TIMESTAMP,                                   \n" +
"      certificate_data  BLOB NOT NULL,                               \n" +
"      valid_flag        INTEGER DEFAULT 1,                           \n" +
"      default_cert      INTEGER DEFAULT 0,                           \n" +
"                                                                     \n" +
"      PRIMARY KEY (cert_name)                                        \n" +
"  );                                                                 \n" +
"                                                                     \n";
BasicIdentityStorage.INIT_CERT_TABLE2 =
"CREATE INDEX cert_index ON Certificate(cert_name);           \n";
BasicIdentityStorage.INIT_CERT_TABLE3 =
"CREATE INDEX subject ON Certificate(identity_name);          \n";
