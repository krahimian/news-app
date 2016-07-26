/* global Statusbar, document */

var API = 'http://52.9.51.222:8080/api';
var main = document.querySelector('main');
var channel;

var parameters = {
    today: {
	heading: 'Today',
	element: function() {
	    return document.getElementById('today');
	},
	path: '/trending',
	params: {
	    excluded_ids: [],
	    decay: 80000,
	    age: 36
	}
    },
    now: {
	heading: 'Now',
	element: function() {
	    return document.getElementById('now');
	},
	path: '/trending',
	params: {
	    decay: 7200,
	    age: 12,
	    limit: 5
	}
    }
};

var getRate = function(visits) {
    if (visits.length < 2)
	return 1;

    var sum = 0;

    for (var i=1; i < visits.length; i++) {
	var diff = new Date(visits[i]).getTime() - new Date(visits[i-1]).getTime();
	sum += diff;
    }

    return sum / (visits.length - 1);
};

var calculateParams = function() {
    var last_load = window.localStorage.getItem('lastLoad');
    window.localStorage.setItem('lastLoad', new Date());

    var visits = JSON.parse(window.localStorage.getItem('visits'));
    if (!visits) visits = [];
    visits.push(new Date().toJSON());
    window.localStorage.setItem('visits', JSON.stringify(visits.slice(-10)));

    if (!last_load)
	return;

    var diff = new Date().getTime() - new Date(last_load).getTime();
    var hrs = Math.floor(diff / (1000 * 60 * 60));

    if (hrs >= 24 && hrs <= 96)
	parameters['today'].params.age = hrs;

    log('Last Visit (hrs): ' +  hrs);

    var rate = getRate(visits);
    log('Visit Rate (per day): ' + ((1000 * 60 * 60 * 24) / rate).toFixed(2));

    var decay = rate / 2000;
    if (decay < 7200)
	decay = 7200;

    if (decay > 86400)
	decay = 86400;

    log('Decay (hrs): ' + (decay / (60 * 60)));
    parameters['today'].params.decay = decay;
};

var loading = function(opts) {
    var elem = Elem.create({ className: 'md-loading indeterminate' });
    elem.innerHTML = document.getElementById('/loading.html').innerHTML;
    return elem;
};

var load = function(params, cb) {
    var ele = params.element();
    ele.appendChild(loading());

    var url = API + '/channels/' + channel + params.path;
    window.Request.get(url, params.params).success(cb).error(function(err) {
	console.error(err);
	ele.innerHTML = '';
	if (window.location.pathname !== '/') window.location.href = '/';
    });
};

var display = function(posts, params) {
    var categories = document.getElementById('categories');
    var heading = Elem.create({ className: 'heading' });
    var heading_title = Elem.create({ tag: 'span' });
    heading_title.innerHTML = params.heading;
    heading.appendChild(heading_title);
    main.insertBefore(heading, params.element());
    params.element().innerHTML = '';
    posts.forEach(function(p) {
	if (p.related.length) {
	    var c = categories.appendChild(Elem.create({ tag: 'section' }));
	    Post(p, c);
	    p.related.forEach(function(r) {
		Post(r, c);
	    });
	} else {
	    Post(p, params.element());
	}
    });
};

var reset = function() {
    main.innerHTML = '';
    Elem.create({
	tag: 'section',
	id: 'now',
	parent: main
    });
    Elem.create({
	tag: 'section',
	id: 'categories',
	parent: main
    });
    Elem.create({
	tag: 'section',
	id: 'today',
	parent: main
    });
    document.getElementById('log').innerHTML = '';
    parameters['today'].params.excluded_ids = [];
};

var init = function() {
    reset();
    calculateParams();
    load(parameters['now'], function(posts) {
	display(posts, parameters['now']);

	posts.forEach(function(post) {
	    parameters['today'].params.excluded_ids.push(post.id);
	    post.related.forEach(function(p) {
		parameters['today'].params.excluded_ids.push(post.id);
	    });
	});

	load(parameters['today'], function(ps) {
	    display(ps, parameters['today']);
	});
    });
};

function onPause() {
    window.localStorage.setItem('lastPause', new Date());
}

function onResume() {
    var lastPause = window.localStorage.getItem('lastPause');
    var diff = new Date().getTime() - new Date(lastPause).getTime();

    // 15 mins
    if (diff > (1000 * 60 * 15)) {
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

    init();
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
    else onDeviceReady();
}, false);
