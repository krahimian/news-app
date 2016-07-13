function Post(data, parent) {
    var article = document.createElement('article');

    if (data.related.length) {
	var heading = createElem('div', 'heading');
	var heading_title = createElem('span');
	var t = [];

	if (data.related_concepts.length)
	    t.push(data.related_concepts[0].text);
	if (data.related_keywords.length)
	    t.push(data.related_keywords[0].text);
	if (data.related_entities.length)
	    t.push(data.related_entities[0].text);

	var uniqueArray = t.filter(function(item, pos) {
	    return t.indexOf(item) == pos;
	});
	console.log(uniqueArray);
	heading_title.innerHTML = uniqueArray.join(', ');
	heading.appendChild(heading_title);
	article.appendChild(heading);
    }

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
