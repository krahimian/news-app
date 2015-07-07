(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
	define(factory);
    } else if (typeof exports === 'object') {
	module.exports = factory;
    } else {
	root.Request = factory(root);
    }
})(this, function (root) {

    'use strict';

    var parse = function (req) {
	var result;
	try {
	    result = JSON.parse(req.responseText);
	} catch (e) {
	    result = req.responseText;
	}
	return [result, req];
    };

    var getXHR = function() {
	if (root.XMLHttpRequest
	    && (!root.location || 'file:' != root.location.protocol
		|| !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	} else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	}
	return false;
    };

    var xhr = function (type, url, data) {
	var methods = {
	    success: function () {},
	    error: function () {}
	};
	var request = getXHR();

	if (!request) throw new Error('unable to detect XHR');

	request.open(type, url, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.onreadystatechange = function () {
	    if (request.readyState === 4) {
		if (request.status === 200) {
		    methods.success.apply(methods, parse(request));
		} else {
		    methods.error.apply(methods, parse(request));
		}
	    }
	};

	request.send(JSON.stringify(data));
	return {
	    success: function (callback) {
		methods.success = callback;
		return methods;
	    },
	    error: function (callback) {
		methods.error = callback;
		return methods;
	    }
	};
    };

    return {
	get: function(src) {
	    return xhr('GET', src);
	},
	put: function(url, data) {
	    return xhr('PUT', url, data);
	},
	post: function(url, data) {
	    return xhr('POST', url, data);
	},
	del: function(url) {
	    return xhr('DELETE', url);
	}
    };

});
