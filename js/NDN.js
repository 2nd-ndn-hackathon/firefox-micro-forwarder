/**
 * @author: Meki Cherkaoui, Jeff Thompson, Wentao Shang
 * See COPYING for copyright and distribution information.
 * This class represents the top-level object for communicating with an NDN host.
 */

var LOG = 0;

/**
 * settings is an associative array with the following defaults:
 * {
 *   host: 'localhost',
 *   port: 9696,
 *   getTransport: function() { return new WebSocketTransport(); }
 *   onopen: function() { if (LOG > 3) console.log("NDN connection established."); }
 *   onclose: function() { if (LOG > 3) console.log("NDN connection closed."); }
 * }
 */
var NDN = function NDN(settings) {
    settings = (settings || {});
	this.host = (settings.host || "localhost");
	this.port = (settings.port || 9696);
    var getTransport = (settings.getTransport || function() { return new WebSocketTransport(); });
    this.transport = getTransport();
    this.readyStatus = NDN.UNOPEN;
    // Event handler
    this.onopen = (settings.onopen || function() { if (LOG > 3) console.log("NDN connection established."); });
    this.onclose = (settings.onclose || function() { if (LOG > 3) console.log("NDN connection closed."); });
};

NDN.UNOPEN = 0;  // created but not opened yet
NDN.OPENED = 1;  // connection to ccnd opened
NDN.CLOSED = 2;  // connection to ccnd closed

NDN.ccndIdFetcher = '/%C1.M.S.localhost/%C1.M.SRV/ccnd/KEY';

NDN.prototype.createRoute = function(host,port){
	this.host=host;
	this.port=port;
}

// For fetching data
NDN.PITTable = new Array();

var PITEntry = function PITEntry(interest, closure) {
	this.interest = interest;  // Interest
	this.closure = closure;    // Closure
};

// Return the longest entry from NDN.PITTable that matches name.
NDN.getEntryForExpressedInterest = function(/*Name*/ name) {
    // TODO: handle multiple matches?  Maybe not from registerPrefix because multiple ContentObject
    //   could be sent for one Interest?
    var result = null;
    
	for (var i = 0; i < NDN.PITTable.length; i++) {
		if (NDN.PITTable[i].interest.matches_name(name)) {
            if (result == null || 
                NDN.PITTable[i].interest.name.components.length > result.interest.name.components.length)
                result = NDN.PITTable[i];
        }
	}
    
	return result;
};

/** Encode name as an Interest. If template is not null, use its attributes.
 *  Send the interest to host:port, read the entire response and call
 *  closure.upcall(Closure.UPCALL_CONTENT (or Closure.UPCALL_CONTENT_UNVERIFIED),
 *                 new UpcallInfo(this, interest, 0, contentObject)).                 
 */
NDN.prototype.expressInterest = function(
        // Name
        name,
        // Closure
        closure,
        // Interest
        template) {
	if (this.host == null || this.port == null) {
		dump('ERROR host OR port NOT SET\n');
        return;
    }
    
	var interest = new Interest(name);
    if (template != null) {
		interest.minSuffixComponents = template.minSuffixComponents;
		interest.maxSuffixComponents = template.maxSuffixComponents;
		interest.publisherPublicKeyDigest = template.publisherPublicKeyDigest;
		interest.exclude = template.exclude;
		interest.childSelector = template.childSelector;
		interest.answerOriginKind = template.answerOriginKind;
		interest.scope = template.scope;
		interest.interestLifetime = template.interestLifetime;
    }
    else
        interest.interestLifetime = 4.0;   // default interest timeout value in seconds.
    
    this.transport.expressInterest(this, interest, closure);
};


NDN.prototype.registerPrefix = function(name, closure, flag) {
    return this.transport.registerPrefix(this, name, closure, flag);
}
