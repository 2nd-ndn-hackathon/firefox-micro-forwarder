/**
 * @author: Jeff Thompson
 * See COPYING for copyright and distribution information.
 * Encapsulate a Buffer and support dynamic reallocation.
 */

/**
 * Create a DynamicBuffer where this.array is a Buffer of size length.
 * The methods will update this.length.
 * To access the array, use this.array or call slice.
 * @constructor
 * @param {number} length the initial length of the array.  If null, use a default.
 */
var DynamicBuffer = function DynamicBuffer(length) {
	if (!length)
        length = 16;
    
    this.array = new Buffer(length);
    this.length = length;
};

/**
 * Ensure that this.array has the length, reallocate and copy if necessary.
 * Update this.length which may be greater than length.
 */
DynamicBuffer.prototype.ensureLength = function(length) {
    if (this.array.length >= length)
        return;
    
    // See if double is enough.
    var newLength = this.array.length * 2;
    if (length > newLength)
        // The needed length is much greater, so use it.
        newLength = length;
    
    var newArray = new Buffer(newLength);
    newArray.set(this.array);
    this.array = newArray;
    this.length = newLength;
};

/**
 * Call this.array.set(value, offset), reallocating if necessary. 
 */
DynamicBuffer.prototype.set = function(value, offset) {
    this.ensureLength(value.length + offset);
    this.array.set(value, offset);
};

/**
 * Return this.array.slice(begin, end);
 */
DynamicBuffer.prototype.slice = function(begin, end) {
    return this.array.slice(begin, end);
};
