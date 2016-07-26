function Post(data, parent) {
    var article = Elem.create({ tag: article });

    if (data.related.length) {
	var heading = Elem.create({ className: 'heading' });
	var heading_title = Elem.create({ tag: 'span' });
	var t = [];

	var pushUnique = function(item) {
	    var ignore = false;
	    for (var i=0; i<t.length; i++) {
		if (t[i].indexOf(item) > -1)
		    ignore = true;
	    }

	    if (!ignore) t.push(item);
	};

	if (data.related_concepts.length)
	    pushUnique(data.related_concepts[0].text);
	if (data.related_keywords.length)
	    pushUnique(data.related_keywords[0].text);
	if (data.related_entities.length)
	    pushUnique(data.related_entities[0].text);

	heading_title.innerHTML = t.join(', ');
	heading.appendChild(heading_title);
	article.appendChild(heading);
    }

    var title = Elem.create({ tag: 'a', className: 'title' });
    title.innerHTML = data.title;
    if (window.cordova) {
	title.onclick = function() {
	    cordova.InAppBrowser.open(data.content_url || data.url, '_system', 'location=no,enableViewportScale=yes');
	};
    } else {
	title.href = data.content_url || data.url;
    }
    article.appendChild(title);

    var meta = Elem.create({ className: 'meta' });
    article.appendChild(meta);

    var date = Elem.create({ tag: 'span' });
    date.innerHTML = fromNow(data.created_at);
    meta.appendChild(date);

    var on = Elem.create({ tag: 'span' });
    on.innerHTML = ' on ';
    meta.appendChild(on);

    var hostname = Elem.create({ tag: 'a', className: 'hostname' });

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

	var via = Elem.create({ tag: 'span' });
	via.innerHTML = ' via ';
	meta.appendChild(via);

	var comments = Elem.create({ tag: 'a' });

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
