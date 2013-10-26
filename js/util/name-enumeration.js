/**
 * Copyright (C) 2013 Regents of the University of California.
 * @author: Jeff Thompson <jefft0@remap.ucla.edu>
 * See COPYING for copyright and distribution information.
 */

var DataUtils = require('../encoding/data-utils.js').DataUtils;
var BinaryXMLDecoder = require('../encoding/binary-xml-decoder.js').BinaryXMLDecoder;
var Closure = require('../closure.js').Closure;
var NDNProtocolDTags = require('./ndn-protoco-id-tags.js').NDNProtocolDTags;
var Name = require('../name.js').Name;

// Create a namespace.
var NameEnumeration = new Object();

exports.NameEnumeration = NameEnumeration;

/**
 * Use the name enumeration protocol to get the child components of the name prefix.
 * @param {NDN} ndn The NDN object for using expressInterest.
 * @param {Name} name The name prefix for finding the child components.
 * @param {function} onComponents On getting the response, this calls onComponents(components) where
 * components is an array of Buffer name components.  If there is no response, this calls onComponents(null). 
 */
NameEnumeration.getComponents = function(ndn, prefix, onComponents)
{
  var command = new Name(prefix);
  // Add %C1.E.be
  command.add([0xc1, 0x2e, 0x45, 0x2e, 0x62, 0x65])
  
  ndn.expressInterest(command, new NameEnumeration.Closure(ndn, onComponents));
};

/**
 * Create a closure for getting the response from the name enumeration command.
 * @param {NDN} ndn The NDN object for using expressInterest.
 * @param {function} onComponents The onComponents callback given to getComponents.
 */
NameEnumeration.Closure = function NameEnumerationClosure(ndn, onComponents) 
{
  // Inherit from Closure.
  Closure.call(this);
  
  this.ndn = ndn;
  this.onComponents = onComponents;
  this.contentParts = [];
};

/**
 * Parse the response from the name enumeration command and call this.onComponents.
 * @param {number} kind
 * @param {UpcallInfo} upcallInfo
 * @returns {Closure.RESULT_OK}
 */
NameEnumeration.Closure.prototype.upcall = function(kind, upcallInfo) 
{
  try {
    if (kind == Closure.UPCALL_CONTENT || kind == Closure.UPCALL_CONTENT_UNVERIFIED) {
      var data = upcallInfo.contentObject;
      
      if (!NameEnumeration.endsWithSegmentNumber(data.name))
        // We don't expect a name without a segment number.  Treat it as a bad packet.
        this.onComponents(null);
      else {
        var segmentNumber = DataUtils.bigEndianToUnsignedInt
            (data.name.getComponent(data.name.getComponentCount() - 1));
        
        // Each time we get a segment, we put it in contentParts, so its length follows the segment numbers.
        var expectedSegmentNumber = this.contentParts.length;
        if (segmentNumber != expectedSegmentNumber)
          // Try again to get the expected segment.  This also includes the case where the first segment is not segment 0.
          this.ndn.expressInterest
            (data.name.getPrefix(data.name.getComponentCount() - 1).addSegment(expectedSegmentNumber), this);
        else {
          // Save the content and check if we are finished.
          this.contentParts.push(data.content);
          
          if (data.signedInfo != null && data.signedInfo.finalBlockID != null) {
            var finalSegmentNumber = DataUtils.bigEndianToUnsignedInt(data.signedInfo.finalBlockID);
            if (segmentNumber == finalSegmentNumber) {
              // We are finished.  Parse and return the result.
              this.onComponents(NameEnumeration.parseComponents(Buffer.concat(this.contentParts)));
              return;
            }
          }
          
          // Fetch the next segment.
          this.ndn.expressInterest
            (data.name.getPrefix(data.name.getComponentCount() - 1).addSegment(expectedSegmentNumber + 1), this);
        }
      }
    }
    else
      // Treat anything else as a timeout.
      this.onComponents(null);
  } catch (ex) {
    console.log("NameEnumeration: ignoring exception: " + ex);
  }

  return Closure.RESULT_OK;
};

/**
 * Parse the content as a name enumeration response and return an array of components.  This makes a copy of the component.
 * @param {Uint8Array} content The content to parse.
 * @returns {Array<Buffer>} The array of components.
 */
NameEnumeration.parseComponents = function(content)
{
  var components = [];
  var decoder = new BinaryXMLDecoder(content);
  
  decoder.readStartElement(NDNProtocolDTags.Collection);
 
  while (decoder.peekStartElement(NDNProtocolDTags.Link)) {
    decoder.readStartElement(NDNProtocolDTags.Link);    
    decoder.readStartElement(NDNProtocolDTags.Name);
    
    components.push(new Buffer(decoder.readBinaryElement(NDNProtocolDTags.Component)));
    
    decoder.readEndElement();  
    decoder.readEndElement();  
  }

  decoder.readEndElement();
  return components;
};

/**
 * Check if the last component in the name is a segment number.
 * TODO: Move to Name class.
 * @param {Name} name
 * @returns {Boolean} True if the name ends with a segment number, otherwise false.
 */
NameEnumeration.endsWithSegmentNumber = function(name) {
  return name.components != null && name.getComponentCount() >= 1 &&
         name.getComponent(name.getComponentCount() - 1).length >= 1 &&
         name.getComponent(name.getComponentCount() - 1)[0] == 0;
}
