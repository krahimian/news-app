/* global Statusbar, document */

var API = 'http://52.9.51.222:8080/api';
var today, now, channel, lead;

var parameters = {
    today: {
	path: '/trending',
	params: {
	    decay: 80000,
	    age: 36
	}
    },
    now: {
	path: '/trending',
	params: {
	    decay: 7200,
	    age: 12,
	    limit: 5
	}
    }
};

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
	    if (post.related.length) {
		var l = lead.appendChild(createElem('section'));
		Post(post, l);
		post.related.forEach(function(p) {
		    Post(p, l);
		});
	    } else {
		Post(post, parent);
	    }
	});
    }).error(function(err) {
	console.error(err);
	parent.innerHTML = '';
	if (window.location.pathname !== '/') window.location.href = '/';
    });
};

var init = function() {
    lead.innerHTML = '';
    load(parameters['today'].path, parameters['today'].params, today);
    load(parameters['now'].path, parameters['now'].params, now);
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
    today = document.getElementById('today');
    now = document.getElementById('now');
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

    init();
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
    else onDeviceReady();
}, false);
