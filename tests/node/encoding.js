var Encoder = require('../..').BinaryXMLEncoder;
var Decoder = require('../..').BinaryXMLDecoder;
var Name = require('../..').Name;
var Interest = require('../..').Interest;
var Data = require('../..').Data;
var SignedInfo = require('../..').SignedInfo;
var Key = require('../..').Key;
var EncodingUtils = require('../..').EncodingUtils;

var n = new Name('/a/b/c.txt');

console.log("Encoding/Decoding interests...");

var i1 = new Interest(n);
i1.interestLifetime = 1000;
i1.childSelector = 1;

var packet = i1.wireEncode();


var decoder = new Decoder(packet);
var i2 = new Interest();
i2.from_ndnb(decoder);

console.log(i2.name.toUri());
console.log(i2.interestLifetime);
console.log(i2.childSelector);

console.log("Encoding/Decoding data packet objects...");

var content = "NDN on Node";

var data1 = new Data(new Name(n), new SignedInfo(), content);
data1.signedInfo.setFields();
data1.sign();
console.log("Signature is \n" + data1.signature.signature.toString('hex'));

var p2 = data1.wireEncode();

var data2 = new Data();
data2.wireDecode(p2);

console.log('Decoded name: ' + data2.name.toUri());
console.log('Decoded content: ' + data2.content.toString());
var rsakey = new Key();
rsakey.readDerPublicKey(data2.signedInfo.locator.publicKey);
console.log('Content verification passed: ' + data2.verify(rsakey));

console.log('Data in XML representation:');
console.log(EncodingUtils.dataToHtml(data2).replace(/<br \/>/g, "\n"));
