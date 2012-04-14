//TODO:go back on DEBUG stuff
//MARK LENGTH STUFF NOT SURE WHAT IT"S ABOUT
//PUSH instead of PUT on attributes
var XML_EXT = 0x00; 
	
var XML_TAG = 0x01; 
	
var XML_DTAG = 0x02; 
	
var XML_ATTR = 0x03; 
 
var XML_DATTR = 0x04; 
	
var XML_BLOB = 0x05; 
	
var XML_UDATA = 0x06; 
	
var XML_CLOSE = 0x0;

var XML_SUBTYPE_PROCESSING_INSTRUCTIONS = 16; 
	

var XML_TT_BITS = 3;
var XML_TT_MASK = ((1 << XML_TT_BITS) - 1);
var XML_TT_VAL_BITS = XML_TT_BITS + 1;
var XML_TT_VAL_MASK = ((1 << (XML_TT_VAL_BITS)) - 1);
var XML_REG_VAL_BITS = 7;
var XML_REG_VAL_MASK = ((1 << XML_REG_VAL_BITS) - 1);
var XML_TT_NO_MORE = (1 << XML_REG_VAL_BITS); // 0x80
var BYTE_MASK = 0xFF;
var LONG_BYTES = 8;
var LONG_BITS = 64;
	
var bits_11 = 0x0000007FF;
var bits_18 = 0x00003FFFF;
var bits_32 = 0x0FFFFFFFF;



//returns a string
tagToString = function(/*long*/ tagVal) {
	if ((tagVal >= 0) && (tagVal < CCNProtocolDTagsStrings.length)) {
		return CCNProtocolDTagsStrings[tagVal];
	} else if (tagVal == CCNProtocolDTags.CCNProtocolDataUnit) {
		return CCNProtocolDTags.CCNPROTOCOL_DATA_UNIT;
	}
	return null;
};

//returns a Long
stringToTag =  function(/*String*/ tagName) {
	// the slow way, but right now we don't care.... want a static lookup for the forward direction
	for (var i=0; i < CCNProtocolDTagsStrings.length; ++i) {
		if ((null != CCNProtocolDTagsStrings[i]) && (CCNProtocolDTagsStrings[i] == tagName)) {
			return i;
		}
	}
	if (CCNProtocolDTags.CCNPROTOCOL_DATA_UNIT == tagName) {
		return CCNProtocolDTags.CCNProtocolDataUnit;
	}
	return null;
};

//console.log(stringToTag(64));
var BinaryXMLDecoder = function BinaryXMLDecoder(istream){
	var MARK_LEN=512;
	var DEBUG_MAX_LEN =  32768;
	
	this.istream = istream;
	//console.log('istream is '+ this.istream);
	this.offset = 0;
};


BinaryXMLDecoder.prototype.readStartElement =function(
	//String
	startTag,				    
	//TreeMap<String, String>
	attributes) {

	try {
		//this.TypeAndVal 
		tv = this.decodeTypeAndVal(this.istream);

		if (null == tv) {
			throw new Exception("Expected start element: " + startTag + " got something not a tag.");
		}
		
		//String 
		decodedTag = null;
		
		if (tv.type() == XML_TAG) {
			
			decodedTag = this.decodeUString(this.Istream, tv.val()+1);
			
		} else if (tv.type() == XML_DTAG) {
			decodedTag = tagToString(tv.val());	
		}
		
		if ((null ==  decodedTag) || decodedTag != startTag) {
			throw new Exception("Expected start element: " + startTag + " got: " + decodedTag + "(" + tv.val() + ")");
		}
		
		if (null != attributes) {
			readAttributes(attributes); 
		}
		
	} catch (e) {
		throw new Exception("readStartElement", e);
	}
};

BinaryXMLDecoder.prototype.readAttributes = function(
	//TreeMap<String,String> 
	attributes){
	
	if (null == attributes) {
		return;
	}

	try {

		//this.TypeAndVal 
		nextTV = this.peekTypeAndVal(this.istream);

		while ((null != nextTV) && ((XML_ATTR == nextTV.type()) ||
				(XML_DATTR == nextTV.type()))) {

			//this.TypeAndVal 
			thisTV = this.decodeTypeAndVal(this.Istream);

			var attributeName = null;
			if (XML_ATTR == thisTV.type()) {
				
				attributeName = this.decodeUString(this.istream, thisTV.val()+1);

			} else if (XML_DATTR == thisTV.type()) {
				// DKS TODO are attributes same or different dictionary?
				attributeName = tagToString(thisTV.val());
				if (null == attributeName) {
					throw new ContentDecodingException("Unknown DATTR value" + thisTV.val());
				}
			}
			
			var attributeValue = this.decodeUString(this.istream);

			attributes.put(attributeName, attributeValue);

			nextTV = this.peekTypeAndVal(this.istream);
		}

	} catch ( e) {

		throw new ContentDecodingException("readStartElement", e);
	}
};


BinaryXMLDecoder.prototype.initializeDecoding = function() {
		//if (!this.istream.markSupported()) {
			//throw new IllegalArgumentException(this.getClass().getName() + ": input stream must support marking!");
		//}
}

BinaryXMLDecoder.prototype.readStartDocument = function(){
		// Currently no start document in binary encoding.
	}

BinaryXMLDecoder.prototype.readEndDocument = function() {
		// Currently no end document in binary encoding.
	};

BinaryXMLDecoder.prototype.readStartElement = function(
		//String 
		startTag,
		//TreeMap<String, String> 
		attributes) {
	
		
		//NOT SURE
		//if(typeof startTag == 'number')
			//startTag = tagToString(startTag);
		
		//try {
			//TypeAndVal 
			tv = this.decodeTypeAndVal(this.istream);
			
			if (null == tv) {
				throw new Exception("Expected start element: " + startTag + " got something not a tag.");
			}
			
			//String 
			decodedTag = null;
			console.log(tv);
			console.log(typeof tv);
			
			console.log(XML_TAG);
			if (tv.type() == XML_TAG) {
				//console.log('got here');
				//Log.info(Log.FAC_ENCODING, "Unexpected: got tag in readStartElement; looking for tag " + startTag + " got length: " + (int)tv.val()+1);
				// Tag value represents length-1 as tags can never be empty.
				var valval ;
				if(typeof tv.val() == 'string'){
					valval = (parseInt(tv.val())) + 1;
				}
				else
					valval = (tv.val())+ 1;
				
				console.log('valval is ' +valval);
				
				decodedTag = this.decodeUString(this.istream,  valval);
				
			} else if (tv.type() == XML_DTAG) {
				console.log('gothere');
				//console.log(tv.val());
				//decodedTag = tagToString(tv.val());
				//console.log()
				decodedTag = tv.val();
			}
			
			//console.log(decodedTag);
			console.log('startTag is '+startTag);
			
			
			if ((null ==  decodedTag) || decodedTag != startTag ) {
				console.log('expecting '+ startag + ' but got '+ decodedTag);
				throw new Exception("Expected start element: " + startTag + " got: " + decodedTag + "(" + tv.val() + ")");
			}
			
			// DKS: does not read attributes out of stream if caller doesn't
			// ask for them. Should possibly peek and skip over them regardless.
			// TODO: fix this
			if (null != attributes) {
				readAttributes(attributes); 
			}
			
		//} catch ( e) {
			//console.log(e);
			//throw new Exception("readStartElement", e);
		//}
	}
	

BinaryXMLDecoder.prototype.readAttributes = function(
	//TreeMap<String,String> 
	attributes) {
	
	if (null == attributes) {
		return;
	}

	try {
		// Now need to get attributes.
		//TypeAndVal 
		nextTV = this.peekTypeAndVal(this.istream);

		while ((null != nextTV) && ((XML_ATTR == nextTV.type()) ||
				(XML_DATTR == nextTV.type()))) {

			// Decode this attribute. First, really read the type and value.
			//this.TypeAndVal 
			thisTV = this.decodeTypeAndVal(this.istream);

			//String 
			attributeName = null;
			if (XML_ATTR == thisTV.type()) {
				// Tag value represents length-1 as attribute names cannot be empty.
				var valval ;
				if(typeof tv.val() == 'string'){
					valval = (parseInt(tv.val())) + 1;
				}
				else
					valval = (tv.val())+ 1;
				
				attributeName = this.decodeUString(this.istream,valval);

			} else if (XML_DATTR == thisTV.type()) {
				// DKS TODO are attributes same or different dictionary?
				attributeName = tagToString(thisTV.val());
				if (null == attributeName) {
					throw new Exception("Unknown DATTR value" + thisTV.val());
				}
			}
			// Attribute values are always UDATA
			//String
			attributeValue = this.decodeUString(this.istream);

			//
			attributes.push([attributeName, attributeValue]);

			nextTV = this.peekTypeAndVal(this.istream);
		}

	} catch ( e) {
		Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
		throw new Exception("readStartElement", e);
	}
};

//returns a string
BinaryXMLDecoder.prototype.peekStartElementAsString = function() {
	//this.istream.mark(MARK_LEN);

	//String 
	decodedTag = null;
	var previousOffset = this.offset;
	try {
		// Have to distinguish genuine errors from wrong tags. Could either use
		// a special exception subtype, or redo the work here.
		//this.TypeAndVal 
		tv = this.decodeTypeAndVal(this.istream);

		if (null != tv) {

			if (tv.type() == XML_TAG) {
				/*if (tv.val()+1 > DEBUG_MAX_LEN) {
					throw new ContentDecodingException("Decoding error: length " + tv.val()+1 + " longer than expected maximum length!");
				}*/

				// Tag value represents length-1 as tags can never be empty.
				var valval ;
				if(typeof tv.val() == 'string'){
					valval = (parseInt(tv.val())) + 1;
				}
				else
					valval = (tv.val())+ 1;
				
				decodedTag = this.decodeUString(this.istream, valval);
				
				//Log.info(Log.FAC_ENCODING, "Unexpected: got text tag in peekStartElement; length: " + valval + " decoded tag = " + decodedTag);

			} else if (tv.type() == XML_DTAG) {
				decodedTag = tagToString(tv.val());					
			}

		} // else, not a type and val, probably an end element. rewind and return false.

	} catch ( e) {
		/*try {
			this.istream.reset();
			this.istream.mark(MARK_LEN);
			long ms = System.currentTimeMillis();
			File tempFile = new File("data_" + Long.toString(ms) + ".ccnb");
			FileOutputStream fos = new FileOutputStream(tempFile);
			try {
				byte buf[] = new byte[1024];
				while (this.istream.available() > 0) {
					int count = this.istream.read(buf);
					fos.write(buf,0, count);
				}
			} finally {
				fos.close();
			}
			this.istream.reset();
			Log.info(Log.FAC_ENCODING, "BinaryXMLDecoder: exception in peekStartElement, dumping offending object to file: " + tempFile.getAbsolutePath());
			throw e;
			
		} catch (IOException ie) {
			Log.warning(Log.FAC_ENCODING, "IOException in BinaryXMLDecoder error handling: " + e.getMessage());
			Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, ie);
			throw new ContentDecodingException("peekStartElement", e);

		}
	} catch (IOException e) {
		Log.warning(Log.FAC_ENCODING, "IOException in BinaryXMLDecoder: " + e.getMessage());
		Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
		throw new ContentDecodingException("peekStartElement", e);
	*/
	} finally {
		try {
			//this.istream.reset();
			this.offset = previousOffset;
		} catch ( e) {
			Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
			throw new ContentDecodingException("Cannot reset stream! " + e.getMessage(), e);
		}
	}
	return decodedTag;
};

BinaryXMLDecoder.prototype.peekStartElement = function(
		//String 
		startTag) {
	//String 
	if(typeof startTag == 'string'){
		decodedTag = this.peekStartElementAsString();
		
		if ((null !=  decodedTag) && decodedTag == startTag) {
			return true;
		}
		return false;
	}
	else if(typeof startTag == 'number'){
		decodedTag = this.peekStartElementAsLong();
		if ((null !=  decodedTag) && decodedTag == startTag) {
			return true;
		}
		return false;
	}
	else{
		throw new Exception("SHOULD BE STRING OR NUMBER");
	}
}
//returns Long
BinaryXMLDecoder.prototype.peekStartElementAsLong = function() {
		//this.istream.mark(MARK_LEN);

		//Long
		decodedTag = null;
		
		var previousOffset = this.offset;
		
		try {
			// Have to distinguish genuine errors from wrong tags. Could either use
			// a special exception subtype, or redo the work here.
			//this.TypeAndVal
			tv = this.decodeTypeAndVal(this.istream);

			if (null != tv) {

				if (tv.type() == XML_TAG) {
					if (tv.val()+1 > DEBUG_MAX_LEN) {
						throw new ContentDecodingException("Decoding error: length " + tv.val()+1 + " longer than expected maximum length!");
					}

					var valval ;
					if(typeof tv.val() == 'string'){
						valval = (parseInt(tv.val())) + 1;
					}
					else
						valval = (tv.val())+ 1;
					
					// Tag value represents length-1 as tags can never be empty.
					//String 
					strTag = this.decodeUString(this.istream, valval);
					
					decodedTag = stringToTag(strTag);
					
					//Log.info(Log.FAC_ENCODING, "Unexpected: got text tag in peekStartElement; length: " + valval + " decoded tag = " + decodedTag);
					
				} else if (tv.type() == XML_DTAG) {
					decodedTag = tv.val();					
				}

			} // else, not a type and val, probably an end element. rewind and return false.

		} catch ( e) {
			/*try {
				this.istream.reset();
				this.istream.mark(MARK_LEN);
				long ms = System.currentTimeMillis();
				File tempFile = new File("data_" + Long.toString(ms) + ".ccnb");
				FileOutputStream fos = new FileOutputStream(tempFile);
				try {
					byte buf[] = new byte[1024];
					while (this.istream.available() > 0) {
						int count = this.istream.read(buf);
						fos.write(buf,0, count);
					}
				} finally {
					fos.close();
				}
				this.istream.reset();
				Log.info(Log.FAC_ENCODING, "BinaryXMLDecoder: exception in peekStartElement, dumping offending object to file: " + tempFile.getAbsolutePath());
				throw e;
				
			} catch (IOException ie) {
				Log.warning(Log.FAC_ENCODING, "IOException in BinaryXMLDecoder error handling: " + e.getMessage());
				Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
				throw new ContentDecodingException("peekStartElement", e);

			}
		} catch (IOException e) {
			Log.warning(Log.FAC_ENCODING, "IOException in BinaryXMLDecoder peekStartElementAsLong: " + e.getMessage());
			Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
			throw new ContentDecodingException("peekStartElement", e);
		*/
		} finally {
			try {
				//this.istream.reset();
				this.offset = previousOffset;
			} catch ( e) {
				Log.logStackTrace(Log.FAC_ENCODING, Level.WARNING, e);
				throw new Exception("Cannot reset stream! " + e.getMessage(), e);
			}
		}
		return decodedTag;
	};


//byte[]
BinaryXMLDecoder.prototype.readBinaryElement = function(
		//long 
		startTag,
		//TreeMap<String, String> 
		attributes){
	//byte [] 
	blob = null;
	//try {
		this.readStartElement(startTag, attributes);
		blob = this.readBlob();
		// readEndElement(); // readBlob consumes end element
	//} catch ( e) {
		//throw new ContentDecodingException(e.getMessage(), e);
	//}

	return blob;

};
	
	
BinaryXMLDecoder.prototype.readEndElement = function(){
		try {
			var next = this.istream[this.offset]; 
			this.offset++;
			//read();
			if (next != XML_CLOSE) {
				throw new ContentDecodingException("Expected end element, got: " + next);
			}
		} catch ( e) {
			throw new ContentDecodingException(e);
		}
	};

	/**
	 * Read a UString. Force this to consume the end element to match the
	 * behavior on the text side.
	 */
//String	
BinaryXMLDecoder.prototype.readUString = function(){
		//try {
			//String 
			ustring = this.decodeUString(this.istream);	
			this.readEndElement();
			return ustring;
		//} catch ( e) {
			//throw new Exception(e.getMessage(),e);
		//}
	};
	
	/**
	 * Read a BLOB. Force this to consume the end element to match the
	 * behavior on the text side.
	 */
//returns a byte[]
BinaryXMLDecoder.prototype.readBlob = function() {
		//try {
			//byte []
			
			blob = this.decodeBlob(this.istream);	
			this.readEndElement();
			return blob;
		//} catch ( e) {
			//throw new Exception(e.getMessage(),e);
		//}
	};

//read time returns CCNTime
/*BinaryXMLDecoder.prototype.readDateTime = function(
	//String 
	startTag) {
	//byte [] 
	byteTimestamp = this.readBinaryElement(startTag);
	//CCNTime 
	timestamp = new CCNTime(byteTimestamp);
	if (null == timestamp) {
		throw new ContentDecodingException("Cannot parse timestamp: " + DataUtils.printHexBytes(byteTimestamp));
	}		
	return timestamp;
};
*/
//CCNTime
	
BinaryXMLDecoder.prototype.readDateTime = function(
	//long 
	startTag)  {
	//byte [] 
	
	byteTimestamp = this.readBinaryElement(startTag);
	//CCNTime 
	timestamp = new CCNTime();
	timestamp.setDateBinary(byteTimestamp);
	
	if (null == timestamp) {
		throw new ContentDecodingException("Cannot parse timestamp: " + DataUtils.printHexBytes(byteTimestamp));
	}		
	return timestamp;
};

BinaryXMLDecoder.prototype.decodeTypeAndVal = function(
		/*InputStream*/
		istream) {
	
	/*int*/next;
	/*int*/type = -1;
	/*long*/val = 0;
	/*boolean*/more = true;

	
	//var savedOffset = this.offset;
	var count = 0;
	
	do {
		//next = istream.read();
		//console.log('a');
		console.log('offset is' + this.offset);
		var next = this.istream[this.offset ];
		console.log('next is' + next);
		//console.log('istream is ' + this.istream);
		
		
		if (next < 0) {
			return null; 
		}

		if ((0 == next) && (0 == val)) {
			return null;
		}
		
		more = (0 == (next & XML_TT_NO_MORE));
		
		if  (more) {
			val = val << XML_REG_VAL_BITS;
			val |= (next & XML_REG_VAL_MASK);
		} else {

			type = next & XML_TT_MASK;
			val = val << XML_TT_VAL_BITS;
			val |= ((next >>> XML_TT_BITS) & XML_TT_VAL_MASK);
		}
		
		this.offset++;
		
	} while (more);
	
	return new TypeAndVal(type, val);
};



//TypeAndVal
BinaryXMLDecoder.peekTypeAndVal = function(
		//InputStream 
		istream) {
	//TypeAndVal 
	tv = null;
	
	//istream.mark(LONG_BYTES*2);		
	
	var previousOffset = this.offset;
	
	try {
		tv = this.decodeTypeAndVal(this.istream);
	} finally {
		//istream.reset();
		this.offset = previousOffset;
	}
	
	return tv;
};

//byte []
/*BinaryXMLDecoder.prototype.decodeBlob = function(
		//InputStream

		istream) {
	//istream.mark(LONG_BYTES*2);
	
	TypeAndVal tv = decodeTypeAndVal(istream);
	if ((null == tv) || (XML_BLOB != tv.type())) { // if we just have closers left, will get back null
		if (Log.isLoggable(Log.FAC_ENCODING, Level.FINEST))
			Log.finest(Log.FAC_ENCODING, "Expected BLOB, got " + ((null == tv) ? " not a tag " : tv.type()) + ", assuming elided 0-length blob.");
		istream.reset();
		return new byte[0];
	}

	var valval ;
	if(typeof tv.val() == 'string'){
		valval = (parseInt(tv.val()));
	}
	else
		valval = (tv.val());
	
	return decodeBlob(istream, valval);
};*/

//byte[]
BinaryXMLDecoder.prototype.decodeBlob = function(
		//InputStream 
		istream, 
		//int 
		blobLength) {
	
	
	if(null == blobLength){
		//TypeAndVal
		tv = this.decodeTypeAndVal(this.istream);

		var valval ;
		if(typeof tv.val() == 'string'){
			valval = (parseInt(tv.val()));
		}
		else
			valval = (tv.val());
		
		console.log('valval here is ' + valval);
		return  this.decodeBlob(this.istream, valval);
	}
	
	//
	//byte [] 
	//bytes = new byte[blobLength];
	console.log('this.offset is '+ this.offset);
	console.log('blogLength is '+ blobLength);
	
	bytes = this.istream.slice(this.offset, this.offset+ blobLength);
	this.offset += blobLength;
	
	//int 
	return bytes;
	
	count = 0;
	/*
	while (true) {
		count += istream.read(bytes, count, (blobLength - count));
		//Library.info("read "+count+" bytes out of "+blobLength+" in decodeBlob");
		if (count < bytes.length) {
			//we couldn't read enough..  need to try to read all of the bytes
			//loop again...
			//should we add a max number of tries?
		} else if (count == bytes.length) {
			//we are done reading!  return now.
			return bytes;
		} else {
			//we somehow read more than we should have...

			throw new Exception("Expected to read " + bytes.length + 
					" bytes of data, read: " + count);
		}
	}*/
};

//String
/*BinaryXMLDecoder.prototype.decodeUString = function(
		//InputStream 
		istream) {
	//istream.mark(LONG_BYTES*2);
	
	//TypeAndVal 
	tv = this.decodeTypeAndVal(istream);
	
	/*if ((null == tv) || (XML_UDATA != tv.type())) { // if we just have closers left, will get back null
		if (Log.isLoggable(Log.FAC_ENCODING, Level.FINEST))
			Log.finest(Log.FAC_ENCODING, "Expected UDATA, got " + ((null == tv) ? " not a tag " : tv.type()) + ", assuming elided 0-length blob.");
		istream.reset();
		return "";
	}*/
/*
	var valval ;
	if(typeof tv.val() == 'string'){
		valval = (parseInt(tv.val()));
	}
	else
		valval = (tv.val());
	
	return this.decodeUString(istream, valval);
}*/

//String
BinaryXMLDecoder.prototype.decodeUString = function(
		//InputStream 
		istream, 
		//int 
		byteLength) {
	
	if(null == byteLength){
		tv = this.decodeTypeAndVal(this.istream);
		var valval ;
		if(typeof tv.val() == 'string'){
			valval = (parseInt(tv.val()));
		}
		else
			valval = (tv.val());
		
		byteLength= this.decodeUString(this.istream, valval);
	}
	
	//byte [] 
	console.log('bytes Length here is '+ byteLength);
	
	stringBytes = this.decodeBlob(this.istream, byteLength);
	
	tempBuffer = this.istream.slice(this.offset, this.offset+byteLength);
	this.offset+= byteLength;
	console.log('read the String' + tempBuffer.toString('ascii'));
	return tempBuffer.toString('ascii');//DataUtils.getUTF8StringFromBytes(stringBytes);
};

var TypeAndVal = function TypeAndVal(_type,_val) {
	this.t = _type;
	this.v = _val;
	
};

TypeAndVal.prototype.type = function(){
	return this.t;
};

TypeAndVal.prototype.val = function(){
	return this.v;
};
//TODO