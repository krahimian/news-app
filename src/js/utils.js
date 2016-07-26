function log(msg) {
    console.log(msg);
    var span = Elem.create({ tag: 'span' });
    span.innerHTML = msg;
    document.getElementById('log').appendChild(span);
}

function getHostname(url) {
    var l = document.createElement('a');
    l.href = url;
    return l.hostname.replace('www.','');
}

function fromNow(nd) {
    var o = {
	sec: 1000,
	min: 60 * 1000,
	hr: 60 * 1000 * 60,
	day: 24 * 60 * 1000 * 60,
	wk: 7 * 24 * 60 * 1000 * 60,
	mo: 30 * 24 * 60 * 1000 * 60,
	yr: 365 * 24 * 60 * 1000 * 60
    };
    
    if (!nd) return 'now';
    var r = Math.round,
        pl = function(v, n) {
	    return n + ' ' + v + (n > 1 ? 's' : '') + ' ago';
        },
        ts = new Date().getTime() - new Date(nd).getTime(),
        ii;
    if (ts < 0) return 'now';
    for (var i in o) {
	if (o.hasOwnProperty(i)) {
	    if (r(ts) < o[i]) return pl(ii || 'm', r(ts / (o[ii] || 1)));
	    ii = i;
	}
    }
    return pl(i, r(ts / o[i]));
}
