function Post(data, parent) {
    var article = document.createElement('article');

    // var header = createElem('div', 'header');
    // article.appendChild(header);

    // var source = createElem('div', 'source');
    // header.appendChild(source);

    // var source_logo = createElem('div', 'avatar');
    // if (data.source_logo_url) {
    // 	if (data.source_logo_url.substring(0,2) === '//') data.source_logo_url = 'http:' + data.source_logo_url;
    // 	source_logo.style['background-image'] = 'url(' + data.source_logo_url + ')';
    // }
    // source_logo.style['padding'] = '10px';
    // source.appendChild(source_logo);

    // var source_title = createElem('span', 'source-title');
    // source_title.innerHTML = data.source_title;
    // source.appendChild(source_title);

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

    var date = createElem('span');
    date.innerHTML = fromNow(data.created_at);
    meta.appendChild(date);

    var on = createElem('span');
    on.innerHTML = ' on ';
    meta.appendChild(on);

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

    return article;
}
