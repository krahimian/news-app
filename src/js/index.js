/* global Statusbar, document */

var posts = document.getElementById('posts');
var topPosts = document.getElementById('top-posts');

function getHostname(url) {
    var l = document.createElement("a");
    l.href = url;
    return l.hostname.replace('www.','');
}

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
    if (StatusBar) {
	StatusBar.hide();
	StatusBar.overlaysWebView(false);
	StatusBar.backgroundColorByName('white');
    }

    document.addEventListener('resume', onResume, false);
    document.addEventListener('pause', onPause, false);
}

function createElem(type, c) {
    var ele = document.createElement(type);
    if (c) ele.className = c;
    return ele;
}

var o = {
    sec: 1000,
    min: 60 * 1000,
    hr: 60 * 1000 * 60,
    day: 24 * 60 * 1000 * 60,
    wk: 7 * 24 * 60 * 1000 * 60,
    mo: 30 * 24 * 60 * 1000 * 60,
    yr: 365 * 24 * 60 * 1000 * 60
};

function fromNow(nd) {
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

var Post = function(data, parent) {
    var article = document.createElement('article');

    var header = createElem('div', 'header');
    article.appendChild(header);

    var source = createElem('div', 'source');
    header.appendChild(source);

    var source_logo = createElem('div', 'avatar');
    if (data.source_logo_url) {
	if (data.source_logo_url.substring(0,2) === '//') data.source_logo_url = 'http:' + data.source_logo_url;
	source_logo.style['background-image'] = 'url(' + data.source_logo_url + ')';
    }
    source_logo.style['padding'] = '10px';
    source.appendChild(source_logo);

    var source_title = createElem('span', 'source-title');
    source_title.innerHTML = data.source_title;
    source.appendChild(source_title);

    var date = createElem('span', 'date');
    date.innerHTML = fromNow(data.created_at);
    source.appendChild(date);

    // var score = createElem('span');
    // var percentage = data.social_score_avg ?
    // 	    Math.round((data.social_score / data.social_score_avg) * 100 - 100) :
    // 	    Math.round((data.score / data.score_avg) * 100 - 100);
    // score.innerHTML =  (percentage > 0 ? '+' : '') + percentage + '%';
    // source.appendChild(score);

    var title = createElem('a', 'title');
    title.innerHTML = data.title;
    if (window.cordova) {
	title.onclick = function() {
	    cordova.InAppBrowser.open(data.content_url || data.url, '_system', 'location=no,enableViewportScale=yes');
	};
    } else {
	title.href = data.content_url || data.url;
    }
    article.appendChild(title);

    var meta = createElem('div', 'meta');
    article.appendChild(meta);

    var hostname = createElem('a', 'hostname');

    if (window.cordova) {
	hostname.onclick = function() {
	    cordova.InAppBrowser.open(data.content_url || data.url, '_system', 'location=no,enableViewportScale=yes');
	};
    } else {
	hostname.href = data.content_url || data.url;
    }

    hostname.innerHTML = getHostname(data.content_url || data.url);
    meta.appendChild(hostname);

    if (data.content_url && data.content_url !== data.url) {

	var via = createElem('span');
	via.innerHTML = ' via ';
	meta.appendChild(via);

	var comments = createElem('a');

	if (window.cordova) {
	    comments.onclick = function() {
		cordova.InAppBrowser.open(data.url, '_system', 'location=no,enableViewportScale=yes');
	    };
	} else {
	    comments.href = data.url;
	}

	comments.innerHTML = getHostname(data.url);
	meta.appendChild(comments);
    }

    parent.appendChild(article);
};

var apiEndpoint = 'http://52.8.251.150:8080/api/posts/';
var serialize = function(obj) {
    var str = [];
    for(var p in obj)
	if (obj.hasOwnProperty(p)) {
	    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	}
    return str.join("&");
};

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
    var url = apiEndpoint + path + '?' + serialize(params);
    window.Request.get(url).success(function(posts) {
	parent.innerHTML = '';
	posts.forEach(function(post) {
	    Post(post, parent);
	});
    }).error(console.error);
};

var init = function() {
    load('top', {
	offset: 0,
	limit: 3
    }, topPosts);

    load('hot', {
	offset: 0
    }, posts);
};

var reload = function(path) {
    load(path, {
	offset: 0
    }, posts);
};

init();

document.addEventListener('deviceready', onDeviceReady, false);
