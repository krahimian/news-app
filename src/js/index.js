/* global Statusbar, document */

var API = 'http://52.9.51.222:8080/api';
var posts = document.getElementById('posts');
var lead = document.getElementById('lead');
var channel;

var loading = function(opts) {
    var elem = createElem('div', 'md-loading indeterminate');
    elem.innerHTML = document.getElementById('/loading.html').innerHTML;
    return elem;
};

var load = function(path, params, parent) {
    parent.innerHTML = '';
    parent.appendChild(loading());
    posts.setAttribute('data-offset', params.offset || 0);
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
	    channel = e.target.value;
	    init();
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

    load('/posts', {
	offset: 0
    }, posts);
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
