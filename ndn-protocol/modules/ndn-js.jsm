/* This file is created by running make-ndn-js.jsm.sh in this directory.
 * It concatenates ndn-js-header.txt with all the ndn-js source files to
 *   make ndn-js.jsm .
 * The file ../../build/ndn.js must already be built.
 *
 * Copyright (C) 2013 Regents of the University of California.
 * author: Jeff Thompson <jefft0@remap.ucla.edu>
 * See COPYING for copyright and distribution information.
 */

var EXPORTED_SYMBOLS = ["Closure", "ContentObject", "DataUtils", "Exclude", "ExponentialReExpressClosure",
    "Interest", "MimeTypes", "NDN", "Name", "Sha256", "XpcomTransport", "Buffer"];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

// jsbn.js needs the navigator object which isn't defined in XPCOM, so make a local hack.
var navigator = {
    appName: "Netscape"
};

// Some code calls console.log without checking LOG>0.  Until this is cleaned up, make a local hack console.
var console = {
    log: function(message) {
        dump(message);
        dump("\n");
    }
};

// The NDN class uses setTimeout and clearTimeout, so define them using XPCOM.
function setTimeout(callback, delay) {
    var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
    timer.initWithCallback({notify: callback}, delay, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    return timer;
}

function clearTimeout(timer) {
    timer.cancel();
}
/*
 <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
 <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
*/
var ndn=ndn||{},exports=ndn,require=function(){return ndn},Buffer=function Buffer(b,c){var d;if("number"==typeof b)d=new Uint8Array(b);else if("string"==typeof b)if(null==c||"utf8"==c){var e=Buffer.str2rstr_utf8(b);d=new Uint8Array(e.length);for(var f=0;f<e.length;f++)d[f]=e.charCodeAt(f)}else if("binary"==c){d=new Uint8Array(b.length);for(f=0;f<b.length;f++)d[f]=b.charCodeAt(f)}else if("hex"==c)d=new Uint8Array(Math.floor(b.length/2)),f=0,b.replace(/(..)/g,function(b){d[f++]=parseInt(b,16)});else if("base64"==
c)e=b64tohex(b),d=new Uint8Array(Math.floor(e.length/2)),f=0,e.replace(/(..)/g,function(b){d[f++]=parseInt(b,16)});else throw Error("Buffer: unknown encoding format "+c);else if("object"==typeof b&&(b instanceof Uint8Array||b instanceof Buffer))d=!1==c?b.subarray(0):new Uint8Array(b);else if("object"==typeof b&&b instanceof ArrayBuffer)d=new Uint8Array(b);else if("object"==typeof b)d=new Uint8Array(b);else throw Error("Buffer: unknown data type.");d.__proto__=Buffer.prototype;d.__proto__.toString=
function(b){if(null==b){for(var c="",d=0;d<this.length;d++)c+=String.fromCharCode(this[d]);return c}c="";for(d=0;d<this.length;d++)c+=(16>this[d]?"0":"")+this[d].toString(16);if("hex"==b)return c;if("base64"==b)return hex2b64(c);throw Error("Buffer.toString: unknown encoding format "+b);};d.__proto__.slice=function(b,c){return void 0!==c?new Buffer(this.subarray(b,c),!1):new Buffer(this.subarray(b),!1)};d.__proto__.copy=function(b,c){void 0!==c?b.set(this,c):b.set(this)};return d};
Buffer.prototype=Uint8Array.prototype;Buffer.concat=function(a){for(var b=0,c=0;c<a.length;++c)b+=a[c].length;for(var b=new Buffer(b),d=0,c=0;c<a.length;++c)b.set(a[c],d),d+=a[c].length;return b};
Buffer.str2rstr_utf8=function(a){for(var b="",c=-1,d,e;++c<a.length;)d=a.charCodeAt(c),e=c+1<a.length?a.charCodeAt(c+1):0,55296<=d&&(56319>=d&&56320<=e&&57343>=e)&&(d=65536+((d&1023)<<10)+(e&1023),c++),127>=d?b+=String.fromCharCode(d):2047>=d?b+=String.fromCharCode(192|d>>>6&31,128|d&63):65535>=d?b+=String.fromCharCode(224|d>>>12&15,128|d>>>6&63,128|d&63):2097151>=d&&(b+=String.fromCharCode(240|d>>>18&7,128|d>>>12&63,128|d>>>6&63,128|d&63));return b};
exports.createHash=function(a){if("sha256"!=a)throw Error("createHash: unsupported algorithm.");a={};a.md=new KJUR.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"});a.update=function(a){this.md.updateHex(a.toString("hex"))};a.digest=function(){return new Buffer(this.md.digest(),"hex")};return a};
exports.createSign=function(a){if("RSA-SHA256"!=a)throw Error("createSign: unsupported algorithm.");return{arr:[],update:function(a){this.arr.push(a)},sign:function(a){var c=new RSAKey;c.readPrivateKeyFromPEMString(a);a=new KJUR.crypto.Signature({alg:"SHA256withRSA",prov:"cryptojs/jsrsa"});a.initSign(c);for(c=0;c<this.arr.length;++c)a.updateHex(this.arr[c].toString("hex"));return new Buffer(a.sign(),"hex")}}};
exports.createVerify=function(a){if("RSA-SHA256"!=a)throw Error("createSign: unsupported algorithm.");return{arr:[],update:function(a){this.arr.push(a)},verify:function(a,c){var d=new ndn.Key;d.fromPemString(a);var e;d=d.publicToDER().toString("hex");e=ASN1HEX.getPosArrayOfChildren_AtObj(d,0);2!=e.length?e=-1:(e=e[1],"03"!=d.substring(e,e+2)?e=-1:(e=ASN1HEX.getStartPosOfV_AtObj(d,e),e="00"!=d.substring(e,e+2)?-1:e+2));var f=ASN1HEX.getPosArrayOfChildren_AtObj(d,e);2!=f.length?e=null:(e=ASN1HEX.getHexOfV_AtObj(d,
f[0]),d=ASN1HEX.getHexOfV_AtObj(d,f[1]),f=new RSAKey,f.setPublic(e,d),e=f);d=new KJUR.crypto.Signature({alg:"SHA256withRSA",prov:"cryptojs/jsrsa"});d.initVerifyByPublicKey(e);for(e=0;e<this.arr.length;e++)d.updateHex(this.arr[e].toString("hex"));e=c.toString("hex");return d.verify(e)}}};var Log=function(){};exports.Log=Log;Log.LOG=0;
var NDNProtocolDTags={Any:13,Name:14,Component:15,Certificate:16,Collection:17,CompleteName:18,Content:19,SignedInfo:20,ContentDigest:21,ContentHash:22,Count:24,Header:25,Interest:26,Key:27,KeyLocator:28,KeyName:29,Length:30,Link:31,LinkAuthenticator:32,NameComponentCount:33,RootDigest:36,Signature:37,Start:38,Timestamp:39,Type:40,Nonce:41,Scope:42,Exclude:43,Bloom:44,BloomSeed:45,AnswerOriginKind:47,InterestLifetime:48,Witness:53,SignatureBits:54,DigestAlgorithm:55,BlockSize:56,FreshnessSeconds:58,
FinalBlockID:59,PublisherPublicKeyDigest:60,PublisherCertificateDigest:61,PublisherIssuerKeyDigest:62,PublisherIssuerCertificateDigest:63,ContentObject:64,WrappedKey:65,WrappingKeyIdentifier:66,WrapAlgorithm:67,KeyAlgorithm:68,Label:69,EncryptedKey:70,EncryptedNonceKey:71,WrappingKeyName:72,Action:73,FaceID:74,IPProto:75,Host:76,Port:77,MulticastInterface:78,ForwardingFlags:79,FaceInstance:80,ForwardingEntry:81,MulticastTTL:82,MinSuffixComponents:83,MaxSuffixComponents:84,ChildSelector:85,RepositoryInfo:86,
Version:87,RepositoryVersion:88,GlobalPrefix:89,LocalName:90,Policy:91,Namespace:92,GlobalPrefixName:93,PolicyVersion:94,KeyValueSet:95,KeyValuePair:96,IntegerValue:97,DecimalValue:98,StringValue:99,BinaryValue:100,NameValue:101,Entry:102,ACL:103,ParameterizedName:104,Prefix:105,Suffix:106,Root:107,ProfileName:108,Parameters:109,InfoString:110,StatusResponse:112,StatusCode:113,StatusText:114,SyncNode:115,SyncNodeKind:116,SyncNodeElement:117,SyncVersion:118,SyncNodeElements:119,SyncContentHash:120,
SyncLeafCount:121,SyncTreeDepth:122,SyncByteCount:123,ConfigSlice:124,ConfigSliceList:125,ConfigSliceOp:126,NDNProtocolDataUnit:17702112,NDNPROTOCOL_DATA_UNIT:"NDNProtocolDataUnit"};exports.NDNProtocolDTags=NDNProtocolDTags;
var NDNProtocolDTagsStrings=[null,null,null,null,null,null,null,null,null,null,null,null,null,"Any","Name","Component","Certificate","Collection","CompleteName","Content","SignedInfo","ContentDigest","ContentHash",null,"Count","Header","Interest","Key","KeyLocator","KeyName","Length","Link","LinkAuthenticator","NameComponentCount",null,null,"RootDigest","Signature","Start","Timestamp","Type","Nonce","Scope","Exclude","Bloom","BloomSeed",null,"AnswerOriginKind","InterestLifetime",null,null,null,null,
"Witness","SignatureBits","DigestAlgorithm","BlockSize",null,"FreshnessSeconds","FinalBlockID","PublisherPublicKeyDigest","PublisherCertificateDigest","PublisherIssuerKeyDigest","PublisherIssuerCertificateDigest","ContentObject","WrappedKey","WrappingKeyIdentifier","WrapAlgorithm","KeyAlgorithm","Label","EncryptedKey","EncryptedNonceKey","WrappingKeyName","Action","FaceID","IPProto","Host","Port","MulticastInterface","ForwardingFlags","FaceInstance","ForwardingEntry","MulticastTTL","MinSuffixComponents",
"MaxSuffixComponents","ChildSelector","RepositoryInfo","Version","RepositoryVersion","GlobalPrefix","LocalName","Policy","Namespace","GlobalPrefixName","PolicyVersion","KeyValueSet","KeyValuePair","IntegerValue","DecimalValue","StringValue","BinaryValue","NameValue","Entry","ACL","ParameterizedName","Prefix","Suffix","Root","ProfileName","Parameters","InfoString",null,"StatusResponse","StatusCode","StatusText","SyncNode","SyncNodeKind","SyncNodeElement","SyncVersion","SyncNodeElements","SyncContentHash",
"SyncLeafCount","SyncTreeDepth","SyncByteCount","ConfigSlice","ConfigSliceList","ConfigSliceOp"];exports.NDNProtocolDTagsStrings=NDNProtocolDTagsStrings;var LOG=require("../log.js").Log.LOG,NDNTime=function(a){this.NANOS_MAX=999877929;"number"==typeof a?this.msec=a:1<LOG&&console.log("UNRECOGNIZED TYPE FOR TIME")};exports.NDNTime=NDNTime;NDNTime.prototype.getJavascriptDate=function(){var a=new Date;a.setTime(this.msec);return a};
var Closure=require("../closure.js").Closure,ExponentialReExpressClosure=function(a,b){Closure.call(this);this.callerClosure=a;b=b||{};this.maxInterestLifetime=b.maxInterestLifetime||16E3};exports.ExponentialReExpressClosure=ExponentialReExpressClosure;
ExponentialReExpressClosure.prototype.upcall=function(a,b){try{if(a==Closure.UPCALL_INTEREST_TIMED_OUT){var c=b.interest.interestLifetime;if(null==c)return this.callerClosure.upcall(Closure.UPCALL_INTEREST_TIMED_OUT,b);c*=2;if(c>this.maxInterestLifetime)return this.callerClosure.upcall(Closure.UPCALL_INTEREST_TIMED_OUT,b);var d=b.interest.clone();d.interestLifetime=c;b.ndn.expressInterest(d.name,this,d);return Closure.RESULT_OK}return this.callerClosure.upcall(a,b)}catch(e){return console.log("ExponentialReExpressClosure.upcall exception: "+
e),Closure.RESULT_ERR}};var DynamicBuffer=function(a){a||(a=16);this.array=new Buffer(a);this.length=a};exports.DynamicBuffer=DynamicBuffer;DynamicBuffer.prototype.ensureLength=function(a){if(!(this.array.length>=a)){var b=2*this.array.length;a>b&&(b=a);a=new Buffer(b);this.array.copy(a);this.array=a;this.length=b}};DynamicBuffer.prototype.set=function(a,b){this.ensureLength(a.length+b);"object"==typeof a&&a instanceof Buffer?a.copy(this.array,b):(new Buffer(a)).copy(this.array,b)};
DynamicBuffer.prototype.slice=function(a,b){return this.array.slice(a,b)};var DataUtils=function(){};exports.DataUtils=DataUtils;DataUtils.keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
DataUtils.stringtoBase64=function(a){var b="",c,d,e="",f,g,h="",j=0;do c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=a.charCodeAt(j++),f=c>>2,c=(c&3)<<4|d>>4,g=(d&15)<<2|e>>6,h=e&63,isNaN(d)?g=h=64:isNaN(e)&&(h=64),b=b+DataUtils.keyStr.charAt(f)+DataUtils.keyStr.charAt(c)+DataUtils.keyStr.charAt(g)+DataUtils.keyStr.charAt(h);while(j<a.length);return b};
DataUtils.base64toString=function(a){var b="",c,d,e="",f,g="",h=0;/[^A-Za-z0-9\+\/\=]/g.exec(a)&&alert("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding.");a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do c=DataUtils.keyStr.indexOf(a.charAt(h++)),d=DataUtils.keyStr.indexOf(a.charAt(h++)),f=DataUtils.keyStr.indexOf(a.charAt(h++)),g=DataUtils.keyStr.indexOf(a.charAt(h++)),c=c<<2|d>>4,d=(d&15)<<4|f>>2,e=(f&3)<<6|g,
b+=String.fromCharCode(c),64!=f&&(b+=String.fromCharCode(d)),64!=g&&(b+=String.fromCharCode(e));while(h<a.length);return b};DataUtils.toHex=function(a){return a.toString("hex")};DataUtils.stringToHex=function(a){for(var b="",c=0;c<a.length;++c)var d=a.charCodeAt(c),b=b+((16>d?"0":"")+d.toString(16));return b};DataUtils.toString=function(a){return a.toString()};DataUtils.toNumbers=function(a){return new Buffer(a,"hex")};
DataUtils.hexToRawString=function(a){if("string"==typeof a){var b="";a.replace(/(..)/g,function(a){b+=String.fromCharCode(parseInt(a,16))});return b}};DataUtils.toNumbersFromString=function(a){return new Buffer(a,"binary")};DataUtils.stringToUtf8Array=function(a){return new Buffer(a,"utf8")};DataUtils.concatArrays=function(a){return Buffer.concat(a)};
DataUtils.decodeUtf8=function(a){for(var b="",c=0,d=0,e=0;c<a.length;)if(d=a.charCodeAt(c),128>d)b+=String.fromCharCode(d),c++;else if(191<d&&224>d)e=a.charCodeAt(c+1),b+=String.fromCharCode((d&31)<<6|e&63),c+=2;else var e=a.charCodeAt(c+1),f=a.charCodeAt(c+2),b=b+String.fromCharCode((d&15)<<12|(e&63)<<6|f&63),c=c+3;return b};
DataUtils.arraysEqual=function(a,b){if(!a.slice)throw Error("DataUtils.arraysEqual: a1 is not an array");if(!b.slice)throw Error("DataUtils.arraysEqual: a2 is not an array");if(a.length!=b.length)return!1;for(var c=0;c<a.length;++c)if(a[c]!=b[c])return!1;return!0};DataUtils.bigEndianToUnsignedInt=function(a){for(var b=0,c=0;c<a.length;++c)b<<=8,b+=a[c];return b};
DataUtils.nonNegativeIntToBigEndian=function(a){a=Math.round(a);if(0>=a)return new Buffer(0);for(var b=new Buffer(8),c=0;0!=a;)++c,b[8-c]=a&255,a>>=8;return b.slice(8-c,8)};DataUtils.shuffle=function(a){for(var b=a.length-1;1<=b;--b){var c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c];a[c]=d}};
var DateFormat=function(){var a=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,b=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,c=/[^-+\dA-Z]/g,d=function(a,b){a=String(a);for(b=b||2;a.length<b;)a="0"+a;return a};return function(e,f,g){var h=dateFormat;1==arguments.length&&("[object String]"==Object.prototype.toString.call(e)&&!/\d/.test(e))&&(f=e,e=void 0);e=e?new Date(e):new Date;if(isNaN(e))throw SyntaxError("invalid date");
f=String(h.masks[f]||f||h.masks["default"]);"UTC:"==f.slice(0,4)&&(f=f.slice(4),g=!0);var j=g?"getUTC":"get",k=e[j+"Date"](),m=e[j+"Day"](),n=e[j+"Month"](),p=e[j+"FullYear"](),l=e[j+"Hours"](),s=e[j+"Minutes"](),u=e[j+"Seconds"](),j=e[j+"Milliseconds"](),t=g?0:e.getTimezoneOffset(),w={d:k,dd:d(k),ddd:h.i18n.dayNames[m],dddd:h.i18n.dayNames[m+7],m:n+1,mm:d(n+1),mmm:h.i18n.monthNames[n],mmmm:h.i18n.monthNames[n+12],yy:String(p).slice(2),yyyy:p,h:l%12||12,hh:d(l%12||12),H:l,HH:d(l),M:s,MM:d(s),s:u,
ss:d(u),l:d(j,3),L:d(99<j?Math.round(j/10):j),t:12>l?"a":"p",tt:12>l?"am":"pm",T:12>l?"A":"P",TT:12>l?"AM":"PM",Z:g?"UTC":(String(e).match(b)||[""]).pop().replace(c,""),o:(0<t?"-":"+")+d(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4),S:["th","st","nd","rd"][3<k%10?0:(10!=k%100-k%10)*k%10]};return f.replace(a,function(a){return a in w?w[a]:a.slice(1,a.length-1)})}}();
DateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};DateFormat.i18n={dayNames:"Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),monthNames:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ")};
Date.prototype.format=function(a,b){return dateFormat(this,a,b)};
var LOG=require("../log.js").Log.LOG,NDNProtocolDTags=require("../util/ndn-protoco-id-tags.js").NDNProtocolDTags,DynamicBuffer=require("../util/dynamic-buffer.js").DynamicBuffer,DataUtils=require("./data-utils.js").DataUtils,LOG=require("../log.js").Log.LOG,XML_EXT=0,XML_TAG=1,XML_DTAG=2,XML_ATTR=3,XML_DATTR=4,XML_BLOB=5,XML_UDATA=6,XML_CLOSE=0,XML_SUBTYPE_PROCESSING_INSTRUCTIONS=16,XML_TT_BITS=3,XML_TT_MASK=(1<<XML_TT_BITS)-1,XML_TT_VAL_BITS=XML_TT_BITS+1,XML_TT_VAL_MASK=(1<<XML_TT_VAL_BITS)-1,XML_REG_VAL_BITS=
7,XML_REG_VAL_MASK=(1<<XML_REG_VAL_BITS)-1,XML_TT_NO_MORE=1<<XML_REG_VAL_BITS,BYTE_MASK=255,LONG_BYTES=8,LONG_BITS=64,bits_11=2047,bits_18=262143,bits_32=4294967295,BinaryXMLEncoder=function(){this.ostream=new DynamicBuffer(100);this.offset=0;this.CODEC_NAME="Binary"};exports.BinaryXMLEncoder=BinaryXMLEncoder;BinaryXMLEncoder.prototype.writeUString=function(a){this.encodeUString(a,XML_UDATA)};BinaryXMLEncoder.prototype.writeBlob=function(a){3<LOG&&console.log(a);this.encodeBlob(a,a.length)};
BinaryXMLEncoder.prototype.writeStartElement=function(a,b){null==a?this.encodeUString(a,XML_TAG):this.encodeTypeAndVal(XML_DTAG,a);null!=b&&this.writeAttributes(b)};BinaryXMLEncoder.prototype.writeEndElement=function(){this.ostream.ensureLength(this.offset+1);this.ostream.array[this.offset]=XML_CLOSE;this.offset+=1};
BinaryXMLEncoder.prototype.writeAttributes=function(a){if(null!=a)for(var b=0;b<a.length;b++){var c=a[b].k,d=a[b].v,e=stringToTag(c);null==e?this.encodeUString(c,XML_ATTR):this.encodeTypeAndVal(XML_DATTR,e);this.encodeUString(d)}};stringToTag=function(a){return 0<=a&&a<NDNProtocolDTagsStrings.length?NDNProtocolDTagsStrings[a]:a==NDNProtocolDTags.NDNProtocolDataUnit?NDNProtocolDTags.NDNPROTOCOL_DATA_UNIT:null};
tagToString=function(a){for(var b=0;b<NDNProtocolDTagsStrings.length;++b)if(null!=NDNProtocolDTagsStrings[b]&&NDNProtocolDTagsStrings[b]==a)return b;return NDNProtocolDTags.NDNPROTOCOL_DATA_UNIT==a?NDNProtocolDTags.NDNProtocolDataUnit:null};
BinaryXMLEncoder.prototype.writeElement=function(a,b,c){this.writeStartElement(a,c);"number"===typeof b?(4<LOG&&console.log("GOING TO WRITE THE NUMBER .charCodeAt(0) "+b.toString().charCodeAt(0)),4<LOG&&console.log("GOING TO WRITE THE NUMBER "+b.toString()),4<LOG&&console.log("type of number is "+typeof b.toString()),this.writeUString(b.toString())):"string"===typeof b?(4<LOG&&console.log("GOING TO WRITE THE STRING  "+b),4<LOG&&console.log("type of STRING is "+typeof b),this.writeUString(b)):(4<LOG&&
console.log("GOING TO WRITE A BLOB  "+b),this.writeBlob(b));this.writeEndElement()};var TypeAndVal=function(a,b){this.type=a;this.val=b};
BinaryXMLEncoder.prototype.encodeTypeAndVal=function(a,b){4<LOG&&console.log("Encoding type "+a+" and value "+b);4<LOG&&console.log("OFFSET IS "+this.offset);if(a>XML_UDATA||0>a||0>b)throw Error("Tag and value must be positive, and tag valid.");var c=this.numEncodingBytes(b);this.ostream.ensureLength(this.offset+c);this.ostream.array[this.offset+c-1]=BYTE_MASK&(XML_TT_MASK&a|(XML_TT_VAL_MASK&b)<<XML_TT_BITS)|XML_TT_NO_MORE;b>>>=XML_TT_VAL_BITS;for(var d=this.offset+c-2;0!=b&&d>=this.offset;)this.ostream.array[d]=
BYTE_MASK&b&XML_REG_VAL_MASK,b>>>=XML_REG_VAL_BITS,--d;if(0!=b)throw Error("This should not happen: miscalculated encoding");this.offset+=c;return c};
BinaryXMLEncoder.prototype.encodeUString=function(a,b){if(null!=a&&!(b==XML_TAG||b==XML_ATTR&&0==a.length)){3<LOG&&console.log("The string to write is ");3<LOG&&console.log(a);var c=DataUtils.stringToUtf8Array(a);this.encodeTypeAndVal(b,b==XML_TAG||b==XML_ATTR?c.length-1:c.length);3<LOG&&console.log("THE string to write is ");3<LOG&&console.log(c);this.writeString(c);this.offset+=c.length}};
BinaryXMLEncoder.prototype.encodeBlob=function(a,b){null!=a&&(4<LOG&&console.log("LENGTH OF XML_BLOB IS "+b),this.encodeTypeAndVal(XML_BLOB,b),this.writeBlobArray(a),this.offset+=b)};var ENCODING_LIMIT_1_BYTE=(1<<XML_TT_VAL_BITS)-1,ENCODING_LIMIT_2_BYTES=(1<<XML_TT_VAL_BITS+XML_REG_VAL_BITS)-1,ENCODING_LIMIT_3_BYTES=(1<<XML_TT_VAL_BITS+2*XML_REG_VAL_BITS)-1;
BinaryXMLEncoder.prototype.numEncodingBytes=function(a){if(a<=ENCODING_LIMIT_1_BYTE)return 1;if(a<=ENCODING_LIMIT_2_BYTES)return 2;if(a<=ENCODING_LIMIT_3_BYTES)return 3;var b=1;for(a>>>=XML_TT_VAL_BITS;0!=a;)b++,a>>>=XML_REG_VAL_BITS;return b};
BinaryXMLEncoder.prototype.writeDateTime=function(a,b){4<LOG&&console.log("ENCODING DATE with LONG VALUE");4<LOG&&console.log(b.msec);var c=Math.round(4096*(b.msec/1E3)).toString(16);1==c.length%2&&(c="0"+c);c=DataUtils.toNumbers(c);4<LOG&&console.log("ENCODING DATE with BINARY VALUE");4<LOG&&console.log(c);4<LOG&&console.log("ENCODING DATE with BINARY VALUE(HEX)");4<LOG&&console.log(DataUtils.toHex(c));this.writeElement(a,c)};
BinaryXMLEncoder.prototype.writeString=function(a){if("string"===typeof a){4<LOG&&console.log("GOING TO WRITE A STRING");4<LOG&&console.log(a);this.ostream.ensureLength(this.offset+a.length);for(var b=0;b<a.length;b++)4<LOG&&console.log("input.charCodeAt(i)="+a.charCodeAt(b)),this.ostream.array[this.offset+b]=a.charCodeAt(b)}else 4<LOG&&console.log("GOING TO WRITE A STRING IN BINARY FORM"),4<LOG&&console.log(a),this.writeBlobArray(a)};
BinaryXMLEncoder.prototype.writeBlobArray=function(a){4<LOG&&console.log("GOING TO WRITE A BLOB");this.ostream.set(a,this.offset)};BinaryXMLEncoder.prototype.getReducedOstream=function(){return this.ostream.slice(0,this.offset)};NDNProtocolDTags=require("../util/ndn-protoco-id-tags.js").NDNProtocolDTags;NDNTime=require("../util/ndn-time.js").NDNTime;DataUtils=require("./data-utils.js").DataUtils;LOG=require("../log.js").Log.LOG;XML_EXT=0;XML_TAG=1;XML_DTAG=2;XML_ATTR=3;XML_DATTR=4;XML_BLOB=5;
XML_UDATA=6;XML_CLOSE=0;XML_SUBTYPE_PROCESSING_INSTRUCTIONS=16;XML_TT_BITS=3;XML_TT_MASK=(1<<XML_TT_BITS)-1;XML_TT_VAL_BITS=XML_TT_BITS+1;XML_TT_VAL_MASK=(1<<XML_TT_VAL_BITS)-1;XML_REG_VAL_BITS=7;XML_REG_VAL_MASK=(1<<XML_REG_VAL_BITS)-1;XML_TT_NO_MORE=1<<XML_REG_VAL_BITS;BYTE_MASK=255;LONG_BYTES=8;LONG_BITS=64;bits_11=2047;bits_18=262143;bits_32=4294967295;
tagToString=function(a){return 0<=a&&a<NDNProtocolDTagsStrings.length?NDNProtocolDTagsStrings[a]:a==NDNProtocolDTags.NDNProtocolDataUnit?NDNProtocolDTags.NDNPROTOCOL_DATA_UNIT:null};stringToTag=function(a){for(var b=0;b<NDNProtocolDTagsStrings.length;++b)if(null!=NDNProtocolDTagsStrings[b]&&NDNProtocolDTagsStrings[b]==a)return b;return NDNProtocolDTags.NDNPROTOCOL_DATA_UNIT==a?NDNProtocolDTags.NDNProtocolDataUnit:null};var BinaryXMLDecoder=function(a){this.input=a;this.offset=0};
exports.BinaryXMLDecoder=BinaryXMLDecoder;BinaryXMLDecoder.prototype.initializeDecoding=function(){};BinaryXMLDecoder.prototype.readStartDocument=function(){};BinaryXMLDecoder.prototype.readEndDocument=function(){};
BinaryXMLDecoder.prototype.readStartElement=function(a,b){var c=this.decodeTypeAndVal();if(null==c)throw new ContentDecodingException(Error("Expected start element: "+a+" got something not a tag."));var d=null;c.type()==XML_TAG?(d="string"==typeof c.val()?parseInt(c.val())+1:c.val()+1,d=this.decodeUString(d)):c.type()==XML_DTAG&&(d=c.val());if(null==d||d!=a)throw console.log("expecting "+a+" but got "+d),new ContentDecodingException(Error("Expected start element: "+a+" got: "+d+"("+c.val()+")"));
null!=b&&readAttributes(b)};
BinaryXMLDecoder.prototype.readAttributes=function(a){if(null!=a)try{for(var b=this.peekTypeAndVal();null!=b&&(XML_ATTR==b.type()||XML_DATTR==b.type());){var c=this.decodeTypeAndVal(),d=null;if(XML_ATTR==c.type()){var e;e="string"==typeof c.val()?parseInt(c.val())+1:c.val()+1;d=this.decodeUString(e)}else if(XML_DATTR==c.type()&&(d=tagToString(c.val()),null==d))throw new ContentDecodingException(Error("Unknown DATTR value"+c.val()));var f=this.decodeUString();a.push([d,f]);b=this.peekTypeAndVal()}}catch(g){throw new ContentDecodingException(Error("readStartElement",
g));}};BinaryXMLDecoder.prototype.peekStartElementAsString=function(){var a=null,b=this.offset;try{var c=this.decodeTypeAndVal();if(null!=c)if(c.type()==XML_TAG){var d;d="string"==typeof c.val()?parseInt(c.val())+1:c.val()+1;a=this.decodeUString(d)}else c.type()==XML_DTAG&&(a=tagToString(c.val()))}catch(e){}finally{try{this.offset=b}catch(f){throw Log.logStackTrace(Log.FAC_ENCODING,Level.WARNING,f),new ContentDecodingException(Error("Cannot reset stream! "+f.getMessage(),f));}}return a};
BinaryXMLDecoder.prototype.peekStartElement=function(a){if("string"==typeof a){var b=this.peekStartElementAsString();return null!=b&&b==a?!0:!1}if("number"==typeof a)return b=this.peekStartElementAsLong(),null!=b&&b==a?!0:!1;throw new ContentDecodingException(Error("SHOULD BE STRING OR NUMBER"));};
BinaryXMLDecoder.prototype.peekStartElementAsLong=function(){var a=null,b=this.offset;try{var c=this.decodeTypeAndVal();if(null!=c)if(c.type()==XML_TAG){if(c.val()+1>DEBUG_MAX_LEN)throw new ContentDecodingException(Error("Decoding error: length "+c.val()+1+" longer than expected maximum length!"));var d;d="string"==typeof c.val()?parseInt(c.val())+1:c.val()+1;var e=this.decodeUString(d),a=stringToTag(e)}else c.type()==XML_DTAG&&(a=c.val())}catch(f){}finally{try{this.offset=b}catch(g){throw Log.logStackTrace(Log.FAC_ENCODING,
Level.WARNING,g),Error("Cannot reset stream! "+g.getMessage(),g);}}return a};BinaryXMLDecoder.prototype.readBinaryElement=function(a,b,c){this.readStartElement(a,b);return this.readBlob(c)};
BinaryXMLDecoder.prototype.readEndElement=function(){4<LOG&&console.log("this.offset is "+this.offset);var a=this.input[this.offset];this.offset++;4<LOG&&console.log("XML_CLOSE IS "+XML_CLOSE);4<LOG&&console.log("next is "+a);if(a!=XML_CLOSE)throw console.log("Expected end element, got: "+a),new ContentDecodingException(Error("Expected end element, got: "+a));};BinaryXMLDecoder.prototype.readUString=function(){var a=this.decodeUString();this.readEndElement();return a};
BinaryXMLDecoder.prototype.readBlob=function(a){if(this.input[this.offset]==XML_CLOSE&&a)return this.readEndElement(),null;a=this.decodeBlob();this.readEndElement();return a};
BinaryXMLDecoder.prototype.readDateTime=function(a){a=this.readBinaryElement(a);a=DataUtils.toHex(a);a=parseInt(a,16);var b=1E3*(a/4096);4<LOG&&console.log("DECODED DATE WITH VALUE");4<LOG&&console.log(b);b=new NDNTime(b);if(null==b)throw new ContentDecodingException(Error("Cannot parse timestamp: "+DataUtils.printHexBytes(a)));return b};
BinaryXMLDecoder.prototype.decodeTypeAndVal=function(){var a=-1,b=0,c=!0;do{var d=this.input[this.offset];if(null==d||0>d||0==d&&0==b)return null;(c=0==(d&XML_TT_NO_MORE))?(b<<=XML_REG_VAL_BITS,b|=d&XML_REG_VAL_MASK):(a=d&XML_TT_MASK,b<<=XML_TT_VAL_BITS,b|=d>>>XML_TT_BITS&XML_TT_VAL_MASK);this.offset++}while(c);4<LOG&&console.log("TYPE is "+a+" VAL is "+b);return new TypeAndVal(a,b)};
BinaryXMLDecoder.prototype.peekTypeAndVal=function(){var a=null,b=this.offset;try{a=this.decodeTypeAndVal()}finally{this.offset=b}return a};BinaryXMLDecoder.prototype.decodeBlob=function(a){if(null==a)return a=this.decodeTypeAndVal(),a="string"==typeof a.val()?parseInt(a.val()):a.val(),this.decodeBlob(a);var b=new Buffer(this.input.slice(this.offset,this.offset+a));this.offset+=a;return b};
BinaryXMLDecoder.prototype.decodeUString=function(a){if(null==a){a=this.offset;var b=this.decodeTypeAndVal();4<LOG&&console.log("TV is "+b);4<LOG&&console.log(b);4<LOG&&console.log("Type of TV is "+typeof b);return null==b||XML_UDATA!=b.type()?(this.offset=a,""):this.decodeUString(b.val())}a=this.decodeBlob(a);return DataUtils.toString(a)};TypeAndVal=function(a,b){this.t=a;this.v=b};TypeAndVal.prototype.type=function(){return this.t};TypeAndVal.prototype.val=function(){return this.v};
BinaryXMLDecoder.prototype.readIntegerElement=function(a){4<LOG&&console.log("READING INTEGER "+a);4<LOG&&console.log("TYPE OF "+typeof a);a=this.readUTF8Element(a);return parseInt(a)};BinaryXMLDecoder.prototype.readUTF8Element=function(a,b){this.readStartElement(a,b);return this.readUString()};BinaryXMLDecoder.prototype.seek=function(a){this.offset=a};function ContentDecodingException(a){this.message=a.message;for(var b in a)this[b]=a[b]}ContentDecodingException.prototype=Error();
ContentDecodingException.prototype.name="ContentDecodingException";
var BinaryXMLDecoder=require("./binary-xml-decoder.js").BinaryXMLDecoder,DynamicBuffer=require("../util/dynamic-buffer.js").DynamicBuffer,XML_EXT=0,XML_TAG=1,XML_DTAG=2,XML_ATTR=3,XML_DATTR=4,XML_BLOB=5,XML_UDATA=6,XML_CLOSE=0,XML_SUBTYPE_PROCESSING_INSTRUCTIONS=16,XML_TT_BITS=3,XML_TT_MASK=(1<<XML_TT_BITS)-1,XML_TT_VAL_BITS=XML_TT_BITS+1,XML_TT_VAL_MASK=(1<<XML_TT_VAL_BITS)-1,XML_REG_VAL_BITS=7,XML_REG_VAL_MASK=(1<<XML_REG_VAL_BITS)-1,XML_TT_NO_MORE=1<<XML_REG_VAL_BITS,BinaryXMLStructureDecoder=
function(){this.gotElementEnd=!1;this.level=this.offset=0;this.state=BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE;this.headerLength=0;this.useHeaderBuffer=!1;this.headerBuffer=new DynamicBuffer(5);this.nBytesToRead=0};exports.BinaryXMLStructureDecoder=BinaryXMLStructureDecoder;BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE=0;BinaryXMLStructureDecoder.READ_BYTES=1;
BinaryXMLStructureDecoder.prototype.findElementEnd=function(a){if(this.gotElementEnd)return!0;for(var b=new BinaryXMLDecoder(a);;){if(this.offset>=a.length)return!1;switch(this.state){case BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE:if(0==this.headerLength&&a[this.offset]==XML_CLOSE){++this.offset;--this.level;if(0==this.level)return this.gotElementEnd=!0;if(0>this.level)throw Error("BinaryXMLStructureDecoder: Unexpected close tag at offset "+(this.offset-1));this.startHeader();break}for(var c=
this.headerLength;;){if(this.offset>=a.length){this.useHeaderBuffer=!0;var d=this.headerLength-c;this.headerBuffer.set(a.slice(this.offset-d,d),c);return!1}d=a[this.offset++];++this.headerLength;if(d&XML_TT_NO_MORE)break}this.useHeaderBuffer?(d=this.headerLength-c,this.headerBuffer.set(a.slice(this.offset-d,d),c),c=(new BinaryXMLDecoder(this.headerBuffer.array)).decodeTypeAndVal()):(b.seek(this.offset-this.headerLength),c=b.decodeTypeAndVal());if(null==c)throw Error("BinaryXMLStructureDecoder: Can't read header starting at offset "+
(this.offset-this.headerLength));d=c.t;if(d==XML_DATTR)this.startHeader();else if(d==XML_DTAG||d==XML_EXT)++this.level,this.startHeader();else if(d==XML_TAG||d==XML_ATTR)d==XML_TAG&&++this.level,this.nBytesToRead=c.v+1,this.state=BinaryXMLStructureDecoder.READ_BYTES;else if(d==XML_BLOB||d==XML_UDATA)this.nBytesToRead=c.v,this.state=BinaryXMLStructureDecoder.READ_BYTES;else throw Error("BinaryXMLStructureDecoder: Unrecognized header type "+d);break;case BinaryXMLStructureDecoder.READ_BYTES:c=a.length-
this.offset;if(c<this.nBytesToRead)return this.offset+=c,this.nBytesToRead-=c,!1;this.offset+=this.nBytesToRead;this.startHeader();break;default:throw Error("BinaryXMLStructureDecoder: Unrecognized state "+this.state);}}};BinaryXMLStructureDecoder.prototype.startHeader=function(){this.headerLength=0;this.useHeaderBuffer=!1;this.state=BinaryXMLStructureDecoder.READ_HEADER_OR_CLOSE};BinaryXMLStructureDecoder.prototype.seek=function(a){this.offset=a};var WireFormat=function(){};exports.WireFormat=WireFormat;
WireFormat.prototype.encodeInterest=function(){throw Error("encodeInterest is unimplemented in the base WireFormat class.  You should use a derived class.");};WireFormat.prototype.decodeInterest=function(){throw Error("decodeInterest is unimplemented in the base WireFormat class.  You should use a derived class.");};WireFormat.prototype.encodeContentObject=function(){throw Error("encodeContentObject is unimplemented in the base WireFormat class.  You should use a derived class.");};
WireFormat.prototype.decodeContentObject=function(){throw Error("decodeContentObject is unimplemented in the base WireFormat class.  You should use a derived class.");};var DataUtils=require("./data-utils.js").DataUtils,BinaryXMLStructureDecoder=require("./binary-xml-structure-decoder.js").BinaryXMLStructureDecoder,LOG=require("../log.js").Log.LOG,BinaryXmlElementReader=function(a){this.elementListener=a;this.dataParts=[];this.structureDecoder=new BinaryXMLStructureDecoder};
exports.BinaryXmlElementReader=BinaryXmlElementReader;
BinaryXmlElementReader.prototype.onReceivedData=function(a){for(;;)if(this.structureDecoder.seek(0),this.structureDecoder.findElementEnd(a)){this.dataParts.push(a.slice(0,this.structureDecoder.offset));var b=DataUtils.concatArrays(this.dataParts);this.dataParts=[];try{this.elementListener.onReceivedElement(b)}catch(c){console.log("BinaryXmlElementReader: ignoring exception from onReceivedElement: "+c)}a=a.slice(this.structureDecoder.offset,a.length);this.structureDecoder=new BinaryXMLStructureDecoder;
if(0==a.length)break}else{this.dataParts.push(a);3<LOG&&console.log("Incomplete packet received. Length "+a.length+". Wait for more input.");break}};var DataUtils=require("../encoding/data-utils.js").DataUtils,BinaryXMLDecoder=require("../encoding/binary-xml-decoder.js").BinaryXMLDecoder,Closure=require("../closure.js").Closure,NDNProtocolDTags=require("./ndn-protoco-id-tags.js").NDNProtocolDTags,Name=require("../name.js").Name,NameEnumeration={};exports.NameEnumeration=NameEnumeration;
NameEnumeration.getComponents=function(a,b,c){b=new Name(b);b.add([193,46,69,46,98,101]);a.expressInterest(b,new NameEnumeration.Closure(a,c))};NameEnumeration.Closure=function(a,b){Closure.call(this);this.ndn=a;this.onComponents=b;this.contentParts=[]};
NameEnumeration.Closure.prototype.upcall=function(a,b){try{if(a==Closure.UPCALL_CONTENT||a==Closure.UPCALL_CONTENT_UNVERIFIED){var c=b.contentObject;if(NameEnumeration.endsWithSegmentNumber(c.name)){var d=DataUtils.bigEndianToUnsignedInt(c.name.get(c.name.size()-1).getValue()),e=this.contentParts.length;if(d!=e)this.ndn.expressInterest(c.name.getPrefix(c.name.size()-1).addSegment(e),this);else{this.contentParts.push(c.content);if(null!=c.signedInfo&&null!=c.signedInfo.finalBlockID){var f=DataUtils.bigEndianToUnsignedInt(c.signedInfo.finalBlockID);
if(d==f){this.onComponents(NameEnumeration.parseComponents(Buffer.concat(this.contentParts)));return}}this.ndn.expressInterest(c.name.getPrefix(c.name.size()-1).addSegment(e+1),this)}}else this.onComponents(null)}else this.onComponents(null)}catch(g){console.log("NameEnumeration: ignoring exception: "+g)}return Closure.RESULT_OK};
NameEnumeration.parseComponents=function(a){var b=[];a=new BinaryXMLDecoder(a);for(a.readStartElement(NDNProtocolDTags.Collection);a.peekStartElement(NDNProtocolDTags.Link);)a.readStartElement(NDNProtocolDTags.Link),a.readStartElement(NDNProtocolDTags.Name),b.push(new Buffer(a.readBinaryElement(NDNProtocolDTags.Component))),a.readEndElement(),a.readEndElement();a.readEndElement();return b};
NameEnumeration.endsWithSegmentNumber=function(a){return null!=a.components&&1<=a.size()&&1<=a.get(a.size()-1).getValue().length&&0==a.get(a.size()-1).getValue()[0]};
var BinaryXmlElementReader=require("../encoding/binary-xml-element-reader.js").BinaryXmlElementReader,LOG=require("../log.js").Log.LOG,WebSocketTransport=function(){if(!WebSocket)throw Error("WebSocket support is not available on this platform.");this.elementReader=this.connectedPort=this.connectedHost=this.ws=null;this.defaultGetHostAndPort=NDN.makeShuffledGetHostAndPort(["A.ws.ndn.ucla.edu","B.ws.ndn.ucla.edu","C.ws.ndn.ucla.edu","D.ws.ndn.ucla.edu","E.ws.ndn.ucla.edu"],9696)};
exports.WebSocketTransport=WebSocketTransport;
WebSocketTransport.prototype.connect=function(a,b){null!=this.ws&&delete this.ws;this.ws=new WebSocket("ws://"+a.host+":"+a.port);0<LOG&&console.log("ws connection created.");this.connectedHost=a.host;this.connectedPort=a.port;this.ws.binaryType="arraybuffer";this.elementReader=new BinaryXmlElementReader(a);var c=this;this.ws.onmessage=function(a){a=a.data;if(null==a||void 0==a||""==a)console.log("INVALID ANSWER");else if(a instanceof ArrayBuffer){a=new Buffer(a);3<LOG&&console.log("BINARY RESPONSE IS "+
a.toString("hex"));try{c.elementReader.onReceivedData(a)}catch(b){console.log("NDN.ws.onmessage exception: "+b)}}};this.ws.onopen=function(a){3<LOG&&console.log(a);3<LOG&&console.log("ws.onopen: WebSocket connection opened.");3<LOG&&console.log("ws.onopen: ReadyState: "+this.readyState);b()};this.ws.onerror=function(a){console.log("ws.onerror: ReadyState: "+this.readyState);console.log(a);console.log("ws.onerror: WebSocket error: "+a.data)};this.ws.onclose=function(){console.log("ws.onclose: WebSocket connection closed.");
c.ws=null;a.readyStatus=NDN.CLOSED;a.onclose()}};WebSocketTransport.prototype.send=function(a){if(null!=this.ws){var b=new Uint8Array(a.length);b.set(a);this.ws.send(b.buffer);3<LOG&&console.log("ws.send() returned.")}else console.log("WebSocket connection is not established.")};exports.TcpTransport=ndn.WebSocketTransport;Closure=function(){this.ndn_data=null;this.ndn_data_dirty=!1};exports.Closure=Closure;Closure.RESULT_ERR=-1;Closure.RESULT_OK=0;Closure.RESULT_REEXPRESS=1;
Closure.RESULT_INTEREST_CONSUMED=2;Closure.RESULT_VERIFY=3;Closure.RESULT_FETCHKEY=4;Closure.UPCALL_FINAL=0;Closure.UPCALL_INTEREST=1;Closure.UPCALL_CONSUMED_INTEREST=2;Closure.UPCALL_CONTENT=3;Closure.UPCALL_INTEREST_TIMED_OUT=4;Closure.UPCALL_CONTENT_UNVERIFIED=5;Closure.UPCALL_CONTENT_BAD=6;Closure.prototype.upcall=function(){return Closure.RESULT_OK};var UpcallInfo=function(a,b,c,d){this.ndn=a;this.interest=b;this.matchedComps=c;this.contentObject=d};
UpcallInfo.prototype.toString=function(){var a="ndn = "+this.ndn,a=a+("\nInterest = "+this.interest),a=a+("\nmatchedComps = "+this.matchedComps);return a+="\nContentObject: "+this.contentObject};exports.UpcallInfo=UpcallInfo;var NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,LOG=require("./log.js").Log.LOG,PublisherPublicKeyDigest=function(a){this.PUBLISHER_ID_LEN=64;this.publisherPublicKeyDigest=a};exports.PublisherPublicKeyDigest=PublisherPublicKeyDigest;
PublisherPublicKeyDigest.prototype.from_ndnb=function(a){this.publisherPublicKeyDigest=a.readBinaryElement(this.getElementLabel());4<LOG&&console.log("Publisher public key digest is "+this.publisherPublicKeyDigest);if(null==this.publisherPublicKeyDigest)throw Error("Cannot parse publisher key digest.");this.publisherPublicKeyDigest.length!=this.PUBLISHER_ID_LEN&&0<LOG&&console.log("LENGTH OF PUBLISHER ID IS WRONG! Expected "+this.PUBLISHER_ID_LEN+", got "+this.publisherPublicKeyDigest.length)};
PublisherPublicKeyDigest.prototype.to_ndnb=function(a){if(!this.validate())throw Error("Cannot encode : field values missing.");3<LOG&&console.log("PUBLISHER KEY DIGEST IS"+this.publisherPublicKeyDigest);a.writeElement(this.getElementLabel(),this.publisherPublicKeyDigest)};PublisherPublicKeyDigest.prototype.getElementLabel=function(){return NDNProtocolDTags.PublisherPublicKeyDigest};PublisherPublicKeyDigest.prototype.validate=function(){return null!=this.publisherPublicKeyDigest};
var NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,NDNProtocolDTagsStrings=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTagsStrings,PublisherType=function(a){this.KEY=NDNProtocolDTags.PublisherPublicKeyDigest;this.CERTIFICATE=NDNProtocolDTags.PublisherCertificateDigest;this.ISSUER_KEY=NDNProtocolDTags.PublisherIssuerKeyDigest;this.ISSUER_CERTIFICATE=NDNProtocolDTags.PublisherIssuerCertificateDigest;this.Tag=a},isTypeTagVal=function(a){return a==NDNProtocolDTags.PublisherPublicKeyDigest||
a==NDNProtocolDTags.PublisherCertificateDigest||a==NDNProtocolDTags.PublisherIssuerKeyDigest||a==NDNProtocolDTags.PublisherIssuerCertificateDigest?!0:!1},PublisherID=function(){this.PUBLISHER_ID_DIGEST_ALGORITHM="SHA-256";this.PUBLISHER_ID_LEN=32;this.publisherType=this.publisherID=null};exports.PublisherID=PublisherID;
PublisherID.prototype.from_ndnb=function(a){var b=a.peekStartElementAsLong();if(null==b)throw Error("Cannot parse publisher ID.");this.publisherType=new PublisherType(b);if(!isTypeTagVal(b))throw Error("Invalid publisher ID, got unexpected type: "+b);this.publisherID=a.readBinaryElement(b);if(null==this.publisherID)throw new ContentDecodingException(Error("Cannot parse publisher ID of type : "+b+"."));};
PublisherID.prototype.to_ndnb=function(a){if(!this.validate())throw Error("Cannot encode "+this.getClass().getName()+": field values missing.");a.writeElement(this.getElementLabel(),this.publisherID)};PublisherID.peek=function(a){a=a.peekStartElementAsLong();return null==a?!1:isTypeTagVal(a)};PublisherID.prototype.getElementLabel=function(){return this.publisherType.Tag};PublisherID.prototype.validate=function(){return null!=id()&&null!=type()};DataUtils=require("./encoding/data-utils.js").DataUtils;
BinaryXMLEncoder=require("./encoding/binary-xml-encoder.js").BinaryXMLEncoder;BinaryXMLDecoder=require("./encoding/binary-xml-decoder.js").BinaryXMLDecoder;NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags;LOG=require("./log.js").Log.LOG;
Name=function Name(b){if("string"==typeof b)3<LOG&&console.log("Content Name String "+b),this.components=Name.createNameArray(b);else if("object"===typeof b)if(this.components=[],b instanceof Name)this.append(b);else for(var c=0;c<b.length;++c)this.append(b[c]);else null==b?this.components=[]:1<LOG&&console.log("NO CONTENT NAME GIVEN")};exports.Name=Name;
Name.Component=function(a){if("string"==typeof a)this.value=DataUtils.stringToUtf8Array(a);else if("object"==typeof a&&a instanceof Name.Component)this.value=new Buffer(a.value);else if("object"==typeof a&&a instanceof Buffer)this.value=new Buffer(a);else if("object"==typeof a&&"undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)this.value=new Buffer(new ArrayBuffer(a.byteLength)),this.value.set(new Buffer(a));else if("object"==typeof a)this.value=new Buffer(a);else throw Error("Name.Component constructor: Invalid type");
};Name.Component.prototype.getValue=function(){return this.value};Name.prototype.getName=function(){return this.toUri()};
Name.createNameArray=function(a){a=a.trim();if(0>=a.length)return[];var b=a.indexOf(":");if(0<=b){var c=a.indexOf("/");if(0>c||b<c)a=a.substr(b+1,a.length-b-1).trim()}if("/"==a[0])if(2<=a.length&&"/"==a[1]){b=a.indexOf("/",2);if(0>b)return[];a=a.substr(b+1,a.length-b-1).trim()}else a=a.substr(1,a.length-1).trim();a=a.split("/");for(b=0;b<a.length;++b)c=Name.fromEscapedString(a[b]),null==c?(a.splice(b,1),--b):a[b]=new Name.Component(c);return a};
Name.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());for(this.components=[];a.peekStartElement(NDNProtocolDTags.Component);)this.append(a.readBinaryElement(NDNProtocolDTags.Component));a.readEndElement()};Name.prototype.to_ndnb=function(a){if(null==this.components)throw Error("CANNOT ENCODE EMPTY CONTENT NAME");a.writeStartElement(this.getElementLabel());for(var b=this.size(),c=0;c<b;c++)a.writeElement(NDNProtocolDTags.Component,this.components[c].getValue());a.writeEndElement()};
Name.prototype.getElementLabel=function(){return NDNProtocolDTags.Name};Name.prototype.append=function(a){if("object"==typeof a&&a instanceof Name){a=a==this?this.components.slice(0,this.components.length):a.components;for(var b=0;b<a.length;++b)this.components.push(new Name.Component(a[b]))}else this.components.push(new Name.Component(a));return this};Name.prototype.add=function(a){return this.append(a)};
Name.prototype.toUri=function(){if(0==this.size())return"/";for(var a="",b=0;b<this.size();++b)a+="/"+Name.toEscapedString(this.components[b].getValue());return a};Name.prototype.to_uri=function(){return this.toUri()};Name.prototype.appendSegment=function(a){a=DataUtils.nonNegativeIntToBigEndian(a);var b=new Buffer(a.length+1);b[0]=0;a.copy(b,1);this.components.push(new Name.Component(b));return this};Name.prototype.addSegment=function(a){return this.appendSegment(a)};
Name.prototype.getPrefix=function(a){return new Name(this.components.slice(0,a))};Name.prototype.cut=function(a){return new Name(this.components.slice(0,this.components.length-a))};Name.prototype.getComponentCount=function(){return this.components.length};Name.prototype.size=function(){return this.components.length};Name.prototype.get=function(a){return new Name.Component(this.components[a])};Name.prototype.getComponent=function(a){return new Buffer(this.components[a].getValue())};
Name.prototype.indexOfFileName=function(){for(var a=this.size()-1;0<=a;--a){var b=this.components[a].getValue();if(!(0>=b.length)&&!(0==b[0]||192==b[0]||193==b[0]||245<=b[0]&&255>=b[0]))return a}return-1};Name.prototype.equals=function(a){if(this.components.length!=a.components.length)return!1;for(var b=this.components.length-1;0<=b;--b)if(!DataUtils.arraysEqual(this.components[b].getValue(),a.components[b].getValue()))return!1;return!0};Name.prototype.equalsName=function(a){return this.equals(a)};
Name.prototype.getContentDigestValue=function(){for(var a=this.size()-1;0<=a;--a){var b=Name.getComponentContentDigestValue(this.components[a]);if(null!=b)return b}return null};
Name.getComponentContentDigestValue=function(a){"object"==typeof a&&a instanceof Name.Component&&(a=a.getValue());return a.length==Name.ContentDigestPrefix.length+32+Name.ContentDigestSuffix.length&&DataUtils.arraysEqual(a.slice(0,Name.ContentDigestPrefix.length),Name.ContentDigestPrefix)&&DataUtils.arraysEqual(a.slice(a.length-Name.ContentDigestSuffix.length,a.length),Name.ContentDigestSuffix)?a.slice(Name.ContentDigestPrefix.length,Name.ContentDigestPrefix.length+32):null};
Name.ContentDigestPrefix=new Buffer([193,46,77,46,71,193,1,170,2,133]);Name.ContentDigestSuffix=new Buffer([0]);Name.toEscapedString=function(a){"object"==typeof a&&a instanceof Name.Component&&(a=a.getValue());for(var b="",c=!1,d=0;d<a.length;++d)if(46!=a[d]){c=!0;break}if(c)for(d=0;d<a.length;++d)c=a[d],b=48<=c&&57>=c||65<=c&&90>=c||97<=c&&122>=c||43==c||45==c||46==c||95==c?b+String.fromCharCode(c):b+("%"+(16>c?"0":"")+c.toString(16).toUpperCase());else{b="...";for(d=0;d<a.length;++d)b+="."}return b};
Name.fromEscapedString=function(a){a=unescape(a.trim());return null==a.match(/[^.]/)?2>=a.length?null:DataUtils.toNumbersFromString(a.substr(3,a.length-3)):DataUtils.toNumbersFromString(a)};Name.prototype.match=function(a){var b=this.components;a=a.components;if(b.length>a.length)return!1;for(var c=0;c<b.length;++c)if(!DataUtils.arraysEqual(b[c].getValue(),a[c].getValue()))return!1;return!0};
var KeyManager=function(){this.certificate="MIIBmzCCAQQCCQC32FyQa61S7jANBgkqhkiG9w0BAQUFADASMRAwDgYDVQQDEwdheGVsY2R2MB4XDTEyMDQyODIzNDQzN1oXDTEyMDUyODIzNDQzN1owEjEQMA4GA1UEAxMHYXhlbGNkdjCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA4X0wp9goqxuECxdULcr2IHr9Ih4Iaypg0Wy39URIup8/CLzQmdsh3RYqd55hqonu5VTTpH3iMLx6xZDVJAZ8OJi7pvXcQ2C4Re2kjL2c8SanI0RfDhlS1zJadfr1VhRPmpivcYawJ4aFuOLAi+qHFxtN7lhcGCgpW1OV60oXd58CAwEAATANBgkqhkiG9w0BAQUFAAOBgQDLOrA1fXzSrpftUB5Ro6DigX1Bjkf7F5Bkd69hSVp+jYeJFBBlsILQAfSxUZPQtD+2Yc3iCmSYNyxqu9PcufDRJlnvB7PG29+L3y9lR37tetzUV9eTscJ7rdp8Wt6AzpW32IJ/54yKNfP7S6ZIoIG+LP6EIxq6s8K1MXRt8uBJKw==";this.publicKey=
"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhfTCn2CirG4QLF1QtyvYgev0i\nHghrKmDRbLf1REi6nz8IvNCZ2yHdFip3nmGqie7lVNOkfeIwvHrFkNUkBnw4mLum\n9dxDYLhF7aSMvZzxJqcjRF8OGVLXMlp1+vVWFE+amK9xhrAnhoW44sCL6ocXG03u\nWFwYKClbU5XrShd3nwIDAQAB\n-----END PUBLIC KEY-----";this.privateKey="-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQDhfTCn2CirG4QLF1QtyvYgev0iHghrKmDRbLf1REi6nz8IvNCZ\n2yHdFip3nmGqie7lVNOkfeIwvHrFkNUkBnw4mLum9dxDYLhF7aSMvZzxJqcjRF8O\nGVLXMlp1+vVWFE+amK9xhrAnhoW44sCL6ocXG03uWFwYKClbU5XrShd3nwIDAQAB\nAoGAGkv6T6jC3WmhFZYL6CdCWvlc6gysmKrhjarrLTxgavtFY6R5g2ft5BXAsCCV\nbUkWxkIFSKqxpVNl0gKZCNGEzPDN6mHJOQI/h0rlxNIHAuGfoAbCzALnqmyZivhJ\nAPGijAyKuU9tczsst5+Kpn+bn7ehzHQuj7iwJonS5WbojqECQQD851K8TpW2GrRi\nzNgG4dx6orZxAaon/Jnl8lS7soXhllQty7qG+oDfzznmdMsiznCqEABzHUUKOVGE\n9RWPN3aRAkEA5D/w9N55d0ibnChFJlc8cUAoaqH+w+U3oQP2Lb6AZHJpLptN4y4b\n/uf5d4wYU5/i/gC7SSBH3wFhh9bjRLUDLwJAVOx8vN0Kqt7myfKNbCo19jxjVSlA\n8TKCn1Oznl/BU1I+rC4oUaEW25DjmX6IpAR8kq7S59ThVSCQPjxqY/A08QJBAIRa\nF2zGPITQk3r/VumemCvLWiRK/yG0noc9dtibqHOWbCtcXtOm/xDWjq+lis2i3ssO\nvYrvrv0/HcDY+Dv1An0CQQCLJtMsfSg4kvG/FRY5UMhtMuwo8ovYcMXt4Xv/LWaM\nhndD67b2UGawQCRqr5ghRTABWdDD/HuuMBjrkPsX0861\n-----END RSA PRIVATE KEY-----"},
globalKeyManager=globalKeyManager||new KeyManager;exports.globalKeyManager=globalKeyManager;
var DataUtils=require("./encoding/data-utils.js").DataUtils,Name=require("./name.js").Name,BinaryXMLEncoder=require("./encoding/binary-xml-encoder.js").BinaryXMLEncoder,BinaryXMLDecoder=require("./encoding/binary-xml-decoder.js").BinaryXMLDecoder,NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,NDNTime=require("./util/ndn-time.js").NDNTime,Key=require("./key.js").Key,KeyLocator=require("./key.js").KeyLocator,KeyLocatorType=require("./key.js").KeyLocatorType,PublisherPublicKeyDigest=
require("./publisher-public-key-digest.js").PublisherPublicKeyDigest,globalKeyManager=require("./security/key-manager.js").globalKeyManager,LOG=require("./log.js").Log.LOG,ContentObject=function(a,b,c){this.name="string"==typeof a?new Name(a):a;this.signedInfo=b;this.content="string"==typeof c?DataUtils.toNumbersFromString(c):c;this.signature=new Signature;this.rawSignatureData=this.endContent=this.endSIG=this.startSIG=null};exports.ContentObject=ContentObject;
ContentObject.prototype.sign=function(){var a=this.encodeObject(this.name),b=this.encodeObject(this.signedInfo),c=this.encodeContent(),d=require("crypto").createSign("RSA-SHA256");d.update(a);d.update(b);d.update(c);a=new Buffer(d.sign(globalKeyManager.privateKey));this.signature.signature=a};
ContentObject.prototype.verify=function(a){if(null==a||null==a.publicKeyPem)throw Error("Cannot verify ContentObject without a public key.");var b=require("crypto").createVerify("RSA-SHA256");b.update(this.rawSignatureData);return b.verify(a.publicKeyPem,this.signature.signature)};ContentObject.prototype.encodeObject=function(a){var b=new BinaryXMLEncoder;a.to_ndnb(b);return b.getReducedOstream()};
ContentObject.prototype.encodeContent=function(){var a=new BinaryXMLEncoder;a.writeElement(NDNProtocolDTags.Content,this.content);return a.getReducedOstream()};ContentObject.prototype.saveRawData=function(a){a=a.slice(this.startSIG,this.endSIG);this.rawSignatureData=new Buffer(a)};ContentObject.prototype.getElementLabel=function(){return NDNProtocolDTags.ContentObject};var Signature=function(a,b,c){this.witness=a;this.signature=b;this.digestAlgorithm=c};exports.Signature=Signature;
Signature.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());4<LOG&&console.log("STARTED DECODING SIGNATURE");a.peekStartElement(NDNProtocolDTags.DigestAlgorithm)&&(4<LOG&&console.log("DIGIEST ALGORITHM FOUND"),this.digestAlgorithm=a.readUTF8Element(NDNProtocolDTags.DigestAlgorithm));a.peekStartElement(NDNProtocolDTags.Witness)&&(4<LOG&&console.log("WITNESS FOUND"),this.witness=a.readBinaryElement(NDNProtocolDTags.Witness));4<LOG&&console.log("SIGNATURE FOUND");this.signature=
a.readBinaryElement(NDNProtocolDTags.SignatureBits);a.readEndElement()};
Signature.prototype.to_ndnb=function(a){if(!this.validate())throw Error("Cannot encode: field values missing.");a.writeStartElement(this.getElementLabel());null!=this.digestAlgorithm&&!this.digestAlgorithm.equals(NDNDigestHelper.DEFAULT_DIGEST_ALGORITHM)&&a.writeElement(NDNProtocolDTags.DigestAlgorithm,OIDLookup.getDigestOID(this.DigestAlgorithm));null!=this.witness&&a.writeElement(NDNProtocolDTags.Witness,this.witness);a.writeElement(NDNProtocolDTags.SignatureBits,this.signature);a.writeEndElement()};
Signature.prototype.getElementLabel=function(){return NDNProtocolDTags.Signature};Signature.prototype.validate=function(){return null!=this.signature};var ContentType={DATA:0,ENCR:1,GONE:2,KEY:3,LINK:4,NACK:5},ContentTypeValue={"0":787648,1:1101969,2:1631044,3:2639423,4:2917194,5:3408010},ContentTypeValueReverse={787648:0,1101969:1,1631044:2,2639423:3,2917194:4,3408010:5};exports.ContentType=ContentType;
var SignedInfo=function(a,b,c,d,e,f){this.publisher=a;this.timestamp=b;this.type=c;this.locator=d;this.freshnessSeconds=e;this.finalBlockID=f;this.setFields()};exports.SignedInfo=SignedInfo;
SignedInfo.prototype.setFields=function(){var a=new Key;a.fromPemString(globalKeyManager.publicKey,globalKeyManager.privateKey);this.publisher=new PublisherPublicKeyDigest(a.getKeyID());var b=(new Date).getTime();this.timestamp=new NDNTime(b);4<LOG&&console.log("TIME msec is");4<LOG&&console.log(this.timestamp.msec);this.type=0;4<LOG&&console.log("PUBLIC KEY TO WRITE TO CONTENT OBJECT IS ");4<LOG&&console.log(publicKeyBytes);this.locator=new KeyLocator(a.publicToDER(),KeyLocatorType.KEY)};
SignedInfo.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());a.peekStartElement(NDNProtocolDTags.PublisherPublicKeyDigest)&&(4<LOG&&console.log("DECODING PUBLISHER KEY"),this.publisher=new PublisherPublicKeyDigest,this.publisher.from_ndnb(a));a.peekStartElement(NDNProtocolDTags.Timestamp)&&(4<LOG&&console.log("DECODING TIMESTAMP"),this.timestamp=a.readDateTime(NDNProtocolDTags.Timestamp));if(a.peekStartElement(NDNProtocolDTags.Type)){var b=a.readBinaryElement(NDNProtocolDTags.Type);
4<LOG&&console.log("Binary Type of of Signed Info is "+b);this.type=b;if(null==this.type)throw Error("Cannot parse signedInfo type: bytes.");}else this.type=ContentType.DATA;a.peekStartElement(NDNProtocolDTags.FreshnessSeconds)&&(this.freshnessSeconds=a.readIntegerElement(NDNProtocolDTags.FreshnessSeconds),4<LOG&&console.log("FRESHNESS IN SECONDS IS "+this.freshnessSeconds));a.peekStartElement(NDNProtocolDTags.FinalBlockID)&&(4<LOG&&console.log("DECODING FINAL BLOCKID"),this.finalBlockID=a.readBinaryElement(NDNProtocolDTags.FinalBlockID));
a.peekStartElement(NDNProtocolDTags.KeyLocator)&&(4<LOG&&console.log("DECODING KEY LOCATOR"),this.locator=new KeyLocator,this.locator.from_ndnb(a));a.readEndElement()};
SignedInfo.prototype.to_ndnb=function(a){if(!this.validate())throw Error("Cannot encode : field values missing.");a.writeStartElement(this.getElementLabel());null!=this.publisher&&(3<LOG&&console.log("ENCODING PUBLISHER KEY"+this.publisher.publisherPublicKeyDigest),this.publisher.to_ndnb(a));null!=this.timestamp&&a.writeDateTime(NDNProtocolDTags.Timestamp,this.timestamp);null!=this.type&&0!=this.type&&a.writeElement(NDNProtocolDTags.type,this.type);null!=this.freshnessSeconds&&a.writeElement(NDNProtocolDTags.FreshnessSeconds,
this.freshnessSeconds);null!=this.finalBlockID&&a.writeElement(NDNProtocolDTags.FinalBlockID,this.finalBlockID);null!=this.locator&&this.locator.to_ndnb(a);a.writeEndElement()};SignedInfo.prototype.valueToType=function(){return null};SignedInfo.prototype.getElementLabel=function(){return NDNProtocolDTags.SignedInfo};SignedInfo.prototype.validate=function(){return null==this.publisher||null==this.timestamp||null==this.locator?!1:!0};var BinaryXmlWireFormat=require("./encoding/binary-xml-wire-format.js").BinaryXmlWireFormat;
ContentObject.prototype.from_ndnb=function(a){BinaryXmlWireFormat.decodeContentObject(this,a)};ContentObject.prototype.to_ndnb=function(a){BinaryXmlWireFormat.encodeContentObject(this,a)};ContentObject.prototype.encode=function(a){a=a||BinaryXmlWireFormat.instance;return a.encodeContentObject(this)};ContentObject.prototype.decode=function(a,b){b=b||BinaryXmlWireFormat.instance;b.decodeContentObject(this,a)};
var Name=require("./name.js").Name,NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,BinaryXMLEncoder=require("./encoding/binary-xml-encoder.js").BinaryXMLEncoder,BinaryXMLDecoder=require("./encoding/binary-xml-decoder.js").BinaryXMLDecoder,PublisherPublicKeyDigest=require("./publisher-public-key-digest.js").PublisherPublicKeyDigest,DataUtils=require("./encoding/data-utils.js").DataUtils,LOG=require("./log.js").Log.LOG,Interest=function(a,b,c,d,e,f,g,h,j,k,m){this.name=a;
this.faceInstance=b;this.maxSuffixComponents=d;this.minSuffixComponents=c;this.publisherPublicKeyDigest=e;this.exclude=f;this.childSelector=g;this.answerOriginKind=h;this.scope=j;this.interestLifetime=k;this.nonce=m};exports.Interest=Interest;Interest.RECURSIVE_POSTFIX="*";Interest.CHILD_SELECTOR_LEFT=0;Interest.CHILD_SELECTOR_RIGHT=1;Interest.ANSWER_NO_CONTENT_STORE=0;Interest.ANSWER_CONTENT_STORE=1;Interest.ANSWER_GENERATED=2;Interest.ANSWER_STALE=4;Interest.MARK_STALE=16;
Interest.DEFAULT_ANSWER_ORIGIN_KIND=Interest.ANSWER_CONTENT_STORE|Interest.ANSWER_GENERATED;Interest.prototype.matchesName=function(a){return!this.name.match(a)||null!=this.minSuffixComponents&&!(a.size()+1-this.name.size()>=this.minSuffixComponents)||null!=this.maxSuffixComponents&&!(a.size()+1-this.name.size()<=this.maxSuffixComponents)||null!=this.exclude&&a.size()>this.name.size()&&this.exclude.matches(a.components[this.name.size()])?!1:!0};Interest.prototype.matches_name=function(a){return this.matchesName(a)};
Interest.prototype.clone=function(){return new Interest(this.name,this.faceInstance,this.minSuffixComponents,this.maxSuffixComponents,this.publisherPublicKeyDigest,this.exclude,this.childSelector,this.answerOriginKind,this.scope,this.interestLifetime,this.nonce)};var Exclude=function(a){this.values=a||[]};exports.Exclude=Exclude;Exclude.ANY="*";
Exclude.prototype.from_ndnb=function(a){for(a.readStartElement(NDNProtocolDTags.Exclude);;)if(a.peekStartElement(NDNProtocolDTags.Component))this.values.push(a.readBinaryElement(NDNProtocolDTags.Component));else if(a.peekStartElement(NDNProtocolDTags.Any))a.readStartElement(NDNProtocolDTags.Any),a.readEndElement(),this.values.push(Exclude.ANY);else if(a.peekStartElement(NDNProtocolDTags.Bloom))a.readBinaryElement(NDNProtocolDTags.Bloom),this.values.push(Exclude.ANY);else break;a.readEndElement()};
Exclude.prototype.to_ndnb=function(a){if(!(null==this.values||0==this.values.length)){a.writeStartElement(NDNProtocolDTags.Exclude);for(var b=0;b<this.values.length;++b)this.values[b]==Exclude.ANY?(a.writeStartElement(NDNProtocolDTags.Any),a.writeEndElement()):a.writeElement(NDNProtocolDTags.Component,this.values[b]);a.writeEndElement()}};
Exclude.prototype.toUri=function(){if(null==this.values||0==this.values.length)return"";for(var a="",b=0;b<this.values.length;++b)0<b&&(a+=","),a=this.values[b]==Exclude.ANY?a+"*":a+Name.toEscapedString(this.values[b]);return a};
Exclude.prototype.matches=function(a){"object"==typeof a&&a instanceof Name.Component&&(a=a.getValue());for(var b=0;b<this.values.length;++b)if(this.values[b]==Exclude.ANY){var c=null;0<b&&(c=this.values[b-1]);var d,e=null;for(d=b+1;d<this.values.length;++d)if(this.values[d]!=Exclude.ANY){e=this.values[d];break}if(null!=e){if(null!=c){if(0<Exclude.compareComponents(a,c)&&0>Exclude.compareComponents(a,e))return!0}else if(0>Exclude.compareComponents(a,e))return!0;b=d-1}else if(null!=c){if(0<Exclude.compareComponents(a,
c))return!0}else return!0}else if(DataUtils.arraysEqual(a,this.values[b]))return!0;return!1};Exclude.compareComponents=function(a,b){if(a.length<b.length)return-1;if(a.length>b.length)return 1;for(var c=0;c<a.length;++c){if(a[c]<b[c])return-1;if(a[c]>b[c])return 1}return 0};BinaryXmlWireFormat=require("./encoding/binary-xml-wire-format.js").BinaryXmlWireFormat;Interest.prototype.from_ndnb=function(a){BinaryXmlWireFormat.decodeInterest(this,a)};
Interest.prototype.to_ndnb=function(a){BinaryXmlWireFormat.encodeInterest(this,a)};Interest.prototype.encode=function(a){a=a||BinaryXmlWireFormat.instance;return a.encodeInterest(this)};Interest.prototype.decode=function(a,b){b=b||BinaryXmlWireFormat.instance;b.decodeInterest(this,a)};
Interest.prototype.toUri=function(){var a="";null!=this.minSuffixComponents&&(a+="&ndn.MinSuffixComponents="+this.minSuffixComponents);null!=this.maxSuffixComponents&&(a+="&ndn.MaxSuffixComponents="+this.maxSuffixComponents);null!=this.childSelector&&(a+="&ndn.ChildSelector="+this.childSelector);null!=this.answerOriginKind&&(a+="&ndn.AnswerOriginKind="+this.answerOriginKind);null!=this.scope&&(a+="&ndn.Scope="+this.scope);null!=this.interestLifetime&&(a+="&ndn.InterestLifetime="+this.interestLifetime);
null!=this.publisherPublicKeyDigest&&(a+="&ndn.PublisherPublicKeyDigest="+Name.toEscapedString(this.publisherPublicKeyDigest.publisherPublicKeyDigest));null!=this.nonce&&(a+="&ndn.Nonce="+Name.toEscapedString(this.nonce));null!=this.exclude&&(a+="&ndn.Exclude="+this.exclude.toUri());var b=this.name.toUri();""!=a&&(b+="?"+a.substr(1));return b};Name=require("./name.js").Name;NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags;PublisherID=require("./publisher-id.js").PublisherID;
LOG=require("./log.js").Log.LOG;Key=function(){this.privateKeyPem=this.publicKeyPem=this.publicKeyDigest=this.publicKeyDer=null};exports.Key=Key;Key.prototype.publicToDER=function(){return this.publicKeyDer};Key.prototype.privateToDER=function(){var a=this.privateKeyPem.split("\n");priKey="";for(var b=1;b<a.length-1;b++)priKey+=a[b];return new Buffer(priKey,"base64")};Key.prototype.publicToPEM=function(){return this.publicKeyPem};Key.prototype.privateToPEM=function(){return this.privateKeyPem};
Key.prototype.getKeyID=function(){return this.publicKeyDigest};exports.Key=Key;
Key.prototype.readDerPublicKey=function(a){4<LOG&&console.log("Encode DER public key:\n"+a.toString("hex"));this.publicKeyDer=a;var b=require("crypto").createHash("sha256");b.update(this.publicKeyDer);this.publicKeyDigest=new Buffer(b.digest());a=a.toString("base64");for(var b="-----BEGIN PUBLIC KEY-----\n",c=0;c<a.length;c+=64)b+=a.substr(c,64)+"\n";this.publicKeyPem=b+"-----END PUBLIC KEY-----";4<LOG&&console.log("Convert public key to PEM format:\n"+this.publicKeyPem)};
Key.prototype.fromPemString=function(a,b){if(null==a&&null==b)throw Error("Cannot create Key object if both public and private PEM string is empty.");if(null!=a){this.publicKeyPem=a;4<LOG&&console.log("Key.publicKeyPem: \n"+this.publicKeyPem);var c=a.split("\n");a="";for(var d=1;d<c.length-1;d++)a+=c[d];this.publicKeyDer=new Buffer(a,"base64");4<LOG&&console.log("Key.publicKeyDer: \n"+this.publicKeyDer.toString("hex"));c=require("crypto").createHash("sha256");c.update(this.publicKeyDer);this.publicKeyDigest=
new Buffer(c.digest());4<LOG&&console.log("Key.publicKeyDigest: \n"+this.publicKeyDigest.toString("hex"))}null!=b&&(this.privateKeyPem=b,4<LOG&&console.log("Key.privateKeyPem: \n"+this.privateKeyPem))};Key.prototype.fromPem=Key.prototype.fromPemString;Key.createFromPEM=function(a){var b=new Key;b.fromPemString(a.pub,a.pri);return b};KeyLocatorType={KEY:1,CERTIFICATE:2,KEYNAME:3};exports.KeyLocatorType=KeyLocatorType;
KeyLocator=function(a,b){this.type=b;b==KeyLocatorType.KEYNAME?(3<LOG&&console.log("KeyLocator: SET KEYNAME"),this.keyName=a):b==KeyLocatorType.KEY?(3<LOG&&console.log("KeyLocator: SET KEY"),this.publicKey=a):b==KeyLocatorType.CERTIFICATE&&(3<LOG&&console.log("KeyLocator: SET CERTIFICATE"),this.certificate=a)};exports.KeyLocator=KeyLocator;
KeyLocator.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());if(a.peekStartElement(NDNProtocolDTags.Key)){try{this.publicKey=a.readBinaryElement(NDNProtocolDTags.Key),this.type=KeyLocatorType.KEY,4<LOG&&console.log("PUBLIC KEY FOUND: "+this.publicKey)}catch(b){throw Error("Cannot parse key: ",b);}if(null==this.publicKey)throw Error("Cannot parse key: ");}else if(a.peekStartElement(NDNProtocolDTags.Certificate)){try{this.certificate=a.readBinaryElement(NDNProtocolDTags.Certificate),
this.type=KeyLocatorType.CERTIFICATE,4<LOG&&console.log("CERTIFICATE FOUND: "+this.certificate)}catch(c){throw Error("Cannot decode certificate: "+c);}if(null==this.certificate)throw Error("Cannot parse certificate! ");}else this.type=KeyLocatorType.KEYNAME,this.keyName=new KeyName,this.keyName.from_ndnb(a);a.readEndElement()};
KeyLocator.prototype.to_ndnb=function(a){4<LOG&&console.log("type is is "+this.type);if(!this.validate())throw new ContentEncodingException("Cannot encode "+this.getClass().getName()+": field values missing.");a.writeStartElement(this.getElementLabel());if(this.type==KeyLocatorType.KEY)5<LOG&&console.log("About to encode a public key"+this.publicKey),a.writeElement(NDNProtocolDTags.Key,this.publicKey);else if(this.type==KeyLocatorType.CERTIFICATE)try{a.writeElement(NDNProtocolDTags.Certificate,this.certificate)}catch(b){throw Error("CertificateEncodingException attempting to write key locator: "+
b);}else this.type==KeyLocatorType.KEYNAME&&this.keyName.to_ndnb(a);a.writeEndElement()};KeyLocator.prototype.getElementLabel=function(){return NDNProtocolDTags.KeyLocator};KeyLocator.prototype.validate=function(){return null!=this.keyName||null!=this.publicKey||null!=this.certificate};var KeyName=function(){this.contentName=this.contentName;this.publisherID=this.publisherID};exports.KeyName=KeyName;
KeyName.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());this.contentName=new Name;this.contentName.from_ndnb(a);4<LOG&&console.log("KEY NAME FOUND: ");PublisherID.peek(a)&&(this.publisherID=new PublisherID,this.publisherID.from_ndnb(a));a.readEndElement()};
KeyName.prototype.to_ndnb=function(a){if(!this.validate())throw Error("Cannot encode : field values missing.");a.writeStartElement(this.getElementLabel());this.contentName.to_ndnb(a);null!=this.publisherID&&this.publisherID.to_ndnb(a);a.writeEndElement()};KeyName.prototype.getElementLabel=function(){return NDNProtocolDTags.KeyName};KeyName.prototype.validate=function(){return null!=this.contentName};
var NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,PublisherPublicKeyDigest=require("./publisher-public-key-digest.js").PublisherPublicKeyDigest,FaceInstance=function(a,b,c,d,e,f,g,h,j){this.action=a;this.publisherPublicKeyDigest=b;this.faceID=c;this.ipProto=d;this.host=e;this.Port=f;this.multicastInterface=g;this.multicastTTL=h;this.freshnessSeconds=j};exports.FaceInstance=FaceInstance;FaceInstance.NetworkProtocol={TCP:6,UDP:17};
FaceInstance.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());a.peekStartElement(NDNProtocolDTags.Action)&&(this.action=a.readUTF8Element(NDNProtocolDTags.Action));a.peekStartElement(NDNProtocolDTags.PublisherPublicKeyDigest)&&(this.publisherPublicKeyDigest=new PublisherPublicKeyDigest,this.publisherPublicKeyDigest.from_ndnb(a));a.peekStartElement(NDNProtocolDTags.FaceID)&&(this.faceID=a.readIntegerElement(NDNProtocolDTags.FaceID));if(a.peekStartElement(NDNProtocolDTags.IPProto)){var b=
a.readIntegerElement(NDNProtocolDTags.IPProto);this.ipProto=null;if(FaceInstance.NetworkProtocol.TCP==b)this.ipProto=FaceInstance.NetworkProtocol.TCP;else if(FaceInstance.NetworkProtocol.UDP==b)this.ipProto=FaceInstance.NetworkProtocol.UDP;else throw Error("FaceInstance.decoder.  Invalid "+NDNProtocolDTags.tagToString(NDNProtocolDTags.IPProto)+" field: "+b);}a.peekStartElement(NDNProtocolDTags.Host)&&(this.host=a.readUTF8Element(NDNProtocolDTags.Host));a.peekStartElement(NDNProtocolDTags.Port)&&(this.Port=
a.readIntegerElement(NDNProtocolDTags.Port));a.peekStartElement(NDNProtocolDTags.MulticastInterface)&&(this.multicastInterface=a.readUTF8Element(NDNProtocolDTags.MulticastInterface));a.peekStartElement(NDNProtocolDTags.MulticastTTL)&&(this.multicastTTL=a.readIntegerElement(NDNProtocolDTags.MulticastTTL));a.peekStartElement(NDNProtocolDTags.FreshnessSeconds)&&(this.freshnessSeconds=a.readIntegerElement(NDNProtocolDTags.FreshnessSeconds));a.readEndElement()};
FaceInstance.prototype.to_ndnb=function(a){a.writeStartElement(this.getElementLabel());null!=this.action&&0!=this.action.length&&a.writeElement(NDNProtocolDTags.Action,this.action);null!=this.publisherPublicKeyDigest&&this.publisherPublicKeyDigest.to_ndnb(a);null!=this.faceID&&a.writeElement(NDNProtocolDTags.FaceID,this.faceID);null!=this.ipProto&&a.writeElement(NDNProtocolDTags.IPProto,this.ipProto);null!=this.host&&0!=this.host.length&&a.writeElement(NDNProtocolDTags.Host,this.host);null!=this.Port&&
a.writeElement(NDNProtocolDTags.Port,this.Port);null!=this.multicastInterface&&0!=this.multicastInterface.length&&a.writeElement(NDNProtocolDTags.MulticastInterface,this.multicastInterface);null!=this.multicastTTL&&a.writeElement(NDNProtocolDTags.MulticastTTL,this.multicastTTL);null!=this.freshnessSeconds&&a.writeElement(NDNProtocolDTags.FreshnessSeconds,this.freshnessSeconds);a.writeEndElement()};FaceInstance.prototype.getElementLabel=function(){return NDNProtocolDTags.FaceInstance};
var NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,PublisherPublicKeyDigest=require("./publisher-public-key-digest.js").PublisherPublicKeyDigest,Name=require("./name.js").Name,ForwardingEntry=function(a,b,c,d,e,f){this.action=a;this.prefixName=b;this.ndndID=c;this.faceID=d;this.flags=e;this.lifetime=f};exports.ForwardingEntry=ForwardingEntry;
ForwardingEntry.prototype.from_ndnb=function(a){a.readStartElement(this.getElementLabel());a.peekStartElement(NDNProtocolDTags.Action)&&(this.action=a.readUTF8Element(NDNProtocolDTags.Action));a.peekStartElement(NDNProtocolDTags.Name)&&(this.prefixName=new Name,this.prefixName.from_ndnb(a));a.peekStartElement(NDNProtocolDTags.PublisherPublicKeyDigest)&&(this.NdndId=new PublisherPublicKeyDigest,this.NdndId.from_ndnb(a));a.peekStartElement(NDNProtocolDTags.FaceID)&&(this.faceID=a.readIntegerElement(NDNProtocolDTags.FaceID));
a.peekStartElement(NDNProtocolDTags.ForwardingFlags)&&(this.flags=a.readIntegerElement(NDNProtocolDTags.ForwardingFlags));a.peekStartElement(NDNProtocolDTags.FreshnessSeconds)&&(this.lifetime=a.readIntegerElement(NDNProtocolDTags.FreshnessSeconds));a.readEndElement()};
ForwardingEntry.prototype.to_ndnb=function(a){a.writeStartElement(this.getElementLabel());null!=this.action&&0!=this.action.length&&a.writeElement(NDNProtocolDTags.Action,this.action);null!=this.prefixName&&this.prefixName.to_ndnb(a);null!=this.NdndId&&this.NdndId.to_ndnb(a);null!=this.faceID&&a.writeElement(NDNProtocolDTags.FaceID,this.faceID);null!=this.flags&&a.writeElement(NDNProtocolDTags.ForwardingFlags,this.flags);null!=this.lifetime&&a.writeElement(NDNProtocolDTags.FreshnessSeconds,this.lifetime);
a.writeEndElement()};ForwardingEntry.prototype.getElementLabel=function(){return NDNProtocolDTags.ForwardingEntry};NDNProtocolDTags=require("../util/ndn-protoco-id-tags.js").NDNProtocolDTags;BinaryXMLEncoder=require("./binary-xml-encoder.js").BinaryXMLEncoder;BinaryXMLDecoder=require("./binary-xml-decoder.js").BinaryXMLDecoder;WireFormat=require("./wire-format.js").WireFormat;Name=require("../name.js").Name;PublisherPublicKeyDigest=require("../publisher-public-key-digest.js").PublisherPublicKeyDigest;
DataUtils=require("./data-utils.js").DataUtils;BinaryXmlWireFormat=function(){WireFormat.call(this)};exports.BinaryXmlWireFormat=BinaryXmlWireFormat;BinaryXmlWireFormat.instance=new BinaryXmlWireFormat;BinaryXmlWireFormat.prototype.encodeInterest=function(a){var b=new BinaryXMLEncoder;BinaryXmlWireFormat.encodeInterest(a,b);return b.getReducedOstream()};BinaryXmlWireFormat.prototype.decodeInterest=function(a,b){var c=new BinaryXMLDecoder(b);BinaryXmlWireFormat.decodeInterest(a,c)};
BinaryXmlWireFormat.prototype.encodeContentObject=function(a){var b=new BinaryXMLEncoder;BinaryXmlWireFormat.encodeContentObject(a,b);return b.getReducedOstream()};BinaryXmlWireFormat.prototype.decodeContentObject=function(a,b){var c=new BinaryXMLDecoder(b);BinaryXmlWireFormat.decodeContentObject(a,c)};
BinaryXmlWireFormat.encodeInterest=function(a,b){b.writeStartElement(NDNProtocolDTags.Interest);a.name.to_ndnb(b);null!=a.minSuffixComponents&&b.writeElement(NDNProtocolDTags.MinSuffixComponents,a.minSuffixComponents);null!=a.maxSuffixComponents&&b.writeElement(NDNProtocolDTags.MaxSuffixComponents,a.maxSuffixComponents);null!=a.publisherPublicKeyDigest&&a.publisherPublicKeyDigest.to_ndnb(b);null!=a.exclude&&a.exclude.to_ndnb(b);null!=a.childSelector&&b.writeElement(NDNProtocolDTags.ChildSelector,
a.childSelector);a.DEFAULT_ANSWER_ORIGIN_KIND!=a.answerOriginKind&&null!=a.answerOriginKind&&b.writeElement(NDNProtocolDTags.AnswerOriginKind,a.answerOriginKind);null!=a.scope&&b.writeElement(NDNProtocolDTags.Scope,a.scope);null!=a.interestLifetime&&b.writeElement(NDNProtocolDTags.InterestLifetime,DataUtils.nonNegativeIntToBigEndian(4096*(a.interestLifetime/1E3)));null!=a.nonce&&b.writeElement(NDNProtocolDTags.Nonce,a.nonce);b.writeEndElement()};Exclude=require("../interest.js").Exclude;
BinaryXmlWireFormat.decodeInterest=function(a,b){b.readStartElement(NDNProtocolDTags.Interest);a.name=new Name;a.name.from_ndnb(b);a.minSuffixComponents=b.peekStartElement(NDNProtocolDTags.MinSuffixComponents)?b.readIntegerElement(NDNProtocolDTags.MinSuffixComponents):null;a.maxSuffixComponents=b.peekStartElement(NDNProtocolDTags.MaxSuffixComponents)?b.readIntegerElement(NDNProtocolDTags.MaxSuffixComponents):null;b.peekStartElement(NDNProtocolDTags.PublisherPublicKeyDigest)?(a.publisherPublicKeyDigest=
new PublisherPublicKeyDigest,a.publisherPublicKeyDigest.from_ndnb(b)):a.publisherPublicKeyDigest=null;b.peekStartElement(NDNProtocolDTags.Exclude)?(a.exclude=new Exclude,a.exclude.from_ndnb(b)):a.exclude=null;a.childSelector=b.peekStartElement(NDNProtocolDTags.ChildSelector)?b.readIntegerElement(NDNProtocolDTags.ChildSelector):null;a.answerOriginKind=b.peekStartElement(NDNProtocolDTags.AnswerOriginKind)?b.readIntegerElement(NDNProtocolDTags.AnswerOriginKind):null;a.scope=b.peekStartElement(NDNProtocolDTags.Scope)?
b.readIntegerElement(NDNProtocolDTags.Scope):null;a.interestLifetime=b.peekStartElement(NDNProtocolDTags.InterestLifetime)?1E3*DataUtils.bigEndianToUnsignedInt(b.readBinaryElement(NDNProtocolDTags.InterestLifetime))/4096:null;a.nonce=b.peekStartElement(NDNProtocolDTags.Nonce)?b.readBinaryElement(NDNProtocolDTags.Nonce):null;b.readEndElement()};
BinaryXmlWireFormat.encodeContentObject=function(a,b){b.writeStartElement(a.getElementLabel());null!=a.signature&&a.signature.to_ndnb(b);a.startSIG=b.offset;null!=a.name&&a.name.to_ndnb(b);null!=a.signedInfo&&a.signedInfo.to_ndnb(b);b.writeElement(NDNProtocolDTags.Content,a.content);a.endSIG=b.offset;b.writeEndElement();a.saveRawData(b.ostream)};Signature=require("../content-object.js").Signature;SignedInfo=require("../content-object.js").SignedInfo;
BinaryXmlWireFormat.decodeContentObject=function(a,b){b.readStartElement(a.getElementLabel());b.peekStartElement(NDNProtocolDTags.Signature)?(a.signature=new Signature,a.signature.from_ndnb(b)):a.signature=null;a.startSIG=b.offset;a.name=new Name;a.name.from_ndnb(b);b.peekStartElement(NDNProtocolDTags.SignedInfo)?(a.signedInfo=new SignedInfo,a.signedInfo.from_ndnb(b)):a.signedInfo=null;a.content=b.readBinaryElement(NDNProtocolDTags.Content,null,!0);a.endSIG=b.offset;b.readEndElement();a.saveRawData(b.input)};
var DataUtils=require("./data-utils.js").DataUtils,BinaryXMLEncoder=require("./binary-xml-encoder.js").BinaryXMLEncoder,BinaryXMLDecoder=require("./binary-xml-decoder.js").BinaryXMLDecoder,Key=require("../key.js").Key,Interest=require("../interest.js").Interest,ContentObject=require("../content-object.js").ContentObject,FaceInstance=require("../face-instance.js").FaceInstance,ForwardingEntry=require("../forwarding-entry.js").ForwardingEntry,LOG=require("../log.js").Log.LOG,EncodingUtils=function(){};
exports.EncodingUtils=EncodingUtils;EncodingUtils.encodeToHexInterest=function(a){return DataUtils.toHex(a.encode())};EncodingUtils.encodeToHexContentObject=function(a){return DataUtils.toHex(a.encode())};EncodingUtils.encodeForwardingEntry=function(a){var b=new BinaryXMLEncoder;a.to_ndnb(b);return b.getReducedOstream()};
EncodingUtils.decodeHexFaceInstance=function(a){var b=DataUtils.toNumbers(a);a=new BinaryXMLDecoder(b);3<LOG&&console.log("DECODING HEX FACE INSTANCE  \n"+b);b=new FaceInstance;b.from_ndnb(a);return b};EncodingUtils.decodeHexInterest=function(a){var b=new Interest;b.decode(DataUtils.toNumbers(a));return b};EncodingUtils.decodeHexContentObject=function(a){var b=new ContentObject;b.decode(DataUtils.toNumbers(a));return b};
EncodingUtils.decodeHexForwardingEntry=function(a){var b=DataUtils.toNumbers(a);a=new BinaryXMLDecoder(b);3<LOG&&console.log("DECODED HEX FORWARDING ENTRY \n"+b);b=new ForwardingEntry;b.from_ndnb(a);return b};EncodingUtils.decodeSubjectPublicKeyInfo=function(a){a=DataUtils.toHex(a).toLowerCase();a=_x509_getPublicKeyHexArrayFromCertHex(a,_x509_getSubjectPublicKeyPosFromCertHex(a,0));var b=new RSAKey;b.setPublic(a[0],a[1]);return b};
EncodingUtils.contentObjectToHtml=function(a){var b="";if(-1==a)b+="NO CONTENT FOUND";else if(-2==a)b+="CONTENT NAME IS EMPTY";else{null!=a.name&&null!=a.name.components&&(b+="NAME: "+a.name.toUri(),b+="<br /><br />");null!=a.content&&(b+="CONTENT(ASCII): "+DataUtils.toString(a.content),b+="<br />",b+="<br />");null!=a.content&&(b+="CONTENT(hex): "+DataUtils.toHex(a.content),b+="<br />",b+="<br />");null!=a.signature&&null!=a.signature.digestAlgorithm&&(b+="DigestAlgorithm (hex): "+DataUtils.toHex(a.signature.digestAlgorithm),
b+="<br />",b+="<br />");null!=a.signature&&null!=a.signature.witness&&(b+="Witness (hex): "+DataUtils.toHex(a.signature.witness),b+="<br />",b+="<br />");null!=a.signature&&null!=a.signature.signature&&(b+="Signature(hex): "+DataUtils.toHex(a.signature.signature),b+="<br />",b+="<br />");null!=a.signedInfo&&(null!=a.signedInfo.publisher&&null!=a.signedInfo.publisher.publisherPublicKeyDigest)&&(b+="Publisher Public Key Digest(hex): "+DataUtils.toHex(a.signedInfo.publisher.publisherPublicKeyDigest),
b+="<br />",b+="<br />");if(null!=a.signedInfo&&null!=a.signedInfo.timestamp){var c=new Date;c.setTime(a.signedInfo.timestamp.msec);b+="TimeStamp: "+c;b+="<br />";b+="TimeStamp(number): "+a.signedInfo.timestamp.msec;b+="<br />"}null!=a.signedInfo&&null!=a.signedInfo.finalBlockID&&(b+="FinalBlockID: "+DataUtils.toHex(a.signedInfo.finalBlockID),b+="<br />");if(null!=a.signedInfo&&null!=a.signedInfo.locator&&null!=a.signedInfo.locator.publicKey){var c=DataUtils.toHex(a.signedInfo.locator.publicKey).toLowerCase(),
d=DataUtils.toString(a.signedInfo.locator.publicKey),e=DataUtils.toHex(a.signature.signature).toLowerCase(),f=DataUtils.toString(a.rawSignatureData),g="";null!=a.signature.witness&&(g=DataUtils.toHex(a.signature.witness));b+="Public key: "+c;b+="<br />";b+="<br />";2<LOG&&console.log(" ContentName + SignedInfo + Content = "+f);2<LOG&&console.log(" PublicKeyHex = "+c);2<LOG&&console.log(" PublicKeyString = "+d);2<LOG&&console.log(" Signature "+e);2<LOG&&console.log(" Witness "+g);2<LOG&&console.log(" Signature NOW IS");
2<LOG&&console.log(a.signature.signature);c=new Key;c.readDerPublicKey(a.signedInfo.locator.publicKey);b=a.verify(c)?b+"SIGNATURE VALID":b+"SIGNATURE INVALID";b+="<br />";b+="<br />"}}return b};
var encodeToHexInterest=function(a){return EncodingUtils.encodeToHexInterest(a)},encodeToHexContentObject=function(a){return EncodingUtils.encodeToHexContentObject(a)},encodeForwardingEntry=function(a){return EncodingUtils.encodeForwardingEntry(a)},decodeHexFaceInstance=function(a){return EncodingUtils.decodeHexFaceInstance(a)},decodeHexInterest=function(a){return EncodingUtils.decodeHexInterest(a)},decodeHexContentObject=function(a){return EncodingUtils.decodeHexContentObject(a)},decodeHexForwardingEntry=
function(a){return EncodingUtils.decodeHexForwardingEntry(a)},decodeSubjectPublicKeyInfo=function(a){return EncodingUtils.decodeSubjectPublicKeyInfo(a)},contentObjectToHtml=function(a){return EncodingUtils.contentObjectToHtml(a)};function encodeToBinaryInterest(a){return a.encode()}function encodeToBinaryContentObject(a){return a.encode()}
var DataUtils=require("./encoding/data-utils.js").DataUtils,Name=require("./name.js").Name,Interest=require("./interest.js").Interest,ContentObject=require("./content-object.js").ContentObject,ForwardingEntry=require("./forwarding-entry.js").ForwardingEntry,BinaryXMLDecoder=require("./encoding/binary-xml-decoder.js").BinaryXMLDecoder,NDNProtocolDTags=require("./util/ndn-protoco-id-tags.js").NDNProtocolDTags,Key=require("./key.js").Key,KeyLocatorType=require("./key.js").KeyLocatorType,Closure=require("./closure.js").Closure,
UpcallInfo=require("./closure.js").UpcallInfo,TcpTransport=require("./transport/tcp-transport.js").TcpTransport,LOG=require("./log.js").Log.LOG,NDN=function NDN(b){if(!NDN.supported)throw Error("The necessary JavaScript support is not available on this platform.");b=b||{};this.transport=(b.getTransport||function(){return new TcpTransport})();this.getHostAndPort=b.getHostAndPort||this.transport.defaultGetHostAndPort;this.host=void 0!==b.host?b.host:null;this.port=b.port||("undefined"!=typeof WebSocketTransport?
9696:6363);this.readyStatus=NDN.UNOPEN;this.verify=void 0!==b.verify?b.verify:!1;this.onopen=b.onopen||function(){3<LOG&&console.log("NDN connection established.")};this.onclose=b.onclose||function(){3<LOG&&console.log("NDN connection closed.")};this.ndndid=null};exports.NDN=NDN;NDN.UNOPEN=0;NDN.OPENED=1;NDN.CLOSED=2;NDN.getSupported=function(){try{(new Buffer(1)).slice(0,1)}catch(a){return console.log("NDN not available: Buffer not supported. "+a),!1}return!0};NDN.supported=NDN.getSupported();
NDN.ndndIdFetcher=new Name("/%C1.M.S.localhost/%C1.M.SRV/ndnd/KEY");NDN.prototype.createRoute=function(a,b){this.host=a;this.port=b};NDN.KeyStore=[];var KeyStoreEntry=function(a,b,c){this.keyName=a;this.rsaKey=b;this.timeStamp=c};NDN.addKeyEntry=function(a){null==NDN.getKeyByName(a.keyName)&&NDN.KeyStore.push(a)};
NDN.getKeyByName=function(a){for(var b=null,c=0;c<NDN.KeyStore.length;c++)if(NDN.KeyStore[c].keyName.contentName.match(a.contentName)&&(null==b||NDN.KeyStore[c].keyName.contentName.components.length>b.keyName.contentName.components.length))b=NDN.KeyStore[c];return b};NDN.prototype.close=function(){if(this.readyStatus!=NDN.OPENED)throw Error("Cannot close because NDN connection is not opened.");this.readyStatus=NDN.CLOSED;this.transport.close()};NDN.PITTable=[];
var PITEntry=function(a,b){this.interest=a;this.closure=b;this.timerID=-1};NDN.getEntryForExpressedInterest=function(a){for(var b=null,c=0;c<NDN.PITTable.length;c++)if(NDN.PITTable[c].interest.matchesName(a)&&(null==b||NDN.PITTable[c].interest.name.components.length>b.interest.name.components.length))b=NDN.PITTable[c];return b};NDN.CSTable=[];var CSEntry=function(a,b){this.name=a;this.closure=b};
function getEntryForRegisteredPrefix(a){for(var b=0;b<NDN.CSTable.length;b++)if(NDN.CSTable[b].name.match(a))return NDN.CSTable[b];return null}NDN.makeShuffledGetHostAndPort=function(a,b){a=a.slice(0,a.length);DataUtils.shuffle(a);return function(){return 0==a.length?null:{host:a.splice(0,1)[0],port:b}}};
NDN.prototype.expressInterest=function(a,b,c){var d=new Interest(a);null!=c?(d.minSuffixComponents=c.minSuffixComponents,d.maxSuffixComponents=c.maxSuffixComponents,d.publisherPublicKeyDigest=c.publisherPublicKeyDigest,d.exclude=c.exclude,d.childSelector=c.childSelector,d.answerOriginKind=c.answerOriginKind,d.scope=c.scope,d.interestLifetime=c.interestLifetime):d.interestLifetime=4E3;if(null==this.host||null==this.port)if(null==this.getHostAndPort)console.log("ERROR: host OR port NOT SET");else{var e=
this;this.connectAndExecute(function(){e.reconnectAndExpressInterest(d,b)})}else this.reconnectAndExpressInterest(d,b)};NDN.prototype.reconnectAndExpressInterest=function(a,b){if(this.transport.connectedHost!=this.host||this.transport.connectedPort!=this.port){var c=this;this.transport.connect(c,function(){c.expressInterestHelper(a,b)});this.readyStatus=NDN.OPENED}else this.expressInterestHelper(a,b)};
NDN.prototype.expressInterestHelper=function(a,b){var c=a.encode(),d=this;if(null!=b){var e=new PITEntry(a,b);NDN.PITTable.push(e);b.pitEntry=e;var f=a.interestLifetime||4E3,g=function(){1<LOG&&console.log("Interest time out: "+a.name.toUri());var h=NDN.PITTable.indexOf(e);0<=h&&NDN.PITTable.splice(h,1);b.upcall(Closure.UPCALL_INTEREST_TIMED_OUT,new UpcallInfo(d,a,0,null))==Closure.RESULT_REEXPRESS&&(1<LOG&&console.log("Re-express interest: "+a.name.toUri()),e.timerID=setTimeout(g,f),NDN.PITTable.push(e),
d.transport.send(c))};e.timerID=setTimeout(g,f)}this.transport.send(c)};
NDN.prototype.registerPrefix=function(a,b,c){c|=3;var d=this,e=function(){if(null==d.ndndid){var e=new Interest(NDN.ndndIdFetcher);e.interestLifetime=4E3;3<LOG&&console.log("Expressing interest for ndndid from ndnd.");d.reconnectAndExpressInterest(e,new NDN.FetchNdndidClosure(d,a,b,c))}else d.registerPrefixHelper(a,b,c)};null==this.host||null==this.port?null==this.getHostAndPort?console.log("ERROR: host OR port NOT SET"):this.connectAndExecute(e):e()};
NDN.FetchNdndidClosure=function(a,b,c,d){Closure.call(this);this.ndn=a;this.name=b;this.callerClosure=c;this.flags=d};
NDN.FetchNdndidClosure.prototype.upcall=function(a,b){if(a==Closure.UPCALL_INTEREST_TIMED_OUT)return console.log("Timeout while requesting the ndndid.  Cannot registerPrefix for "+this.name.toUri()+" ."),Closure.RESULT_OK;if(!(a==Closure.UPCALL_CONTENT||a==Closure.UPCALL_CONTENT_UNVERIFIED))return Closure.RESULT_ERR;var c=b.contentObject;!c.signedInfo||!c.signedInfo.publisher||!c.signedInfo.publisher.publisherPublicKeyDigest?console.log("ContentObject doesn't have a publisherPublicKeyDigest. Cannot set ndndid and registerPrefix for "+
this.name.toUri()+" ."):(3<LOG&&console.log("Got ndndid from ndnd."),this.ndn.ndndid=c.signedInfo.publisher.publisherPublicKeyDigest,3<LOG&&console.log(this.ndn.ndndid),this.ndn.registerPrefixHelper(this.name,this.callerClosure,this.flags));return Closure.RESULT_OK};
NDN.prototype.registerPrefixHelper=function(a,b,c){c=new ForwardingEntry("selfreg",a,null,null,c,2147483647);var d=new BinaryXMLEncoder;c.to_ndnb(d);c=d.getReducedOstream();d=new SignedInfo;d.setFields();c=new ContentObject(new Name,d,c);c.sign();c=c.encode();c=new Name(["ndnx",this.ndndid,"selfreg",c]);c=new Interest(c);c.scope=1;3<LOG&&console.log("Send Interest registration packet.");a=new CSEntry(a.toUri(),b);NDN.CSTable.push(a);this.transport.send(c.encode())};
NDN.prototype.onReceivedElement=function(a){3<LOG&&console.log("Complete element received. Length "+a.length+". Start decoding.");var b=new BinaryXMLDecoder(a);if(b.peekStartElement(NDNProtocolDTags.Interest))3<LOG&&console.log("Interest packet received."),a=new Interest,a.from_ndnb(b),3<LOG&&console.log(a),b=escape(a.name.toUri()),3<LOG&&console.log(b),b=getEntryForRegisteredPrefix(b),null!=b&&(a=new UpcallInfo(this,a,0,null),b.closure.upcall(Closure.UPCALL_INTEREST,a)==Closure.RESULT_INTEREST_CONSUMED&&
null!=a.contentObject&&this.transport.send(a.contentObject.encode()));else if(b.peekStartElement(NDNProtocolDTags.ContentObject)){3<LOG&&console.log("ContentObject packet received.");var c=new ContentObject;c.from_ndnb(b);a=NDN.getEntryForExpressedInterest(c.name);if(null!=a)if(clearTimeout(a.timerID),b=NDN.PITTable.indexOf(a),0<=b&&NDN.PITTable.splice(b,1),b=a.closure,!1==this.verify)b.upcall(Closure.UPCALL_CONTENT_UNVERIFIED,new UpcallInfo(this,a.interest,0,c));else{var d=function(a,b,c){this.contentObject=
a;this.closure=b;this.keyName=c;Closure.call(this)},e=this;d.prototype.upcall=function(a,b){if(a==Closure.UPCALL_INTEREST_TIMED_OUT)console.log("In KeyFetchClosure.upcall: interest time out."),console.log(this.keyName.contentName.toUri());else if(a==Closure.UPCALL_CONTENT){var d=new Key;d.readDerPublicKey(b.contentObject.content);var f=!0==c.verify(d)?Closure.UPCALL_CONTENT:Closure.UPCALL_CONTENT_BAD;this.closure.upcall(f,new UpcallInfo(e,null,0,this.contentObject));d=new KeyStoreEntry(g.keyName,
d,(new Date).getTime());NDN.addKeyEntry(d)}else a==Closure.UPCALL_CONTENT_BAD&&console.log("In KeyFetchClosure.upcall: signature verification failed")};if(c.signedInfo&&c.signedInfo.locator&&c.signature){3<LOG&&console.log("Key verification...");var f=DataUtils.toHex(c.signature.signature).toLowerCase();null!=c.signature.witness&&b.upcall(Closure.UPCALL_CONTENT_BAD,new UpcallInfo(this,a.interest,0,c));var g=c.signedInfo.locator;if(g.type==KeyLocatorType.KEYNAME)if(3<LOG&&console.log("KeyLocator contains KEYNAME"),
g.keyName.contentName.match(c.name))3<LOG&&console.log("Content is key itself"),d=new Key,d.readDerPublicKey(c.content),d=c.verify(d),d=!0==d?Closure.UPCALL_CONTENT:Closure.UPCALL_CONTENT_BAD,b.upcall(d,new UpcallInfo(this,a.interest,0,c));else{var h=NDN.getKeyByName(g.keyName);h?(3<LOG&&console.log("Local key cache hit"),d=h.rsaKey,d=c.verify(d),d=!0==d?Closure.UPCALL_CONTENT:Closure.UPCALL_CONTENT_BAD,b.upcall(d,new UpcallInfo(this,a.interest,0,c))):(3<LOG&&console.log("Fetch key according to keylocator"),
a=new d(c,b,g.keyName,f,null),this.expressInterest(g.keyName.contentName.getPrefix(4),a))}else g.type==KeyLocatorType.KEY?(3<LOG&&console.log("Keylocator contains KEY"),d=new Key,d.readDerPublicKey(g.publicKey),d=c.verify(d),d=!0==d?Closure.UPCALL_CONTENT:Closure.UPCALL_CONTENT_BAD,b.upcall(Closure.UPCALL_CONTENT,new UpcallInfo(this,a.interest,0,c))):(a=g.certificate,console.log("KeyLocator contains CERT"),console.log(a))}}}else console.log("Incoming packet is not Interest or ContentObject. Discard now.")};
NDN.prototype.connectAndExecute=function(a){var b=this.getHostAndPort();if(null==b)console.log("ERROR: No more hosts from getHostAndPort"),this.host=null;else if(b.host==this.host&&b.port==this.port)console.log("ERROR: The host returned by getHostAndPort is not alive: "+this.host+":"+this.port);else{this.host=b.host;this.port=b.port;0<LOG&&console.log("connectAndExecute: trying host from getHostAndPort: "+this.host);b=new Interest(new Name("/"));b.interestLifetime=4E3;var c=this,d=setTimeout(function(){0<
LOG&&console.log("connectAndExecute: timeout waiting for host "+c.host);c.connectAndExecute(a)},3E3);this.reconnectAndExpressInterest(b,new NDN.ConnectClosure(this,a,d))}};NDN.prototype.closeByTransport=function(){this.readyStatus=NDN.CLOSED;this.onclose()};NDN.ConnectClosure=function(a,b,c){Closure.call(this);this.ndn=a;this.onConnected=b;this.timerID=c};
NDN.ConnectClosure.prototype.upcall=function(a){if(!(a==Closure.UPCALL_CONTENT||a==Closure.UPCALL_CONTENT_UNVERIFIED))return Closure.RESULT_ERR;clearTimeout(this.timerID);this.ndn.readyStatus=NDN.OPENED;this.ndn.onopen();0<LOG&&console.log("connectAndExecute: connected to host "+this.ndn.host);this.onConnected();return Closure.RESULT_OK};
var CryptoJS=CryptoJS||function(a,b){var c={},d=c.lib={},e=function(){},f=d.Base={extend:function(a){e.prototype=this;var b=new e;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
g=d.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=b?c:4*a.length},toString:function(a){return(a||j).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var b=this.words,c=this.sigBytes;b[c>>>2]&=4294967295<<
32-8*(c%4);b.length=a.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(b){for(var c=[],d=0;d<b;d+=4)c.push(4294967296*a.random()|0);return new g.init(c,b)}}),h=c.enc={},j=h.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16));c.push((e&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new g.init(c,b/2)}},k=h.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new g.init(c,b)}},m=h.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
n=d.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new g.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=m.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(b){var c=this._data,d=c.words,e=c.sigBytes,f=this.blockSize,h=e/(4*f),h=b?a.ceil(h):a.max((h|0)-this._minBufferSize,0);b=h*f;e=a.min(4*b,e);if(b){for(var j=0;j<b;j+=f)this._doProcessBlock(d,j);j=d.splice(0,b);c.sigBytes-=e}return new g.init(j,e)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=n.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){n.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new p.HMAC.init(a,
c)).finalize(b)}}});var p=c.algo={};return c}(Math);
(function(a){for(var b=CryptoJS,c=b.lib,d=c.WordArray,e=c.Hasher,c=b.algo,f=[],g=[],h=function(a){return 4294967296*(a-(a|0))|0},j=2,k=0;64>k;){var m;a:{m=j;for(var n=a.sqrt(m),p=2;p<=n;p++)if(!(m%p)){m=!1;break a}m=!0}m&&(8>k&&(f[k]=h(a.pow(j,0.5))),g[k]=h(a.pow(j,1/3)),k++);j++}var l=[],c=c.SHA256=e.extend({_doReset:function(){this._hash=new d.init(f.slice(0))},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],j=c[4],k=c[5],m=c[6],n=c[7],p=0;64>p;p++){if(16>p)l[p]=
a[b+p]|0;else{var q=l[p-15],r=l[p-2];l[p]=((q<<25|q>>>7)^(q<<14|q>>>18)^q>>>3)+l[p-7]+((r<<15|r>>>17)^(r<<13|r>>>19)^r>>>10)+l[p-16]}q=n+((j<<26|j>>>6)^(j<<21|j>>>11)^(j<<7|j>>>25))+(j&k^~j&m)+g[p]+l[p];r=((d<<30|d>>>2)^(d<<19|d>>>13)^(d<<10|d>>>22))+(d&e^d&f^e&f);n=m;m=k;k=j;j=h+q|0;h=f;f=e;e=d;d=q+r|0}c[0]=c[0]+d|0;c[1]=c[1]+e|0;c[2]=c[2]+f|0;c[3]=c[3]+h|0;c[4]=c[4]+j|0;c[5]=c[5]+k|0;c[6]=c[6]+m|0;c[7]=c[7]+n|0},_doFinalize:function(){var b=this._data,c=b.words,d=8*this._nDataBytes,e=8*b.sigBytes;
c[e>>>5]|=128<<24-e%32;c[(e+64>>>9<<4)+14]=a.floor(d/4294967296);c[(e+64>>>9<<4)+15]=d;b.sigBytes=4*c.length;this._process();return this._hash},clone:function(){var a=e.clone.call(this);a._hash=this._hash.clone();return a}});b.SHA256=e._createHelper(c);b.HmacSHA256=e._createHmacHelper(c)})(Math);var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b64pad="=";
function hex2b64(a){var b,c,d="";for(b=0;b+3<=a.length;b+=3)c=parseInt(a.substring(b,b+3),16),d+=b64map.charAt(c>>6)+b64map.charAt(c&63);b+1==a.length?(c=parseInt(a.substring(b,b+1),16),d+=b64map.charAt(c<<2)):b+2==a.length&&(c=parseInt(a.substring(b,b+2),16),d+=b64map.charAt(c>>2)+b64map.charAt((c&3)<<4));if(b64pad)for(;0<(d.length&3);)d+=b64pad;return d}
function b64tohex(a){var b="",c,d=0,e;for(c=0;c<a.length&&a.charAt(c)!=b64pad;++c)v=b64map.indexOf(a.charAt(c)),0>v||(0==d?(b+=int2char(v>>2),e=v&3,d=1):1==d?(b+=int2char(e<<2|v>>4),e=v&15,d=2):2==d?(b+=int2char(e),b+=int2char(v>>2),e=v&3,d=3):(b+=int2char(e<<2|v>>4),b+=int2char(v&15),d=0));1==d&&(b+=int2char(e<<2));return b}function b64toBA(a){a=b64tohex(a);var b,c=[];for(b=0;2*b<a.length;++b)c[b]=parseInt(a.substring(2*b,2*b+2),16);return c}function parseBigInt(a,b){return new BigInteger(a,b)}
function linebrk(a,b){for(var c="",d=0;d+b<a.length;)c+=a.substring(d,d+b)+"\n",d+=b;return c+a.substring(d,a.length)}function byte2Hex(a){return 16>a?"0"+a.toString(16):a.toString(16)}
function pkcs1pad2(a,b){if(b<a.length+11)return alert("Message too long for RSA"),null;for(var c=[],d=a.length-1;0<=d&&0<b;){var e=a.charCodeAt(d--);128>e?c[--b]=e:127<e&&2048>e?(c[--b]=e&63|128,c[--b]=e>>6|192):(c[--b]=e&63|128,c[--b]=e>>6&63|128,c[--b]=e>>12|224)}c[--b]=0;d=new SecureRandom;for(e=[];2<b;){for(e[0]=0;0==e[0];)d.nextBytes(e);c[--b]=e[0]}c[--b]=2;c[--b]=0;return new BigInteger(c)}
function oaep_mgf1_arr(a,b,c){for(var d="",e=0;d.length<b;)d+=c(String.fromCharCode.apply(String,a.concat([(e&4278190080)>>24,(e&16711680)>>16,(e&65280)>>8,e&255]))),e+=1;return d}var SHA1_SIZE=20;
function oaep_pad(a,b,c){if(a.length+2*SHA1_SIZE+2>b)throw"Message too long for RSA";var d="",e;for(e=0;e<b-a.length-2*SHA1_SIZE-2;e+=1)d+="\x00";b=rstr_sha1("")+d+"\u0001"+a;a=Array(SHA1_SIZE);(new SecureRandom).nextBytes(a);d=oaep_mgf1_arr(a,b.length,c||rstr_sha1);c=[];for(e=0;e<b.length;e+=1)c[e]=b.charCodeAt(e)^d.charCodeAt(e);b=oaep_mgf1_arr(c,a.length,rstr_sha1);d=[0];for(e=0;e<a.length;e+=1)d[e+1]=a[e]^b.charCodeAt(e);return new BigInteger(d.concat(c))}
function RSAKey(){this.n=null;this.e=0;this.coeff=this.dmq1=this.dmp1=this.q=this.p=this.d=null}function RSASetPublic(a,b){"string"!==typeof a?(this.n=a,this.e=b):null!=a&&null!=b&&0<a.length&&0<b.length?(this.n=parseBigInt(a,16),this.e=parseInt(b,16)):alert("Invalid RSA public key")}function RSADoPublic(a){return a.modPowInt(this.e,this.n)}
function RSAEncrypt(a){a=pkcs1pad2(a,this.n.bitLength()+7>>3);if(null==a)return null;a=this.doPublic(a);if(null==a)return null;a=a.toString(16);return 0==(a.length&1)?a:"0"+a}function RSAEncryptOAEP(a,b){var c=oaep_pad(a,this.n.bitLength()+7>>3,b);if(null==c)return null;c=this.doPublic(c);if(null==c)return null;c=c.toString(16);return 0==(c.length&1)?c:"0"+c}RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt;
RSAKey.prototype.encryptOAEP=RSAEncryptOAEP;function pkcs1unpad2(a,b){for(var c=a.toByteArray(),d=0;d<c.length&&0==c[d];)++d;if(c.length-d!=b-1||2!=c[d])return null;for(++d;0!=c[d];)if(++d>=c.length)return null;for(var e="";++d<c.length;){var f=c[d]&255;128>f?e+=String.fromCharCode(f):191<f&&224>f?(e+=String.fromCharCode((f&31)<<6|c[d+1]&63),++d):(e+=String.fromCharCode((f&15)<<12|(c[d+1]&63)<<6|c[d+2]&63),d+=2)}return e}
function oaep_mgf1_str(a,b,c){for(var d="",e=0;d.length<b;)d+=c(a+String.fromCharCode.apply(String,[(e&4278190080)>>24,(e&16711680)>>16,(e&65280)>>8,e&255])),e+=1;return d}SHA1_SIZE=20;
function oaep_unpad(a,b,c){a=a.toByteArray();var d;for(d=0;d<a.length;d+=1)a[d]&=255;for(;a.length<b;)a.unshift(0);a=String.fromCharCode.apply(String,a);if(a.length<2*SHA1_SIZE+2)throw"Cipher too short";var e=a.substr(1,SHA1_SIZE);b=a.substr(SHA1_SIZE+1);c=oaep_mgf1_str(b,SHA1_SIZE,c||rstr_sha1);var f=[];for(d=0;d<e.length;d+=1)f[d]=e.charCodeAt(d)^c.charCodeAt(d);e=oaep_mgf1_str(String.fromCharCode.apply(String,f),a.length-SHA1_SIZE,rstr_sha1);a=[];for(d=0;d<b.length;d+=1)a[d]=b.charCodeAt(d)^e.charCodeAt(d);
a=String.fromCharCode.apply(String,a);if(a.substr(0,SHA1_SIZE)!==rstr_sha1(""))throw"Hash mismatch";a=a.substr(SHA1_SIZE);d=a.indexOf("\u0001");if((-1!=d?a.substr(0,d).lastIndexOf("\x00"):-1)+1!=d)throw"Malformed data";return a.substr(d+1)}function RSASetPrivate(a,b,c){"string"!==typeof a?(this.n=a,this.e=b,this.d=c):null!=a&&null!=b&&0<a.length&&0<b.length?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16)):alert("Invalid RSA private key")}
function RSASetPrivateEx(a,b,c,d,e,f,g,h){if(null==a)throw"RSASetPrivateEx N == null";if(null==b)throw"RSASetPrivateEx E == null";if(0==a.length)throw"RSASetPrivateEx N.length == 0";if(0==b.length)throw"RSASetPrivateEx E.length == 0";null!=a&&null!=b&&0<a.length&&0<b.length?(this.n=parseBigInt(a,16),this.e=parseInt(b,16),this.d=parseBigInt(c,16),this.p=parseBigInt(d,16),this.q=parseBigInt(e,16),this.dmp1=parseBigInt(f,16),this.dmq1=parseBigInt(g,16),this.coeff=parseBigInt(h,16)):alert("Invalid RSA private key in RSASetPrivateEx")}
function RSAGenerate(a,b){var c=new SecureRandom,d=a>>1;this.e=parseInt(b,16);for(var e=new BigInteger(b,16);;){for(;!(this.p=new BigInteger(a-d,1,c),0==this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)&&this.p.isProbablePrime(10)););for(;!(this.q=new BigInteger(d,1,c),0==this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE)&&this.q.isProbablePrime(10)););if(0>=this.p.compareTo(this.q)){var f=this.p;this.p=this.q;this.q=f}var f=this.p.subtract(BigInteger.ONE),g=this.q.subtract(BigInteger.ONE),
h=f.multiply(g);if(0==h.gcd(e).compareTo(BigInteger.ONE)){this.n=this.p.multiply(this.q);this.d=e.modInverse(h);this.dmp1=this.d.mod(f);this.dmq1=this.d.mod(g);this.coeff=this.q.modInverse(this.p);break}}}function RSADoPrivate(a){if(null==this.p||null==this.q)return a.modPow(this.d,this.n);var b=a.mod(this.p).modPow(this.dmp1,this.p);for(a=a.mod(this.q).modPow(this.dmq1,this.q);0>b.compareTo(a);)b=b.add(this.p);return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)}
function RSADecrypt(a){a=parseBigInt(a,16);a=this.doPrivate(a);return null==a?null:pkcs1unpad2(a,this.n.bitLength()+7>>3)}function RSADecryptOAEP(a,b){var c=parseBigInt(a,16),c=this.doPrivate(c);return null==c?null:oaep_unpad(c,this.n.bitLength()+7>>3,b)}RSAKey.prototype.doPrivate=RSADoPrivate;RSAKey.prototype.setPrivate=RSASetPrivate;RSAKey.prototype.setPrivateEx=RSASetPrivateEx;RSAKey.prototype.generate=RSAGenerate;RSAKey.prototype.decrypt=RSADecrypt;RSAKey.prototype.decryptOAEP=RSADecryptOAEP;
if("undefined"==typeof KJUR||!KJUR)KJUR={};if("undefined"==typeof KJUR.crypto||!KJUR.crypto)KJUR.crypto={};
KJUR.crypto.Util=new function(){this.DIGESTINFOHEAD={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"};this.getDigestInfoHex=function(a,b){if("undefined"==typeof this.DIGESTINFOHEAD[b])throw"alg not supported in Util.DIGESTINFOHEAD: "+
b;return this.DIGESTINFOHEAD[b]+a};this.getPaddedDigestInfoHex=function(a,b,c){var d=this.getDigestInfoHex(a,b);a=c/4;if(d.length+22>a)throw"key is too short for SigAlg: keylen="+c+","+b;b="00"+d;c="";a=a-4-b.length;for(d=0;d<a;d+=2)c+="ff";return"0001"+c+b};this.sha1=function(a){return(new KJUR.crypto.MessageDigest({alg:"sha1",prov:"cryptojs"})).digestString(a)};this.sha256=function(a){return(new KJUR.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"})).digestString(a)};this.sha512=function(a){return(new KJUR.crypto.MessageDigest({alg:"sha512",
prov:"cryptojs"})).digestString(a)};this.md5=function(a){return(new KJUR.crypto.MessageDigest({alg:"md5",prov:"cryptojs"})).digestString(a)};this.ripemd160=function(a){return(new KJUR.crypto.MessageDigest({alg:"ripemd160",prov:"cryptojs"})).digestString(a)}};
KJUR.crypto.MessageDigest=function(a){var b={md5:"CryptoJS.algo.MD5",sha1:"CryptoJS.algo.SHA1",sha224:"CryptoJS.algo.SHA224",sha256:"CryptoJS.algo.SHA256",sha384:"CryptoJS.algo.SHA384",sha512:"CryptoJS.algo.SHA512",ripemd160:"CryptoJS.algo.RIPEMD160"};this.setAlgAndProvider=function(a,d){if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(a)&&"cryptojs"==d){try{this.md=eval(b[a]).create()}catch(e){throw"setAlgAndProvider hash alg set fail alg="+a+"/"+e;}this.updateString=function(a){this.md.update(a)};
this.updateHex=function(a){a=CryptoJS.enc.Hex.parse(a);this.md.update(a)};this.digest=function(){return this.md.finalize().toString(CryptoJS.enc.Hex)};this.digestString=function(a){this.updateString(a);return this.digest()};this.digestHex=function(a){this.updateHex(a);return this.digest()}}if(-1!=":sha256:".indexOf(a)&&"sjcl"==d){try{this.md=new sjcl.hash.sha256}catch(f){throw"setAlgAndProvider hash alg set fail alg="+a+"/"+f;}this.updateString=function(a){this.md.update(a)};this.updateHex=function(a){a=
sjcl.codec.hex.toBits(a);this.md.update(a)};this.digest=function(){var a=this.md.finalize();return sjcl.codec.hex.fromBits(a)};this.digestString=function(a){this.updateString(a);return this.digest()};this.digestHex=function(a){this.updateHex(a);return this.digest()}}};this.updateString=function(){throw"updateString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName;};this.updateHex=function(){throw"updateHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName;
};this.digest=function(){throw"digest() not supported for this alg/prov: "+this.algName+"/"+this.provName;};this.digestString=function(){throw"digestString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName;};this.digestHex=function(){throw"digestHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName;};"undefined"!=typeof a&&"undefined"!=typeof a.alg&&(this.algName=a.alg,this.provName=a.prov,this.setAlgAndProvider(a.alg,a.prov))};
KJUR.crypto.Signature=function(a){var b=null;this._setAlgNames=function(){this.algName.match(/^(.+)with(.+)$/)&&(this.mdAlgName=RegExp.$1.toLowerCase(),this.pubkeyAlgName=RegExp.$2.toLowerCase())};this._zeroPaddingOfSignature=function(a,b){for(var c="",g=b/4-a.length,h=0;h<g;h++)c+="0";return c+a};this.setAlgAndProvider=function(a,b){this._setAlgNames();if("cryptojs/jsrsa"!=b)throw"provider not supported: "+b;if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)){try{this.md=
new KJUR.crypto.MessageDigest({alg:this.mdAlgName,prov:"cryptojs"})}catch(c){throw"setAlgAndProvider hash alg set fail alg="+this.mdAlgName+"/"+c;}this.initSign=function(a){this.prvKey=a;this.state="SIGN"};this.initVerifyByPublicKey=function(a){this.pubKey=a;this.state="VERIFY"};this.initVerifyByCertificatePEM=function(a){var b=new X509;b.readCertPEM(a);this.pubKey=b.subjectPublicKeyRSA;this.state="VERIFY"};this.updateString=function(a){this.md.updateString(a)};this.updateHex=function(a){this.md.updateHex(a)};
this.sign=function(){var a=KJUR.crypto.Util,b=this.prvKey.n.bitLength();this.sHashHex=this.md.digest();this.hDigestInfo=a.getDigestInfoHex(this.sHashHex,this.mdAlgName);this.hPaddedDigestInfo=a.getPaddedDigestInfoHex(this.sHashHex,this.mdAlgName,b);a=parseBigInt(this.hPaddedDigestInfo,16);this.hoge=a.toString(16);a=this.prvKey.doPrivate(a);return this.hSign=this._zeroPaddingOfSignature(a.toString(16),b)};this.signString=function(a){this.updateString(a);this.sign()};this.signHex=function(a){this.updateHex(a);
this.sign()};this.verify=function(a){this.pubKey.n.bitLength();this.sHashHex=this.md.digest();a=parseBigInt(a,16);a=this.hPaddedDigestInfo=this.pubKey.doPublic(a).toString(16);a=a.replace(/^1ff+00/,"");var b=KJUR.crypto.Util.DIGESTINFOHEAD[this.mdAlgName];return 0!=a.indexOf(b)?!1:a.substr(b.length)==this.sHashHex}}};this.initVerifyByPublicKey=function(){throw"initVerifyByPublicKey(rsaPubKeyy) not supported for this alg:prov="+this.algProvName;};this.initVerifyByCertificatePEM=function(){throw"initVerifyByCertificatePEM(certPEM) not supported for this alg:prov="+
this.algProvName;};this.initSign=function(){throw"initSign(prvKey) not supported for this alg:prov="+this.algProvName;};this.updateString=function(){throw"updateString(str) not supported for this alg:prov="+this.algProvName;};this.updateHex=function(){throw"updateHex(hex) not supported for this alg:prov="+this.algProvName;};this.sign=function(){throw"sign() not supported for this alg:prov="+this.algProvName;};this.signString=function(){throw"digestString(str) not supported for this alg:prov="+this.algProvName;
};this.signHex=function(){throw"digestHex(hex) not supported for this alg:prov="+this.algProvName;};this.verify=function(){throw"verify(hSigVal) not supported for this alg:prov="+this.algProvName;};if("undefined"!=typeof a&&("undefined"!=typeof a.alg&&(this.algName=a.alg,this.provName=a.prov,this.algProvName=a.alg+":"+a.prov,this.setAlgAndProvider(a.alg,a.prov),this._setAlgNames()),"undefined"!=typeof a.prvkeypem)){if("undefined"!=typeof a.prvkeypas)throw"both prvkeypem and prvkeypas parameters not supported";
try{b=new RSAKey,b.readPrivateKeyFromPEMString(a.prvkeypem),this.initSign(b)}catch(c){throw"fatal error to load pem private key: "+c;}}};function _rsapem_pemToBase64(a){a=a.replace("-----BEGIN RSA PRIVATE KEY-----","");a=a.replace("-----END RSA PRIVATE KEY-----","");return a=a.replace(/[ \n]+/g,"")}
function _rsapem_getPosArrayOfChildrenFromHex(a){var b=[],c=ASN1HEX.getStartPosOfV_AtObj(a,0),d=ASN1HEX.getPosOfNextSibling_AtObj(a,c),e=ASN1HEX.getPosOfNextSibling_AtObj(a,d),f=ASN1HEX.getPosOfNextSibling_AtObj(a,e),g=ASN1HEX.getPosOfNextSibling_AtObj(a,f),h=ASN1HEX.getPosOfNextSibling_AtObj(a,g),j=ASN1HEX.getPosOfNextSibling_AtObj(a,h),k=ASN1HEX.getPosOfNextSibling_AtObj(a,j);a=ASN1HEX.getPosOfNextSibling_AtObj(a,k);b.push(c,d,e,f,g,h,j,k,a);return b}
function _rsapem_getHexValueArrayOfChildrenFromHex(a){var b=_rsapem_getPosArrayOfChildrenFromHex(a),c=ASN1HEX.getHexOfV_AtObj(a,b[0]),d=ASN1HEX.getHexOfV_AtObj(a,b[1]),e=ASN1HEX.getHexOfV_AtObj(a,b[2]),f=ASN1HEX.getHexOfV_AtObj(a,b[3]),g=ASN1HEX.getHexOfV_AtObj(a,b[4]),h=ASN1HEX.getHexOfV_AtObj(a,b[5]),j=ASN1HEX.getHexOfV_AtObj(a,b[6]),k=ASN1HEX.getHexOfV_AtObj(a,b[7]);a=ASN1HEX.getHexOfV_AtObj(a,b[8]);b=[];b.push(c,d,e,f,g,h,j,k,a);return b}
function _rsapem_readPrivateKeyFromASN1HexString(a){a=_rsapem_getHexValueArrayOfChildrenFromHex(a);this.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8])}function _rsapem_readPrivateKeyFromPEMString(a){a=_rsapem_pemToBase64(a);a=b64tohex(a);a=_rsapem_getHexValueArrayOfChildrenFromHex(a);this.setPrivateEx(a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8])}RSAKey.prototype.readPrivateKeyFromPEMString=_rsapem_readPrivateKeyFromPEMString;RSAKey.prototype.readPrivateKeyFromASN1HexString=_rsapem_readPrivateKeyFromASN1HexString;
var _RSASIGN_DIHEAD=[];_RSASIGN_DIHEAD.sha1="3021300906052b0e03021a05000414";_RSASIGN_DIHEAD.sha256="3031300d060960864801650304020105000420";_RSASIGN_DIHEAD.sha384="3041300d060960864801650304020205000430";_RSASIGN_DIHEAD.sha512="3051300d060960864801650304020305000440";_RSASIGN_DIHEAD.md2="3020300c06082a864886f70d020205000410";_RSASIGN_DIHEAD.md5="3020300c06082a864886f70d020505000410";_RSASIGN_DIHEAD.ripemd160="3021300906052b2403020105000414";var _RSASIGN_HASHHEXFUNC=[];_RSASIGN_HASHHEXFUNC.sha1=function(a){return KJUR.crypto.Util.sha1(a)};
_RSASIGN_HASHHEXFUNC.sha256=function(a){return KJUR.crypto.Util.sha256(a)};_RSASIGN_HASHHEXFUNC.sha512=function(a){return KJUR.crypto.Util.sha512(a)};_RSASIGN_HASHHEXFUNC.md5=function(a){return KJUR.crypto.Util.md5(a)};_RSASIGN_HASHHEXFUNC.ripemd160=function(a){return KJUR.crypto.Util.ripemd160(a)};var _RE_HEXDECONLY=RegExp("");_RE_HEXDECONLY.compile("[^0-9a-f]","gi");
function _rsasign_getHexPaddedDigestInfoForString(a,b,c){b/=4;a=(0,_RSASIGN_HASHHEXFUNC[c])(a);c="00"+_RSASIGN_DIHEAD[c]+a;a="";b=b-4-c.length;for(var d=0;d<b;d+=2)a+="ff";return sPaddedMessageHex="0001"+a+c}function _zeroPaddingOfSignature(a,b){for(var c="",d=b/4-a.length,e=0;e<d;e++)c+="0";return c+a}
function _rsasign_signString(a,b){var c=_rsasign_getHexPaddedDigestInfoForString(a,this.n.bitLength(),b),c=parseBigInt(c,16),c=this.doPrivate(c).toString(16);return _zeroPaddingOfSignature(c,this.n.bitLength())}function _rsasign_signStringWithSHA1(a){return _rsasign_signString.call(this,a,"sha1")}function _rsasign_signStringWithSHA256(a){return _rsasign_signString.call(this,a,"sha256")}
function pss_mgf1_str(a,b,c){for(var d="",e=0;d.length<b;)d+=c(a+String.fromCharCode.apply(String,[(e&4278190080)>>24,(e&16711680)>>16,(e&65280)>>8,e&255])),e+=1;return d}
function _rsasign_signStringPSS(a,b,c){var d=_RSASIGN_HASHRAWFUNC[b],e=d(a);a=e.length;b=this.n.bitLength()-1;var f=Math.ceil(b/8);if(-1===c)c=a;else if(-2===c||void 0===c)c=f-a-2;else if(-2>c)throw"invalid salt length";if(f<a+c+2)throw"data too long";var g="";0<c&&(g=Array(c),(new SecureRandom).nextBytes(g),g=String.fromCharCode.apply(String,g));for(var h=d("\x00\x00\x00\x00\x00\x00\x00\x00"+e+g),j=[],e=0;e<f-c-a-2;e+=1)j[e]=0;c=String.fromCharCode.apply(String,j)+"\u0001"+g;d=pss_mgf1_str(h,c.length,
d);g=[];for(e=0;e<c.length;e+=1)g[e]=c.charCodeAt(e)^d.charCodeAt(e);g[0]&=~(65280>>8*f-b&255);for(e=0;e<a;e++)g.push(h.charCodeAt(e));g.push(188);return _zeroPaddingOfSignature(this.doPrivate(new BigInteger(g)).toString(16),this.n.bitLength())}function _rsasign_getDecryptSignatureBI(a,b,c){var d=new RSAKey;d.setPublic(b,c);return d.doPublic(a)}function _rsasign_getHexDigestInfoFromSig(a,b,c){return _rsasign_getDecryptSignatureBI(a,b,c).toString(16).replace(/^1f+00/,"")}
function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a){for(var b in _RSASIGN_DIHEAD){var c=_RSASIGN_DIHEAD[b],d=c.length;if(a.substring(0,d)==c)return[b,a.substring(d)]}return[]}function _rsasign_verifySignatureWithArgs(a,b,c,d){b=_rsasign_getHexDigestInfoFromSig(b,c,d);c=_rsasign_getAlgNameAndHashFromHexDisgestInfo(b);if(0==c.length)return!1;b=c[1];a=(0,_RSASIGN_HASHHEXFUNC[c[0]])(a);return b==a}
function _rsasign_verifyHexSignatureForMessage(a,b){var c=parseBigInt(a,16);return _rsasign_verifySignatureWithArgs(b,c,this.n.toString(16),this.e.toString(16))}
function _rsasign_verifyString(a,b){b=b.replace(_RE_HEXDECONLY,"");if(b.length!=this.n.bitLength()/4)return 0;b=b.replace(/[ \n]+/g,"");var c=parseBigInt(b,16),c=this.doPublic(c).toString(16).replace(/^1f+00/,""),d=_rsasign_getAlgNameAndHashFromHexDisgestInfo(c);if(0==d.length)return!1;c=d[1];d=(0,_RSASIGN_HASHHEXFUNC[d[0]])(a);return c==d}
function _rsasign_verifyStringPSS(a,b,c,d){if(b.length!==this.n.bitLength()/4)return!1;c=_RSASIGN_HASHRAWFUNC[c];a=c(a);var e=a.length,f=this.n.bitLength()-1,g=Math.ceil(f/8);if(-1===d)d=e;else if(-2===d||void 0===d)d=g-e-2;else if(-2>d)throw"invalid salt length";if(g<e+d+2)throw"data too long";var h=this.doPublic(parseBigInt(b,16)).toByteArray();for(b=0;b<h.length;b+=1)h[b]&=255;for(;h.length<g;)h.unshift(0);if(188!==h[g-1])throw"encoded message does not end in 0xbc";var h=String.fromCharCode.apply(String,
h),j=h.substr(0,g-e-1),h=h.substr(j.length,e),k=65280>>8*g-f&255;if(0!==(j.charCodeAt(0)&k))throw"bits beyond keysize not zero";var m=pss_mgf1_str(h,j.length,c),f=[];for(b=0;b<j.length;b+=1)f[b]=j.charCodeAt(b)^m.charCodeAt(b);f[0]&=~k;e=g-e-d-2;for(b=0;b<e;b+=1)if(0!==f[b])throw"leftmost octets not zero";if(1!==f[e])throw"0x01 marker not found";return h===c("\x00\x00\x00\x00\x00\x00\x00\x00"+a+String.fromCharCode.apply(String,f.slice(-d)))}RSAKey.prototype.signString=_rsasign_signString;
RSAKey.prototype.signStringWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signStringWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.sign=_rsasign_signString;RSAKey.prototype.signWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.signStringPSS=_rsasign_signStringPSS;RSAKey.prototype.signPSS=_rsasign_signStringPSS;RSAKey.SALT_LEN_HLEN=-1;RSAKey.SALT_LEN_MAX=-2;RSAKey.prototype.verifyString=_rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage=_rsasign_verifyHexSignatureForMessage;RSAKey.prototype.verify=_rsasign_verifyString;RSAKey.prototype.verifyHexSignatureForByteArrayMessage=_rsasign_verifyHexSignatureForMessage;RSAKey.prototype.verifyStringPSS=_rsasign_verifyStringPSS;RSAKey.prototype.verifyPSS=_rsasign_verifyStringPSS;RSAKey.SALT_LEN_RECOVER=-2;
function _asnhex_getByteLengthOfL_AtObj(a,b){if("8"!=a.substring(b+2,b+3))return 1;var c=parseInt(a.substring(b+3,b+4));return 0==c?-1:0<c&&10>c?c+1:-2}function _asnhex_getHexOfL_AtObj(a,b){var c=_asnhex_getByteLengthOfL_AtObj(a,b);return 1>c?"":a.substring(b+2,b+2+2*c)}function _asnhex_getIntOfL_AtObj(a,b){var c=_asnhex_getHexOfL_AtObj(a,b);return""==c?-1:(8>parseInt(c.substring(0,1))?parseBigInt(c,16):parseBigInt(c.substring(2),16)).intValue()}
function _asnhex_getStartPosOfV_AtObj(a,b){var c=_asnhex_getByteLengthOfL_AtObj(a,b);return 0>c?c:b+2*(c+1)}function _asnhex_getHexOfV_AtObj(a,b){var c=_asnhex_getStartPosOfV_AtObj(a,b),d=_asnhex_getIntOfL_AtObj(a,b);return a.substring(c,c+2*d)}function _asnhex_getHexOfTLV_AtObj(a,b){var c=a.substr(b,2),d=_asnhex_getHexOfL_AtObj(a,b),e=_asnhex_getHexOfV_AtObj(a,b);return c+d+e}
function _asnhex_getPosOfNextSibling_AtObj(a,b){var c=_asnhex_getStartPosOfV_AtObj(a,b),d=_asnhex_getIntOfL_AtObj(a,b);return c+2*d}function _asnhex_getPosArrayOfChildren_AtObj(a,b){var c=[],d=_asnhex_getStartPosOfV_AtObj(a,b);c.push(d);for(var e=_asnhex_getIntOfL_AtObj(a,b),f=d,g=0;;){f=_asnhex_getPosOfNextSibling_AtObj(a,f);if(null==f||f-d>=2*e)break;if(200<=g)break;c.push(f);g++}return c}function _asnhex_getNthChildIndex_AtObj(a,b,c){return _asnhex_getPosArrayOfChildren_AtObj(a,b)[c]}
function _asnhex_getDecendantIndexByNthList(a,b,c){if(0==c.length)return b;var d=c.shift();b=_asnhex_getPosArrayOfChildren_AtObj(a,b);return _asnhex_getDecendantIndexByNthList(a,b[d],c)}function _asnhex_getDecendantHexTLVByNthList(a,b,c){b=_asnhex_getDecendantIndexByNthList(a,b,c);return _asnhex_getHexOfTLV_AtObj(a,b)}function _asnhex_getDecendantHexVByNthList(a,b,c){b=_asnhex_getDecendantIndexByNthList(a,b,c);return _asnhex_getHexOfV_AtObj(a,b)}function ASN1HEX(){return ASN1HEX}
ASN1HEX.getByteLengthOfL_AtObj=_asnhex_getByteLengthOfL_AtObj;ASN1HEX.getHexOfL_AtObj=_asnhex_getHexOfL_AtObj;ASN1HEX.getIntOfL_AtObj=_asnhex_getIntOfL_AtObj;ASN1HEX.getStartPosOfV_AtObj=_asnhex_getStartPosOfV_AtObj;ASN1HEX.getHexOfV_AtObj=_asnhex_getHexOfV_AtObj;ASN1HEX.getHexOfTLV_AtObj=_asnhex_getHexOfTLV_AtObj;ASN1HEX.getPosOfNextSibling_AtObj=_asnhex_getPosOfNextSibling_AtObj;ASN1HEX.getPosArrayOfChildren_AtObj=_asnhex_getPosArrayOfChildren_AtObj;ASN1HEX.getNthChildIndex_AtObj=_asnhex_getNthChildIndex_AtObj;
ASN1HEX.getDecendantIndexByNthList=_asnhex_getDecendantIndexByNthList;ASN1HEX.getDecendantHexVByNthList=_asnhex_getDecendantHexVByNthList;ASN1HEX.getDecendantHexTLVByNthList=_asnhex_getDecendantHexTLVByNthList;function _x509_pemToBase64(a){a=a.replace("-----BEGIN CERTIFICATE-----","");a=a.replace("-----END CERTIFICATE-----","");return a=a.replace(/[ \n]+/g,"")}function _x509_pemToHex(a){a=_x509_pemToBase64(a);return b64tohex(a)}
function _x509_getHexTbsCertificateFromCert(a){return ASN1HEX.getStartPosOfV_AtObj(a,0)}function _x509_getSubjectPublicKeyInfoPosFromCertHex(a){var b=ASN1HEX.getStartPosOfV_AtObj(a,0),b=ASN1HEX.getPosArrayOfChildren_AtObj(a,b);return 1>b.length?-1:"a003020102"==a.substring(b[0],b[0]+10)?6>b.length?-1:b[6]:5>b.length?-1:b[5]}
function _x509_getSubjectPublicKeyPosFromCertHex(a){var b=_x509_getSubjectPublicKeyInfoPosFromCertHex(a);if(-1==b)return-1;b=ASN1HEX.getPosArrayOfChildren_AtObj(a,b);if(2!=b.length)return-1;b=b[1];if("03"!=a.substring(b,b+2))return-1;b=ASN1HEX.getStartPosOfV_AtObj(a,b);return"00"!=a.substring(b,b+2)?-1:b+2}
function _x509_getPublicKeyHexArrayFromCertHex(a){var b=_x509_getSubjectPublicKeyPosFromCertHex(a),c=ASN1HEX.getPosArrayOfChildren_AtObj(a,b);if(2!=c.length)return[];b=ASN1HEX.getHexOfV_AtObj(a,c[0]);a=ASN1HEX.getHexOfV_AtObj(a,c[1]);return null!=b&&null!=a?[b,a]:[]}function _x509_getPublicKeyHexArrayFromCertPEM(a){a=_x509_pemToHex(a);return _x509_getPublicKeyHexArrayFromCertHex(a)}function _x509_getSerialNumberHex(){return ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,1])}
function _x509_getIssuerHex(){return ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,3])}function _x509_getIssuerString(){return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,3]))}function _x509_getSubjectHex(){return ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,5])}function _x509_getSubjectString(){return _x509_hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,5]))}
function _x509_getNotBefore(){var a=ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,4,0]),a=a.replace(/(..)/g,"%$1");return a=decodeURIComponent(a)}function _x509_getNotAfter(){var a=ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,4,1]),a=a.replace(/(..)/g,"%$1");return a=decodeURIComponent(a)}_x509_DN_ATTRHEX={"0603550406":"C","060355040a":"O","060355040b":"OU","0603550403":"CN","0603550405":"SN","0603550408":"ST","0603550407":"L"};
function _x509_hex2dn(a){for(var b="",c=ASN1HEX.getPosArrayOfChildren_AtObj(a,0),d=0;d<c.length;d++)var e=ASN1HEX.getHexOfTLV_AtObj(a,c[d]),b=b+"/"+_x509_hex2rdn(e);return b}function _x509_hex2rdn(a){var b=ASN1HEX.getDecendantHexTLVByNthList(a,0,[0,0]),c=ASN1HEX.getDecendantHexVByNthList(a,0,[0,1]);a="";try{a=_x509_DN_ATTRHEX[b]}catch(d){a=b}c=c.replace(/(..)/g,"%$1");b=decodeURIComponent(c);return a+"="+b}
function _x509_readCertPEM(a){a=_x509_pemToHex(a);var b=_x509_getPublicKeyHexArrayFromCertHex(a),c=new RSAKey;c.setPublic(b[0],b[1]);this.subjectPublicKeyRSA=c;this.subjectPublicKeyRSA_hN=b[0];this.subjectPublicKeyRSA_hE=b[1];this.hex=a}function _x509_readCertPEMWithoutRSAInit(a){a=_x509_pemToHex(a);var b=_x509_getPublicKeyHexArrayFromCertHex(a);this.subjectPublicKeyRSA.setPublic(b[0],b[1]);this.subjectPublicKeyRSA_hN=b[0];this.subjectPublicKeyRSA_hE=b[1];this.hex=a}
function X509(){this.hex=this.subjectPublicKeyRSA_hE=this.subjectPublicKeyRSA_hN=this.subjectPublicKeyRSA=null}X509.prototype.readCertPEM=_x509_readCertPEM;X509.prototype.readCertPEMWithoutRSAInit=_x509_readCertPEMWithoutRSAInit;X509.prototype.getSerialNumberHex=_x509_getSerialNumberHex;X509.prototype.getIssuerHex=_x509_getIssuerHex;X509.prototype.getSubjectHex=_x509_getSubjectHex;X509.prototype.getIssuerString=_x509_getIssuerString;X509.prototype.getSubjectString=_x509_getSubjectString;
X509.prototype.getNotBefore=_x509_getNotBefore;X509.prototype.getNotAfter=_x509_getNotAfter;var dbits,canary=0xdeadbeefcafe,j_lm=15715070==(canary&16777215);function BigInteger(a,b,c){null!=a&&("number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function nbi(){return new BigInteger(null)}function am1(a,b,c,d,e,f){for(;0<=--f;){var g=b*this[a++]+c[d]+e;e=Math.floor(g/67108864);c[d++]=g&67108863}return e}
function am2(a,b,c,d,e,f){var g=b&32767;for(b>>=15;0<=--f;){var h=this[a]&32767,j=this[a++]>>15,k=b*h+j*g,h=g*h+((k&32767)<<15)+c[d]+(e&1073741823);e=(h>>>30)+(k>>>15)+b*j+(e>>>30);c[d++]=h&1073741823}return e}function am3(a,b,c,d,e,f){var g=b&16383;for(b>>=14;0<=--f;){var h=this[a]&16383,j=this[a++]>>14,k=b*h+j*g,h=g*h+((k&16383)<<14)+c[d]+e;e=(h>>28)+(k>>14)+b*j;c[d++]=h&268435455}return e}
j_lm&&"Microsoft Internet Explorer"==navigator.appName?(BigInteger.prototype.am=am2,dbits=30):j_lm&&"Netscape"!=navigator.appName?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28);BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=[],rr,vv;
rr=48;for(vv=0;9>=vv;++vv)BI_RC[rr++]=vv;rr=97;for(vv=10;36>vv;++vv)BI_RC[rr++]=vv;rr=65;for(vv=10;36>vv;++vv)BI_RC[rr++]=vv;function int2char(a){return BI_RM.charAt(a)}function intAt(a,b){var c=BI_RC[a.charCodeAt(b)];return null==c?-1:c}function bnpCopyTo(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s}function bnpFromInt(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+DV:this.t=0}function nbv(a){var b=nbi();b.fromInt(a);return b}
function bnpFromString(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var d=a.length,e=!1,f=0;0<=--d;){var g=8==c?a[d]&255:intAt(a,d);0>g?"-"==a.charAt(d)&&(e=!0):(e=!1,0==f?this[this.t++]=g:f+c>this.DB?(this[this.t-1]|=(g&(1<<this.DB-f)-1)<<f,this[this.t++]=g>>this.DB-f):this[this.t-1]|=g<<f,f+=c,f>=this.DB&&(f-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,0<f&&(this[this.t-1]|=(1<<this.DB-
f)-1<<f));this.clamp();e&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t}
function bnToString(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,d=!1,e="",f=this.t,g=this.DB-f*this.DB%a;if(0<f--){if(g<this.DB&&0<(c=this[f]>>g))d=!0,e=int2char(c);for(;0<=f;)g<a?(c=(this[f]&(1<<g)-1)<<a-g,c|=this[--f]>>(g+=this.DB-a)):(c=this[f]>>(g-=a)&b,0>=g&&(g+=this.DB,--f)),0<c&&(d=!0),d&&(e+=int2char(c))}return d?e:"0"}
function bnNegate(){var a=nbi();BigInteger.ZERO.subTo(this,a);return a}function bnAbs(){return 0>this.s?this.negate():this}function bnCompareTo(a){var b=this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0}function nbits(a){var b=1,c;if(0!=(c=a>>>16))a=c,b+=16;if(0!=(c=a>>8))a=c,b+=8;if(0!=(c=a>>4))a=c,b+=4;if(0!=(c=a>>2))a=c,b+=2;0!=a>>1&&(b+=1);return b}
function bnBitLength(){return 0>=this.t?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=this.s}function bnpDRShiftTo(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s}
function bnpLShiftTo(a,b){var c=a%this.DB,d=this.DB-c,e=(1<<d)-1,f=Math.floor(a/this.DB),g=this.s<<c&this.DM,h;for(h=this.t-1;0<=h;--h)b[h+f+1]=this[h]>>d|g,g=(this[h]&e)<<c;for(h=f-1;0<=h;--h)b[h]=0;b[f]=g;b.t=this.t+f+1;b.s=this.s;b.clamp()}
function bnpRShiftTo(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var d=a%this.DB,e=this.DB-d,f=(1<<d)-1;b[0]=this[c]>>d;for(var g=c+1;g<this.t;++g)b[g-c-1]|=(this[g]&f)<<e,b[g-c]=this[g]>>d;0<d&&(b[this.t-c-1]|=(this.s&f)<<e);b.t=this.t-c;b.clamp()}}
function bnpSubTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]-a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d-=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d-=a[c],b[c++]=d&this.DM,d>>=this.DB;d-=a.s}b.s=0>d?-1:0;-1>d?b[c++]=this.DV+d:0<d&&(b[c++]=d);b.t=c;b.clamp()}
function bnpMultiplyTo(a,b){var c=this.abs(),d=a.abs(),e=c.t;for(b.t=e+d.t;0<=--e;)b[e]=0;for(e=0;e<d.t;++e)b[e+c.t]=c.am(0,d[e],b,e,0,c.t);b.s=0;b.clamp();this.s!=a.s&&BigInteger.ZERO.subTo(b,b)}function bnpSquareTo(a){for(var b=this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var d=b.am(c,b[c],a,2*c,0,1);if((a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,d,b.t-c-1))>=b.DV)a[c+b.t]-=b.DV,a[c+b.t+1]=1}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()}
function bnpDivRemTo(a,b,c){var d=a.abs();if(!(0>=d.t)){var e=this.abs();if(e.t<d.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=nbi());var f=nbi(),g=this.s;a=a.s;var h=this.DB-nbits(d[d.t-1]);0<h?(d.lShiftTo(h,f),e.lShiftTo(h,c)):(d.copyTo(f),e.copyTo(c));d=f.t;e=f[d-1];if(0!=e){var j=e*(1<<this.F1)+(1<d?f[d-2]>>this.F2:0),k=this.FV/j,j=(1<<this.F1)/j,m=1<<this.F2,n=c.t,p=n-d,l=null==b?nbi():b;f.dlShiftTo(p,l);0<=c.compareTo(l)&&(c[c.t++]=1,c.subTo(l,c));BigInteger.ONE.dlShiftTo(d,
l);for(l.subTo(f,f);f.t<d;)f[f.t++]=0;for(;0<=--p;){var s=c[--n]==e?this.DM:Math.floor(c[n]*k+(c[n-1]+m)*j);if((c[n]+=f.am(0,s,c,p,0,d))<s){f.dlShiftTo(p,l);for(c.subTo(l,c);c[n]<--s;)c.subTo(l,c)}}null!=b&&(c.drShiftTo(d,b),g!=a&&BigInteger.ZERO.subTo(b,b));c.t=d;c.clamp();0<h&&c.rShiftTo(h,c);0>g&&BigInteger.ZERO.subTo(c,c)}}}}function bnMod(a){var b=nbi();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(BigInteger.ZERO)&&a.subTo(b,b);return b}function Classic(a){this.m=a}
function cConvert(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a}function cRevert(a){return a}function cReduce(a){a.divRemTo(this.m,null,a)}function cMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}function cSqrTo(a,b){a.squareTo(b);this.reduce(b)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;
function bnpInvDigit(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b}function Montgomery(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}
function montConvert(a){var b=nbi();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(BigInteger.ZERO)&&this.m.subTo(b,b);return b}function montRevert(a){var b=nbi();a.copyTo(b);this.reduce(b);return b}
function montReduce(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,d=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,d,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)}function montSqrTo(a,b){a.squareTo(b);this.reduce(b)}function montMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Montgomery.prototype.convert=montConvert;
Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return 0==(0<this.t?this[0]&1:this.s)}function bnpExp(a,b){if(4294967295<a||1>a)return BigInteger.ONE;var c=nbi(),d=nbi(),e=b.convert(this),f=nbits(a)-1;for(e.copyTo(c);0<=--f;)if(b.sqrTo(c,d),0<(a&1<<f))b.mulTo(d,e,c);else var g=c,c=d,d=g;return b.revert(c)}
function bnModPowInt(a,b){var c;c=256>a||b.isEven()?new Classic(b):new Montgomery(b);return this.exp(a,c)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;
BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;
BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnClone(){var a=nbi();this.copyTo(a);return a}function bnIntValue(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return 0==this.t?this.s:this[0]<<24>>24}function bnShortValue(){return 0==this.t?this.s:this[0]<<16>>16}function bnpChunkSize(a){return Math.floor(Math.LN2*this.DB/Math.log(a))}
function bnSigNum(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?0:1}function bnpToRadix(a){null==a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=nbv(b),d=nbi(),e=nbi(),f="";for(this.divRemTo(c,d,e);0<d.signum();)f=(b+e.intValue()).toString(a).substr(1)+f,d.divRemTo(c,d,e);return e.intValue().toString(a)+f}
function bnpFromRadix(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),d=Math.pow(b,c),e=!1,f=0,g=0,h=0;h<a.length;++h){var j=intAt(a,h);0>j?"-"==a.charAt(h)&&0==this.signum()&&(e=!0):(g=b*g+j,++f>=c&&(this.dMultiply(d),this.dAddOffset(g,0),g=f=0))}0<f&&(this.dMultiply(Math.pow(b,f)),this.dAddOffset(g,0));e&&BigInteger.ZERO.subTo(this,this)}
function bnpFromNumber(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else{this.fromNumber(a,c);this.testBit(a-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);for(this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(BigInteger.ONE.shiftLeft(a-1),this)}else{c=[];var d=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<d?c[0]&(1<<d)-1:0;this.fromString(c,256)}}
function bnToByteArray(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,d,e=0;if(0<a--){if(c<this.DB&&(d=this[a]>>c)!=(this.s&this.DM)>>c)b[e++]=d|this.s<<this.DB-c;for(;0<=a;)if(8>c?(d=(this[a]&(1<<c)-1)<<8-c,d|=this[--a]>>(c+=this.DB-8)):(d=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(d&128)&&(d|=-256),0==e&&(this.s&128)!=(d&128)&&++e,0<e||d!=this.s)b[e++]=d}return b}function bnEquals(a){return 0==this.compareTo(a)}function bnMin(a){return 0>this.compareTo(a)?this:a}
function bnMax(a){return 0<this.compareTo(a)?this:a}function bnpBitwiseTo(a,b,c){var d,e,f=Math.min(a.t,this.t);for(d=0;d<f;++d)c[d]=b(this[d],a[d]);if(a.t<this.t){e=a.s&this.DM;for(d=f;d<this.t;++d)c[d]=b(this[d],e);c.t=this.t}else{e=this.s&this.DM;for(d=f;d<a.t;++d)c[d]=b(e,a[d]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()}function op_and(a,b){return a&b}function bnAnd(a){var b=nbi();this.bitwiseTo(a,op_and,b);return b}function op_or(a,b){return a|b}
function bnOr(a){var b=nbi();this.bitwiseTo(a,op_or,b);return b}function op_xor(a,b){return a^b}function bnXor(a){var b=nbi();this.bitwiseTo(a,op_xor,b);return b}function op_andnot(a,b){return a&~b}function bnAndNot(a){var b=nbi();this.bitwiseTo(a,op_andnot,b);return b}function bnNot(){for(var a=nbi(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a}function bnShiftLeft(a){var b=nbi();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b}
function bnShiftRight(a){var b=nbi();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b}function lbit(a){if(0==a)return-1;var b=0;0==(a&65535)&&(a>>=16,b+=16);0==(a&255)&&(a>>=8,b+=8);0==(a&15)&&(a>>=4,b+=4);0==(a&3)&&(a>>=2,b+=2);0==(a&1)&&++b;return b}function bnGetLowestSetBit(){for(var a=0;a<this.t;++a)if(0!=this[a])return a*this.DB+lbit(this[a]);return 0>this.s?this.t*this.DB:-1}function cbit(a){for(var b=0;0!=a;)a&=a-1,++b;return b}
function bnBitCount(){for(var a=0,b=this.s&this.DM,c=0;c<this.t;++c)a+=cbit(this[c]^b);return a}function bnTestBit(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&1<<a%this.DB)}function bnpChangeBit(a,b){var c=BigInteger.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c}function bnSetBit(a){return this.changeBit(a,op_or)}function bnClearBit(a){return this.changeBit(a,op_andnot)}function bnFlipBit(a){return this.changeBit(a,op_xor)}
function bnpAddTo(a,b){for(var c=0,d=0,e=Math.min(a.t,this.t);c<e;)d+=this[c]+a[c],b[c++]=d&this.DM,d>>=this.DB;if(a.t<this.t){for(d+=a.s;c<this.t;)d+=this[c],b[c++]=d&this.DM,d>>=this.DB;d+=this.s}else{for(d+=this.s;c<a.t;)d+=a[c],b[c++]=d&this.DM,d>>=this.DB;d+=a.s}b.s=0>d?-1:0;0<d?b[c++]=d:-1>d&&(b[c++]=this.DV+d);b.t=c;b.clamp()}function bnAdd(a){var b=nbi();this.addTo(a,b);return b}function bnSubtract(a){var b=nbi();this.subTo(a,b);return b}
function bnMultiply(a){var b=nbi();this.multiplyTo(a,b);return b}function bnSquare(){var a=nbi();this.squareTo(a);return a}function bnDivide(a){var b=nbi();this.divRemTo(a,b,null);return b}function bnRemainder(a){var b=nbi();this.divRemTo(a,null,b);return b}function bnDivideAndRemainder(a){var b=nbi(),c=nbi();this.divRemTo(a,b,c);return[b,c]}function bnpDMultiply(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()}
function bnpDAddOffset(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}}function NullExp(){}function nNop(a){return a}function nMulTo(a,b,c){a.multiplyTo(b,c)}function nSqrTo(a,b){a.squareTo(b)}NullExp.prototype.convert=nNop;NullExp.prototype.revert=nNop;NullExp.prototype.mulTo=nMulTo;NullExp.prototype.sqrTo=nSqrTo;function bnPow(a){return this.exp(a,new NullExp)}
function bnpMultiplyLowerTo(a,b,c){var d=Math.min(this.t+a.t,b);c.s=0;for(c.t=d;0<d;)c[--d]=0;var e;for(e=c.t-this.t;d<e;++d)c[d+this.t]=this.am(0,a[d],c,d,0,this.t);for(e=Math.min(a.t,b);d<e;++d)this.am(0,a[d],c,d,0,b-d);c.clamp()}function bnpMultiplyUpperTo(a,b,c){--b;var d=c.t=this.t+a.t-b;for(c.s=0;0<=--d;)c[d]=0;for(d=Math.max(b-this.t,0);d<a.t;++d)c[this.t+d-b]=this.am(b-d,a[d],c,0,0,this.t+d-b);c.clamp();c.drShiftTo(1,c)}
function Barrett(a){this.r2=nbi();this.q3=nbi();BigInteger.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}function barrettConvert(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=nbi();a.copyTo(b);this.reduce(b);return b}function barrettRevert(a){return a}
function barrettReduce(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)}function barrettSqrTo(a,b){a.squareTo(b);this.reduce(b)}function barrettMulTo(a,b,c){a.multiplyTo(b,c);this.reduce(c)}Barrett.prototype.convert=barrettConvert;
Barrett.prototype.revert=barrettRevert;Barrett.prototype.reduce=barrettReduce;Barrett.prototype.mulTo=barrettMulTo;Barrett.prototype.sqrTo=barrettSqrTo;
function bnModPow(a,b){var c=a.bitLength(),d,e=nbv(1),f;if(0>=c)return e;d=18>c?1:48>c?3:144>c?4:768>c?5:6;f=8>c?new Classic(b):b.isEven()?new Barrett(b):new Montgomery(b);var g=[],h=3,j=d-1,k=(1<<d)-1;g[1]=f.convert(this);if(1<d){c=nbi();for(f.sqrTo(g[1],c);h<=k;)g[h]=nbi(),f.mulTo(c,g[h-2],g[h]),h+=2}for(var m=a.t-1,n,p=!0,l=nbi(),c=nbits(a[m])-1;0<=m;){c>=j?n=a[m]>>c-j&k:(n=(a[m]&(1<<c+1)-1)<<j-c,0<m&&(n|=a[m-1]>>this.DB+c-j));for(h=d;0==(n&1);)n>>=1,--h;if(0>(c-=h))c+=this.DB,--m;if(p)g[n].copyTo(e),
p=!1;else{for(;1<h;)f.sqrTo(e,l),f.sqrTo(l,e),h-=2;0<h?f.sqrTo(e,l):(h=e,e=l,l=h);f.mulTo(l,g[n],e)}for(;0<=m&&0==(a[m]&1<<c);)f.sqrTo(e,l),h=e,e=l,l=h,0>--c&&(c=this.DB-1,--m)}return f.revert(e)}
function bnGCD(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=b,b=a;a=c}var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(0>d)return b;c<d&&(d=c);0<d&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));0<d&&a.lShiftTo(d,a);return a}
function bnpModInt(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var d=this.t-1;0<=d;--d)c=(b*c+this[d])%a;return c}
function bnModInverse(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return BigInteger.ZERO;for(var c=a.clone(),d=this.clone(),e=nbv(1),f=nbv(0),g=nbv(0),h=nbv(1);0!=c.signum();){for(;c.isEven();){c.rShiftTo(1,c);if(b){if(!e.isEven()||!f.isEven())e.addTo(this,e),f.subTo(a,f);e.rShiftTo(1,e)}else f.isEven()||f.subTo(a,f);f.rShiftTo(1,f)}for(;d.isEven();){d.rShiftTo(1,d);if(b){if(!g.isEven()||!h.isEven())g.addTo(this,g),h.subTo(a,h);g.rShiftTo(1,g)}else h.isEven()||h.subTo(a,h);h.rShiftTo(1,
h)}0<=c.compareTo(d)?(c.subTo(d,c),b&&e.subTo(g,e),f.subTo(h,f)):(d.subTo(c,d),b&&g.subTo(e,g),h.subTo(f,h))}if(0!=d.compareTo(BigInteger.ONE))return BigInteger.ZERO;if(0<=h.compareTo(a))return h.subtract(a);if(0>h.signum())h.addTo(a,h);else return h;return 0>h.signum()?h.add(a):h}
var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,
733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],lplim=67108864/lowprimes[lowprimes.length-1];
function bnIsProbablePrime(a){var b,c=this.abs();if(1==c.t&&c[0]<=lowprimes[lowprimes.length-1]){for(b=0;b<lowprimes.length;++b)if(c[0]==lowprimes[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<lowprimes.length;){for(var d=lowprimes[b],e=b+1;e<lowprimes.length&&d<lplim;)d*=lowprimes[e++];for(d=c.modInt(d);b<e;)if(0==d%lowprimes[b++])return!1}return c.millerRabin(a)}
function bnpMillerRabin(a){var b=this.subtract(BigInteger.ONE),c=b.getLowestSetBit();if(0>=c)return!1;var d=b.shiftRight(c);a=a+1>>1;a>lowprimes.length&&(a=lowprimes.length);for(var e=nbi(),f=0;f<a;++f){e.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var g=e.modPow(d,this);if(0!=g.compareTo(BigInteger.ONE)&&0!=g.compareTo(b)){for(var h=1;h++<c&&0!=g.compareTo(b);)if(g=g.modPowInt(2,this),0==g.compareTo(BigInteger.ONE))return!1;if(0!=g.compareTo(b))return!1}}return!0}
BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.fromNumber=bnpFromNumber;BigInteger.prototype.bitwiseTo=bnpBitwiseTo;BigInteger.prototype.changeBit=bnpChangeBit;BigInteger.prototype.addTo=bnpAddTo;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;
BigInteger.prototype.modInt=bnpModInt;BigInteger.prototype.millerRabin=bnpMillerRabin;BigInteger.prototype.clone=bnClone;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.byteValue=bnByteValue;BigInteger.prototype.shortValue=bnShortValue;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.toByteArray=bnToByteArray;BigInteger.prototype.equals=bnEquals;BigInteger.prototype.min=bnMin;BigInteger.prototype.max=bnMax;BigInteger.prototype.and=bnAnd;BigInteger.prototype.or=bnOr;
BigInteger.prototype.xor=bnXor;BigInteger.prototype.andNot=bnAndNot;BigInteger.prototype.not=bnNot;BigInteger.prototype.shiftLeft=bnShiftLeft;BigInteger.prototype.shiftRight=bnShiftRight;BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;BigInteger.prototype.bitCount=bnBitCount;BigInteger.prototype.testBit=bnTestBit;BigInteger.prototype.setBit=bnSetBit;BigInteger.prototype.clearBit=bnClearBit;BigInteger.prototype.flipBit=bnFlipBit;BigInteger.prototype.add=bnAdd;BigInteger.prototype.subtract=bnSubtract;
BigInteger.prototype.multiply=bnMultiply;BigInteger.prototype.divide=bnDivide;BigInteger.prototype.remainder=bnRemainder;BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;BigInteger.prototype.modPow=bnModPow;BigInteger.prototype.modInverse=bnModInverse;BigInteger.prototype.pow=bnPow;BigInteger.prototype.gcd=bnGCD;BigInteger.prototype.isProbablePrime=bnIsProbablePrime;BigInteger.prototype.square=bnSquare;
/** 
 * Copyright (C) 2013 Regents of the University of California.
 * @author: Jeff Thompson <jefft0@remap.ucla.edu>
 * See COPYING for copyright and distribution information.
 * Implement getAsync and putAsync used by NDN using nsISocketTransportService.
 * This is used inside Firefox XPCOM modules.
 */

// Assume already imported the following:
// Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
// Components.utils.import("resource://gre/modules/NetUtil.jsm");

/**
 * @constructor
 */
var XpcomTransport = function XpcomTransport() 
{
    this.elementListener = null;
    this.socket = null; // nsISocketTransport
    this.outStream = null;
    this.connectedHost = null; // Read by NDN.
    this.connectedPort = null; // Read by NDN.
    
    this.defaultGetHostAndPort = NDN.makeShuffledGetHostAndPort
        (["A.hub.ndn.ucla.edu", "B.hub.ndn.ucla.edu", "C.hub.ndn.ucla.edu", "D.hub.ndn.ucla.edu", 
          "E.hub.ndn.ucla.edu", "F.hub.ndn.ucla.edu", "G.hub.ndn.ucla.edu", "H.hub.ndn.ucla.edu"],
         // Connect to port 9695 until the testbed hubs use NDNx.
         9695);
};

/**
 * Connect to the host and port in ndn.  This replaces a previous connection and sets connectedHost
 *   and connectedPort.  Once connected, call onopenCallback().
 * Listen on the port to read an entire binary XML encoded element and call
 *    ndn.onReceivedElement(element).
 */
XpcomTransport.prototype.connect = function(ndn, onopenCallback) 
{
    this.elementListener = ndn;
    this.connectHelper(ndn.host, ndn.port, ndn);
    
    onopenCallback();
};

/**
 * Do the work to connect to host and port.  This replaces a previous connection and sets connectedHost
 *   and connectedPort.
 * Listen on the port to read an entire binary XML encoded element and call
 *    elementListener.onReceivedElement(element).
 */
XpcomTransport.prototype.connectHelper = function(host, port, elementListener) 
{
    if (this.socket != null) {
        try {
            this.socket.close(0);
        } catch (ex) {
      console.log("XpcomTransport socket.close exception: " + ex);
    }
        this.socket = null;
    }

  var transportService = Components.classes["@mozilla.org/network/socket-transport-service;1"].getService
        (Components.interfaces.nsISocketTransportService);
  var pump = Components.classes["@mozilla.org/network/input-stream-pump;1"].createInstance
        (Components.interfaces.nsIInputStreamPump);
  this.socket = transportService.createTransport(null, 0, host, port, null);
    if (LOG > 0) console.log('XpcomTransport: Connected to ' + host + ":" + port);
    this.connectedHost = host;
    this.connectedPort = port;
    this.outStream = this.socket.openOutputStream(1, 0, 0);

    var inStream = this.socket.openInputStream(0, 0, 0);
  var dataListener = {
        elementReader: new BinaryXmlElementReader(elementListener),
    
    onStartRequest: function(request, context) {
    },
    onStopRequest: function(request, context, status) {
    },
    onDataAvailable: function(request, context, _inputStream, offset, count) {
      try {
        // Use readInputStreamToString to handle binary data.
                // TODO: Can we go directly from the stream to Buffer?
                this.elementReader.onReceivedData(DataUtils.toNumbersFromString
                    (NetUtil.readInputStreamToString(inStream, count)));
      } catch (ex) {
        console.log("XpcomTransport.onDataAvailable exception: " + ex + "\n" + ex.stack);
      }
    }
    };
  
  pump.init(inStream, -1, -1, 0, 0, true);
    pump.asyncRead(dataListener, null);
};

/**
 * Send the data over the connection created by connect.
 */
XpcomTransport.prototype.send = function(/* Buffer */ data) 
{
    if (this.socket == null || this.connectedHost == null || this.connectedPort == null) {
        console.log("XpcomTransport connection is not established.");
        return;
    }
    
    var rawDataString = DataUtils.toString(data);
    try {
        this.outStream.write(rawDataString, rawDataString.length);
        this.outStream.flush();
    } catch (ex) {
        if (this.socket.isAlive())
            // The socket is still alive. Assume there could still be incoming data. Just throw the exception.
            throw ex;
        
        if (LOG > 0) 
            console.log("XpcomTransport.send: Trying to reconnect to " + this.connectedHost + ":" + 
                this.connectedPort + " and resend after exception: " + ex);
        
        this.connectHelper(this.connectedHost, this.connectedPort, this.elementListener);
        this.outStream.write(rawDataString, rawDataString.length);
        this.outStream.flush();
    }
};
/*
 * This class defines MOME types based on the filename extension.
 * Copyright (C) 2013 Regents of the University of California.
 * author: Jeff Thompson <jefft0@remap.ucla.edu>
 * See COPYING for copyright and distribution information.
 */
 
/**
 * MimeTypes contains a mapping of filename extension to MIME type, and a function getContentTypeAndCharset to select it.
 */
var MimeTypes = {
  /**
   * Based on filename, return an object with properties contentType and charset.
   */
  getContentTypeAndCharset: function(filename) {      
      var iDot = filename.lastIndexOf('.');
      if (iDot >= 0) {
          var extension = filename.substr(iDot + 1, filename.length - iDot - 1);
          var contentType = MimeTypes[extension];
          if (contentType != null) {
              var charset = "ISO-8859-1";
              if (contentType.split('/')[0] == "text")
                  charset = "utf-8";
              return { contentType: contentType, charset: charset };
          }
      }
      
      // Use a default.
      return { contentType: "text/html", charset: "utf-8" };
  },
  
  /* For each file extension, define the MIME type.
   */
  "323": "text/h323",
  "%": "application/x-trash",
  "~": "application/x-trash",
  "3gp": "video/3gpp",
  "7z": "application/x-7z-compressed",
  "abw": "application/x-abiword",
  "ai": "application/postscript",
  "aif": "audio/x-aiff",
  "aifc": "audio/x-aiff",
  "aiff": "audio/x-aiff",
  "alc": "chemical/x-alchemy",
  "amr": "audio/amr",
  "anx": "application/annodex",
  "apk": "application/vnd.android.package-archive",
  "art": "image/x-jg",
  "asc": "text/plain",
  "asf": "video/x-ms-asf",
  "asx": "video/x-ms-asf",
  "asn": "chemical/x-ncbi-asn1",
  "atom": "application/atom+xml",
  "atomcat": "application/atomcat+xml",
  "atomsrv": "application/atomserv+xml",
  "au": "audio/basic",
  "snd": "audio/basic",
  "avi": "video/x-msvideo",
  "awb": "audio/amr-wb",
  "axa": "audio/annodex",
  "axv": "video/annodex",
  "b": "chemical/x-molconn-Z",
  "bak": "application/x-trash",
  "bat": "application/x-msdos-program",
  "bcpio": "application/x-bcpio",
  "bib": "text/x-bibtex",
  "bin": "application/octet-stream",
  "bmp": "image/x-ms-bmp",
  "boo": "text/x-boo",
  "book": "application/x-maker",
  "brf": "text/plain",
  "bsd": "chemical/x-crossfire",
  "c": "text/x-csrc",
  "c++": "text/x-c++src",
  "c3d": "chemical/x-chem3d",
  "cab": "application/x-cab",
  "cac": "chemical/x-cache",
  "cache": "chemical/x-cache",
  "cap": "application/cap",
  "cascii": "chemical/x-cactvs-binary",
  "cat": "application/vnd.ms-pki.seccat",
  "cbin": "chemical/x-cactvs-binary",
  "cbr": "application/x-cbr",
  "cbz": "application/x-cbz",
  "cc": "text/x-c++src",
  "cda": "application/x-cdf",
  "cdf": "application/x-cdf",
  "cdr": "image/x-coreldraw",
  "cdt": "image/x-coreldrawtemplate",
  "cdx": "chemical/x-cdx",
  "cdy": "application/vnd.cinderella",
  "cer": "chemical/x-cerius",
  "chm": "chemical/x-chemdraw",
  "chrt": "application/x-kchart",
  "cif": "chemical/x-cif",
  "class": "application/java-vm",
  "cls": "text/x-tex",
  "cmdf": "chemical/x-cmdf",
  "cml": "chemical/x-cml",
  "cod": "application/vnd.rim.cod",
  "com": "application/x-msdos-program",
  "cpa": "chemical/x-compass",
  "cpio": "application/x-cpio",
  "cpp": "text/x-c++src",
  "cpt": "image/x-corelphotopaint",
  "cr2": "image/x-canon-cr2",
  "crl": "application/x-pkcs7-crl",
  "crt": "application/x-x509-ca-cert",
  "crw": "image/x-canon-crw",
  "csd": "audio/csound",
  "csf": "chemical/x-cache-csf",
  "csh": "application/x-csh",
  "csml": "chemical/x-csml",
  "csm": "chemical/x-csml",
  "css": "text/css",
  "csv": "text/csv",
  "ctab": "chemical/x-cactvs-binary",
  "ctx": "chemical/x-ctx",
  "cu": "application/cu-seeme",
  "cub": "chemical/x-gaussian-cube",
  "cxf": "chemical/x-cxf",
  "cef": "chemical/x-cxf",
  "cxx": "text/x-c++src",
  "d": "text/x-dsrc",
  "dat": "application/x-ns-proxy-autoconfig",
  "davmount": "application/davmount+xml",
  "dcr": "application/x-director",
  "deb": "application/x-debian-package",
  "dif": "video/dv",
  "dv": "video/dv",
  "diff": "text/x-diff",
  "patch": "text/x-diff",
  "dir": "application/x-director",
  "djvu": "image/vnd.djvu",
  "djv": "image/vnd.djvu",
  "dl": "video/dl",
  "dll": "application/x-msdos-program",
  "dmg": "application/x-apple-diskimage",
  "dms": "application/x-dms",
  "doc": "application/msword",
  "docm": "application/vnd.ms-word.document.macroEnabled.12",
  "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "dot": "application/msword",
  "dotm": "application/vnd.ms-word.template.macroEnabled.12",
  "dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "dvi": "application/x-dvi",
  "dxr": "application/x-director",
  "emb": "chemical/x-embl-dl-nucleotide",
  "embl": "chemical/x-embl-dl-nucleotide",
  "eml": "message/rfc822",
  "eps": "application/postscript",
  "eps2": "application/postscript",
  "eps3": "application/postscript",
  "epsf": "application/postscript",
  "epsi": "application/postscript",
  "erf": "image/x-epson-erf",
  "es": "application/ecmascript",
  "etx": "text/x-setext",
  "exe": "application/x-msdos-program",
  "ez": "application/andrew-inset",
  "fb": "application/x-maker",
  "fbdoc": "application/x-maker",
  "fch": "chemical/x-gaussian-checkpoint",
  "fchk": "chemical/x-gaussian-checkpoint",
  "fig": "application/x-xfig",
  "flac": "audio/flac",
  "fli": "video/fli",
  "flv": "video/x-flv",
  "fm": "application/x-maker",
  "frame": "application/x-maker",
  "frm": "application/x-maker",
  "gal": "chemical/x-gaussian-log",
  "gam": "chemical/x-gamess-input",
  "gamin": "chemical/x-gamess-input",
  "gan": "application/x-ganttproject",
  "gau": "chemical/x-gaussian-input",
  "gcd": "text/x-pcs-gcd",
  "gcf": "application/x-graphing-calculator",
  "gcg": "chemical/x-gcg8-sequence",
  "gen": "chemical/x-genbank",
  "gf": "application/x-tex-gf",
  "gif": "image/gif",
  "gjc": "chemical/x-gaussian-input",
  "gjf": "chemical/x-gaussian-input",
  "gl": "video/gl",
  "gnumeric": "application/x-gnumeric",
  "gpt": "chemical/x-mopac-graph",
  "gsf": "application/x-font",
  "gsm": "audio/x-gsm",
  "gtar": "application/x-gtar",
  "h": "text/x-chdr",
  "h++": "text/x-c++hdr",
  "hdf": "application/x-hdf",
  "hh": "text/x-c++hdr",
  "hin": "chemical/x-hin",
  "hpp": "text/x-c++hdr",
  "hqx": "application/mac-binhex40",
  "hs": "text/x-haskell",
  "hta": "application/hta",
  "htc": "text/x-component",
  "htm": "text/html",
  "html": "text/html",
  "hxx": "text/x-c++hdr",
  "ica": "application/x-ica",
  "ice": "x-conference/x-cooltalk",
  "ico": "image/x-icon",
  "ics": "text/calendar",
  "icz": "text/calendar",
  "ief": "image/ief",
  "igs": "model/iges",
  "iges": "model/iges",
  "iii": "application/x-iphone",
  "info": "application/x-info",
  "inp": "chemical/x-gamess-input",
  "ins": "application/x-internet-signup",
  "iso": "application/x-iso9660-image",
  "isp": "application/x-internet-signup",
  "istr": "chemical/x-isostar",
  "ist": "chemical/x-isostar",
  "jad": "text/vnd.sun.j2me.app-descriptor",
  "jam": "application/x-jam",
  "jar": "application/java-archive",
  "java": "text/x-java",
  "jdx": "chemical/x-jcamp-dx",
  "dx": "chemical/x-jcamp-dx",
  "jmz": "application/x-jmol",
  "jng": "image/x-jng",
  "jnlp": "application/x-java-jnlp-file",
  "jpe": "image/jpeg",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "application/javascript",
  "json": "application/json",
  "kar": "audio/midi",
  "key": "application/pgp-keys",
  "kil": "application/x-killustrator",
  "kin": "chemical/x-kinemage",
  "kml": "application/vnd.google-earth.kml+xml",
  "kmz": "application/vnd.google-earth.kmz",
  "kpr": "application/x-kpresenter",
  "kpt": "application/x-kpresenter",
  "ksp": "application/x-kspread",
  "kwd": "application/x-kword",
  "kwt": "application/x-kword",
  "latex": "application/x-latex",
  "lha": "application/x-lha",
  "lhs": "text/x-literate-haskell",
  "lin": "application/bbolin",
  "lsf": "video/x-la-asf",
  "lsx": "video/x-la-asf",
  "ltx": "text/x-tex",
  "lyx": "application/x-lyx",
  "lzh": "application/x-lzh",
  "lzx": "application/x-lzx",
  "m3g": "application/m3g",
  "m3u": "audio/mpegurl",
  "m3u8": "application/x-mpegURL",
  "m4a": "audio/mpeg",
  "maker": "application/x-maker",
  "man": "application/x-troff-man",
  "manifest": "text/cache-manifest",
  "mcif": "chemical/x-mmcif",
  "mcm": "chemical/x-macmolecule",
  "mdb": "application/msaccess",
  "me": "application/x-troff-me",
  "mesh": "model/mesh",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "mif": "application/x-mif",
  "mm": "application/x-freemind",
  "mmd": "chemical/x-macromodel-input",
  "mmod": "chemical/x-macromodel-input",
  "mmf": "application/vnd.smaf",
  "mml": "text/mathml",
  "mng": "video/x-mng",
  "moc": "text/x-moc",
  "mol": "chemical/x-mdl-molfile",
  "mol2": "chemical/x-mol2",
  "moo": "chemical/x-mopac-out",
  "mop": "chemical/x-mopac-input",
  "mopcrt": "chemical/x-mopac-input",
  "movie": "video/x-sgi-movie",
  "mp2": "audio/mpeg",
  "mp3": "audio/mpeg",
  "mp4": "video/mp4",
  "mpc": "chemical/x-mopac-input",
  "mpe": "video/mpeg",
  "mpeg": "video/mpeg",
  "mpega": "audio/mpeg",
  "mpg": "video/mpeg",
  "mpga": "audio/mpeg",
  "mph": "application/x-comsol",
  "mpv": "video/x-matroska",
  "mkv": "video/x-matroska",
  "ms": "application/x-troff-ms",
  "msh": "model/mesh",
  "msi": "application/x-msi",
  "mvb": "chemical/x-mopac-vib",
  "mxf": "application/mxf",
  "mxu": "video/vnd.mpegurl",
  "nb": "application/mathematica",
  "nbp": "application/mathematica",
  "nc": "application/x-netcdf",
  "nef": "image/x-nikon-nef",
  "nwc": "application/x-nwc",
  "o": "application/x-object",
  "oda": "application/oda",
  "odb": "application/vnd.oasis.opendocument.database",
  "odc": "application/vnd.oasis.opendocument.chart",
  "odf": "application/vnd.oasis.opendocument.formula",
  "odg": "application/vnd.oasis.opendocument.graphics",
  "odi": "application/vnd.oasis.opendocument.image",
  "odm": "application/vnd.oasis.opendocument.text-master",
  "odp": "application/vnd.oasis.opendocument.presentation",
  "ods": "application/vnd.oasis.opendocument.spreadsheet",
  "odt": "application/vnd.oasis.opendocument.text",
  "oga": "audio/ogg",
  "ogg": "audio/ogg",
  "ogv": "video/ogg",
  "ogx": "application/ogg",
  "old": "application/x-trash",
  "one": "application/onenote",
  "onepkg": "application/onenote",
  "onetmp": "application/onenote",
  "onetoc2": "application/onenote",
  "orc": "audio/csound",
  "orf": "image/x-olympus-orf",
  "otg": "application/vnd.oasis.opendocument.graphics-template",
  "oth": "application/vnd.oasis.opendocument.text-web",
  "otp": "application/vnd.oasis.opendocument.presentation-template",
  "ots": "application/vnd.oasis.opendocument.spreadsheet-template",
  "ott": "application/vnd.oasis.opendocument.text-template",
  "oza": "application/x-oz-application",
  "p": "text/x-pascal",
  "pas": "text/x-pascal",
  "p7r": "application/x-pkcs7-certreqresp",
  "pac": "application/x-ns-proxy-autoconfig",
  "pat": "image/x-coreldrawpattern",
  "pbm": "image/x-portable-bitmap",
  "pcap": "application/cap",
  "pcf": "application/x-font",
  "pcx": "image/pcx",
  "pdb": "chemical/x-pdb",
  "ent": "chemical/x-pdb",
  "pdf": "application/pdf",
  "pfa": "application/x-font",
  "pfb": "application/x-font",
  "pgm": "image/x-portable-graymap",
  "pgn": "application/x-chess-pgn",
  "pgp": "application/pgp-signature",
  "php": "application/x-httpd-php",
  "php3": "application/x-httpd-php3",
  "php3p": "application/x-httpd-php3-preprocessed",
  "php4": "application/x-httpd-php4",
  "php5": "application/x-httpd-php5",
  "phps": "application/x-httpd-php-source",
  "pht": "application/x-httpd-php",
  "phtml": "application/x-httpd-php",
  "pk": "application/x-tex-pk",
  "pl": "text/x-perl",
  "pm": "text/x-perl",
  "pls": "audio/x-scpls",
  "png": "image/png",
  "pnm": "image/x-portable-anymap",
  "pot": "text/plain",
  "potm": "application/vnd.ms-powerpoint.template.macroEnabled.12",
  "potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
  "ppam": "application/vnd.ms-powerpoint.addin.macroEnabled.12",
  "ppm": "image/x-portable-pixmap",
  "pps": "application/vnd.ms-powerpoint",
  "ppsm": "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
  "ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "ppt": "application/vnd.ms-powerpoint",
  "pptm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "prf": "application/pics-rules",
  "prt": "chemical/x-ncbi-asn1-ascii",
  "ps": "application/postscript",
  "psd": "image/x-photoshop",
  "py": "text/x-python",
  "pyc": "application/x-python-code",
  "pyo": "application/x-python-code",
  "qgs": "application/x-qgis",
  "qt": "video/quicktime",
  "mov": "video/quicktime",
  "qtl": "application/x-quicktimeplayer",
  "ra": "audio/x-realaudio",
  "ram": "audio/x-pn-realaudio",
  "rar": "application/rar",
  "ras": "image/x-cmu-raster",
  "rb": "application/x-ruby",
  "rd": "chemical/x-mdl-rdfile",
  "rdf": "application/rdf+xml",
  "rdp": "application/x-rdp",
  "rgb": "image/x-rgb",
  "rhtml": "application/x-httpd-eruby",
  "rm": "audio/x-pn-realaudio",
  "roff": "application/x-troff",
  "ros": "chemical/x-rosdal",
  "rpm": "application/x-redhat-package-manager",
  "rss": "application/rss+xml",
  "rtf": "application/rtf",
  "rtx": "text/richtext",
  "rxn": "chemical/x-mdl-rxnfile",
  "scala": "text/x-scala",
  "sci": "application/x-scilab",
  "sce": "application/x-scilab",
  "sco": "audio/csound",
  "scr": "application/x-silverlight",
  "sct": "text/scriptlet",
  "wsc": "text/scriptlet",
  "sd": "chemical/x-mdl-sdfile",
  "sdf": "chemical/x-mdl-sdfile",
  "sd2": "audio/x-sd2",
  "sda": "application/vnd.stardivision.draw",
  "sdc": "application/vnd.stardivision.calc",
  "sdd": "application/vnd.stardivision.impress",
  "sds": "application/vnd.stardivision.chart",
  "sdw": "application/vnd.stardivision.writer",
  "ser": "application/java-serialized-object",
  "sfv": "text/x-sfv",
  "sgf": "application/x-go-sgf",
  "sgl": "application/vnd.stardivision.writer-global",
  "sh": "application/x-sh",
  "shar": "application/x-shar",
  "shp": "application/x-qgis",
  "shtml": "text/html",
  "shx": "application/x-qgis",
  "sid": "audio/prs.sid",
  "sik": "application/x-trash",
  "silo": "model/mesh",
  "sis": "application/vnd.symbian.install",
  "sisx": "x-epoc/x-sisx-app",
  "sit": "application/x-stuffit",
  "sitx": "application/x-stuffit",
  "skd": "application/x-koan",
  "skm": "application/x-koan",
  "skp": "application/x-koan",
  "skt": "application/x-koan",
  "sldm": "application/vnd.ms-powerpoint.slide.macroEnabled.12",
  "sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide",
  "smi": "application/smil",
  "smil": "application/smil",
  "spc": "chemical/x-galactic-spc",
  "spl": "application/futuresplash",
  "spx": "audio/ogg",
  "sql": "application/x-sql",
  "src": "application/x-wais-source",
  "stc": "application/vnd.sun.xml.calc.template",
  "std": "application/vnd.sun.xml.draw.template",
  "sti": "application/vnd.sun.xml.impress.template",
  "stl": "application/sla",
  "stw": "application/vnd.sun.xml.writer.template",
  "sty": "text/x-tex",
  "sv4cpio": "application/x-sv4cpio",
  "sv4crc": "application/x-sv4crc",
  "svg": "image/svg+xml",
  "svgz": "image/svg+xml",
  "sw": "chemical/x-swissprot",
  "swf": "application/x-shockwave-flash",
  "swfl": "application/x-shockwave-flash",
  "sxc": "application/vnd.sun.xml.calc",
  "sxd": "application/vnd.sun.xml.draw",
  "sxg": "application/vnd.sun.xml.writer.global",
  "sxi": "application/vnd.sun.xml.impress",
  "sxm": "application/vnd.sun.xml.math",
  "sxw": "application/vnd.sun.xml.writer",
  "t": "application/x-troff",
  "tar": "application/x-tar",
  "taz": "application/x-gtar-compressed",
  "tcl": "application/x-tcl",
  "tk": "text/x-tcl",
  "tex": "text/x-tex",
  "texinfo": "application/x-texinfo",
  "texi": "application/x-texinfo",
  "text": "text/plain",
  "tgf": "chemical/x-mdl-tgf",
  "tgz": "application/x-gtar-compressed",
  "thmx": "application/vnd.ms-officetheme",
  "tiff": "image/tiff",
  "tif": "image/tiff",
  "tm": "text/texmacs",
  "torrent": "application/x-bittorrent",
  "tr": "application/x-troff",
  "ts": "video/MP2T",
  "tsp": "application/dsptype",
  "tsv": "text/tab-separated-values",
  "txt": "text/plain",
  "udeb": "application/x-debian-package",
  "uls": "text/iuls",
  "ustar": "application/x-ustar",
  "val": "chemical/x-ncbi-asn1-binary",
  "aso": "chemical/x-ncbi-asn1-binary",
  "vcd": "application/x-cdlink",
  "vcf": "text/x-vcard",
  "vcs": "text/x-vcalendar",
  "vmd": "chemical/x-vmd",
  "vms": "chemical/x-vamas-iso14976",
  "vrm": "x-world/x-vrml",
  "vsd": "application/vnd.visio",
  "wad": "application/x-doom",
  "wav": "audio/x-wav",
  "wax": "audio/x-ms-wax",
  "wbmp": "image/vnd.wap.wbmp",
  "wbxml": "application/vnd.wap.wbxml",
  "webm": "video/webm",
  "wk": "application/x-123",
  "wm": "video/x-ms-wm",
  "wma": "audio/x-ms-wma",
  "wmd": "application/x-ms-wmd",
  "wml": "text/vnd.wap.wml",
  "wmlc": "application/vnd.wap.wmlc",
  "wmls": "text/vnd.wap.wmlscript",
  "wmlsc": "application/vnd.wap.wmlscriptc",
  "wmv": "video/x-ms-wmv",
  "wmx": "video/x-ms-wmx",
  "wmz": "application/x-ms-wmz",
  "wp5": "application/vnd.wordperfect5.1",
  "wpd": "application/vnd.wordperfect",
  "wrl": "model/vrml",
  "vrml": "model/vrml",
  "wvx": "video/x-ms-wvx",
  "wz": "application/x-wingz",
  "x3d": "model/x3d+xml",
  "x3db": "model/x3d+binary",
  "x3dv": "model/x3d+vrml",
  "xbm": "image/x-xbitmap",
  "xcf": "application/x-xcf",
  "xht": "application/xhtml+xml",
  "xhtml": "application/xhtml+xml",
  "xlam": "application/vnd.ms-excel.addin.macroEnabled.12",
  "xlb": "application/vnd.ms-excel",
  "xls": "application/vnd.ms-excel",
  "xlsb": "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  "xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
  "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "xlt": "application/vnd.ms-excel",
  "xltm": "application/vnd.ms-excel.template.macroEnabled.12",
  "xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "xml": "application/xml",
  "xpi": "application/x-xpinstall",
  "xpm": "image/x-xpixmap",
  "xsd": "application/xml",
  "xsl": "application/xml",
  "xspf": "application/xspf+xml",
  "xtel": "chemical/x-xtel",
  "xul": "application/vnd.mozilla.xul+xml",
  "xwd": "image/x-xwindowdump",
  "xyz": "chemical/x-xyz",
  "zip": "application/zip",
  "zmt": "chemical/x-mopac-input"
};

exports.MimeTypes = MimeTypes;
