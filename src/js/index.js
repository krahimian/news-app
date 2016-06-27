/* global Statusbar, document */

var API = 'http://52.9.51.222:8080/api';
var trending, lead, latest, channel;

var loading = function(opts) {
    var elem = createElem('div', 'md-loading indeterminate');
    elem.innerHTML = document.getElementById('/loading.html').innerHTML;
    return elem;
};

var load = function(path, params, parent) {
    parent.innerHTML = '';
    parent.appendChild(loading());
    document.body.setAttribute('data-path', path);

    var url = API + '/channels/' + channel + path;

    window.Request.get(url, params).success(function(posts) {
	parent.innerHTML = '';
	posts.forEach(function(post) {
	    Post(post, parent);
	});
    }).error(function(err) {
	console.error(err);
	parent.innerHTML = '';
	if (window.location.pathname !== '/') window.location.href = '/';
    });
};

var loadChannels = function() {
    window.Request.get(API + '/channels').success(function(channels) {
	channels = channels.filter(function(c) {
	    return c.name !== channel;
	});

	channels.forEach(function(c) {
	    var option = createElem('option');
	    option.text = c.name;

	    document.getElementById('channel').add(option);
	});

	document.getElementById('channel').onchange = function(e) {
	    var n = e.target.value;
	    if (window.cordova) {
		channel = n;
		init();
	    } else {
		window.location.href = '/' + e.target.value;
	    }
	};
    }).error(function(err) {
	console.error(err);
    });
};

var init = function() {
    load('/top', {
	offset: 0,
	limit: 3
    }, lead);

    load('/trending', {
	offset: 0
    }, trending);

    load('/latest', {
	offset: 0,
	limit: 3
    }, latest);
};

function onPause() {
    window.localStorage.setItem('lastPause', new Date());
}

function onResume() {
    var lastPause = window.localStorage.getItem('lastPause');
    var diff = new Date().getTime() - new Date(lastPause).getTime();

    if (diff > (1000 * 60 * 30)) {
	init();
    }
}

function onDeviceReady() {
    trending = document.getElementById('trending');
    latest = document.getElementById('latest');
    lead = document.getElementById('lead');

    document.addEventListener('resume', onResume, false);
    document.addEventListener('pause', onPause, false);

    if (typeof StatusBar !== 'undefined')
	StatusBar.hide();

    if (window.cordova) {
	channel = 'news';
    } else {
	channel = window.location.pathname.substring(1) || 'news';
    }

    var option = createElem('option');
    option.text = channel;
    document.getElementById('channel').add(option);

    init();
    loadChannels();
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
    else onDeviceReady();
}, false);
