var Try = {
	these: function() {
		var returnValue;
		for (var i = 0, length = arguments.length; i < length; i++) {
			var lambda = arguments[i];
			try {
				returnValue = lambda();
				break;
			} catch (e) { }
		}
		return returnValue;
	}
};
function replaceWith(id, content)
{
	var old = document.getElementById(id);
	if ('outerHTML' in document.documentElement)
	{
		old.outerHTML = content;
	}
	else
	{
		var range = document.createRange();
		range.selectNode(old);
		content = range.createContextualFragment(content);
		old.parentNode.replaceChild(content, old);
	}
}
function getCookie(name) {
	var c_start, c_end;
	if (document.cookie.length>0) {
		c_start = document.cookie.indexOf(name + '=');
		if (c_start != -1) {
			c_start += name.length + 1;
			c_end = document.cookie.indexOf(';', c_start);
			if (c_end==-1) {
				c_end = document.cookie.length;
			}
	    	return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return '';
}
var Ajax = {
	evalJSON: function(json) {
		return eval('(' + json + ')');
	},
	getTransport: function() {
		return Try.these(
			function() {return new XMLHttpRequest();},
			function() {return new ActiveXObject('Msxml2.XMLHTTP');},
			function() {return new ActiveXObject('Msxml3.XMLHTTP');},
			function() {return new ActiveXObject('Microsoft.XMLHTTP');}
		) || false;
	},
	request: function(url, options, postData) {
		var transport = this.getTransport();
		if (!transport) return;
		if (null !== options && 'function' == typeof(options))
		{
			options.onSuccess = options;
		}
		else if (!options.onSuccess) {
			return false;
		}
		var method = ((postData) ? "post" : ((options.method) ? options.method : "get"));
		transport.open(method, url, true);
		transport.setRequestHeader('X_REQUESTED_WITH', 'XMLHttpRequest');
		var frt = getCookie('f_rt');
		if (frt) {
			options.headers = {
				'REQUEST_TOKEN': frt
			};
		}
		if (options.headers) {
			for (header in options.headers) {
				transport.setRequestHeader('X_'+header, options.headers[header]);
			}
		}
		if (method == 'post') {
			transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		transport.onreadystatechange = function () {
			if (transport.readyState != 4) return;
			if (transport.status != 200 && transport.status != 304) {
				if (options.onFailure) {
					options.onFailure(transport.status, transport.responseText);
				}
				return;
			}
			options.onSuccess(transport.responseText);
		};
		if (transport.readyState == 4) return;
		transport.send(postData);
		return true;
	}
};
var FlattrButton = {
	click: function(href) {
		var options = {
			onSuccess: function(buffer) {
				replaceWith('flattr-1', buffer);
				FlattrButton.init();
			},
			onFailure: function(code, message) {
				if (code == 410 || code == 402) {
					window.location.reload(true);
				}
			}
		};
		if (!Ajax.request(href, options)) {
			window.location.reload(true);
		}
	},
	fakeReplace: function(span) {
		if ('flattr-flattred' == span.className) {
			span.className = 'flattr-subscribed';
		} else if ( 'flattr-link' == span.className ) {
			span.className = 'flattr-flattred';
		}
	},
	init: function() {
		var arr = document.getElementsByTagName('a');
		for(i=0; i < arr.length; i++) {
			if (/flattr/.test(arr[i].className)) {
				var href = arr[i].href;
				if (/flattr-ajax/.test(arr[i].className)) {
					arr[i].onclick = function() {
						var spans = this.getElementsByTagName('span');
						if (spans) {
							FlattrButton.fakeReplace(spans[0]);
						}
						FlattrButton.click(href);
						return false;
					};
				} else if ( /flattr-pop/.test(arr[i].className) ) {
					arr[i].onclick = function() {
						FlattrButton.popup(href, this);
						return false;
					};
				} else if ( /flattr-ed/.test(arr[i].className) ) {
					arr[i].onclick = function() {
						FlattrButton.compact(href);
						return false;
					};
				}
			}
		}
	},
	compact: function(href) {
		var re = new RegExp('^(http(?:s)?)\://api\.([^/]+)/(.+)', 'im');
		var matches = href.match(re);
		url = matches[1].toString() +'://'+ matches[2].toString() +'/'+ matches[3].toString();
		flattrPopupWin = window.open(url, 'Flattr', 'menubar=0,resizable=1,width=705,height=330,scrollbars=1,status=0,toolbar=0,location=0,directories=0');
		flattrPopupWin.focus();
	},
	popup: function(href, link) {
		var re = new RegExp('^(?:f|ht)tp(?:s)?\://api\.([^/]+)', 'im');
		var domain = window.location.href.match(re)[1].toString();
		var hrefArr = href.split('/');
		var tid = hrefArr[(hrefArr.length-1)];
		fixedHref = 'http://'+ domain +'/compact/thing/id/'+ tid;
		flattrPopupWin = window.open(fixedHref, 'Flattr', 'height=465,width=870');
		flattrPopupWin.focus();
	}
};
function redirect(url) {
	window.open(url, '_blank');
}
window.onload = function(){ FlattrButton.init(); };