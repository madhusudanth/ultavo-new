/*
 json2.js
 2012-10-08

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

n2.extend(window.nextend, {
    fontManager: null,
    styleManager: null,
    notificationCenter: null,
    animationManager: null,
    browse: null,
    askToSave: true,
    cancel: function (url) {
        nextend.askToSave = false;
        window.location.href = url;
        return false;
    }
});

function n2Context() {
    this.window = ['main'];
    this.mouseDownArea = false;
    this.timeout = null;
}

n2Context.prototype.addWindow = function (name) {
    this.window.push(name);
}

n2Context.prototype.removeWindow = function () {
    this.window.pop();
}

n2Context.prototype.getCurrentWindow = function () {
    return this.window[this.window.length - 1];
}

n2Context.prototype.setMouseDownArea = function (area, e) {
    this.mouseDownArea = area;
    if (this.timeout) {
        clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(n2.proxy(function () {
        this.timeout = null;
        this.mouseDownArea = false;
    }, this), 50);
}

window.nextend.context = new n2Context();

window.n2_ = function (text) {
    if (typeof nextend.localization[text] !== 'undefined') {
        return nextend.localization[text];
    }
    return text;
};

window.n2_printf = function (text) {
    var args = arguments;
    var index = 1;
    return text.replace(/%s/g, function () {
        return args[index++];
    });
};

/**
 * Help us to track when the user loaded the page
 */
window.nextendtime = n2.now();

/*
 * Moves an element with the page scroll to be in a special position
 */
(function ($) {

    var elems = [],
        sidename = {
            left: 'left',
            right: 'right'
        };

    function rtl() {
        sidename = {
            left: 'right',
            right: 'left'
        };
    }

    function ltr() {
        sidename = {
            left: 'left',
            right: 'right'
        };
    }

    function getOffset($el, side) {
        var offset = 0;
        if (side == sidename.right) {
            offset = ($(window).width() - ($el.offset().left + $el.outerWidth()));
        } else {
            offset = $el.offset().left;
        }
        if (offset < 0)
            return 0;
        return offset;
    }

    $('html').on('changedir', function (e, dir) {
        for (var i = 0; i < elems.length; i++) {
            elems[i][0].css(sidename[elems[i][2]], 'auto');
        }
        if (dir === 'rtl') {
            rtl();
        } else {
            ltr();
        }
        $(document).trigger('scroll');
    });

    var scrollAdjustment = 0;

    nextend.ready(function () {
        var topBarHeight = $('#wpadminbar, .navbar-fixed-top').height();
        if (topBarHeight) {
            scrollAdjustment += topBarHeight;
        }
        $(document).trigger('scroll');
    });

    $(document).on('scroll', function () {
        var scrolltop = $(document).scrollTop() + scrollAdjustment;
        for (var i = 0; i < elems.length; i++) {
            if (elems[i][1] > scrolltop) {
                elems[i][0].removeClass('n2-static');
            } else {
                elems[i][0].addClass('n2-static');
                elems[i][0].css(sidename[elems[i][2]], elems[i][3]);
            }
        }
    });

    $(window).on('resize', function () {
        for (var i = 0; i < elems.length; i++) {
            elems[i][1] = elems[i][0].parent().offset().top;
            elems[i][3] = getOffset(elems[i][0].parent(), elems[i][2]);
        }
        $(document).trigger('scroll');
    });

    $.fn.staticonscroll = function (side) {
        this.each(function () {
            var $el = $(this);
            elems.push([$el, $el.parent().offset().top, side, getOffset($el.parent(), side)]);
        });
        $(document).trigger('scroll');
    };
})(n2);

(function ($) {

    var NextendAjaxHelper = {
            query: {}
        },
        loader = null;

    NextendAjaxHelper.addAjaxLoader = function () {
        loader = $('<div class="n2-loader-overlay"><div class="n2-loader"></div></div>')
            .appendTo('body');
    };

    NextendAjaxHelper.addAjaxArray = function (parts) {
        for (var k in parts) {
            NextendAjaxHelper.query[k] = parts[k];
        }
    };

    NextendAjaxHelper.makeAjaxQuery = function (queryArray, isAjax) {
        if (isAjax) {
            queryArray['mode'] = 'ajax';
            queryArray['nextendajax'] = '1';
        }
        for (var k in NextendAjaxHelper.query) {
            queryArray[k] = NextendAjaxHelper.query[k];
        }
        return N2QueryString.stringify(queryArray);
    };

    NextendAjaxHelper.makeAjaxUrl = function (url, queries) {
        var urlParts = url.split("?");
        if (urlParts.length < 2) {
            urlParts[1] = '';
        }
        var parsed = N2QueryString.parse(urlParts[1]);
        if (typeof queries != 'undefined') {
            for (var k in queries) {
                parsed[k] = queries[k];
            }
        }
        return urlParts[0] + '?' + NextendAjaxHelper.makeAjaxQuery(parsed, true);
    };

    NextendAjaxHelper.makeFallbackUrl = function (url, queries) {
        var urlParts = url.split("?");
        if (urlParts.length < 2) {
            urlParts[1] = '';
        }
        var parsed = N2QueryString.parse(urlParts[1]);
        if (typeof queries != 'undefined') {
            for (var k in queries) {
                parsed[k] = queries[k];
            }
        }
        return urlParts[0] + '?' + NextendAjaxHelper.makeAjaxQuery(parsed, false);
    };

    NextendAjaxHelper.ajax = function (ajax) {
        NextendAjaxHelper.startLoading();
        return $.ajax(ajax).always(function (response, status) {
            NextendAjaxHelper.stopLoading();
            try {

                if (status != 'success') {
                    response = JSON.parse(response.responseText);
                } else if (typeof response === 'string') {
                    response = JSON.parse(response);
                }
                if (typeof response.redirect != 'undefined') {
                    NextendAjaxHelper.startLoading();
                    window.location.href = response.redirect;
                    return;
                }

                NextendAjaxHelper.notification(response);
            } catch (e) {
                console.log(e);
            }
        });
    };

    NextendAjaxHelper.notification = function (response) {

        if (typeof response.notification !== 'undefined' && response.notification) {
            for (var k in response.notification) {
                for (var i = 0; i < response.notification[k].length; i++) {
                    nextend.notificationCenter[k](response.notification[k][i][0], response.notification[k][i][1]);
                }
            }
        }
    };

    NextendAjaxHelper.getJSON = function (ajax) {
        NextendAjaxHelper.startLoading();
        return $.getJSON(ajax).always(function () {
            NextendAjaxHelper.stopLoading();
        });
    };

    NextendAjaxHelper.startLoading = function () {
        loader.addClass('n2-active');
    };

    NextendAjaxHelper.stopLoading = function () {
        loader.removeClass('n2-active');
    };

    window.NextendAjaxHelper = NextendAjaxHelper;
    nextend.ready(function () {
        NextendAjaxHelper.addAjaxLoader();
    });
})(n2);

(function ($, scope) {

    function NextendHeadingPane($node, headings, contents, identifier) {
        this.$node = $node.data('pane', this);
        this.headings = headings;
        this.contents = contents;
        this.tabNames = [];
        this.headings.each($.proxy(function (i, el) {
            this.tabNames.push($(el).data('tab'));
        }, this));
        this.identifier = identifier;

        this._active = headings.index(headings.filter('.n2-active'));

        for (var i = 0; i < headings.length; i++) {
            headings.eq(i).on('click', $.proxy(this.switchToPane, this, i));
        }

        if (identifier) {
            var saved = $.jStorage.get(this.identifier + "-pane", -1);
            if (saved != -1) {
                this.switchToPane(saved);
                return;
            }
        }
        this.hideAndShow();
    };


    NextendHeadingPane.prototype.switchToPane = function (i, e) {
        if (e) {
            e.preventDefault();
        }
        this.headings.eq(this._active).removeClass('n2-active');
        this.headings.eq(i).addClass('n2-active');
        this._active = i;

        this.hideAndShow();
        this.store(this._active);

        this.$node.triggerHandler('changetab');
    };

    NextendHeadingPane.prototype.hideAndShow = function () {
        this.contents[this._active].css('display', 'block').trigger('activate');
        for (var i = 0; i < this.contents.length; i++) {
            if (i != this._active) {
                this.contents[i].css('display', 'none');
            }
        }
    };

    NextendHeadingPane.prototype.store = function (i) {
        if (this.identifier) {
            $.jStorage.set(this.identifier + "-pane", i);
        }
    };

    NextendHeadingPane.prototype.showTabs = function (tabNames) {
        var activatedFirst = false;
        for (var i = 0; i < this.tabNames.length; i++) {
            if ($.inArray(this.tabNames[i], tabNames) != '-1') {
                this.headings.eq(i).css('display', '');
                this.contents[i].css('display', '');
                if (activatedFirst === false) {
                    activatedFirst = i;
                }
            } else {
                this.headings.eq(i).css('display', 'none');
                this.contents[i].css('display', 'none');
            }
        }
        this.switchToPane(activatedFirst);
    };

    scope.NextendHeadingPane = NextendHeadingPane;


    function NextendHeadingScrollToPane(headings, contents, identifier) {
        this.headings = headings;
        this.contents = contents;
        this.identifier = identifier;

        for (var i = 0; i < headings.length; i++) {
            headings.eq(i).on('click', $.proxy(this.scrollToPane, this, i));
        }
    }

    NextendHeadingScrollToPane.prototype.scrollToPane = function (i, e) {
        if (e) {
            e.preventDefault();
        }
        $('html, body').animate({
            scrollTop: this.contents[i].offset().top - $('.n2-main-top-bar').height() - $('#wpadminbar, .navbar-fixed-top').height() - 10
        }, 1000);
    };

    scope.NextendHeadingScrollToPane = NextendHeadingScrollToPane;

})(n2, window);

(function ($, scope) {
    var FiLo = [],
        doc = $(document),
        isListening = false;
    scope.NextendEsc = {
        _listen: function () {
            if (!isListening) {
                doc.on('keydown.n2-esc', function (e) {
                    if ((e.keyCode == 27 || e.keyCode == 8)) {
                        if (!$(e.target).is("input, textarea")) {
                            e.preventDefault();
                            var ret = FiLo[FiLo.length - 1]();
                            if (ret) {
                                scope.NextendEsc.pop();
                            }
                        } else if (e.keyCode == 27) {
                            e.preventDefault();
                            $(e.target).blur();
                        }
                    }
                });
                isListening = true;
            }
        },
        _stopListen: function () {
            doc.off('keydown.n2-esc');
            isListening = false;
        },
        add: function (callback) {
            FiLo.push(callback);
            scope.NextendEsc._listen();
        },
        pop: function () {
            FiLo.pop();
            if (FiLo.length === 0) {
                scope.NextendEsc._stopListen();
            }
        }
    };
})(n2, window);


(function ($, scope) {
    $.fn.n2opener = function () {
        return this.each(function () {
            var opener = $(this).on("click", function (e) {
                opener.toggleClass("n2-active");
            });

            opener.siblings('span').on("click", function (e) {
                opener.toggleClass("n2-active");
            });

            opener.parent().on("mouseleave", function () {
                opener.removeClass("n2-active");
            })
            opener.find(".n2-button-menu").on("click", function (e) {
                e.stopPropagation();
                opener.removeClass("n2-active");
            });
        });
    };
})(n2, window);

if (typeof jQuery !== 'undefined') {
    jQuery(document).on('wp-collapse-menu', function () {
        n2(window).trigger('resize');
    });
}


nextend.deepDiff = function () {
    return {
        map: function (obj1, obj2) {
            if (this.isValue(obj1)) {
                if ('undefined' != typeof(obj1) && obj1 != obj2) {
                    return obj1;
                } else {
                    return undefined;
                }
            }

            for (var key in obj2) {
                if (this.isFunction(obj2[key])) {
                    continue;
                }

                obj1[key] = this.map(obj1[key], obj2[key]);
                if (obj1[key] === undefined || (n2.isPlainObject(obj1[key]) && n2.isEmptyObject(obj1[key])) || (this.isArray(obj1[key]) && obj1[key].length == 0)) {
                    delete obj1[key];
                }
            }


            return obj1;

        },

        isFunction: function (obj) {
            return {}.toString.apply(obj) === '[object Function]';
        },
        isArray: function (obj) {
            return {}.toString.apply(obj) === '[object Array]';
        },
        isObject: function (obj) {
            return {}.toString.apply(obj) === '[object Object]';
        },
        isValue: function (obj) {
            return !this.isObject(obj) && !this.isArray(obj);
        }
    }
}();


(function ($, scope) {
    function tooltip() {
        this.$element = $('<div class="n2 n2-tooltip n2-radius-m"></div>');
        this.timeout = null;
        this.$tipFor = null;


        $(window).ready($.proxy(this.ready, this));

    }

    tooltip.prototype.ready = function () {
        this.$element.appendTo('body');
        this.add($('body'));
    }

    tooltip.prototype.add = function ($parent) {
        $parent.find('[data-n2tip]').off('.n2hastip').on({
            'mouseenter.n2hastip': $.proxy(this.onEnter, this)
        });
    }

    tooltip.prototype.onEnter = function (e) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.$tipFor = $(e.currentTarget).on({
            'mousemove.n2tip': $.proxy(this.onMove, this),
            'mouseleave.n2tip': $.proxy(this.onLeave, this)
        });
        this.onMove(e);
        this.timeout = setTimeout($.proxy(function () {
            var v = this.$tipFor.data('n2tipv'),
                h = this.$tipFor.data('n2tiph');
            if (typeof v === 'undefined') {
                v = 10;
            }
            if (typeof h === 'undefined') {
                h = 10;
            }
            this.$element.css({
                margin: v + 'px ' + h + 'px'
            }).html(this.$tipFor.data('n2tip')).addClass('n2-active');
        }, this), 500);
    }

    tooltip.prototype.onMove = function (e) {
        this.$element.css({
            left: e.pageX,
            top: e.pageY
        });
    }

    tooltip.prototype.onLeave = function (e) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.$tipFor.off('.n2tip');
        this.$tipFor = null;
        this.$element.removeClass('n2-active').css('margin', '');
    }

    function tooltipMouse() {
        this.isVisible = false;
        this.$body = $('body');
        this.$element = $('<div class="n2 n2-tooltip n2-radius-m"></div>').appendTo(this.$body);
    }

    tooltipMouse.prototype.show = function (text, e) {
        if (this.isVisible) {
            this.$element.html(text);
        } else {
            this.isVisible = true;
            this.$body.on('mousemove.tooltipMouse', $.proxy(this.mouseMove, this));
            this.mouseMove(e);
            this.$element.html(text).addClass('n2-active');
        }
    }

    tooltipMouse.prototype.mouseMove = function (e) {
        this.$element.css({
            left: e.pageX + 10,
            top: e.pageY + 10
        });
    }

    tooltipMouse.prototype.hide = function () {
        this.$body.off('mousemove.tooltipMouse');
        this.$element.removeClass('n2-active').html('');
        this.isVisible = false;
    }

    nextend.tooltip = new tooltip();

    $(window).ready(function () {
        nextend.tooltipMouse = new tooltipMouse();
    });
})(n2, window);
/**
 * Convert 8 char hexadecimal color into RGBA color
 * @param 8 characters of hexadecimal color value. Last two character stands for alpha 0-255
 * @returns RGBA representation string
 */

window.N2Color = {
    hex2rgba: function (str) {
        var num = parseInt(str, 16); // Convert to a number
        return [num >> 24 & 255, num >> 16 & 255, num >> 8 & 255, (num & 255) / 255];
    },
    hex2rgbaCSS: function (str) {
        return 'RGBA(' + N2Color.hex2rgba(str).join(',') + ')';
    },
    hexdec: function (hex_string) {
        hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
        return parseInt(hex_string, 16);
    },

    hex2alpha: function (str) {
        var num = parseInt(str, 16); // Convert to a number
        return ((num & 255) / 255).toFixed(3);
    },
    colorizeSVG: function (str, color) {
        var parts = str.split('base64,');
        if (parts.length == 1) {
            return str;
        }
        parts[1] = Base64.encode(Base64.decode(parts[1]).replace('fill="#FFF"', 'fill="#' + color.substr(0, 6) + '"').replace('opacity="1"', 'opacity="' + N2Color.hex2alpha(color) + '"'));
        return parts.join('base64,');
    }
};
/*!
 query-string
 Parse and stringify URL query strings
 https://github.com/sindresorhus/query-string
 by Sindre Sorhus
 MIT License
 */
(function () {
    'use strict';
    var module, define;
    var N2QueryString = {};

    N2QueryString.parse = function (str) {
        if (typeof str !== 'string') {
            return {};
        }

        str = str.trim().replace(/^(\?|#)/, '');

        if (!str) {
            return {};
        }

        return str.trim().split('&').reduce(function (ret, param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            var key = parts[0];
            var val = parts[1];

            key = decodeURIComponent(key);
            // missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            val = val === undefined ? null : decodeURIComponent(val);

            if (!ret.hasOwnProperty(key)) {
                ret[key] = val;
            } else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            } else {
                ret[key] = [ret[key], val];
            }

            return ret;
        }, {});
    };

    N2QueryString.stringify = function (obj) {
        return obj ? Object.keys(obj).map(function (key) {
            var val = obj[key];

            if (Array.isArray(val)) {
                return val.map(function (val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&') : '';
    };

    window.N2QueryString = N2QueryString;
})();

;
!function (g) {
    var $0 = [], // result
        $1 = [], // tail
        $2 = [], // blocks
        $3 = [], // s1
        $4 = ("0123456789abcdef").split(""), // hex
        $5 = [], // s2
        $6 = [], // state
        $7 = false, // is state created
        $8 = 0, // len_cache
        $9 = 0, // len
        BUF = [];

    // use Int32Array if defined
    if (g.Int32Array) {
        $1 = new Int32Array(16);
        $2 = new Int32Array(16);
        $3 = new Int32Array(4);
        $5 = new Int32Array(4);
        $6 = new Int32Array(4);
        BUF = new Int32Array(4);
    } else {
        var i;
        for (i = 0; i < 16; i++) $1[i] = $2[i] = 0;
        for (i = 0; i < 4; i++) $3[i] = $5[i] = $6[i] = BUF[i] = 0;
    }

    // fill s1
    $3[0] = 128;
    $3[1] = 32768;
    $3[2] = 8388608;
    $3[3] = -2147483648;

    // fill s2
    $5[0] = 0;
    $5[1] = 8;
    $5[2] = 16;
    $5[3] = 24;

    function encode(s) {
        var utf = enc = "",
            start = end = 0;

        for (var i = 0, j = s.length; i < j; i++) {
            var c = s.charCodeAt(i);

            if (c < 128) {
                end++;
                continue;
            } else if (c > 127 && c < 2048)
                enc = String.fromCharCode((c >> 6) | 192, (c & 63) | 128);
            else
                enc = String.fromCharCode((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);

            if (end > start)
                utf += s.slice(start, end);

            utf += enc;
            start = end = i + 1;
        }

        if (end > start)
            utf += s.slice(start, j);

        return utf;
    }

    function md5_update(s) {
        var i, I;

        s += "";
        $7 = false;
        $8 = $9 = s.length;

        if ($9 > 63) {
            getBlocks(s.substring(0, 64));
            md5cycle($2);
            $7 = true;

            for (i = 128; i <= $9; i += 64) {
                getBlocks(s.substring(i - 64, i));
                md5cycleAdd($2);
            }

            s = s.substring(i - 64);
            $9 = s.length;
        }

        $1[0] = 0;
        $1[1] = 0;
        $1[2] = 0;
        $1[3] = 0;
        $1[4] = 0;
        $1[5] = 0;
        $1[6] = 0;
        $1[7] = 0;
        $1[8] = 0;
        $1[9] = 0;
        $1[10] = 0;
        $1[11] = 0;
        $1[12] = 0;
        $1[13] = 0;
        $1[14] = 0;
        $1[15] = 0;

        for (i = 0; i < $9; i++) {
            I = i % 4;
            if (I === 0)
                $1[i >> 2] = s.charCodeAt(i);
            else
                $1[i >> 2] |= s.charCodeAt(i) << $5[I];
        }
        $1[i >> 2] |= $3[i % 4];

        if (i > 55) {
            if ($7) md5cycleAdd($1);
            else {
                md5cycle($1);
                $7 = true;
            }

            return md5cycleAdd([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, $8 << 3, 0]);
        }

        $1[14] = $8 << 3;

        if ($7) md5cycleAdd($1);
        else md5cycle($1);
    }

    function getBlocks(s) {
        for (var i = 16; i--;) {
            var I = i << 2;
            $2[i] = s.charCodeAt(I) + (s.charCodeAt(I + 1) << 8) + (s.charCodeAt(I + 2) << 16) + (s.charCodeAt(I + 3) << 24);
        }
    }

    function md5(data, ascii, arrayOutput) {
        md5_update(ascii ? data : encode(data));

        var tmp = $6[0];
        $0[1] = $4[tmp & 15];
        $0[0] = $4[(tmp >>= 4) & 15];
        $0[3] = $4[(tmp >>= 4) & 15];
        $0[2] = $4[(tmp >>= 4) & 15];
        $0[5] = $4[(tmp >>= 4) & 15];
        $0[4] = $4[(tmp >>= 4) & 15];
        $0[7] = $4[(tmp >>= 4) & 15];
        $0[6] = $4[(tmp >>= 4) & 15];

        tmp = $6[1];
        $0[9] = $4[tmp & 15];
        $0[8] = $4[(tmp >>= 4) & 15];
        $0[11] = $4[(tmp >>= 4) & 15];
        $0[10] = $4[(tmp >>= 4) & 15];
        $0[13] = $4[(tmp >>= 4) & 15];
        $0[12] = $4[(tmp >>= 4) & 15];
        $0[15] = $4[(tmp >>= 4) & 15];
        $0[14] = $4[(tmp >>= 4) & 15];

        tmp = $6[2];
        $0[17] = $4[tmp & 15];
        $0[16] = $4[(tmp >>= 4) & 15];
        $0[19] = $4[(tmp >>= 4) & 15];
        $0[18] = $4[(tmp >>= 4) & 15];
        $0[21] = $4[(tmp >>= 4) & 15];
        $0[20] = $4[(tmp >>= 4) & 15];
        $0[23] = $4[(tmp >>= 4) & 15];
        $0[22] = $4[(tmp >>= 4) & 15];

        tmp = $6[3];
        $0[25] = $4[tmp & 15];
        $0[24] = $4[(tmp >>= 4) & 15];
        $0[27] = $4[(tmp >>= 4) & 15];
        $0[26] = $4[(tmp >>= 4) & 15];
        $0[29] = $4[(tmp >>= 4) & 15];
        $0[28] = $4[(tmp >>= 4) & 15];
        $0[31] = $4[(tmp >>= 4) & 15];
        $0[30] = $4[(tmp >>= 4) & 15];

        return arrayOutput ? $0 : $0.join("");
    }

    function R(q, a, b, x, s1, s2, t) {
        a += q + x + t;
        return ((a << s1 | a >>> s2) + b) << 0;
    }

    function md5cycle(k) {
        md5_rounds(0, 0, 0, 0, k);

        $6[0] = (BUF[0] + 1732584193) << 0;
        $6[1] = (BUF[1] - 271733879) << 0;
        $6[2] = (BUF[2] - 1732584194) << 0;
        $6[3] = (BUF[3] + 271733878) << 0;
    }

    function md5cycleAdd(k) {
        md5_rounds($6[0], $6[1], $6[2], $6[3], k);

        $6[0] = (BUF[0] + $6[0]) << 0;
        $6[1] = (BUF[1] + $6[1]) << 0;
        $6[2] = (BUF[2] + $6[2]) << 0;
        $6[3] = (BUF[3] + $6[3]) << 0;
    }

    function md5_rounds(a, b, c, d, k) {
        var bc, da;

        if ($7) {
            a = R(((c ^ d) & b) ^ d, a, b, k[0], 7, 25, -680876936);
            d = R(((b ^ c) & a) ^ c, d, a, k[1], 12, 20, -389564586);
            c = R(((a ^ b) & d) ^ b, c, d, k[2], 17, 15, 606105819);
            b = R(((d ^ a) & c) ^ a, b, c, k[3], 22, 10, -1044525330);
        } else {
            a = k[0] - 680876937;
            a = ((a << 7 | a >>> 25) - 271733879) << 0;
            d = k[1] - 117830708 + ((2004318071 & a) ^ -1732584194);
            d = ((d << 12 | d >>> 20) + a) << 0;
            c = k[2] - 1126478375 + (((a ^ -271733879) & d) ^ -271733879);
            c = ((c << 17 | c >>> 15) + d) << 0;
            b = k[3] - 1316259209 + (((d ^ a) & c) ^ a);
            b = ((b << 22 | b >>> 10) + c) << 0;
        }

        a = R(((c ^ d) & b) ^ d, a, b, k[4], 7, 25, -176418897);
        d = R(((b ^ c) & a) ^ c, d, a, k[5], 12, 20, 1200080426);
        c = R(((a ^ b) & d) ^ b, c, d, k[6], 17, 15, -1473231341);
        b = R(((d ^ a) & c) ^ a, b, c, k[7], 22, 10, -45705983);
        a = R(((c ^ d) & b) ^ d, a, b, k[8], 7, 25, 1770035416);
        d = R(((b ^ c) & a) ^ c, d, a, k[9], 12, 20, -1958414417);
        c = R(((a ^ b) & d) ^ b, c, d, k[10], 17, 15, -42063);
        b = R(((d ^ a) & c) ^ a, b, c, k[11], 22, 10, -1990404162);
        a = R(((c ^ d) & b) ^ d, a, b, k[12], 7, 25, 1804603682);
        d = R(((b ^ c) & a) ^ c, d, a, k[13], 12, 20, -40341101);
        c = R(((a ^ b) & d) ^ b, c, d, k[14], 17, 15, -1502002290);
        b = R(((d ^ a) & c) ^ a, b, c, k[15], 22, 10, 1236535329);

        a = R(((b ^ c) & d) ^ c, a, b, k[1], 5, 27, -165796510);
        d = R(((a ^ b) & c) ^ b, d, a, k[6], 9, 23, -1069501632);
        c = R(((d ^ a) & b) ^ a, c, d, k[11], 14, 18, 643717713);
        b = R(((c ^ d) & a) ^ d, b, c, k[0], 20, 12, -373897302);
        a = R(((b ^ c) & d) ^ c, a, b, k[5], 5, 27, -701558691);
        d = R(((a ^ b) & c) ^ b, d, a, k[10], 9, 23, 38016083);
        c = R(((d ^ a) & b) ^ a, c, d, k[15], 14, 18, -660478335);
        b = R(((c ^ d) & a) ^ d, b, c, k[4], 20, 12, -405537848);
        a = R(((b ^ c) & d) ^ c, a, b, k[9], 5, 27, 568446438);
        d = R(((a ^ b) & c) ^ b, d, a, k[14], 9, 23, -1019803690);
        c = R(((d ^ a) & b) ^ a, c, d, k[3], 14, 18, -187363961);
        b = R(((c ^ d) & a) ^ d, b, c, k[8], 20, 12, 1163531501);
        a = R(((b ^ c) & d) ^ c, a, b, k[13], 5, 27, -1444681467);
        d = R(((a ^ b) & c) ^ b, d, a, k[2], 9, 23, -51403784);
        c = R(((d ^ a) & b) ^ a, c, d, k[7], 14, 18, 1735328473);
        b = R(((c ^ d) & a) ^ d, b, c, k[12], 20, 12, -1926607734);

        bc = b ^ c;
        a = R(bc ^ d, a, b, k[5], 4, 28, -378558);
        d = R(bc ^ a, d, a, k[8], 11, 21, -2022574463);
        da = d ^ a;
        c = R(da ^ b, c, d, k[11], 16, 16, 1839030562);
        b = R(da ^ c, b, c, k[14], 23, 9, -35309556);
        bc = b ^ c;
        a = R(bc ^ d, a, b, k[1], 4, 28, -1530992060);
        d = R(bc ^ a, d, a, k[4], 11, 21, 1272893353);
        da = d ^ a;
        c = R(da ^ b, c, d, k[7], 16, 16, -155497632);
        b = R(da ^ c, b, c, k[10], 23, 9, -1094730640);
        bc = b ^ c;
        a = R(bc ^ d, a, b, k[13], 4, 28, 681279174);
        d = R(bc ^ a, d, a, k[0], 11, 21, -358537222);
        da = d ^ a;
        c = R(da ^ b, c, d, k[3], 16, 16, -722521979);
        b = R(da ^ c, b, c, k[6], 23, 9, 76029189);
        bc = b ^ c;
        a = R(bc ^ d, a, b, k[9], 4, 28, -640364487);
        d = R(bc ^ a, d, a, k[12], 11, 21, -421815835);
        da = d ^ a;
        c = R(da ^ b, c, d, k[15], 16, 16, 530742520);
        b = R(da ^ c, b, c, k[2], 23, 9, -995338651);

        a = R(c ^ (b | ~d), a, b, k[0], 6, 26, -198630844);
        d = R(b ^ (a | ~c), d, a, k[7], 10, 22, 1126891415);
        c = R(a ^ (d | ~b), c, d, k[14], 15, 17, -1416354905);
        b = R(d ^ (c | ~a), b, c, k[5], 21, 11, -57434055);
        a = R(c ^ (b | ~d), a, b, k[12], 6, 26, 1700485571);
        d = R(b ^ (a | ~c), d, a, k[3], 10, 22, -1894986606);
        c = R(a ^ (d | ~b), c, d, k[10], 15, 17, -1051523);
        b = R(d ^ (c | ~a), b, c, k[1], 21, 11, -2054922799);
        a = R(c ^ (b | ~d), a, b, k[8], 6, 26, 1873313359);
        d = R(b ^ (a | ~c), d, a, k[15], 10, 22, -30611744);
        c = R(a ^ (d | ~b), c, d, k[6], 15, 17, -1560198380);
        b = R(d ^ (c | ~a), b, c, k[13], 21, 11, 1309151649);
        a = R(c ^ (b | ~d), a, b, k[4], 6, 26, -145523070);
        d = R(b ^ (a | ~c), d, a, k[11], 10, 22, -1120210379);
        c = R(a ^ (d | ~b), c, d, k[2], 15, 17, 718787259);
        b = R(d ^ (c | ~a), b, c, k[9], 21, 11, -343485551);

        BUF[0] = a;
        BUF[1] = b;
        BUF[2] = c;
        BUF[3] = d;
    }

    g.md5 = g.md5 || md5;
}(window);

(function ($, scope) {

    function NextendCSS() {
        this.style = '';
    };

    NextendCSS.prototype.add = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    };

    NextendCSS.prototype.deleteRule = function (selectorText) {
        var selectorText1 = selectorText.toLowerCase();
        var selectorText2 = selectorText1.replace('.', '\\.');
        for (var j = document.styleSheets.length - 1; j >= 0; j--) {
            var rules = this._getRulesArray(j);
            for (var i = 0; rules && i < rules.length; i++) {
                if (rules[i].selectorText) {
                    var lo = rules[i].selectorText.toLowerCase();
                    if ((lo == selectorText1) || (lo == selectorText2)) {
                        if (document.styleSheets[j].cssRules) {
                            document.styleSheets[j].deleteRule(i);
                        } else {
                            document.styleSheets[j].removeRule(i);
                        }
                    }
                }
            }
        }
        return (null);
    };

    NextendCSS.prototype._getRulesArray = function (i) {
        var crossrule = null;
        try {
            if (document.styleSheets[i].cssRules)
                crossrule = document.styleSheets[i].cssRules;
            else if (document.styleSheets[i].rules)
                crossrule = document.styleSheets[i].rules;
        } catch (e) {
        }
        return (crossrule);
    };

    window.nextend.css = new NextendCSS();

})(n2, window);

(function ($, scope, undefined) {

    function NextendImageHelper(parameters, openLightbox, openMultipleLightbox, openFoldersLightbox) {
        NextendImageHelper.prototype.openLightbox = openLightbox;
        NextendImageHelper.prototype.openMultipleLightbox = openMultipleLightbox;
        NextendImageHelper.prototype.openFoldersLightbox = openFoldersLightbox;
        nextend.imageHelper = this;
        this.parameters = $.extend({
            siteKeywords: [],
            imageUrls: [],
            wordpressUrl: '',
            placeholderImage: '',
            placeholderRepeatedImage: '',
            protocolRelative: 1
        }, parameters);
    }

    NextendImageHelper.prototype.protocolRelative = function (image) {
        if (this.parameters.protocolRelative) {
            return image.replace(/^http(s)?:\/\//, '//');
        }
        return image;
    }


    NextendImageHelper.prototype.make = function (image) {
        return this.dynamic(image);
    };

    NextendImageHelper.prototype.dynamic = function (image) {
        var imageUrls = this.parameters.imageUrls,
            keywords = this.parameters.siteKeywords,
            _image = this.protocolRelative(image);
        for (var i = 0; i < keywords.length; i++) {
            if (_image.indexOf(imageUrls[i]) === 0) {
                image = keywords[i] + _image.slice(imageUrls[i].length);
                break;
            }
        }
        return image;
    };

    NextendImageHelper.prototype.fixed = function (image) {
        var imageUrls = this.parameters.imageUrls,
            keywords = this.parameters.siteKeywords;
        for (var i = 0; i < keywords.length; i++) {
            if (image.indexOf(keywords[i]) === 0) {
                image = imageUrls[i] + image.slice(keywords[i].length);
				break;
            }
        }
        return image;
    };

    NextendImageHelper.prototype.openLightbox = function (callback) {

    };

    NextendImageHelper.prototype.openMultipleLightbox = function (callback) {
    };

    NextendImageHelper.prototype.openFoldersLightbox = function (callback) {
    };

    NextendImageHelper.prototype.getPlaceholder = function () {
        return this.fixed(this.parameters.placeholderImage);
    };

    NextendImageHelper.prototype.getRepeatedPlaceholder = function () {
        return this.fixed(this.parameters.placeholderRepeatedImage);
    };

    scope.NextendImageHelper = NextendImageHelper;

})(n2, window);
;
(function ($, scope) {

    var counter = 0;

    function NextendModal(panes, show, args) {
        this.inited = false;
        this.currentPane = null;
        this.customClass = '';
        this.$ = $(this);
        this.counter = counter++;

        this.panes = panes;

        if (show) {
            this.show(null, args);
        }

    }

    NextendModal.prototype.setCustomClass = function (customClass) {
        this.customClass = customClass;
    };

    NextendModal.prototype.lateInit = function () {
        if (!this.inited) {

            for (var k in this.panes) {
                this.panes[k] = $.extend({
                    customClass: '',
                    fit: false,
                    fitX: true,
                    overflow: 'hidden',
                    size: false,
                    back: false,
                    close: true,
                    controlsClass: '',
                    controls: [],
                    fn: {}
                }, this.panes[k]);
            }

            var stopClick = false;
            this.modal = $('<div class="n2-modal ' + this.customClass + '"/>').css('opacity', 0)
                .on('click', $.proxy(function (e) {
                    if (stopClick == false) {
                        if (!this.close.hasClass('n2-hidden') && $(e.target).closest('.n2-notification-center-modal').length == 0) {
                            this.hide(e);
                        }
                    }
                    stopClick = false;
                }, this));
            this.window = $('<div class="n2-modal-window n2-border-radius"/>')
                .on('click', function (e) {
                    stopClick = true;
                }).appendTo(this.modal);
            this.notificationStack = new NextendNotificationCenterStackModal(this.modal);

            var titleContainer = $('<div class="n2-modal-title n2-content-box-title-bg"/>')
                .appendTo(this.window);

            this.title = $('<div class="n2-h2 n2-ucf"/>').appendTo(titleContainer);
            this.back = $('<i class="n2-i n2-i-a-back"/>')
                .on('click', $.proxy(this.goBackButton, this))
                .appendTo(titleContainer);
            this.close = $('<i class="n2-i n2-i-a-deletes"/>')
                .on('click', $.proxy(this.hide, this))
                .appendTo(titleContainer);

            this.content = $('<div class="n2-modal-content"/>').appendTo(this.window);
            this.controls = $('<div class="n2-table n2-table-fixed n2-table-auto"/>');

            $('<div class="n2-modal-controls"/>')
                .append(this.controls)
                .appendTo(this.window);

            this.inited = true;
        }
    };

    NextendModal.prototype.show = function (paneId, args) {
        this.lateInit();
        this.notificationStack.enableStack();
        if (typeof paneId === 'undefined' || !paneId) {
            paneId = 'zero';
        }

        nextend.context.addWindow("modal");
        NextendEsc.add($.proxy(function () {
            if (!this.close.hasClass('n2-hidden')) {
                this.hide('esc');
                return true;
            }
            return false;
        }, this));

        this.loadPane(paneId, false, true, args);

        NextendTween.fromTo(this.modal, 0.3, {
            opacity: 0
        }, {
            opacity: 1,
            ease: 'easeOutCubic'
        }).play();
    };

    NextendModal.prototype.hide = function (e) {
        $(window).off('.n2-modal-' + this.counter);
        this.notificationStack.popStack();
        nextend.context.removeWindow();
        if (arguments.length > 0 && e != 'esc') {
            NextendEsc.pop();
        }
        this.apply('hide');
        this.apply('destroy');
        this.currentPane = null;
        this.modal.detach();

        $(document).off('keyup.n2-esc-modal');
    };

    NextendModal.prototype.destroy = function () {
        this.modal.remove();
    };

    NextendModal.prototype.loadPane = function (id, backward, isShow, args) {
        var end = $.proxy(function () {
            var pane = this.panes[id];
            this.currentPane = pane;

            if (pane.title !== false) {
                this.title.html(pane.title);
            }

            if (pane.back === false) {
                this.back.addClass('n2-hidden');
            } else {
                this.back.removeClass('n2-hidden');
            }

            if (pane.close === false) {
                this.close.addClass('n2-hidden');
            } else {
                this.close.removeClass('n2-hidden');
            }

            this.content.find('> *').detach();
            this.content.append(pane.content);


            var hasControls = false;
            var tr = $('<div class="n2-tr" />');
            var i = 0;
            for (; i < pane.controls.length; i++) {
                $('<div class="n2-td"/>')
                    .addClass('n2-modal-controls-' + i)
                    .html(pane.controls[i])
                    .appendTo(tr);
                hasControls = true;
            }

            tr.addClass('n2-modal-controls-' + i);
            this.controls.html(tr);
            this.controls.attr('class', 'n2-table n2-table-fixed n2-table-auto ' + pane.controlsClass);


            if (typeof isShow == 'undefined' || !isShow) {
                NextendTween.fromTo(this.window, 0.3, {
                    x: backward ? -2000 : 2000
                }, {
                    x: 0,
                    ease: 'easeOutCubic'
                }).play();
            }

            this.modal.appendTo('#n2-admin');

            if (pane.fit) {
                var $w = $(window),
                    margin = 40,
                    resize = $.proxy(function () {
                        var w = $w.width() - 2 * margin,
                            h = $w.height() - 2 * margin;

                        if (!pane.fitX) {
                            w = pane.size[0];
                        }
                        this.window.css({
                            width: w,
                            height: h,
                            marginLeft: w / -2,
                            marginTop: h / -2
                        });

                        this.content.css({
                            height: h - 80 - (hasControls ? this.controls.parent().outerHeight(true) : 0),
                            overflow: pane.overflow
                        });
                    }, this);
                resize();
                $w.on('resize.n2-modal-' + this.counter, resize);
            } else if (pane.size !== false) {
                this.window.css({
                    width: pane.size[0],
                    height: pane.size[1],
                    marginLeft: pane.size[0] / -2,
                    marginTop: pane.size[1] / -2
                });

                this.content.css({
                    height: pane.size[1] - 80 - (hasControls ? this.controls.parent().outerHeight(true) : 0),
                    overflow: pane.overflow
                });

            }

            this.apply('show', args);

        }, this);

        if (this.currentPane !== null) {
            this.apply('destroy');
            NextendTween.to(this.window, 0.3, {
                x: backward ? 2000 : -2000,
                onComplete: end,
                ease: 'easeOutCubic'
            }).play();
        } else {
            end();
        }

    };

    NextendModal.prototype.trigger = function (event, args) {
        this.$.trigger(event, args);
    };

    NextendModal.prototype.on = function (event, fn) {
        this.$.on(event, fn);
    };

    NextendModal.prototype.one = function (event, fn) {
        this.$.one(event, fn);
    };

    NextendModal.prototype.off = function (event, fn) {
        this.$.off(event, fn);
    };

    NextendModal.prototype.goBackButton = function () {
        var args = null;
        if (typeof this.goBackArgs !== null) {
            args = this.goBackArgs;
            this.goBackArgs = null;
        }
        this.goBack(args);
    };

    NextendModal.prototype.goBack = function (args) {
        if (this.apply('goBack', args)) {
            this.loadPane(this.currentPane.back, true, false, args);
        }
    };

    NextendModal.prototype.apply = function (event, args) {
        if (typeof this.currentPane.fn[event] !== 'undefined') {
            return this.currentPane.fn[event].apply(this, args);
        }
        return true;
    };

    NextendModal.prototype.createInput = function (label, id) {
        var style = '';
        if (arguments.length == 3) {
            style = arguments[2];
        }
        return $('<div class="n2-form-element-mixed"><div class="n2-mixed-group"><div class="n2-mixed-label"><label for="' + id + '">' + label + '</label></div><div class="n2-mixed-element"><div class="n2-form-element-text n2-border-radius"><input type="text" id="' + id + '" value="" class="n2-h5" autocomplete="off" style="' + style + '"></div></div></div></div>');
    };

    NextendModal.prototype.createInputUnit = function (label, id, unit) {
        var style = '';
        if (arguments.length == 4) {
            style = arguments[3];
        }
        return $('<div class="n2-form-element-mixed"><div class="n2-mixed-group"><div class="n2-mixed-label"><label for="' + id + '">' + label + '</label></div><div class="n2-mixed-element"><div class="n2-form-element-text n2-border-radius"><input type="text" id="' + id + '" value="" class="n2-h5" autocomplete="off" style="' + style + '"><div class="n2-text-unit n2-h5 n2-uc">' + unit + '</div></div></div></div></div>');
    };

    NextendModal.prototype.createInputSub = function (label, id, sub) {
        var style = '';
        if (arguments.length == 4) {
            style = arguments[3];
        }
        return $('<div class="n2-form-element-mixed"><div class="n2-mixed-group"><div class="n2-mixed-label"><label for="' + id + '">' + label + '</label></div><div class="n2-mixed-element"><div class="n2-form-element-text n2-border-radius"><div class="n2-text-sub-label n2-h5 n2-uc">' + sub + '</div><input type="text" id="' + id + '" value="" class="n2-h5" autocomplete="off" style="' + style + '"></div></div></div></div>');
    };

    NextendModal.prototype.createTextarea = function (label, id) {
        var style = '';
        if (arguments.length == 3) {
            style = arguments[2];
        }
        return $('<div class="n2-form-element-mixed"><div class="n2-mixed-group"><div class="n2-mixed-label"><label for="' + id + '">' + label + '</label></div><div class="n2-mixed-element"><div class="n2-form-element-textarea n2-border-radius"><textarea id="' + id + '" class="n2-h5" autocomplete="off" style="resize:none;' + style + '"></textarea></div></div></div></div>');
    };


    NextendModal.prototype.createSelect = function (label, id, values) {
        var style = '';
        if (arguments.length == 4) {
            style = arguments[3];
        }
        $group = $('<div class="n2-form-element-mixed"><div class="n2-mixed-group "><div class="n2-mixed-label"><label for="' + id + '">' + label + '</label></div><div class="n2-mixed-element"><div class="n2-form-element-list" style=""><select id="' + id + '" autocomplete="off" style="' + style + '"></select></div></div></div></div>');
        $select = $group.find('select');

        for (var k in values) {
            $select.append('<option value="' + k + '">' + values[k] + '</option>');
        }
        $select.prop('selectedIndex', 0);

        return $group;
    };


    NextendModal.prototype.createHeading = function (title) {
        return $('<h3 class="n2-h3">' + title + '</h3>');
    };
    NextendModal.prototype.createSubHeading = function (title) {
        return $('<h3 class="n2-h4">' + title + '</h3>');
    };

    NextendModal.prototype.createCenteredHeading = function (title) {
        return $('<h3 class="n2-h3 n2-center">' + title + '</h3>');
    };
    NextendModal.prototype.createCenteredSubHeading = function (title) {
        return $('<h3 class="n2-h4 n2-center">' + title + '</h3>');
    };

    NextendModal.prototype.createResult = function () {
        return $('<div class="n2-result"></div>');
    };

    NextendModal.prototype.createTable = function (data, style) {
        var table = $('<table class="n2-table-fancy"/>');
        for (var j = 0; j < data.length; j++) {
            var tr = $('<tr />').appendTo(table);
            for (var i = 0; i < data[j].length; i++) {
                tr.append($('<td style="' + style[i] + '"/>').append(data[j][i]));
            }
        }
        return table;
    };

    NextendModal.prototype.createTableWrap = function () {
        return $('<div class="n2-table-fancy-wrap" style="overflow:auto;height:196px;" />');
    };

    NextendModal.prototype.createImageRadio = function (options) {

        var wrapper = $('<div class="n2-modal-radio" />'),
            input = $('<input type="hidden" value="' + options[0].key + '"/>').appendTo(wrapper);

        for (var i = 0; i < options.length; i++) {
            wrapper.append('<div class="n2-modal-radio-option" data-key="' + options[i].key + '" style="background-image: url(\'' + nextend.imageHelper.fixed(options[i].image) + '\')"><div class="n2-h4">' + options[i].name + '</div></div>')
        }

        var options = wrapper.find('.n2-modal-radio-option');
        options.eq(0).addClass('n2-active');

        options.on('click', function (e) {
            options.removeClass('n2-active');
            var option = $(e.currentTarget);
            option.addClass('n2-active');
            input.val(option.data('key'));
        });

        return wrapper;
    };

    scope.NextendModal = NextendModal;


    scope.NextendModalSetting = {
        show: function (title, url) {
            new NextendModal({
                zero: {
                    size: [
                        1300,
                        700
                    ],
                    title: title,
                    content: '<iframe src="' + url + '" width="1300" height="640" frameborder="0" style="margin:0 -20px -20px -20px;"></iframe>'
                }
            }, true);
        }
    };
    scope.NextendModalDocumentation = function (title, url) {
        new NextendModal({
            zero: {
                size: [
                    760,
                    700
                ],
                title: title,
                content: '<iframe src="' + url + '" width="760" height="640" frameborder="0" style="margin:0 -20px -20px -20px;"></iframe>'
            }
        }, true);
    };

    scope.NextendNewFullWindow = function (url, id) {
        var params = [
            'height=' + screen.height,
            'width=' + screen.width,
            'fullscreen=yes'
        ].join(',');

        var popup = window.open(url, id, params);
        popup.moveTo(0, 0);
        return popup;
    };

    function NextendSimpleModal(html, options) {
        this.$ = $(this);
        this.options = $.extend({
            'class': ''
        }, options);
        this.modal = $('<div class="n2-modal n2-modal-simple"/>').addClass(this.options.class).css({
            display: 'none'
        }).appendTo('#n2-admin');

        $('<i class="n2-i n2-i-a-deletes"/>')
            .on('click', $.proxy(this.hide, this))
            .appendTo(this.modal);

        this.window = $('<div class="n2-modal-window"/>')
            .on('click', function (e) {
                e.stopPropagation();
            })
            .appendTo(this.modal);
        this.notificationStack = new NextendNotificationCenterStackModal(this.modal);
        this.content = $(html).appendTo(this.window);
    };

    NextendSimpleModal.prototype.resize = function () {
        this.window.width(this.modal.width());
        this.window.height(this.modal.height());
    };

    NextendSimpleModal.prototype.show = function () {
        $('body').addClass('n2-modal-active');
        this.modal.css('display', 'block');
        this.resize();
        $(window).on('resize.n2-simple-modal', $.proxy(this.resize, this));
        this.notificationStack.enableStack();

        NextendEsc.add($.proxy(function () {
            this.hide('esc');
            return true;
        }, this));
    };

    NextendSimpleModal.prototype.hide = function (e) {
        this.notificationStack.popStack();
        if (arguments.length > 0 && e != 'esc') {
            NextendEsc.pop();
        }
        this.modal.css('display', 'none');
        $('body').removeClass('n2-modal-active');
        $(document).off('keyup.n2-esc-modal');
        $(window).off('.n2-simple-modal');
        this.modal.trigger('ModalHide');
    };

    scope.NextendSimpleModal = NextendSimpleModal;

    function NextendDeleteModal(identifier, instanceName, callback) {
        if ($.jStorage.get('n2-delete-' + identifier, false)) {
            callback();
            return true;
        }
        new NextendModal({
            zero: {
                size: [
                    500,
                    190
                ],
                title: n2_('Delete'),
                back: false,
                close: true,
                content: '',
                controls: ['<a href="#" class="n2-button n2-button-normal n2-button-l n2-radius-s n2-button-grey n2-uc n2-h4">' + n2_('Cancel') + '</a>', '<div class="n2-button n2-button-with-actions n2-button-l n2-radius-s n2-button-red"><a href="#" class="n2-button-inner n2-uc n2-h4">' + n2_('Delete') + '</a><div class="n2-button-menu-open"><i class="n2-i n2-i-buttonarrow"></i><div class="n2-button-menu"><div class="n2-button-menu-inner n2-border-radius"><a href="#" class="n2-h4">' + n2_('Delete and never ask for confirmation again') + '</a></div></div></div></div>'],
                fn: {
                    show: function () {
                        this.createCenteredSubHeading(n2_('Are you sure you want to delete?')).appendTo(this.content);
                        this.controls.find('.n2-button-grey')
                            .on('click', $.proxy(function (e) {
                                e.preventDefault();
                                this.hide(e);
                            }, this));
                        this.controls.find('.n2-button-red a')
                            .on('click', $.proxy(function (e) {
                                e.preventDefault();
                                callback();
                                this.hide(e);
                            }, this));

                        this.controls.find('.n2-button-red .n2-button-menu-inner a')
                            .on('click', $.proxy(function (e) {
                                e.preventDefault();
                                $.jStorage.set('n2-delete-' + identifier, true);
                            }, this));

                        this.controls.find(".n2-button-menu-open").n2opener();

                    },
                    destroy: function () {
                        this.destroy();
                    }
                }
            }
        }, true);
        return false;
    };

    scope.NextendDeleteModal = NextendDeleteModal;

    function NextendDeleteModalLink(element, identifier, instanceName) {

        NextendDeleteModal(identifier, instanceName, function () {
            window.location.href = $(element).attr('href');
        });
        return false;
    };
    scope.NextendDeleteModalLink = NextendDeleteModalLink;

})
(n2, window);
;
(function ($, scope) {

    function NextendNotificationCenter() {
        this.stack = [];
        this.tween = null;

        nextend.ready($.proxy(function () {
            var mainTopBar = $('#n2-admin').find('.n2-main-top-bar');
            if (mainTopBar.length > 0) {
                var stack = new NextendNotificationCenterStack($('#n2-admin').find('.n2-main-top-bar'));
                stack.enableStack();
            } else {
                var stack = new NextendNotificationCenterStackModal($('#n2-admin'));
                stack.enableStack();
            }
        }, this));
    };


    NextendNotificationCenter.prototype.add = function (stack) {
        this.stack.push(stack);
    };

    NextendNotificationCenter.prototype.popStack = function () {
        this.stack.pop();
    };

    /**
     * @returns {NextendNotificationCenterStack}
     */
    NextendNotificationCenter.prototype.getCurrentStack = function () {
        return this.stack[this.stack.length - 1];
    };

    NextendNotificationCenter.prototype.success = function (message, parameters) {
        this.getCurrentStack().success(message, parameters);
    };

    NextendNotificationCenter.prototype.error = function (message, parameters) {
        this.getCurrentStack().error(message, parameters);
    };

    NextendNotificationCenter.prototype.notice = function (message, parameters) {
        this.getCurrentStack().notice(message, parameters);
    };

    window.nextend.notificationCenter = new NextendNotificationCenter();


    function NextendNotificationCenterStack(bar) {
        this.messages = [];
        this.isShow = false;
        this.importantOnly = 0;

        this.importantOnlyNode = $('<div class="n2-notification-important n2-h5 ' + (this.importantOnly ? 'n2-active' : '') + '"><span>' + n2_('Show only errors') + '</span><div class="n2-checkbox n2-light"><i class="n2-i n2-i-tick"></i></div></div>')
            .on('click', $.proxy(this.changeImportant, this));
        $.jStorage.listenKeyChange('ss-important-only', $.proxy(this.importantOnlyChanged, this));
        this.importantOnlyChanged();

        this._init(bar);
        this.emptyMessage = $('<div class="n2-notification-empty n2-h4">' + n2_('There are no messages to display.') + '</div>');
    }

    NextendNotificationCenterStack.prototype._init = function (bar) {

        this.showButton = bar.find('.n2-notification-button')
            .on('click', $.proxy(this.hideOrShow, this));

        var settings = $('<div class="n2-notification-settings"></div>')
            .append($('<div class="n2-button n2-button-normal n2-button-s n2-button-blue n2-radius-s n2-h5 n2-uc n2-notification-clear">' + n2_('Got it!') + '</div>').on('click', $.proxy(this.clear, this)))
            .append(this.importantOnlyNode);


        this.container = this.messageContainer = $('<div class="n2-notification-center n2-border-radius-br n2-border-radius-bl"></div>')
            .append(settings)
            .appendTo(bar);
    };

    NextendNotificationCenterStack.prototype.enableStack = function () {
        nextend.notificationCenter.add(this);
    };

    NextendNotificationCenterStack.prototype.popStack = function () {
        nextend.notificationCenter.popStack();
    };

    NextendNotificationCenterStack.prototype.hideOrShow = function (e) {
        e.preventDefault();
        if (this.isShow) {
            this.hide()
        } else {
            this.show();
        }
    };

    NextendNotificationCenterStack.prototype.show = function () {
        if (!this.isShow) {
            this.isShow = true;

            if (this.messages.length == 0) {
                this.showEmptyMessage();
            }

            if (this.showButton) {
                this.showButton.addClass('n2-active');
            }
            this.container.addClass('n2-active');

            this.container.css('display', 'block');

            this._animateShow();
        }
    };

    NextendNotificationCenterStack.prototype.hide = function () {
        if (this.isShow) {
            if (this.showButton) {
                this.showButton.removeClass('n2-active');
            }
            this.container.removeClass('n2-active');

            this._animateHide();

            this.container.css('display', 'none');

            this.isShow = false;
        }
    };

    NextendNotificationCenterStack.prototype._animateShow = function () {
        if (this.tween) {
            this.tween.pause();
        }
        this.tween = NextendTween.fromTo(this.container, 0.4, {
            opacity: 0
        }, {
            opacity: 1
        }).play();
    };

    NextendNotificationCenterStack.prototype._animateHide = function () {
        if (this.tween) {
            this.tween.pause();
        }
    };

    NextendNotificationCenterStack.prototype.success = function (message, parameters) {
        this._message('success', n2_('success'), message, parameters);
    };

    NextendNotificationCenterStack.prototype.error = function (message, parameters) {
        this._message('error', n2_('error'), message, parameters);
    };

    NextendNotificationCenterStack.prototype.notice = function (message, parameters) {
        this._message('notice', n2_('notice'), message, parameters);
    };

    NextendNotificationCenterStack.prototype._message = function (type, label, message, parameters) {

        this.hideEmptyMessage();

        parameters = $.extend({
            timeout: false,
            remove: false
        }, parameters);

        var messageNode = $('<div></div>');

        if (parameters.timeout) {
            setTimeout($.proxy(function () {
                this.hideMessage(messageNode, parameters.remove);
            }, this), parameters.timeout * 1000);
        }

        messageNode
            .addClass('n2-table n2-table-fixed n2-h3 n2-border-radius n2-notification-message n2-notification-message-' + type)
            .append($('<div class="n2-tr"></div>')
                .append('<div class="n2-td n2-first"><i class="n2-i n2-i-n-' + type + '"/></div>')
                .append('<div class="n2-td n2-message"><h4 class="n2-h4 n2-uc">' + label + '</h4><p class="n2-h4">' + message + '</p></div>'))
            .prependTo(this.messageContainer);

        this.messages.push(messageNode);
        if (this.messages.length > 3) {
            this.messages.shift().remove();
        }

        if (!this.importantOnly || type == 'error' || type == 'notice') {
            this.show();
        }
        return messageNode;
    };

    NextendNotificationCenterStack.prototype.hideMessage = function (message, remove) {
        if (remove) {
            this.deleteMessage(message);
        } else {
            this.hide();
        }
    };

    NextendNotificationCenterStack.prototype.deleteMessage = function (message) {
        var index = $.inArray(message, this.messages);
        if (index > -1) {
            this.messages.splice(index, 1);
            message.remove();
        }
        if (this.messages.length == 0) {
            this.hide();
        }
    };
    NextendNotificationCenterStack.prototype.clear = function () {
        for (var i = this.messages.length - 1; i >= 0; i--) {
            this.messages.pop().remove();
        }

        this.showEmptyMessage();

        this.hide();
    };
    NextendNotificationCenterStack.prototype.changeImportant = function () {
        if (this.importantOnly) {
            $.jStorage.set('ss-important-only', 0);
        } else {
            $.jStorage.set('ss-important-only', 1);
        }
    };

    NextendNotificationCenterStack.prototype.importantOnlyChanged = function () {
        this.importantOnly = parseInt($.jStorage.get('ss-important-only', 0));
        if (this.importantOnly) {
            this.importantOnlyNode.addClass('n2-active');
        } else {
            this.importantOnlyNode.removeClass('n2-active');
        }
    };

    NextendNotificationCenterStack.prototype.showEmptyMessage = function () {
        this.emptyMessage.prependTo(this.container);
    };

    NextendNotificationCenterStack.prototype.hideEmptyMessage = function () {
        this.emptyMessage.detach();
    };

    scope.NextendNotificationCenterStack = NextendNotificationCenterStack;


    function NextendNotificationCenterStackModal() {
        NextendNotificationCenterStack.prototype.constructor.apply(this, arguments);
    }

    NextendNotificationCenterStackModal.prototype = Object.create(NextendNotificationCenterStack.prototype);
    NextendNotificationCenterStackModal.prototype.constructor = NextendNotificationCenterStackModal;


    NextendNotificationCenterStackModal.prototype._init = function (bar) {
        var settings = $('<div class="n2-notification-settings"></div>')
            .append($('<div class="n2-button n2-button-normal n2-button-s n2-button-blue n2-radius-s n2-h5 n2-uc n2-notification-clear">Got it!</div>').on('click', $.proxy(this.clear, this)))
            .append(this.importantOnlyNode);

        this.messageContainer = $('<div class="n2-notification-center n2-border-radius"></div>')
            .append(settings);
        this.container = $('<div class="n2-notification-center-modal"></div>')
            .append(this.messageContainer)
            .appendTo(bar);
    };

    NextendNotificationCenterStackModal.prototype.show = function () {
        if (document.activeElement) {
            document.activeElement.blur();
        }
        NextendEsc.add($.proxy(function () {
            this.clear();
            return false;
        }, this));

        NextendNotificationCenterStack.prototype.show.apply(this, arguments);
    };

    NextendNotificationCenterStackModal.prototype.hide = function () {
        NextendEsc.pop();

        NextendNotificationCenterStack.prototype.hide.apply(this, arguments);
    };

    NextendNotificationCenterStackModal.prototype._animateShow = function () {

    };

    NextendNotificationCenterStackModal.prototype._animateHide = function () {

    };

    scope.NextendNotificationCenterStackModal = NextendNotificationCenterStackModal;

})(n2, window);
// Spectrum Colorpicker v1.0.9
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var tinycolor = null;
    var defaultOpts = {

            // Events
            beforeShow: noop,
            move: noop,
            change: noop,
            show: noop,
            hide: noop,

            // Options
            color: false,
            flat: false,
            showInput: false,
            showButtons: true,
            clickoutFiresChange: false,
            showInitial: false,
            showPalette: false,
            showPaletteOnly: false,
            showSelectionPalette: true,
            localStorageKey: false,
            maxSelectionSize: 7,
            cancelText: "cancel",
            chooseText: "choose",
            preferredFormat: false,
            className: "",
            showAlpha: false,
            theme: "n2-sp-light",
            palette: ['fff', '000'],
            selectionPalette: [],
            disabled: false
        },
        spectrums = [],
        IE = !!/msie/i.exec(window.navigator.userAgent),
        rgbaSupport = (function () {
            function contains(str, substr) {
                return !!~('' + str).indexOf(substr);
            }

            var elem = document.createElement('div');
            var style = elem.style;
            style.cssText = 'background-color:rgba(0,0,0,.5)';
            return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
        })(),
        replaceInput = [
            "<div class='n2-sp-replacer'>",
            "<div class='n2-sp-preview'><div class='n2-sp-preview-inner'></div></div>",
            "<div class='n2-sp-dd'>&#9650;</div>",
            "</div>"
        ].join(''),
        markup = (function () {

            // IE does not support gradients with multiple stops, so we need to simulate
            //  that for the rainbow slider with 8 divs that each have a single gradient
            var gradientFix = "";
            if (IE) {
                for (var i = 1; i <= 6; i++) {
                    gradientFix += "<div class='n2-sp-" + i + "'></div>";
                }
            }

            return [
                "<div class='n2-sp-container'>",
                "<div class='n2-sp-palette-container'>",
                "<div class='n2-sp-palette n2-sp-thumb n2-sp-cf'></div>",
                "</div>",
                "<div class='n2-sp-picker-container'>",
                "<div class='n2-sp-top n2-sp-cf'>",
                "<div class='n2-sp-fill'></div>",
                "<div class='n2-sp-top-inner'>",
                "<div class='n2-sp-color'>",
                "<div class='n2-sp-sat'>",
                "<div class='n2-sp-val'>",
                "<div class='n2-sp-dragger'></div>",
                "</div>",
                "</div>",
                "</div>",
                "<div class='n2-sp-hue'>",
                "<div class='n2-sp-slider'></div>",
                gradientFix,
                "</div>",
                "</div>",
                "<div class='n2-sp-alpha'><div class='n2-sp-alpha-inner'><div class='n2-sp-alpha-handle'></div></div></div>",
                "</div>",
                "<div class='n2-sp-input-container n2-sp-cf'>",
                "<input class='n2-sp-input' type='text' spellcheck='false'  />",
                "</div>",
                "<div class='n2-sp-initial n2-sp-thumb n2-sp-cf'></div>",
                "<div class='n2-sp-button-container n2-sp-cf'>",
                "<a class='n2-sp-cancel' href='#'></a>",
                "<button class='n2-sp-choose'></button>",
                "</div>",
                "</div>",
                "</div>"
            ].join("");
        })();

    function paletteTemplate(p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "n2-sp-thumb-el n2-sp-thumb-dark" : "n2-sp-thumb-el n2-sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " n2-sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="n2-sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='n2-sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            draggingClass = "n2-sp-dragging";


        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".n2-sp-color"),
            dragHelper = container.find(".n2-sp-dragger"),
            slider = container.find(".n2-sp-hue"),
            slideHelper = container.find(".n2-sp-slider"),
            alphaSliderInner = container.find(".n2-sp-alpha-inner"),
            alphaSlider = container.find(".n2-sp-alpha"),
            alphaSlideHelper = container.find(".n2-sp-alpha-handle"),
            textInput = container.find(".n2-sp-input"),
            paletteContainer = container.find(".n2-sp-palette"),
            initialColorContainer = container.find(".n2-sp-initial"),
            cancelButton = container.find(".n2-sp-cancel"),
            chooseButton = container.find(".n2-sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = null,
            offsetElement = null,
            previewElement = null,
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;

        container.on('mousedown', function (e) {
            nextend.context.setMouseDownArea('colorpicker', e);
        });


        function applyOptions(noReflow) {

            container.toggleClass("n2-sp-flat", flat);
            container.toggleClass("n2-sp-input-disabled", !opts.showInput);
            container.toggleClass("n2-sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("n2-sp-buttons-disabled", !opts.showButtons || flat);
            container.toggleClass("n2-sp-palette-disabled", !opts.showPalette);
            container.toggleClass("n2-sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("n2-sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            if (typeof noReflow === 'undefined') {
                reflow();
            }
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            var customReplace = boundElement.parent().find('.n2-sp-replacer');
            if (customReplace.length) {
                replacer = customReplace;
            } else {
                replacer = (shouldReplace) ? $(replaceInput).addClass(theme) : $([]);

                if (shouldReplace) {
                    //boundElement.hide().after(replacer);
                    boundElement.parent().after(replacer);
                }
            }
            offsetElement = (shouldReplace) ? replacer : boundElement;
            previewElement = replacer.find(".n2-sp-preview-inner");

            applyOptions(true);

            if (flat) {
                boundElement.parent().after(container).hide();
            }
            else {
                $(body).append(container.hide());
            }

            if (localStorageKey && window.localStorage) {

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) {
                }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if (boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) {
                if (e.keyCode == 13) {
                    setFromTextInput();
                }
            });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY) {
                currentSaturation = parseFloat(dragX / dragWidth);
                currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                move();
            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".n2-sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".n2-sp-thumb-el:nth-child(1)", paletteEvent, {ignore: true}, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch (e) {
                    }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "n2-sp-palette-row n2-sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "n2-sp-palette-row n2-sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "n2-sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight === 0 || dragWidth === 0 || slideHeight === 0) {
                reflow();
            }
            container.addClass(draggingClass);
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("n2-sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            if (visible) {
                reflow();
                return;
            }
            if (callbacks.beforeShow(get()) === false) return;

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", hide);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("n2-sp-active");
            container.show();

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) {
                return;
            }

            // Return if hiding is unnecessary
            if (!visible || flat) {
                return;
            }
            visible = false;

            $(doc).unbind("click.spectrum", hide);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("n2-sp-active");
            container.hide();

            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }

            callbacks.hide(get());
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = newHsv.h;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (!ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get() {
            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            });
        }

        function isValid() {
            return !textInput.hasClass("n2-sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
        }

        function updateUI() {

            textInput.removeClass("n2-sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor({h: currentHue, s: "1.0", v: "1.0"});
            dragger.css("background-color", '#' + flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get(),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();


            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({gradientType: 1}, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }


            // Update the text entry input as it changes happen
            if (opts.showInput) {
                if (currentAlpha < 1) {
                    if (format === "hex" || format === "name") {
                        format = "rgb";
                    }
                }
                textInput.val(realColor.toString(format));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = dragHeight - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight,
                Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
            );
            dragY = Math.max(
                -dragHelperHeight,
                Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - slideHelperHeight
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat)).change();
            }

            //var hasChanged = !tinycolor.equals(color, colorOnShow);
            var hasChanged = 1;

            colorOnShow = color;

            // Update the selection palette with the current color
            addColorToSelectionPalette(color);
            if (fireCallback && hasChanged) {
                callbacks.change(color);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.offset(getOffset(container, offsetElement.parent()));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("n2-sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("n2-sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
     * checkOffset - get the offset below/above and left/right element depending on screen position
     * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
     */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight + 3;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
                Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight + 6 - extraY) : extraY));

        return offset;
    }

    /**
     * noop - do nothing
     */
    function noop() {

    }

    /**
     * stopPropagation - makes the code only doing this a little easier to read in line
     */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
     * Create a function bound to a given object
     * Thanks to underscore.js
     */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
     * Lightweight drag helper.  Handles containment within the element, so that
     * when dragging, the x is within [0,element.width] and y is within [0,element.height]
     */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () {
            };
        onstart = onstart || function () {
            };
        onstop = onstop || function () {
            };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = false;

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents[(hasTouch ? "touchmove" : "mousemove")] = move;
        duringDragEvents[(hasTouch ? "touchend" : "mouseup")] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("n2-sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("n2-sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind(hasTouch ? "touchstart" : "mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    /**
     * Define a jQuery plugin
     */
    var dataID = "spectrum.id";
    $.fn.n2spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error("Spectrum: no such method: '" + opts + "'");
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.n2spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.n2spectrum.load = true;
    $.fn.n2spectrum.loadOpts = {};
    $.fn.n2spectrum.draggable = draggable;
    $.fn.n2spectrum.defaults = defaultOpts;

    $.n2spectrum = {};
    $.n2spectrum.localization = {};
    $.n2spectrum.palettes = {};

    $.fn.n2spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").n2spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor.js - <https://github.com/bgrins/TinyColor> - 2011 Brian Grinstead - v0.5

    (function (window) {

        var trimLeft = /^[\s,#]+/,
            trimRight = /\s+$/,
            tinyCounter = 0,
            math = Math,
            mathRound = math.round,
            mathMin = math.min,
            mathMax = math.max,
            mathRandom = math.random,
            parseFloat = window.parseFloat;

        tinycolor = function (color, opts) {

            // If input is already a tinycolor, return itself
            if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
                return color;
            }

            var rgb = inputToRGB(color);
            var r = rgb.r, g = rgb.g, b = rgb.b, a = parseFloat(rgb.a), format = rgb.format;

            return {
                ok: rgb.ok,
                format: format,
                _tc_id: tinyCounter++,
                alpha: a,
                toHsv: function () {
                    var hsv = rgbToHsv(r, g, b);
                    return {h: hsv.h, s: hsv.s, v: hsv.v, a: a};
                },
                toHsvString: function () {
                    var hsv = rgbToHsv(r, g, b);
                    var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                    return (a == 1) ?
                    "hsv(" + h + ", " + s + "%, " + v + "%)" :
                    "hsva(" + h + ", " + s + "%, " + v + "%, " + a + ")";
                },
                toHsl: function () {
                    var hsl = rgbToHsl(r, g, b);
                    return {h: hsl.h, s: hsl.s, l: hsl.l, a: a};
                },
                toHslString: function () {
                    var hsl = rgbToHsl(r, g, b);
                    var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                    return (a == 1) ?
                    "hsl(" + h + ", " + s + "%, " + l + "%)" :
                    "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")";
                },
                toHex: function () {
                    return rgbToHex(r, g, b);
                },
                toHexString: function (force6Char) {
                    return rgbToHex(r, g, b, force6Char);
                },
                toHexString8: function () {
                    return rgbToHex(r, g, b, true) + pad2(mathRound(a * 255).toString(16));
                },
                toRgb: function () {
                    return {r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a};
                },
                toRgbString: function () {
                    return (a == 1) ?
                    "rgb(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                    "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + a + ")";
                },
                toName: function () {
                    return hexNames[rgbToHex(r, g, b)] || false;
                },
                toFilter: function (opts, secondColor) {

                    var hex = rgbToHex(r, g, b, true);
                    var secondHex = hex;
                    var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                    var secondAlphaHex = alphaHex;
                    var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                    if (secondColor) {
                        var s = tinycolor(secondColor);
                        secondHex = s.toHex();
                        secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                    }

                    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
                },
                toString: function (format) {
                    format = format || this.format;
                    var formattedString = false;
                    if (format === "rgb") {
                        formattedString = this.toRgbString();
                    }
                    if (format === "hex") {
                        formattedString = this.toHexString();
                    }
                    if (format === "hex6") {
                        formattedString = this.toHexString(true);
                    }
                    if (format === "hex8") {
                        formattedString = this.toHexString8();
                    }
                    if (format === "name") {
                        formattedString = this.toName();
                    }
                    if (format === "hsl") {
                        formattedString = this.toHslString();
                    }
                    if (format === "hsv") {
                        formattedString = this.toHsvString();
                    }

                    return formattedString || this.toHexString(true);
                }
            };
        }

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function (color) {

            if (typeof color == "object") {
                for (var i in color) {
                    if (color[i] === 1) {
                        color[i] = "1.0";
                    }
                }
            }

            return tinycolor(color);

        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {

            var rgb = {r: 0, g: 0, b: 0};
            var a = 1;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = "rgb";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            rgb.r = mathMin(255, mathMax(rgb.r, 0));
            rgb.g = mathMin(255, mathMax(rgb.g, 0));
            rgb.b = mathMin(255, mathMax(rgb.b, 0));


            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1.
            // If it was supposed to be 128, this was already taken care of in the conversion function
            if (rgb.r < 1) {
                rgb.r = mathRound(rgb.r);
            }
            if (rgb.g < 1) {
                rgb.g = mathRound(rgb.g);
            }
            if (rgb.b < 1) {
                rgb.b = mathRound(rgb.b);
            }

            return {
                ok: ok,
                format: (color && color.format) || format,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                a: a
            };
        }


        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b) {
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }

                h /= 6;
            }

            return {h: h, s: s, l: l};
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return {r: r * 255, g: g * 255, b: b * 255};
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            }
            else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return {h: h, s: s, v: v};
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hsvToRgb(h, s, v) {
            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return {r: r * 255, g: g * 255, b: b * 255};
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, force6Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (!force6Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) {
                return false;
            }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function () {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };


        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


        tinycolor.desaturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s -= ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.saturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s += ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.greyscale = function (color) {
            return tinycolor.desaturate(color, 100);
        };
        tinycolor.lighten = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l += ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.darken = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l -= ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.complement = function (color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 0.5) % 1;
            return tinycolor(hsl);
        };


        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        tinycolor.triad = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
                tinycolor(color),
                tinycolor({h: (h + 120) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({h: (h + 240) % 360, s: hsl.s, l: hsl.l})
            ];
        };
        tinycolor.tetrad = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
                tinycolor(color),
                tinycolor({h: (h + 90) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({h: (h + 180) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({h: (h + 270) % 360, s: hsl.s, l: hsl.l})
            ];
        };
        tinycolor.splitcomplement = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
                tinycolor(color),
                tinycolor({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
                tinycolor({h: (h + 216) % 360, s: hsl.s, l: hsl.l})
            ];
        };
        tinycolor.analogous = function (color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            hsl.h *= 360;

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results;) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        };
        tinycolor.monochromatic = function (color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({h: h, s: s, v: v}));
                v = (v + modification) % 1;
            }

            return ret;
        };
        tinycolor.readable = function (color1, color2) {
            var a = tinycolor(color1).toRgb(), b = tinycolor(color2).toRgb();
            return (
                    (b.r - a.r) * (b.r - a.r) +
                    (b.g - a.g) * (b.g - a.g) +
                    (b.b - a.b) * (b.b - a.b)
                ) > 0x28A4;
        };

        // Big List of Colors
        // ---------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);


        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = {};
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) {
                n = "100%";
            }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = n * (max / 100);
            }

            // Handle floating point rounding errors
            if (math.abs(n - max) < 0.000001) {
                return 1;
            }
            else if (n >= 1) {
                return (n % max) / parseFloat(max);
            }
            return n;
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse an integer into hex
        function parseHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        var matchers = (function () {

            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {

            color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return {r: 0, g: 0, b: 0, a: 0};
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return {r: match[1], g: match[2], b: match[3]};
            }
            if ((match = matchers.rgba.exec(color))) {
                return {r: match[1], g: match[2], b: match[3], a: match[4]};
            }
            if ((match = matchers.hsl.exec(color))) {
                return {h: match[1], s: match[2], l: match[3]};
            }
            if ((match = matchers.hsla.exec(color))) {
                return {h: match[1], s: match[2], l: match[3], a: match[4]};
            }
            if ((match = matchers.hsv.exec(color))) {
                return {h: match[1], s: match[2], v: match[3]};
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex8.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    a: parseHex(match[4]) / 255,
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseHex(match[1] + '' + match[1]),
                    g: parseHex(match[2] + '' + match[2]),
                    b: parseHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        // Everything is ready, expose to window
        //tinycolor;

    })(this);

    $(function () {
        if ($.fn.n2spectrum.load) {
            $.fn.n2spectrum.processNativeColorInputs();
        }
    });

})(window, n2);

(function ($, scope) {

    function NextendExpertMode(app, allowed) {
        this.app = 'system';
        this.key = 'IsExpert';
        this.isExpert = 0;

        this.style = $('<div style="display: none;"></div>').appendTo('body');

        if (!allowed) {
            this.switches = $();
            this.disable(false);
        } else {

            this.switches = $('.n2-expert-switch')
                .on({
                    mousedown: $.proxy(nextend.context.setMouseDownArea, nextend.context, 'expertClicked'),
                    click: $.proxy(this.switchExpert, this, true)
                });

            this.load();
            if (!this.isExpert) {
                this.disable(false);
            }

            $.jStorage.listenKeyChange(this.app + this.key, $.proxy(this.load, this));
        }
    };

    NextendExpertMode.prototype.load = function () {
        var isExpert = parseInt($.jStorage.get(this.app + this.key, 0));
        if (isExpert != this.isExpert) {
            this.switchExpert(false, false);
        }
    };

    NextendExpertMode.prototype.set = function (value, needSet) {
        this.isExpert = value;
        if (needSet) {
            $.jStorage.set(this.app + this.key, value);
        }
    };

    NextendExpertMode.prototype.switchExpert = function (needSet, e) {
        if (e) {
            e.preventDefault();
        }
        if (!this.isExpert) {
            this.enable(needSet);
        } else {
            this.disable(needSet);
        }
    };

    NextendExpertMode.prototype.measureElement = function () {
        var el = null,
            scrollTop = $(window).scrollTop(),
            cutoff = scrollTop + 62,
            cutoffBottom = scrollTop + $(window).height() - 100;
        $('.n2-content-area > .n2-heading-bar,.n2-content-area > .n2-form-tab ,#n2-admin .n2-content-area form > .n2-form > .n2-form-tab').each(function () {
            var $el = $(this);
            if ($el.offset().top > cutoff) {
                if (!$el.hasClass('n2-heading-bar')) {
                    el = $el;
                }
                return false;
            } else if ($el.offset().top + $el.height() > cutoffBottom) {
                if (!$el.hasClass('n2-heading-bar')) {
                    el = $el;
                }
                return false;
            }
        });
        this.measuredElement = el;
    };

    NextendExpertMode.prototype.scrollToMeasured = function () {

        if (this.measuredElement !== null) {
            while (this.measuredElement.length && !this.measuredElement.is(':VISIBLE')) {
                this.measuredElement = this.measuredElement.prev();
            }
            if (this.measuredElement.length != 0) {
                $('html,body').scrollTop(this.measuredElement.offset().top - 102);
            }
        }
    };

    NextendExpertMode.prototype.enable = function (needSet) {
        this.measureElement();
        this.changeStyle('');
        this.set(1, needSet);
        this.switches.addClass('n2-active');
        $('html').addClass('n2-in-expert');

        if (needSet) {
            this.scrollToMeasured();
        }
    };

    NextendExpertMode.prototype.disable = function (needSet) {
        this.measureElement();
        this.changeStyle('.n2-expert{display: none !important;}');
        this.set(0, needSet);
        this.switches.removeClass('n2-active');
        $('html').removeClass('n2-in-expert');

        if (needSet) {
            this.scrollToMeasured();
        }
    };

    NextendExpertMode.prototype.changeStyle = function (style) {
        this.style.html('<style type="text/css">' + style + '</style>');
    };

    scope.NextendExpertMode = NextendExpertMode

})(n2, window);
/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    factory(n2);
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
            ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function (elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function (elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function (fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ('detail'      in orgEvent) {
            deltaY = orgEvent.detail * -1;
        }
        if ('wheelDelta'  in orgEvent) {
            deltaY = orgEvent.wheelDelta;
        }
        if ('wheelDeltaY' in orgEvent) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if ('wheelDeltaX' in orgEvent) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) {
            clearTimeout(nullLowestDeltaTimeout);
        }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

;
(function ($, scope) {
    var _registered = false;

    function registerBeforeUnload() {
        if (!_registered) {
            $(window).on('beforeunload', function (e) {
                if (nextend.askToSave && _registered + 180000 < $.now()) {
                    var data = {
                        changed: false
                    };
                    $(window).triggerHandler('n2-before-unload', data);

                    if (data.changed) {
                        var confirmationMessage = n2_('The changes you made will be lost if you navigate away from this page.');

                        (e || window.event).returnValue = confirmationMessage;
                        return confirmationMessage;
                    }
                }
            });
            _registered = $.now();
        }
    }

    function NextendForm(id, url, values) {
        this.form = $('#' + id)
            .on('saved', $.proxy(this.onSaved, this))
            .data('form', this);

        this.onSaved();

        this.url = url;

        this.values = values;

        // Special fix for Joomla 1.6, 1.7 & 2.5. Speedy save!
        if (typeof document.formvalidator !== "undefined") {
            document.formvalidator.isValid = function () {
                return true;
            };
        }

        $(window).on('n2-before-unload', $.proxy(this.onBeforeUnload, this));
        registerBeforeUnload();

        $('input, textarea').on('keyup', function (e) {
            if (e.which == 27) {
                e.target.blur();
                e.stopPropagation();
            }
        });
    };

    NextendForm.prototype.onBeforeUnload = function (e, data) {
        if (!data.changed && this.isChanged()) {
            data.changed = true;
        }
    };

    NextendForm.prototype.isChanged = function () {
        this.form.triggerHandler('checkChanged');
        if (this.serialized != this.form.serialize()) {
            return true;
        }
        return false;
    };


    NextendForm.prototype.onSaved = function () {
        this.serialized = this.form.serialize();
    };

    NextendForm.submit = function (query) {
        nextend.askToSave = false;
        setTimeout(function () {
            n2(query).submit();
        }, 300);
        return false;
    };

    scope.NextendForm = NextendForm;

    $(window).ready(function () {
        $('input[data-disabled]').on('focus', function () {
            this.blur();
        });
    });


})(n2, window);
;
(function ($, scope) {

    function NextendElement() {
        this.connectedField = null;
        this.element.data('field', this);
    };

    NextendElement.prototype.triggerOutsideChange = function () {
        this.element.triggerHandler('outsideChange', this);
        this.element.triggerHandler('nextendChange', this);
    };

    NextendElement.prototype.triggerInsideChange = function () {
        this.element.triggerHandler('insideChange', this);
        this.element.triggerHandler('nextendChange', this);
    };

    NextendElement.prototype.focus = function (shouldOpen) {
        if(this.connectedField){
            this.connectedField.focus(shouldOpen);
        }
    };

    scope.NextendElement = NextendElement;


    function NextendElementContextMenu(selector, type) {
        $.contextMenu({
            selector: selector,
            className: 'n2',
            build: function ($triggerElement, e) {

                var items = {};
                items['copy'] = {name: "Copy", icon: "copy"};


                var copied = $.jStorage.get(type + 'copied');

                if (copied !== null) {
                    items['paste'] = {
                        name: "Paste",
                        icon: "paste",
                        callback: function () {
                            $(this).find('input[type="hidden"]').data('field').insideChange(copied);
                        }
                    }
                }

                return {
                    animation: {duration: 0, show: 'show', hide: 'hide'},
                    zIndex: 1000000,
                    callback: function (key, options) {
                        $.jStorage.set(type + 'copied', $(this).find('input[type="hidden"]').val());
                    },
                    items: items
                };
            }
        });
    };

    scope.NextendElementContextMenu = NextendElementContextMenu;

})(n2, window);

(function ($, scope) {

    function NextendElementText(id) {
        this.element = $('#' + id).on({
            focus: $.proxy(this._focus, this),
            blur: $.proxy(this._blur, this),
            change: $.proxy(this.change, this)
        });

        this.tagName = this.element.prop('tagName');

        this.parent = this.element.parent();

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementText.prototype = Object.create(NextendElement.prototype);
    NextendElementText.prototype.constructor = NextendElementText;


    NextendElementText.prototype._focus = function () {
        this.parent.addClass('focus');

        if (this.tagName != 'TEXTAREA') {
            this.element.on('keypress.n2-text', $.proxy(function (e) {
                if (e.which == 13) {
                    this.element.off('keypress.n2-text');
                    this.element.trigger('blur');
                }
            }, this));
        }
    };

    NextendElementText.prototype._blur = function () {
        this.parent.removeClass('focus');
    };

    NextendElementText.prototype.change = function () {

        this.triggerOutsideChange();
    };

    NextendElementText.prototype.insideChange = function (value) {
        this.element.val(value);

        this.triggerInsideChange();
    };

    NextendElementText.prototype.focus = function (shouldOpen) {
        if (this.connectedField) {
            this.connectedField.focus(shouldOpen);
        } else if (shouldOpen) {
            this.element.focus().select();
        }
    };

    scope.NextendElementText = NextendElementText;

})(n2, window);
(function ($, scope) {

    function NextendElementAutocomplete(id, tags) {
        this.tags = tags;
        this.element = $('#' + id).data('autocomplete', this);
        this.element.on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).nextendAutocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).nextendAutocomplete({
            minLength: 0,
            position: {
                my: "left top-2",
                of: this.element.parent(),
                collision: 'flip'
            },
            source: $.proxy(function (request, response) {
                var terms = request.term.split(/,/),
                    filtered = [];

                $.each(this.tags, function (key, value) {
                    if (-1 === terms.indexOf(value)) {
                        filtered.push(value);
                    }
                });
                response(filtered);
            }, this),
            focus: function () {
                // prevent value inserted on focus
                return false;
            },
            select: function (event, ui) {
                var terms = this.value.split(/,/);
                terms.pop();
                terms.push(ui.item.value);
                terms.push("");
                this.value = terms.join(",");
                $(this).trigger('change').nextendAutocomplete("search");
                return false;
            }
        }).click(function () {
            $(this).nextendAutocomplete("search");
        });

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));
    };

    NextendElementAutocomplete.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.element.val('').trigger('change');
    };

    NextendElementAutocomplete.prototype.setTags = function (tags) {
        this.tags = tags;
    };

    scope.NextendElementAutocomplete = NextendElementAutocomplete;

    function NextendElementAutocompleteSimple(id, values) {
        this.element = $('#' + id).data('autocomplete', this);
        this.element.nextendAutocomplete({
            //appendTo: this.element.parent(),
            appendTo: 'body',
            minLength: 0,
            position: {
                my: "center top",
                at: "center bottom",
                collision: 'flip'
            },
            source: function (request, response) {
                response(values);
            },
            select: function (event, ui) {
                $(this).val(ui.item.value).trigger('change');
                return false;
            }
        }).click(function () {
            $(this).nextendAutocomplete("search", "");
        });
    };

    scope.NextendElementAutocompleteSimple = NextendElementAutocompleteSimple;

    function NextendElementAutocompleteSlider(id, properties) {
        this.localChange = false;
        this.element = $('#' + id).data('autocomplete', this);
        var $parent = this.element.parent().on({
            'mouseenter.n2slider': $.proxy(this.startSlider, this, properties)
        });
        var $units = $parent.siblings('.n2-form-element-units').find('> input');
        if (properties.units && $units.length) {
            var units = properties.units;
            $units.on('nextendChange', $.proxy(function () {
                properties.min = units[$units.val() + 'min'];
                properties.max = units[$units.val() + 'max'];
                if (this.slider) {
                    this.slider.slider("option", "min", properties.min);
                    this.slider.slider("option", "max", properties.max);
                }
            }, this));
        }
    };

    NextendElementAutocompleteSlider.prototype.startSlider = function (properties, e) {
        this.element.parent().off('.n2slider');
        if (!this.slider) {
            this.slider = $('<div></div>')
                .appendTo($('<div class="n2-ui-slider-container"></div>').insertAfter(this.element))
                .slider($.extend({
                    start: $.proxy(function () {
                        this.element.parent().addClass('n2-active');
                    }, this),
                    stop: $.proxy(function () {
                        this.element.parent().removeClass('n2-active');
                    }, this),
                    slide: $.proxy(function (e, ui) {
                        this.localChange = true;
                        this.element.val(ui.value).trigger('change');
                        this.localChange = false;
                    }, this)
                }, properties));

            if (typeof this.slider[0].slide !== 'undefined') {
                this.slider[0].slide = null;
            }

            this.element.on('insideChange', $.proxy(function () {
                if (!this.localChange) {
                    var val = this.element.val();
                    if (val == parseFloat(val)) {
                        this.slider.slider('value', parseFloat(this.element.val()));
                    }
                }
            }, this));
        }
        this.slider.slider('value', parseFloat(this.element.val()));
    }

    scope.NextendElementAutocompleteSlider = NextendElementAutocompleteSlider;

})(n2, window);
;(function ($, scope) {

    function BasicCSS(id, ajaxUrl) {
        this.underActivate = false;
        this.inPresetList = false;
        this.$container = $('#' + id);
        this.ajaxUrl = ajaxUrl;

        this.throttleSetTimeout = null;
        this.throttleExitTimeout = null;

        this.storage = {};

        this.assets = {
            font: new BasicCSSFont(this),
            style: new BasicCSSStyle(this)
        }


        this.$preset = $('<div id="n2-tab-basiccsspreset"><div class="n2-editor-header n2-h2 n2-uc"><span class="n2-css-name n2-css-name-label">' + n2_('Preset') + '</span></div></div>').prependTo(this.$container);


        $('<div class="n2-ss-editor-window-notice n2-ss-responsive-helper n2-h5">NOTE: Layer design changes applies to each device. Watch <a href="https://youtu.be/phKaWqmwXA0" target="_blank">video tutorial</a> to learn responsive tools.</div>').prependTo(this.$container);

        var presetRightButtons = $('<div class="n2-ss-button-container"></div>').insertAfter(this.$preset.find('.n2-css-name'));
        $('<a class="n2-button n2-button-icon n2-button-s n2-radius-s n2-button-darker n2-h5 n2-uc" href="#" data-n2tip="Reset design to default"><i class="n2-i n2-i-reset2"></i></a>')
            .on('click', $.proxy(function (e) {
                e.preventDefault();
                this.exitPresetList(this.defs, e);
            }, this)).appendTo(presetRightButtons);

        $('<a class="n2-basiccss-save n2-button n2-button-icon n2-button-s n2-radius-s n2-button-darker n2-h5 n2-uc" href="#" data-n2tip="Save design as new preset"><i class="n2-i n2-i-save"></i></a>')
            .on('click', $.proxy(function (e) {
                e.preventDefault();

                this.saveAsNew();
            }, this)).appendTo(presetRightButtons);


        this.$presets = $('<div id="n2-tab-basiccsspresets"></div>').appendTo(this.$container);


        $('<a class="n2-basiccss-choose n2-button n2-button-icon n2-button-s n2-radius-s n2-button-green n2-h5 n2-uc" data-n2tip="Load design" href="#"><i class="n2-i n2-i-addlayer2"></i></a>')
            .on('click', $.proxy(function (e) {
                e.preventDefault();

                this.showList();
            }, this))
            .appendTo(presetRightButtons);

        $('<a class="n2-basiccss-back n2-button n2-button-icon n2-button-s n2-radius-s n2-button-grey n2-h5 n2-uc" href="#"><i class="n2-i n2-i-closewindow"></i></a>')
            .on('click', $.proxy(function (e) {
                e.preventDefault();
                this.exitPresetList(false, e);
            }, this))
            .appendTo(presetRightButtons);

        nextend.basicCSS = this;
    }

    BasicCSS.prototype.showList = function () {
        this.inPresetList = true;
        this.lastState = this.serialize();

        $.when(this.loadType()).done($.proxy(function (data) {
            this.$presets.append(this.storage[this.type]);

            this.$container.addClass('n2-basiccss-show-preset-list');
        }, this));


        this.$presets.on('mouseleave', $.proxy(function () {
            this.throttledUnSerialize(this.lastState);
        }, this));
    }

    BasicCSS.prototype.activate = function (type, values, structure) {

        if (this.inPresetList) {
            this.exitPresetList(false);
        }

        this.underActivate = true;
        if (this.type && this.type !== type && typeof this.storage[this.type] !== 'undefined') {
            this.storage[this.type].detach();
        }

        var hasVisuals = false;
        this.defs = {
            font: [],
            style: []
        };
        this.type = type;
        for (var k in this.assets) {
            for (var i = 0; i < structure[k].length; i++) {
                this.defs[k][structure[k][i].name] = structure[k][i].def;
            }
            this.assets[k].load(values, structure[k]);
            hasVisuals = hasVisuals || this.assets[k].hasVisuals;
        }
        $('#n2-ss-slide-sidebar').toggleClass('n2-ss-has-design-option', hasVisuals);
        if (!hasVisuals) {
            if ($('#n2-ss-slide-sidebar .n2-sidebar-tab-switcher .n2-td[data-tab="style"]').hasClass('n2-active')) {
                $('#n2-ss-slide-sidebar .n2-sidebar-tab-switcher .n2-td[data-tab="item"]').trigger('click');
            }
        }
        this.underActivate = false;
    }

    BasicCSS.prototype.deActivate = function () {

        if (this.inPresetList) {
            this.exitPresetList(false);
        }
    }

    BasicCSS.prototype.serialize = function () {
        var serialized = {};
        for (var k in this.assets) {
            serialized[k] = this.assets[k].serialize();
        }
        return serialized;
    }

    BasicCSS.prototype.unSerialize = function (serialized) {
        for (var k in this.assets) {
            this.assets[k].unSerialize(serialized[k]);
        }
    }

    BasicCSS.prototype.throttledUnSerialize = function (serialized) {
        this._addThrottledRenderTimeout($.proxy(this.unSerialize, this, serialized));
    };

    BasicCSS.prototype.saveAsNew = function (name) {
        if (typeof this.saveAsModal == 'undefined') {
            var that = this;
            this.saveAsModal = new NextendModal({
                zero: {
                    size: [
                        500,
                        220
                    ],
                    title: n2_('Save as'),
                    close: true,
                    content: '<form class="n2-form"></form>',
                    controls: ['<a href="#" class="n2-button n2-button-normal n2-button-l n2-radius-s n2-button-green n2-uc n2-h4">' + n2_('Save as new') + '</a>'],
                    fn: {
                        show: function () {

                            var button = this.controls.find('.n2-button'),
                                form = this.content.find('.n2-form').on('submit', function (e) {
                                    e.preventDefault();
                                    button.trigger('click');
                                }).append(this.createInput(n2_('Name'), 'n2-visual-name', 'width: 446px;')),
                                nameField = this.content.find('#n2-visual-name').focus();

                            button.on('click', $.proxy(function (e) {
                                e.preventDefault();
                                var name = nameField.val();
                                if (name == '') {
                                    nextend.notificationCenter.error(n2_('Please fill the name field!'));
                                } else {
                                    NextendAjaxHelper.ajax({
                                            type: "POST",
                                            url: NextendAjaxHelper.makeAjaxUrl(that.ajaxUrl, {
                                                nextendaction: 'addVisual'
                                            }),
                                            data: {
                                                type: that.type,
                                                value: Base64.encode(JSON.stringify({
                                                    name: name,
                                                    data: that.serialize()
                                                }))
                                            },
                                            dataType: 'json'
                                        })
                                        .done($.proxy(function (response) {

                                            $.when(that.loadType()).done(function () {
                                                that.addVisual(response.data.visual).prependTo(that.storage[that.type]);
                                            });
                                            this.hide(e);
                                        }, this));
                                }
                            }, this));
                        }
                    }
                }
            }, false);
        }
        this.saveAsModal.show();
    };

    BasicCSS.prototype.loadType = function () {
        if (typeof this.storage[this.type] === 'undefined') {
            var deferred = $.Deferred(),
                parseVisuals = $.proxy(function (visuals) {
                    this.storage[this.type] = $('<ul class="n2-list n2-h4"></ul>');
                    for (var i = 0; i < visuals.length; i++) {
                        this.addVisual(visuals[i]);
                    }
                    deferred.resolve();
                }, this);
            if (typeof window[this.type] === 'undefined') {
                this.storage[this.type] = deferred;
                NextendAjaxHelper.ajax({
                    type: "POST",
                    url: NextendAjaxHelper.makeAjaxUrl(this.ajaxUrl, {
                        nextendaction: 'loadVisuals'
                    }),
                    data: {
                        type: this.type
                    },
                    dataType: 'json'
                }).done($.proxy(function (response) {
                    parseVisuals(response.data.visuals);
                }, this));
            } else {
                parseVisuals(window[this.type]);
            }
        }
        return this.storage[this.type];
    }

    /**
     * loadType must be called for the actual type to be able to add visual!!!
     * @param visual
     * @returns {*}
     */
    BasicCSS.prototype.addVisual = function (visual) {
        var value = JSON.parse(Base64.decode(visual.value)),
            row = $('<li><a href="#">' + value.name + '</a></li>').on({
                mouseenter: $.proxy(function (value, e) {
                    this.throttledUnSerialize(value.data);
                }, this, value),
                click: $.proxy(function (data, e) {
                    e.preventDefault();
                    this.exitPresetList(data, e);
                }, this, value.data)
            }).appendTo(this.storage[this.type]);

        if (visual.id > 10000) {
            var actions = $('<span class="n2-actions"></span>').appendTo(row);

            $('<div class="n2-button n2-button-icon n2-button-s" data-n2tip="Overwrite preset"><i class="n2-i n2-i-save n2-i-grey-opacity"></i></div>').on('click', $.proxy(function (visualID, name, e) {
                e.stopPropagation();
                NextendAjaxHelper.ajax({
                    type: "POST",
                    url: NextendAjaxHelper.makeAjaxUrl(this.ajaxUrl, {
                        nextendaction: 'changeVisual'
                    }),
                    data: {
                        visualId: visualID,
                        value: Base64.encode(JSON.stringify({
                            name: name,
                            data: this.lastState
                        })),
                        type: this.type
                    },
                    dataType: 'json'
                }).done($.proxy(function (response) {
                    row.replaceWith(this.addVisual(response.data.visual));
                }, this));
            }, this, visual.id, value.name)).appendTo(actions);

            $('<div class="n2-button n2-button-icon n2-button-s"><i class="n2-i n2-i-delete n2-i-grey-opacity"></i></div>').on('click', $.proxy(function (visualID, e) {
                e.preventDefault();
                e.stopPropagation();
                NextendAjaxHelper.ajax({
                    type: "POST",
                    url: NextendAjaxHelper.makeAjaxUrl(this.ajaxUrl, {
                        nextendaction: 'deleteVisual'
                    }),
                    data: {
                        visualId: visualID,
                        type: this.type
                    },
                    dataType: 'json'
                }).done($.proxy(function (response) {
                    row.remove();
                }, this));
            }, this, visual.id)).appendTo(actions);

            nextend.tooltip.add(actions);
        }
        return row;
    }

    BasicCSS.prototype.exitPresetList = function (data, e) {
        if (this.throttleSetTimeout) {
            clearTimeout(this.throttleSetTimeout);
        }

        this.$presets.off('mouseleave');

        if (data) {
            this.inPresetList = false;
            this.unSerialize(data);
        } else {
            this.unSerialize(this.lastState);
        }
        this.$container.removeClass('n2-basiccss-show-preset-list');
        this.inPresetList = false;

    };

    BasicCSS.prototype._addThrottledRenderTimeout = function (cb) {
        if (this.throttleSetTimeout) {
            clearTimeout(this.throttleSetTimeout);
        }

        this.throttleSetTimeout = setTimeout(cb, 100);
    }

    BasicCSS.prototype._addThrottledExitTimeout = function (cb) {
        if (this.throttleExitTimeout) {
            clearTimeout(this.throttleExitTimeout);
        }

        this.throttleExitTimeout = setTimeout(cb, 100);
    }


    scope.NextendBasicCSS = BasicCSS;

    function BasicCSSSkeleton(manager) {
        this.hasVisuals = false;
        this.isInsideChange = false;
        this.isReload = false;
        this.manager = manager;
        this.$container = manager.$container.find('#n2-tab-basiccss' + this._singular);
        this.$visuals = this.$container.find('.n2-css-name');
        this.$visualsLabel = this.$visuals.find('.n2-css-name-label');
        this.$visualsList = this.$visuals.find('.n2-css-name-list');
        this.$tabsContainer = this.$container.find('.n2-css-tab');
        this.$reset = this.$container.find('.n2-css-tab-reset').on('click', $.proxy(function (e) {
            this.value[this.activeTab] = {};
            this._lazySave(e);
            this.activateTab(this.activeTab);
        }, this));
        this.$more = this.$container.find('.n2-basiccss-more').on('click', $.proxy(function (e) {
            e.preventDefault();
            this.visuals[this.activeVisual].field.show(e);
        }, this));

        this.activeVisual = 0;
        this.activeTab = 0;
        this.tabs = [];
    }

    BasicCSSSkeleton.prototype.loaded = function () {
        for (var k in this.form) {
            this.form[k].on({
                nextendChange: $.proxy(this.changeValue, this, k)
            });
        }
    }

    BasicCSSSkeleton.prototype.changeValue = function (name, e) {
        if (!this.isReload) {
            if (typeof this['_set' + name] == 'function') {
                this['_set' + name](this.value[this.activeTab], this.form[name].val());
            } else {
                this.value[this.activeTab][name] = this.form[name].val();
            }

            this._lazySave(e);
        }
    }

    BasicCSSSkeleton.prototype._lazySave = NextendDeBounce(function (e) {
        this.isInsideChange = true;
        var value = this.getBase64();
        this.visuals[this.activeVisual].field.save(e, value);
        this.visuals[this.activeVisual].value = value;
        this.isInsideChange = false;
    }, 50);

    BasicCSSSkeleton.prototype.save = function (data) {
        this.isInsideChange = true;
        for (var k in data) {
            this.visualsByName[k].field.save({}, data[k]);
            this.visualsByName[k].value = data[k];
        }
        this.isInsideChange = false;
    };

    BasicCSSSkeleton.prototype.getBase64 = function () {
        return Base64.encode(JSON.stringify({
            name: n2_('Static'),
            data: this.value
        }));
    };

    BasicCSSSkeleton.prototype.load = function (values, visuals) {
        this.hasVisuals = visuals.length > 0;
        this.$container.toggleClass('n2-css-has-' + this._singular, this.hasVisuals);
        if (this.hasVisuals) {
            this.visuals = [];
            this.visualsByName = {};

            this.$visualsList.html('');

            this.$visuals.toggleClass('n2-multiple', visuals.length > 1);
            for (var i = 0; i < visuals.length; i++) {
                var visual = visuals[i];
                this.visualsByName[visual.name] = {
                    value: values[visual.name],
                    mode: visual.mode,
                    field: visual.field
                }

                visual.field.element
                    .off('.basiccss')
                    .on('outsideChange.basiccss', $.proxy(this.loadSingleValue, this, i, visual.name));
                this.visuals.push(this.visualsByName[visual.name]);

                $('<span>' + visual.field.getLabel() + '</span>').on('click', $.proxy(function (i, e) {
                    this.activateVisual(i);
                    this.activateTab(0);
                }, this, i)).appendTo(this.$visualsList);
            }

            this.activateVisual(0);

            this.activateTab(0);
        }
    }

    BasicCSSSkeleton.prototype.loadSingleValue = function (i, k, e) {
        if (!this.isInsideChange) {
            this.visuals[i].value = this.visuals[i].field.element.val();
            if (this.activeVisual == i) {
                this.activateVisual(i);
                this.activateTab(this.activeTab);
            }
        }
    }

    BasicCSSSkeleton.prototype.activateVisual = function (index) {
        this.activeVisual = index;

        this.$visualsLabel.html(this.visuals[index].field.getLabel());

        nextend[this._singular + 'Manager'].getDataFromController(this.visuals[index].value, {previewMode: this.visuals[index].mode}, $.proxy(function (value, tabs) {
            this.value = value;
            this.setTabs(tabs);
        }, this));
    }

    BasicCSSSkeleton.prototype.activateTab = function (index) {
        this.isReload = true;
        this.activeTab = index;
        this.$container.toggleClass('n2-css-show-reset', index != 0);
        var value = (index == 0 ? this.value[index] : $.extend({}, this.value[0], this.value[index]));
        for (var k in value) {
            if (typeof this.form[k] !== 'undefined') {
                if (typeof this['_transform' + k] == 'function') {
                    this.form[k].data('field').insideChange(this['_transform' + k](value[k]));
                } else {
                    this.form[k].data('field').insideChange(value[k]);
                }
            }
        }

        this.$tabs.removeClass('n2-active').eq(index).addClass('n2-active');
        this.isReload = false;
    }

    BasicCSSSkeleton.prototype.setTabs = function (tabs) {
        this.tabs = tabs;
        this.$tabsContainer.html('');

        for (var i = 0; i < tabs.length; i++) {
            $('<span>' + tabs[i] + '</span>').on('click', $.proxy(function (i, e) {
                this.activateTab(i);
            }, this, i)).appendTo(this.$tabsContainer);
        }
        this.$tabs = this.$tabsContainer.find('span');
    }

    BasicCSSSkeleton.prototype.serialize = function () {
        if (this.hasVisuals) {
            var serialized = {};
            for (var k in this.visualsByName) {
                serialized[k] = this.visualsByName[k].value;
            }
            return serialized;
        }
        return {};
    }

    BasicCSSSkeleton.prototype.unSerialize = function (serialized) {
        for (var k in serialized) {
            this.visualsByName[k].field.save({}, serialized[k]);
            this.visualsByName[k].value = serialized[k];
        }
    }

    function BasicCSSFont() {
        this._singular = 'font';
        this._prular = 'fonts';
        BasicCSSSkeleton.prototype.constructor.apply(this, arguments);


        this.form = {
            afont: $('#layerfamily'),
            color: $('#layercolor'),
            size: $('#layersize'),
            bold: $('#layerweight'),
            lineheight: $('#layerlineheight'),
            align: $('#layertextalign').on('nextendChange', $.proxy(function (e) {
                if (!this.manager.underActivate && !this.manager.inPresetList) {
                    switch ($(e.currentTarget).val()) {
                        case 'left':
                        case 'justify':
                            nextend.smartSlider.layerManager.getSelectedLayer().setProperty('align', 'left', 'layer');
                            break;
                        case 'right':
                            nextend.smartSlider.layerManager.getSelectedLayer().setProperty('align', 'right', 'layer');
                            break;
                        default:
                            nextend.smartSlider.layerManager.getSelectedLayer().setProperty('align', 'center', 'layer');
                            break;
                    }
                }
            }, this)),
            underline: $('#layerdecoration'),
            italic: $('#layerdecoration')

        }

        this.loaded();
    }

    BasicCSSFont.prototype = Object.create(BasicCSSSkeleton.prototype);
    BasicCSSFont.prototype.constructor = BasicCSSFont;

    BasicCSSFont.prototype._transformsize = function (value) {
        return value.split('||').join('|*|');
    }

    BasicCSSFont.prototype._setsize = function (tab, value) {
        tab.size = value.replace('|*|', '||');
    }

    BasicCSSFont.prototype._transformbold = function (value) {
        return parseInt(value);
    }

    BasicCSSFont.prototype._setbold = function (tab, value) {
        tab.bold = parseInt(value);
    }

    BasicCSSFont.prototype._transformunderline = function (value) {
        return [
            this.value[this.activeTab].italic == 1 ? 'italic' : '',
            value == 1 ? 'underline' : ''
        ].join('||');
    }

    BasicCSSFont.prototype._setunderline = function (tab, value) {
        var values = value.split('||');
        tab.underline = (values[1] == 'underline' ? 1 : 0);
    }

    BasicCSSFont.prototype._transformitalic = function (value) {
        return [
            value == 1 ? 'italic' : '',
            this.value[this.activeTab].underline == 1 ? 'underline' : ''
        ].join('||');
    }

    BasicCSSFont.prototype._setitalic = function (tab, value) {
        var values = value.split('||');
        tab.italic = (values[0] == 'italic' ? 1 : 0);
    }


    function BasicCSSStyle() {
        this._singular = 'style';
        this._prular = 'styles';
        BasicCSSSkeleton.prototype.constructor.apply(this, arguments);


        this.form = {
            backgroundcolor: $('#layerbackgroundcolor'),
            opacity: $('#layeropacity'),
            padding: $('#layerpadding'),
            border: $('#layerborder'),
            borderradius: $('#layerborderradius')
        }

        this.loaded();
    }

    BasicCSSStyle.prototype = Object.create(BasicCSSSkeleton.prototype);
    BasicCSSStyle.prototype.constructor = BasicCSSStyle;

})(n2, window);
;
(function ($, scope) {

    function NextendElementCheckbox(id, values) {
        this.separator = '||';

        this.element = $('#' + id);

        this.values = values;

        this.checkboxes = this.element.parent().find('.n2-checkbox-option');

        this.states = this.element.val().split(this.separator);

        for (var i = 0; i < this.checkboxes.length; i++) {
            if (typeof this.states[i] === 'undefined' || this.states[i] != this.values[i]) {
                this.states[i] = '';
            }

            this.checkboxes.eq(i).on('click', $.proxy(this.switchCheckbox, this, i));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementCheckbox.prototype = Object.create(NextendElement.prototype);
    NextendElementCheckbox.prototype.constructor = NextendElementCheckbox;


    NextendElementCheckbox.prototype.switchCheckbox = function (i) {
        if (this.states[i] == this.values[i]) {
            this.states[i] = '';
            this.setSelected(i, 0);
        } else {
            this.states[i] = this.values[i];
            this.setSelected(i, 1);
        }
        this.element.val(this.states.join(this.separator));

        this.triggerOutsideChange();
    };

    NextendElementCheckbox.prototype.insideChange = function (values) {

        var states = values.split(this.separator);

        for (var i = 0; i < this.checkboxes.length; i++) {
            if (typeof states[i] === 'undefined' || states[i] != this.values[i]) {
                this.states[i] = '';
                this.setSelected(i, 0);
            } else {
                this.states[i] = this.values[i];
                this.setSelected(i, 1);
            }

        }

        this.element.val(this.states.join(this.separator));

        this.triggerInsideChange();
    };

    NextendElementCheckbox.prototype.setSelected = function (i, state) {
        if (state) {
            this.checkboxes.eq(i)
                .addClass('n2-active');
        } else {
            this.checkboxes.eq(i)
                .removeClass('n2-active');
        }
    };


    scope.NextendElementCheckbox = NextendElementCheckbox;

})(n2, window);
;
(function ($, scope) {
    function NextendElementColor(id, alpha) {

        this.element = $('#' + id);

        if (alpha == 1) {
            this.alpha = true;
        } else {
            this.alpha = false;
        }

        this.element.n2spectrum({
            showAlpha: this.alpha,
            preferredFormat: (this.alpha == 1 ? "hex8" : "hex6"),
            showInput: false,
            showButtons: false,
            move: $.proxy(this, 'onMove'),
            showSelectionPalette: true,
            showPalette: true,
            maxSelectionSize: 6,
            localStorageKey: 'color',
            palette: [
                ['000000', '55aa39', '357cbd', 'bb4a28', '8757b2', '000000CC'],
                ['81898d', '5cba3c', '4594e1', 'd85935', '9e74c2', '00000080'],
                ['ced3d5', '27ae60', '01add3', 'e79d19', 'e264af', 'FFFFFFCC'],
                ['ffffff', '2ecc71', '00c1c4', 'ecc31f', 'ec87c0', 'FFFFFF80']
            ]
        })
            .on('change', $.proxy(this, 'onChange'));

        this.text = this.element.data('field');

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementColor.prototype = Object.create(NextendElement.prototype);
    NextendElementColor.prototype.constructor = NextendElementColor;

    NextendElementColor.prototype.onMove = function () {
        this.text.element.val(this.getCurrent());
        this.text.change();
    };

    NextendElementColor.prototype.onChange = function () {
        var current = this.getCurrent(),
            value = this.element.val();
        if (current != value) {
            this.element.n2spectrum("set", value);

            this.triggerInsideChange();
        }
    };

    NextendElementColor.prototype.insideChange = function (value) {
        this.element.val(value);

        this.onChange();
    };

    NextendElementColor.prototype.getCurrent = function () {
        if (this.alpha) {
            return this.element.n2spectrum("get").toHexString8();
        }
        return this.element.n2spectrum("get").toHexString(true);
    };

    scope.NextendElementColor = NextendElementColor;

})(n2, window);
;
(function ($, scope) {

    function NextendElementEnabled(id, selector) {
        this.element = $('#' + id).on('nextendChange', $.proxy(this.onChange, this));
        this.hide = this.element.closest('tr').nextAll().add(selector);
        this.onChange();
    }

    NextendElementEnabled.prototype.onChange = function () {
        var value = parseInt(this.element.val());

        if (value) {
            this.hide.css('display', '');
        } else {
            this.hide.css('display', 'none');
        }

    };

    scope.NextendElementEnabled = NextendElementEnabled;

})(n2, window);

(function ($, scope, undefined) {

    function NextendElementFolders(id, parameters) {
        this.element = $('#' + id);

        this.field = this.element.data('field');

        this.parameters = parameters;

        this.editButton = $('#' + id + '_edit')
            .on('click', $.proxy(this.edit, this));

        this.button = $('#' + id + '_button').on('click', $.proxy(this.open, this));

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementFolders.prototype = Object.create(NextendElement.prototype);
    NextendElementFolders.prototype.constructor = NextendElementFolders;

    NextendElementFolders.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.val('');
    };

    NextendElementFolders.prototype.val = function (value) {
        this.element.val(value);
        this.triggerOutsideChange();
    };

    NextendElementFolders.prototype.open = function (e) {
        e.preventDefault();
        nextend.imageHelper.openFoldersLightbox($.proxy(this.val, this));
    };

    scope.NextendElementFolders = NextendElementFolders;
})(n2, window);
;
(function ($, scope) {

    function NextendElementFont(id, parameters) {
        this.element = $('#' + id);

        this.parameters = parameters;

        this.defaultSetId = parameters.set;

        this.element.parent()
            .on('click', $.proxy(this.show, this));

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));

        this.name = this.element.siblings('input');

        nextend.fontManager.$.on('visualDelete', $.proxy(this.fontDeleted, this));

        this.updateName(this.element.val());

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementFont.prototype = Object.create(NextendElement.prototype);
    NextendElementFont.prototype.constructor = NextendElementFont;


    NextendElementFont.prototype.getLabel = function () {
        return this.parameters.label;
    }

    NextendElementFont.prototype.show = function (e) {
        e.preventDefault();
        if (this.parameters.style != '') {
            nextend.fontManager.setConnectedStyle(this.parameters.style);
        }
        if (this.parameters.style2 != '') {
            nextend.fontManager.setConnectedStyle2(this.parameters.style2);
        }
        if (this.defaultSetId) {
            nextend.fontManager.changeSetById(this.defaultSetId);
        }
        nextend.fontManager.show(this.element.val(), $.proxy(this.save, this), {
            previewMode: this.parameters.previewmode,
            previewHTML: this.parameters.preview
        });
    };

    NextendElementFont.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.val('');
    };

    NextendElementFont.prototype.save = function (e, value) {

        nextend.fontManager.addVisualUsage(this.parameters.previewmode, value, window.nextend.pre);

        this.val(value);
    };

    NextendElementFont.prototype.val = function (value) {
        this.element.val(value);
        this.updateName(value);
        this.triggerOutsideChange();
    };

    NextendElementFont.prototype.insideChange = function (value) {
        this.element.val(value);

        this.updateName(value);

        this.triggerInsideChange();
    };

    NextendElementFont.prototype.updateName = function (value) {
        $.when(nextend.fontManager.getVisual(value))
            .done($.proxy(function (font) {
                this.name.val(font.name);
            }, this));
    };
    NextendElementFont.prototype.fontDeleted = function (e, id) {
        if (id == this.element.val()) {
            this.insideChange('');
        }
    };

    NextendElementFont.prototype.renderFont = function () {
        var font = this.element.val();
        nextend.fontManager.addVisualUsage(this.parameters.previewmode, font, '');
        return nextend.fontManager.getClass(font, this.parameters.previewmode);
    };

    scope.NextendElementFont = NextendElementFont;

    $(window).ready(function () {
        new NextendElementContextMenu('.n2-form-element-font', 'font');
    });

})(n2, window);
;
(function ($, scope) {
    var modal = null,
        callback = function () {
        },
        _icons = [123,34,83,104,97,112,101,115,34,58,91,34,60,115,118,103,32,120,109,108,110,115,61,92,34,104,116,116,112,58,47,47,119,288,46,119,51,46,111,114,103,47,50,48,299,47,269,103,279,32,118,105,101,119,66,111,120,278,34,48,32,315,49,299,32,318,48,304,32,119,105,100,116,104,313,51,50,304,104,101,105,103,281,330,332,34,62,60,114,101,99,116,324,326,328,313,321,333,335,337,116,351,299,279,47,342,301,270,62,34,44,267,302,272,274,276,313,281,283,285,287,289,291,293,295,297,299,48,362,303,34,305,307,309,311,313,315,317,319,352,386,348,327,329,279,331,353,336,338,400,340,342,99,105,114,99,108,101,32,99,312,279,53,322,386,99,121,313,418,304,114,313,52,54,359,361,302,364,366,268,270,369,275,277,279,373,284,286,288,119,290,292,294,296,298,300,302,304,306,308,310,416,314,316,320,394,358,396,325,398,339,402,355,466,341,60,112,97,328,32,100,313,77,32,418,459,76,459,321,32,482,484,395,360,60,384,433,367,436,273,438,372,282,442,376,445,378,448,381,451,270,453,388,456,391,483,461,419,32,397,350,405,467,404,34,401,470,472,474,476,279,478,480,484,482,392,485,460,392,430,490,432,365,493,271,495,371,440,498,375,444,446,379,449,382,384,507,455,390,279,531,487,462,514,464,516,520,340,32,334,403,356,517,522,473,104,475,477,459,480,486,319,315,576,393,419,489,491,538,435,540,370,439,280,544,443,377,447,380,450,383,452,386,454,389,457,556,512,323,560,399,562,518,567,607,569,524,573,484,575,459,578,511,581,431,363,584,368,541,588,441,545,592,548,504,596,506,598,508,554,458,580,533,604,349,606,521,564,354,519,521,342,523,571,525,34,478,531,579,481,618,535,583,434,623,587,497,374,591,501,593,549,505,385,387,553,601,618,638,463,640,469,643,566,469,647,570,572,526,533,655,557,617,534,34,582,537,659,494,661,543,663,500,547,503,595,551,633,671,510,637,395,559,676,568,678,468,568,681,612,684,637,654,529,616,657,692,539,437,542,589,697,546,502,594,550,597,670,600,705,685,707,515,641,563,565,712,610,714,649,613,512,532,717,685,619,536,621,693,586,496,696,499,728,666,630,702,733,509,555,673,49,49,429,386,605,677,741,645,56,279,744,683,651,480,48,76,484,50,57,782,319,56,55,76,528,768,76,315,788,793,32,784,90,776,490,648,620,103,492,585,724,625,590,698,729,667,631,669,599,764,636,320,768,674,738,330,775,386,773,609,646,471,682,650,77,315,418,76,784,316,76,788,836,767,54,479,781,838,321,834,57,533,799,470,47,802,752,804,34,93,366,87,101,98,32,65,112,112,108,105,99,473,105,111,110,32,73,99,870,263,265,723,771,710,825,677,815,635,531,298,52,56,797,48,887,304,624,662,758,628,700,731,632,777,830,49,56,50,55,32,51,49,52,113,315,51,53,45,52,51,32,55,56,108,45,54,331,32,922,50,118,55,54,56,104,331,48,113,50,841,315,52,53,320,57,116,49,847,938,45,943,32,945,938,940,104,45,56,57,54,113,45,935,316,914,913,943,116,946,57,961,940,967,945,943,931,298,118,45,928,919,921,331,978,50,957,915,914,51,984,975,888,48,958,916,902,45,51,54,46,53,116,51,56,946,55,996,948,985,52,104,908,48,56,934,916,937,916,52,998,888,49,1002,939,902,906,995,53,122,721,753,878,709,610,711,645,563,883,672,315,886,888,1037,892,695,726,895,665,629,701,597,900,477,1018,57,50,906,53,926,767,298,910,842,993,52,32,954,964,56,841,54,48,996,946,48,292,939,979,955,1003,318,1069,1075,962,1068,1080,1072,993,50,953,54,921,1081,1060,953,847,51,52,1091,1062,1087,1067,1076,1071,1069,923,1079,1070,996,113,318,939,317,1051,906,57,974,53,51,55,920,976,797,1115,927,48,57,1058,418,1060,1062,941,1086,924,1089,318,1072,906,1085,1079,460,1078,1023,1104,1082,1101,1085,1065,1088,1101,1094,954,906,1147,847,1144,1098,1020,1100,913,1102,1139,1077,53,1106,48,1108,940,1052,51,1112,45,955,55,910,993,49,968,53,1023,116,52,966,912,996,108,56,979,50,1175,1106,1085,1061,50,1000,1061,52,531,929,797,56,116,1190,924,56,1025,690,803,805,368,879,1030,881,710,1034,735,1037,889,891,386,893,757,627,1044,897,668,800,648,778,77,49,1093,1061,955,933,989,902,962,907,1101,768,996,964,907,1158,1235,1156,1237,1020,1242,946,1242,906,1244,320,1248,1240,1003,1253,1245,49,1254,1244,1247,1257,1256,1236,1023,122,109,53,49,1052,1183,981,832,1085,999,32,57,48,964,1276,906,1010,45,53,1061,989,1276,993,977,1093,985,1093,981,1001,847,1268,1094,1166,1294,50,1094,908,1012,958,55,1083,53,53,1238,958,1185,946,1125,49,1125,50,1310,1306,1069,904,1133,1317,913,1319,1076,1314,1185,797,1310,1313,1036,1304,1069,1321,797,1331,939,1333,1315,1020,528,480,1338,479,1307,939,1323,1160,1036,298,946,1299,1111,57,108,1289,1149,51,113,1115,906,905,1359,1276,1202,691,1027,806,1207,642,1209,1030,1211,765,1036,890,1038,1375,1040,756,1042,1219,699,730,1222,611,745,526,1050,1052,768,331,974,976,957,923,994,921,847,54,1087,935,1376,1087,52,959,51,999,1282,1173,983,1183,924,55,1064,1023,948,56,1069,318,50,1003,1299,996,952,1292,887,960,1419,1318,52,1308,1065,1069,887,1069,1183,921,1170,1311,1000,1227,1188,935,993,1407,1115,993,989,54,966,1399,927,929,1058,1227,1275,1421,1420,997,1315,1003,57,1423,908,55,981,1455,1348,1078,1238,1462,1322,1458,1265,1232,1162,49,974,1422,53,920,1418,1290,1350,1332,1078,1168,975,1418,1094,1458,952,1464,1292,1467,1309,1461,1308,1471,1327,1105,317,1195,1464,1196,1061,943,991,1054,948,48,1173,907,905,841,1073,1345,1471,1177,841,1115,1003,52,1430,1073,1261,842,1421,1019,1004,1275,104,981,298,459,983,941,418,1318,1529,1523,1236,1522,1087,1521,1516,958,1471,934,1009,946,54,939,1193,49,1172,905,1283,984,533,1418,1313,1238,428,1482,1261,1265,1268,1000,1120,318,56,1010,315,1399,914,905,767,51,964,1578,948,55,1492,52,1465,957,1399,1427,1227,1576,964,1585,946,1227,974,1571,1573,921,841,1593,1578,942,1590,1585,1007,1585,981,1588,317,1455,1585,1177,1577,1227,1364,1204,622,436,1368,740,644,826,1033,634,1035,1214,1376,1215,807,894,1381,811,761,1047,828,715,651,1419,1506,55,1051,957,959,989,1523,946,977,54,1299,1088,1494,989,1000,904,1318,54,964,1321,921,1344,921,1000,57,1019,1282,1083,1268,1555,50,1667,999,1171,1315,317,904,1060,1015,912,1555,1295,113,1649,483,935,1421,1261,942,1534,53,888,57,1344,1200,1003,928,1200,1358,1544,841,928,1662,116,1692,1069,929,1076,1349,1690,320,1685,1322,1261,934,1351,911,1267,1710,1015,1268,1361,1523,1058,1315,1669,835,938,48,920,1649,916,1067,933,1647,320,1191,1506,1201,1026,854,754,821,880,1622,882,1625,1212,1375,1627,1378,725,626,664,1382,812,702,1048,1387,56,1175,917,55,1347,1327,958,1600,1288,922,1053,1061,1065,842,933,1173,1577,889,459,50,1680,1081,1053,1308,51,1780,908,1105,965,960,1193,1350,920,1523,966,1670,1403,1178,1119,956,1309,1710,914,1675,958,1173,989,1246,1785,997,1140,993,1344,1171,841,1085,298,1182,1087,418,1805,54,1296,1283,1643,1322,55,958,913,1426,1805,1557,1403,54,108,418,1085,1304,1327,1827,1306,1106,966,52,1409,1841,49,1177,944,49,108,1342,938,1336,48,1052,1304,113,1760,847,1760,428,1616,853,1205,1619,1029,1369,1744,1210,1746,1373,1627,1749,1216,1041,1752,810,760,1046,899,1636,1386,1638,331,1294,1441,1354,48,1400,1664,914,1315,921,1085,902,1179,903,1647,1092,1896,1404,1052,1683,1783,1813,1889,1836,1404,1512,918,965,1092,55,1577,57,57,1265,1054,1825,912,1170,1348,1765,1416,920,994,916,912,1770,1515,299,1106,917,320,1776,832,1645,1173,1312,847,1645,1232,50,1791,1178,990,1795,847,1794,1643,1389,1188,1802,1778,960,1806,1524,1580,1089,1180,1347,921,797,958,1728,1144,1818,993,1820,1810,909,1826,1303,1971,1828,993,1830,914,1832,1834,975,916,1338,961,1160,943,914,1843,1986,1846,948,1848,1850,1306,842,1854,1357,1857,479,1600,54,1861,658,1028,465,1743,679,1868,704,1870,1213,1039,1873,1379,1875,759,1045,898,385,1757,1638,1465,1017,1114,1357,1675,989,1836,1894,1308,943,1061,1449,1423,953,55,1970,1668,1427,57,1094,2032,1808,1304,1897,1501,1666,906,1418,1155,942,1300,1122,797,1158,1009,1522,985,1664,1003,1649,953,1173,1759,1332,1133,767,1261,1963,113,1939,948,1052,1778,1238,2035,1522,1017,1009,1416,1251,1133,2073,1245,1083,2082,460,1191,888,2075,1827,888,1404,1803,1105,54,1804,818,1526,298,116,2063,1336,1133,1683,56,1409,916,2058,1345,1415,1571,1076,1506,2052,2065,1155,1265,1084,1653,57,2024,320,53,966,1056,1528,1687,1303,1526,2125,1824,2067,2130,1594,1458,2128,1076,1268,1539,2098,55,2132,2138,1345,2141,2137,1458,818,2147,904,1566,1739,1863,271,1620,608,1745,2008,817,2010,1377,2012,1751,809,2015,1221,813,1223,829,477,1523,1017,2021,1596,1190,1673,1087,1985,938,1592,962,57,1492,2175,1922,1645,1020,1128,947,938,118,1568,1723,841,2189,997,950,971,2192,1644,948,2181,942,1841,1024,109,1805,56,52,2174,1598,1443,2178,1808,970,2182,1350,1281,1644,967,963,1787,2190,2192,1036,2194,944,2196,2187,1007,2175,2200,2215,2203,961,1474,1287,2209,2217,2176,965,961,2180,965,2183,2218,936,2220,2188,2227,2191,2175,2225,940,2201,1177,2229,2199,936,2201,965,2234,938,1567,1853,1061,976,1113,1268,2240,2213,2243,971,975,1453,2185,2248,1580,2250,1267,1271,2053,2254,2179,2197,2182,1393,2232,2202,2213,2117,1639,1594,1054,2210,2270,2204,2272,2216,2192,2276,2285,2278,2201,2251,1573,2282,2195,2256,951,2258,1535,2289,2204,1567,1193,1017,1313,926,2239,989,2212,2297,961,2244,2239,2301,2187,2303,2223,2252,2307,2227,2309,2198,2231,2259,2233,2290,109,2237,2274,56,2268,1271,1765,2241,2179,2324,2273,1393,2327,940,2329,53,118,2280,2193,2283,2228,951,2287,2337,2313,2235,109,999,1061,2367,2295,2321,2177,2323,2215,2245,1643,2247,2302,2222,2355,2224,2332,2255,2285,2230,1010,2288,2261,2339,2207,2238,2224,2346,2271,2349,2299,2184,2219,2378,2195,2305,2358,2308,2384,2311,937,2364,2263,2206,2237,2370,2393,2373,2181,2375,2352,2221,2400,2381,959,2403,2257,2336,2312,2388,2314,109,1568,1551,48,2191,1228,1058,1575,1585,818,1579,1594,1014,1583,2429,1733,1609,2438,1591,1576,2438,1596,2432,1448,1600,1825,1602,1578,1576,1007,1732,1682,2259,1581,1612,2435,1578,2001,722,1367,1865,1621,2006,1371,1869,2159,1748,2011,1630,1218,1753,1633,1878,2018,1880,1225,1050,1398,2039,1058,1789,1199,929,1117,1351,1465,1300,994,1251,1798,1199,1190,1662,1196,964,929,958,977,1227,2177,1396,994,1273,1649,1643,1654,2512,1702,2498,2489,2505,1247,956,2498,2488,2512,116,1195,1190,1849,2039,797,1692,924,1175,1660,1170,2520,888,2502,1190,2523,1038,919,2505,2495,934,2539,1196,1200,2464,1366,1206,2467,2156,2007,734,2009,2473,2161,2475,1380,2477,1877,2017,2168,1637,1226,2095,1017,1727,2486,2321,2535,2504,2494,2505,2511,1196,2499,2537,1662,2503,920,784,1490,2039,1547,1189,2485,2503,2575,2524,1197,2578,2525,2518,2518,2511,2503,2596,929,1198,1000,2489,2581,2584,2603,2581,2595,2534,2514,2600,2540,1396,2573,2534,1200,2503,2538,1196,2526,2585,2619,2584,2543,2587,2536,1197,2589,108,2541,2612,2544,2521,964,2521,2580,2527,2581,2528,2619,2543,2545,2521,2547,1740,2003,561,1866,2469,642,1372,2472,1426,2474,1217,2558,1876,2016,1384,2019,1226,1778,841,1051,2343,1820,1454,2057,1457,1308,1460,939,1471,1424,1299,118,1315,909,317,2666,1345,1458,2632,2147,2671,921,2036,1302,2669,1168,1498,1318,1458,1478,1299,2672,2685,960,2687,1518,2688,1472,996,974,2664,1232,2107,2690,1238,2697,1423,2675,2692,2676,1247,1456,2700,1459,2135,2671,2664,1467,1500,2670,1470,2667,2355,2675,1532,1299,1106,1012,2721,2714,1703,2724,1567,1199,331,1171,1233,1260,1263,1782,1259,1227,2067,1255,1251,2132,1252,1250,2744,1258,1415,2746,2751,1525,1241,2129,1246,1255,1916,1268,1062,2737,832,1290,1529,1276,1498,1780,1545,957,1283,960,1286,999,1924,983,1291,957,1050,1718,993,1914,2782,1301,2696,1335,1282,1344,2681,962,1312,1325,913,1659,1346,1343,1539,2065,2794,1837,1311,1330,1305,1693,2797,1337,1326,1329,2122,1348,1336,2806,1335,1723,1349,1295,1352,1354,915,1356,1358,1361,2824,1275,48,2642,2153,1742,1208,1867,2470,2158,885,2555,1629,2653,2014,896,1383,2167,1385,2482,2660,1275,1190,118,2703,1251,2699,2721,2681,1497,53,952,53,928,2780,2686,2717,2689,2715,2702,2712,1455,1471,1496,2716,1469,2855,2857,956,2720,2669,2732,1499,2669,2735,888,2764,1647,1234,2745,1244,1239,2743,2759,2750,1806,2749,2110,2891,2752,1076,2893,2883,2895,2884,1264,1266,2762,1270,1124,2766,1461,1081,1278,2770,1019,2772,1284,1168,2207,2777,1290,1404,2780,1641,2782,1297,2785,2821,2321,2788,1321,2791,2803,2928,1982,2796,1335,2798,1824,2800,2321,1326,1982,2810,1346,2789,1528,1320,2806,2809,1340,2812,2933,1334,1072,2816,1941,2368,1914,2820,1926,915,2823,1360,2959,1363,2152,1618,2154,2550,824,2832,2648,2471,2835,2651,2556,2838,2164,2840,1755,1635,1224,901,1641,1389,2265,1454,2531,2095,2528,2590,768,1189,945,1299,1020,1968,784,2535,1669,57,2600,1669,970,1968,2988,958,945,2095,1547,1598,902,1269,1958,915,1198,1711,1303,933,2778,1052,1704,1322,997,1183,1003,418,1358,1052,1404,797,1524,1275,1956,914,1499,2208,1786,2997,917,1300,1267,1076,2105,1658,2081,2331,318,1192,1784,2997,1238,318,1499,1390,1076,922,1099,3050,3047,1553,3046,1417,1827,1784,3053,1080,3050,1122,1418,3062,1510,1418,3056,2738,1778,1666,2690,2987,3038,962,2105,982,1273,1188,2867,3033,1459,1524,1168,1524,1358,1555,2821,2208,1282,1277,2529,1185,1106,428,460,1947,1711,1334,1277,56,2770,915,2117,1820,2026,929,2848,1193,1124,1273,1691,1277,2913,1280,2913,1287,3119,1276,2864,1231,1282,1165,1663,3093,2207,2826,1280,3130,2961,1203,1862,2963,2830,2646,742,2968,2834,1777,2836,823,2557,2839,1220,2841,1756,2481,830,2367,2122,3109,943,2281,908,1168,1119,2632,2107,1492,1642,946,2912,1670,1168,1278,990,1596,1642,1232,1229,990,1198,2057,1007,1642,908,1777,2107,1703,1119,1265,2367,2217,118,932,1454,1094,1947,2437,1670,1531,965,1494,3164,2057,3167,1670,974,3187,3171,1275,3173,3165,2182,3154,3096,3179,1275,3181,1670,3183,3091,1185,54,2356,2858,317,3189,3158,990,3193,3207,3163,2696,3197,1487,3199,1282,3218,3225,1793,1579,3205,3176,1466,1284,1119,3210,3190,3213,1296,2208,118,1230,3188,3157,1670,3159,3223,3162,3178,2321,3227,3233,974,3246,3202,3233,3174,1168,3236,3208,1036,3180,3241,2366,3091,2280,2191,1607,3247,3190,3250,2299,3252,3196,3166,3228,51,1596,3272,3259,3204,3175,3207,3253,3239,941,3241,2962,1741,2155,2966,2647,1624,3140,1374,2971,2837,1874,2974,3146,2976,1879,2978,1049,1190,393,2728,1475,1087,1762,1647,1845,3315,975,3077,1774,913,1762,1735,3320,3323,3325,3322,902,1555,3322,3314,3328,2761,1893,1122,2674,1315,1454,1143,3221,1534,1227,920,1233,1196,2780,1858,1296,847,57,1512,1852,460,1577,1274,318,1710,460,797,1808,3190,1643,2824,1168,1294,1009,1278,2266,49,2780,1052,2371,1168,3343,1407,1571,982,1189,2057,1512,1440,2194,1396,835,902,3313,2575,2494,1190,2672,3195,2696,3085,3059,1580,2067,2082,2580,1440,2208,982,2124,1087,2775,1116,3163,1173,318,1438,3356,1793,2670,3225,2321,962,1680,2212,3156,768,962,2502,2452,2026,3222,1941,1062,3222,1313,1803,479,1555,1399,1238,1558,55,1081,3362,3092,1986,3364,3343,1436,904,2859,958,1803,1484,1808,1654,1072,2692,2345,2902,3173,1985,3342,3385,2503,3096,1977,1111,1168,1951,3230,1070,2452,3375,1941,1070,3003,1427,315,3233,2053,1967,1275,3059,3465,1470,3085,2145,1984,2730,2420,1728,1227,2077,1170,1646,3192,3350,1287,320,2506,1904,1647,1700,2587,3383,930,1315,3237,1777,3028,3394,767,1686,1181,1199,902,909,1796,819,1279,1115,2627,2092,3408,2069,3248,3220,2874,1154,1710,1884,1294,1552,320,3435,1932,2088,1327,1684,953,1119,1311,797,1555,1717,3432,1808,2773,3435,1105,959,480,1842,3476,2627,1411,2175,1455,2072,3407,2680,1038,1072,2828,3135,3294,1031,1623,552,2553,2650,1628,3143,2973,727,2975,1634,3306,2169,526,1270,1096,2209,2872,3273,3340,3160,2684,2780,3278,1128,3256,3230,956,3284,3249,3235,2719,3238,3490,3211,51,1265,3215,316,3217,3588,320,3220,3249,3222,2216,2664,3413,990,3279,3586,3578,3589,3234,3175,3592,3209,3290,3182,109,3598,2430,3612,3602,3248,3191,3581,3607,3253,3609,3585,3168,3587,2738,3172,3590,3615,909,3288,3594,3267,1568,917,2673,3086,930,1091,3216,2039,2306,1315,1932,1193,3048,3028,904,1137,939,3059,104,2903,2730,1159,953,3654,1539,917,1801,996,3106,1465,3465,54,104,2171,1791,1440,1018,957,1825,2124,2452,49,952,1513,2780,1036,1001,818,1265,2662,1134,3110,3579,3604,3490,952,955,3245,887,1058,1436,2462,915,2029,1455,1153,952,2903,1599,1589,985,1690,1308,1601,1842,2701,1168,1054,3697,1798,3629,3205,3198,3281,3582,3613,3261,2182,1783,1353,3435,1551,1170,3428,1359,1558,922,116,1641,1765,972,3015,531,2919,935,116,2773,922,108,3529,768,1583,3730,3264,3289,3595,3558,3293,2965,3561,2157,3564,2970,3566,1750,808,3569,3304,3571,2480,3307,1387,1732,2148,2430,887,1231,3474,2308,2248,3684,3244,2237,1424,1175,3186,2208,3782,1970,2398,2202,2347,2355,914,3103,2738,32,1101,116,1101,1833,3314,1585,1061,2857,1553,2035,1931,1389,924,3597,3165,1449,1729,1854,1970,1691,3429,767,3684,2859,2696,3329,1729,1051,3230,1825,1449,1052,2857,3409,1269,3470,3466,3445,3072,767,3815,975,3817,3469,1825,1670,3048,1669,1261,3750,1985,2123,1123,1184,1700,1400,1657,1696,935,1849,1523,1214,3169,1960,3178,3260,3235,3287,3593,3266,1119,118,2316,1849,947,3008,1161,1062,818,3537,1308,905,3844,1024,3292,2644,739,2551,2833,3763,3141,3300,3567,3302,3768,1754,3770,2562,1881,1226,2318,1412,926,2171,3694,3626,3193,3187,3608,3723,3280,2864,3634,3203,3636,3262,2710,1810,3452,3635,3614,3262,3616,3265,3240,3619,1842,1520,1054,3634,1000,2043,1319,2278,1440,2997,1303,985,3930,1836,2043,943,1017,3934,1836,1319,917,1981,2027,3035,3940,2949,3945,2949,1980,940,3933,2088,985,1319,3812,1284,1723,1122,1070,1926,2101,2632,1641,1528,2867,999,1693,1132,1287,1661,3972,904,2867,3976,2048,1290,2101,460,3980,2814,3977,3967,1073,2101,3963,1280,3971,1071,1334,2877,3986,3982,3990,3669,3883,2466,2004,2831,3296,3563,816,3764,1872,3144,3303,3894,2479,3896,2482,1018,1020,1295,974,52,2580,1296,1057,946,1247,1594,2868,3159,2699,1492,1065,3822,3254,2732,1594,2721,4019,1134,3776,2780,3357,1376,1198,2062,1532,1722,2762,1036,1555,1197,1654,2827,109,1762,944,54,1920,3945,3460,1304,952,3435,3638,3483,1135,1238,1654,1458,2580,3414,3721,4023,767,4025,3630,2033,904,1494,2686,2705,1808,767,4034,1963,3359,3721,1251,3876,2669,3012,2714,4059,890,982,2377,3313,1302,2773,3417,1832,1842,3422,1722,3933,3474,1406,1016,3163,931,1166,4030,3605,3705,4081,1313,1164,4038,3178,3556,4088,3206,1399,2729,1777,1135,2100,990,3343,2181,1494,4070,1725,2668,2678,4107,1123,1534,911,2566,1198,1520,51,108,4099,460,1722,959,1683,2420,768,3758,3884,772,2967,3297,3888,3299,3765,2162,3767,1043,4010,2561,2843,901,1607,3602,1586,3372,2394,2215,2248,2379,2359,2201,2359,1787,2339,3621,2296,2242,2395,4170,2195,4172,2285,2260,3873,2426,2428,2710,3201,1510,2623,2590,2589,1584,1586,1801,960,2624,2632,2609,3200,1057,1940,2588,2625,2512,3674,1552,2627,912,2542,1709,1760,2541,1175,942,1396,1175,4210,3494,4208,3511,1194,2539,2599,2546,2340,331,2795,1449,1106,905,1842,3225,3435,1943,2091,3700,1734,2213,2353,2395,4237,914,4239,907,1547,3163,975,317,1918,1858,1179,2182,3215,4017,3700,2371,968,2284,2414,3215,934,2363,2353,2400,2171,1532,1186,3026,832,1092,1915,3999,2549,4001,3137,1032,4004,884,3889,4156,4008,3893,2478,4161,2658,1720,3365,1572,931,768,2780,993,958,1435,2632,1435,2580,1268,3031,3673,4250,977,1778,3025,955,4038,1814,1003,2590,2147,930,1240,108,2529,3154,3742,2761,1926,3776,903,2193,2379,2180,951,3163,1009,2376,1788,3792,2213,4017,4323,1448,2072,962,1670,1849,1407,1306,1466,3414,1022,1433,50,3747,2135,1018,3660,2737,2200,1054,1076,1413,994,1522,1942,1670,888,4342,934,939,2985,2809,3212,4275,1864,4277,2468,3138,4153,4005,4282,4007,3568,4159,4286,2657,3149,1049,928,1614,3400,832,946,3667,1820,2053,1654,1195,915,3030,1585,1017,3540,3583,2247,1190,2135,1306,2632,3704,2792,3405,1268,1298,1123,4175,2204,4242,4169,4333,4245,2211,2226,2242,2374,3902,2288,4266,2227,2379,3374,3354,1170,2141,924,2194,2985,1419,942,838,994,2729,3593,1125,1552,4433,2177,1641,1106,1680,1557,985,767,905,3449,906,3254,3263,2874,2682,2723,2679,3669,3620,913,3103,3776,4258,3779,2333,3781,4415,4330,2186,2261,3793,4260,1480,3486,1247,1281,908,1440,1446,1093,2124,1446,1227,3164,480,4439,3496,3528,4409,4080,1018,2046,4447,3534,3165,1783,1119,3161,4488,2860,2870,1278,2706,3794,1170,1552,1765,1038,3732,4393,1563,3103,1551,1023,3096,2259,1190,3805,2790,2991,3152,1181,1227,1941,1123,3455,4423,963,4184,2195,4149,4000,2645,4371,4279,703,4154,1871,2652,3892,4378,2560,4380,3772,651,1118,954,3673,3270,3194,2738,1887,3318,3315,1580,2105,4552,3328,917,3321,1020,2105,2191,1051,1265,3575,3698,3623,2487,2570,2501,2539,3720,1733,1193,4198,2522,2597,2343,3633,4204,2515,4206,2503,972,3169,3452,2208,1251,1273,768,998,768,1247,1165,819,1441,4588,1249,3216,4318,2737,4574,1574,4225,2641,4368,2964,4370,3886,3139,4536,2160,3301,2013,4009,4379,2842,2658,2171,1280,2676,3643,2684,818,2430,1268,4120,2677,2851,4087,2868,4089,3582,2713,2936,4500,2699,2868,2174,4120,2684,3119,3001,3356,989,1114,1360,1078,2907,2768,1156,2767,2909,1254,4652,4457,1493,924,2209,928,2121,1328,2147,999,1782,3994,1786,1778,4015,1699,1884,1097,1804,1350,2084,4347,1070,3477,887,2293,1433,1440,1404,2690,3346,3371,1977,1506,428,3688,1179,2107,2327,4469,4414,2035,2345,1395,3538,1345,1680,2266,1841,1981,2611,1534,1907,1350,393,905,1374,1036,941,1778,1151,1010,3355,4715,2254,2773,1610,1665,1778,1603,1645,4448,1191,1557,3085,1778,4264,2312,4422,2201,4530,4276,4532,4609,4373,4281,4155,4376,4539,1632,4541,4617,4381,1758,4214,1511,4621,768,1097,911,908,4067,948,2124,1759,906,1357,1799,1436,4650,2495,2029,1175,3022,3450,2764,3624,3274,3605,952,3628,3584,3724,1113,3231,3863,3285,3920,3638,3867,3923,3199,2737,4428,2677,1716,1470,2107,1344,108,2502,2269,784,3718,2528,965,1302,4476,953,1654,1641,3159,1139,298,1179,1562,3321,1569,4810,917,3449,1415,4808,4803,3993,1058,3035,3384,2120,4794,1017,981,1093,1088,1275,2057,2790,4522,1810,3717,2881,4780,3913,2182,3921,3756,3190,3600,3903,3275,4774,2036,4776,3909,1084,957,1572,1427,4767,2795,1072,2908,1482,1023,3441,1156,3957,1645,4409,1067,3163,2600,1805,3629,1313,1173,4054,1547,1845,1050,3003,2149,1575,3051,1073,1349,2985,932,924,1173,935,4430,2065,3745,4683,4364,3880,3350,4735,4369,4737,3295,4372,4280,1626,4612,3891,4614,4285,4745,3148,4543,1226,2316,1416,4625,1009,3650,2372,2255,4170,2215,1924,1406,1444,51,1424,2510,4693,2417,2204,3200,4385,1922,2271,2374,935,1942,1406,1290,1406,1840,2379,2261,4528,2227,4893,4607,4895,3761,2552,4374,4741,4538,4902,4540,2656,4746,4906,1668,1766,4910,1572,4324,3780,2285,4243,4919,4919,4921,1292,3791,4694,4925,2237,2176,4471,2256,2244,4931,1354,4918,4933,4936,2195,4938,2187,2359,3242,479,1722,315,1701,4889,3602,2127,2130,4829,1786,3356,3019,479,4923,3394,3793,2045,1953,4301,1959,1198,3411,1149,3222,4797,1959,1800,2857,1350,3464,5008,1661,4827,3165,4797,4662,4833,1960,3656,2213,1563,3077,1105,4113,1036,1336,917,1330,2148,1461,1579,4988,908,50,4941,3136,4533,3562,4535,4946,4537,2972,4743,2559,4951,4905,3573,651,1230,4909,2191,4911,4958,4464,4960,4916,4962,4933,4964,4467,2395,2278,961,4926,2712,2420,2297,4930,1649,4975,4934,1357,4525,4185,941,4939,4734,3268,3805,4985,917,1403,2147,908,4990,2143,4992,1160,1070,4996,1326,1322,2377,5025,4079,2204,5000,3554,5020,5004,1826,5006,3192,5014,1707,3464,4301,5011,5107,1156,1490,3957,3411,5012,1959,1673,1913,961,5024,1647,5026,1163,5094,5030,1334,5032,2670,5034,5086,1404,3597,1760,3778,1313,985,4759,4400,2668,2809,1572,4993,916,4995,1824,1788,2372,5065,938,1171,1166,3461,2123,1998,1547,5084,4245,3036,1282,1506,4810,1247,2790,3716,962,2788,5166,1001,1667,5163,1227,1811,1963,1311,2274,4245,2783,5175,1166,1282,1939,4928,5070,2181,4121,2253,1020,4574,5155,1342,902,3394,5139,903,4457,4177,3265,1941,4233,4630,1406,2539,2950,2713,5095,5093,5096,4967,961,5152,1520,966,5155,1825,1189,4349,2907,2687,1159,113,4689,1326,1896,1717,1268,3379,1164,1309,1413,1449,2503,1450,1793,954,3194,5230,1394,3854,953,1085,1267,975,914,2868,1140,2853,1080,1786,5181,4494,5214,5183,5069,4418,5186,2874,1515,3537,1173,3350,4760,5204,3048,3656,1900,3998,3133,2002,4531,3885,4896,4534,763,4740,5044,4613,2163,4903,5048,2977,5050,77,4060,1710,3103,2305,2245,2210,2385,2236,2267,1568,5289,2217,5291,4051,1195,4625,3389,3185,5296,1568,2291,2265,460,1670,931,3783,999,4920,2410,5311,5292,4054,5309,2238,2367,3789,3787,52,1265,1118,48,5317,5067,5320,2367,2117,3598,4256,3107,4845,2430,2684,5325,3107,3333,3430,1055,5301,1568,5290,5304,4458,936,5288,5302,5294,5345,4645,1268,5321,5320,5296,3185,5319,5302,5333,2369,5350,2847,5303,1190,2117,976,2342,3110,5325,5336,3122,104,5338,5298,988,5369,5334,5372,5338,4606,5039,4738,4898,1747,3890,3766,1631,5047,2166,5049,2563,943,3407,1399,1006,978,3282,1009,5373,3281,1008,1201,109,922,946,3684,2319,1008,3753,1055,1193,55,3690,1284,3684,1477,4328,3753,1477,5409,1567,2857,316,5416,5398,5419,3271,48,5413,2427,5423,5370,1649,5426,5373,5411,5429,2735,936,5425,5418,4292,5428,5430,1768,5370,907,5435,5448,5421,5404,1012,5441,5409,5443,5451,1313,4710,4774,3725,5455,922,5444,5422,5459,5397,5442,5463,5457,1644,5460,5435,5469,5412,5439,5424,5467,5462,5401,5475,109,2527,5433,5461,5412,5400,5464,2427,1148,5370,2039,5435,5492,5451,5446,5407,5449,5437,5430,2527,3683,5478,2316,5487,5402,5038,3560,1370,4610,5043,4900,5387,2476,2655,5390,5282,2563,5285,3612,1666,1975,4648,2769,1101,1665,4764,1545,5522,2670,4653,5530,2906,4654,5533,4651,5534,913,4650,2264,4054,479,3218,479,2766,2826,1791,5262,1178,1292,5153,1446,5262,1446,4646,1285,1829,1117,3428,2141,1798,1445,3828,3085,318,3316,3013,4447,4017,4293,4645,3125,2913,1703,2207,3674,4293,5555,818,3880,1176,1419,4658,1181,2141,939,2141,909,1359,5551,905,4892,5381,5508,4152,5384,2554,5386,4157,5388,5515,3147,5517,3897,2280,5542,3588,5521,5528,4650,4856,5536,5538,5531,5529,2826,5537,5616,5532,1073,4655,5612,4647,5613,4656,1887,1557,5543,1114,1975,5546,3031,1843,5550,1911,1168,1908,2046,5556,1975,5558,3321,4293,3119,1446,1820,2048,5566,1158,1018,5569,5607,1509,1407,1276,5574,1287,5576,956,5578,4447,2053,3048,1853,5583,1480,5585,917,908,2958,5590,1275,49,4983,3778,5629,1362,1728,5632,4757,5634,1360,5636,5682,2494,4645,2124,1015,5521,938,4141,4508,3435,2823,5630,5552,392,3124,1975,5636,5641,975,5669,5644,1440,1853,2684,3705,3843,1023,2727,909,5660,1018,5662,997,5582,5646,5666,4113,5587,5670,1911,5672,5507,3760,5509,4739,4899,3142,5513,2654,2165,5602,3572,5392,1183,4870,1887,5222,832,1577,4825,1353,1303,5530,3721,1398,1094,928,1099,1019,1580,2875,4404,3697,1670,3679,4710,4865,2064,1498,2867,2755,1643,2040,3843,1350,5759,2368,1303,1177,1975,1106,953,4295,2082,1239,965,3544,4033,1654,4873,4807,2065,5784,3544,3980,2260,3350,1238,1783,5636,1105,4446,315,1101,3115,1318,4716,4033,4490,2537,5802,1357,3072,2494,2092,1051,1198,5613,5774,1793,1142,3800,1322,1010,2493,1764,1783,2707,1814,1458,4936,959,4889,953,1956,1655,5538,4513,4047,5776,2790,3836,4513,3339,4758,4433,3427,3843,3369,1440,1389,1139,5820,5716,1156,2992,3475,943,1142,5715,990,1254,2177,1526,1585,3022,1181,4387,1357,5654,3430,3262,928,3369,2035,483,3178,4216,1021,4522,2580,5868,1276,5561,2194,1985,3481,2122,4855,2217,1254,1524,3708,4231,1303,1954,2022,5801,2177,1530,2491,3219,2266,5325,1051,5805,2070,2531,4810,998,1827,3847,1783,1285,788,113,3843,3830,3230,3130,4113,5155,3105,2340,318,4389,1425,4085,2072,2680,1534,2718,4329,3522,4500,1259,2669,3872,3582,2493,3836,2680,5175,2683,1067,4475,2686,1693,2698,1250,2878,2340,3550,1186,914,5921,2852,5924,1423,5938,5187,3359,5928,4807,4066,3072,2664,5933,5822,2668,1285,2033,5953,4634,1826,2854,1580,4816,1473,5593,5726,5595,5042,5276,5512,5599,5514,5733,3305,3771,5283,1313,2651,1186,3192,937,1229,4760,4085,4354,1553,4873,1499,5434,1568,1123,911,1300,5996,4676,5993,1990,3346,3426,3859,2087,960,1436,331,1943,3089,1650,1523,1409,2728,3475,4918,1411,4918,5988,5178,4691,4023,5993,1988,5779,913,5434,2217,5999,1126,5851,6030,4347,6027,1842,934,1555,944,3189,1007,1375,5725,4608,5273,5041,5275,5729,5598,4284,4950,5516,5735,5604,1696,4752,1006,4546,1478,1175,3708,3698,3215,2236,5333,6061,3784,2429,982,5697,4199,4577,1596,1067,5378,5374,767,1509,2703,2412,4179,4169,4960,4182,4182,4184,2215,4471,2879,3599,3925,2665,4629,5935,2875,2683,2710,768,3778,4568,1200,4570,1196,4572,6072,4575,2615,6075,2429,2694,4109,2708,3360,4502,5651,1171,2919,4853,5164,3048,1959,1282,5710,1820,1113,4985,4197,4581,2538,4583,4054,981,4602,1062,4040,1696,887,2627,1509,2318,2639,1199,1426,928,1198,794,2343,3215,5373,909,2919,2677,1693,4853,3747,2892,1344,6046,4943,5727,5596,3565,4742,4949,4744,5281,6056,2482,5306,4460,4443,2070,298,1133,3083,2100,3655,1155,5827,1421,6181,6176,4311,4729,6181,3083,6182,1322,1155,1062,6187,2081,6188,1524,5323,890,1986,2873,1887,483,2105,4558,3739,4560,1477,4546,1454,4551,3327,3040,3315,4558,1584,4329,1070,2247,3328,3318,964,3331,4561,3647,4550,1700,3319,4433,3329,2855,2675,1833,1680,4435,2178,2484,1435,1956,1132,1101,1344,104,2357,5660,6192,5003,2041,6193,1181,5226,994,5711,5366,890,818,3927,3344,4754,2757,6123,2899,1565,2741,1243,6260,6265,2898,6263,2756,6268,6270,6272,2747,5268,1365,2643,5271,4151,4003,5976,6051,4283,4377,6168,6055,5983,5392,1051,937,5287,1597,2486,1273,4253,5206,5104,5147,4468,943,1791,1071,1801,5401,4627,818,966,3083,889,5882,6185,3658,5885,4250,2036,947,2321,6196,1431,6194,3717,4060,2738,947,6189,6311,6148,1083,3083,104,6322,767,6175,6192,6178,6308,6311,2191,4209,1193,1005,1853,1106,4102,6090,4045,3359,479,1111,3528,6349,2123,6161,5272,4944,3887,5511,5730,5979,5732,3570,4011,4162,477,5285,6322,794,4645,3382,1657,2518,5156,2517,2531,5901,2494,6375,6369,6125,2495,1998,6381,2505,2264,1351,2369,4268,4328,4578,3154,1354,1349,4882,6101,3493,832,5110,1268,3690,3313,890,1492,2457,5967,6098,2862,2721,2251,5570,4085,2877,5923,4454,2855,6101,1773,4062,4500,3977,2691,1350,5570,4023,6419,5141,2870,1567,1067,3692,4954,2433,1403,1614,2437,2460,2440,6415,1587,6219,1604,1413,2446,1578,2174,6422,1588,1601,1227,1603,1005,1583,6437,1609,2436,1582,1613,2436,6353,6279,4897,6281,5385,6283,5046,5601,5982,4012,830,2095,3526,1820,4316,6041,1669,912,990,5538,5261,5420,5429,2385,5288,3408,1916,3205,2252,1309,6487,1891,4644,3688,3405,1283,3830,2917,975,3667,1577,4710,3532,3651,3651,4644,3528,975,1833,2092,6493,5909,6496,2452,5430,5161,3194,4141,819,3925,953,923,1270,952,3925,5651,1265,929,2107,3601,5676,5591,5678,4752,3493,1403,4592,3925,6532,1551,1160,2507,3114,3492,5578,5553,919,1670,1345,1093,5722,2960,5673,5973,6047,6355,5510,5977,6358,6053,6285,5734,6287,3897,1568,4986,1453,3312,4556,6213,6220,6223,3320,3318,3326,6207,6572,3323,6571,6569,5134,936,6210,4691,4487,1924,4389,1912,2036,4139,1576,3022,4676,4054,1076,1450,1665,2178,1139,1054,6583,3321,3808,1444,4250,6601,2781,2321,2762,1329,1967,4347,2508,2803,1022,1389,2946,6612,6458,2005,6460,6050,6462,6166,5279,6054,6559,6467,1049,5306,1313,3109,4677,4475,1974,3944,1304,3932,3954,3953,6633,3946,991,3948,4821,3938,3596,5375,5161,4621,4817,1132,3997,1808,3978,2144,3969,3981,3972,3970,3979,1303,3985,5763,6302,6657,1154,3983,3968,1539,1499,6663,3989,6663,3996,6652,3993,1099,3964,6160,6551,6162,5975,6619,5597,6463,6167,5389,6624,6363,1387,6627,3309,5212,5175,5232,1680,1311,4502,2632,5015,1654,1827,1490,3538,3436,5245,4592,3837,6370,5001,1798,3880,3957,1937,2907,5104,3489,1693,3375,2944,4667,911,4861,924,5900,1926,5621,5574,5617,4650,5615,5609,1081,3333,2320,3537,1893,480,2508,1239,1683,6607,6610,6607,6740,2510,3171,3658,1669,3322,3403,924,2717,2907,5565,1311,5261,5763,918,2763,1963,1713,1179,6000,1591,5243,5714,3076,6350,1406,1522,2533,1691,916,3550,1511,1470,3050,6757,5565,2122,4870,2682,3436,6204,1720,1062,4884,1762,6616,4002,6618,2649,4006,4948,6622,6558,6466,6687,1638,1511,3382,1268,2627,4592,840,1311,6735,1893,4595,768,2356,3673,3698,955,6243,2000,109,1523,2026,4021,6803,1544,991,1924,6736,3023,3688,4490,1512,1579,4918,1848,912,1805,3023,6827,1577,1444,4564,4272,2209,943,5136,1985,6336,2049,1963,6177,6313,3709,6332,2696,6318,3448,6320,3794,2903,1232,6324,6854,6327,6238,1423,2903,5446,5579,6347,5720,1735,3239,991,3680,2528,5547,4757,3583,3624,6519,3609,1403,6030,3708,2737,3710,6857,2439,1592,6433,118,6856,4429,1582,2436,6449,1582,4351,1608,2459,6440,1613,2447,1350,5607,2866,1309,4794,2040,3638,2792,1053,975,6148,2528,2117,955,1980,6544,4851,1190,2600,1465,3900,1424,1572,1478,1572,1265,1523,1506,6012,3462,2846,2503,2512,1691,1135,1533,2512,2614,2537,2626,3899,6143,2497,2544,2598,4192,6788,4278,6049,6791,4375,6793,4158,6795,3895,6797,2564,394,5568,1185,5999,6306,6190,6309,5963,6847,2033,6849,6316,6846,6861,6853,1318,1155,974,6856,1594,1151,6859,6311,6190,4269,3482,4122,5969,6411,1501,1334,1922,979,1912,3779,1406,1130,5092,1300,1600,1492,2269,6883,2438,6455,1576,2436,6888,4770,6446,6433,6893,1605,6863,6897,6450,6899,6443,1803,2865,1294,1654,1947,4477,4984,5630,6820,6909,1038,5261,3537,6912,3620,1446,1178,1832,2237,4620,2780,3941,4181,4686,1316,5179,4490,5181,2123,4585,6402,1733,331,1302,915,1017,4247,6850,1227,1825,5868,1585,1926,3535,1534,4827,1038,1350,1962,819,4167,5795,4249,5806,3316,1166,1705,4678,2867,1914,1101,3477,767,1300,6594,3337,4862,2047,6477,2050,3116,2498,4851,1593,2105,2059,3477,5875,3085,2095,1707,3085,1434,1339,3969,3046,5649,2456,5335,3207,1645,1165,5253,2850,1345,2795,2282,2406,940,1354,4587,2367,1840,2254,3780,4529,6678,6354,6163,6461,6682,6621,6953,6685,6796,4288,3774,1107,2343,907,2306,6332,6963,6326,6970,6312,6967,6882,6850,6317,6328,3030,6325,6974,6518,3452,6858,6973,4855,6980,6329,6863,3662,5714,2945,1932,1021,3192,6870,3248,5744,1796,1178,3686,460,3427,1805,2774,3836,985,6879,921,6881,1292,2443,6435,6886,7004,6889,7007,6892,6435,6895,2458,5869,7013,6447,3725,1185,2865,4692,1315,6905,3582,318,5092,3165,3356,2459,1165,1776,1376,7029,1670,3089,954,920,2105,1770,5703,1351,1650,5423,1299,1658,3843,4018,984,1645,1783,5765,3003,7227,2857,1198,1094,2857,6802,6857,933,1650,1351,5111,1015,7218,4018,935,1981,1768,1820,5563,2533,1490,3805,7221,3747,3880,4018,767,1610,7235,2989,3027,5542,4403,5542,6947,5040,3762,6357,6052,6284,7129,6955,4288,6289,5307,6647,4913,5690,1826,1813,5947,4186,2277,4180,4414,5294,5313,3788,2405,4173,963,4979,2195,2580,1760,4263,4410,7280,5059,3215,7276,3346,2241,2271,4241,2374,5343,6070,5361,2331,2322,4914,5058,2181,7291,1400,7278,2124,7315,2242,2213,1849,2531,4263,5076,2233,5079,2330,4314,5310,3788,2326,4966,4924,4915,1480,7297,7321,7315,5077,2334,1353,5331,1186,4186,2359,2354,4465,5343,5319,2369,2320,5184,5256,4171,6300,7340,2873,1294,7356,4734,7122,6459,5274,6950,4947,5045,6684,6465,7269,4747,1638,4164,1597,2411,2322,6084,2414,7276,6062,5607,7373,2348,2374,7329,5096,4242,2400,6151,7298,2416,2249,2304,2419,2226,2383,2229,4256,4263,2253,2421,2310,2423,2406,2425,5066,7276,4269,2519,2363,7402,2408,932,3726,889,2124,3992,6663,3966,3994,6654,3991,6665,1082,6659,6667,6658,6671,6656,3981,6652,7422,3987,3974,7414,6655,3992,6673,6673,6649,6663,7262,5383,7125,6165,6952,5600,5981,7367,4953,7370,4911,7372,2372,7374,2325,2351,3791,7384,2250,7391,7343,2384,2362,2424,7288,2426,7410,2849,6648,7432,5834,7435,3986,3973,6675,7472,7421,7428,7428,7426,7419,7474,6674,1824,6668,3988,7437,7433,3946,7417,6675,6650,7439,6048,7264,6555,7266,6464,7445,6362,4288,1193,1020,1185,3123,7379,1480,3317,4557,6220,3328,4978,7356,967,2924,2347,7033,1286,1276,7299,6595,2241,7455,6300,6214,7508,4555,7509,7300,2204,7520,5769,2226,920,1279,7517,7294,2189,4515,7392,5690,7507,7525,6783,3078,7535,2227,1777,1913,948,1832,7533,1773,7357,3097,947,2387,6300,7524,3407,7542,3369,7342,4184,3656,937,2372,4316,5556,7510,4260,6815,999,5910,3601,7467,6676,2668,3995,7428,7425,6662,7484,6302,7476,7471,7478,7473,6671,7583,7483,7431,7575,6664,7481,7593,7485,6677,5269,2465,4736,7123,6680,7362,5277,4901,6794,7268,7498,7368,1226,1283,794,6744,2596,992,428,7532,6041,1733,4525,5064,2248,6301,2091,5429,1309,1400,935,7518,7528,2221,2285,7616,2826,7036,1735,1734,3097,5031,1021,5690,2508,6612,7118,6087,1947,6499,4689,6300,1283,3712,2957,992,5872,1191,2205,1185,5844,2281,7574,6650,7416,6666,1156,7486,7474,3963,7429,7667,7585,6664,7480,7588,1254,7581,7591,6672,7577,3995,7595,6275,1617,3759,6552,7124,6681,7442,7364,7605,7366,7607,4953,6941,418,2391,3170,4249,3260,3630,3161,3391,4031,3585,3869,7105,3602,1275,3158,3696,3866,3179,3166,3233,6578,1437,2345,1572,2941,3420,6434,4664,3415,4441,1936,5765,1302,1115,4884,1590,4113,1351,2091,1942,4596,321,5909,924,2254,4430,1777,4338,5544,2499,1144,1110,5016,1928,3470,1828,1062,2806,1657,1545,479,6961,1407,1534,2095,6105,5151,978,2575,6080,4311,1176,3124,1707,1344,3186,3601,3863,7707,3160,7709,3265,7711,990,2738,1947,2067,1178,3433,7097,1548,979,7639,5235,1563,1544,1553,7097,2539,1145,7501,1435,5673,5081,4114,1374,7413,7591,7661,6653,7076,7479,6669,3975,7471,7477,7580,7804,7427,7807,3995,7805,7468,7489,7470,3064,7591,7491,6553,5728,6620,7443,5980,6361,4287,7608,6562,2811,2391,1067,3634,3280,4026,2216,3698,1408,3917,7834,7698,2118,6875,7701,1278,7703,7832,3219,7706,3636,1531,3698,932,3720,7843,3605,7845,3199,6101,3188,7849,3614,1531,3902,3639,3197,7712,5917,7087,7837,7859,3171,7840,3235,4549,3907,3180,3625,6338,5136,5990,7850,3206,3177,3867,7775,3212,5404,4574,6094,7798,6670,3965,7429,7481,7480,7669,7666,7672,7421,7579,7420,7895,6673,7814,7675,6649,7817,7489,7438,7359,6617,7361,2969,6951,7687,7128,7689,7827,7447,4646,6080,50,1492,1122,5063,2233,3793,7450,4971,7303,7925,1084,4677,2134,1418,5143,4079,7937,7935,2380,7925,2225,4325,7345,2397,5209,7331,2190,1070,4488,2078,7784,7937,5129,3395,5086,7937,6044,4134,4265,7463,7390,7307,7274,2214,2229,7950,3024,2086,5129,1735,3505,7954,2130,1596,7942,7350,4261,2244,7286,2302,2418,7925,1571,1084,7972,1561,2680,2133,5193,4457,1406,7315,5341,4912,7944,2384,3163,4761,1359,768,1680,1283,1528,4998,904,3059,2122,1524,3271,4661,7965,4326,2273,2300,7330,2249,7403,1301,2780,3005,1446,8007,1418,8004,4079,8026,1303,3659,7999,7926,4332,4968,2392,5255,7979,2198,2957,4481,4431,8028,8024,1459,918,8025,8010,8031,4259,4929,2414,7981,2328,2418,7651,4881,3880,8045,1339,6239,8026,1334,3659,8020,4421,7962,2263,7911,6789,7913,3298,7603,5731,3145,4160,4542,5984,912,991,298,4406,7553,428,7169,7200,3192,318,4026,318,4425,1247,3466,4426,8084,4031,8087,3609,8089,3163,2177,8083,3469,7200,8085,1579,8104,4210,8092,8091,8091,3686,8102,3254,942,3254,3516,8100,6201,7201,5795,3174,460,8107,1251,4426,8110,8103,7774,8087,8086,3485,8082,6201,3358,3356,3604,8135,4140,8091,8124,8140,7054,3875,3356,8137,1957,3619,4668,1647,2024,4865,1980,3935,3932,965,4804,3936,3957,6643,8155,6636,3943,6643,3950,3949,3949,6638,3952,3947,3955,4056,3958,3620,1715,3961,7799,7660,7894,7578,7664,7905,7667,7808,7902,7669,7903,7813,7674,6650,7676,7488,7592,7910,7597,2548,4894,7600,6280,7685,6792,7916,7444,7826,8076,5392,1404,5591,1842,1791,3651,1900,6006,4241,7630,7311,2604,2586,7619,7301,2204,2627,5706,1419,7568,7323,2187,3516,1577,2435,904,1824,1984,7336,8225,7114,5582,8223,7342,7120,4940,2427,3547,1183,3928,8152,3931,8155,8247,1319,8245,8159,8165,3942,6639,3951,3944,8252,4507,916,8162,8157,6636,3949,3937,6644,2675,316,8175,7892,7469,7677,7418,7586,7674,8182,7584,7809,8273,3984,7423,7430,3979,8189,7907,8271,7909,2101,7820,7684,7602,5978,6557,7606,7919,5984,1175,2077,4730,1232,3005,788,1547,7505,1762,2266,1114,2729,4448,1947,1664,1127,2097,1777,3506,1827,4855,1018,5171,2110,6803,2089,1004,1803,1473,2340,1914,8309,3731,1306,3318,2685,6477,1447,1285,4701,988,3935,3945,6635,943,966,8162,4751,2104,8327,2735,5017,1914,2983,3828,1512,299,5970,2081,5223,2197,2993,3056,4883,3006,1705,2999,3420,6996,2084,4689,8022,319,3005,784,3050,3062,3003,2806,3000,2585,3477,4365,8358,4365,8356,1506,3067,2991,2059,4884,7075,3882,8194,6277,7599,7360,6949,7914,7363,5278,7917,7497,8294,6288,1534,1393,7943,7290,7838,5340,8212,4411,8214,7527,7403,7386,2675,957,3035,1232,1762,2059,1580,4096,2748,1014,5218,1693,2041,953,393,7210,2895,7077,1529,7509,832,5029,5227,459,1813,1421,7154,1421,4513,317,4459,1421,6651,2115,8021,2696,1440,7055,1487,1590,1315,1580,1083,5792,3663,6018,1720,2503,4338,5216,1717,1232,2784,5676,6993,768,1951,6772,3803,1071,5711,7377,4970,8050,7352,1353,5605,2357,8238,4940,8068,6948,7493,6282,7127,8202,3769,7690,5984,2021,3576,4562,2281,6103,6945,4194,6200,3870,6409,8496,4193,4571,7875,4602,2591,4312,4201,6200,6521,5643,8506,6074,4581,4585,1171,4574,6131,2624,5658,6118,4580,2609,6132,3389,3207,6136,2589,4226,3109,3925,5658,5740,8436,4604,2570,8288,7601,8394,8072,6359,8074,4616,5391,6561,8492,1065,6840,3170,4191,2631,2576,3646,6430,4197,1448,4576,8515,4549,8523,1702,8520,6430,8528,8536,2546,8483,7263,4945,7494,6683,7688,8398,8204,6561,4054,5162,918,5222,1813,1515,1499,1912,2029,2682,1019,1729,5162,1733,5825,3313,1529,2123,1498,7080,5860,4885,1311,3281,1783,4055,1054,3492,5655,3116,999,2415,1509,5639,999,1239,3126,3200,5429,2580,1588,5137,4092,3474,2108,1710,3879,1665,8594,7505,4643,8590,1831,3447,1168,5752,8625,975,8587,8598,5985,1765,2177,1822,1977,2346,8633,8584,5716,2717,8587,8627,4264,4057,8624,1518,8621,2143,1849,8617,1114,8614,1920,3124,3117,5655,2775,930,2192,8609,3129,8611,1274,3121,8601,8655,8639,1357,5223,2661,8596,997,8644,7753,1181,4389,7254,4731,7553,8586,1308,8625,1761,8597,8656,5322,8568,7440,8199,7915,8396,8488,8075,4952,5984,5306,4263,4808,459,7901,1198,8285,8192,8188,6669,7908,7663,7810,7590,8275,6661,8184,8277,7802,7482,7673,7590,6092,1295,55,3169,3123,3156,3233,5141,4027,7875,1495,8130,8146,7858,7517,2677,3358,7850,318,4452,4062,2699,1703,5854,2205,3445,1228,3549,1892,3369,3468,8103,5705,5775,1650,3646,1674,7855,7730,5092,2177,317,2540,1514,8298,8134,4251,2707,2266,1463,1759,3755,3881,1488,5716,1131,1019,8538,8198,8290,6556,7267,7918,8575,4013,4587,4476,2238,5560,5407,2430,5560,1723,4560,1280,7787,1251,1463,1642,1199,7564,1247,3048,1569,3059,2117,938,1087,2208,1006,943,7505,4626,1551,3369,2346,4247,5232,4247,8513,4225,4192,2545,1195,2589,6524,7716,4308,1940,4577,4570,3458,1559,1448,1092,1848,1350,2992,3683,2030,8534,4603,2615,4581,3183,3856,3786,4190,8729,3580,3193,3698,7890,8551,4569,8553,7924,4957,8556,8507,4200,1662,5651,7854,7876,3610,3632,3201,3232,4781,2182,6817,8414,4801,3713,6030,5834,1552,8025,8008,8881,2792,8008,1313,8377,1811,3408,483,1195,1912,2627,3509,3527,2428,3419,1682,3329,1577,3421,5591,3662,8878,2530,1238,8884,2122,8888,1324,7077,8905,8884,3674,3111,7865,4785,3596,8693,7492,8570,8486,7824,6360,8489,8399,6561,4908,6976,7504,2298,2918,4686,7135,4757,2668,8688,4482,6476,1686,1548,1787,3837,7545,7397,2333,2285,934,3238,6090,1676,2491,5749,1845,4871,4120,7054,1350,1189,1706,5167,7751,1227,1332,1533,7407,7463,2365,2280,8155,4820,6191,940,1005,1813,1650,3510,7673,2437,1919,8440,2218,3178,7985,7050,2086,4865,8448,6432,5176,4459,1191,4676,6914,1115,8447,1805,6668,4676,950,3732,6004,3732,6428,6882,4495,5352,1594,2886,7227,1676,6495,1188,921,9009,1282,2048,4295,5763,1482,2045,4211,4247,1335,6132,8908,2502,1760,8822,1598,1300,3243,5970,4245,8414,1408,8451,6255,6857,1553,4675,1277,7137,8978,1020,3543,1234,1947,6199,3018,1856,3077,3602,3019,3048,7471,1294,8058,1961,4878,3470,1578,1332,4858,784,1318,2877,3977,4507,4082,4357,3420,1004,1433,5794,2070,9047,7548,1613,2146,7258,2818,1691,2000,8920,7821,6164,8200,8697,7825,8926,8787,2979,3509,903,2209,2849,1590,6986,6651,6413,1492,2432,6404,2861,6116,2863,3726,2713,6424,2869,5538,1463,2432,4453,6985,2734,2340,7297,1107,3601,1909,1479,3602,5688,8682,2143,2034,4311,1663,1700,1665,788,1695,1085,4389,7090,1322,3028,1079,4820,1066,3880,1299,1791,4387,3407,8414,1936,2429,6518,8454,7077,299,2438,1418,2687,1465,8025,1089,5829,1647,2712,6757,1479,3163,1015,4643,4313,9133,9084,8634,4311,1665,6920,1968,9138,3027,1138,2045,2583,1575,6232,991,4022,3369,1279,3547,6394,1183,4217,8886,6958,2065,2875,9159,1339,1780,5829,1735,8692,8389,2829,5594,8782,8540,8291,8785,8574,8700,5392,2980,2086,4475,8603,1794,1287,1555,8078,4883,4143,9221,1342,8765,2897,6272,2886,2892,6262,9226,2740,6267,3862,1953,8369,1310,1315,1884,1918,6204,9220,1227,1981,1162,4760,1133,331,1176,4509,7501,5857,1093,9157,1526,4933,1142,2900,975,6392,4927,2817,1296,5688,4827,5703,1268,1108,7016,4311,2698,954,1686,3087,1374,7705,1093,998,4688,5006,8984,9263,1171,1771,3005,1464,2050,8350,1549,8705,9032,7085,1093,4564,1426,7117,6762,7756,5687,5199,1975,2753,8961,1592,8387,1251,7073,5763,5181,1115,5845,2275,6392,6191,1397,6148,1397,3096,2936,1911,9311,1197,1178,9308,944,9305,1227,9320,5855,2386,1716,1776,1449,8781,6790,9207,8784,7496,8203,9211,3897,6525,3602,3749,1909,5087,4850,3828,4446,2611,2123,9304,6846,3071,4870,1725,1472,9239,9218,1053,991,5541,1185,7731,2824,2205,999,8341,2123,1673,7872,9277,1090,9266,1326,6605,3504,9271,2877,1807,3961,9276,1678,9279,9265,4688,1060,9283,1066,4701,1413,1464,921,3369,4135,9280,1719,9263,3183,5405,5393,1058,2452,3203,1107,7972,1172,1336,1399,9228,1998,3405,1796,954,8084,1400,4396,7063,2704,5749,8299,8102,9416,1427,3025,1147,2452,983,4505,7242,1418,6634,1963,3477,2991,1643,4867,6692,4713,8837,1106,5629,6545,1280,1829,1845,7032,2594,5490,1735,4251,6506,8631,1161,1551,7761,5259,8765,924,4591,2122,1254,991,8008,1248,902,6592,2137,5026,2194,1502,1334,8848,948,1585,2665,8341,1947,1114,5963,3526,1524,1849,4511,1834,113,2091,3658,6193,6926,1426,2381,6475,9298,2783,4658,7950,9054,6611,1018,1273,5858,2109,6441,1842,1499,1692,3750,2493,1533,4301,1021,1166,4349,1115,998,6774,1156,5429,2780,3428,4874,4400,2584,4794,4446,2269,2529,8682,5196,1339,8105,1541,4560,909,7060,1189,1574,4274,9203,3559,5974,9206,8071,9208,9338,9092,9340,4013,6142,418,5461,8738,7696,1318,6310,9106,7699,6114,6413,4501,6546,2701,6841,7860,2877,7154,9102,3287,6417,9113,997,3977,3557,9119,1975,7253,7654,6033,9511,8464,4129,7227,3820,1309,7618,4673,1351,4071,3356,3422,3537,2627,4233,2857,6210,8134,1176,1351,5710,1233,8775,1083,5581,1131,9258,8729,1093,3750,1503,2316,1358,4364,3957,1710,4441,4799,1564,1553,6370,3067,4350,8599,5561,2912,8372,1018,1592,1139,8101,5645,3957,6901,9609,4682,5926,1918,1409,5216,941,4505,1021,8896,2091,4233,9539,6276,9204,9542,9335,9544,9337,7365,9210,8545,2482,1449,1813,4957,3859,6142,1389,887,1957,2172,1942,8817,3493,5394,9538,5659,968,2762,1406,3343,1199,4308,6496,4913,1403,960,2452,5176,6711,1551,5874,5214,1550,6960,3359,1858,6640,5712,6504,2880,8839,955,1275,1798,3349,4773,958,2780,1322,9583,8138,1894,1826,1814,8603,1894,9520,5244,8452,4446,9110,1826,4316,3403,1170,966,3190,3157,2259,1017,2627,2527,4646,6960,1826,9687,4804,4488,1147,1001,9011,9455,1793,1116,8897,3551,5818,5792,919,1399,7099,6395,6071,1701,6058,3671,1571,2050,4825,9334,8070,4611,9652,8573,9339,9655,3150,3341,2980,1532,6923,6932,6922,6150,6925,2366,8609,3742,6924,3646,932,2674,9770,3916,3916,9765,4578,7853,6932,3186,298,3183,9772,9776,2118,8793,9785,4050,9779,5319,6918,9774,9768,9777,5403,1304,1700,6252,9789,6918,9791,6918,2117,3184,9801,9773,9767,2118,9799,5323,8892,6252,9796,9812,9796,9807,4228,3091,912,7923,9789,9783,9776,932,9808,8603,8548,9774,2738,2678,4072,6115,4845,9559,5969,6096,2701,6918,2665,2714,5950,9102,2719,9570,8745,9111,5323,2494,8548,9781,4202,5370,9796,9829,9822,3243,1006,9804,4291,9813,9821,3151,5325,9818,9805,9784,9866,1188,5287,6932,9834,4637,4630,9837,4633,8734,9560,9841,2725,4957,8739,9100,3012,2854,6152,5954,6115,2733,2715,3242,2684,2305,5675,3113,2826,2908,1280,6216,1281,8609,3118,8611,3120,7104,6690,5571,8661,3127,5657,7304,8831,3710,7192,6449,2455,2664,6453,7181,2462,1595,6813,7348,9916,7007,2438,9919,1605,9921,7012,6455,9924,3281,6813,8665,3371,8667,1197,8669,2827,9086,8289,9336,7495,9653,9760,5603,1225,1641,2031,7932,6428,3826,7054,3952,1891,945,1446,9197,1592,1089,8372,5243,6121,5405,6475,9138,3163,4074,8458,4847,3586,7105,8872,4837,5711,4363,531,1842,2812,1567,4626,917,8348,3219,3625,1924,7060,4021,9700,3490,9105,4636,9111,8516,7986,1653,939,1431,3407,8152,3329,3538,4641,3663,9400,3477,1690,2503,1332,1841,4645,4854,9064,1397,1105,2123,1168,991,3383,3943,3025,5620,3643,1563,1780,3067,1717,4853,924,1926,6746,2112,2709,3786,8560,9978,3919,4524,9940,9588,1728,907,8838,1123,3349,7861,2236,6209,9989,3190,9991,911,9993,3912,4692,9881,9997,6117,3194,3785,1798,1974,844,1808,1449,2260,3539,7779,5586,2910,7986,2060,6777,2141,5157,2434,3050,767,1658,2113,6030,2113,2026,1770,2057,4603,2048,1415,3517,8895,9973,4846,3226,8869,3229,9977,4836,10042,9980,7748,8301,1313,2523,4411,5243,7095,1553,6599,5794,9136,1854,8449,8386,9917,5763,10083,1558,9405,3001,319,2035,6518,2826,1662,1099,9629,1950,3381,10038,3216,10040,10102,3728,1187,3503,8122,10047,1249,10049,7706,3291,9540,7682,6679,9543,9757,9948,9759,9547,9761,1049,7271,1639,1454,10126,1268,10057,2127,9248,1119,1005,480,2101,3679,5697,908,4459,8160,4014,1977,1036,2092,3512,1300,3178,6489,3880,1447,1078,1580,4722,1167,8818,1005,45,9157,1198,6995,2870,4794,3157,1825,8008,1663,6509,9695,1060,5791,3085,1274,4247,7071,4879,1332,6786,5182,3474,2858,1311,10197,1793,9502,9585,5611,2503,8753,1247,4986,2999,3505,3491,886,1421,1144,2505,5884,1000,1538,1160,1299,8950,10167,2790,10164,1670,8079,10162,7680,3134,10148,8197,9650,10151,8572,8397,9950,6170,2979,1110,1230,2401,1374,6041,9464,1649,3966,1189,3076,2783,5941,1958,3018,2913,1539,1490,10263,3056,6608,7929,8476,971,7117,8065,941,2418,2331,1509,3881,9900,9479,1336,905,4428,4495,8682,1014,1189,9474,958,9496,1455,10079,4495,10285,5912,8776,3121,7349,8036,2228,2244,10277,7961,10279,8240,1070,1650,3107,5321,5056,7309,7967,7117,4923,8018,7949,9296,7978,10305,10276,3400,10278,2203,5080,1639,3599,9296,4463,10316,4327,10318,8017,5150,3794,10322,10304,4972,10325,9535,10308,10328,8067,10147,4150,7912,8393,9651,10152,10250,10154,9951,901,1228,3493,4770,9099,2724,5248,4632,3246,3534,2704,1318,3167,1825,1661,1569,1594,1418,10373,3794,1732,9558,10319,10338,1673,1506,5904,6391,2390,5824,4307,1309,1989,7197,4882,7117,4113,5714,4113,3547,8403,5057,7967,3154,5354,3578,7065,6866,1848,6394,3207,1614,1932,1778,6524,1789,8856,8977,5994,10056,7035,4082,3165,1796,3604,1944,4339,2118,4969,5176,6827,5904,2696,4417,8037,7883,2319,5358,3578,9455,3414,1790,9151,3224,3680,5244,4135,9110,6696,9837,3246,988,8800,1345,3181,1557,4311,906,818,1076,10455,2355,10377,3207,10327,7121,10348,6278,10350,8485,7823,8201,9091,8699,10155,3574,923,6059,2904,5615,5610,10268,5620,5523,5612,5529,10478,5623,10483,6728,7752,5527,1529,10487,6731,109,4546,8267,2765,10476,6713,10488,10480,10482,6730,5537,10485,1958,5621,5623,10506,5539,2427,2498,7371,2357,10176,9455,4889,1592,7727,5860,3044,1506,3337,1774,948,3507,997,8581,1421,1457,1454,1400,2031,1006,6289,4731,7113,8066,2181,2260,7998,10158,10379,3793,3911,4071,10207,5004,10014,6183,7076,3343,1912,5241,5312,886,8032,5210,7310,5077,7405,1106,4515,8883,2707,8442,2895,9179,5586,8440,5859,1517,1522,8444,1463,298,9394,10345,10462,9647,9541,7683,8539,10352,10249,8698,8544,10356,1049,1759,9802,3216,6366,6931,8656,3075,2535,4303,8555,1110,1232,10012,9409,1599,1439,3257,7847,6930,4877,1690,942,10600,3673,3187,10598,8909,4429,2523,2194,1690,9785,5373,1586,10613,8887,10615,10593,9755,10351,10248,8487,10469,10585,10252,10156,2821,1571,3778,10206,4870,7033,1406,5213,10066,5145,3416,1780,1432,4079,4404,1781,2855,6630,1394,9625,1131,3191,9629,8150,907,1249,1599,4975,1544,4308,983,5226,298,1435,5581,4404,5020,6044,4957,1093,8436,1784,3234,10093,6644,1060,2916,6840,6077,7150,8414,2912,943,4233,5752,1551,5162,1471,4917,1361,6914,4364,8517,10190,4338,1308,9157,3717,3258,10606,8639,1197,8887,1599,3742,2069,9940,10623,9409,10593,10619,1283,909,10622,1709,10712,10617,1738,10463,8391,10465,8922,10467,9090,8925,10470,10586,1387,10358,3902,10397,10334,8015,2847,1639,2385,10534,7287,10309,5077,2201,7312,4083,8407,7295,8215,7334,7314,8410,2179,7302,8051,5363,10738,7382,4331,10556,2187,961,7319,7313,7355,4937,4527,8226,7354,7643,7552,8388,10578,10245,8392,10466,7126,8924,8543,4904,10730,1638,10157,2982,10734,7275,10769,7294,2378,4413,8034,5342,2265,10256,10333,7380,10761,7296,7320,10751,7619,10753,8220,10750,10765,7289,5078,4981,10280,8664,10793,10303,10430,10324,7545,7353,7292,7341,7357,10577,7681,10349,8069,10627,7265,10583,10630,10780,10632,526,3107,7272,2356,1268,10065,2344,7405,9895,3270,10757,4256,10311,1006,6066,2427,6627,2318,5348,1037,1596,1114,3673,5343,5402,3236,9793,3107,3647,1452,8759,10039,976,10837,5081,2410,7922,10835,2293,7923,6066,9945,10581,10628,10778,4615,10828,6560,6171,1857,10605,8729,3173,3630,6438,3711,7002,9936,9565,7771,7861,3157,3233,8517,1036,8524,2624,9602,7886,8265,9588,7225,393,3313,6207,4554,6570,6568,4559,6214,6569,6575,6212,3324,10912,5305,7237,2035,1007,10851,5290,9623,2305,9985,8603,2857,2865,10021,2133,2150,7576,2142,2135,10929,4015,4349,5089,10933,7971,10937,10937,4991,10933,7940,5129,2136,8748,2292,1820,9825,3783,7283,7306,5403,2217,1164,10918,994,7377,3708,2592,8682,5301,1820,6840,5365,2427,5395,7376,6562,10475,10490,5524,10479,10650,5137,1798,5555,10478,5529,1239,5526,1081,2210,3123,4646,10501,9572,10504,1463,10851,1856,2730,10498,997,10971,10772,10821,10464,10823,10776,7686,10727,10779,6169,10877,830,5052,3107,9283,6368,2518,8454,1817,3494,5156,4214,4435,937,1389,1151,1005,1680,6307,4446,6307,10170,6376,6370,11016,1515,6369,6380,11029,6379,6377,8517,1893,11023,1990,2254,1411,6324,556,4218,1657,6377,4564,1717,10591,4490,1796,10601,6446,4409,5254,7077,6370,9072,6601,7720,1801,3003,1656,7532,2661,8976,1348,7235,2630,2570,1535,6294,6785,1064,1512,4409,8823,2579,1437,3431,2141,2918,6800,1967,1256,1551,2686,8884,10311,2029,1853,1656,1811,8299,3472,1243,3234,4679,1299,9695,4830,10560,3483,8908,1428,8778,4876,11093,1735,4480,1512,4209,912,1516,2670,3403,5561,5776,10530,3714,2207,1101,1290,1158,9416,2045,5714,1944,10719,3031,9891,991,1574,7736,3097,9533,2100,1854,3032,1415,1771,3938,2539,1522,6550,10722,8196,10775,10725,10777,10468,10728,10631,11005,477,5052,10158,6565,6569,10905,6566,6570,10912,4558,3325,4557,10912,6576,3319,9815,4361,2269,5571,9908,2908,9908,3117,9943,2904,10507,4649,5531,5618,6729,10981,4457,1475,3311,5698,5654,3115,8663,8606,8807,7633,2765,11180,1470,11182,10486,10489,11185,8748,3151,1907,2191,8774,393,6496,6035,5970,3657,4126,1345,6315,6909,923,1696,10673,1426,1279,6080,7161,4986,1934,1800,5120,7163,1653,4313,2698,8058,8680,5091,4080,6605,6505,2293,2913,1394,5120,6991,7052,3407,9688,1508,3321,3027,1447,3027,4028,3721,9587,2026,11090,1001,8597,4446,8306,9373,2026,1243,3343,1021,9414,6510,4082,3682,3823,5775,908,2493,4446,1646,6394,1285,3667,3873,3202,4234,1114,6899,2095,1643,1005,1821,5241,4126,1814,2036,1232,9735,11231,6029,1596,11207,5092,2452,1518,6803,1081,6141,9139,4443,1810,1134,5177,4827,4679,1286,6080,9713,3329,4082,3425,3843,1921,4495,1896,1063,3740,9369,11235,7028,9739,4113,7517,9265,2088,1918,1389,1779,3556,1311,2266,3470,5792,2693,3385,4443,3141,917,5663,3528,3508,1508,5862,2113,11164,907,6802,1000,9414,3929,889,11209,2096,1953,2566,6928,991,3859,11275,3203,5120,6606,5085,4984,4326,7832,3192,9295,1770,7732,10282,5075,1036,6350,1159,3739,940,4457,10831,2023,5428,10529,3163,8838,7063,1676,10298,3830,3407,1455,6251,10448,1094,11335,1268,1854,3416,3368,10366,8641,1612,5698,9312,3687,4495,4676,11337,6875,3072,6081,2590,11135,1438,4686,1295,5702,5245,10189,5759,5094,6234,3399,1971,5792,9710,1944,9521,1944,5448,4328,2738,2194,11432,3407,5115,4450,5698,6764,1590,6764,1274,1645,948,6496,1490,6909,2099,10021,10673,8456,956,11396,1999,3433,1901,2910,1349,1165,2321,9516,797,1856,10006,6931,1056,10195,6135,1684,5896,948,10454,2266,7739,1408,9306,6350,11228,479,9662,1294,5189,8838,2236,1639,11385,1502,11387,10659,2762,11390,1272,3430,6454,11395,1535,5948,2452,3651,10079,2818,10079,8336,4689,11405,8603,11407,1962,11409,1239,2321,11412,3538,1901,11415,2451,1643,9424,8954,11421,5245,11423,1336,11425,1647,11427,11173,908,2124,962,11437,5398,11435,3602,4809,2850,835,11428,5242,1680,11443,11425,1788,11447,4233,10294,9493,1277,11452,2368,8299,9486,1535,11457,997,6081,11460,2321,11440,6609,1036,11466,5702,11468,6801,1400,5222,11472,5127,2368,11474,6499,1316,11438,2172,6869,11495,11531,2122,11537,1249,10626,11000,9089,7604,10354,10729,10829,1638,10851,1127,7769,5181,2635,7229,7276,3039,5845,10285,1694,5091,1771,8416,2177,2177,7730,4804,4825,1569,2661,1129,768,3821,4033,6317,4297,10375,1803,4294,9715,1176,1705,1421,921,1849,1332,7083,9017,1553,1282,10523,7111,11397,10020,1961,5017,1459,1888,2724,5157,1310,7720,889,1433,2036,1650,9751,1692,1001,6441,10079,8413,2704,3349,10270,1413,3215,7936,2753,10299,8961,9360,7091,8444,2110,10646,3029,3359,5430,3151,7396,1710,2026,4884,1479,2278,9046,5831,10176,11646,7789,5810,8798,4456,1517,2282,9066,6546,3359,1931,1409,11634,1177,3022,11474,1073,10569,11628,5029,1901,3798,4364,1418,924,5250,3624,3552,4676,11502,2772,3423,10229,8639,11397,2924,5843,3126,3493,1001,4430,2128,1788,9751,923,1709,1770,2091,9668,8705,3962,2179,935,1300,784,1187,5538,11019,1814,1268,2523,3843,1822,2026,3843,11258,1950,847,4428,886,3528,1197,3322,1670,9944,11146,4942,10246,9756,10825,10629,11152,10876,6625,526,5605,1493,4178,10796,4470,7322,4981,950,6089,10537,2339,7922,4579,9037,5181,9272,3448,1895,2033,9824,1171,11728,1440,8625,1177,3381,3436,5907,7933,10171,5753,4727,4330,1443,1274,1759,11513,7766,10547,1154,8942,6501,3936,5591,3089,5093,4321,2886,11144,10202,1553,2135,7889,3243,1254,1661,8518,1918,5941,5497,5360,1466,2730,1252,998,1731,7673,3877,4211,8314,10649,8622,11688,5221,1778,1774,2956,1995,2230,7560,10622,9957,5541,3372,4230,11440,6516,8624,7989,9175,1667,2600,1123,5629,480,5629,7144,1971,7200,2926,1973,2910,7784,5544,1433,11659,2067,2105,2879,946,3701,1841,3526,2107,5991,2484,459,10551,3355,3859,1981,1512,1530,8427,4828,1018,1017,1251,6307,4700,2698,1315,4448,1081,2183,11054,6219,11783,9836,1259,8884,9520,1403,2704,1191,9857,8861,10977,11200,1782,11202,3122,11788,6724,10480,6726,5612,1532,3808,3383,6928,2452,1993,10012,3327,7624,3642,7236,1516,1435,10238,1131,3100,2060,3376,9309,6529,5630,4587,8442,1512,7989,5664,5565,11822,1735,3601,2120,3795,10955,1018,6201,3238,902,6563,3739,2194,1641,11585,11149,11001,11588,10584,11765,6956,8479,3231,8931,4180,6086,10815,7545,11776,10788,2205,7922,5606,5152,1712,7794,3041,11872,9441,3688,1310,9502,8114,7717,1812,5214,9526,7018,7986,992,1449,10185,1069,5168,11855,11637,10298,6379,10001,3031,6901,11012,1986,2415,2744,1954,3026,2043,1345,5157,11379,5020,11839,11305,8314,3492,10544,11833,1243,1254,11827,1193,972,10560,8705,5941,1177,5031,11645,5009,11820,1149,4358,1258,11144,11579,9052,1200,1761,5672,11039,2821,8938,3065,10994,1784,1185,11834,8774,9697,1675,4727,998,1893,5151,5686,3795,2429,3714,11790,2671,11787,780,1127,1287,5791,6307,1471,8724,6210,3936,11964,2188,3103,5084,1492,2858,11220,944,3941,10710,992,11836,1144,4211,6693,11950,9517,8419,11948,1786,8463,9906,1918,1296,7650,5241,6697,10499,1018,6971,1172,4633,4679,1312,11933,1676,6753,2744,8109,1313,10650,904,1970,11915,10988,1808,10986,11919,4645,11921,5624,10987,5525,2709,4957,3651,2677,11912,5286,5159,1315,7175,1657,450,1309,1007,2269,1008,4122,1415,4805,7427,6809,1160,6428,6991,6428,11893,4122,993,1530,1274,5541,11886,3238,1396,11883,1796,7056,11880,11966,6356,8571,11763,11003,6286,11766,7369,2078,6101,2431,1166,1943,3190,2496,1950,4197,4301,1953,4867,1489,11090,6241,2045,1813,1963,1816,3092,1819,1821,3790,1824,1973,8336,3736,1831,1833,5706,10025,1838,8232,1986,4757,1986,12173,6554,8923,11151,12177,6686,4288,9213,2492,9283,3846,1489,2437,8329,10272,9971,8633,2583,4247,3934,3677,4337,1561,10030,1147,12152,9136,1574,1713,1734,9960,3099,9352,3337,9011,4866,9393,1431,1139,9751,10009,10179,9709,1078,888,1663,2368,4047,1526,8633,1993,10272,2085,8020,1502,1017,4434,1306,1833,6204,1175,832,9484,11322,7716,5193,9406,912,6815,3642,3778,1724,1309,2227,5678,1730,1130,7618,12272,5159,902,1592,1300,1648,10312,6342,3469,4804,1656,1658,1661,11088,2502,2108,3073,4338,6474,1482,2211,3341,11390,1523,5903,11401,1682,10710,3100,5777,10161,479,1691,8424,8008,1696,1453,2507,3853,1702,10267,11664,10161,1282,4825,4807,1713,8266,1716,3554,1719,3656,1228,12217,7822,11150,11002,10875,11004,12179,77,3575,6628,2306,1506,889,5815,5853,4704,2048,11381,6191,2059,11786,6819,6969,7155,7147,6854,1392,4091,6857,6978,7153,10563,7146,1423,3187,9116,2722,9572,2724,2486,1933,2099,10568,1156,1119,12364,6035,1963,12367,10650,3906,7180,1611,9504,6887,10591,7185,2453,12400,4292,7732,2129,10457,10454,4361,1695,7849,10449,3690,2498,10715,10315,7275,10715,4984,2036,7511,10789,2181,7928,9812,3902,10541,4414,10340,10813,10342,8874,887,9833,8049,5185,8477,6506,5082,3638,10819,8482,11758,5382,8921,12174,12219,12351,5280,12178,6956,3691,1914,2319,10733,7696,10882,3205,3605,7878,10733,7705,3274,3490,3535,9994,6644,6134,1053,7658,8013,4465,1404,5744,1717,887,4761,12188,1159,11683,2632,10645,2033,8818,7563,7933,904,1117,1403,1759,6521,4091,12430,2204,3071,8259,9434,12324,8644,1168,3059,2344,2772,4686,8663,8612,11193,3116,8663,6152,933,8666,3514,9942,6540,9943,11193,10833,981,2784,4251,2767,3394,11232,1724,10243,5270,10723,10999,11967,11587,8073,12352,12453,4288,11593,9121,9792,1454,6843,6180,6310,6334,6848,7143,12370,6852,1064,12373,10683,12376,6249,6191,7154,6852,6330,4091,8917,3618,3199,9098,3603,3904,2216,6322,7000,7181,7003,6443,7184,2451,7186,12406,7011,7190,1591,7192,9856,3911,3864,3637,9602,8918,9895,9832,10512,10795,7966,4471,965,10550,4441,1097,6081,3927,5092,8104,460,8088,6530,3418,9266,1475,3469,3249,8106,1552,9136,9710,1701,11958,7628,3793,2262,10112,2244,2357,10461,12445,10773,10822,8484,12533,8696,11969,10827,12353,6956,11271,3310,7273,4424,6646,12422,10747,12425,10752,3794,9870,12429,10337,12427,12432,7930,2414,2171,12437,10323,12434,10741,12441,12637,8481,5080,9824,3916,1121,4751,12543,6183,12545,6966,12397,6819,4499,9571,9561,2868,10696,1669,5798,5095,1254,8747,7170,6035,11683,921,12381,1057,9922,6898,12580,6314,1812,8990,1602,2444,1605,1172,9666,12026,11543,1101,5775,1661,10441,1893,2950,1645,4022,2099,10697,1765,12676,10283,8103,2877,9965,12682,1773,6316,6964,7141,3020,12544,12529,7598,11147,10724,12449,10726,12628,11764,12630,2658,1552,8427,8818,10160,10077,1296,2141,10835,8831,4814,3029,3052,4347,6545,2137,6644,3408,4804,3794,6813,7298,7891,5868,7726,4989,11643,6124,1602,2039,3066,5037,10509,11719,10794,10079,5166,3602,6434,6606,8456,1836,12310,4668,1522,3087,1890,7022,2529,11651,10205,7231,2147,9963,9972,3658,1548,832,11553,1461,1845,8621,8996,3322,2677,1133,938,3433,8886,1807,3693,10054,8853,2216,6849,9975,3632,6082,10070,8878,1594,6239,6768,1838,2094,6499,12310,9515,5846,5636,11788,4701,1435,2698,6027,9197,2772,11021,3718,12827,2454,1712,11823,3030,8317,8631,7988,10222,1986,12228,2411,8518,10895,4207,9818,9928,2451,9930,2454,1605,3578,12684,6885,9936,3245,3673,9843,8565,2500,4605,12446,9205,10247,11762,10874,12452,12222,7828,7370,2457,4167,2413,11772,8233,11774,10112,4174,7279,2408,5198,6083,11771,8213,12872,4183,12873,11981,11876,4189,4203,8857,6104,8859,3163,4196,11077,2577,8559,8871,12840,8562,4207,8206,6040,6381,9078,5809,7254,5855,10559,2985,7255,1101,3855,1089,1051,3674,3443,12856,2537,2641,4228,1310,1820,4475,4233,5686,1510,10835,12464,7308,10796,4327,7293,12644,4414,6387,7293,4271,5182,11061,7042,1294,2040,1353,2171,4466,7652,4526,10807,7114,4619,3902,10658,4495,3178,9333,10871,10150,12862,12220,12536,12865,4953,1399,4792,2712,1646,3682,5882,992,9141,5117,8416,4245,3167,11058,11397,3059,1673,5145,10129,11558,1437,9022,3422,2789,6704,4070,1787,4645,2091,8687,944,1786,6428,11606,3003,10185,11303,8836,3086,9468,3448,9562,4459,6668,2685,4728,1963,2981,2057,9802,1311,3050,11783,1064,3556,11119,11214,12977,937,1675,1707,9043,5086,8768,7202,10638,4111,11104,1165,2753,4688,3544,3238,9197,9009,2788,767,1856,6499,768,3050,4831,6248,4810,6343,11357,9823,2194,4797,950,12743,2792,7989,9183,12795,1336,3985,11982,2520,10529,3321,10057,10688,943,9658,2512,7558,6703,2818,1646,10164,1646,5432,1001,3171,2029,6693,12774,1715,9259,10037,2042,2065,12774,1836,1941,2805,8687,11939,13019,9062,3431,10705,11080,10893,8630,10161,8585,9254,11126,4489,5782,8632,6187,3064,1131,5501,2793,956,1909,5191,7784,3341,2583,6757,1240,987,1130,483,8417,11214,942,2932,2728,12715,5011,11558,10232,9486,2096,767,4361,2907,8001,9253,1763,3165,4364,2590,13139,9596,7558,5791,6350,6928,12396,3493,11707,9046,12035,8518,4015,3394,1294,9072,12348,9088,12627,12535,12864,7130,7828,8492,2505,3650,9591,9047,2632,4870,12977,3429,1312,6502,4551,9727,1680,1771,5243,12488,6027,5882,2857,10700,1827,6594,3085,2796,1089,11430,1281,3934,6475,10174,1436,2428,3740,11735,1318,5902,1803,1661,13198,5091,4679,10551,13195,3314,2057,11528,1178,12484,1332,3974,7097,8677,3230,1101,8965,9181,11392,4486,5901,1511,460,11608,4337,4033,8961,1803,3739,1131,1773,3593,11889,9642,5544,5084,3877,947,10298,1678,9613,1258,11871,6538,11474,12111,7110,4041,11822,12413,1190,6987,11461,8008,418,2501,3830,6036,7741,13253,9619,4820,6348,4087,8008,10666,5189,9082,2129,1123,6058,8001,5868,6545,3174,9046,9535,1933,3873,1687,9588,9537,4311,2724,479,6343,11556,10013,11558,7175,13259,1892,1059,13262,8775,12329,5903,10524,6866,11460,1339,13245,1249,2523,9247,1336,11553,5909,9331,1696,10985,1932,11888,13157,7441,12534,8542,12960,13162,7447,4574,5358,3709,12399,6885,12571,1595,12573,6891,12405,2439,7188,12850,12579,12967,6975,2881,2434,12967,3395,6450,3597,4851,12182,6889,7137,6844,12664,6186,7142,1494,12549,12380,6972,12556,3717,6976,6850,7148,12557,13355,7188,7144,12716,12555,6179,12663,12720,8195,11759,11148,12724,12350,12726,12221,13321,8295,2494,5358,11488,1295,1942,1404,6341,841,5236,4759,1148,4759,13385,1510,10135,13383,2735,2239,5988,9474,7706,8467,5145,2147,1842,2203,2059,7995,7754,6001,13406,1658,13403,8818,6324,5159,6009,1653,1290,9666,6016,1890,11397,3547,1404,1970,13380,5138,1926,3957,7049,3189,6603,3712,11819,3316,12394,6031,5998,5152,1506,2867,10260,6038,9394,6041,10293,3206,6045,12956,12861,12175,12863,6623,13378,5392,12539,331,10221,4071,1893,1544,5775,11060,11690,13015,1433,10691,5521,11737,1282,4295,3455,3191,2792,3446,11234,11506,1361,5935,5423,11088,11887,4761,5759,1259,12968,12307,9431,4637,3156,13171,1914,12985,1018,11939,7764,4626,9431,6703,1273,3664,11533,12670,4490,1158,5015,3066,11126,9244,11122,5122,11645,9961,12711,12911,11126,4645,13230,5176,1328,11024,1394,9015,3428,13262,6697,5121,12675,13185,1318,3060,13507,3077,1551,9702,11956,1475,11677,3460,3072,12085,12758,12128,6928,11794,13148,4663,7239,4450,1461,5991,8135,3050,4663,991,8351,1682,1502,1189,1250,932,5791,13268,3537,4513,1813,4450,818,11832,11839,2528,1099,11882,13549,5029,10673,5823,5432,1251,3010,1703,3393,7235,5242,1981,3334,7795,7297,1912,8726,3258,6962,13349,6965,13351,10650,10365,11864,12371,6319,12378,12748,10880,7152,13357,1459,12558,3246,13365,6311,13367,13593,10996,10244,12624,8569,13374,11968,13160,13453,7446,5984,10588,5030,2209,11674,12929,12591,2273,3607,12933,4968,7396,6218,11161,11160,10910,3314,10912,8494,104,10663,4224,12857,2570,4842,13020,4192,6105,5301,10365,12894,8508,8865,11780,12898,2598,8520,6134,8516,1232,4759,2755,1172,1176,1255,9232,4598,6271,6274,6272,13316,8695,8395,13376,13320,13621,5736,7216,1186,12850,9935,6887,6430,1574,6432,6892,7001,12692,6437,12569,6898,6442,1595,6421,5607,9929,13332,2455,6415,2291,7132,2184,10061,12384,9561,6407,2726,6059,2711,9876,9111,5248,8732,13700,10966,394,6690,12383,9850,10063,5938,6402,6127,5953,9886,10362,6405,6414,1732,2291,7693,5349,3389,4256,7283,10844,9867,5290,10952,3789,13672,8783,10353,11970,12728,7608,5285,11769,6367,6379,2505,11012,6372,11044,6125,6371,6377,2495,13751,11027,6382,994,5339,5227,934,7761,4233,3399,3537,7003,1778,9103,5091,9375,986,2885,5175,5166,1949,12289,9163,1101,5790,12128,13784,13782,13774,9704,5169,12705,1259,915,2448,5021,7778,12571,6511,8322,4350,1984,12159,4321,13387,5219,5155,3328,5026,8984,1455,13807,7110,941,3103,1254,1887,5339,1533,6988,7639,2452,1376,13539,5370,8020,2301,5564,13064,2867,4889,3370,13201,1070,3089,2055,8445,2745,2507,3383,1246,2316,2048,4965,962,1890,3069,2029,1665,4404,3282,8150,2497,1645,2194,13769,11274,4314,4264,1389,5145,9517,11675,1177,12058,1517,3638,844,1771,2636,1404,4831,1689,9517,13742,9947,10826,12727,12537,7828,784,3382,5083,6022,1320,7764,10033,8776,6121,8776,13887,4816,1305,1415,13888,13884,8438,13896,9408,5197,5135,1058,13883,3022,13885,13891,9064,9555,13907,4230,13897,6125,13903,13908,1998,13897,12392,13898,11982,11366,5335,8871,10361,2715,13713,2683,8555,13704,4032,9100,12541,13726,11687,9888,12384,11846,2873,9849,8652,4502,2291,11756,3795,5325,13132,6530,5011,887,1425,4070,1400,2127,1443,8030,918,7700,1922,4998,819,2082,1567,912,4396,2430,4190,13340,13687,7187,13695,10884,6884,2445,12686,8871,2809,10903,9726,3828,5739,4490,4646,5405,1065,8114,9219,4920,13954,12048,8427,4760,13306,1096,13976,1130,2873,1929,13148,6787,13449,11761,13451,12959,13161,13677,8546,1110,1393,6542,5531,998,5621,10496,10480,5623,10314,1272,8604,11191,4136,982,7042,7089,5002,9484,7037,5262,10601,10658,321,1522,3472,5823,9071,13429,8906,10525,12326,4760,3022,1553,13133,4883,3022,13499,1858,3677,1526,9191,1551,12797,1482,5242,5174,11747,1547,1435,10688,1074,4729,5138,11532,13833,11630,8358,6489,1159,2183,7179,6439,7013,13693,9552,2345,13697,6448,12847,1583,3777,5222,4211,794,8995,4587,12515,4136,1016,2826,5321,13940,2535,890,3257,8640,1166,11553,1835,1195,1289,2674,5693,1115,5201,5084,2880,1842,13874,10582,12176,13676,8490,5392,890,8765,11188,6820,13534,5155,13537,4346,3714,5218,1713,9421,6820,11211,6409,1836,6766,1295,5265,3028,3076,12035,11490,4148,10492,6705,9885,11482,14016,9901,8607,4466,10902,6571,3328,10905,4558,3317,13638,3319,6521,4239,9905,12508,9908,1856,7106,5672,4803,2100,3415,8583,5564,8905,1314,6202,12394,935,8728,6142,5802,9530,9516,11929,13171,3933,13462,5183,13656,4582,2521,2640,2570,3961,3534,5153,6841,2545,8601,8909,3845,3880,9530,9476,12365,2053,11551,1374,1700,3028,8887,4311,4015,9506,2062,10721,12623,10998,12625,13617,13318,8292,8786,9548,901,925,7272,4210,7051,6538,10894,1776,3732,2762,11280,11392,3441,2091,4361,9463,2873,3025,11022,5030,5157,9024,1109,3441,1817,1005,12272,4475,13647,10032,1893,2072,8943,1172,960,13179,12694,13193,3375,11836,1672,3498,2026,1374,3439,4071,9967,13419,3399,3399,1515,4761,9189,1835,9581,4247,4797,5879,1728,11863,10229,7716,4239,1789,11866,11542,3469,3026,1349,4236,4473,5173,4474,5164,1394,2569,5175,3751,1188,1937,11542,3549,2087,5521,11339,5012,9189,8341,4712,14248,14223,1353,3385,13237,4679,5193,9454,3547,9967,1409,3416,5127,7556,14254,13155,9048,934,6761,14234,2189,11244,11496,1267,4141,14241,11953,1666,5222,14315,3751,8838,2528,2254,4236,4491,1771,12282,3700,4574,4994,11392,3358,2092,8401,11757,14207,12531,14209,12218,12725,13619,6954,14109,6561,8702,5987,2052,4136,7419,8707,8191,3996,7905,6650,8178,7471,7901,7665,7806,6660,7424,8180,7811,14374,8281,1082,3597,5868,1054,12487,320,2851,5942,1133,1548,9940,13187,3747,4033,1083,4504,6496,6489,5189,1961,9710,1165,1147,11496,13459,10294,9308,2050,9157,1358,10294,3428,8060,8777,1849,1309,3370,14385,13248,6910,12681,1712,1723,1961,8336,5216,11619,11837,13445,13413,1805,5176,10688,10133,1827,1311,1643,13470,6661,2862,1140,4294,4310,2795,1782,14420,5245,1661,13202,12004,4996,8431,1645,3022,13522,9136,946,3714,1076,914,12676,11699,5091,1981,13501,906,1064,1421,11990,13844,9589,12703,4592,4692,8772,4338,14466,11533,6243,4294,1147,1435,13847,14481,1234,921,4850,13470,4827,2698,4918,12102,924,14459,1154,1563,9276,1707,5026,14492,3971,2437,2110,2281,8228,9461,8778,3878,14462,3426,4595,6370,4595,1292,3658,14456,4560,5663,3052,3544,797,320,1522,1239,10571,14443,11632,2753,5860,1981,9520,5093,9965,8454,1656,3679,11865,1544,3254,8757,1294,13470,1604,1669,7313,1487,10012,2031,4387,10599,9713,12426,9673,1961,7079,3048,8805,6538,2713,12190,9185,1774,13501,9893,14556,1705,9612,11698,6857,4996,4015,9431,8114,9431,3519,11436,11631,14407,1336,13082,13287,8984,14505,9016,4722,1773,3810,4446,10370,5244,1663,14300,5888,4459,11474,3833,6694,3064,13077,4355,3066,1282,4294,3538,9021,9107,14556,4850,1427,10617,906,11270,8003,4403,953,4978,1143,1972,5216,12395,2795,2278,1522,2772,3667,3971,1687,9488,12482,14625,1522,1062,1254,3208,3356,2566,14410,14464,12968,5857,1705,948,1394,11474,3219,2632,3602,2772,14437,11256,2042,1551,1105,5591,5104,7033,8103,982,14608,797,13212,1020,14556,14614,5245,8336,3341,5948,1490,11523,4071,5942,1653,1786,7553,5538,1192,4870,13280,1893,5093,2850,9604,11631,1358,9032,2071,6505,2795,14633,1813,5028,5244,1296,11291,7756,1799,2762,1577,3830,7635,1296,11620,8096,1807,4024,3428,11234,4399,1389,8099,1062,3254,2679,1854,7161,1269,13247,6348,4713,2137,10457,993,2069,3876,6640,14417,13399,5022,9058,7028,1953,13555,12599,1440,3445,9721,3167,13425,6348,3039,14517,7793,5091,5759,8371,4298,11936,962,13916,1849,320,14642,2762,6716,5828,13271,5144,10454,4706,1731,3876,1691,14758,3357,5752,10393,393,3657,11570,3523,4087,10180,5205,11703,12711,14572,6546,4038,2321,1076,14746,14751,8259,14505,3602,10609,2895,1931,1981,12601,13555,4086,934,5175,10312,6735,11865,3843,1179,13470,3974,5834,5564,3087,9940,2194,4064,1254,1695,14630,1165,14642,3880,11344,8645,1735,4355,7119,13859,1682,7736,8984,1518,2677,1105,6333,12601,7159,12514,14761,2053,3747,3027,13766,4448,2895,5265,2854,2627,13387,4085,1170,1345,14816,14494,1459,2129,1713,3356,8382,948,14577,4296,1245,13218,1984,1322,14336,10107,1953,4730,2572,1858,4015,14410,11704,11342,3020,14784,12941,10569,14631,1160,4364,6868,10107,5872,12156,11500,1487,6772,10409,9043,2077,3459,11361,7933,14027,1827,4758,1427,14853,14576,14664,1318,14483,9681,3022,14722,2070,7200,6310,8630,2493,4294,3677,1963,5753,14435,11633,3402,1062,9034,6961,1680,10569,1580,12396,4109,9521,14385,1981,9431,5791,4502,5774,3805,10191,13186,1522,14903,2870,14649,14853,8212,1922,2817,14610,11132,8687,14721,11750,3679,14610,7216,14613,11234,5138,5246,784,12670,8996,1475,797,1656,5791,1971,13202,3087,9614,9721,5663,14440,14679,5564,1563,1003,937,14515,14610,4069,3089,4295,1483,1296,13314,1196,1418,2707,8431,5124,3877,1891,11418,14892,2698,14604,1856,5128,835,1092,10454,4813,5716,8593,1358,14520,10452,11558,14524,4996,13285,6030,5026,7848,11493,5162,1510,2283,11476,14791,4347,3085,1499,7872,2132,4066,4022,6389,2504,14663,3735,5123,14475,2132,8886,5097,5774,2062,993,3048,13487,14742,14614,8944,2122,11305,13040,6041,14548,14487,6222,1332,14493,9702,5214,7064,1515,12162,6594,1845,6594,933,1298,14730,3667,1017,9455,11247,13268,5247,9466,9571,7735,3833,4347,14315,4446,6135,11633,3428,10279,3712,9593,1594,14409,2912,1737,14520,11243,12678,3431,9071,9015,2678,8419,14683,4446,14721,14741,14515,11990,7200,2452,4441,13470,10634,12760,11086,1062,1912,1549,1699,1053,13177,14799,15068,9075,4079,2135,5205,992,7221,3534,11313,9514,1064,8451,2135,14906,11417,3445,3828,6222,11631,8777,15044,9434,12599,1924,14751,12162,14603,1345,8687,12676,11573,1036,4667,4444,1967,6487,14469,15133,1957,12004,8102,1561,1695,14623,6030,2122,14645,1227,14535,9268,13248,10192,15062,13522,8764,15108,5753,11634,10375,14872,9723,14896,10371,14809,14508,2040,1710,1658,818,14436,10179,11625,14605,1811,2981,11474,912,14832,1672,1361,14315,11098,3880,1322,944,11446,6502,2072,2259,10197,12483,14396,14121,7736,5844,14105,10873,14001,13620,14357,1225,2872,6395,7503,7451,12880,8408,12882,6088,12884,12876,2205,10963,1890,12291,903,1200,5550,3363,3514,10370,12507,9219,4406,4551,3376,5644,1544,11720,12131,8661,1848,929,13093,3369,5153,3948,1807,3528,8316,2932,7078,11382,11308,912,13901,3473,5918,12571,9265,5718,3537,10688,9363,4311,15111,4759,4867,6266,8454,9230,13670,13664,2894,9226,1856,10448,1668,14518,8778,1540,5831,5878,13546,2987,9658,2634,9361,1112,6232,1507,3353,1856,15049,1841,3505,6124,6204,9047,5020,9441,3179,1099,2100,8444,15202,12958,12451,15205,8927,9549,6613,6252,10313,5356,10313,5345,2341,2280,6044,3644,7283,13382,10965,10857,15315,7348,10951,3244,5345,5605,1270,2674,1186,10785,13628,2299,5395,10555,7948,12641,15330,12651,7303,15334,12621,5080,5352,926,13626,12474,10539,15334,12496,8411,15338,10341,15340,2664,15342,2408,15344,15329,7573,15347,10399,15349,13631,15351,7378,12433,15354,10344,4732,10536,15302,14000,15304,14356,15306,9094,8422,5075,4233,4701,5030,5547,1014,2120,927,2917,11018,9495,10927,12979,5094,5888,6299,5744,10804,12615,12934,1065,15383,3031,8000,2996,4249,3751,4252,7753,2783,2385,3015,9940,5155,1166,15372,12450,13675,14002,15206,830,1118,5319,4548,7283,10839,10965,11983,10313,14077,13685,13328,12767,13333,12892,14067,3711,13971,13337,13942,10620,1055,7847,2382,4261,951,3187,7555,10309,8019,6077,6134,5366,5299,10848,10039,5294,10844,5367,3777,5354,1293,10433,4927,14073,8105,6440,931,2294,6071,8561,13657,4207,3578,12917,1197,2521,7879,15466,6896,7190,13682,6457,13998,10824,15373,15416,15305,9093,477,1552,1577,2982,1551,5911,935,7501,8554,6547,5241,1427,1407,3653,3541,5856,13091,9242,1650,9220,2337,2081,12789,1540,5086,7554,1713,11850,2080,3609,5620,11633,9922,5153,6204,10844,3408,4870,14952,11675,3953,2028,5098,2031,2683,788,11648,4673,2030,10019,13083,2044,1960,10985,3979,3654,9497,5567,13835,8322,8621,2060,6204,3988,11602,2066,6973,3875,1013,14507,3739,1014,3487,2079,5173,14507,1251,11986,1154,5216,3956,11956,983,2082,8899,5869,2098,3102,6156,2103,1269,2106,1275,1529,3100,2111,13269,3049,7083,3982,4457,10842,5768,4055,15254,10912,14146,6569,4552,13637,3319,10911,6573,3330,6207,6198,2368,4385,2122,2124,10936,3481,3966,14847,10932,3481,7940,15614,10940,9128,10939,15613,10941,5880,4991,15620,1566,1266,3856,3095,4986,10232,5878,13957,1274,15501,9103,11290,15068,3957,9641,1199,7525,5714,4555,3621,4248,6030,1066,1813,10023,4704,7753,5869,1793,1687,12310,4988,10669,4730,2818,1675,2368,1114,14088,1088,14914,6211,10904,10909,3319,15596,15598,10910,10907,6574,10914,15482,11586,13159,13319,15417,15376,10156,8789,9910,15606,10943,10933,15610,2146,12486,5055,2882,1954,2887,4990,2888,8441,4593,5668,3003,1687,902,15094,14773,2596,1188,2686,6606,1125,6737,6741,6834,1709,10894,11140,10705,9134,6546,933,9004,5844,1097,2981,2459,15294,8678,6207,9402,10428,3486,3524,13567,1778,10023,1956,4587,1670,12079,15675,12626,13674,14355,8293,15487,1387,2141,11484,2858,1760,1148,12269,5993,1580,15501,10034,12486,6143,6218,1427,15501,978,2707,2132,5993,12209,3936,15385,2783,3606,3790,7947,10320,10797,12618,971,12620,10576,12947,10538,7967,6127,1297,5366,3740,1465,7505,4075,2071,2286,6801,1303,1442,1793,4867,4017,6252,3185,915,9085,12859,9649,13999,15415,15741,14213,10471,2020,1110,10715,12853,6842,6307,12719,6651,12546,2033,13597,13354,6971,12551,13601,10604,8728,13604,7140,6860,4459,5885,13608,12715,13610,6335,15812,15414,14354,15678,15486,14214,4382,1110,1493,10794,13627,8014,2299,9611,15350,7949,8035,15367,8051,9611,15356,2205,15358,7391,7997,10399,15845,15364,15847,6486,15353,15850,4329,15852,2236,15424,7996,4959,15857,6217,15859,3794,15848,12647,7980,15851,15776,7358,15799,10580,12957,15484,15803,9654,10781,1226,999,1854,1122,2526,5115,5795,3422,14798,1981,2120,9490,15895,1723,13821,10744,2217,13049,4029,4240,7654,1735,2272,2504,3934,3940,7036,11528,7614,5716,7654,8894,10229,1190,2873,13855,3077,2334,2540,6641,1010,7653,6868,2408,5164,11022,1728,3035,5792,15934,1805,3472,1569,11795,13192,15938,11249,15935,5403,6832,3493,7732,9697,4864,13065,6994,12159,6914,15950,6914,13065,11892,15954,1574,8464,6815,2120,937,918,4316,2880,5907,11440,4495,15941,12503,15972,15970,15939,11440,2997,3106,1789,3107,15966,15976,15967,11249,15971,3934,15941,3476,15943,5907,15833,13375,15884,10251,11154,526,1118,10975,11788,3113,5573,9906,11720,1445,3114,3131,3472,4136,10128,10205,3126,9808,3269,10834,7348,7386,8887,9559,1275,3343,4317,1692,8414,3203,3099,3186,4050,7829,10512,11189,3126,11175,11190,11177,16005,9943,9941,16009,2880,16011,5346,6630,5054,3311,15036,8960,2029,2065,11056,13001,12677,7626,11626,13864,2696,2135,6987,15592,15666,11166,15668,14149,3315,3789,6210,10903,3323,15594,16061,10908,3328,9838,12162,4635,7469,1693,16074,7174,1705,14651,3415,14604,15023,5245,1711,8475,12439,943,12581,1653,12706,15183,3128,15110,3028,5845,8228,10183,11687,1447,9726,3955,7568,10233,1084,3747,7077,4920,12182,10040,15862,7980,2982,15865,15738,14210,15677,14212,15885,11591,12355,10473,3309,5326,1168,10596,5363,6387,7078,3343,9491,1359,6991,3796,2092,3736,2795,1583,15345,9864,5343,955,6732,11674,3732,5001,1404,1658,3050,9265,13861,12119,10205,4480,1569,7413,2132,1511,5182,1482,6701,3163,3553,16162,11233,1247,2113,16157,11577,9495,15729,14186,16151,13224,8938,13576,3407,5133,2901,4337,10135,2357,15757,13661,6230,6222,14150,10868,16065,14144,6567,15724,12521,1161,15723,3320,6206,3323,12148,3927,3312,14147,14145,10907,11876,15328,7922,12419,15332,12087,3162,15872,1596,6143,12438,7351,2198,2980,10740,7982,12622,10997,14351,13616,14353,15992,15835,15375,15743,11592,2572,2660,16208,4237,9474,4475,12424,2328,4961,12944,12429,8218,2297,10754,2244,6209,15865,2409,10332,15842,4465,6209,15846,15772,4141,4679,7864,12872,4980,12949,1426,16257,7119,16221,13614,14208,16224,12349,13618,16227,15742,15837,1387,12539,16232,15331,16234,16241,16237,4412,8215,16240,4239,16242,7317,4411,2374,16246,15878,10347,14350,12722,12532,16116,15740,16270,15804,15886,10975,2763,12473,15856,4327,16252,15872,4471,16255,1736,15927,16258,10767,16260,4238,16309,16263,15879,16291,13372,12723,16225,16269,16118,15994,12354,3154,794,999,927,2485,15429,9936,13342,6894,15433,13969,12691,12401,6900,9953,5222,1192,3365,2062,1361,4146,11135,8310,1093,10286,2071,2846,2059,2790,13542,15561,8135,5885,981,8463,4624,11062,9572,7790,16351,8879,5026,14223,11371,13192,950,5011,16172,1653,5430,2321,16329,9987,3031,6779,5753,1950,8000,3856,3005,428,2880,1328,4986,13845,1073,6713,2773,4341,1165,4401,15581,10370,3472,1424,11284,14249,1285,7220,1539,11189,4401,3243,16389,16098,8414,3431,1490,11941,14172,1963,11533,14031,2060,3517,6827,13200,8329,10230,1960,6757,5169,4522,1603,10011,7923,11769,3527,1610,13403,1413,9502,15481,15880,10149,13450,15802,16296,16119,15995,1638,954,6470,4621,6528,5631,8890,15232,5590,5683,5554,1302,3404,6583,11123,13425,11612,11176,15236,1536,7033,10804,6901,9615,6875,3156,10673,908,1239,9032,13766,1950,1707,1688,10565,8144,2129,14824,14874,8964,14578,2992,1076,3039,13901,6937,2502,1926,16080,15908,8943,1131,8886,5957,14582,3651,1793,1600,14673,6073,2512,7622,1801,2218,2513,4581,15499,15164,3746,1793,6613,2690,3493,7936,10548,11777,14433,1358,2569,6938,2077,6203,14521,5716,13893,14836,16483,2115,12410,8144,8079,1707,11839,3583,4249,16470,9397,1060,2820,1569,3700,3418,2368,9291,16471,3790,3445,9128,11742,13097,7067,12695,10367,6030,14662,3974,1158,7936,5152,7791,14096,15132,1158,10705,15792,14740,3420,1457,6695,2679,3248,1403,1105,15473,4141,2078,15851,11069,12049,4628,3655,6370,3099,16573,1764,2750,9434,3046,4240,4513,11249,16510,10510,10170,1440,14598,14525,14662,2506,9018,16556,4070,4349,14245,5026,9279,3178,9372,16611,7222,9986,9986,10769,983,2821,6914,12053,9940,5553,1116,1925,1022,5862,10693,6549,15991,16321,9209,16323,11972,6606,9910,5608,11202,10219,10986,10484,10995,11197,5619,16643,11184,10480,1567,3826,12458,6528,11922,10978,16640,5528,16642,16642,10993,11183,7752,10986,6926,6145,2105,8221,9219,4323,5240,13848,4998,13463,13829,2535,5797,1111,10518,13224,15888,1587,4386,8890,4404,2501,2107,13171,8401,3880,3219,1657,5661,1148,908,1400,14080,1594,3734,4753,13523,9627,9259,5636,6524,4864,4935,12131,10482,10477,11916,12133,16641,10505,16657,11199,12127,10484,10508,5336,5336,11920,16706,10497,12127,10483,16655,16711,10505,16658,16708,16715,10491,4619,9977,16651,12133,16639,11202,16710,5535,16643,5618,16645,16660,11202,3183,4706,4462,935,4701,1409,13195,8309,5161,2528,6216,5550,9268,1558,14271,4234,12288,5087,3795,4801,15222,10297,9663,5393,2503,9658,2372,1512,13205,16771,2088,4884,14340,5262,5393,1196,1700,16773,16630,14211,16632,10355,16120,10330,16182,11752,2207,1526,2041,4200,1389,15716,1070,3655,1839,16433,5668,1686,12557,2129,13121,1182,1557,2924,9698,5765,14158,15405,6613,9136,3946,5167,1848,2778,4361,1514,1682,1151,13579,4086,9039,1280,2067,16792,9523,15701,1099,4729,16422,890,13530,5816,1893,16795,999,16826,12079,10492,9697,12589,1018,11736,10242,12128,959,10240,961,794,14052,10170,945,8170,10174,428,10176,3081,11709,10180,7923,14601,3536,7513,12022,6705,1019,1596,13522,1094,10191,3334,15164,10691,6749,10197,4311,1168,10200,10659,13136,9278,7076,16881,8999,10209,6988,5191,3313,3721,5011,5236,1299,4722,12705,6728,1190,13458,5868,12337,13457,13562,1400,6993,1727,953,1693,1727,7749,1254,16848,8467,9992,2151,16438,11760,15483,16441,16322,16785,16444,16121,11392,1494,10977,15920,11482,13169,2129,4234,11232,9401,794,3830,1508,10705,3512,6012,8310,2531,4211,3400,5016,1574,6294,16255,14248,7921,15718,2566,5881,7705,5137,1777,1965,12742,12695,3547,9059,16767,16960,10226,16958,1669,16956,11487,3551,5262,1716,2103,3394,11660,4560,1415,11597,3680,10262,11744,11668,11601,16971,1786,11605,11722,13534,9083,11610,12141,2494,6307,4430,11616,11235,14619,953,3395,13199,11622,4022,11624,15003,12020,1832,4401,11630,16908,11633,13187,11447,3087,15151,11639,4138,14054,16099,835,11644,13267,13189,11648,5749,11037,5167,11653,1725,7195,11657,1826,11659,6121,3385,11822,9603,8808,10492,6502,13041,3875,7216,1780,12318,1326,11645,2875,17017,1904,8438,11692,3407,11474,1956,14130,11698,15586,4793,2147,14843,841,12396,4387,16594,14886,11710,2681,917,11713,14589,11607,11334,11061,8007,2217,3116,8320,11723,2150,11725,12701,3830,11730,7088,11731,911,11733,11640,11736,10043,11739,5229,4306,11743,1826,9164,14053,6941,835,11751,6255,11893,16197,11756,3338,11676,1327,12832,4317,5750,13613,12530,16292,14352,16268,16783,9546,11590,16922,16692,4870,2485,7162,11224,1523,920,7610,6256,3409,1981,1827,13227,10685,14668,13979,5968,3792,10204,3485,1889,3103,11912,9470,8818,1506,7063,13177,15692,14705,11790,4023,12184,10574,5241,1160,14685,6705,3234,1663,972,16314,10057,11839,4217,13571,1763,10232,1735,10550,1409,1768,1166,3403,1010,1654,1800,11019,9290,2122,16782,16117,16784,17116,16324,10157,9310,13930,12889,8497,8504,3906,13652,8864,6629,12897,10894,12899,4583,7870,12914,7838,13640,13642,8535,13644,1200,17185,8502,13649,9775,4021,17190,6111,17193,4205,8525,930,17197,16862,10839,12914,17201,4603,17203,3109,4190,17206,12891,17189,16504,6110,12896,4203,6130,12841,17196,13394,7695,5653,16031,12512,15422,17198,9677,17210,17230,3123,14179,17214,10708,15473,8530,7134,12888,17225,8498,3698,4318,6244,16622,14084,9943,17200,956,17249,12858,16317,12447,9087,13317,17179,17115,11153,16324,4911,1275,3786,1690,5136,6199,6058,3103,4554,6563,1647,3108,5177,11961,16086,16216,11978,2359,1124,911,1151,13813,4273,12075,5551,12078,1113,3796,6830,4870,10179,2523,5162,11170,1334,6095,9887,4631,8942,16994,7202,4862,8641,11955,12002,10311,7776,2499,1941,2880,6441,6649,1664,14943,8103,15581,2987,3655,11215,14171,6504,1021,16375,9735,2040,12783,12996,14933,2184,9428,11187,1078,17323,9162,4481,9200,4481,11091,2670,1438,15490,14649,2500,12783,14833,5801,14798,17333,11423,8449,5245,8100,1429,12003,5816,982,7175,1475,2057,17345,1569,1438,15712,10311,3221,2120,6722,14416,12600,8103,12668,8745,9877,5823,4645,14385,9594,8149,3528,15110,11210,2994,1963,3028,994,9965,15927,6136,12124,14029,7230,8319,2065,16354,15701,6256,8444,14848,14520,1774,15451,3929,904,3245,1281,14347,4641,6590,1189,3257,4416,15875,7644,4982,16115,16320,17114,9949,16921,16324,11099,13624,17308,10362,17310,4502,4637,9111,8517,1817,8954,1957,7313,9839,12669,17385,2854,4631,6115,14156,459,9326,1657,838,16392,4652,6427,392,6119,9501,16160,11175,11951,4338,13292,2518,17438,16423,2721,4674,6750,17074,9517,11817,1251,4751,13224,1503,12085,16480,13574,13989,5846,4760,1187,2022,11361,8386,3500,3551,11273,5189,2996,2077,14393,1958,6829,17498,1682,3929,1398,3399,16027,8803,2983,1082,4390,969,8341,3504,6441,8688,10267,16471,5429,16577,14192,6891,15222,911,11744,4658,6347,3656,1326,4389,14015,950,6783,15649,12400,13289,1248,2141,6222,15581,13774,5989,4828,3435,1064,5580,2034,2346,4864,5693,3460,11746,13530,11815,5642,10381,2850,1593,2990,7528,6204,1829,3359,17419,12204,12921,2912,2773,7089,9014,15708,2051,10688,12233,12699,3393,3409,6302,2454,3975,5299,3364,9474,7936,6239,6827,3026,3002,16691,10646,1084,11600,16911,3052,1770,9239,3602,9425,3039,6197,17427,17113,17269,17430,17181,12631,17183,5353,7704,13922,2852,17437,10974,17184,17607,2678,17609,13728,14416,2321,2051,1924,1985,3906,9721,3228,11418,3918,10384,7842,9721,12468,4085,1468,13705,13929,4318,7054,13936,6984,17633,9118,4645,5083,8852,10423,10391,10058,3473,4480,16055,10062,9108,4318,8091,3721,17383,2698,9998,10136,4078,4025,9837,17636,13660,10041,10138,6346,10045,1354,13240,943,14723,10050,4367,16916,13373,17428,17601,10153,17603,4288,10358,9121,7833,7697,7874,3915,11787,2704,17448,9101,2870,10378,13927,17656,2724,3186,3719,1309,2695,16074,13928,12386,7848,10055,9824,12472,17671,3756,3205,1354,5243,1679,9454,6606,17618,10411,1348,4751,10927,15608,13951,15621,2143,8860,4475,15263,15269,9226,15266,6264,9834,4986,17618,14883,3381,13774,1447,3445,2923,8323,2811,6608,998,11941,15711,10561,1693,788,4433,13267,907,5909,3431,15720,13294,5918,6203,16196,10912,9402,6533,11479,4522,1249,3537,2065,5003,3021,6546,8808,17599,13158,16295,16920,17679,7828,10358,12456,17683,4125,9794,12598,17623,3908,3490,6823,3351,14429,1800,16356,483,7881,7862,4255,2673,17687,6410,13727,9568,3177,13937,4455,4638,9780,8413,13719,13938,9894,7888,10894,7136,17719,2149,15609,10945,5129,17724,7036,9268,13666,2755,17729,9233,17731,14234,1299,17734,6537,14436,11337,12999,4306,17741,15709,17744,1773,5135,1196,17747,9391,7954,7209,17752,17755,1575,6739,6202,8765,17758,15726,17282,9189,3355,4495,10658,15732,2895,2790,17768,1119,17770,17674,16319,17600,17773,17180,17271,6956,1118,15315,15422,5301,15867,9830,3371,9897,16072,10598,1439,1599,2501,10704,13338,2345,1110,10607,10705,10610,6152,9985,4135,17876,10842,10983,6481,15468,17232,17195,3389,15472,13643,12918,13645,6101,5297,11673,2673,6889,3826,10593,8419,10595,4845,17894,2664,10717,10595,10616,8909,17178,17865,17270,11971,4288,14111,1735,14113,17069,4592,14116,13833,14118,2214,14120,11126,17928,14511,4430,9402,10643,7096,14129,3022,14848,2459,11607,3106,9183,4291,4522,8628,14537,2371,8811,923,9008,8977,1162,2501,7799,6421,1435,9605,3969,2132,6248,1806,2085,13814,6030,3365,3957,10085,2904,1814,1588,1270,2315,17521,3112,14139,11193,14151,7136,15665,16067,15667,14148,16070,2105,17983,12506,2774,2207,12509,7517,1125,3026,3491,1572,14160,6977,1695,14163,13256,6317,2226,1656,14169,11331,3843,14172,8601,1439,16983,2241,16155,1788,17194,15470,8825,6943,1697,14258,2880,7356,14221,14189,14201,5716,7159,14193,2677,7356,8440,14197,889,14199,8911,14202,6306,12788,6137,17920,8541,17774,17867,12223,1199,8402,8426,13756,13752,2593,6063,9896,5319,2664,12085,2677,11013,6158,2518,13701,6584,929,1007,16218,14143,15593,15667,2245,7618,17847,17988,16186,3315,1567,10588,2342,2983,15607,17813,17721,15611,5965,2209,4770,17909,10720,17911,4429,4090,1970,17878,10706,11052,17882,1980,15366,17424,3206,6143,1313,6175,17722,7989,17720,13370,8390,17111,16267,17772,18045,17866,17923,7608,11156,1051,5369,2433,9219,14625,3316,1051,1695,8794,4442,14015,9943,14140,8554,2184,14153,17994,9908,1392,4442,5013,1285,2135,17542,5020,1594,5417,11008,16215,10431,10741,2359,8500,15360,7459,15216,16237,8522,15339,10537,7324,2355,10413,7538,2360,10806,4471,18156,16111,17425,4529,5375,3599,6437,18129,3114,18131,8608,12507,18135,11190,10836,17698,17446,17384,17657,6173,2704,3017,1490,3746,1315,3403,10843,5987,16289,17109,12721,16318,16293,17676,17921,17602,18047,13747,17099,6817,12799,2850,17309,13728,16072,13704,18183,13721,7195,2714,17660,9557,9848,17638,2876,17640,7376,9098,17614,9878,9102,9880,17655,14439,2669,3910,2704,18215,4087,9837,18218,17632,18220,11687,6578,3599,18223,9883,10363,5937,17699,5246,17694,9108,6082,2866,10445,18217,4061,18219,17807,2721,5330,10799,3216,18242,18208,18226,3628,18228,14605,18230,9109,18251,13923,18235,18254,18237,18256,5944,17869,5353,18261,17436,18209,18227,17649,17447,17657,18250,17659,18234,18253,9891,9560,9100,18258,10764,18206,17608,18225,9889,18281,16077,18248,17803,18285,18233,6412,17691,18236,2731,18274,8324,7276,18222,4751,18224,6097,18263,18246,9892,17689,18231,10444,18270,18288,12383,18238,18257,9119,18259,18294,18313,6425,13934,18298,18247,18229,6420,18302,13712,18271,18289,9117,18239,18170,3270,18278,13932,17610,18210,18265,12670,18267,18336,18252,18305,18272,18307,4455,18325,18310,5332,18312,18243,18346,18332,18317,18284,18214,18337,18322,9570,18324,5944,18358,3786,18344,17615,18315,18182,18300,18350,18366,18352,9571,9890,18323,18308,15588,10804,18328,18361,18280,18264,18282,18212,18249,18380,18321,18353,18339,17639,18341,18276,926,18374,18296,18331,18391,18299,18334,3717,18351,18396,18382,18306,13728,9893,18357,18387,18403,18314,18297,18406,18333,18266,18335,18395,18216,18397,18384,18356,18371,18417,18360,18262,18420,18316,9106,18349,18424,9834,18303,5821,18427,18369,18385,2205,5605,18359,17435,18345,18390,18435,17650,18301,18425,18287,18442,18255,18429,18309,18431,18448,18375,18434,18377,18408,10376,18454,18304,18412,18354,18414,18291,5346,18241,18432,18279,18376,9996,18283,18213,18439,18367,18456,18273,18458,18386,11016,928,16124,10975,6998,2294,18490,16015,14113,18286,18468,4027,12382,18443,18485,2725,1299,6732,6415,6338,7466,15361,4327,10969,16253,6076,6082,18167,3206,6690,16114,17862,18198,17864,18114,17922,13746,4953,2997,2113,8861,11948,6932,9698,6823,16394,17698,4658,4845,15283,12472,5373,7960,4732,6239,1884,3069,14721,11775,12368,13920,7923,6127,8510,2429,16020,5922,5396,955,9991,1084,7045,1391,1084,17895,15910,11289,2210,9726,18563,953,5295,331,5497,6514,979,18569,18555,3154,17105,7103,8866,9896,18560,15445,4265,18541,14721,13281,1433,1553,5965,7339,17378,9824,6152,1849,9599,15660,16394,4264,1937,2539,8903,18044,9545,18201,18116,4906,12356,10811,5358,7395,15330,13237,10995,11923,5623,5297,10330,12649,17652,7922,4585,15918,10064,2326,18104,2787,10931,3705,15612,1261,9856,8588,4623,13113,930,3777,6391,5296,1230,6391,5229,4389,1391,4460,18601,9758,11589,18202,4953,12539,7449,10812,12616,2395,9791,7842,12869,7452,10736,2246,4331,7456,2304,9827,4021,7521,7389,7325,2402,8947,2229,9828,12888,5069,7393,7399,2386,8967,15447,10321,298,10708,15446,12617,7713,15808,13591,13348,15812,12484,12665,6107,6977,6851,13355,15819,13605,15821,6323,12377,13605,15825,6981,15828,6333,12665,13368,1345,2116,17771,17268,18200,17678,18647,13622,4214,10161,17883,13711,6696,18422,7046,7618,12668,17701,11687,7005,3155,4078,9846,9889,6437,17806,17802,5944,2428,16206,5055,16330,7008,13688,2440,12418,17522,13996,5752,11217,5394,9074,13137,18508,2273,16788,15770,10380,3202,6534,1678,14268,11721,918,2856,1722,13691,14069,12686,6292,2450,1582,12846,15465,6452,9934,2461,6433,18644,13744,12629,13878,4906,3777,3602,6217,13326,15436,16338,12375,9917,13341,14075,10671,1010,13681,18773,7004,12403,13686,12690,13967,1597,9808,1143,6127,11049,18728,18455,13934,6292,18732,12385,9108,6366,6423,18719,9879,6292,18478,18724,18325,17636,2846,8664,1067,12853,2568,7003,6945,1581,5342,6403,18783,2577,1593,6629,9938,928,9793,1465,3472,13994,8891,1551,9034,11615,6071,10436,9455,4590,14510,7103,18775,13876,13377,14003,6171,13345,10990,18656,15212,4181,17289,11775,18154,6091,10864,16109,10702,13922,9836,9557,10683,18816,18248,6407,18686,18804,18468,4089,2903,18808,14563,18734,2498,10255,18766,4429,15430,16332,12692,13325,14068,18784,7015,18766,18787,18769,6450,13334,18772,16435,18774,18709,13673,18521,18603,18523,5984,3044,5881,5607,13902,13909,15502,13908,13911,13003,12677,13886,13895,13917,13916,13914,1322,2081,13892,5197,1550,16109,18811,18867,18404,8732,16182,17693,6406,18230,18803,9845,18805,4089,8480,17801,18809,2868,2291,3826,2208,3007,17936,7046,8997,18846,16689,16992,7859,10403,6820,13344,3381,16043,16448,9899,8605,12516,2856,6999,18134,1287,17995,7104,10784,8660,11190,5656,8607,17257,17453,17259,3114,18850,14107,15679,16229,1226,5306,14077,8988,2924,8259,6434,15926,6637,8163,8256,15926,3950,8260,15528,15911,3035,8264,8250,11024,3955,3935,1980,17306,18742,7412,8269,7576,8191,7896,8719,7898,7812,8717,19012,7902,7899,14368,7679,7592,8712,14366,8287,18901,13743,18851,14108,15680,526,11156,7449,10332,9484,6369,13753,18055,10318,18059,18054,11028,3494,12374,2865,6255,15759,3940,5663,5763,9621,9626,12055,3954,1433,11901,15355,18194,15841,18750,15768,3686,11904,16196,16190,1477,4770,12840,6104,4194,8413,18059,11032,11045,6369,4564,12061,14014,14711,13760,14511,11027,16064,8426,15499,18061,18052,10957,12687,1475,3045,3069,3505,12055,11086,3052,1667,19053,19048,13531,2855,19057,15370,10742,18667,15331,15843,18210,18074,16060,16186,3323,9785,2568,8826,4206,6106,19071,11043,11030,6158,2495,18979,13452,16228,16272,5051,6428,12649,11049,6199,15753,19099,1957,8371,1667,9621,19094,19099,3068,10650,13630,18753,12427,15874,10275,4838,3638,17847,15599,6206,3315,4202,13096,6131,8507,6113,19084,2704,19086,6377,5067,11009,13754,16689,11044,5317,9486,19119,1998,19121,6383,16841,5347,19130,11717,6592,13957,19098,9626,19137,5763,8358,15633,4633,16212,10812,18101,18383,19149,10907,19151,3328,19153,8832,19155,8520,18181,19158,19041,1658,19043,4969,1653,832,3494,4217,11013,19167,19072,4215,19074,19122,19026,13875,18980,15836,15805,5284,2572,3283,6994,5035,1853,1957,5857,7179,10170,5706,16147,1890,17376,3517,12098,1442,1856,14900,13861,16147,19223,12760,915,11740,10970,6725,16723,11202,10500,16736,16640,16728,16658,10995,3106,1550,18146,18885,16331,18740,16336,14070,18768,1581,14075,6454,2435,9936,2264,11820,12358,6821,9987,6222,1092,15765,11059,15765,4760,975,11750,6581,2919,6993,6993,11965,5945,979,10053,4056,14127,11678,8959,17943,9157,13187,2067,10263,14128,11526,19294,17941,2795,2129,9124,6766,19290,6197,6816,3001,8550,19035,2495,19037,3494,13756,13758,13758,6373,11031,1760,11029,1916,3859,19256,17253,16564,16509,2609,4205,16524,12049,18022,929,5330,1550,12464,18910,18921,19201,13910,13894,18913,18917,13906,13917,18916,13905,13003,18921,19123,15204,19125,19218,1388,7272,8268,19021,7801,7895,14371,8181,7899,7666,19360,14377,8280,19020,7815,19022,8708,19024,7596,17265,12860,15801,15834,18046,18604,5984,10157,11099,10529,11608,9594,9219,11277,9199,5688,16484,11853,13585,17380,18011,17333,9268,8776,8096,9434,1960,1947,14955,1459,13908,15289,1195,17466,3471,4444,7936,3316,7098,4474,17962,13833,1070,12307,9308,1005,4349,16757,2132,13121,7177,17698,15359,16208,15843,4961,8970,18932,7316,8219,10762,19429,12149,16310,12948,7561,2725,6063,8413,2141,2730,788,3057,5145,15733,18611,1406,19350,15374,16271,19353,13164,18205,19089,17071,8524,19156,12687,8862,8514,8509,6082,4568,1702,19459,17227,4575,17355,15475,13591,19068,15470,6106,8564,4224,8846,2609,11876,4060,12660,4820,9136,18090,1439,18092,13968,6930,10599,2600,9620,18098,10702,17885,10704,10609,19491,10708,17916,10624,10720,10619,6134,10709,483,10718,1657,10625,19214,14106,19124,19452,16298,2208,1154,9369,6833,5608,10974,15690,8506,12154,3879,12265,15017,2636,1925,7634,8977,7623,12036,18611,6414,5055,6136,1144,8453,10079,1114,2618,1967,5075,4065,7635,15413,5917,16761,1390,6330,6629,7871,19457,19466,19197,10435,17243,19463,12965,14290,17187,4583,7842,19461,8824,15475,1759,4140,7297,907,17153,7231,13555,8811,14765,1789,13136,5439,11880,2433,1188,13049,5678,784,1073,922,17368,7741,840,15100,2029,13323,6313,18815,18095,10610,17881,10603,16125,3123,19495,1439,19497,10707,10612,10710,19507,17918,8887,10714,1722,19500,10719,8909,15476,3207,4720,1275,1947,1956,5541,9047,15297,10473,13139,19450,15485,19352,16298,1166,2025,16382,1710,11545,8814,2681,2088,18188,3929,2493,3933,11604,6714,3795,5791,4812,3544,14593,7098,14851,1252,2386,3658,14030,1707,11299,6766,7780,1339,7779,9506,16607,1548,4391,11306,8611,1944,2368,15186,14630,7098,8809,2583,915,1763,16733,5618,5611,16729,12135,10481,10993,10503,19680,16740,16742,5535,5339,5675,2905,5619,19678,10986,19248,14012,19250,16714,19252,5621,18240,13633,4832,13179,7098,11012,6973,1490,6199,16423,3003,10011,10224,17943,17395,4765,1234,4816,6199,1717,11099,17943,3027,8886,9072,1214,19725,17470,19720,11526,19722,16887,886,17468,1245,4807,6255,19703,17035,12286,19356,19368,19358,8179,8714,6658,19362,8185,8185,19019,14367,7901,7593,7436,19368,19626,15993,17431,12631,19630,15564,1170,1038,1827,1416,11917,1249,13466,11421,3113,1823,18051,18125,4338,5942,10263,19658,6754,1522,7074,13024,8942,1038,1544,9255,11415,8008,15769,13462,19646,2214,19644,6538,11501,16169,19635,1315,19639,1327,19637,17762,1692,19672,7231,9414,10495,18612,19246,10499,16724,19695,16736,19251,11182,19253,16179,10494,7741,19806,19682,16708,16720,10502,4764,19812,5617,19814,10769,2704,17956,19704,19733,17395,19832,19709,19728,9037,19728,5864,11752,19709,19727,19718,4884,19649,19719,19649,19841,9537,6928,4816,19844,19843,19711,1214,19733,19715,19714,19737,4656,17506,7891,19357,14369,8272,7670,19361,19015,14375,19744,8720,7894,19750,7486,19752,7678,19754,19510,15203,19451,16297,16786,4908,13684,12590,19107,16718,16253,4471,10558,11008,16247,7838,14142,19817,19245,19819,16722,16654,19811,19697,19813,19699,19815,19689,14011,3360,5614,19820,19898,14012,19824,10973,16643,19700,15338,19702,19712,4079,11058,19732,19732,19834,19411,19858,11526,19714,19840,19724,19732,19845,13256,19852,2895,19717,19848,19715,19730,19729,19835,19719,19708,19724,19834,19736,19917,6092,12287,3962,19862,8712,19017,14372,7582,19867,7900,14376,8279,8721,14379,19009,19369,14365,19021,19755,16442,16633,2658,10493,4954,2411,10881,3695,3175,3194,17663,19971,3626,3262,18623,3196,3210,7878,18618,3277,3226,19981,4841,2381,7770,7882,3236,8494,10888,19990,2192,7865,10898,7045,7773,12468,8746,7887,15208,6082,16733,10478,16735,19810,19684,16727,1780,20010,19684,16661,16041,13633,20005,16707,16722,19682,16656,16726,16713,20013,16743,18473,2419,9511,6736,10260,6608,2811,4685,1954,3375,5301,8760,14710,2428,5203,12141,17832,1819,6735,3115,6743,6613,20043,6612,2803,3660,4308,20042,6612,2811,10609,911,1649,19964,19377,18905,2563,16731,13880,18823,14133,16992,16125,18950,6820,10604,11536,6820,13641,18839,9471,14134,4188,3786,12738,7024,18843,8413,18845,20070,20068,8299,11721,11615,17805,17945,3493,15662,4256,20080,11607,3493,8867,7065,16986,10135,9916,14510,1551,20074,14132,13148,20077,5306,3270,20095,18951,5886,6586,14608,1551,20071,20087,20073,8548,20106,14510,15978,4068,20065,20088,20067,9677,20099,20085,20102,11723,11615,4308,18955,4430,20093,20079,7769,20096,18843,20128,6219,11607,20117,18951,20104,20134,20091,14134,11673,20138,11386,18848,20068,20084,20144,20086,20146,20133,20075,20107,6815,17073,20094,20139,20112,20155,20129,20157,20131,20126,20105,20135,20092,7796,20165,20153,20127,3721,20143,20116,20158,20103,20160,20121,20136,20176,20152,20066,20097,20168,20181,6809,20183,20132,6811,20161,20122,2340,19434,926,20111,20154,20142,20115,20194,20171,20073,20148,8891,20175,3621,20125,20081,4303,20205,14122,20101,6902,20196,20173,20149,6815,20213,17796,20215,19157,20169,20182,20208,11607,12148,2319,17826,20072,20232,20210,20076,12285,18049,15467,4546,13723,2209,20243,6059,16205,3698,19288,19676,20018,5537,20244,12825,17993,19680,10980,10480,6975,9916,10985,16638,16708,2456,2664,14007,5537,14009,19687,19877,15303,19627,19513,16786,9213,4447,3725,2095,20180,3349,9219,6202,17999,17625,1156,3334,17314,3510,2274,13847,12304,11234,13086,6303,1710,8726,3850,8949,3415,1014,17301,5145,1163,6240,10567,9572,19782,12050,10658,9530,16675,7333,2566,16340,3532,6778,15193,885,11955,4563,5917,1228,987,7754,5167,2059,5688,9618,7548,2251,6305,17643,12566,18210,12804,10100,4885,1643,3681,1977,1433,14511,1665,20004,12132,20006,19911,10506,19814,4657,18802,19586,17292,11305,5011,4994,4690,1803,2317,4670,818,8811,8336,10706,912,3398,3163,1587,12106,3364,3795,1278,15403,7078,20368,17376,14712,12773,19636,1099,16925,3203,6993,14911,1805,14616,7784,1179,5242,10135,4696,11985,10659,1993,9493,1774,4678,18107,12780,2122,11819,13042,5257,17666,2114,1845,8704,4029,4717,8311,3873,12138,1249,6857,5922,7063,7052,15186,9455,4146,17764,7060,1937,18195,13371,17266,9946,19511,19351,20274,16922,11156,7304,3224,7507,15234,8578,11206,10234,1162,16125,4620,1594,4050,1936,6389,17325,1001,3833,3151,4626,11206,4134,9521,4080,3184,13132,4564,923,428,5461,3400,6476,20362,7034,2141,13710,6692,7041,2795,14973,14587,16473,13488,1806,5113,8025,1142,1482,15141,9128,9970,13783,12004,20484,14434,3489,16400,7082,3281,3501,3176,1161,10710,19772,2528,2203,1529,4323,947,17295,1313,11206,5817,1389,11811,11378,9395,784,2057,12760,7106,8726,1897,8021,20281,1447,2661,3089,9268,1909,2343,13065,3096,7731,20443,1363,20322,13071,6744,6909,13248,4658,9628,1543,20331,7769,12565,4844,9880,20336,5461,20338,4248,11050,9629,20343,1705,2712,20262,11922,20348,19686,5619,2315,9176,4659,20353,3461,4211,20356,16680,14653,1778,20360,1967,4671,4818,19490,1810,20367,5703,1968,4918,13492,9663,5636,20545,16546,3686,7039,12041,5688,19796,20381,9703,20383,10060,2247,19287,11796,20389,6125,1392,15387,11305,4247,20395,1712,4814,17932,1603,20400,2318,13466,1324,20404,10044,20406,6148,1151,956,20410,16691,1298,9940,907,20415,16589,4594,3688,7052,1066,2072,20422,4754,1343,20059,18115,20061,3897,13589,2097,8839,428,1999,3721,11208,8735,8097,5678,1125,6825,8127,12607,8105,8115,1166,1290,11955,20649,2783,4761,20645,8104,11994,4339,20643,1773,14953,17313,8121,8089,20636,7548,8133,8144,3265,8736,12745,5429,2227,8726,12564,3625,20540,13597,20542,18319,10137,3235,13608,4784,12562,8919,18518,17112,18113,18602,18712,19378,2563,15239,20401,6492,1935,8094,7171,12602,1791,2434,4640,20655,8113,8106,20636,1977,8118,8137,1070,20663,14273,20697,20668,8740,6434,3265,1924,18590,20720,1926,2120,8143,14767,8136,3265,1916,3491,5918,3405,1115,8079,3350,14657,7728,3971,11898,2081,5860,11941,17127,6704,5763,7469,1429,1181,20732,1350,20734,5818,5172,1518,13889,8681,20506,4121,13440,1324,2707,1421,19307,15489,2530,20635,6446,20703,20639,11132,20700,3438,20644,12606,20656,8106,20652,20776,20651,20723,8112,20646,20657,4140,20659,17713,8128,1277,8130,4141,20766,20667,20725,20717,3182,20271,15883,19965,19757,2658,15997,1778,8794,6102,11072,15390,5093,1336,15393,19428,6397,1494,19431,16243,8220,20201,14321,14304,3202,14186,16628,7044,3814,2783,10693,16236,9672,2333,18169,11983,1672,12278,6826,12811,8612,8429,11956,9267,3668,5619,4756,3111,15114,19393,13504,7173,1669,10172,4494,1192,6341,6565,1175,10086,11420,13494,12239,2668,6591,2795,2691,1185,8753,14686,5153,20805,5146,20808,5059,20815,8410,19432,5690,20815,5008,1774,20818,14729,20864,15285,2510,1842,16775,7753,3099,5394,9058,15284,842,9646,16222,18111,8694,19027,19216,19628,16786,1115,2077,1759,7319,11744,6833,1817,19484,3469,5792,15950,11452,1315,12853,20783,14335,8935,768,12252,11113,5012,1399,6926,9216,5072,19542,1769,1096,1772,14988,4918,1515,10163,1737,4993,5769,1941,12185,1945,4245,12186,16400,4301,14343,1814,7725,12299,1308,1817,3847,1965,9155,994,12202,1394,3080,15517,1518,1558,13136,12209,1835,13585,12212,1549,12214,19667,20882,937,1847,18593,10112,1852,1995,5222,5586,4984,12043,6651,3805,15737,20687,18112,18710,18903,20691,20631,2482,1465,9638,3405,10831,18510,5714,6475,5423,20991,4852,5934,14487,13202,5935,16484,2783,3717,2872,2856,10213,12138,21000,1234,18330,12023,11397,2072,6761,15918,1448,8916,3936,4799,8057,19103,11582,8984,9464,3030,2753,20977,19373,15800,16918,19376,20630,18778,5283,2035,12941,5399,2123,3794,21036,8809,1838,1833,11651,21036,2856,1692,2356,19801,2427,3899,1912,19992,12800,19972,3193,2710,11655,4771,12801,17692,20679,17698,20113,8761,3255,3632,9854,19198,3722,21064,10100,7695,20681,3175,3915,11655,17664,3865,7884,3617,3595,3336,6060,14327,1299,10530,3734,11276,3723,3490,14723,3410,17377,1119,4019,7252,3216,1759,3683,17805,20684,3757,20795,16919,21030,12961,5283,4460,15209,19154,19458,2624,8553,18021,11070,2589,19330,8847,2409,16207,19195,21110,2513,2589,21113,12049,21115,2624,4205,17716,5286,21109,19554,21122,7791,14181,14181,21126,6937,21117,12061,17980,959,1079,6222,9538,4667,1196,7572,1990,2040,16039,6846,6785,10954,14278,6248,17536,12837,1154,2430,7627,3859,1326,3529,16827,11065,6987,19311,18053,19211,19041,19087,5652,15194,16125,2074,8837,13358,17209,10270,6602,16792,2346,9141,19204,19164,19207,19080,6381,11029,21141,21166,2042,21145,18160,17325,16757,10617,7231,1557,5167,19590,15190,21176,1236,15407,10207,19140,11478,2515,3032,1078,12245,6715,21181,11898,11116,2045,12085,6377,21187,11029,21189,19075,21102,21029,18522,21031,5392,2845,3486,13625,3111,14133,2072,8508,1710,1424,20841,20099,10510,4676,12190,4578,20235,20118,1814,15474,5843,4043,1773,10561,15173,11493,15945,4592,12868,7022,4813,5565,1239,5586,6596,13057,1332,1540,9603,3351,14673,4884,7175,8883,6651,1529,4054,10159,20417,6097,2022,4074,21239,19395,3974,19178,19680,4017,1960,1411,9641,6157,1301,4677,10020,9738,6193,6125,5810,2274,11036,20341,3321,19388,17517,20286,1587,15156,2078,5014,17561,16451,9521,9361,14248,6803,7039,4459,3343,3001,3095,4070,10599,17551,13202,15927,4864,4885,7548,16412,13804,8891,1512,4873,3097,11041,14166,9200,9189,8878,20629,21227,21105,5392,17681,1607,19059,16302,18751,6999,19186,19145,16087,19147,5327,19185,19143,7282,15861,15849,10306,10326,19058,21002,19102,10535,19104,10946,10510,10847,7704,16250,7998,12932,21355,8034,7695,18514,10559,18517,21026,15881,16440,21226,18904,21228,6561,21230,17184,21056,21370,7967,21372,10759,15336,13710,18147,10814,21377,18194,3183,1475,4219,2587,2351,4884,16693,1522,7966,6592,10065,8032,3069,14660,10762,2596,21403,4928,13848,2196,5564,3729,1057,2232,14200,10279,1540,20425,18110,18197,20688,20980,20690,18646,20692,3897,11156,10851,10661,6070,976,4917,1520,3788,976,2264,7728,5429,3734,1073,1229,1695,10163,10030,4793,3647,19355,3492,1646,9697,1523,4059,2275,11445,15537,14619,6886,1332,12774,3735,3189,12004,1687,12817,8884,1182,15956,2982,15500,1229,1795,19550,4716,10448,6248,13268,9080,13308,18109,9648,21380,19375,16226,20060,21384,2482,13623,11399,3601,4555,9533,15564,5753,1320,1970,10396,9173,20326,3541,1895,18914,3119,11503,10075,7254,1589,15659,8705,3526,6256,10609,6256,2356,1949,20034,14921,5770,8653,5088,14500,12260,13287,9393,3471,15637,14119,6518,12983,14814,5702,4105,10033,4341,9058,12004,2910,2026,5214,11736,12968,6475,9533,4850,17131,1014,5834,13806,5829,2486,1508,2763,11832,20327,9462,4768,11582,10233,2486,1827,13387,1179,1361,3415,21570,4798,17618,9139,3228,1303,1433,3966,1433,3374,13535,4673,9715,7039,946,7976,2728,3810,20533,4855,10673,4700,14808,14856,11682,4519,7730,556,7042,9619,5159,4689,5490,6487,14706,6713,12811,5608,9603,14163,6518,9283,3830,2124,5829,2050,11397,1811,19210,11219,1956,2773,5227,6987,4234,20533,8644,8612,21206,4361,1158,1529,11081,5741,16350,17768,8114,7243,2094,11960,4511,14876,9400,8726,1494,11511,14599,3541,5006,15509,4667,10382,17618,3027,1163,12085,11836,11127,1192,21568,7548,3532,1935,8025,3747,4934,21561,4860,15261,14435,17521,20296,3022,10807,2112,20686,21379,16439,21490,16631,21340,13454,8576,787,1391,2419,3837,16436,2367,1782,15257,16829,2380,18569,8703,18194,4937,7998,11008,19887,16244,971,10841,1441,1643,5802,1296,5718,1647,13064,10217,21690,15873,21357,18101,18149,10809,1454,13662,2896,4591,9229,15270,13667,13663,1255,10274,21351,21717,10310,19569,3244,16843,14057,1327,6707,21142,18188,18191,3086,7625,12505,18186,3029,7625,3012,18191,21736,11670,2635,935,21339,21383,21341,5604,16777,5429,9706,13224,5565,3079,7666,14347,908,21728,17288,21730,7963,2306,7921,4015,12745,20375,1067,9666,994,11111,5420,3043,21735,18190,2681,2661,12125,21306,7315,11064,16808,16940,4884,9245,5226,15263,13668,17728,21726,1244,21766,18148,18159,15841,21688,10489,6178,1967,14200,15716,2431,10869,18193,19103,10346,18158,1838,4327,21700,16305,21702,4255,15454,7143,13520,6476,2061,7291,10262,11290,7170,20640,17313,7212,1143,1652,20780,12608,8115,5227,21547,19148,8119,20711,20788,15222,20500,14767,8145,8119,16012,18186,3815,6780,5417,16029,4596,2583,21782,18190,3086,20494,6203,14130,10279,2750,1054,21753,20982,21493,4163,6920,7371,5336,17983,2191,8142,7137,1768,15732,8139,6545,9163,1119,1156,1067,16648,14095,2343,8402,1096,1444,4355,6713,11041,1312,5872,9162,13497,7670,2037,12502,11783,8936,17129,6183,14416,3854,9459,17546,8021,14692,10932,3115,11905,19776,1668,21505,6901,6658,13132,5768,1435,11258,1805,1667,9047,1392,6564,18157,7980,6942,21398,21225,21491,21104,21683,1225,6393,9764,5402,21587,5396,21939,1639,9895,19969,9875,7872,17684,19973,4775,19985,7702,3199,9843,17703,10889,19147,10897,3290,990,17306,5335,21954,12459,19972,19978,21950,7844,7878,21954,12465,21956,18383,7885,21959,7887,3184,6127,10969,18173,9900,17982,6388,17992,8610,2590,18179,2217,10984,5572,8662,5575,9915,13696,12845,13698,9932,909,18792,18899,7004,9926,3783,12844,19262,14074,15465,9933,15479,18793,6443,9938,2175,14083,1280,14085,3132,21678,16917,15676,18711,21432,20983,830,3575,13973,15211,7966,12871,8477,4173,11980,15217,19076,1544,926,8851,11608,17561,2088,11267,5948,3423,20635,11309,11252,16551,3677,15124,18680,10968,6342,2066,3239,902,2065,10083,9197,6309,6888,1930,19106,4465,18752,21392,15771,6975,22061,15757,1649,3069,6752,10111,12809,3717,2066,5407,2772,5183,11222,3881,20373,4768,3710,3540,20838,13245,3225,1479,2918,6909,20992,9073,17335,17095,4589,5525,998,13466,15289,8144,4729,7751,8624,2103,1089,3529,1759,1437,2086,13219,13788,19231,1310,16984,15463,9931,6433,6891,10887,6720,3225,1820,931,6342,14568,11316,5839,3838,12944,4308,15088,9403,20405,14715,7706,11493,21426,21488,21679,21028,21933,21682,18853,14215,11727,3231,19465,19561,16596,16490,6944,11070,2521,2587,21117,2675,21946,3027,9368,2056,6713,1185,9247,1153,4850,2062,8464,11680,4756,1115,4409,5844,9455,3857,7034,20083,11548,6516,9418,3630,18631,18264,4249,1569,1942,22108,904,9416,16965,6747,13387,14508,14428,8868,5744,1968,3628,11298,14487,7339,15506,3400,8103,8960,9685,22171,2068,15956,8984,12613,4317,12281,12273,6699,9322,9024,7560,3593,21449,14506,2878,21932,21681,21754,21935,901,17273,12432,18652,6085,10761,17425,18861,12875,16237,20459,3017,2847,17796,14983,17084,4493,11389,6404,2057,7532,2057,20654,3873,2778,15062,21736,14119,3032,1083,12476,21921,1236,12500,4858,10022,4829,16023,17647,22042,5012,1814,16090,6392,13920,16200,21076,3175,11787,20413,11409,794,968,21570,3343,512,1682,20507,15529,5881,14979,14046,18424,6436,16211,21373,8019,21715,19146,19991,11086,2772,16544,10022,3462,1782,4338,13091,17756,11159,15672,16060,11164,8432,14234,11836,13525,22262,19772,6338,16108,8802,19058,15855,15869,18509,18119,7245,3096,15792,1334,11874,7989,11905,5137,16676,1475,7618,3420,5244,16942,9071,6317,15477,12585,20685,21866,22022,21868,1049,7693,11594,8844,19331,21248,17204,4567,16523,17187,6106,19599,6108,8557,17229,8509,5520,17246,8520,18559,13921,21720,9230,21722,6269,21795,13670,22372,1255,19426,4465,19142,22065,18754,13634,11159,17988,17987,13639,7853,9801,22343,13745,22345,1387,3309,19355,18069,16059,15724,22382,15597,7523,4555,11163,15601,3323,19946,2738,17812,2139,10930,7988,22406,10934,22408,2144,18085,22412,2126,15688,22414,3415,15512,18628,19859,988,1723,20028,20057,11410,6739,15708,17835,2928,7641,20046,20049,2810,22431,6614,2508,22403,19828,19836,19830,19943,19707,2493,4807,19923,19917,19838,17099,11058,19847,21209,19851,19937,19936,11752,19839,19928,22453,19939,21791,22444,19933,19706,19838,19671,12761,19816,7659,7415,19863,7803,8278,19745,19954,19363,19956,7662,19871,8710,19873,19023,19963,22223,17429,21867,21755,9952,6255,9832,7704,19325,22356,3224,19557,13654,9977,22363,4207,8527,17901,22351,19333,19903,21051,17186,8503,22493,3162,22495,19551,7695,22498,4583,22500,17202,17902,4227,5605,4625,8550,22492,5342,22509,17228,12895,8509,22497,18019,14180,8664,1642,17263,8537,22484,17677,22344,22487,901,21386,928,22505,22522,8554,22524,6109,22526,22496,22512,22529,17247,22515,17221,22517,22503,15854,22521,22354,22507,22523,1425,22525,13653,22511,2345,22513,8526,22532,22501,17250,15866,17606,22557,13648,12891,22494,22562,17191,20447,22565,22550,8563,22568,22516,22502,14206,20890,21428,20979,18902,21431,22388,22538,6364,9610,4329,16705,10986,20007,16709,19809,16644,16712,6727,16714,20014,1679,3029,3444,1670,1893,11885,955,1239,15956,15101,16539,3470,2188,3265,10794,1455,13267,16957,1099,9441,15007,11735,19633,1688,21404,3638,4085,8135,13282,1269,10573,15927,3483,8120,10216,4983,8818,2792,7231,1888,13064,10207,1765,6317,6191,5095,11656,9067,8624,3721,1300,12462,20668,8119,22621,11881,8453,13174,1549,15010,6777,8314,8707,13267,16932,11837,20897,11693,11132,1327,4118,10739,2874,5795,818,10891,21960,3620,5236,1692,1112,18686,12662,18707,13350,12717,18691,13598,12550,6190,7140,18697,12554,13361,12379,6971,20074,12714,18704,13595,18706,12716,22387,18777,22593,1387,3899,17276,17668,1520,17929,6920,2857,4589,19783,20163,11842,15580,1353,2565,9393,16309,11981,10338,6583,2509,1494,11426,970,11415,4560,1729,9642,902,10747,2308,7290,7641,2508,13288,7639,4560,10342,5403,1572,1450,3515,2913,6529,1281,5589,3680,2909,16735,9675,11608,5659,11013,21186,21172,21171,19211,9675,4338,5561,1918,22772,20006,5696,1181,1276,22758,20613,22772,16659,1413,10488,8894,7501,5091,19320,22764,13752,21222,19211,13759,4219,16615,3095,22757,2960,21607,6529,21487,10579,22140,22020,20981,22537,22226,22346,2572,18650,15848,22230,7375,16304,7383,4924,21769,18668,18674,971,16288,7462,18678,7655,6374,1523,15809,12542,15811,13369,15813,18690,22357,18692,7145,15818,22696,6337,22357,22699,6979,13607,7832,13609,15814,12718,22829,22709,13877,22711,7369,6920,2662,18294,20539,9701,12803,10098,3631,3229,18250,3918,3728,13364,21100,3641,6145,12436,12553,10602,9918,16336,7178,16335,12570,12852,13330,16331,7187,12577,1610,7191,12967,16205,18642,10360,22689,12716,18689,13595,22872,22833,7140,6190,18695,22697,22868,13360,22840,13363,18878,15829,22844,22707,6311,22847,18852,15418,22807,4986,17751,1734,5554,17322,7699,6888,20675,4772,3696,19460,12191,20545,11352,4082,1821,14839,8464,12522,4033,1328,3683,9789,5333,8505,5697,10012,4481,22780,1450,919,7410,10392,19544,10422,15012,3099,10384,7035,12346,3017,8567,20978,20892,19215,19512,19880,16922,12421,5319,6331,18500,18809,13916,22915,22317,6135,531,1709,9515,9723,5744,10391,20463,7162,16859,8453,12011,7197,10424,10336,19783,1487,10070,12093,1557,17373,22296,22932,3906,3722,3415,21317,22926,3444,3156,9263,9404,16751,943,22905,19029,18982,2039,16177,12490,2095,2040,5669,5076,2394,7318,17318,8223,12640,4469,7631,1977,4233,4871,11842,1803,13413,7316,7927,23015,8236,12302,7279,22742,2227,17710,2880,1690,10770,10741,12434,11047,4047,1183,22826,1610,22828,22690,13594,22692,22832,22694,18694,22836,7149,18866,15823,6326,13599,2855,18703,3141,18705,13612,22999,18981,19126,77,1399,1675,994,6141,16812,8660,17697,10039,12749,7837,1175,6926,16470,7517,8984,1290,4450,2634,8386,13413,6498,15943,16539,16492,1783,2526,2996,7560,13798,5792,10678,12124,6722,14273,13073,3489,7716,6918,12636,15808,9805,9821,5938,1088,919,3826,8802,21138,19458,4581,11288,6805,2606,2609,6110,2626,6930,20321,3184,2369,22688,23041,22887,7140,12555,22693,15817,15826,13600,18696,22838,18692,22700,13606,13363,23055,1374,23057,15832,22535,22021,22592,22806,16273,22808,10039,15428,12879,22028,2273,18985,12937,15412,3681,11039,3178,14284,11362,13073,21592,15497,23027,20827,23029,23025,1466,10771,2353,4916,1114,19572,4688,23174,22746,17289,17666,7111,5181,20990,5253,18684,5353,23123,7138,6845,15830,6313,15816,5254,22695,23135,22698,23134,22898,22702,23138,13366,15831,22846,23142,22804,23144,22144,3308,4431,9238,17710,1273,6257,7336,23009,8220,17781,5550,9437,13078,12189,5216,4272,7879,9520,5254,4595,5942,22070,19925,7078,16377,17108,17274,11647,3054,2093,4015,19296,4624,16057,6783,5541,1193,11348,22137,14764,483,23078,1891,7511,4918,13071,3748,1188,1906,20903,13579,3318,5821,5114,9563,15441,3026,5190,15054,11214,13265,18677,1916,8820,1759,23039,13592,18688,23126,6329,23045,23129,22893,23048,3450,23133,22897,13601,18701,6329,23198,23188,4064,23141,22951,12448,18199,23203,22710,23145,651,19968,2660,10763,20164,5901,2847,13737,3269,3350,2356,1404,17124,22137,16181,16178,6918,1352,8244,8264,8154,3940,19004,8264,4056,8257,18991,18988,8164,18994,8167,8249,8169,8160,8264,3959,22468,19948,19741,22471,8713,22473,7475,22475,19747,8719,8186,7589,8282,19751,22482,19876,23290,17267,22590,18645,23204,22907,1387,1554,14711,19543,22091,4429,10416,16278,16888,2072,17513,1814,20731,1349,12643,1290,10007,8617,11825,5542,1810,12513,22349,22092,13960,5586,1511,23194,18929,18419,18382,23045,18723,18872,18230,18874,18937,18876,2671,13608,18941,18880,8324,7297,10255,23185,13612,22888,23044,23190,18693,22835,23193,23281,23051,2049,23053,22703,6174,23056,22706,23058,23202,22591,23294,23205,23354,21760,9435,20622,16137,1053,5334,22358,3464,13193,1569,20807,1399,17627,16257,14592,23365,4348,1334,22946,4420,1926,1937,4429,23378,9690,23381,9835,18930,2683,13597,23386,18934,2691,23389,9887,18209,23393,17638,13720,17808,23397,18822,23399,23273,23287,13596,7832,22891,23053,22894,22837,23050,18699,15824,23410,23286,22902,23415,23348,20428,19878,20273,22955,16324,17681,10784,19278,3656,6597,4415,4036,1394,21270,3710,5848,9735,20991,20514,18146,4197,23497,20532,10595,479,16307,23491,14728,5128,21865,2427,1110,15458,23281,13431,21965,7836,23467,21068,19986,3869,18686,17792,8121,2182,20683,7710,21975,8265,2531,23398,15441,18687,22829,23401,23127,23276,23191,23047,23406,23472,12555,23474,22841,22704,23413,12717,22903,18708,23479,10872,20272,19756,17775,4953,5311,5544,10852,8893,16700,20565,14300,15121,6705,1963,6521,15130,12888,9219,3039,15042,1517,21039,6664,3155,16873,9145,1172,10048,7169,22265,4045,22181,22978,6819,22335,23372,4049,11562,13943,18119,17653,12582,8873,4452,22864,7703,9310,23594,21079,3267,1183,5878,15285,1406,2856,22003,10046,5232,1054,10043,12246,6747,6802,1168,3200,11520,1448,996,3879,23618,11234,1165,15943,1424,21686,1313,2183,21962,784,6814,8726,7211,20567,5544,2442,3426,14860,14655,11393,2674,3516,15045,11549,2321,4043,6389,2335,7795,13388,1664,5054,4303,9818,5918,6330,7505,3715,5396,1299,8138,3703,1006,1762,23651,6922,20514,23654,4236,13941,1399,16430,5072,11756,4429,7923,3435,23059,19217,19629,21893,6077,1018,3405,3671,23560,20939,23562,1400,23564,914,23566,5136,15030,22748,8777,7029,1983,1062,3338,7201,7222,10142,10047,23579,22658,20582,3373,23583,22334,13534,23586,22338,23564,10400,23591,3727,21077,3502,3922,20685,2431,18488,19999,3640,3619,1051,11214,4599,1887,9798,6218,23655,1791,9427,23658,915,23733,9125,23655,23664,2503,23666,23729,23668,20906,1649,2456,4359,10289,23746,23676,5945,15607,1267,2674,23604,12338,2238,1276,1354,23608,11737,9511,7026,1303,23613,1167,12480,4198,23620,23570,4993,23622,17854,23624,1055,23626,4708,2692,2182,1175,23631,22970,12807,7225,14423,3429,22175,4489,13963,23641,1357,2124,11853,23645,16213,18515,11145,22018,17675,18520,23417,22848,23295,12355,8682,8296,23699,16356,17620,23578,5092,23580,23706,22970,6392,23584,23710,11305,23587,11337,23589,5408,9310,23592,9979,23723,3868,7858,23597,23827,12586,10845,4214,10737,8550,20333,20540,22856,14538,22858,14071,23825,10103,18878,23595,7887,5237,17218,3155,22854,22918,21700,21068,10099,23842,23716,3637,13233,23599,3619,23848,22572,23850,20676,9701,16241,21060,10101,22861,3235,7864,23846,10678,3154,17199,17607,23851,3581,7293,23854,23841,19975,23870,21073,7341,23873,23677,20895,17117,17681,9657,22505,23837,9701,23880,23868,21071,23884,3914,23886,23860,23847,3777,6733,9580,3027,23810,10143,23704,9995,23581,17709,23708,9703,23818,22337,7060,22339,23714,17636,23843,22862,23831,23720,17636,23598,23719,3757,5404,3671,5361,23836,23878,3193,23867,22857,4777,10136,23899,12435,17399,23902,12745,3826,23849,4843,9701,23853,23897,3917,10059,22862,11008,12561,23929,23875,23946,21052,20334,18870,23881,23938,23869,23952,3235,23845,23943,23888,20431,16324,21775,9125,10221,5405,11274,4590,7666,11259,9905,6021,6441,10658,2527,19724,4317,16833,3987,17452,16851,5771,6475,22503,9393,1675,15591,23575,23701,17669,7951,10059,9404,23814,10056,19563,9521,3313,23819,23712,18680,23920,23824,23857,3262,23924,21080,23926,24015,3267,1762,9440,16945,14558,5777,12214,21774,12327,12260,16352,9157,15581,12774,1683,1475,3381,7227,8993,1311,1354,15607,5075,20972,14027,1908,14841,1245,6193,23246,13187,3394,22085,10171,4074,21706,3535,10111,1360,18695,14646,16183,5170,5702,20944,6511,17386,19415,4622,17100,6568,5075,13398,298,2670,15734,4337,18309,5792,2141,8726,7078,6521,1449,16213,8813,4054,15794,2345,905,21411,9431,6076,1424,1117,1710,14607,8452,22716,3815,12326,5241,11614,9957,12493,5227,2848,1283,2456,22138,22801,22019,15739,23293,23803,23419,1638,23972,4099,1812,11285,1594,14511,6302,23979,4686,23981,2886,11670,23985,1154,17396,1010,12074,22187,4356,6030,10953,2095,1610,1267,23808,10176,23908,23703,23812,23705,22857,24004,22988,23585,24008,23918,23713,23590,23921,24013,10432,22341,24016,23830,21078,23928,24019,1534,4360,21874,5396,428,10187,908,2456,20514,19242,6119,11704,2261,24090,20104,958,24093,6999,7051,6989,8839,1683,10012,11319,2226,16836,6414,12563,24106,3419,21399,1247,17751,24022,13810,24024,9189,3156,1195,10267,8379,3974,9200,22089,13294,24034,13534,8758,19231,1313,24039,2438,15297,15186,11835,3354,22309,6772,11960,13136,12338,8907,1158,13056,16399,23787,7175,9255,6441,6308,12605,6219,2043,17814,4871,9500,13516,5586,22611,15715,3329,24070,3483,9245,13542,11137,3359,5972,23549,15882,21103,22143,23353,651,16731,3283,23150,8932,20867,20737,4554,21406,15900,14844,2201,5024,16570,16219,5097,12617,4656,4864,18343,21233,19884,4465,9843,18511,16718,21395,12434,9781,24270,4733,2408,13132,3960,7611,2789,11583,10395,10382,13238,8259,1403,10023,6498,6381,4721,3536,13127,1229,5990,1056,16378,6220,18065,965,10287,18132,4863,6219,11274,5834,15274,15190,4708,20486,3370,1005,11258,1736,2393,2395,2029,1841,8047,1820,10221,5142,984,1563,4861,13033,10294,1701,9351,12119,4730,2502,844,16158,12325,7652,10201,16766,16669,16530,7792,6509,14186,2135,7757,12394,5653,7231,7551,10766,4053,459,20311,11379,6428,5825,13020,20761,7287,3830,832,4173,1254,7754,1663,1695,14511,1398,2924,13903,14642,8764,16494,4080,1891,1038,10843,15101,6757,6155,7259,5423,5173,23969,23483,6956,4619,10591,21389,940,3362,4331,21411,16083,12066,5888,15062,13527,2256,16518,10234,7961,10225,24267,11982,6428,4548,23499,11975,7381,24279,18665,2354,18120,8946,22818,4255,12137,18677,18683,21048,16758,11860,4364,20424,11537,4387,13111,8431,15183,16166,3022,2440,904,3488,7705,24386,1603,20316,8765,13288,1359,23488,9391,14044,13572,17108,1723,16871,1073,1128,15773,24370,7747,3060,21208,24365,8811,5086,13499,15770,14794,1805,24358,14621,20859,8630,11283,1487,3517,9603,6713,14418,19411,9030,1394,4934,19414,12337,11128,2051,3416,3316,24338,22172,13789,24335,7938,24333,18466,24331,10430,17052,2181,5794,14748,10706,3859,10551,2420,15060,10545,24317,12021,24315,10573,4524,6993,11019,24311,14036,10070,3512,9241,5723,2773,5501,1514,13131,11127,9389,1530,9958,10057,3536,928,24394,16443,23971,9127,15605,22543,2772,4673,4511,23736,5230,1060,5502,2223,6012,16894,1990,9187,11582,19274,1777,19060,22914,4075,2486,19271,4805,19279,4760,18949,17549,19279,1444,1239,15765,1478,1465,10378,15872,2738,3818,9674,16894,1986,5417,1441,6521,15785,12346,6039,5157,1410,1013,19564,22360,1662,1673,3526,1666,23299,7117,3939,5429,3528,8764,3753,22203,3992,4251,9470,1116,3598,10392,1813,14850,15661,2340,6517,18185,4829,1660,18039,8027,21272,8882,1705,12307,14801,24620,8885,24618,24617,1339,24625,14034,14190,24108,10774,17863,20689,23351,23418,24255,7609,9853,1391,8856,22543,8507,17211,17697,6127,3350,8495,24562,1128,19282,19275,4976,24571,4687,17913,428,4621,4689,19284,24652,19274,24568,24655,19279,3257,10834,18056,16200,22506,17207,24645,8559,7890,19084,21220,19318,23375,21620,19120,19321,9119,14276,4462,17316,3971,8878,17911,24029,24626,16365,24693,18014,4364,24624,24627,11104,8913,8424,24688,17861,23799,24635,21430,24637,24113,24639,6415,22392,16695,13527,1309,12968,7202,3091,20289,5227,24714,18586,2690,12794,21283,10520,15636,9201,13527,1327,24723,1457,9195,9463,1737,24725,24729,21406,24731,24721,9534,17472,24719,3510,24414,24720,7655,3856,22616,10382,10418,19583,10254,3216,1903,20153,7243,3536,8085,944,2634,1135,12299,10176,14242,11539,3382,2632,2506,3441,17618,7019,18187,6875,1888,6704,16555,15637,8614,16465,23108,20180,13470,11461,13517,11127,1547,3549,24770,17283,19710,9036,1604,24587,3536,24783,2526,1135,10135,24754,20118,15637,15036,13552,23690,784,18187,9450,24790,21615,3779,12742,13049,24787,19722,2528,24761,3459,1904,13247,22675,3552,24753,1887,24796,16808,819,18707,1776,5849,2585,24769,24814,11961,19722,21090,3025,6912,23416,24707,22906,19030,11592,5872,915,22643,3172,21513,4758,8934,5696,4403,9139,5613,1444,8659,18575,3044,1810,11316,5738,1084,22623,2188,17348,15605,17763,19930,6123,19934,19726,22458,19931,3096,3593,2788,10111,3012,8779,15624,6176,16907,10684,6309,2503,9247,19291,1842,9195,12245,6628,2696,3934,7757,8373,10689,24895,2991,9393,3006,22404,5145,10186,7989,7320,12765,13052,10689,1421,1286,8961,16340,10294,4881,7018,1990,24535,18801,4814,21725,9138,2180,1686,13019,3602,3956,2949,2203,3941,8258,3945,4443,10448,19796,11478,21626,2088,13859,16953,1640,5884,1592,7673,24537,19966,13879,3513,10605,24419,7375,21391,2186,18661,11776,10741,21397,22821,24430,2872,19974,13591,24399,8015,15858,22292,7949,10702,21376,5402,24285,15371,7888,4415,19425,22062,10539,10990,24280,13633,24967,10990,21378,22587,20427,23550,20796,21492,22849,1226,9096,9214,22375,21371,16044,1018,11080,2528,1728,298,1376,4524,12444,4914,2195,7634,12881,2298,16020,3933,17374,4996,10393,2437,14282,8888,4345,4459,21011,8631,1251,20260,16126,2343,16252,12103,17465,14556,17543,6601,1575,5181,10669,331,10518,11533,17390,8080,9436,13770,2651,2999,1788,4446,7451,992,15060,11136,5163,9618,1849,5706,11899,22298,12809,12338,1303,23658,6018,21818,16286,4262,3644,2581,10550,14587,20654,20812,16285,969,21814,8235,2027,4058,8812,9593,25064,8224,2202,18159,12635,8317,15245,2674,2039,9980,19891,23904,21002,24281,24194,5090,7625,5821,1139,2120,1457,16975,14388,3042,1264,24838,18776,24708,24841,2659,12085,19481,19256,24961,22172,5697,17347,4244,3906,12118,9738,3124,8707,3124,16307,7842,6827,1165,11501,7112,23034,18169,3598,4460,23446,17689,13924,15815,23517,23451,9107,18873,23531,18875,18441,13934,23457,17632,23459,18943,16041,23530,15810,23186,22691,23535,23403,22834,23130,13356,22895,23540,23135,23284,15827,22842,22901,23140,23201,24251,21381,22142,22225,24114,25104,12633,16189,18070,16060,22396,15670,15598,22307,15724,22309,11875,18326,17442,4846,14665,6643,8339,8253,18995,8254,8257,25188,8168,6640,8170,19000,19000,23317,23317,23327,6644,17869,5083,22469,7893,19950,19364,8715,19746,23341,19748,19954,19367,7906,7434,19370,22483,25164,21680,22485,22805,25168,1668,1256,4472,5664,10554,12338,4487,1803,4712,3115,7993,2097,9703,4399,7939,21628,25229,25238,12502,6918,11126,6783,23987,1444,20787,2089,23020,9593,2747,3370,6494,965,2992,5834,3943,21550,9225,22373,2885,2754,1242,1187,4515,25032,8879,942,9641,13121,21902,1945,4457,1283,2077,14273,2317,10270,15904,3822,17359,23220,14249,11825,2580,25030,1912,6521,4196,13080,5826,13777,2082,20838,11064,8634,22172,20420,12775,3156,10032,10197,2680,1889,25262,21999,6456,1578,2433,5214,18010,8585,937,5905,14192,8874,7858,5301,5412,14839,5286,3674,1839,6136,22092,18593,9487,24633,13615,22952,20429,19879,24538,12631,4164,22852,22916,21058,12659,20226,23934,19061,22195,23938,18591,3916,21063,23855,20680,23940,15477,3200,22272,21072,4782,24157,4841,18591,11787,23955,22865,16313,18717,2450,14070,13342,2455,18870,13326,10886,6887,22876,7008,22878,2737,13335,18773,2438,22883,926,13347,22886,7139,23465,22890,23046,23405,12552,13359,23408,13362,22702,22900,22705,23546,23478,24704,18519,24636,25101,24840,18982,1306,13049,16283,7203,16412,2535,21941,5363,22123,18363,10932,5882,2867,4853,17554,9639,25054,24797,2048,1782,16591,7673,6973,1461,2054,1786,11744,14692,5183,20384,19344,13933,8747,6152,2864,22678,15712,4390,18534,2066,8674,14714,5918,23569,17969,14646,16691,9198,19140,2100,12794,15581,13403,17700,1789,17859,10217,2810,15501,8447,5138,1784,21302,11668,6998,1615,21048,1985,7656,10991,1022,13237,5809,2046,1051,1182,13556,2502,1426,4795,22975,25481,15098,2066,8960,10810,1313,21706,1361,7654,13804,5912,6884,3027,1064,15559,3398,11248,23312,24421,8581,4250,21406,1064,3055,3720,22247,24657,23762,13578,8249,1820,5330,2043,8532,24786,11955,24659,20105,7637,3129,963,3529,5690,25500,9659,13247,11244,5791,9199,15559,24908,14041,11691,22058,1159,4141,15748,13824,1511,11234,21256,1490,2043,25513,25100,19028,23060,19353,22347,7321,25161,23414,15812,23271,23532,23042,22830,22889,23536,23404,25153,23470,23049,13603,23473,23052,23543,16744,460,23148,4435,14248,23992,4517,1126,6489,25265,7749,12100,1461,11054,2535,3402,15531,5970,12942,4092,11796,5169,19772,15752,2717,14031,4301,1569,8158,9010,17415,15797,19114,2631,4194,2903,8565,19478,1662,15866,1855,9150,9162,18142,13229,23629,18870,8823,19470,14183,18743,17485,17108,11743,21668,5222,13478,8124,9270,1688,22255,14996,20506,10457,4041,7705,5001,12363,24046,2085,9100,14867,11683,14954,18707,14895,16099,15581,2067,9566,1482,13770,3552,15381,16420,3508,24237,11926,18922,4429,1705,2680,1246,1335,24943,20798,18117,12159,2525,5052,13740,6733,1443,13563,7380,8886,2299,1054,2496,11506,7077,1128,25045,10974,10756,10965,6314,4658,9868,3786,10862,7304,10862,4256,25690,5363,25692,25689,18066,25691,18066,25693,18066,9369,8803,19764,2328,25673,10458,21941,5395,18319,16848,13189,2196,25680,6243,1167,21443,5431,12777,11370,11396,25675,6148,21406,5348,16325,7929,25682,11792,3069,18067,903,25664,23553,5984,1820,11065,9577,4598,11570,5232,15222,1568,3159,5130,1142,2956,25747,11817,21824,25094,25016,2217,8751,1240,5542,1737,9394,14714,6146,11792,975,23268,20386,6647,3957,4594,11263,7060,12598,17143,8144,1957,946,1729,9216,5739,1559,4827,4428,15553,13543,11753,2094,1926,1066,11132,2070,23608,3487,12275,1004,5805,3624,19762,3157,13459,5162,17692,19395,10179,8102,5832,1185,12275,984,4761,22935,10232,5705,5759,1836,9641,4489,12673,5591,25597,5678,4933,16796,13780,4065,1172,3012,1172,6802,9313,15069,11244,946,8114,320,25827,1716,1533,14716,3651,907,25734,18713,2563,3350,2025,4084,15107,913,2742,15148,15785,1285,3377,5175,8301,1944,14588,4234,1242,12509,13296,22109,3972,4482,6575,6204,11651,9405,7254,5948,11037,14522,15023,8267,9680,1896,1110,3072,7730,3974,10107,16960,22740,7042,6396,12503,5791,8592,18015,11543,22121,7062,9200,14056,9140,9431,21530,14246,2981,2029,2714,14623,14901,3407,25658,5216,13484,1191,15704,14972,1817,3222,1400,10566,1282,10546,6030,15272,18846,20441,10473,20948,1154,23210,21829,13799,1518,3489,6760,12162,25292,16937,1485,14874,14519,9511,5991,3687,15608,24767,4768,25895,12811,1823,1059,6991,2744,6905,3345,2762,18038,4879,25623,1345,5817,13280,9199,5165,13815,18386,20441,887,20613,16045,7761,2072,3712,4136,11249,4301,25667,8819,22976,8100,10426,1191,10405,14722,7058,12679,11640,14967,24099,4293,4705,1343,3225,5714,4046,3528,6524,3948,784,9525,1327,3466,1841,25484,1571,14711,1728,1449,5114,5408,1071,9666,26001,10165,5054,25839,10509,25857,1018,8221,20621,24308,20562,9437,2845,18649,4594,4185,22634,4870,8748,9551,16125,1942,2857,24733,4926,4050,907,11438,4339,10623,11443,8382,8832,20703,11318,8158,9470,25810,1800,16777,16862,20463,6154,1910,13783,4554,6328,19642,10197,18845,4361,25026,11443,16577,16526,18745,3061,16519,15175,1836,8001,8688,24876,5458,20761,14825,20304,24237,8060,16397,5124,6496,12817,5902,9265,7020,13532,9490,25811,1112,3408,5744,6585,3003,22656,14492,1115,7501,14056,1503,15571,5967,7652,4801,4022,5461,5429,5800,944,5092,17012,14568,15254,11836,1944,418,5067,1833,1709,15912,10710,1153,2789,21722,21292,8841,5761,20440,11341,1778,8500,22586,16265,16223,25329,23481,23552,25841,3897,6535,2357,25305,12852,18884,13965,18797,12406,2326,18783,11405,18765,18737,18894,21996,6451,15425,9310,10359,15272,1149,4829,4829,5903,5286,10859,25171,22394,3320,21062,18763,18891,13694,15998,15469,22530,15439,22349,6917,1277,6139,2540,9550,6936,2545,6146,12145,6149,22316,5366,16990,954,19970,23514,19977,2396,6631,21951,7857,5401,3043,23522,7708,9741,23526,20001,6644,20124,7349,19976,7835,12015,19980,21952,26194,7136,26196,7772,26198,7774,23527,2236,21704,6486,26204,7841,2300,23518,26208,22621,26211,1531,19995,21974,26200,18240,17871,3007,26188,26205,19979,26192,19982,26195,7861,23523,22678,26228,7867,26202,2392,26219,7874,26221,26207,26193,26224,26239,26197,23942,26214,26229,2409,26217,26232,7873,19973,26248,26236,19987,26238,12466,26212,26254,20000,7867,3598,26231,17779,23515,26206,26263,7703,26265,21972,26227,26199,26243,7376,26203,26233,26220,13703,26249,26237,26210,26252,26267,21958,26256,26244,26218,26285,26247,26287,26276,25316,26290,26266,26226,26213,26269,22683,14081,2238,16016,23467,22510,6389,10682,10313,15315,4546,25840,21433,9656,13717,18676,21812,2418,15334,24974,10399,6690,24280,10474,24282,7303,3309,2117,3575,9796,12564,26291,1531,4839,3723,3586,22860,26260,21966,10097,21968,3267,5028,18260,4751,26225,21957,19996,23527,25348,26344,25341,26222,26193,1474,4083,22853,26338,26353,26242,12805,2865,26297,21949,26346,7856,3625,26361,18447,21955,19990,26340,7866,26367,26273,26189,20335,26300,23874,2736,973,18268,26369,26345,21063,23519,12563,26351,26364,21973,26281,22683,26202,26343,21948,26390,7876,26392,3281,26337,26303,26365,26397,7887,26399,26368,26357,26383,26347,3869,26406,21972,26378,10898,26216,10039,26400,12460,26370,26391,26223,26417,26377,4783,26409,26201,26283,26423,26274,20541,26384,26363,26407,26396,26255,7867,11768,3309,23883,26413,24005,26288,19987,23933,26395,12382,26366,26410,17199,26388,26446,21967,26372,4841,26428,17793,26440,26306,26454,10841,26434,26382,26436,26415,26393,19993,26462,26419,26215,26257,26422,26412,26401,26358,26448,26416,26394,26439,26474,26294,26433,26478,26424,26402,26359,7878,26461,26240,26485,26270,4749,3644,26467,26234,26458,3594,26492,26483,26418,26430,26441,26398,26487,26381,26500,26371,26502,26460,26504,26429,26293,26282,26466,26488,26435,26501,7877,26514,26472,26494,26506,26464,26432,26519,26510,7841,26522,26404,26438,26505,26517,26508,26530,21947,26489,26480,26437,26493,3696,26495,21960,25547,20894,23970,12631,22719,1412,24779,21011,25379,16044,24661,8259,24663,19278,3740,24666,1641,21353,15780,24541,24651,19273,26561,6025,4918,26564,5241,7222,24805,1547,4965,19327,2608,2499,21127,2626,19796,19798,931,2601,2520,2231,22151,2615,21115,22154,12919,1084,6996,4621,24687,24618,24690,24696,24621,24694,11088,18029,14034,24695,24632,24628,24632,24631,24699,24703,24982,19374,22141,22224,22486,23804,1664,1901,22061,6994,13281,5882,1768,19772,24066,4108,2274,15499,10232,10688,9957,6124,8456,24139,1448,1109,9156,10525,20511,1099,1156,13272,13040,11645,13183,9572,2758,16390,6779,15588,1291,1416,2121,24545,13859,2188,947,9369,26630,3171,19296,24316,299,1482,8455,13053,19163,24480,11299,3849,1548,1696,3219,12265,4831,26666,1245,15660,20401,7992,21856,3734,17334,3359,17351,5821,3190,5591,4337,9274,7548,6491,7764,19649,3004,6180,26630,5174,17579,21693,4179,3008,18586,22873,20496,11136,1963,17041,21467,1411,13661,11273,2247,13178,16770,6123,19182,7957,13186,2226,3712,1915,7030,15652,8818,12909,19415,2783,16683,22301,14551,16484,6119,11553,19777,26649,1482,1245,10011,2910,12909,25571,1111,13990,20496,26624,6987,2043,12953,1267,1278,13859,3974,1274,26648,6926,7784,4091,6991,23040,11233,13863,11895,26750,1821,20401,1957,10675,1667,12765,1321,5758,1589,5253,1592,12701,6033,12752,13053,5663,10654,4688,26664,22800,24634,25397,24706,25399,23000,23061,4482,2031,18610,10171,10300,16682,6805,15564,1181,17530,4730,21174,6516,2214,13440,24574,2377,6001,9034,5690,16854,4730,12827,4481,9710,5003,5013,4404,3071,7731,1429,26672,14584,1502,2026,16497,15628,2137,15581,319,4988,1299,21025,26614,21027,22803,23802,25400,26793,6627,1762,1116,10857,4479,2702,23065,5336,26007,1762,15098,9177,4209,1449,6699,12942,26857,1397,19762,5322,10492,1184,2294,21888,23429,2530,9304,1582,1117,6255,10336,9417,4431,9620,1680,7033,4060,10425,20418,12011,11405,12001,4503,21927,8518,8157,2523,3089,1116,26879,8703,3339,1646,9322,1770,3750,6255,4263,11886,9221,1612,3192,1304,26318,22023,477,11768,18835,7115,6001,10433,4755,7034,2988,3186,16178,4641,938,4018,23242,24061,26922,12833,23242,15245,2264,7088,1283,26911,19974,1172,23701,8789,15780,26918,1968,26920,16579,7079,6341,26941,1801,1640,10678,12944,20510,26931,3419,1478,23432,26915,6127,935,6512,20574,1641,16255,15105,4245,26960,6016,11109,26928,11171,2343,8856,2611,1398,23364,26870,23490,20083,2809,21199,14785,5109,7222,26947,6018,9704,14618,14246,4233,16234,26974,14398,24392,5688,20356,26979,11098,6018,6830,20903,2445,1985,24085,6200,16563,14507,4250,6158,4681,4141,11328,10135,1193,3123,1274,25292,17542,6121,6140,12944,10460,22680,12116,3747,393,23505,3207,11836,11030,2076,13250,23379,3870,299,27006,1737,20613,7738,5423,9663,1953,23676,26548,22954,25332,2658,955,10520,1664,4126,1022,17173,9960,11461,4409,2507,1437,1172,3714,3828,5174,13459,9427,13213,5772,8896,14051,27002,8682,11997,5909,4825,20888,1196,16012,10370,15399,24833,22207,9392,3162,1768,12256,16930,3030,25536,11644,9506,5564,8883,23660,25651,2775,9595,9735,2212,15629,2523,1576,1182,1647,9612,7760,20375,5193,16130,1653,20240,10658,1267,4406,4851,912,4488,25017,19724,9618,1592,6195,10518,2091,3679,14561,4714,1710,1182,3493,5114,1819,3880,10544,1683,6498,15379,9471,1190,5145,13123,21923,5366,22108,1051,21503,1514,15637,9041,7505,1513,21710,7300,5922,5848,2519,4867,19222,3020,1475,8949,14520,19846,15012,3553,1990,9462,25472,13136,27161,8999,1053,6524,20395,8615,17832,19528,9512,14698,24376,21579,5586,2695,6392,6724,21629,2498,19649,9960,8901,1408,2112,3460,6999,25780,17975,8315,1832,907,11024,10946,15570,3857,5036,6518,9585,1360,11021,22326,4869,1086,10652,1091,4556,10601,19422,21624,10086,19413,17556,22261,6827,1014,9245,15241,19385,26114,13134,26081,4472,25903,1358,1398,11393,11019,14349,26837,21489,26616,25219,23352,25103,18780,13684,22869,13341,19260,6435,15430,13331,13810,17533,19264,7192,9399,9790,5565,7033,5236,1919,14436,4682,14649,13169,8732,2351,23224,4032,22210,4656,1115,16394,3123,13340,9930,27240,12400,27242,9936,19265,6433,7003,27247,13716,16125,19078,23894,22918,17255,2331,21168,994,19313,21171,19161,5356,15319,2306,27284,19081,11030,27287,19202,7283,20128,21060,10322,17378,26604,24689,18029,24628,9765,8221,5904,4134,2057,2113,3037,14765,3740,3062,21480,2069,15273,2919,3062,8114,10382,8587,9405,9505,9765,2069,8904,24625,2523,24702,26787,25328,23291,23801,24839,26792,19353,24989,10158,17378,8442,27329,26612,2701,10332,27280,3581,3698,2849,27292,27286,19318,21172,25436,17893,27350,6368,19312,13757,19314,6374,19202,25410,27298,23937,4848,27300,1731,24697,5847,8910,6231,2540,25960,17670,3205,27311,10214,9056,22752,22637,21394,22273,3262,23872,23943,21081,10739,8415,4487,15754,8778,27322,4521,9245,27325,25685,1329,1192,3796,25375,18899,27269,9526,6450,19259,27272,27272,6435,16648,12492,13943,6799,7212,1179,27090,14616,3418,15259,6041,2033,27259,3823,27261,24939,13059,14224,27401,7012,13336,27404,27404,18768,27408,22118,27410,27039,20430,24395,12223,12159,21257,25108,24081,1466,6350,13387,8632,22110,13137,9053,10515,1559,13248,8793,25943,7224,27256,13210,24065,26757,26120,27094,15716,27445,15335,15771,16306,1193,8469,2672,22172,24964,16254,27470,6303,3161,11417,27474,16306,23121,22203,19436,7338,26911,7035,12656,2348,4979,10539,27045,27470,1510,5075,25001,27489,4423,24992,12943,5664,6340,23033,10820,26128,20891,27334,25398,25548,23678,16786,6172,20052,1359,5989,24322,12064,8461,2191,5693,9538,3989,25744,2503,3472,8455,4759,24222,3970,25750,3309,10022,21918,10756,5693,22897,1134,26093,1177,2821,5916,6563,2386,27514,9474,27516,4229,5768,27519,3778,12097,8079,8508,27525,7803,20974,3973,27530,4511,25752,7666,20434,27535,6858,27537,20296,27539,20301,2236,10277,27544,1523,27546,4662,24079,27520,6722,27522,22526,27554,8713,27556,27529,24222,27531,27560,25862,27534,23544,7116,4366,16435,27540,26432,16207,24998,8705,27527,5828,13541,2115,27552,10794,27551,5286,4200,27580,3973,27582,22108,27584,27559,19097,15068,6389,6486,22982,17576,17902,1285,9247,27610,17598,25217,27232,22536,27234,18982,9500,3805,15864,2544,26180,6911,6923,21119,24672,22575,9104,26312,6076,22068,22566,930,6209,19536,6138,1766,8809,3489,22825,23597,23824,12607,16514,1986,17620,23369,20654,14245,3439,1315,22642,1054,6389,2265,8511,10066,22577,6111,25516,5293,10851,15409,2117,1267,7231,20723,24518,13387,3805,8582,11356,7055,4165,13120,9645,13546,20625,8666,1680,797,2580,797,2191,1587,3117,10288,13416,11238,13791,11428,12480,14860,3348,1269,11258,7243,11289,15194,6735,8448,11237,8977,4128,15082,1080,3469,15103,10015,5156,13784,4217,25419,1984,12565,15200,14520,24836,9831,15566,24310,2614,2628,6199,4931,24036,1273,1131,11791,1158,21556,4071,7889,1951,2727,1011,19532,10393,7026,7706,2536,14492,1770,1933,991,1062,16026,11520,24742,13440,13259,27123,9343,17860,27675,6139,13038,9216,11928,17879,12478,16373,6186,9304,18003,3183,15986,23584,14686,13859,14709,10287,5159,7172,5216,9185,1192,11270,9186,958,964,14978,25847,962,4993,21605,11123,483,4387,15345,13940,2031,11283,14286,4096,3091,15642,9186,15085,16986,5205,1701,24237,12118,1701,3656,1144,11041,25303,19205,967,1183,10411,11607,7226,8977,2487,2266,9658,1718,2545,3288,7652,14891,1273,26906,22389,2020,7237,27631,26179,2088,26181,6137,21874,24671,22543,15634,21503,27669,8559,18172,17897,18020,3389,27645,531,26173,11963,1416,27649,7248,18087,18488,27653,24758,6487,8208,1172,27658,13831,20939,1725,27663,10756,27666,27000,24590,22547,6629,27671,3153,27673,6562,2291,13194,17255,6480,14284,4389,1399,8842,2123,18621,887,1160,11316,7170,3097,13460,1962,2693,4018,1981,22632,1926,6183,3747,8440,15918,1416,6414,27894,3002,27892,12559,7976,2440,5906,5054,1583,23759,17580,7050,14623,14283,7548,27693,13772,23690,5776,13413,15096,13518,3019,16130,7231,938,6998,16614,9660,7759,3017,14493,10566,14523,21593,23656,3537,23565,3836,12487,2346,5216,7515,4703,17215,18969,27919,299,27837,24987,27629,842,2386,27632,27843,27634,20523,16214,27637,8498,26794,23427,19462,22496,12868,27854,26170,27857,24362,27647,27861,24613,27650,27864,10611,10213,27867,9960,8839,27192,27870,27872,14293,1309,27875,27665,2693,27878,27640,18550,27672,6252,27885,8325,13197,1093,23664,16898,7976,4303,1762,8221,25042,3369,11247,8103,1176,6594,9247,1433,1532,1931,3805,8740,17051,15170,2523,3876,11140,27395,8901,5502,22541,23654,784,24581,23729,1662,18552,8337,8814,2503,18548,23742,24443,26564,3408,6330,16614,3992,18104,14657,9591,13777,13155,8597,906,24227,14972,27717,5856,27091,21759,8639,2286,13394,6480,1547,4910,1583,2516,15749,11650,1189,1183,4774,26127,17110,22588,26130,23551,20797,25735,9212,27840,27966,27842,5084,27969,27846,8495,22558,17207,27849,27975,8558,22527,27978,27643,20051,17262,27858,27983,887,27862,3003,27987,931,27989,17335,27991,27657,27994,5012,27873,27997,7796,2318,27999,24166,8512,27851,8509,27882,20523,27884,26333,8325,3826,1670,6840,23729,331,23742,20216,5461,5316,8142,26675,818,11790,1412,7171,1139,17748,22648,16692,12226,5699,5087,26770,2034,982,14176,4832,2273,994,20523,6480,18119,1306,13596,12760,8078,27524,6998,1167,1401,2230,12514,9940,11041,21631,5991,18715,21656,1450,1950,27150,5559,2022,27962,23804,27964,418,28089,16663,28091,1534,27635,27971,27848,16166,27850,22546,22563,26313,27642,22581,4207,27981,6149,12360,26175,28108,10235,3186,27865,28112,4248,28114,27870,28116,9511,27996,27662,28120,27664,21940,27667,28098,24591,27881,18843,28004,10852,28130,17073,12649,9783,11488,6514,23875,24856,3509,2736,9823,2208,26334,20388,1292,19040,19318,19201,27360,6371,19318,19073,13762,22788,2611,11027,28185,25168,10493,26231,5289,5362,5403,3642,20434,5342,10737,8526,27398,28238,27615,18132,20523,28267,28262,28269,10920,10853,28273,6198,2207,28189,14228,28191,26182,27636,28195,27974,27879,28199,27641,17245,28202,4583,28204,6137,28206,27648,27985,27863,28210,27988,20638,28213,14293,28115,27192,27995,27661,28166,8789,28221,10842,28223,28288,22578,18578,28277,28271,10920,10839,28129,3103,3106,1676,20985,8221,1721,1123,4507,3876,8666,1436,25536,1545,26051,3022,27085,1305,3480,9514,21544,5104,10232,16163,1768,16901,7870,28273,5288,4442,22276,13155,8121,9293,5917,13423,1552,25471,16007,21411,5528,9961,21417,10978,1985,4764,17621,21425,10506,950,28366,20889,27505,28082,27507,26790,27509,23889,16324,2492,27965,6144,28282,6147,28192,27970,27847,28095,27638,18762,28002,27853,28102,28294,27859,28207,28298,28109,28300,28111,28302,5018,28304,28215,28306,28117,28218,28309,10382,27876,28000,6094,28314,27670,28227,27883,28005,28230,918,11352,5669,28192,1776,1783,23306,6647,22268,11440,7062,11493,22180,23913,4752,3733,9103,13413,23950,23922,3865,11350,28433,3752,10560,3536,6475,5430,4142,929,3851,2096,1314,27044,13012,3524,19542,5753,1179,19586,24209,3089,17972,7182,7215,3407,11747,2056,3665,3807,15004,23064,685,4400,26770,1196,1494,27126,17356,11993,10283,13830,14877,15008,1313,5330,9589,3700,7563,18768,28192,3680,8470,1803,1128,8301,4714,15913,2213,14907,27186,27898,21499,7639,4513,1509,5423,6142,907,13411,25250,16495,7636,9598,5989,3544,4251,13399,1018,28256,24709,28380,28188,28382,2079,28384,28284,28194,28388,27973,27639,28125,27977,28201,17213,8520,28394,28106,10953,6927,28398,27652,28212,28402,27656,28404,15154,28406,28308,27998,28222,28001,28530,28226,28013,28416,28229,28322,2340,10857,6209,22014,8668,3114,19078,8603,18130,21982,10318,18966,9907,21987,10322,17237,5573,12512,5329,6816,25876,9289,7207,28424,3623,22241,28428,7064,14246,23881,8616,5095,20101,24997,9429,4120,17629,3205,14643,3357,5037,27438,25331,24944,4953,28520,27841,28190,28524,27845,28285,28527,8504,28287,28391,28101,28292,27856,17220,28295,2099,28396,4245,28299,28540,28401,27655,27869,27993,28405,28217,28547,28220,28410,28123,27668,28198,28315,28003,28554,27674,8325,7869,11455,22928,3416,8771,13149,6233,1280,11340,4825,1686,2501,20761,3441,2072,10634,15222,23659,11555,4080,19850,5753,1686,23308,28646,5781,3470,7764,3837,19526,11801,1511,16538,6969,999,6838,11462,22218,2254,4136,2580,1405,28670,15114,3846,17161,7227,22261,17711,4475,5832,15617,8955,1429,3549,11289,4446,1896,28656,14611,14445,7219,28690,6233,1287,11304,24386,14420,25634,2143,28323,7564,13413,9632,15060,6448,15125,9145,4473,5737,14793,13810,24497,7230,11631,25993,318,4121,2072,10675,27909,11214,3374,12261,22910,13859,2713,21484,3470,19372,27230,22802,24111,26840,27337,16298,6689,15927,21672,1093,16774,2599,2226,3407,5262,16927,10288,16772,1149,3933,16775,9416,28751,1060,16774,28762,11420,15920,965,11022,16965,3313,9219,6146,28771,3941,28769,16779,28767,28757,5702,26361,26221,1279,1819,5261,17137,13440,909,28696,4396,18011,25267,14192,9726,6001,2036,10079,2775,3005,20528,1437,2317,25992,15536,8843,2596,28788,3733,2599,3733,16020,28794,9149,3528,7617,1022,12789,20057,7795,4054,7623,3734,28782,28815,2913,28810,965,3817,21235,3733,17355,3752,11078,2030,940,3638,4428,3514,2985,20528,10385,18624,1330,18626,18030,22420,22418,22409,10945,15615,18106,22411,22327,22416,28852,22417,5129,6926,3214,26012,28833,8843,11310,28836,28783,16032,2095,28810,28834,2639,28655,28789,4200,3493,5413,28598,23482,27041,7828,10783,24993,1896,28755,2987,28753,19537,16776,28773,15698,28748,28765,10229,20729,10226,1144,16765,12315,2981,3089,1807,8707,5845,23181,27739,7767,14168,1949,1409,21883,5971,13435,13056,13393,2665,6396,19937,19207,6183,19935,19727,22459,22446,19854,17470,22442,22465,13091,13941,24052,3060,11057,22085,1724,26951,7235,4113,12952,28366,2926,22188,1258,15490,14314,27623,25396,21429,23350,26791,25549,19514,15839,4108,24518,1189,1514,26575,4214,24976,1517,7986,970,1770,14248,3677,3392,1282,1791,14274,9139,21011,13476,3535,10420,9349,16055,20743,22336,9161,14638,13515,10339,1178,1816,2051,10927,1887,3349,27083,3420,15224,4249,1789,8329,1951,11306,27914,10967,13608,5538,11306,9049,8705,5878,28518,25103,1894,26658,1358,27905,5128,6471,7276,18908,27926,20389,4185,28961,20310,11617,7228,17124,8952,13524,15934,3443,23611,13771,15381,14538,6001,28976,8747,3395,1967,3717,938,13419,11650,16382,28990,10016,14973,1092,5242,14306,28996,7832,20396,19331,9808,17585,9323,18593,6234,7202,4393,1062,12346,2572,1359,1065,7175,25285,2088,1664,29003,27628,20276,23486,6628,21531,2994,25587,21655,8373,27123,3006,4883,8933,1954,28324,6097,2993,23987,14535,7200,5957,14807,12366,4472,4481,1672,7200,9478,25797,13566,8086,1995,17274,27391,9286,1342,6257,16824,19099,20838,25267,19097,3064,19050,12794,13107,4678,29111,2048,29109,3066,29107,19092,19055,3034,20364,27108,24316,12159,9517,8123,3486,3088,13567,12954,23156,28991,15191,17991,24280,12458,23262,12925,23180,1514,12941,4210,1675,4524,11933,13224,10235,8025,9598,6189,26774,24890,4712,2995,7230,2992,8382,2989,24434,2986,20123,9784,12464,27347,3905,6819,21060,22860,23965,21073,3644,17687,27384,26408,24161,20794,27624,26839,27336,28948,27511,6385,22972,9007,19710,17943,12484,19849,4857,28917,22452,19931,22454,19847,24870,19850,29192,22460,28922,19942,19919,19944,29185,19302,29203,19831,19920,19941,22445,19711,17306,25107,23333,7800,23335,19951,19866,14378,22476,19869,23342,8722,23344,22481,25215,23347,28944,22589,20893,27040,28600,5283,5938,18908,5348,9824,13739,23509,12658,8052,24286,19439,15360,21346,2216,24950,7620,4414,24978,21358,21703,23073,27277,25670,9832,5296,8548,29161,15867,2694,5290,2675,13960,17714,2673,7283,9801,5290,22386,8325,15950,21930,26323,2250,15346,29244,21409,24977,15352,29250,21820,6815,11383,4796,19058,29275,22321,2273,29246,7927,29248,29279,19188,13737,12316,28272,8759,15317,13734,18503,2409,29259,1086,2391,27856,25546,29177,28741,29179,27510,17117,7370,18103,6993,1348,25096,4791,25095,1078,25098,2690,29316,1472,25093,1083,27560,18190,11126,14246,9608,1967,13661,1733,1110,19537,11264,2506,2860,29324,1498,4675,29322,25091,2679,29339,1984,2200,20565,13991,17397,17283,14436,14983,1126,2704,2107,29341,25092,29319,29318,25746,29361,22253,5538,29320,29323,5033,23772,4399,992,15399,29331,9450,16475,20625,9372,14401,23760,8765,15053,24917,23560,1065,29065,26793,13456,5757,1653,2600,19419,13435,16104,28458,11946,3163,1336,4305,21626,21421,22174,12460,4125,1299,10644,15572,26114,16370,12261,15273,29392,1579,23227,6754,1892,9160,29415,6036,8025,6780,1705,1508,13545,14813,10423,29403,11675,1587,5242,9427,16137,20569,2803,13406,20944,5086,10233,6750,1324,1784,29436,23227,9486,3662,945,7232,29425,10161,27759,25912,13398,4851,28345,10233,10609,29419,9198,25660,29433,2792,10491,13588,26564,23463,23533,23274,23189,23517,23277,21805,23539,25566,23541,25568,23137,25160,25393,13611,23289,29227,28083,24985,21934,25168,1449,11750,3678,12607,5113,1810,26869,18073,4238,28777,1720,5753,1913,17788,9375,4757,26158,6547,11394,7258,11818,10674,23500,1147,1229,7077,19704,4476,24028,10234,3415,11216,997,4862,5414,23210,4098,1999,28109,3027,1731,14183,27488,24316,2227,20740,10531,9486,3526,2062,1092,2923,12766,7717,2949,4766,2812,1309,9198,3935,14038,2799,13213,2690,29459,2929,1316,13202,2932,2931,2935,29541,2802,2939,2925,8889,28747,3090,22725,6906,25076,21411,28911,6300,8827,22750,6125,20698,13174,22245,1070,7616,11239,9038,7834,10892,29092,20000,17785,7533,7560,3472,8740,20998,17632,3597,11409,23785,4080,17647,7835,7532,8334,8111,7413,4025,8085,5823,7413,17471,8129,24469,6472,7633,3365,26239,26373,6816,13177,2121,29164,23516,25346,23841,24001,20682,2873,23887,5917,9957,18119,20080,25340,3630,4848,20102,23940,3289,10051,5431,20424,7632,7534,22659,29572,8734,16555,1285,12607,11949,2868,7566,12818,29580,21088,2107,21090,29585,3604,10146,29479,28375,28946,28377,26550,20799,1362,17123,1190,11316,18599,889,5705,19274,4303,11113,13344,10197,4293,3008,9290,28749,16927,16778,16778,28754,16773,11566,28889,29678,28885,28761,28748,28888,16772,16768,28767,29690,28766,28895,29687,28774,16768,28776,16778,28889,2141,6524,3873,6832,22325,21152,11531,961,5318,22281,1269,10216,2936,2031,13418,19447,6999,6607,298,15234,5235,26027,8079,1490,10068,5235,11929,9691,8959,11284,11750,29719,28474,4210,7740,1902,5017,8518,17957,1143,1112,4661,5226,7167,26930,8456,1395,24366,11895,2986,24120,17379,5661,5153,17826,26746,17826,2783,11263,1097,13155,1793,29023,11910,29384,19218,15208,12632,23893,25340,21059,27366,9976,23898,29169,24014,24160,4840,23861,23875,23932,23864,22917,3581,20435,28437,24155,23927,29777,20002,11218,15325,23933,23865,22918,29784,29771,3632,23964,12583,29775,23718,29788,23874,3826,29780,23947,29794,19984,23840,23963,29773,29799,24156,25359,23861,10925,18844,8803,6442,10320,13394,23629,27676,2251,6961,25114,9079,27186,2216,5314,21048,11862,22825,23877,29793,29783,29808,3630,29810,23951,29812,29787,23724,23847,29779,29791,29781,25337,29795,29809,4848,29798,23593,24018,3619,15208,29805,23959,20540,29849,29838,29851,29811,29853,29776,29843,29803,3113,8549,29847,21053,3276,13955,3908,29772,29840,29864,29801,29866,9895,2316,2431,18964,2391,8728,6199,15888,17318,15888,14921,25743,1853,5054,29883,2448,2738,14835,8315,9278,4623,11088,25269,12906,3321,4430,1448,25453,11397,15581,27586,13267,17378,22252,8266,16436,6101,2059,8431,12482,12330,1693,25269,10673,9137,2056,26361,29881,29834,29782,3251,29873,21069,23856,29173,29842,23828,26432,1927,29824,15900,2222,6370,7553,29829,20463,12488,7647,29820,2174,23780,908,29764,15886,3575,19129,6564,24277,2285,13646,29957,7967,22064,15394,10338,2344,3858,6307,1855,11747,10659,5308,13424,16744,392,12660,10867,4060,10863,4545,4566,11172,29960,4327,29962,29247,4968,10435,19186,10862,13424,27154,20627,29844,1162,15503,13625,28000,29236,18181,29786,9843,29814,7887,12471,21160,29997,15467,21075,25353,24427,26268,29879,28875,26132,26319,901,1572,5145,3078,22796,5677,10980,5672,6301,1409,394,2946,2429,6395,8021,9361,3980,13013,26696,16556,11301,20031,2508,4028,24581,16664,6610,22745,8959,2882,1070,13189,22668,17032,7663,10691,6101,30028,2810,25459,9155,1554,1358,17373,14158,9515,15226,22797,5525,5618,6301,13020,21270,3378,3045,13834,933,5562,30060,22782,17522,29952,29181,10531,5447,3244,7347,7327,26862,3642,15312,10962,1193,5290,5374,3108,2663,12033,5371,21872,5374,10831,5293,17872,5353,5296,2280,26421,4599,30099,5408,17899,6398,26476,30104,3646,28259,30102,30109,5348,30112,30108,9623,9698,5335,1230,5289,24960,18162,7338,10743,11778,5395,3599,6630,1492,10919,18884,17301,25440,12479,24270,7408,13059,5843,6809,19883,27351,27360,20254,19199,28246,27354,30130,26258,18067,4563,30013,28085,26133,6171,9588,1552,12487,5697,11955,9025,8152,25752,5152,1901,16406,21638,16516,20305,3532,23227,4984,14184,12770,25413,18988,5197,16145,11081,10294,19195,4079,17475,13173,19398,5883,7110,14061,17997,25956,7634,27620,12004,2042,1661,20723,18232,12600,1909,25945,15956,4723,16849,21162,16905,13440,13049,29584,8769,3239,8765,23257,5130,1278,1133,6787,3620,3937,13353,10098,4477,8764,3019,6735,3030,1401,3031,16983,15156,9078,22975,11581,11863,19389,10077,29727,17855,28475,2774,1835,30195,10022,3071,21829,27781,15697,7410,24072,1016,2026,3964,22909,4036,889,1984,21846,1348,6203,6571,2120,26754,4558,14381,6747,13413,9587,1135,1293,10214,1975,3396,9072,26778,22106,13829,13563,14370,5880,1794,4993,5261,1799,23156,18140,30194,16186,29319,18439,17381,10106,1771,1523,5816,1197,1917,17376,1917,5307,9474,25953,15927,30257,30211,7635,25269,30261,26733,30263,30153,24986,23804,11768,26325,16637,16652,19820,20020,16725,16738,20012,5622,22606,11946,16719,22598,16653,19249,1665,20021,30320,20023,30322,20025,2341,28571,19690,20006,30327,20008,5622,30321,19685,14010,20554,10478,17306,30336,19821,19906,19680,19807,30341,30332,30343,5535,16646,12133,16012,9861,30325,16638,30339,22600,30329,30319,16644,30321,30357,30346,9860,19203,30315,16734,30363,30352,19905,16739,30368,30345,10508,15420,4927,20017,16721,30351,30318,16738,22603,19912,16728,20014,30335,30383,30337,20252,19681,5614,30330,30367,30332,30369,30381,8892,17192,30383,16000,18962,2207,12510,17260,10332,17237,9900,12516,16038,9912,30359,18080,22597,30362,30317,30398,30366,16740,30379,11201,16647,10864,9804,29279,22811,2325,18510,24422,2379,24973,15442,18163,18515,3796,18682,2389,23491,30420,30316,20019,30423,30388,20022,22604,20024,30428,2428,15312,18856,14138,28565,18963,21983,8660,21985,18968,10850,11017,18971,17238,21992,9611,28560,12517,2826,30077,17117,1306,1691,27401,3351,1904,4361,17837,28564,18174,21982,29163,17985,14145,17987,11961,12004,3480,21283,10491,1666,1928,21251,18840,23977,6820,22078,19407,20602,16408,17465,11435,20100,14124,9122,17940,7501,6239,19304,15624,321,13460,1930,16525,15581,12968,9199,15017,15701,7657,1652,23636,30216,13169,1561,7212,3189,1798,8756,4722,8316,9161,3847,3457,8002,7299,20388,23494,14157,17999,4048,14161,18003,26602,13295,14166,3977,10880,14170,18011,25661,11933,8878,14486,6843,9495,26169,17214,22350,19115,14184,18025,27831,7162,6324,7989,9491,26648,6515,11612,11376,4493,14394,27027,3689,30310,29482,24709,17925,3008,2865,17936,10211,14117,21903,17933,5647,17935,30506,18951,17939,3430,19301,1688,14130,17944,30497,20163,1114,25905,1480,788,7055,26311,1143,4477,4349,27113,24745,24223,5091,27341,1551,6668,4990,17968,9965,17971,9062,1162,16489,2493,28954,11982,9242,5908,21980,30408,9902,19893,16058,17986,25173,30489,21301,30194,7936,11301,29706,4407,23655,3409,4877,28494,9012,27914,14670,4504,30478,2986,1343,6815,10229,9513,1182,21478,28657,4986,13897,15145,11687,3441,21870,1649,30524,3449,1695,30527,22990,5827,20155,30532,13908,14776,23235,3549,11607,23021,20592,30541,12775,30543,18001,6332,30546,24692,30548,18007,22652,22404,18010,28045,25530,14174,25888,6307,30559,27979,30561,26592,25619,11355,30565,2818,30567,1151,30569,2022,8587,1842,30573,9454,3556,12004,30577,767,30473,12354,12356,7693,19044,26531,7874,26533,26223,11049,26352,26463,26341,22683,20213,19456,26246,26425,26403,30728,12375,21971,26516,26354,26256,30734,18928,26389,26542,26470,3281,30729,26395,26546,23847,10715,3364,7923,3675,12068,4447,14535,20340,9584,3685,7201,6826,7795,3691,1391,25336,29871,3720,3699,27291,6450,12766,3705,1731,11901,25367,18890,24689,6442,5166,14091,16862,27365,29850,26342,26368,29774,3729,15890,14223,21275,3735,13007,3738,13197,10611,1057,6136,3745,11045,29713,26898,28873,22124,4524,23887,30579,24254,29004,1193,19582,1055,7942,1059,19724,1063,3086,1130,1561,16386,1561,29918,9436,17819,25290,1166,8454,30329,8083,7145,13759,7993,11832,4480,20613,13034,16908,4791,6868,20496,29923,1858,4816,12261,6479,14914,20140,10596,22740,20156,20182,27520,986,12308,22647,4722,21467,8506,20585,2670,2127,17841,2771,11947,5672,20761,20753,12811,3476,2094,15273,7755,1015,9004,20391,3123,4233,25849,30677,5885,6332,14820,1610,11695,14570,11203,11319,30853,17763,24770,29186,19926,22450,19928,19842,22454,24867,19734,28917,29195,20761,29197,28921,19921,29200,19735,3805,19917,22440,16107,30910,19833,19919,22446,29211,24276,25203,8270,19011,25206,22474,29218,23340,19018,25211,19872,7419,19874,7818,7490,30811,25167,24709,26584,1276,8150,7985,10299,13041,15752,20344,26728,4801,6385,24482,14634,3480,16149,1918,1784,3796,16799,15552,6634,1329,8385,2069,2459,27813,5581,5220,6446,21911,9574,1175,10520,20862,2066,7023,1664,1278,19723,9226,3036,1489,2144,12993,4852,23770,16080,3034,15156,6507,3957,25597,6601,1436,6081,2506,14847,20045,2932,18762,8002,3392,7074,5834,7939,935,12785,10214,18885,784,9043,13197,12482,21084,21505,9486,13040,20599,5663,2661,10691,11037,22681,7341,14399,10191,13441,12148,24131,23246,3877,13575,3493,9675,12244,12125,11248,14039,21516,13570,1054,27539,14787,10510,23373,2790,3930,2266,16397,23373,21901,8977,14952,26577,1001,11397,10601,20707,16844,2859,5697,19837,26753,30896,1241,19934,29191,19721,19837,29194,22457,29196,17943,1714,11396,20441,11271,22681,19619,16996,5001,13384,1843,28657,14714,7236,2850,11493,3334,27706,5230,1707,4312,8905,7759,29152,3006,9393,24851,24895,3002,24897,8369,3035,31100,4396,7248,11214,8363,29749,11283,10358,8433,1813,11742,17832,25402,30720,12631,903,8976,12522,24304,11670,29327,3360,5217,21453,1342,12143,9222,3044,20724,20716,20670,4300,4046,18073,21829,20769,20641,22281,1080,6030,3992,1067,19632,5696,1360,1424,1071,10745,30454,6906,20041,10039,6176,11920,5682,23759,31143,1088,5795,31140,8111,20645,21836,29402,8085,28725,8127,3535,8129,11132,8221,27311,24729,29541,27327,30821,1338,1078,1015,31122,3029,27886,14340,20897,3802,1817,22211,11037,29428,1515,28036,12914,3154,31115,12223,15097,1010,3529,1675,13403,1176,6004,840,6987,23975,19659,1444,30166,1841,3527,26852,25018,16963,1691,3416,29369,25093,5935,16897,6035,26822,6931,4306,9525,26632,11860,21546,23256,1283,6913,2052,1132,5588,29730,13225,2895,9043,29436,928,2627,5668,11570,21878,4407,5884,23982,19846,23163,6023,23560,30611,20605,8461,10667,7936,5115,9585,7735,5994,4450,2523,17596,13057,25015,21662,3678,10396,25985,24452,15645,5542,22411,10108,12004,13387,4727,7473,16054,20837,1159,31195,28878,3341,10919,13381,2980,19162,950,23990,16472,10021,21336,22772,5794,16807,10263,8611,17031,20424,14720,6004,1672,17017,3807,22015,1709,27817,11436,20971,24362,11533,12796,5888,4679,2771,15035,25265,23991,8003,18748,975,14566,19205,2137,3747,19784,6144,1192,2824,3433,7645,18040,4116,11533,15407,31293,5529,16522,14592,2745,30295,5649,14684,574,14625,31326,7673,31328,6891,28334,5191,20499,5189,27569,973,3224,14079,7717,9016,13181,2218,5116,1593,9907,10012,1676,22108,5703,7637,11614,26990,9070,2435,14255,6502,6581,904,24126,14411,2266,1394,16756,5649,1658,31341,20339,11868,18967,25418,10197,8100,982,9268,13662,3030,31307,15567,5623,24054,17621,17813,31379,8315,15149,11305,6368,1561,31385,7076,2606,29908,10979,12938,9162,31368,21503,26716,11436,1658,31373,25490,14289,16888,19784,19339,4015,17663,21219,19206,24679,18549,4268,4256,31433,23148,887,7405,3870,31437,10841,31435,3216,4268,18058,19169,4216,24683,21988,29303,9402,1918,15630,1498,14232,12102,16456,12127,20258,12133,24593,18215,26753,8776,11453,16965,16881,2098,22256,25894,6030,1170,11445,2763,3036,2334,418,19688,31451,5850,15062,30262,13779,5638,30363,31459,10478,31461,25414,20407,8455,12263,3498,9219,31468,23233,12384,1437,30058,24362,8259,1015,2197,31477,19903,31479,2572,31481,6930,31483,12126,20257,30349,31488,10209,3174,1146,29970,10201,1248,8776,21499,13441,31472,10448,1411,2035,31476,27229,28373,24983,24252,21382,26618,25168,1213,13709,13736,1375,30464,28555,5428,22531,9786,30371,1639,10763,11594,20244,4778,4098,12115,13312,31553,15798,29654,23349,29229,27439,28877,18605,9697,5565,919,1283,1515,8101,17756,7985,16894,3052,4312,8379,8590,14361,19952,3191,23339,25209,23341,19749,7674,1452,12760,17407,3673,1912,29613,5011,24365,3056,5970,24386,8780,4051,19948,5301,2267,18080,8704,14362,6675,14364,7662,19371,27332,16266,29480,24253,30936,25103,31536,25710,31538,22867,18490,10853,5504,16325,15662,1295,26967,15251,4046,6029,17163,21261,20485,8815,28667,3431,6993,922,20654,20768,12601,31138,990,13429,11021,1600,6803,29623,17080,2795,8774,31168,20662,20788,10240,10165,21327,4687,6421,6421,21909,4592,30329,4518,19182,1423,19674,25355,29176,31556,23480,28084,30311,25221,6941,18970,24857,19047,31591,7950,29116,31676,3063,29118,19100,8155,14029,31677,3098,29114,19096,29119,2187,19786,3058,3054,31686,2992,2115,3055,31689,19177,31687,10359,31685,11807,31683,31673,17035,5324,4550,19176,2181,19178,29115,7718,31700,31681,19100,3782,2873,20501,8765,22623,9168,2877,7716,21483,22213,31719,5309,11959,483,10272,15501,29106,31700,31684,31711,3057,31679,22438,31229,19932,19918,31063,31068,1429,19931,21460,5939,31058,22446,29187,19831,22442,30913,19713,31066,29201,19848,19855,22460,27316,30893,30900,20407,22449,2892,24869,30901,31282,4906,25170,19828,28925,24868,22464,30908,31069,19302,31759,9007,31761,6148,29188,30902,18707,30911,19937,31064,19716,29190,31742,9139,31744,18080,10222,3392,19711,31749,19927,30915,19924,2315,2078,8480,29103,31729,22072,29117,31701,31734,21208,29104,31703,31712,9061,31813,19138,31804,31679,31809,19181,31732,9061,19132,19183,31690,31807,31699,31693,31691,31688,31682,25327,31607,29655,31558,28599,25665,4906,1412,1462,3435,11899,44,9267,292,382,939,72,1510,1420,1178,19515,32,113,32,4833,907,9363,44,315,3092,46,5866,2208,44,27054,1783,838,6695,1792,935,31864,1235,31866,1515,31861,15888,57,31864,8594,2120,1359,482,1054,292,6927,5429,44,2120,1002,11756,1199,31853,13217,31876,54,31864,1655,1304,1162,916,24319,2039,1175,50,31896,1002,31898,4646,24120,996,19570,52,31858,31854,8340,996,8002,31904,3033,1009,2095,1052,5241,46,18525,1690,44,31919,1065,1455,31923,31925,56,44,298,1420,2988,5555,31842,9466,26102,11373,31924,19515,31933,31935,46,31937,29056,31943,938,31933,31928,4431,8387,31917,31927,1430,31920,11244,1261,1794,31877,4251,1462,11842,1166,31864,5646,19567,9132,46,929,928,31877,5707,19567,5591,1002,12456,915,31864,2988,31947,24167,32,122,32,527,1562,31850,2035,31939,7720,299,916,571,31983,6176,4646,31892,1562,954,5626,31864,5750,1071,2773,1599,46,11842,49,31982,25032,1166,1173,31987,109,2071,292,1762,1107,31913,7194,32010,418,2095,31871,4404,299,6204,31847,31974,31861,1178,1359,108,31854,9134,1166,1065,31895,13132,46,26102,5153,31853,18125,1449,28164,31887,31936,994,15839,3506,28133,1552,31934,12058,1900,3026,31997,12795,5395,2821,32017,3476,1417,26852,1842,44,13183,7502,1173,31853,48,31982,31940,918,1061,31931,19515,31896,11091,31937,31900,5196,18525,31895,6182,31959,31922,31915,1267,1649,31864,31953,2762,7765,955,1572,31913,6218,46,903,1162,31934,1257,16385,2919,32037,22331,1067,1664,31934,25265,918,1588,31853,8964,1299,1315,31934,1081,4696,14631,903,903,44,3704,1270,1173,14459,1842,32070,3844,1185,2919,5854,23601,44,1180,918,31930,32120,1900,31887,32104,2921,27054,32143,31912,1462,1183,2784,10183,954,1759,32102,1564,918,3350,31896,1307,23002,939,486,30293,31947,1853,31895,1914,1430,3777,1061,31892,5196,31563,31957,31943,24599,31923,32178,10574,32010,4710,31939,1417,31941,31949,32088,32123,31936,1820,3658,1420,32191,32097,940,1471,8002,32179,31959,20362,31910,768,31913,32093,8468,32096,31958,31929,32190,32082,32090,32212,32087,32214,31946,31948,32066,9063,382,51,31913,32075,31842,8881,887,1771,31909,1122,1511,31934,3021,6332,905,32231,1276,32012,4447,31972,31856,31854,3978,9983,31877,32241,922,32098,3051,932,55,32102,32245,1571,32077,1002,32249,32092,1237,32232,32012,16695,32242,4080,32238,32233,24884,31947,10686,316,32096,995,31974,1721,32104,2141,32263,31983,16692,29534,32277,1268,32005,1002,14100,2052,1075,1399,1183,32013,32020,9248,888,32037,31893,32291,9129,5395,959,1172,1257,31633,31895,9505,31910,1067,32175,31914,1307,32003,1399,32115,32025,32138,12795,1853,1927,32314,32137,847,571,5170,31924,10171,31852,32244,1068,1783,7057,31842,32160,32007,31914,1242,20649,31877,8384,1419,32132,15553,32056,53,31887,1417,32040,32237,6960,996,1585,1054,32345,46,32347,31914,3053,32252,32012,31859,32255,1009,32344,32264,32259,32,81,11707,1914,2035,3435,32247,21777,32010,5153,995,32369,1585,1122,31939,1704,24020,32309,32076,6537,46,32229,1614,995,32262,28038,31896,32235,10686,4671,32044,32239,31912,32364,26032,23363,1462,9983,32158,32399,1056,1560,3107,32101,8765,32153,1476,32305,1462,8340,6993,482,19442,32010,5549,32224,929,1068,9323,1351,31847,1267,1307,31991,32309,1496,1692,10047,32102,7071,1465,1399,32253,14651,1914,2095,31900,1237,31587,887,31982,32376,955,32144,32274,1304,32445,3668,7194,32272,5854,32137,14340,32450,28748,31864,3653,22163,2784,32443,32451,31933,32439,32448,20722,31861,4885,32438,1237,32440,1455,31847,1759,32173,1914,1709,86,1200,32423,31980,32,31847,5227,3059,1351,486,3051,887,1585,32071,8881,1914,16446,32486,9698,1002,9323,1771,31892,1460,32432,902,32434,31839,4885,32089,32474,32469,32356,31861,32466,32446,31924,32513,14651,32444,32467,32462,4720,31896,292,32457,4430,32515,32460,32453,1114,32464,32459,32452,32512,32441,16675,32436,32313,32468,32537,571,29327,31845,32309,9066,1441,31963,7548,31861,954,31904,12058,890,1449,916,32037,12743,32278,32344,8981,2105,1883,32327,13814,10640,31904,21000,27109,2462,2041,299,32398,7071,32570,8901,292,932,31933,1330,32402,3049,31939,32258,32400,32204,32262,32584,32265,31232,32261,32239,32234,292,32236,847,2828,92,110,24109,23800,27508,26549,27440,7608,20988,2449,30373,30338,30422,10502,30399,30425,30401,30380,10491,10330,10984,30395,30385,30397,32612,30424,19823,32615,30427,30358,24613,10662,26878,29868,14647,5017,15110,10688,19047,23189,30853,6023,19132,30226,4663,8587,9259,10417,26651,5870,5034,3190,6044,2510,31778,10422,9532,1666,5330,1443,31921,9370,4249,9372,9385,23426,11314,6034,19388,16547,9382,26155,24169,19890,531,9385,9292,26862,27009,3643,10458,8472,3185,2381,20251,32621,19679,10481,12129,5356,30098,21770,19690,19677,30376,19908,11918,27289,25409,1071,6323,13227,12143,28015,29707,3519,6757,12310,7054,3174,2119,1249,15110,4754,4663,5199,8311,8653,3515,27324,1822,8130,25965,24729,31767,21032,13662,2505,1532,9519,25986,10012,14063,19830,1778,9140,13069,24033,17093,1561,16586,17392,6902,2527,20651,22668,16849,32241,27725,24932,6519,22782,7252,24443,32698,13470,20574,30196,28493,2745,22786,5759,7954,1153,17552,3528,21544,2079,6312,4433,6722,14029,30595,4364,13854,2069,20304,19948,19546,2141,3371,32727,26090,10706,4821,32732,3863,32735,21315,5564,23977,26627,1240,7777,1229,23369,13282,17301,2910,4476,3179,1269,32750,3027,32752,21503,4641,6475,1914,11074,1810,2772,32760,8883,21607,16803,32765,1426,32767,9642,6668,1499,6766,11104,5817,9077,5845,9942,19097,7795,27109,6977,9370,11929,5797,6441,26117,30538,9015,4477,1489,30671,10426,5856,4850,1097,7175,1889,5405,1649,20521,7203,3712,11447,20533,22668,3819,9032,13082,31393,15952,8442,19774,4450,24923,27596,28935,21303,2523,26827,2094,3876,10393,13606,2112,14814,24094,13482,1119,1499,13211,32378,3052,8899,1194,32846,20807,1640,9009,28713,13146,3420,8580,4828,9285,24339,9518,26725,23875,5866,2191,27673,17395,6389,27673,1037,3558,856,34,84,101,120,347,69,100,105,116,294,872,874,276,264,266,31832,31557,22953,31559,29231,25842,12159,10847,30412,18961,14017,30632,16182,28568,21986,8613,30372,28572,21991,5657,18975,16007,22015,9943,5315,7134,15605,30482,21981,30459,32934,18177,31389,28570,30406,9912,18973,930,32942,9941,22016,4050,10493,2267,32930,17981,32951,18965,32953,28569,32937,28571,21990,9913,18974,2269,30470,32962,32946,28563,32931,18175,7838,21984,16002,30463,32938,32974,32958,6243,32977,17258,32944,18978,30935,31534,24639,32607,31192,28094,22574,8498,19468,22359,27880,22579,10893,28533,4207,3187,22533,4227,22556,33001,8552,33003,17209,28551,33007,30560,22364,30801,22569,12919,29283,1055,22573,33016,17188,33018,28633,6111,22528,33009,4583,33011,33024,8537,28557,14278,10793,22491,28608,22356,33004,8863,33033,22549,33035,3389,33037,22584,22570,17809,5340,22542,33044,5301,33046,27976,22564,33008,8519,33010,33023,33053,33025,5190,23863,18824,33029,33045,33031,33005,28289,10040,28102,33052,22553,22585,29161,13382,33028,8858,33017,4573,33019,17663,33078,33066,33080,33054,33026,33057,33002,33030,33087,33032,27852,33049,33064,33036,33091,22350,33054,33014,33071,33085,33097,28224,33006,33089,28613,4314,33104,8529,17264,28739,24110,16294,24112,26841,19218,32999,4599,33084,12890,33086,33111,33076,33034,33102,33051,33116,8566,22555,23876,33127,22355,33059,33074,33047,33100,22580,33050,33115,3743,33067,33039,16028,33070,13647,33072,13650,26311,33088,33077,33114,23411,33012,23993,6562,17893,33043,33096,33073,33098,33075,28634,33132,17233,33134,33148,33092,12919,33151,33027,33015,33109,22356,13651,33157,33171,17898,17215,7832,33161,5403,33107,33153,33180,33155,33168,33143,22527,33101,33172,33186,33174,33105,33118,31530,26615,29178,28947,29310,28379,28088,28522,27633,28385,28093,33108,33128,28609,28529,33099,28100,28532,33133,27644,28615,28395,28297,28619,28539,28211,28622,27868,27992,1590,28626,27660,16759,28408,20401,28122,28313,28002,28127,32899,28417,28322,32996,25220,28519,7744,3244,12928,24558,4466,12775,12067,14278,15406,24200,14306,14253,6631,4477,12105,4480,4100,2038,31696,4079,31819,31678,31827,19100,19054,31735,31829,31825,4878,31826,31733,33272,19140,23412,29540,31038,4874,1464,6509,20710,6606,4437,16019,9958,29127,16821,13514,2042,12386,9497,1441,1765,19848,1782,3656,12824,1311,4399,24892,5566,8375,24896,3004,17495,8359,2994,29075,21597,8375,31107,22218,11575,6308,28938,28501,4853,29142,20749,20816,10658,14223,2953,6767,4253,32723,2563,11768,31856,18388,18433,18405,18451,18479,18394,18481,18381,4027,18413,18290,18221,26375,18207,18476,18463,18478,18393,18453,33342,18411,33344,18470,33346,18341,20124,18418,18330,4632,18421,18364,18480,18232,18482,18469,18398,18370,8324,11983,24275,18461,18404,10364,25133,18392,18378,18438,33368,33343,23392,22842,22960,18415,5944,33361,18475,18449,18226,23450,33380,18465,20680,18496,25139,4027,25141,18355,22961,33389,18311,33376,23383,33378,18722,33395,18423,18409,18467,33399,33385,6416,18457,33403,33373,18049,14090,22896,23447,23383,13714,3272,18871,23452,2701,13347,25138,9112,4089,11769,18879,9851,12761,16042,26139,18796,28714,18798,33426,26144,16337,18892,26147,22116,18789,16431,18898,25306,1615,33245,27627,23061,3350,1514,788,10550,2406,30072,3662,19928,25267,9199,7118,5741,3445,28494,14274,21618,15098,15784,4624,7333,19279,1011,6496,23301,3433,3422,19778,12193,7789,9067,20394,11301,1670,8350,9658,6818,8813,2175,16951,24384,1991,27396,17300,12499,13225,11671,3845,28953,3087,28935,3805,11359,2074,5844,12977,4706,1516,5542,7119,3658,1038,1518,15735,3436,21441,7736,13578,24459,1251,27792,1245,1587,4801,1286,28883,4047,3679,29369,5586,10185,12261,8517,1014,987,4210,16965,1931,13021,1322,15031,14855,3602,15108,15036,8319,3534,15607,25643,20368,9421,12235,7764,9751,12502,19233,5678,16906,4965,1515,3929,2110,3018,1658,3061,17386,20316,19668,24334,26070,14039,16530,33514,19786,1409,11693,1294,14036,3472,10294,1676,17375,16844,2048,10185,5564,1733,14665,10093,30671,14641,19084,3418,13345,9202,31665,24984,31609,32997,25103,19444,27123,13272,2368,9662,17160,26152,17522,6821,15156,22994,13177,7513,1646,22073,31527,12982,21567,17962,13530,30673,3663,13542,13535,20294,6778,6503,5629,1324,1128,8911,3701,17061,10688,25425,15000,17859,25949,9606,5749,8083,12018,3098,3530,10710,983,22006,1645,3028,25247,31048,13214,24087,17335,11399,3879,6307,3334,1191,1667,27827,11713,15499,8739,1935,13247,26753,28409,29940,4311,12674,9987,24561,1933,9333,20200,8242,7211,24816,14411,7749,18841,15254,3443,25123,15617,1413,3477,30872,5015,4663,5529,1146,2702,11093,12503,5822,10311,14434,25823,28899,4245,1561,30228,3321,19791,15044,12817,23660,21612,3934,14401,6857,5791,2043,14389,2730,8961,8907,1019,14652,19119,2895,1688,19786,2981,16774,3036,4143,10228,25627,19675,13460,1461,5834,5153,3671,15257,26648,3953,16854,3045,22626,1053,4083,2895,1719,17350,24834,580,12025,3986,30215,31237,12314,16910,31808,19411,11958,24059,3859,18186,993,8454,1273,19062,1954,24599,10083,990,3554,33332,5604,6606,1641,3485,10197,14878,15578,13199,3845,2745,11460,23430,24915,33631,9678,21247,21863,27938,1320,1814,1079,6062,7226,26036,24410,17959,1435,25054,4793,3455,32698,24518,11675,13149,2050,8583,11675,10527,17153,10448,12268,5265,3329,30873,17002,14623,23180,17293,25968,30587,14977,30183,9464,5205,7037,3178,27453,15191,23695,13056,14420,2071,24401,4802,15716,1990,11231,10489,26774,14405,5206,4312,16007,9455,17768,14399,27323,1735,4232,13247,27527,19385,11274,31017,29018,25579,10163,5086,4667,5183,10106,21912,8764,2859,1654,1963,23688,25024,16619,5753,11393,33777,21494,21870,10990,29314,16350,31508,4080,9533,22761,15947,25037,1443,10420,29942,16501,22761,15492,9436,2393,3089,17052,16836,6862,18969,28000,3796,1444,1788,33901,18030,33707,4472,2212,2510,11461,1600,16501,10389,1832,16615,33913,7397,1409,4394,16794,6967,4910,2693,28556,4512,15068,26958,4096,3734,14699,22723,7789,23246,1814,27723,9702,5685,3353,23770,3408,23620,1532,20723,4515,1173,10563,25981,14472,21537,11484,14649,4141,1893,11570,7848,3654,11704,13766,32406,1165,33941,9484,3098,16170,21150,7635,11992,27938,17073,13209,27743,17329,12004,14394,12195,5091,8811,28406,4766,16079,8452,7936,12706,1244,20931,4198,1139,3879,3085,20549,1962,4428,9699,21153,7051,2259,2635,1280,15474,2201,1763,6705,21450,1238,3472,19303,2059,1123,8518,12344,2071,5265,17522,10020,15008,3352,9989,15896,2777,15131,3856,20359,16996,1963,3422,33667,10599,5261,8419,3017,13522,17711,3124,3257,4232,5888,22073,3011,12268,11750,4804,4936,17585,1895,4801,16158,1290,1071,5778,1783,5461,3678,11561,20478,997,33625,20846,12697,7217,20376,9589,13460,27660,29314,22262,16553,12085,7627,4175,2916,10028,12128,14847,6014,25940,13204,17975,13756,22825,1287,21677,33119,32602,28376,32604,31560,5283,1406,15189,1116,33932,10139,4700,23442,33766,4588,27791,33298,981,31199,3027,1158,9516,33993,11214,30881,6538,27756,16941,16816,33957,11960,1061,33960,25934,11493,4760,9724,17387,3049,33968,2499,25044,6700,6513,20039,8451,26890,4766,1980,15146,25573,17382,1972,3849,3445,9183,11249,27620,25831,27561,31177,20442,1438,1151,4047,2495,31241,10847,3124,1124,1020,8009,942,3039,5796,9531,11386,12781,1687,34009,14497,4364,34012,25988,13070,7989,7060,2910,3057,6348,12074,16470,6872,6034,33533,27902,29370,12484,34029,3092,4852,34032,26800,27051,11781,34037,16879,5802,24528,1433,1579,34043,24918,33689,18846,2067,31527,8100,3971,8025,27794,8599,1069,12821,6119,14892,24024,10932,24065,24088,6700,942,3953,3108,12697,20858,14445,12548,28117,11941,14293,14608,10023,16047,24386,4993,1298,1126,17814,9465,12026,4988,8640,14347,11013,4245,4926,12745,9238,5286,1466,14390,11019,33481,11144,21674,19778,27161,7235,31111,2282,13211,1922,7168,5948,27798,1783,16148,19778,13217,5994,4346,12365,6114,13232,11255,13262,14892,30872,13837,16527,6029,7924,16044,1389,9467,5716,9462,14853,14037,1080,33828,14619,14768,22180,3517,12822,13848,19296,13829,28457,1447,2376,3446,33891,4713,1403,34012,12162,2507,11551,34295,31272,5904,4358,6029,9891,1784,6752,10894,33815,34285,14969,6830,34281,15316,5068,14515,6029,14917,4860,33554,34274,2569,16519,1140,33879,901,10157,21344,22320,10398,18509,15363,27474,21799,21396,10474,19891,27482,10964,15868,34337,18658,8628,22378,19144,22294,21351,15409,24969,21365,7713,10952,24991,10399,24976,21349,34353,17288,10956,7406,29273,5080,30393,34346,34360,18509,15756,34363,17423,22295,27595,21931,29307,33121,28742,29180,17117,34334,1465,21345,29287,15333,22377,29963,34352,34376,34354,34343,21398,30371,34359,26326,16303,9677,34375,17287,10431,28103,34356,21813,34358,15325,7964,29276,30460,34402,26331,15863,26322,21364,34407,34397,34409,34347,10735,15768,34350,34391,21356,34393,34365,19890,34379,33601,31532,25166,33604,27628,34385,7995,34372,8015,34339,34351,34426,34403,34342,15341,34396,2390,34387,34348,26190,34424,29985,22293,34427,34404,10969,16247,34447,34336,34422,30131,25573,34413,21928,2198,24980,34446,10865,34410,34388,18491,33564,34441,10791,34454,34342,29272,34417,27504,28081,31531,25165,26617,33246,29004,34436,34448,34460,4512,15769,34473,34453,34443,24283,34395,34368,15357,34468,34421,12930,34439,34390,34452,15860,34475,34494,34445,34496,15853,34498,34438,34389,34490,34425,34474,34493,15368,34406,18169,34458,34469,34449,30145,34463,24967,34507,34478,16264,34480,33204,29308,33206,28378,6956,20451,18205,17613,18389,18226,20435,18348,18318,17658,18440,9112,4027,9569,33417,33388,8324,34458,23836,18329,17690,18331,34540,33410,18437,22075,21071,33398,34545,2671,34547,18484,33418,11186,10865,34552,34538,18297,34556,18407,33411,15873,34560,34544,25433,34563,17800,34548,18472,16299,5293,34569,33337,4632,28287,18211,33381,34559,3452,34561,34578,9114,4044,33387,18472,9623,10868,23893,34553,18244,12486,3252,34541,17657,10101,34593,17661,34580,34565,34549,4656,11593,34584,18727,34570,34555,9104,34589,33396,34543,33369,34546,9115,34597,18221,29857,33349,33392,34571,34620,34606,10063,34608,34577,17661,34626,34581,34628,29846,33406,33363,13925,34633,34557,34542,34636,34624,34563,34639,34612,18291,33454,24638,25103,5605,13659,3623,18295,33407,17311,3584,3398,6933,9036,17783,34196,29402,23099,4957,28593,2057,17631,33402,34613,11982,4908,34616,34643,34554,34587,2021,18464,34574,19975,34609,9557,9500,22638,34640,33360,34568,34617,34586,13925,15690,34621,34686,34623,33384,1463,5055,18428,34566,34509,34629,34661,34644,15689,18527,34634,17651,34576,34650,34703,4957,34705,34677,27569,34642,4628,34696,12486,34684,33352,34590,34575,34592,34637,34689,34684,34719,34654,34380,23292,34382,33207,24396,13541,23531,12565,34665,1196,13191,24001,17648,34573,34558,21037,4779,34688,2870,22341,9483,2539,1010,10050,3641,6817,5053,34537,34724,10974,34726,34699,34750,34687,34731,17691,34690,33371,18444,34721,29869,34681,34603,19520,34712,34647,34607,34715,34702,19534,34718,34627,34693,34708,34602,18362,18815,34767,34648,34783,33356,34563,34704,34787,18325,34551,34695,33350,34555,34766,34713,17803,34649,34784,18067,17492,34692,18257,34655,25102,27628,12922,17477,19559,4577,4067,4049,16508,4577,2596,12937,6920,1395,14992,7018,15761,13300,10393,13155,5955,14461,1334,21625,33058,9215,2787,14855,12109,14484,3455,15565,23235,16083,17670,33906,10206,23323,13020,19115,25049,14690,2533,21018,2524,12924,8535,1765,8227,8099,2622,6943,1437,6254,3936,30623,21120,28041,33873,34028,23115,24645,5153,8557,23438,12892,9343,2574,2613,15515,19473,6544,21307,15864,34858,28329,4271,4622,10206,13471,4758,2668,3396,15762,7300,3957,13506,1824,2045,27643,15297,1330,21594,5810,16479,11484,15563,12269,25675,29007,25574,8157,19076,23379,34005,1349,5139,31148,34880,28150,10127,3442,3992,13195,22920,19732,20899,34873,25036,27198,1436,34926,30947,6772,4049,5744,7716,8861,1771,23099,2078,12281,10443,34930,26575,9688,6217,27807,29507,17395,18001,6176,34863,28150,34935,9244,13427,19633,3889,7749,34855,889,19761,6772,34968,6309,1684,5138,24999,1182,29408,9486,20363,29665,4818,12325,3299,6193,25049,1376,17172,1770,34986,1214,34332,6626,13345,16113,21697,27490,15772,12640,19888,2215,21399,1574,4018,418,20824,6144,5028,11015,29515,3430,9675,25407,25279,5157,13798,9437,1648,8663,3682,13685,14607,11736,6348,33833,29608,1905,1761,13751,11993,15697,27210,2859,1269,25544,4448,22444,16055,1835,3126,30673,13197,24599,30606,6372,1612,12120,1681,33298,15735,20522,10089,19506,21331,9404,13585,6904,11399,10005,1891,1855,6423,6488,9136,10201,4869,11492,31370,17072,27807,13584,1260,8959,28247,33285,14800,11484,1561,29411,29325,1357,22108,3745,35057,12941,5125,16133,35049,28506,16381,19171,14342,1416,23812,4233,14678,23504,21513,1588,1449,2207,3734,14402,4247,4396,1777,11750,27911,2664,12953,3926,11496,25786,6297,20163,15239,22649,32891,14282,11332,17444,16695,8414,29043,23848,17511,10885,1396,11135,11741,2086,8114,5878,9720,21614,1164,15650,5868,22880,1967,26334,27175,1160,4555,5226,15231,16699,3837,6217,9309,5856,11123,30046,2038,21614,2061,5864,31568,9627,5001,4329,5551,5878,25786,750,5229,6352,2427,1909,32441,9718,12326,16213,5212,19278,22793,9734,3740,1593,16848,5561,14610,16480,15163,21348,1962,2368,1782,25643,23331,6232,9697,11217,4218,12613,2515,5749,4392,5450,3342,30028,9697,1151,16475,1932,1600,25528,21253,3554,8655,2053,15603,1990,33918,35193,3124,1940,8449,3354,2218,35179,8259,34989,1758,7237,2269,33188,6408,3601,28195,33182,33218,13654,9870,12418,28413,8559,19504,4580,29388,25762,31240,2316,16507,34865,27843,20372,34944,8533,35224,331,18791,12140,2428,12033,3925,27675,21162,35197,8370,2528,4255,1914,1478,1914,29161,2367,2634,8327,33946,28170,35262,23510,1066,1585,22715,13664,18578,6386,8501,34839,27667,5377,4548,13633,8518,35237,13205,15962,25539,2391,2318,5320,24643,35278,8499,6068,16142,34814,33123,16298,28380,4869,29613,4490,2919,13065,2278,1700,4498,19395,13193,27030,8634,7055,27989,7728,20455,8158,15535,13806,8085,17542,31003,18144,9441,24932,2027,3342,1067,4364,13978,30303,20413,14472,17041,26696,2753,13069,4077,29574,1088,4753,17352,8341,13821,8900,24060,2781,1762,6222,9463,30971,9245,17279,1848,1912,9132,4504,1731,11361,9613,17524,14143,19239,3334,5607,1896,9400,12420,35141,7543,25672,2040,17618,5157,1645,3941,2329,2306,923,5094,12943,14849,31167,35330,26116,14248,26145,15186,17617,21605,33562,7200,9983,33528,24898,35366,33867,3830,25995,4217,5214,19761,15273,11051,20783,12276,3078,484,3948,319,6545,35220,651,20988,5395,21480,21353,32965,28241,19173,5424,7304,10053,16539,11121,15813,11817,3398,22190,31162,24473,28498,23180,3776,35277,33166,17872,10213,33240,18843,28317,13943,16127,6422,28393,4601,33038,17204,35253,30371,22852,18655,18812,13923,18720,8733,25134,13706,18230,8851,33431,13933,33433,34611,17471,17807,25144,10831,1391,2662,33214,33140,15496,28390,33183,32608,28102,35469,27646,28296,1923,22391,18516,27967,28283,18043,35296,28743,16120,11768,30456,30143,21170,27353,19316,11014,28250,22791,24683,15344,3701,27358,21169,11027,27295,28248,2628,11044,28251,24683,5402,35210,34601,34618,34587,16232,34727,34622,34808,34796,10573,29672,34799,18371,5402,3462,27291,35501,27285,35505,13755,35494,28249,35507,35497,19075,8241,16580,30141,34585,34803,35514,5643,34793,34782,34730,34716,24189,35521,34812,33404,23958,34630,18462,34555,35515,35543,34635,34795,18426,18382,6430,34734,2734,35486,34383,12354,418,9058,4462,9484,14200,3746,6122,13263,35345,33742,1978,10197,32823,7287,6202,13051,5900,1131,14755,17932,1812,28983,6125,8616,29570,5705,1134,34195,1563,16406,5684,12504,11877,18845,19846,1592,8886,2356,5312,5918,10850,9825,1406,6888,977,4317,25488,10665,6785,29499,11318,5403,10115,24079,2123,3684,4922,1699,9015,4720,21209,35077,27004,24135,19257,8593,10656,13910,24405,1328,10204,16670,9308,14673,26716,18598,7212,2795,4134,7231,1774,34201,11299,1162,5799,14652,3662,11371,14626,16433,6987,17569,30869,30195,5665,30213,1527,5848,6589,10573,23498,27413,34678,20406,26085,35539,34631,35554,35542,34806,18267,29852,23826,16232,35562,18341,6388,1091,22687,29829,912,3257,13447,8659,3547,9157,4347,9254,2174,24227,2172,34185,26930,11420,13273,19383,32651,27029,8813,1009,31800,16039,24079,35672,35553,35541,17654,34781,35557,29876,35679,35548,34653,18221,35551,34709,34682,13925,35555,35676,6420,35518,35559,34546,35680,35522,24250,34431,34482,27233,34656,27628,1572,8297,26527,29866,22853,29835,3223,34766,29167,30790,29841,34690,13940,10551,13630,23430,9037,24545,1663,15567,1647,29121,11438,14693,13155,33930,1111,35764,34176,5541,947,8617,20506,13768,3358,27011,11393,33495,8086,1737,3662,17165,7275,14552,3091,25973,14513,3171,17960,24072,4803,20578,20801,20578,23229,13661,35152,5541,10600,8228,15195,1731,11436,25246,4408,16820,1776,25080,1588,31307,12327,11482,4059,5916,35002,4083,5576,5867,6349,26691,15573,12214,4306,3222,8329,25781,29886,21572,15585,4555,12085,14309,13980,8811,31624,6176,25651,4868,11651,10423,1008,1801,32810,23710,21247,5775,22922,20909,1247,4550,33872,29069,20282,4575,14414,1120,4245,26013,9702,33506,13567,17536,2875,23834,1528,14566,5423,13541,20849,25472,9405,28505,3099,4597,3651,17528,11895,5888,24509,13049,24917,18832,9638,20749,6010,1147,8003,12105,20545,9962,23798,34086,24705,29656,34089,32926,3897,32330,15104,11240,17738,1827,1924,4803,2729,4387,14278,13119,16799,6928,25443,1588,4448,17945,1569,20465,4688,1817,24300,21889,12694,25635,4658,3245,16679,24002,3172,12994,24564,13520,11709,10023,10710,916,17591,34059,7110,4521,1327,12941,1196,933,25403,11496,31935,33749,5155,35199,1269,9644,32764,13331,31803,31466,5901,1691,5214,16749,3475,4505,18641,22764,30234,13559,6637,1725,5183,26562,9157,2987,3416,9514,8025,13467,27677,14647,23018,1147,22299,28445,12105,22281,25937,14975,18801,3660,7241,27217,15718,1520,940,8764,3549,11465,33521,20928,11884,34260,20520,1800,8789,8261,4071,35303,11929,24802,31260,11224,2140,34158,1525,28657,35871,17170,14821,25866,16390,3037,5158,14267,9899,25814,16381,6571,20356,21844,7413,24664,1185,1073,25042,17361,31053,6977,6442,3740,35055,3005,1701,16750,22335,21642,16904,20514,4977,13661,17362,21878,11644,8100,4252,17978,2566,3335,26456,26479,4195,29931,26534,26544,7772,3272,30743,7712,35564,34739,20799,17099,30723,23939,26446,22988,26481,8737,23850,26451,1057,36061,26508,15323,23898,36069,29166,26437,23877,36074,23859,26507,20002,9673,10950,36079,36054,26447,36082,26450,26439,26452,26431,27675,4301,31598,23869,36080,7618,36071,5401,36094,21972,36096,36086,6644,5605,36078,7839,36091,36070,36093,36073,36095,36075,26453,36110,36088,7694,36113,26541,27456,30738,26250,36083,36118,36085,26528,36098,21886,26445,36114,36081,30749,29768,36084,26537,36087,3125,36123,30725,19973,36115,36138,36129,36107,36119,36097,16248,36089,36124,26435,36147,26459,7703,36106,19990,36108,36132,33437,9776,33439,18886,18740,28097,26165,35386,6900,18893,33448,18770,2432,26137,18900,34736,27335,34532,29658,7608,17705,6059,5373,1009,16213,24647,30088,1056,5136,35460,13728,13960,1701,18559,36191,5378,10866,5953,33435,13939,33437,19969,19883,26140,33441,26142,28287,33444,6886,36172,16275,26148,22006,18896,27974,36177,16437,35734,25218,27626,35737,26793,29067,24993,2984,17490,29072,24897,4519,31098,31101,23082,8934,29080,20857,22443,25427,27718,6696,25422,29089,3466,30302,3248,28998,13958,22054,29097,17107,12941,11659,5094,4343,11960,31816,16528,31806,31733,19095,33273,31713,20838,36264,3049,31677,36262,31675,31708,31687,8414,29121,23031,13077,8427,4521,13135,4716,8351,7705,6693,12924,10211,30093,12643,34340,14142,12775,29132,3461,5714,22982,7253,12953,23762,29145,19843,14163,29149,13187,8889,17837,33313,7757,36232,8682,5919,950,8378,28080,18196,34481,36222,23143,36224,19218,19968,9764,6069,22932,28412,35438,29668,15325,2318,7713,29767,18268,33423,21008,2683,12568,18933,25135,18230,18223,23390,25139,4089,22959,23458,35465,5944,3598,6134,35267,35265,1547,15285,35269,26443,2663,4166,27972,8504,35228,33169,33033,10682,35232,28391,35475,33159,6292,35247,2231,11438,25472,2525,4908,16581,28090,28605,6925,36063,34533,18048,27630,28281,28523,27844,28193,28387,35435,35472,28197,36359,27852,28612,33146,34405,35478,28617,33225,28538,28209,28621,8111,28542,28624,33232,28545,28627,33235,28548,28312,28550,35229,28552,31745,33242,28555,9793,2292,20120,29786,6331,23873,35743,29929,12567,12495,23962,4848,25513,4051,3388,13125,36420,30770,23960,36334,35747,28438,3175,4060,26374,23901,29175,26471,29858,9701,36434,29796,22859,35748,23593,36438,36377,36182,4906,32249,11895,15395,10817,20638,34747,28431,13209,29598,3260,3233,23299,7321,21087,3197,21089,35023,21092,7887,13041,1990,17185,29614,29627,3586,13921,29630,12467,3267,17698,29999,21057,30771,36092,30788,12462,5106,22274,36151,36441,34243,10961,7136,34920,22690,16130,35798,4850,34968,21152,34928,11253,1147,27143,4827,1406,13774,3846,19231,4219,15736,12246,8342,934,34889,34837,10525,4391,4521,3715,2519,23110,22109,34871,2489,25055,5745,33970,28951,4700,6381,23307,10640,34121,9486,1928,24047,886,3106,35302,23576,15736,33970,3937,3790,21133,2596,34877,2576,8081,36500,22155,16490,7646,14221,2601,13275,10160,24386,7047,1712,34082,21776,13838,30531,12241,30673,16789,4708,33686,34956,9392,34958,34961,24880,11041,12191,19725,20899,1406,2368,15251,14860,6017,1998,6524,6993,24865,29769,36487,29861,22265,36490,3262,36162,29879,33681,27938,18087,23567,29626,12461,36478,17231,30009,29631,3267,5412,6779,10745,23880,30282,26502,3205,24791,29641,3249,36464,15396,29647,36468,29649,36470,29652,31664,35890,26789,35892,29230,31836,18906,7921,1178,24079,5316,19710,4126,3411,11289,1890,14486,15607,1803,3684,7532,3537,7169,11461,7789,11213,3359,9857,10618,28434,1568,13976,4872,30045,4075,9103,23666,25700,31240,9327,19798,13766,3378,21636,22136,7727,931,14409,1884,1803,7319,25298,2487,13734,2857,6338,18132,8815,15735,9362,26899,9938,1122,36589,3828,26564,29718,29883,35901,29024,29723,5245,31370,5919,5856,5231,4459,11140,2040,6312,5161,16352,16752,32658,2712,7755,13441,5935,15295,24206,12103,16347,5687,22681,13380,2504,20441,22318,5630,32847,13387,7175,4560,2600,4015,556,6757,27740,2022,24923,24904,31602,13294,17108,2061,3022,3477,15222,29392,6156,2745,10030,4920,22610,22067,2230,31555,36629,28945,31834,28876,35894,9549,11361,23650,3752,21238,2504,31292,27769,36643,5775,36645,27930,8138,7778,36650,4344,17123,1311,7110,36655,26313,26150,15925,14798,13177,1824,16862,7054,6076,3500,36666,29753,2231,14594,8422,3876,1884,27950,5862,25797,3846,36678,29050,2936,3500,36682,20914,2183,36685,8960,16687,2585,10852,36690,5452,7778,21645,28040,27676,9146,29024,10166,4295,36700,22205,4447,27330,1086,6186,1660,21295,8061,4505,4096,1097,36712,7019,29457,21193,20746,22786,4673,36719,25986,9219,21441,31139,3462,8649,1359,36727,19079,9643,36731,4624,13120,4361,1518,1503,30556,15429,27162,32043,6853,21889,9305,29412,838,23975,11843,1532,18559,3103,36753,35411,77,21435,23065,10640,21438,36528,36536,22958,22503,5565,15893,21447,26155,8583,21451,24691,27415,9470,26994,29492,21458,5396,2351,21462,8425,28736,10217,8026,23915,14488,21470,25530,24622,1181,4546,10842,30058,5159,16620,23662,12331,21482,33294,21485,4984,31606,26129,31833,32924,31835,28086,21385,12085,15310,3272,6502,2368,15282,36372,5926,9279,2736,4303,1607,14088,1134,25602,4569,4194,15808,17682,33191,33215,22493,33217,36389,33219,28291,36392,25128,10715,36874,27964,32308,14633,28077,1022,25287,12457,1586,36930,36370,28537,6058,22123,36944,29994,35470,22559,36387,33130,33170,36391,33221,3660,299,28425,36941,19069,2539,17459,3945,10135,26499,7841,36445,36138,36058,1531,36419,36152,26411,36145,19978,36990,36158,36442,30741,26462,36994,36109,30103,26356,36091,36999,26513,26482,26525,3696,37004,36132,36451,32605,4953,2105,31964,1425,10685,31318,21548,8455,14673,37022,1165,16047,37028,13774,2912,8023,24482,10166,9022,28464,1977,998,23156,5243,17389,25488,6022,6828,4328,3343,2783,24331,6694,7052,10189,17997,4774,1762,1394,8336,12478,9147,1232,1249,3343,1360,30971,3026,8001,36308,14346,7051,7251,15586,31503,1776,13056,4958,13403,21986,5971,982,13484,22648,21548,33693,14673,30947,2880,8585,1361,4667,7725,13202,13435,11819,1960,26752,18586,17743,17354,10217,15511,14435,13883,19278,1301,37047,36682,2061,10657,24174,3746,1819,27793,12076,1156,4346,34222,5649,27054,22335,30892,27717,970,6003,9632,21626,12299,5211,8049,9873,37097,3337,25521,3486,34907,37133,14461,5222,12322,5845,5265,37139,29513,8705,25453,16478,14039,13901,8416,18748,20834,5189,20606,11632,10634,8000,4700,12025,1067,31241,4190,5001,1134,4085,20722,28060,29484,4363,27597,15132,5801,1084,2627,35451,9327,1810,10439,14906,12808,2143,19597,8452,11823,31004,24510,4681,20269,1472,20315,2677,37030,27723,7083,14078,1684,1179,5265,37195,37142,34017,2679,37145,1416,37147,37098,20328,3219,10209,15136,10520,5250,6546,37157,10405,3029,35301,29534,18781,20107,7564,10449,21666,15000,12765,21259,4238,13254,22038,20577,36429,36956,23670,1249,8726,25610,4799,22252,24893,4988,6882,780,16752,14543,26091,20621,14732,1731,6840,27971,1328,2091,25012,9463,8860,27457,13776,2987,33664,6444,8554,13793,1668,3650,21506,1004,27114,3039,37253,2301,11858,17366,984,4017,27298,11501,24894,10927,1443,10012,28236,27314,10179,5563,9730,14608,31276,29696,12281,17121,11532,1884,15229,1990,22772,3674,28350,1163,28654,32768,3105,2962,32906,83,112,105,110,110,101,114,32917,875,32920,27333,32923,25330,36758,36633,21229,17481,31671,15665,4553,22382,25173,22400,6573,22308,15672,6577,16179,7950,3336,23574,30575,12484,1251,4859,3345,1787,20955,20281,35944,4709,17762,1675,8740,3360,1119,24401,5552,4290,3367,31242,28431,3403,28731,4677,3377,12468,3380,18846,3383,7018,3386,2498,3388,29297,29873,3393,3705,33785,15785,3399,21503,3402,12104,16130,11244,17575,3912,3412,22989,14705,3417,6996,3420,3929,3842,3424,7063,4449,13524,1937,3431,31202,9420,4667,16397,3439,2954,8149,1303,22609,3446,37179,8757,23280,3501,30244,3449,2234,3456,28885,3459,3097,11596,3463,20562,36245,8102,3334,3470,14953,3473,11801,2661,9154,5752,33628,3481,9891,9470,14218,15288,3489,2107,16666,20088,3388,4758,3497,36936,4583,37407,3639,3504,3845,10524,9483,9201,5222,21517,15226,3516,3334,9720,3520,25797,3483,3523,4407,6306,3493,9046,11224,3531,35331,3339,7202,37156,3539,13885,5896,3544,13995,3547,2997,3549,1981,34691,27158,37179,30716,31831,36921,37313,26131,30154,30015,4382,35768,3510,1124,24437,4623,30227,1401,1004,4394,6777,4397,14710,2569,4401,20975,1667,7232,35882,4407,12638,16238,10790,7403,12458,21376,4420,34993,23029,8139,28141,10638,11731,4432,17407,6235,10673,5028,1448,15916,4441,4524,4444,19588,15641,3222,11337,22964,34773,18501,5134,8426,4461,34499,16209,33252,25058,10762,14285,14255,4802,8958,4479,12121,37525,1826,1574,7938,12083,14530,13979,13555,15196,4494,3265,4497,34685,34768,31322,28591,4507,7224,17052,36040,5831,25521,4516,2933,29155,4520,29089,4523,25076,16259,19438,36874,9801,4165,2281,4864,19240,19225,4358,35923,11187,1890,26778,19232,31086,5307,36643,14116,460,19226,13863,20381,26759,19243,19805,19895,19907,19897,30328,19910,19900,19825,19902,23106,24281,35631,13966,27270,14075,19261,7192,2436,27271,10687,6457,10845,19269,24561,33906,24563,24653,24665,24487,37633,2919,26562,26559,5991,24662,28242,29739,30508,27184,30510,8585,30598,19300,19302,37207,4338,37648,37652,19301,37645,1718,19293,19299,37646,2205,24659,8560,19079,11029,27352,35530,11014,19317,35533,13761,24683,12421,19324,34839,24674,19328,16510,26582,16582,23993,24998,19893,19337,6157,18914,13916,21509,13889,18924,18915,10033,19341,18919,10283,10283,4853,36956,28879,4751,28881,16773,2278,28759,29696,16767,29686,28895,28890,16770,29691,28894,28773,1673,13174,28898,5828,36741,1513,1111,28903,9842,23467,1724,2260,994,28909,15752,16908,5739,4789,35942,29510,30898,28918,24871,31065,30907,29208,22463,6191,30911,29203,12978,6745,19055,28930,5957,5417,28905,4668,17764,19630,20607,14979,2753,10394,13224,32134,22800,32906,70,105,412,32,84,121,261,37309,32919,877,32922,31666,29481,30812,29066,33209,18022,33211,28525,36385,33154,36974,35233,36951,33063,33198,36393,28105,35479,28107,28397,36398,33228,36400,28623,33231,27871,28546,36406,28629,33238,36409,36950,13654,33241,31616,26333,37016,34090,28087,36380,33210,27968,33212,28607,36386,36169,28611,33220,37787,28535,37790,28537,27986,28399,27866,28113,28403,28625,36404,33234,27874,37801,28549,36323,33157,37806,28321,36415,2265,31450,36418,12560,36431,26351,35744,36423,26512,29932,2864,9852,8976,35741,29936,36421,25337,37009,37850,26388,30791,12559,26862,26349,31663,37001,29614,18093,29616,23938,29168,29841,36450,36179,32603,36632,36925,2844,36927,30088,1576,25836,9276,36932,16580,36934,25635,2880,36937,1465,36939,19067,36558,19116,17899,29833,36971,36946,35471,37818,33183,36977,37821,36980,36955,37809,36759,9094,9954,26430,10180,37888,36962,4017,36964,9662,36966,8809,36968,1006,36970,18610,28286,36949,33195,28531,36952,36978,36954,5083,34885,2616,15425,12157,19088,36988,7874,37858,36057,26515,37003,37844,36995,26509,26540,26435,37938,26427,37940,26240,37014,30732,26465,26477,36997,37848,26426,26250,36992,2286,37942,37005,37906,37316,8546,37777,35483,36375,28386,33179,36947,5342,37924,33061,28200,37927,37821,33223,28536,28208,27651,37794,27654,33230,28305,37831,14300,37833,20451,28311,10757,37836,36410,4578,37838,33243,9793,27676,5182,5862,7243,24047,19320,8341,5579,11209,2435,12524,4757,27688,14520,27690,27800,27929,27695,1961,1407,27698,13536,27700,20045,27702,28906,11248,9513,6758,16954,27736,32121,2053,27711,14290,3405,27714,14602,35625,20780,27719,4197,23529,15700,1074,37573,3625,27727,20625,3805,1143,27731,32271,4795,22808,16412,36642,1896,26078,27740,24030,13808,4197,10177,9868,1533,11830,13303,30567,27751,17173,25874,27755,1933,7134,8590,1710,11273,35133,1993,2988,27764,4360,27766,31641,28017,11289,8124,27771,30025,9129,32767,33709,3036,27777,1663,27779,14347,4597,33820,5216,37032,3667,10634,14667,27789,6694,4676,37112,27793,14441,12701,3475,317,27800,2674,27802,4429,7560,20991,28077,35884,16551,35452,18842,27812,1097,11501,6511,1400,35911,10127,10686,11249,2531,17530,12470,7647,2496,7248,4328,3834,27830,2818,3509,21641,15040,1669,993,36956,28602,36381,37779,28606,28526,37817,28196,36975,36360,37820,33185,37788,27982,37823,37980,28110,37827,28303,28543,37830,27659,37987,28119,37989,28630,33239,37837,28415,28128,37996,27886,3314,6061,28050,27890,27803,27893,14306,27180,8774,27898,35391,12197,13958,3003,3674,1354,14833,11889,6195,28729,2053,27911,27896,10918,29044,2040,2095,27917,3465,3684,36980,28050,27923,2784,27925,11633,27927,7615,33585,24549,36696,27933,14434,4723,24782,8815,23097,10974,26914,31074,1283,13774,3203,17330,1782,37447,25869,38218,27952,29352,24007,38216,20576,8607,10302,28050,8333,38147,37966,36374,36383,37969,36972,28096,38154,37784,37926,37786,38158,37822,36395,27984,33226,37793,28301,37795,37984,28544,38168,28118,28219,38171,37802,37992,37804,36411,5368,37807,33928,1664,3233,28134,12854,6224,23654,3318,32702,30538,28018,8299,2074,14604,11630,10843,28025,35021,11377,1192,28029,14840,28032,25224,28034,21460,28010,23305,23731,34872,23875,18993,16835,10620,27918,1424,28049,27889,28052,1508,11076,19386,16517,37346,16484,27693,10553,14479,14541,1448,14705,11747,22281,28067,19550,38311,28071,27921,5373,2540,28075,11037,28077,5312,19333,37963,37877,37908,28381,37778,37814,37780,37970,37899,38253,37819,37976,38257,37978,38161,37792,37981,38263,37983,28214,38167,28307,37800,38270,37835,28124,37993,18578,28228,28637,30756,990,38280,972,28137,3697,28139,6451,12791,6897,28144,23018,11132,28147,4356,5763,30833,2061,28152,13404,30046,28155,30759,4480,8464,35622,28161,27922,926,28164,5756,9787,30988,13824,16088,4506,28172,1856,28174,9463,6381,6993,28178,24362,28180,15527,14888,13118,28483,38342,30155,38344,28521,38346,35484,36384,38349,36973,37900,38368,2441,38256,27855,33222,28104,38160,38259,37791,38261,38358,28400,38264,38361,36403,38267,28407,36407,37991,38367,38273,37994,38175,36413,38371,35251,12436,28233,10811,6390,28236,15839,28269,20443,28575,7150,7875,28245,11044,35071,35503,35506,28253,11030,28252,19080,27360,36874,28258,30100,15318,28266,8664,15425,28275,32696,29296,5297,10954,28264,28318,28261,8724,25684,38491,28278,31595,28280,37813,38426,38250,37898,38429,38351,37901,38157,38434,38159,28205,38438,37824,28620,37982,27990,37829,38445,38363,37988,28310,38172,37803,37925,38274,28317,5295,15423,17606,37839,28323,7055,1778,28326,1149,28328,5128,4361,38410,13081,1245,13064,17859,8028,22055,21466,12004,28340,5000,14514,10282,31631,38417,28347,38483,38487,28350,20617,28352,7163,26862,3406,7548,14873,10992,13107,37186,2324,28361,12133,2241,28371,5615,950,7752,28370,3046,38246,37812,38425,37968,33213,38502,38252,28610,38505,38353,38507,38258,26174,36396,37825,36399,38360,38515,37798,36405,38518,28409,38271,38450,38522,38452,28553,38176,36414,27136,28420,9535,22278,23918,36981,1921,24151,28429,28585,24003,4512,28434,1260,37869,29862,35716,10103,25946,28441,30795,8639,6909,28446,36293,9414,10658,1935,9062,14271,21555,28457,6434,5008,28458,6705,28460,17339,3703,31400,28465,9041,28467,1582,28469,38074,28471,903,28473,4400,22090,21688,6769,2707,12794,5823,28481,14343,8748,23019,4476,36517,1535,27898,8301,17378,28494,2221,38671,4488,14176,2990,3115,7553,28500,21807,32550,14873,35397,11482,2747,28508,2744,6006,2817,2091,28512,17581,26123,21659,25989,38421,37488,15744,38247,28604,38249,38580,36356,36948,35473,38431,28392,33159,38587,27860,38439,36397,38441,38164,36401,37797,28216,37832,38170,38519,38598,28632,38451,38369,28636,28006,16717,28559,32993,28561,14086,32966,30458,4136,19083,32935,32987,32973,32957,28574,35418,5549,11465,28422,38609,28581,28427,9743,28584,7064,34664,1765,28588,3257,28590,28588,3519,9722,944,1684,797,38576,38345,37967,38701,37816,37782,38430,38723,38432,33021,28203,38355,38510,38162,37826,28541,37796,37985,38446,28628,38365,36408,38272,38600,38724,38603,38371,2662,6225,28963,28667,28643,4858,1717,29091,2062,13570,38222,19850,28652,29523,17926,29523,28657,4870,20761,28660,4700,28662,37548,15029,9599,34896,3447,28679,14537,28436,12988,1287,28674,4450,28676,12715,2776,7625,38822,24095,28683,37404,10312,5860,28687,9712,5843,13199,2523,28692,3008,3003,28695,28694,30557,3431,17365,28701,38833,4071,28705,9598,3554,15588,1649,28710,37402,28713,12229,38838,1407,28718,12701,11539,5219,7231,8681,11132,28726,25642,6448,8374,28731,2763,14384,7728,13509,20975,479,37760,366,68,409,345,116,869,110,97,32037,873,37310,37771,37484,37773,33603,34484,27628,26152,36945,17789,24141,23577,23909,4033,29593,23582,22940,23817,31657,24150,22242,24010,23590,29172,30009,29935,8918,17696,16430,29865,29936,17874,3633,18986,8337,9432,23321,8260,8255,8169,3954,25191,25199,8262,18999,8158,8157,19004,25197,33716,24235,25200,19405,25202,29213,8177,25205,22477,23338,30926,31579,30928,14378,25212,8283,25214,19962,29226,36755,29228,36923,37315,38343,1049,1115,10087,3817,11355,22277,22914,25339,37847,29770,36488,3229,25344,29860,29874,7776,3425,8085,27904,17621,17670,14670,29581,2107,22946,12382,2992,13314,11203,20643,9974,25184,18988,25186,3929,8254,38926,25190,23326,38939,38932,15568,25199,38936,18998,8156,19005,18342,38942,8176,22470,38945,19869,19014,38948,8718,38950,19366,30930,7816,29225,7819,38696,26907,1387,37699,16233,29011,23880,16279,8409,10801,21714,9775,30081,7285,7400,25125,15777,10786,36457,37509,16280,12593,18372,5747,12640,12617,10558,7304,5358,34398,29982,28497,7522,15396,20870,20813,10762,36622,27484,21801,5294,7348,13381,7946,34491,7310,36465,10818,24360,27485,10769,29526,7344,10539,22239,3788,15323,34364,21800,10768,39042,29526,36956,28164,15787,17124,27105,39090,1937,17751,39075,25079,8617,20703,39031,1128,5059,4696,3840,20811,39048,7318,39101,20392,11773,37582,29044,4430,7355,16315,27497,16316,38957,31608,31533,38894,26793,1178,11244,1162,1117,12018,6495,15217,39044,7522,38624,39047,39033,12617,1833,20598,39135,3538,22910,16284,10802,37546,4877,8957,39062,8226,32125,39107,27496,5098,39115,33203,26838,34531,29657,37017,8491,15839,33042,10281,13418,5535,24058,1545,18093,15891,2637,31499,36722,21981,9943,1117,21262,11240,31156,17522,30461,20578,22753,30158,1660,28989,4478,22758,14249,25122,5700,39179,12730,36911,8669,37436,30470,3750,27175,39167,16039,5672,21629,3350,18536,20510,37862,38409,24362,17396,18745,6781,36920,27506,37485,31667,30580,29004,13164,18737,7022,1362,24183,3539,24139,9495,5552,5637,36718,5557,15669,37056,5704,5636,4105,39199,20510,1547,5312,12568,23980,10204,14056,6751,22075,6486,10985,39239,22845,11924,4060,15283,2621,15233,11174,11190,39193,3318,39189,12518,14229,17453,3380,4794,39219,15241,21570,22797,36956,3103,25788,6961,17711,6529,39171,4558,37056,15237,3117,35626,8663,2634,2582,30750,30740,28564,20499,3030,5527,1491,2326,31511,20286,11917,6971,19044,39277,2528,8000,21441,11193,16032,977,14149,39227,16004,3116,15236,5654,15238,10110,24139,6475,5677,5630,19617,16623,39259,26023,39261,6349,39217,39264,3992,13591,16449,27923,30158,2530,5681,39222,5682,12126,5640,1660,3431,12598,1445,15234,39302,2046,39304,9508,39253,11943,30074,13237,32943,3515,2636,2581,30724,9911,18972,12512,9939,18976,32994,14086,39246,2602,2605,39182,16009,1557,16622,1908,39193,39271,5589,5723,5592,37874,34088,37876,38422,10587,4489,938,5744,6531,8898,11981,39128,12477,39136,1666,39092,23021,19888,39032,39375,39142,11234,25066,13056,24272,5666,2092,2035,11847,39072,7631,39146,6039,29526,24327,24414,39264,29592,26849,39399,39384,25005,4961,39106,24586,39139,4831,5099,4472,39388,37581,16311,7648,39091,5544,39137,39396,10806,27485,39376,28357,39401,39149,13056,36956,10732,16746,33251,10853,27666,29240,10536,12635,10787,39127,39386,7312,7387,39413,39049,26332,37802,8016,27480,7318,39061,39397,39083,7277,39112,37583,39024,27838,1226,39027,16276,39029,7314,39385,39099,14551,34474,34278,34371,34399,39055,36456,10764,15397,39059,25525,18259,39418,19437,10771,6482,38459,39081,10814,12653,39074,39148,36874,34535,4166,24259,11976,22232,18860,12874,18164,11778,35240,5520,17711,12078,1431,11785,10650,5520,31284,19791,11832,24291,20927,5890,3083,1812,38098,17344,3705,5015,13499,2912,11221,5251,1192,12735,2530,4197,9169,9498,4428,7525,21760,4551,12807,9427,5741,12032,5325,4787,26116,13478,2203,2103,1640,8999,6343,14900,5236,3752,10429,14800,1520,20087,36901,11856,33977,33986,4231,11861,10495,13598,27717,11867,11992,1019,4107,38083,18976,18967,11190,11876,35350,4559,3039,13435,25446,18488,30616,14657,2060,8001,13240,7028,20301,511,3431,4251,11894,37174,5139,11210,5230,14711,5144,7725,1891,6693,1968,31292,13138,29245,11914,31457,31512,32687,23499,20551,16734,20264,30001,885,7779,38658,1489,29603,28705,17045,30535,6592,23235,11709,4504,21301,533,37507,6711,19278,10260,9962,3025,9965,20303,38090,8425,13248,11738,3141,1415,4054,2100,2129,19804,6938,10132,28111,19148,21641,11962,9750,28372,34529,39152,34381,29309,36378,7828,22347,18493,2319,22987,16755,4198,7080,13258,5525,3438,11507,21546,17829,23693,14493,1592,15044,13187,3679,1143,11543,12065,25034,1891,1407,4795,13471,9161,20998,33693,16693,18143,25292,26078,7077,12245,4788,4680,16390,3714,9140,32815,21558,6178,31632,2880,20303,11582,7098,21003,10976,5697,1148,7720,22614,1127,35657,3125,30414,38734,1406,13413,9046,6714,13064,8433,31205,9691,6962,9512,16836,6722,13123,1695,25452,35665,13204,11248,27681,31311,25705,9615,4217,16908,5842,21641,13418,2203,31151,28831,331,18957,9109,24948,22029,22233,39497,15777,11778,12417,22541,19256,32683,10972,18614,9875,30586,24714,15407,14187,8821,36293,5687,20582,17550,3448,5841,27323,16863,36036,4672,1001,14665,23622,2778,3712,22773,6332,6402,7951,15156,17969,2274,30287,3319,4550,24296,1293,4433,3108,39645,13780,21325,14245,20364,3651,9971,1894,6148,1139,21275,31473,13044,8632,1553,32878,36749,2959,34827,1731,4826,2813,736,17017,14992,1640,10328,2085,13563,39824,5217,13286,7162,13084,15563,16357,4957,20267,10973,37186,5618,39086,2572,34684,18857,23151,15213,22030,22234,39498,4187,2498,928,2865,39548,24237,16893,2247,19320,13534,11541,11872,3879,21924,1705,7018,17067,30234,11997,5104,10016,15299,6588,7110,3200,24195,16030,16001,8663,24543,6010,32819,37150,1127,4842,32665,33763,3541,4860,2578,6020,14163,1587,14744,1540,3030,17485,7762,13137,6928,3349,5989,7258,3527,36849,3045,9054,2148,35615,35824,17141,33514,39534,18781,19503,37880,2881,34827,13460,5231,6001,24885,1293,22421,14601,12793,1397,1134,29043,29075,5191,21953,14137,39759,30350,10973,32664,39287,31413,32687,21963,35391,37370,15752,8747,11528,2687,39943,6701,25424,34846,3455,9427,3679,36706,20749,38392,3837,17467,4104,16700,9631,36265,19776,16422,20344,31004,9267,28145,29718,8806,6307,15514,15273,2497,10433,3808,19090,5158,11961,13123,8341,6201,20304,15724,2074,13854,10982,17038,1683,10690,2959,5806,8322,11132,13131,6757,13802,23793,4714,14202,2100,30520,28874,39368,36631,32925,37964,9656,8682,26147,9823,16836,14501,28794,11796,26999,18569,5371,4770,13193,11459,19765,29412,3097,20643,16341,16023,4682,35998,1774,39678,2148,14696,33969,1445,14385,2875,12022,2572,33693,2806,15937,10524,15165,15159,10223,17483,39894,1703,39891,16577,19443,14163,6132,38413,34326,39883,29959,6736,10198,17294,24373,39203,33850,28561,2913,39871,3369,37414,8192,34167,15651,39336,16794,6722,15908,13037,8593,11819,11460,1192,36534,7749,1684,12492,1563,6234,6160,7868,33566,4416,30432,12881,39844,39753,30126,2426,3598,39849,3188,1835,30518,3115,1778,20499,6492,35599,12330,4444,2995,1799,27458,7650,11853,13240,36637,15664,29904,9450,2029,39981,11234,24604,30269,6147,17285,9874,38963,2911,20620,1038,14245,15535,7939,24920,33622,33873,9022,2172,39861,1563,25414,9613,22086,23931,8767,1444,9052,12025,14271,319,9614,17584,27027,8943,3396,30520,1429,33970,5132,12677,4729,18629,21946,39336,20263,12127,23375,39834,5623,39836,4650,9799,1124,4253,24729,40072,39766,8838,40000,36221,27625,36316,34815,29385,22808,9766,22810,4168,7375,1834,3549,4758,25000,22729,3793,29575,20734,15914,7654,1647,8014,1767,13030,1135,6478,25004,15922,37298,1480,5262,5553,1902,2510,15928,2197,9322,3077,6472,29646,13769,15915,4554,21413,9707,1894,6243,6342,30442,40094,2984,6647,38943,39012,8708,29216,8274,25208,39017,7671,30929,22480,30931,23346,39023,40001,36757,30014,39025,11592,9189,18970,12118,15917,20578,3491,30042,4922,24346,2349,22736,17166,5683,40195,7653,7636,15916,10744,1894,11109,2856,12302,30435,21718,24425,15443,15774,1853,3441,7018,4488,7511,23028,10744,40208,7560,12272,7287,40214,1647,23760,22732,14158,20734,24346,14700,22823,1804,19740,29214,39013,23337,39015,8280,29219,23337,29221,19959,19021,8190,31604,25216,40178,33205,39154,37810,6561,17125,1419,13851,13821,21413,40254,40202,12818,40196,40257,40199,29635,36844,40201,40204,40263,40206,29606,40291,40284,40213,22749,40189,1897,2356,22125,30438,7338,10739,40226,7403,40188,40266,9711,19438,23170,7311,3491,40333,15906,2365,7656,14751,19861,23334,40298,19865,40234,31578,40236,7587,40238,7590,38953,7487,40308,38956,39151,27231,40311,35893,40004,901,40315,1853,5021,40318,7275,40352,13413,22734,15923,2220,2504,17587,1167,9485,39841,2298,2415,40270,2279,40275,1897,20515,23013,8214,7114,40260,40384,7635,22747,40331,22744,1683,40282,22746,9487,15908,22735,40216,40209,22732,6343,40354,12877,9710,40296,38944,40232,30924,38947,40301,30927,40237,38951,39020,19961,40370,40242,40310,39153,40375,38961,23146,1398,20822,11113,1053,11114,40443,9125,9167,33326,20875,3225,20819,6351,1112,33250,34411,12429,23154,10015,23496,12941,1397,3516,9032,1821,5848,40465,40445,31074,11271,29128,12953,15531,3688,36291,36286,4239,19186,29136,39630,10211,29139,40174,7253,23160,15660,40465,1810,40486,40468,30997,39098,28431,7231,12939,23220,5182,4257,34505,4419,14342,15411,15191,33330,22122,39375,40484,40445,40442,20916,20916,11271,40447,12113,8456,12942,6504,23263,1801,8915,34416,39039,2304,12464,16135,6295,11394,6297,10319,39838,36728,16301,8404,12950,16283,39098,25006,4415,33252,39446,21819,34405,24981,40372,28740,39653,36181,39155,13455,29058,25202,33251,22813,39068,27475,16256,16545,39144,16312,16235,27503,34528,36313,34530,40545,40312,37907,38962,9660,22541,19288,25108,16239,40555,16236,39104,8220,16282,22728,39425,18159,36956,22391,11157,12590,16277,40534,39466,2298,12427,35422,18514,12653,40533,16314,39458,40243,38959,40245,39460,1578,11484,30740,21445,21093,35698,31135,17381,40100,5795,20701,1831,28302,31163,20647,4125,20707,20636,20785,31169,20787,31171,11862,20660,30210,20726,40604,20649,35765,40628,20649,31130,8137,5674,6095,8137,17124,20697,12599,8095,40608,35338,40616,20767,21835,40614,4339,40642,20709,20786,20712,12209,842,40631,20669,8119,20719,20722,40657,35765,40653,36628,40543,33120,34737,39654,36452,18906,33773,39215,40603,10423,20665,40617,40638,20699,31637,20784,20780,20774,20648,20778,20650,40682,35429,20781,8106,20784,31647,8120,20788,40672,8957,35330,6644,9867,40634,20718,20708,20666,29571,31137,21831,20771,18073,40644,20782,24039,40682,20653,20653,40684,40679,4125,40687,20661,40689,31171,40691,20791,20716,39086,35777,24276,40670,8138,40622,40700,31636,40702,20777,40682,40659,40674,21830,40609,40703,40711,20705,8115,40647,40618,31648,40717,20790,40660,26454,27346,22680,10423,40726,40733,40701,40735,40730,20653,40732,29637,40752,35338,40677,20704,3454,40739,20702,40648,40619,40650,40718,40745,34085,40662,34087,40002,36924,39371,16273,3490,34569,40635,40698,40673,40757,40728,40735,40740,40678,40738,40713,4645,20660,21841,31170,10141,20721,35765,40710,40688,21842,40621,20714,40693,34775,40696,40604,40768,40751,40783,40641,40764,40737,40762,40788,3092,40741,40716,40793,40658,40730,40814,40798,8122,40726,20715,40632,39459,27963,39717,3900,40803,17644,40794,40627,40630,40823,40654,40779,40750,40782,8096,40702,40785,40761,31164,40646,40809,40797,40792,8089,40822,40801,40825,28186,35257,18884,40724,40610,40699,40806,40839,40735,40760,20773,40787,4339,40754,40818,40786,40811,20658,40789,40819,40847,1728,40768,40834,40661,39651,40373,40436,39370,38697,11592,8086,31856,40829,40725,40637,40838,40640,8098,40865,20721,40727,40859,40759,40870,40867,40843,4140,40740,40846,40620,8122,40874,40850,40596,37314,40598,27963,31883,3576,40885,40856,40781,31635,40894,8098,40841,40862,40868,20783,40870,40901,40650,40832,20721,40796,40715,40820,40848,40800,40624,40770,40877,40544,40664,40546,40313,4013,8896,31883,35856,8237,23212,2323,23010,18013,14189,40947,9519,23008,40945,23214,1419,10311,12615,23023,8226,29707,2201,12423,20826,2255,7290,26920,40960,23033,2302,34998,5404,9012,9988,19008,19949,40424,38946,40300,19958,40302,40361,19957,22479,40367,23345,39022,30934,40906,37486,31668,24639,1664,1508,40646,1558,26920,7568,23213,21413,26920,32703,40400,39467,40402,23167,22741,23165,10744,40948,7624,41008,3409,40279,41006,7539,19234,40967,2328,40969,2105,11879,29825,40230,25204,40975,39014,14373,40427,38949,40429,39019,40239,39021,38955,40434,39116,36922,40907,37487,40246,4907,31078,4054,40942,22052,40944,26704,23214,40999,40995,41001,15843,28966,1192,8640,23164,40963,23166,41015,40349,10767,12593,40949,1361,24599,8601,41016,40350,965,8848,2999,4661,41022,30922,22478,40425,40977,7668,41028,40365,40430,41031,40432,8720,31605,37483,39209,38892,39118,33455,19353,28985,17595,1116,41048,1822,40951,41046,40221,8222,23026,23022,17135,40958,41010,1447,30953,41011,3793,23014,40958,41004,7544,41056,10744,40965,40995,41059,10807,41068,4051,10419,32698,40358,40297,41024,40299,41026,40978,40428,41079,41030,40983,29224,41033,40986,40435,40564,40437,40775,12180,22167,23357,20993,26952,4882,23361,33586,23363,13411,23765,10424,23368,12113,31271,21600,23373,912,23375,25323,21570,23444,3435,5417,18866,36331,34554,8732,33394,17700,23387,23453,25137,36339,33432,33415,18398,25143,36345,23529,23462,23531,25381,23187,22844,23128,23537,25386,15820,23407,25567,23409,23543,33281,23199,15734,29478,41035,39210,37774,31610,27628,23355,1295,20293,22091,21570,32664,8506,16371,13533,20561,10660,7410,23434,23488,23436,10282,16624,16745,27543,17764,32772,23444,6960,25129,13712,35454,41168,17610,35457,41171,36192,41173,35461,41175,36202,23460,41179,2430,29463,25558,23534,23275,25151,22892,29469,12552,25156,23196,25153,23411,22843,25162,25558,39432,11362,23486,6022,39360,16234,3906,17855,12144,4996,13193,11825,3230,12130,23500,23424,26867,35807,23505,15445,7547,41215,21885,5053,23513,26446,20678,26437,23521,26395,23525,37005,25145,41180,25147,23400,29465,25132,9586,41186,25563,23279,10701,29471,25157,23475,29475,23545,29477,25163,41136,40936,40565,40376,1049,7500,41092,36010,11633,20366,1810,4136,21828,40607,3907,17619,40487,10425,7728,25910,4211,7336,14271,17794,29304,4258,29934,29854,25316,31440,21588,11357,7356,36956,41310,1649,8818,7511,4822,29260,31621,29806,29836,29931,25347,8959,29297,3790,9587,7315,14392,20366,6832,4969,40901,7705,11682,8089,40508,22203,9361,6348,912,37698,5924,23835,29870,23960,31621,21081,22423,8943,1128,20991,1924,9823,20772,40644,15758,21829,27904,41380,3638,8100,6909,7392,7357,784,27388,41345,30002,40933,40562,39652,41306,41138,40881,24988,26497,37064,23700,41379,15660,20114,16470,4364,38569,7520,28170,28000,41345,25342,38620,36436,24014,11099,27383,5001,29761,26158,1480,3151,29703,40875,17673,41305,36180,41307,40438,12180,35740,3903,10416,17622,36459,35556,34714,16862,11787,35516,34700,35728,18805,18498,15467,35678,10042,10139,41361,10046,23999,17707,3641,12994,23314,38934,23316,38938,38935,6638,10173,25187,39000,25193,38929,41467,18997,25194,38934,23331,19947,39011,41023,30923,40976,41127,41077,40364,19365,19958,38952,40984,41134,8193,41430,37875,40003,41433,4907,2078,22852,34763,35540,2683,29236,29928,12801,35388,17957,23810,23577,34667,29578,4125,38905,15053,3625,37457,35549,2691,4600,6257,35732,24273,18838,41459,8153,8247,25198,38939,38923,19002,8161,38997,25189,23325,18992,39001,38937,39003,26905,8173,24289,40973,40359,41125,40980,30925,41027,41482,40981,7904,41081,40307,41083,40309,41197,41087,34433,39119,19353,22391,25106,30920,19060,25037,1829,10438,12944,25113,22199,41147,25117,6597,41563,36075,25123,17347,25124,16220,5080,25127,36980,23281,41165,25131,23466,33409,41169,33428,2355,23454,17798,9889,33401,9892,33436,23461,41239,41181,23124,25382,41184,25561,25152,23278,29470,15822,41190,25390,41250,23476,41253,22708,37300,366,86,326,101,111,32,80,108,97,121,37307,37769,876,32921,38891,33602,41088,36317,16298,34761,40583,4478,13259,17124,11887,27779,29014,20385,7933,22185,2241,979,26477,27010,13478,6379,6830,25407,25833,22957,1057,10473,16386,20628,22467,8728,13205,41460,41522,41462,19001,23320,18990,38926,38998,41530,23323,38931,41533,8171,41535,12342,40422,40231,41478,41025,19953,39016,40233,41545,8187,41132,40240,40985,41488,41551,41625,41553,41089,41628,28753,4231,5076,7784,8105,1926,5411,36355,2212,41695,1239,12701,5558,11676,29333,8451,11024,2848,8579,39472,26190,27467,29964,21983,34414,7980,39038,41574,2190,28819,5222,5801,11024,39264,11755,41691,7336,41693,17162,21686,19221,41698,1134,41700,1247,41702,5702,41704,4480,965,927,28725,8403,41699,11796,8138,2141,41703,41506,7728,1112,41719,41709,40394,36288,24968,41714,2335,40520,41717,10458,8579,10179,31084,3731,15093,31167,41726,12701,41728,926,41746,41720,4489,41722,40851,25221,2105,21404,40191,13240,41768,1455,41729,41697,2506,41732,41744,41735,41771,36769,4070,1112,41771,41742,41786,41693,41788,28725,39058,25067,5690,41746,41736,7568,41727,41782,41770,28725,29514,41749,38147,17099,1162,8815,35248,3945,2218,10023,21006,14465,16080,1967,3282,39492,2420,9311,37039,1254,4210,18049,31303,10023,6869,5566,23441,38147,7744,31356,9611,41752,32984,26329,41839,34464,29950,8966,34508,26334,19077,41755,39054,2216,29984,29290,8034,41843,21376,15775,41847,41775,33247,27265,31542,34511,9903,41711,19144,41856,29280,1606,15864,34430,41685,34432,34483,41688,16120,33489,32764,40278,968,10473,7719,18557,16334,8049,39743,41882,3848,10223,933,12261,22633,25717,41741,4928,41887,13859,41889,5668,7551,39113,39430,8303,9590,41798,7279,41882,8454,41884,41789,1154,14558,39650,41397,40878,41137,40880,41039,25080,23682,41880,31401,33525,17149,5408,24258,2420,41897,37335,41746,41900,11555,7051,940,1392,41895,41928,16105,41888,41931,41771,41892,13810,1167,41751,41844,40343,22319,41839,41851,41753,40553,2702,8579,15070,30198,26087,41905,7618,23249,13859,41909,18559,41911,12678,6640,36874,1306,6498,18138,41907,41962,41925,41823,2345,41938,331,12064,41930,41959,41933,41893,41954,40498,10755,41758,8053,7457,41950,27444,10758,34514,7403,41719,41956,41913,36874,31003,4624,26891,41765,24359,40579,39145,41981,8238,41743,41882,36055,5063,41805,13418,2315,5155,41969,41865,29278,18100,34377,15877,34508,30437,25108,36956,1511,35775,18360,40779,1406,33964,9662,23175,39094,34994,4327,36287,41953,36289,40591,7631,40489,36584,1273,2737,40923,20788,23229,7078,40769,5323,35828,6127,40454,34388,4961,40511,40511,42030,4760,30524,40607,20770,27100,12605,40705,20775,18572,7784,11274,40490,40575,25068,2244,37515,41859,40987,39211,37775,26842,10045,6923,42054,34449,42056,42070,12106,42031,40893,40889,12603,10179,11290,42066,20648,42068,12065,40463,39476,41800,15773,23941,34518,8240,1762,31471,34617,42029,1395,10473,40484,40560,25002,27498,7967,42037,41993,7949,37513,29280,12653,42042,42060,31208,40871,40902,8089,42048,23007,40905,41489,39369,41491,41139,24640,40440,22970,20599,40444,40442,42057,4144,11538,33328,6349,23181,7753,31439,37542,19885,40456,4686,10021,33255,34125,3814,42141,40464,41321,40508,38077,42111,12952,7848,36283,4191,5915,5370,42116,34503,3794,40478,42166,4273,3688,36294,40462,9125,40443,42159,8329,40510,42111,39378,3455,7039,40493,42154,29132,40497,34516,12648,40500,574,40502,23181,40504,27937,42178,42160,11114,41321,42157,23492,17737,33257,40516,4272,40518,42075,34527,40522,4462,40524,39765,15391,20807,8017,42025,13679,27149,2070,8706,40241,41485,3988,40360,3982,31576,8716,19868,40303,31581,8723,7796,903,5862,39727,41641,16847,2789,41633,4020,7047,11022,10008,12000,29014,18373,24276,5589,3830,7738,41652,11578,24534,41914,20426,40563,41399,41918,40599,19882,18970,4478,17641,23308,3080,42244,6692,9704,8467,25597,1998,24424,3130,38413,42253,17764,7207,6762,40848,5002,41650,37148,11428,26862,22519,9142,9147,13257,14464,19834,5132,21512,13011,22982,8136,7237,2218,6501,31471,4884,10069,11654,14743,28689,9166,10608,21463,13765,4249,9429,2132,35027,30914,10374,30054,6611,42316,16099,1464,9469,3953,6693,12608,7217,2386,14983,4890,20846,11743,42303,17752,32870,19304,2625,13553,5075,26795,15563,42322,3020,37740,13280,31477,41609,34,70,294,32018,67,870,116,114,111,38887,32918,41622,37312,41552,41875,41627,16786,7132,1162,7134,22740,23040,25148,23043,23535,6968,41294,41600,25387,4835,25389,22701,41250,7157,5869,15189,11582,5742,6869,6504,8309,6873,34259,40888,16073,21576,3813,2324,4303,18889,10885,35386,7183,7006,12574,13332,6894,22879,37624,25376,7015,7194,18481,6904,22197,21840,33287,11133,37344,9244,16823,7208,9030,34940,4116,7215,2989,26798,7220,3003,1791,5792,915,8590,38137,7217,11659,21199,7233,20444,8949,28737,7250,7240,8655,7243,37246,7246,42438,10916,12996,42441,21513,8683,7216,7257,11598,10916,41338,13323,7328,42397,25494,42399,12572,42401,27243,15464,13333,42405,14075,7014,13694,6976,27267,26141,13343,22684,13962,18726,22827,42370,25559,23044,42373,25562,42375,41188,25388,41603,42379,6981,25392,41302,23200,41254,41860,39213,15807,22825,41240,23125,25383,41598,41245,12372,41188,41248,23283,41300,23544,23139,25554,41304,41873,35735,36223,40181,25550,40183,28270,11770,39842,18654,22026,40089,41710,7388,24423,18663,34451,2399,7457,7964,18153,15444,973,37160,30124,2404,41716,2407,10339,18680,18581,24956,4176,22824,2209,42498,41596,22831,41244,23469,41296,13602,41602,29472,41191,29474,42508,41194,23288,42511,40771,35891,40244,41038,40599,18984,33905,32798,18987,8338,41465,38996,38930,38928,8166,41531,36000,39006,41669,41463,3939,39006,23318,38940,4361,39010,19960,19742,14370,41479,41676,41543,41678,22478,41546,41681,41032,40433,41135,42512,36315,33122,35487,17117,36226,40229,41476,41073,19870,41075,41480,8183,42594,19870,42596,29223,41682,41487,19025,42077,41199,34434,40182,26042,42518,40392,18653,6225,42525,30436,7458,7398,22819,20052,24429,42544,25182,25556,41182,25149,41243,29467,42374,41246,42504,41298,41249,18702,41301,42509,25394,41196,42562,36630,42564,40989,30813,22851,2847,36432,23838,7143,36435,29786,23967,36493,6092,12649,22868,42472,36208,18896,30780,42398,12401,42400,37587,42402,36216,42404,25374,27430,42407,25467,18735,22884,3155,42640,42371,23275,42482,41599,42645,23132,42486,42555,41604,42489,42045,25553,42652,42561,40934,40663,41431,41400,41039,23002,41092,4794,24200,23007,41045,27497,41098,31086,40956,41102,40402,428,23017,5841,3846,30681,39473,41051,17376,23012,41055,10802,41007,22967,23032,41117,23035,10492,5243,30017,42639,41595,41183,42549,42643,42483,42694,25155,42647,42506,41192,41252,42510,42493,42621,38893,41876,17117,40582,29068,30486,16191,10906,22399,17989,42762,7558,6230,15673,15602,25181,6646,3583,38993,42571,38925,41528,23324,24928,42574,42578,41472,42584,39005,19003,25199,19006,42587,40974,41674,41126,42592,41128,41078,41483,40982,42617,42598,41549,40371,42704,40772,42656,39212,41201,42659,30092,41346,3905,2294,38969,36422,26414,36594,8870,17697,41443,36425,30789,41418,3729,15467,38912,25349,26378,38915,25357,6257,29621,3642,42669,42471,12689,42672,25366,42459,18740,28462,13329,42463,22877,12576,42682,12578,42684,34243,11352,42687,42478,41290,42500,42692,42502,23131,22895,42696,41299,12558,42490,42651,41303,42753,10578,32906,67,259,114,347,38888,37770,41623,41086,41686,42362,42515,15886,20988,10793,15315,26283,15315,23303,35646,30816,28000,21704,27666,15523,10846,18492,20036,31539,9623,6481,10854,31619,33040,2119,10590,18066,26283,25696,7570,28240,37247,17697,21704,35289,10870,42754,41626,42874,41877,1748,31537,42890,31615,28321,31542,10855,30418,31546,25127,12749,13709,3587,25119,15208,42927,24536,42494,18982,19968,1511,31564,40021,31567,14166,9688,29915,6945,2994,2059,31574,25430,7674,7801,41481,42614,40304,25212,31583,18078,1514,6330,37234,5458,4828,42941,33267,31593,4457,32371,32688,6629,2287,14361,40368,31603,42798,41034,42654,36756,40597,42565,24987,31612,21978,42915,32902,33243,42918,42895,17073,41373,31662,31624,12679,13464,18143,32644,21915,21915,31633,10034,31634,31136,40807,8098,16849,30204,6516,31642,31189,12326,31645,30256,40791,42126,24997,24518,16905,26938,21318,24492,31656,3313,33979,25915,34277,31662,41395,32905,366,66,114,97,110,100,41621,37311,37772,42872,35736,42911,30474,2494,1304,9904,7277,6421,26155,25479,27525,24712,39900,4477,37742,3005,10607,12144,2034,15758,8883,2127,24056,29511,13137,1858,35090,4407,10442,2092,4485,28236,1839,5157,1314,3365,6897,1229,28464,13185,9186,9155,935,2674,15727,842,2080,5265,8259,14031,835,10232,15029,1495,25030,7028,27078,14200,890,22630,37591,29750,1286,16747,10128,2219,15708,24924,24127,16500,5162,10044,14901,13043,1663,7501,10654,10287,28988,25913,20914,25242,12704,27140,2220,31073,36813,9120,5492,42547,42742,25560,42550,23192,41247,42748,18700,42507,41193,23465,23547,3557,42930,36225,15839,7693,42848,23464,41597,23714,13722,34956,11337,42884,35609,8048,36710,42846,1703,1888,41829,21586,34874,16125,8451,27559,6371,6605,12261,21892,27147,23260,23652,2673,2726,2710,13722,42771,23468,43126,42646,42554,42856,42557,43131,23477,25555,1230,36874,32035,8009,10869,11433,26001,23624,1477,26001,3597,4689,1276,4475,11189,8811,16586,2916,13000,21448,29033,3658,6527,21268,3658,16353,13547,1463,19236,17453,20477,10994,8811,40085,1690,5530,3500,11433,32040,22404,5749,31639,2278,15765,2859,4399,32591,16138,7976,5502,17842,35800,8436,25083,7209,4926,1598,1274,10370,10617,11305,29444,1518,10126,22089,19589,1610,10617,8726,7726,6926,12309,2997,42740,42479,41242,29466,41293,42745,42503,23132,42505,43129,42750,42701,42860,41608,42909,41687,42363,16922,12730,24924,33592,3912,14430,35314,20743,3426,29000,8079,3877,13440,8809,9136,24554,6346,6843,14492,35302,116,13661,32704,27447,36542,1088,14623,3466,7064,13517,41571,15070,40149,24371,14698,3183,16771,27696,15094,9019,4024,27901,1097,13148,11881,24384,20175,37460,1056,20735,31019,15095,5933,14876,8341,12035,24046,14134,1768,34005,26877,22681,7159,9735,16994,4489,5856,6504,25632,30719,1266,5705,33962,18755,19388,11352,11709,13801,14410,1691,6399,3189,20138,41289,43140,22831,20083,21240,5564,24475,14541,17364,20471,5829,1478,4108,1285,15227,16164,31589,5307,7936,13581,9495,4555,3540,19588,9245,28713,21565,1941,3329,15792,1520,3680,25804,27735,14590,6783,18124,9425,41379,17357,11955,2322,17975,2278,15194,31656,34078,1824,25496,7076,10667,14606,12296,1590,36810,24564,35079,9049,9724,25644,9198,4348,26643,39593,4890,24127,3365,7957,6108,35125,30621,35157,2220,3541,1557,24628,34847,1659,29441,41640,9873,8965,27775,9139,4067,14722,3429,16375,11695,15070,1526,35938,24197,3750,13287,13174,18748,32944,12265,10405,3265,4121,15632,2031,1687,12165,21194,1932,1659,1072,4340,914,16489,14866,1132,12361,29956,14064,34285,17065,33232,991,10096,23223,43258,42853,23471,43128,23542,43176,42751,42702,42861,42601,40179,42603,35565,31116,14753,25573,5541,15911,6739,35768,16953,16350,4789,3492,32349,4079,4813,19835,9045,3537,9161,29406,22035,5145,13079,39693,9447,32326,4211,2266,11730,9224,1510,11527,1107,22047,2600,12832,3418,8625,29007,6348,2985,9041,31311,14705,14559,2882,1561,2127,2788,24072,29034,17501,5913,11135,37393,5178,43521,6080,22614,11334,9283,29492,1390,34962,11581,2581,8438,3394,7726,25582,18015,38859,3840,15499,24304,3074,5821,3477,13542,9318,3179,36892,33967,14860,20441,1909,39581,16416,11753,24616,8144,20947,41338,25781,30088,11735,30131,1438,16984,19589,35528,12953,36187,40223,26948,9495,13880,3785,4659,35621,20518,1392,43598,36027,35261,12854,1306,1478,42368,4486,24857,25241,8044,3422,38660,38007,19798,1710,41836,2981,34279,6764,20329,938,10163,12527,8644,24401,26644,30717,8630,28424,23020,1171,1889,11429,35397,9060,17350,40198,12234,34149,32009,2102,24066,43378,11794,31654,35039,43383,20578,4049,36698,39968,13568,31509,26934,43392,15637,5237,35572,18575,34072,6803,43399,5771,21535,7663,43403,26735,43405,21016,19732,2919,43409,18037,39736,13563,1329,43414,19516,43416,1412,43418,43370,4560,43421,34302,42228,43424,31503,7220,4996,11088,25292,43430,25595,20593,19923,9000,3977,34949,43438,34929,12992,21649,11837,43444,8079,43446,10234,15181,10648,8668,43451,8221,37347,41782,4238,25534,11743,13567,21156,2933,23693,43463,4621,1274,25628,28336,21719,2713,34262,4197,11417,6990,22772,9434,25237,16692,18586,14121,1963,30621,7415,42233,42796,41082,7594,42799,41915,40935,42706,42261,27963,42606,41672,41477,41074,7486,9520,9587,12093,35152,17378,9345,4389,1179,5082,23020,28423,11750,1731,14765,37911,5026,36580,2660,12980,9287,35759,6589,3014,6323,27677,13199,19388,13035,1390,1826,6030,31634,15156,9697,14950,11334,1695,3422,1884,9965,14698,3977,2758,17478,39902,22055,1603,1614,15241,42416,23587,1835,3426,28507,15939,1682,8097,38641,10110,3538,8003,35317,11244,16831,20753,13037,13835,9441,11357,5009,38652,6336,15154,4251,8557,10228,2188,29902,34849,26729,3934,26799,17313,3087,33789,3013,25752,9516,27522,34201,33700,1314,10197,2437,11885,4761,32736,35869,9504,11361,14503,17128,1710,9666,38212,30892,10287,30198,24509,13175,13984,30988,37092,5216,29387,43741,42228,43743,40366,43745,41548,43747,42970,42800,42563,42973,42657,27628,25551,7341,43264,42492,12716,43253,42849,41597,15784,9486,4338,33731,25229,20383,3805,4861,7778,35817,2103,9391,10936,28746,41336,13214,43772,39237,12702,30673,13193,23227,1278,1241,11532,8646,24310,43200,3686,10685,16354,22313,16954,36741,33944,31807,43641,20041,2758,33571,5582,21207,39976,31204,36732,4121,19348,9043,21419,14311,24749,2985,16904,4024,6507,4336,3438,2810,10599,393,2084,6157,904,13232,37573,6175,25579,3040,17859,20801,10529,6919,10228,20343,22056,1281,35926,1889,43840,5795,2950,16544,5853,25592,11690,42728,3329,9274,25972,7794,3879,33695,12993,15535,6192,37685,5035,10207,9402,28653,19633,7532,2091,42423,39624,15189,21941,8243,43171,23538,43127,43174,42648,23285,21884,43135,41090,21720,30833,5158,8905,2130,8454,6668,16594,21504,39788,11231,21323,1332,10232,25767,987,17441,22039,1277,11088,6766,28696,12717,8777,9289,29992,17411,22054,9598,7392,8086,34230,2679,2254,40034,5580,7849,10093,12045,8748,10126,38229,2433,21923,19618,31454,20312,20255,34143,27453,33744,1103,14418,5918,1812,18528,3044,1703,15705,28358,5090,2255,27220,28464,5751,5540,17029,34974,2684,4921,11604,15156,4881,21242,9200,3934,14127,8306,27525,5665,8009,15031,43053,3544,14390,1483,3552,17648,19617,3859,4574,2583,4014,17174,13480,30775,4797,25269,9432,13262,17274,21557,24266,21628,19844,39638,5723,8679,27037,39638,13557,1684,27739,3845,22256,13387,24468,34283,30760,17314,34920,2698,11128,6596,31277,14889,5178,23367,14200,11823,32643,20486,10293,37065,8651,20759,25016,12196,18299,11231,39243,4351,3597,5548,31437,7304,25410,38490,17913,38481,30092,42893,15449,7831,26031,3091,12649,43122,42641,43256,43476,42693,43259,42747,44006,42749,43482,43889,41195,42703,43749,42705,41490,40774,41401,1051,26691,43725,1520,15889,2074,21274,3114,39730,43795,9222,42110,2281,1286,9491,24235,1950,11741,28464,11898,3035,26648,35030,3392,9629,4990,15619,2771,5699,16703,3466,24544,33922,9160,16428,1561,3482,4047,39630,2051,20386,19231,37099,19388,12699,10657,31111,16907,3460,33969,9032,14665,19776,21143,17931,9139,43982,15222,9350,3290,11110,5909,3828,13854,2717,15474,14418,18569,30713,38871,16140,17751,5868,28345,12768,6829,13962,43993,16361,3524,12991,24616,6248,36832,5996,3396,16095,20163,16692,20068,31473,43764,24224,24499,10991,5912,11863,17930,37278,11501,2214,7077,43979,6189,20305,24712,24586,12937,24363,2698,8908,5993,37079,15407,32571,9982,9470,15580,5791,16481,13402,16364,11164,43493,4816,20224,15100,1996,15273,12695,34196,4254,4056,8162,29114,1673,33710,34257,14704,14347,5216,3396,3969,43666,43210,43200,4248,5169,23092,4807,24781,9873,3445,10977,9405,17323,21303,17561,8310,8366,12329,4729,15490,11108,3529,22312,4855,13784,31474,6850,11362,9200,1807,4564,7200,788,12854,1595,1571,1424,1595,4714,7924,12641,29288,38480,5399,4306,43606,6451,1162,2674,28517,44010,42875,35351,8657,1914,5502,1406,30120,3350,4107,4050,5806,13978,19289,12057,21242,12041,29245,4850,11418,979,34257,13173,24087,30911,35692,6123,7790,2895,25532,19729,33660,13918,35910,41392,8296,5407,40390,10901,26730,19047,5718,5753,6596,8942,5446,19415,5884,20944,6177,27057,8351,5781,1477,1306,5312,1883,14793,2921,9136,26883,1547,14655,3795,972,26085,21459,9702,23816,24915,31447,6596,32800,24499,818,14163,16366,11357,3327,16484,27321,42060,39208,28374,41198,42755,43269,30721,41882,37930,1941,4311,9000,39793,22058,27188,1146,986,35192,1435,16476,25016,8322,1696,13035,10673,44474,35867,6058,4313,12760,10831,6102,44470,32195,27114,5158,44486,38538,1090,983,44478,44481,9128,15222,44500,1700,16094,34075,26155,2821,44488,44471,36985,8728,4880,15792,43344,10197,21503,15535,3094,11467,9589,24392,29391,3682,9703,11741,25253,37403,17334,21710,6193,17959,1214,3701,41652,22331,3020,11244,8079,26621,37217,11690,11583,6451,1453,21672,29706,9391,2487,13553,12243,21153,7437,6735,9574,22157,12614,1374,8350,4760,37436,10551,1107,44408,15752,2062,7722,38648,16815,16572,39549,13085,20364,16135,30944,13184,6805,5797,8109,19297,13540,4047,5856,33980,14245,39955,38631,990,3354,32630,1972,28696,6511,10170,24826,3846,20898,31728,17292,39967,38074,16609,23372,3730,12025,7748,22391,25920,44502,10106,4723,9707,4108,35142,14345,29348,794,3843,8901,33999,6395,6380,32040,41723,2107,1511,21317,27829,44435,9608,11893,10683,11443,8639,35789,11390,13427,1444,39785,4067,1229,1114,3684,9608,19732,32432,6922,16465,6255,44648,1444,35985,43351,27707,1084,26150,2858,6778,32410,31830,9287,12744,2094,30253,23240,3394,1109,28943,43486,40374,43752,28186,16909,15784,14839,1001,10650,1572,26921,4445,1006,31921,28679,19798,27732,11863,10694,9349,4328,12087,7333,23363,37888,2981,5325,2391,17710,9721,1858,17641,5396,10963,4126,16063,8577,27886,42429,1449,41870,2504,38142,4341,37499,29428,6996,28597,43267,42873,35297,16120,6340,35814,1329,15785,8617,25820,3103,36809,26860,1765,10287,18122,12854,27045,24514,5201,5844,16749,30680,2614,7993,23627,31564,7019,26150,15890,3375,44388,4708,36312,42258,41398,43751,42133,41401,12122,1774,1453,7653,12701,42303,2317,17519,44104,43467,13051,5703,44733,17589,22785,2501,9377,25018,37178,2085,24222,28928,2122,15329,10974,1283,6062,8818,28245,6489,15329,36786,44783,43788,30192,6513,8687,27794,31147,41454,8149,12148,28017,22966,43084,4017,1853,2456,1587,9186,2177,6924,20742,24342,22938,25466,6076,7241,6606,1682,3238,1889,37749,3719,5985,2674,9475,28696,43861,958,1478,27939,44822,25470,37637,44543,18107,21553,31949,5586,37888,2137,19307,13201,4984,37094,44636,1820,10980,8641,33744,21472,21283,30490,22981,14799,21692,39869,320,3186,1672,10448,1359,4510,14866,11863,36743,1433,31047,29544,31335,10217,14731,7100,25913,44102,10209,5366,26890,18909,25846,30613,11804,17129,12068,12417,16571,6030,11874,25418,21466,14921,1471,27345,9519,1163,13136,7787,25981,1314,25985,36747,1561,25705,25872,8023,8057,37113,3203,1267,36956,44766,24844,10850,8659,43067,43951,5759,8467,3216,20090,43313,41365,835,14303,1178,18078,11736,18548,24798,20550,13984,1408,24570,3430,26917,27766,14543,10590,5370,5287,13385,35811,4017,5308,987,12374,36870,12760,10574,9615,7768,2440,26999,20841,5153,945,6139,34326,7106,2597,13534,17442,35261,5337,44917,27576,9588,2307,21020,13303,9395,16135,37749,36872,4054,5134,11331,5420,44013,8603,10287,15068,14686,4646,16135,9268,25479,19066,4303,44951,2120,38310,30538,44400,8845,7889,28450,36794,27126,1932,2035,5134,3554,22687,1723,1793,39990,16589,3057,31314,21185,28991,24124,16666,34299,5841,1086,29949,11788,9049,1129,5008,43161,18967,13116,2386,20882,11358,42898,9103,26405,19675,16771,37732,11732,2276,33949,3321,5815,16080,43606,5952,28537,42738,29265,18610,17711,11392,41733,23754,33304,15999,28994,6609,3830,12760,2023,5668,30940,44564,16501,12606,1646,44500,5882,36196,21467,9350,1986,14796,8230,1788,4489,6700,14450,13031,14119,44195,17539,15100,10418,12994,24600,1776,14168,14346,8422,39730,6206,11822,8307,39704,15707,1177,20028,14078,11633,19422,15183,5826,1855,34920,9537,22649,5366,8329,30158,29645,43595,38284,11478,28044,44688,10650,15965,9599,3190,17379,11836,3992,14674,6150,1511,28051,1478,1511,13344,34149,2448,10984,5782,17545,45020,987,3119,12103,45023,23787,15652,15100,2431,5675,27750,838,12346,2088,39196,1796,15628,43500,6747,13770,788,18078,3554,5337,36042,3435,37054,9777,27703,10659,37065,31320,20218,12704,12704,10135,36662,1437,25082,2121,36849,1343,14982,4233,3946,25472,4986,8462,27029,1916,6662,14090,44169,42690,44171,44003,41187,43260,43480,29473,23197,42650,42559,39244,43266,42131,40773,38960,42134,11399,4426,15345,13038,1574,15406,38383,10759,35846,1783,25759,1799,2990,7107,31036,44973,2366,3355,3870,20216,5335,38388,4392,24135,2309,23993,955,13950,10810,20514,25083,12693,3699,6044,2355,1175,13447,5335,45235,18957,1998,2182,26186,3031,5396,26186,22673,11249,6507,5201,1734,11236,3837,13471,1810,3200,25410,45245,20734,20965,3876,2027,25122,14036,1359,7748,40954,2095,23306,16662,5687,20447,8659,33720,20371,13979,28770,19315,30160,43510,44375,6064,2848,922,20051,4334,31310,12267,39703,19617,19539,3412,3656,7413,26031,3467,2448,3697,20862,13179,8359,16344,23500,1831,5148,1397,6975,6451,26573,1132,6119,25115,6804,7043,1779,20945,17320,3465,19838,17322,2587,840,27519,2121,3745,4671,6351,11244,11171,3643,511,44025,36546,13770,4096,3248,12338,19254,1663,13694,43964,8837,30857,39099,1731,15285,41741,11572,8259,1277,44500,4050,15745,4558,20862,28133,6989,1312,20976,25227,32807,19232,3721,15735,4699,4700,12306,14421,25054,8764,11819,11028,5526,27473,2134,8819,37240,28133,4103,528,27677,24099,32807,3972,9475,22055,4082,1306,19707,3747,1993,1057,1709,15490,16434,7251,25582,4731,33963,3926,9793,32497,5768,36812,12694,44870,15285,12736,30046,24572,38818,10126,8369,5002,3422,36729,21710,32651,3848,2053,40694,44351,35609,4014,3701,31466,21919,3736,45314,5864,11850,26730,13179,8807,7613,902,1596,37055,21185,21367,25490,45109,20441,3539,19237,35994,2736,44765,28517,45216,28988,3870,1914,45297,1113,22786,39816,3989,16418,39854,21569,8757,35174,10339,25083,23305,994,4055,8467,33749,13585,14730,23363,574,27786,4926,3683,39367,45196,42802,42079,19218,33457,9987,40119,33970,27035,7320,23017,36829,428,23624,22172,21583,4444,43290,1967,7319,11285,15927,616,25775,8817,6659,13831,6489,5630,11532,11306,23626,15736,22349,6446,2205,3103,36834,1466,18747,17522,29020,6771,6840,10661,4883,1984,21791,27755,28056,20286,2122,45491,3079,33990,40319,5181,30667,40418,11727,12235,14282,21815,26938,6231,6039,22276,25903,36874,42709,954,30940,6901,1309,44528,4827,28564,44001,2036,33593,22681,14698,12388,38185,4700,4599,16020,1520,8101,35938,14221,41934,10900,1007,8774,38631,30818,29282,6015,20448,37274,27714,4028,1438,29184,1796,41314,20881,3643,4524,27728,39986,15522,9331,5653,6414,22203,24932,7740,4477,12704,4305,37588,22541,25775,1193,8341,5757,3381,8448,3812,8228,2343,45183,42480,25150,42744,44173,43478,25565,44176,43262,44178,29476,43890,22904,44380,19881,12181,42264,30953,5161,42267,19563,14270,37527,8749,9463,33906,42249,10636,39702,6382,14840,20310,11225,16150,6233,42268,31339,20990,17641,31478,18838,42290,21912,37740,4631,42342,8447,25545,1298,38637,33507,1949,13227,4054,42303,2501,42305,27118,11270,42308,4193,5763,5757,42312,39947,42315,29189,14469,528,42319,45677,29603,9502,28443,25813,21615,8105,42327,1714,9709,1412,42331,45664,11692,39530,37657,29396,31274,7501,42339,2530,42341,11993,19723,2110,2811,41968,26040,1480,1178,11553,5113,21235,14889,4867,26725,2997,1515,43605,1571,5547,4712,5401,37047,27691,24581,3676,29761,26101,2540,2435,35189,14347,3783,7732,13280,21586,4932,2821,4516,28242,42092,27904,25013,14889,11553,12106,4804,32963,6376,7211,20040,2150,3795,10048,10679,8460,13731,3538,7211,887,45755,45752,4508,12234,890,40581,30570,41392,4869,26871,1577,10850,13587,25857,428,1121,8839,3351,2191,6998,6929,13193,1492,1392,28417,43188,902,13641,25409,45788,10161,6913,15639,919,5285,9641,29421,4250,8879,8829,13664,4824,9463,20650,9343,1662,28695,12745,9969,28981,32113,1022,11746,23256,32113,29331,9399,21923,6831,44207,31368,25878,15767,23757,20919,11273,9739,9235,44819,33892,31654,1449,40177,44671,40879,44756,41919,2565,2122,44790,12922,13773,9289,21877,2677,13131,36711,1119,20998,16900,25614,4574,40255,8310,21923,3466,24316,19576,21556,34878,2817,907,1584,43188,39434,32874,16682,10648,27455,5918,4134,37296,14587,8806,24499,5330,3269,16704,30044,31220,13951,24407,15716,3370,11423,20533,15716,19678,11842,16738,45890,4700,40102,43774,24932,45883,37427,30535,24879,13048,7104,28357,14290,23367,4998,10422,30779,31056,35373,16378,28736,4706,12504,8898,4712,37073,5078,9049,18067,9535,2070,45907,9316,44923,35165,19707,27970,15387,21153,26114,30830,1247,14044,27940,28244,15535,7043,13140,4477,24168,20596,35405,45933,35399,12338,12148,2917,17559,29748,10608,45931,42257,21427,36314,43487,34738,39655,18648,26899,43888,45621,44180,25558,43892,43354,43124,45614,42852,25154,43479,45618,43481,45191,37997,480,18050,31722,20044,8419,43950,2810,2060,22427,16945,2811,45986,45984,13294,17835,1916,17528,43549,1892,2803,45980,45994,45982,10115,45987,20047,46000,17741,1683,45990,45624,17117,5306,24020,25049,8351,36937,1853,9399,2102,5897,26979,10021,1449,20520,2484,45476,7253,19708,6077,1054,19241,7582,18610,30921,19010,43757,41675,8158,41677,40425,42949,40431,43879,19753,43881,44182,42801,43884,42803,26793,15562,2997,19761,10034,31860,1154,13435,11837,5561,20340,10299,42309,44479,14138,23032,2611,24936,10191,18641,2814,29917,4656,13459,38818,3408,2444,2988,2278,3466,33528,7761,26679,6137,1782,35571,1548,43070,8689,1339,16528,6156,956,17999,20401,5827,27020,14048,29589,21546,4965,7513,38132,31396,25823,11503,43082,3491,1593,1175,12197,44510,3710,16553,45390,5242,1013,16522,2545,44955,2074,3042,21202,10457,31071,14336,16731,46050,12261,45672,3739,10932,1526,3803,2900,24392,32007,14607,2212,29921,13496,34986,13290,14234,4213,16594,30292,3399,36888,5963,20416,32184,15027,8641,28420,43371,20290,12204,25515,1305,43284,4667,5830,5013,25476,20140,10199,31127,32798,32026,2112,30295,21303,4865,12902,24610,3221,12618,17322,45152,16125,12487,4430,3682,26023,23179,31296,29942,29110,36708,36009,9708,9615,23994,6137,19710,1972,14093,45933,10426,12259,13528,10185,37175,43766,15084,25414,6241,9036,1314,13505,40100,3381,30272,1489,16895,1439,14409,2420,24349,10994,33787,21406,45247,16052,14039,15023,11738,3460,27993,18641,26562,1514,13312,8442,9619,3537,7501,5844,35805,13893,3316,6156,33600,45835,41917,45837,40599,18907,32497,33538,3439,27208,2452,19587,23367,12781,2680,10648,19622,29753,6772,3089,37097,37890,10492,11554,10595,5850,38222,35095,11543,40458,5901,28545,22974,30196,1579,13035,2664,3732,14027,37223,3102,14847,28262,23931,40195,24163,39137,24940,4491,32844,4311,9703,18707,26595,1788,17337,5405,12822,4349,17442,20479,3482,1787,2507,9446,21321,3807,13501,1840,33789,35240,6828,34175,2062,24334,43313,8838,4457,39125,5607,14998,12707,10994,11796,6594,16594,30998,26108,8896,1887,6738,8764,14655,1901,15070,41846,5985,11039,20801,17520,22461,7970,26835,21662,1404,45331,26080,12215,3076,25433,6655,18141,7795,4832,32556,3519,5629,3929,8315,13493,8329,23099,21256,14240,31452,35028,5822,29521,3355,35644,8444,7182,5016,32820,28787,12049,29702,15474,9058,19843,8124,1931,13575,15051,35868,45472,6501,30302,19653,1505,28471,5191,4238,1448,27905,43730,9573,4591,12021,13829,3015,4391,11900,1576,8265,10124,41593,43353,29464,42500,43125,44004,43173,18698,42697,42488,44008,42558,43132,25395,46240,42260,46242,27963,8810,9054,1116,34071,8996,37534,3415,10638,10185,13478,43923,7064,16897,14511,45098,43351,13634,1659,12337,2743,45435,6646,6402,21244,25488,23684,13049,5234,1470,28814,37278,5664,14488,33954,7937,5774,18587,8443,8678,14855,4043,2209,13424,4107,20491,42815,28009,1267,35377,1574,13903,35461,6004,19658,27159,10036,5189,27067,14410,46371,39432,43137,23632,16413,14266,5217,3989,39680,2194,45997,21607,33693,19421,31687,15096,23280,32040,4269,23666,45230,10841,9248,4028,1281,8336,3365,17008,14554,3658,23982,3349,6599,17274,1594,8883,20523,1552,1007,28424,30713,1124,27126,2137,10525,23236,34962,6655,23231,5846,16820,9147,19919,3020,14447,4050,27009,16796,41585,41594,43254,41291,41581,44172,45969,25564,23280,43261,45973,41605,45192,46417,42653,43882,42655,46044,45480,35298,28720,2957,16170,4662,17128,4523,35989,17029,46566,45146,38138,19287,22035,29413,979,26729,5036,19278,9241,9509,9280,9905,45209,9730,12892,1765,9390,3092,2860,2317,2766,43103,9167,1505,46592,6920,38008,43590,11553,11479,4495,31289,29536,17516,9501,15245,6034,15829,3706,1336,13030,31128,9155,27319,3682,5162,36853,9182,18707,13040,45114,24729,19497,9615,9808,12613,8317,18121,12021,34305,14147,29912,4341,43767,25998,40142,43331,17099,1361,11491,9123,5423,10160,24599,7502,8988,11889,15512,1198,2137,12387,15299,1099,38478,16900,4482,24105,24183,25875,2238,42016,929,20512,3840,45029,3606,903,1113,1552,3690,16764,13793,32117,29595,44286,2702,38205,22777,10052,918,16328,18554,5429,46675,45953,22139,44183,42132,44185,41039,32563,4883,7560,4515,15050,37446,34902,16081,46696,21577,46697,24406,2142,36519,45173,1528,10457,16662,3371,20106,12118,15700,6747,33708,9162,46710,1539,16050,11837,44358,2140,1528,13001,26334,6606,3400,34891,34827,1277,4495,34386,42430,21557,17015,42571,44474,30251,17737,24077,3725,46731,14157,24077,4347,26751,16027,1887,1109,45282,35226,22035,4814,17537,1134,4059,18502,4055,2778,22909,35348,11440,46744,17737,1304,2692,6436,16327,25051,24589,46729,43852,4321,45531,6818,1447,11513,1980,37047,11899,35811,8619,26828,16105,7933,46679,1599,6811,902,5330,44992,30256,21200,28813,22286,10525,13559,6242,3462,3862,36293,6701,4831,9751,10285,5558,38618,9713,15391,4628,14690,924,3750,27781,32774,12775,17151,16147,44947,23307,11726,34103,11389,1448,23245,18707,6926,6991,32229,3870,10901,39990,46758,3953,23785,34826,27738,46775,46763,7223,33538,46760,2680,23684,46082,2730,3943,1518,46729,35733,46419,44755,46688,39460,3350,9691,4488,10004,21259,21892,2854,25901,14800,9424,9672,19534,4564,8228,20735,11620,13496,13848,24336,20456,29375,26091,1275,9830,6017,1438,22657,1520,24941,15033,21528,34286,28545,17353,3554,14717,9128,9391,4349,15927,25929,6910,9136,34276,1524,1433,3200,46777,34062,11047,1516,9579,10232,17129,32852,20306,46699,14392,1405,23235,17469,6029,39670,9960,16995,3019,28715,46324,35374,6442,34052,16700,37055,17040,33578,8470,15947,20973,17072,33886,40789,20863,1409,37113,15023,15117,33852,16556,34148,7041,13441,2249,24739,16573,16361,4070,3321,12004,16538,39580,1779,3191,25414,16904,11122,5176,20841,6701,14499,4855,7782,31496,1826,36903,33910,40198,18143,5643,14734,13459,17455,11478,10024,5694,10643,31261,45661,5801,45004,1711,11464,5026,1005,2850,19088,46427,9518,16559,40100,20282,18913,13524,7055,4993,24599,11352,13155,11960,24506,5538,3228,14438,12128,35932,2792,1332,46458,43308,8605,9961,3790,9682,24905,13064,13893,17311,11582,9247,9391,12132,14784,26735,14901,20088,27788,8341,5775,13484,13214,14439,25942,12704,27944,12816,16474,25987,14989,12789,24373,14969,12250,6502,1243,4799,4825,46699,13916,14660,16537,14558,3037,1528,3739,16488,4116,6866,11299,7392,22252,41782,8424,17518,17411,8222,12020,23493,4356,33591,24908,25650,3837,2910,36720,34920,41366,13149,14872,1239,17789,16975,6719,14499,4816,2127,29566,8942,11362,14302,7059,20807,13197,12607,3248,13123,24400,2937,43771,20316,9403,1396,4356,41388,21608,21590,37148,9166,33779,25645,14872,15175,25937,43441,3805,14553,15168,3157,33591,4996,32878,4667,14635,20858,9474,17881,2056,24307,21706,4024,5405,3930,4589,1971,6489,35179,3358,14691,5914,28666,32820,37091,14036,46054,12480,1731,29414,5530,21465,17494,27759,16599,34167,1658,21674,46133,2582,14938,47133,12168,14668,6145,6379,29029,13177,1791,21530,2494,46327,6532,35021,4337,12857,9537,9289,8130,1229,4649,24296,9469,21020,21804,15752,8322,28911,45605,11582,1726,27599,20973,43865,16577,10530,3667,16649,11270,9605,13503,1814,14485,32851,13922,6911,5823,40021,15720,35868,6830,9046,10197,6710,3492,36508,37344,44303,9710,17561,3490,1135,24055,40167,9588,1811,11024,33548,6599,4217,4648,14793,5959,39556,33295,5538,47211,19622,9521,11171,4240,5695,13187,46273,5218,42942,18357,1649,11352,3443,14587,34273,20045,15762,9036,47219,14813,5029,44303,36006,12391,38744,911,8705,38146,29611,7356,15121,2600,30882,6026,17338,5174,1156,4637,2590,26054,15032,36699,5948,24889,14850,45174,12077,19766,1160,33582,14704,9942,6973,2291,9123,43831,4024,24504,43502,8630,1179,16469,6510,4141,11465,33833,6868,45573,6772,958,19322,31638,1673,14892,3360,5244,13441,23915,13524,3037,25797,15165,13064,2850,34166,4038,15172,12022,2661,12411,26059,14881,9043,14428,5538,15028,9404,10609,33847,5430,20852,17477,9394,42416,19843,5265,25499,11642,43503,20941,34281,25968,46494,15275,12000,29551,1251,39272,6843,46087,39790,4658,22090,21256,3941,39504,12783,15913,29761,30676,41821,13864,21605,13829,3680,37026,27809,11291,6969,24392,8687,1038,37026,17388,13042,11988,16390,44453,34272,15552,12245,14271,18144,25824,8099,984,7299,35646,17384,1125,4254,14932,47105,13827,34311,20646,4388,5581,10232,33505,13534,11717,25774,5826,10204,2110,9161,35099,7063,26991,32867,1350,45647,7731,29489,6397,12902,26751,15722,7986,34920,1508,1090,24322,41966,21564,33514,11703,12272,15300,8797,14200,1775,7081,24802,9645,47183,3700,6870,39988,46809,27680,16570,1703,33294,27154,14199,22676,20311,3192,1333,3511,7175,35661,12918,14240,15126,37178,25309,5180,46324,8944,8299,10216,35061,3840,12691,14568,14060,15022,23563,3355,12021,5571,28722,8229,19235,5782,5853,1465,43018,13116,1448,11075,5161,4443,3171,29722,44529,9511,9511,19783,2321,7086,3037,15700,15231,29083,5251,43821,13172,15088,31568,4855,1148,13779,27035,3017,19303,13282,3050,45683,14910,26651,32733,32670,28720,11888,30480,15650,17454,1579,8938,20734,2091,43058,21805,14753,13202,1348,36650,12677,2221,12346,11823,2770,21267,24059,7652,37118,25914,5246,20999,47547,25879,39946,8451,11808,1273,44327,46774,2587,12170,15580,9289,3751,940,34286,9643,1560,8678,13428,33686,5118,42153,17293,1705,9604,22256,13577,28695,35025,30273,24407,27584,5816,37651,8747,24486,43948,16672,15086,25536,11823,32797,42279,19338,15244,15753,39825,13267,28752,42341,9361,2854,40581,17481,47245,21762,29403,38138,31850,24092,14410,8447,24297,38319,19225,12215,9958,1896,12016,15248,17508,4476,44705,13038,24743,25459,14877,37189,7739,20903,2291,22108,1067,11417,3089,39865,30972,26032,44268,30175,37493,7727,11571,30205,30964,9537,1713,1125,16691,19396,3540,2050,16607,14200,12817,25865,16672,1354,46075,1300,46986,6123,14493,5305,5841,1494,11461,8452,13071,9345,12164,18922,27032,11798,1334,4826,5664,15960,35832,8829,12263,45492,26638,1801,29761,15100,32877,5286,7548,37290,16190,3077,8652,7313,30493,3103,21301,13413,2696,45736,4884,946,20728,3219,13476,8363,25807,24895,26675,36777,7119,14027,3529,21084,1280,1901,16501,45815,4649,39806,16791,14447,31330,19100,3812,15559,14462,990,12065,1844,6530,15131,34232,7554,4394,12794,3480,5738,2048,37555,13667,5718,37167,44982,44643,14520,1066,21648,47055,16486,6538,35916,25247,1413,43537,40174,20327,11698,16529,31035,9302,2059,6347,19307,32406,4055,46030,21273,42789,41541,40426,42792,41544,42595,41680,43878,8284,42619,28738,42971,38958,41037,43885,39120,3384,16933,43951,7074,47086,8377,7092,1005,33662,44476,16795,35838,27735,13425,3423,11274,21607,46700,11454,47365,3329,5797,6119,8228,5749,45174,11884,14698,3747,28077,11834,30872,8518,12090,32875,6499,45096,12742,7092,44912,4230,3364,19591,9136,6594,28696,43854,20364,19624,3705,32878,10215,45078,34274,13296,12244,7119,1887,3433,6227,33675,39737,44555,36522,1520,46088,30258,32406,13380,28727,37162,45080,25030,35000,11090,35935,36840,2774,17965,2501,44330,24713,949,15234,21466,1551,34030,35662,43731,16054,45437,2846,43861,2122,5752,28038,14034,5909,29443,13661,5265,4401,6177,43566,9247,9349,15624,16625,40101,18081,15685,17814,15616,25595,29184,45355,4511,25945,8639,14133,17739,2940,39563,1328,2793,2936,2795,29551,43913,2027,47900,18051,24857,4511,45377,10599,1884,28845,8707,28843,2729,885,10673,25105,15094,17741,4595,29535,2807,4518,2945,8442,2947,1337,2815,22909,18846,10167,393,1770,3265,46239,47777,39117,43268,43034,23484,14082,5072,4481,2485,18922,24479,25231,5167,4059,21348,7725,8886,17323,6716,24079,21761,11224,2194,23088,25345,5017,39295,20833,13205,2709,4108,22276,27059,15916,17015,42438,17763,47951,46935,3837,7779,25231,1158,29245,2586,44921,38394,5150,37994,41976,12424,5752,14309,3659,1093,15921,12036,25026,27050,5197,8952,12250,5720,3712,2081,47648,15537,1053,6833,15245,30981,23248,35593,10647,48016,44265,4976,47595,25227,8742,2128,16018,44361,38231,5825,21856,13227,8905,22313,19923,12102,1472,12985,43252,3406,10984,3987,11089,8645,4725,6862,34672,20304,23488,20647,15606,26361,13945,29063,3015,23423,32324,10525,44329,2765,1656,25099,44719,43033,44721,20432,12159,21344,36910,37945,26468,18985,26491,19987,29068,30730,14077,36076,30003,23931,3783,23499,30736,19978,48070,36104,42275,19989,26462,48075,36120,17459,38275,41990,39435,24963,42038,41755,41947,24968,40542,46555,42972,47779,46045,41090,3384,42430,17710,4725,5075,7626,25913,9351,32837,44885,12004,11076,3372,3442,25255,4887,38544,10112,5239,4191,21458,12925,1285,3060,12251,46185,4179,40074,6238,34835,8619,8820,1780,24563,22192,10566,7753,9815,13386,43755,42609,19359,42591,46034,42593,46036,43744,17508,41486,42599,41684,47944,41036,40988,48103,16298,2997,17302,41220,3001,1341,21856,33609,36829,35079,25274,17074,20418,23157,7214,11480,2062,2062,16430,34152,13280,27728,3096,11438,28752,11677,11889,11705,14742,11380,3013,5884,5104,9162,21555,8597,1859,16809,47822,3541,5822,43437,27187,11236,9004,9126,47820,8361,33805,13505,11708,34150,12968,8228,37370,17163,3688,11509,43795,16057,37114,30980,47232,14844,47166,28970,3849,13585,18491,27118,32852,38135,16047,19296,43974,10602,15295,30571,47134,42093,35319,5797,6222,25648,45314,29413,44411,23020,10222,1539,7179,44959,23991,9685,2040,15092,1858,11298,1849,43243,10139,32721,5581,13387,6250,906,12035,24384,33609,24828,37219,20305,45092,6785,4521,1904,14321,13119,4749,31502,46517,34250,3987,5884,25635,10370,28719,14569,1688,14696,22256,5591,7794,9424,17736,1789,8341,6434,31053,1729,47416,11427,36506,13776,9614,9139,17333,1898,38131,24801,36514,7730,21589,14254,24828,34285,37220,39825,2113,16911,37071,3974,25985,12781,1131,44471,16057,27691,19230,2076,37071,1784,9255,3099,33575,11555,25632,31180,43336,1445,14130,47825,27733,21303,13557,16796,3353,29555,2051,12678,43772,1140,4141,12162,33545,1245,25929,989,10228,1654,27225,15519,1189,44305,38319,38478,28053,1842,9510,46606,9315,2324,6825,9385,10005,2501,7564,21522,9265,29524,46313,31239,3655,29458,39869,5414,31655,7021,2084,46869,24410,16538,47580,7469,39641,33989,14027,44835,5870,4799,5821,15023,1567,16900,32728,2197,47066,2022,40100,9588,1652,35886,42342,21917,10525,7936,2910,1593,29912,19297,30830,20801,3069,4443,8386,26610,30687,19402,2187,10491,31856,18844,9721,8811,3681,40100,13835,7950,25055,16998,39764,4494,13044,5166,33769,8440,3087,3349,21661,13494,6148,9193,7645,3655,25759,14033,32053,1489,38041,10932,5718,21399,27117,8845,13135,14671,13155,15094,12797,16895,36728,3014,1258,5745,21890,9139,12913,14587,15762,39331,26049,46798,34167,1429,5716,12771,42734,39597,29534,30272,12145,20329,39622,17524,24163,11733,11709,12360,9590,47225,10697,10449,43723,11569,37174,5191,4689,32894,1731,40065,35359,39587,46481,27945,2099,35571,16536,8431,16819,24392,2077,6885,12085,9178,16471,1244,5366,2040,2728,23262,4728,1099,4998,8319,10075,11333,44544,9372,21499,3790,14948,46371,3714,33910,20961,5405,8977,33774,46071,15251,28737,2324,31090,5773,24782,28961,11136,8023,1811,15950,13555,1858,5663,26023,4656,7525,19586,838,31562,10936,4630,19389,29403,3034,6988,11219,3115,1509,11717,1090,20859,2622,29891,20449,1064,19490,29427,1397,8151,33568,24061,16685,2535,5698,14489,7224,17449,19657,2084,1548,24719,16848,11362,13282,12181,19577,46006,47948,3526,2997,2918,5261,21708,1691,6001,20590,4871,5501,38859,6710,37091,4873,1246,1401,14566,40468,25579,1401,13277,1686,7795,3031,16416,26967,11207,24249,48413,2201,14489,17485,1903,4993,15642,47236,47632,39787,4448,31491,20753,43979,31003,16911,1234,5430,32157,4558,7573,21642,6204,1178,37741,20371,44386,5797,13496,3013,39374,29034,31646,19282,10057,38539,3012,2877,6248,17859,4479,44462,45955,44672,46421,28186,1465,16381,10188,3009,26630,3486,20373,46079,5538,4053,30590,37151,5830,14483,36827,48035,36899,13848,46220,10550,1070,9520,13585,2512,6668,11791,2237,2895,43695,29079,1247,41963,28734,1252,16608,1984,3939,39924,2048,47876,10263,43554,14462,14575,6920,3604,11041,3379,14985,30988,1078,35121,44290,46612,14803,31716,29908,3537,21199,28791,15170,45696,18921,48689,12050,10033,4323,11863,33327,29761,33820,17145,5935,20329,24354,2867,43984,27717,31002,5138,21010,30194,1660,48130,33628,34272,1720,33726,45320,21608,47577,5089,5261,11462,3945,14042,6381,2985,3026,21877,35632,46314,26802,3493,1187,1350,12481,11651,2600,34847,23977,19667,7094,14394,19296,3189,24487,15622,14245,43865,19412,27897,43860,48768,24434,42560,21262,48329,34921,9270,48500,7484,47179,10537,20741,2071,24179,1984,35021,35663,1580,16800,14557,46886,43556,13189,13860,44024,15698,1333,13786,28501,9511,47651,2149,3790,34198,16930,2127,528,25244,21156,11874,5857,10371,17330,19084,31523,10374,9618,14493,48701,47145,4165,6637,21288,11209,3399,40138,1433,1774,12006,2670,30276,5579,6973,15730,12709,16132,8780,48606,12631,1820,10023,4561,6305,22108,26648,9125,34229,34251,39506,38033,24467,28170,44710,3124,4409,17559,48802,16159,43426,1489,24329,28229,28673,16248,43075,36027,2183,16327,43788,2230,48897,20386,6150,1306,48901,21244,48908,32488,11487,30088,36638,32488,41954,9283,7249,12228,6123,10011,2671,2208,11455,13131,26647,20954,8431,4404,39086,9590,39428,43212,37403,41641,12611,27145,970,46638,14267,8687,10489,9965,3028,19923,8583,33653,12788,1105,47898,2436,3052,4138,45396,11633,10924,9662,47428,30200,6755,5159,19287,9427,3609,15506,20344,17106,10005,1653,14480,5642,37089,39952,15256,11736,5699,6124,17317,16104,20841,20356,19383,17561,16392,12701,47410,14511,40034,29892,16696,4086,7750,30577,21421,48186,37368,13128,1140,46477,4450,11340,7653,25423,5847,15561,25454,16366,21662,7921,4434,11436,31191,940,14101,32464,28053,1326,15097,40080,1687,36196,14848,9024,15189,3254,15490,2493,9058,10932,25592,9530,29343,13344,5822,1477,45611,43255,41292,46545,42551,41601,46412,43175,45974,43177,41607,45623,48061,42514,48063,28379,29592,4091,24033,15587,33273,45092,1099,15199,1889,46631,6530,22718,30846,28873,15064,10522,43614,42153,43618,47612,46561,38007,16907,1539,47380,9259,17124,3420,1243,10902,45172,2988,48335,27754,49069,25996,5307,1957,3025,14266,32760,43400,5521,1465,49079,11086,8599,5544,20339,44906,33584,46575,17475,1193,9964,5647,8517,8057,11937,3739,48233,6141,14239,26730,27993,24890,8640,959,6009,4866,19407,29105,14259,26679,49109,36519,16907,49112,2064,6141,10370,48007,13012,14486,24210,49074,19128,31086,5663,1442,47064,16851,1334,21666,3643,6506,44623,20618,45431,6996,33592,24036,7003,12925,25290,19224,25025,2957,43614,7811,3433,30216,3847,7921,26875,14051,6040,14553,47457,45080,11105,20312,37603,2670,24923,9961,794,43536,44404,8815,28505,10085,4598,39926,2519,14402,21603,5366,2635,47950,8127,31140,9407,1172,4709,41998,38077,31671,7244,9637,4140,45466,533,39389,3403,1243,5816,46053,1844,46351,23100,43365,968,4663,19178,25270,11837,11274,8593,3681,36743,12491,4083,8029,5241,17262,1544,46190,7037,26805,8006,1236,13290,14556,4067,1154,3679,13844,31935,37419,12704,1780,43502,1324,14969,22252,3526,34281,1062,1182,22278,12325,35248,14048,842,29723,13417,6135,49229,34941,49215,3779,49233,1243,49235,38321,16415,460,14943,14538,20857,10697,1161,3420,1330,16831,21591,34221,30164,1504,10894,49244,3614,8886,1178,7924,2772,9268,23511,22798,23232,34919,27728,31502,15563,3556,7849,46887,40034,2149,16177,24368,14772,1682,11132,27140,6734,27675,42937,17004,39901,3734,33522,43331,5825,10270,7789,2134,3823,11330,16702,28460,46088,13278,29098,32053,3141,7413,15604,30922,8062,11345,31471,24131,3402,6295,22188,33907,9015,19285,1437,12780,3734,29560,29675,28886,940,28759,5668,28778,28882,28777,28766,29676,40253,28772,28764,11654,28891,28768,29689,29693,29693,16767,16927,28766,29698,16772,28780,32021,4232,11830,1246,2598,8249,26705,4560,15612,29524,1444,16826,25597,15025,49380,38936,49032,39717,7072,49382,7091,28043,49032,49378,3952,14096,1248,49397,39641,17813,25189,20311,49389,19625,48872,4288,47519,10853,21436,15790,21130,1309,4049,1986,2051,11711,43393,48436,46071,4075,11126,14343,26679,1765,7154,3314,43538,24460,16157,20523,25288,20990,23430,2110,42291,9327,8444,34005,9550,16585,4356,7974,15847,17397,16702,14044,4932,10693,5571,3415,4688,43851,23223,6602,27585,10187,36964,11242,15559,25903,45834,48156,44464,42910,49051,12631,11222,1571,29089,5030,1438,11941,1779,3415,12214,21400,818,4210,4250,46878,45341,43113,15190,48393,16096,27085,16965,14842,2022,7970,10395,7158,31320,44260,11438,3042,47059,8057,2892,22623,31472,44561,36267,17024,14191,22071,25571,11722,48346,15529,1856,16610,33773,39735,1610,9032,3498,1450,6149,3714,8583,10011,16975,43686,22972,27900,31315,13980,318,39432,8896,42721,44322,25429,15752,37115,9012,44328,6241,46936,27528,4807,1844,44580,19919,44337,22976,31484,3044,30670,45317,1310,44345,1097,44347,3666,44565,19675,15647,20381,26889,4558,9174,43078,783,16342,15002,26154,1610,2748,47448,9495,39001,21896,36813,24712,1759,1598,10927,44286,12070,39952,24717,6181,4492,44293,24124,5086,44296,13893,14031,40021,31210,44623,48270,3472,18745,44306,38684,20496,6748,5591,44311,2958,45177,13532,27330,35594,38562,11034,11258,26725,45374,887,3683,4099,4425,6137,9103,34103,35359,19263,4104,3355,15441,23684,46081,12991,5033,48010,44270,25534,44265,6305,47850,5030,44192,12049,4764,2932,8679,18907,44198,4820,47632,46605,25781,22241,6776,44206,13256,21512,17955,26089,48861,13847,38546,48724,12938,28254,44218,38692,45995,36862,2293,2729,44224,1510,44226,7933,4234,37099,13486,47231,33063,4047,21567,11447,4392,38922,26835,9180,30183,44272,44243,13030,13012,49572,38687,30963,17926,12503,4041,22185,38478,28345,1122,2281,38132,20011,16586,10093,1733,13074,43839,38677,6041,5652,15380,12260,40046,48861,9698,12046,15753,15977,19308,6234,11860,34000,10093,46303,1461,21770,11910,25425,43917,14029,32810,2774,11912,10516,20158,27035,25648,1197,15654,28818,9957,20862,46952,44454,25496,29056,20926,5145,9221,1675,13093,8438,24482,8653,30164,8840,29056,8460,11805,47005,16908,15111,47706,10640,49609,4200,5564,13864,3370,15811,24310,3069,14501,9434,39872,835,15645,12068,49024,36742,6651,36025,9181,27803,2429,33465,1599,29442,17791,47523,11099,19486,2123,13460,36295,21010,8674,25986,4722,13282,4678,20747,2435,4323,1891,4484,36744,4873,43637,44258,26646,12265,21622,47651,48796,48709,13667,43065,47706,4522,21466,12306,1565,17620,21301,29750,37726,3024,14504,12277,47170,39598,2022,45759,11670,26827,19501,6395,18800,30251,46878,20521,39541,7986,11242,1854,10287,25626,11885,18532,49848,8634,49851,39747,5917,1690,44979,4055,35796,11393,1987,47616,47915,39308,14544,44033,24207,44426,38646,2214,2115,40085,11531,12244,26685,20958,28813,3066,11045,19182,43783,2181,21924,17965,44430,10903,38752,44222,2742,22256,1958,19389,15759,15494,46525,30281,1995,1001,2129,8884,34263,2187,1320,3055,1640,49898,31716,6227,2053,14625,10238,49891,2770,20999,47593,26604,4810,13344,25966,12514,27955,23373,5661,43950,10669,49558,1957,11823,5205,46569,13868,7051,11244,9046,3556,10953,49792,27047,11304,24384,3682,8707,13239,6786,44900,21556,17580,13492,10142,45452,13535,1674,15692,44700,43532,43310,48350,24205,11268,5022,5867,49846,49908,1761,28024,12282,2225,6599,40581,21335,11081,27684,14418,9391,21633,7161,11354,30853,3527,29082,25407,28061,47902,7624,9177,14589,40198,3399,6509,6498,30717,21627,37450,14403,22718,21098,1187,10710,12019,48630,3976,31258,39175,4145,9126,3946,978,1972,45848,32658,35357,1922,21877,8581,10034,19322,24322,2496,5183,1314,5566,6702,5152,31624,26753,50019,46113,28914,30203,37392,45003,13172,48576,7727,3597,1810,24517,10044,21738,13581,25994,6888,16376,9243,31177,31378,38826,45230,16252,4596,2936,18191,3367,5230,20260,7195,2107,18188,36254,18191,28103,2264,6746,39817,3225,13946,47931,25503,15540,36844,38088,25027,9072,37592,12503,43059,6764,41009,3331,24212,3442,3527,29718,6874,6712,31265,11803,6308,15251,24132,7788,25886,49075,21883,1086,50094,25573,5685,3710,36900,2102,8597,33586,18094,16551,15581,37369,48693,7532,16390,4965,1351,3243,11393,35149,1536,24322,11478,16373,25015,6738,21202,13901,1913,46067,11558,13403,14052,17561,4728,17453,19799,13811,6148,43933,49333,33576,21595,7546,46215,50133,14050,5160,13811,5119,35625,38559,41357,44065,27544,50012,4138,46050,50003,7760,1676,48545,5709,37494,32844,50152,36754,49463,42361,48062,42604,16324,11399,32500,45106,23498,24087,5214,4477,19918,15629,4474,43722,45931,8010,27132,14184,16611,5882,13401,46299,14662,20999,12811,2174,13824,23754,11399,3701,35397,2895,15072,32820,19761,48926,49523,34249,31787,12641,30955,34073,11122,21560,11533,33467,48016,14785,19389,35609,31230,45216,6640,21714,44789,5300,7573,16557,43471,48474,10449,6006,20386,32839,14662,43147,5227,29595,3474,21325,28272,26656,12278,8124,35399,33514,37135,44282,28021,26725,34092,4474,48144,46031,42610,48147,42230,19955,29220,48151,19960,46039,19875,46041,44753,41916,46420,46851,27963,9986,2208,7104,43607,16135,6818,6222,27738,32645,23092,4986,18402,29981,10174,16616,45360,34054,1718,2918,12206,49585,13864,5753,39519,37406,1399,17158,2674,20531,2821,46847,33509,17163,4622,48536,6818,18409,36607,49648,49543,11563,15016,23090,2259,1783,44203,1688,1904,6840,26849,8814,12326,25764,1327,9825,23302,20332,9345,16054,34054,1782,6192,9267,20931,44915,27618,12832,28669,10982,4506,33541,9221,45110,6150,27576,37065,10223,50294,44544,46842,13815,24062,12641,13997,49049,40180,49466,18048,48407,2238,3777,18093,19044,6521,33905,30615,26605,49899,26609,18029,3870,36872,19481,29977,14077,27341,26608,49899,27302,17035,1968,25146,43139,46407,41597,46409,45187,44175,49043,44007,25159,46416,43178,44181,50258,43750,44184,45198,41401,41815,9983,32727,42546,28078,1666,39659,1664,50289,16768,26361,41019,45255,2396,8600,44710,5227,13344,14239,26405,50399,24072,2702,50399,16415,26216,1065,2674,6401,50413,17395,31147,7655,45142,1065,6243,35609,2039,17217,50229,45283,35248,6975,41442,25409,29064,2366,1199,11384,20567,48901,7768,18515,8265,8301,2023,50427,20202,1404,2856,36197,50432,17415,5241,5407,23498,50437,28136,5544,3725,32053,50442,50462,50408,49406,17776,11950,38665,35000,12027,1122,48688,7759,17739,14223,50345,6770,6491,37148,6542,28907,19645,31733,29049,19418,2306,20574,2077,17656,50482,13204,1302,50476,24572,50478,5714,14223,4445,39257,2255,3355,36813,31903,1004,13458,7061,4065,25681,9099,45077,8998,14944,12499,38419,1396,48567,1712,31960,2848,23065,23019,1842,45123,5659,47596,5661,20412,5125,50510,2100,50508,50485,1890,24855,50507,2690,50509,29325,14743,17131,11111,11251,6888,1193,3872,28898,50524,12048,13281,47060,29498,17856,5538,3020,12500,26725,23005,17283,45965,50376,42743,43257,45615,45970,45617,50381,44177,49045,43483,43265,49048,45478,46557,41200,26793,11899,25571,4427,12391,1301,16519,16428,12326,49059,12740,6312,7970,29902,13268,43527,1760,16932,50472,25269,25446,2784,46457,11956,8456,15546,26648,9153,21674,12809,44570,25852,9962,10179,49869,3066,10204,28695,13189,46297,7092,16607,15068,11819,3059,22281,1962,1600,14769,22633,2031,13265,37482,34908,44044,3873,40284,43676,2098,25529,48221,11634,17764,19091,4472,17486,21404,34284,50602,23695,14400,44864,46697,49100,37175,1779,5261,1498,2077,5250,35965,37420,13460,17738,25812,21525,38190,23441,49656,11558,10370,1947,6596,47385,14668,45739,21708,37532,43443,14387,10093,16594,13775,19422,3738,32103,9048,6238,21175,33980,16084,45628,13947,40029,1267,13555,27901,14290,48547,23365,22404,15166,46982,5220,9482,25961,6218,30557,9734,1185,28729,17354,43662,6183,14396,1005,16570,14493,41772,14582,27313,15178,34905,27832,27844,4935,43787,13274,47553,6350,4712,31325,43907,2983,14464,35572,12709,16614,44504,37060,35542,2282,9178,32746,27321,48949,17153,15038,11025,46126,33325,1819,39941,11281,9037,24407,11442,18913,6547,20118,24473,1729,3933,45094,44101,9526,11423,25910,1709,47615,11436,6996,13399,50339,1020,4510,15002,17764,48571,19387,44147,48315,11127,24031,1130,12209,46965,12162,2487,30778,26778,1686,39527,13532,11683,6524,14712,14647,21007,47007,15109,17338,3663,16605,25537,35844,13501,15126,10232,50802,13085,13471,14391,16995,34213,10697,4090,3370,29369,47807,35332,1022,21300,47810,46733,11088,5807,1699,14042,24291,10669,21565,2762,7020,47282,41979,19724,17853,8894,21586,31240,6502,8949,3680,5620,15932,2575,1953,15708,5078,32635,34283,17855,3969,42424,17855,39237,3535,27011,25905,47071,4854,3750,16879,10294,5629,37154,9477,37462,49269,11735,11513,11436,3391,19418,14867,33569,18215,14186,5588,44045,48945,12145,9255,12661,6989,9793,37724,1051,15241,47714,13663,11993,43738,15565,14723,18237,5902,6145,4876,43078,35222,47225,17486,43040,2990,44101,44885,48293,1594,46788,1450,35272,14309,2981,9058,7055,15559,45180,37392,31472,47019,13148,16388,32853,4394,3382,16752,25414,30216,5852,9482,14692,5805,1669,30822,46460,50745,7203,1958,1463,38559,938,3828,2592,43792,38326,3678,8103,48018,47069,14565,38824,1154,16648,9613,9862,43452,6758,14267,14091,4564,39548,1178,7104,320,48050,37062,14857,14709,26201,316,37172,35889,50162,43032,49050,50165,25333,8086,5721,14541,10216,14487,1921,4434,2188,47709,49768,2038,47789,27934,24792,17312,13049,9678,23695,4590,26832,31344,32749,1543,8114,13024,25582,50713,49672,42555,8907,9518,34287,50590,28217,3667,784,9808,23753,47391,4252,24898,37468,17285,13185,9681,25830,3384,35036,5156,48601,7063,3859,16821,20533,1956,48622,2950,43302,14483,30677,9193,11356,14449,9128,1339,27945,5929,34330,9394,7646,33654,38658,50898,48571,4343,20508,27908,16552,33478,33288,1060,9787,49209,37714,15096,12832,9629,29488,11058,6027,5703,34068,44345,30618,11020,5647,33839,24406,15760,3792,4987,11023,44024,38392,11430,9589,46855,14661,32271,8058,12551,25784,38230,47762,29157,14336,7756,2149,19093,6177,10020,26646,3080,44406,11566,12337,12904,23369,45397,45701,25858,5880,5541,8827,8593,6716,39817,10454,37178,7239,12307,5805,25975,34015,1080,21332,10092,23268,15468,29075,1902,23987,5970,15647,10530,5132,3977,4764,16757,11955,33744,31570,4405,13075,1429,16826,14693,7715,18034,5167,46253,5687,29921,1131,22252,9059,2527,9059,44269,7097,10093,10932,33505,14402,13179,37394,35651,46221,10289,17020,1698,2587,11931,30554,8840,43774,11484,16974,8974,14727,13155,4603,25629,4429,12902,41782,9478,32867,1543,24376,49637,5586,2670,40068,50167,3703,25675,4355,48871,50347,43488,36064,17776,24510,44628,30053,20907,25903,27738,49001,36829,48164,14046,17323,30279,45657,6818,21518,35882,7759,17726,26797,32762,1088,29395,2045,6920,9533,2217,6449,38545,25822,46491,8317,50531,6805,50834,15707,51202,5801,10188,3363,29059,941,5677,5670,8308,24057,27252,16624,15937,6779,26800,8002,2429,29049,13093,7732,12481,26177,28406,35898,1446,51243,25505,5684,8308,4654,39712,7333,8309,20401,51266,10406,51201,46090,51248,30052,27203,2318,46737,2442,6919,3118,18104,3433,39919,14743,14549,11311,21157,37122,6033,4759,15950,39391,51216,3436,28142,9243,19778,45698,38074,36538,4082,13041,37134,46476,15716,6838,15490,21275,23990,48065,45858,35328,25427,37022,26890,48242,46516,32843,13767,5996,5970,25648,12603,17144,6764,9661,24094,22796,39709,33692,21569,5682,51243,1091,1924,15937,6805,51335,51272,12159,9710,6142,27442,8442,16812,14336,7225,27891,1770,8431,29453,5086,37429,6058,3554,39638,3394,29436,4482,18386,2134,4621,10551,6251,15109,29140,4731,27527,24600,2769,24632,9675,17789,51323,12481,4826,22780,51257,41377,10215,27206,51376,1360,51333,11853,51254,51268,10599,6806,9668,30053,51339,27111,35940,36692,15684,13014,12160,2950,36001,13139,9157,19165,14447,5842,20304,36310,2907,51308,48677,42259,46850,50390,41919,18946,7548,18741,767,2251,37920,51416,8959,18258,3025,34072,28782,14710,15751,17755,4889,3674,6217,12946,6191,22168,6427,43004,49306,1684,3080,11963,2034,2727,14429,17084,43872,41063,5841,37032,19047,41978,48413,1060,8659,32864,33713,39391,49763,48652,46984,24932,15753,2598,16954,2781,29436,19381,4251,10294,12692,1552,7136,4080,48879,24994,3048,43375,1153,2291,36509,3092,33946,27149,5125,31073,45430,11961,1910,17283,38208,22036,1585,15866,1115,9765,5867,39970,8455,9249,25879,43913,42057,11310,44446,14168,25082,38559,24444,3092,23780,2485,838,46230,50211,3100,16436,7533,37756,1324,37700,4444,15194,13555,48268,9500,21518,31307,30740,49427,47651,7764,8617,6181,8358,46101,6017,16166,1251,4774,51419,4626,31529,48100,47778,48158,46558,16786,43887,31716,45962,48807,43891,49037,46543,41185,43477,50565,46548,45189,42556,45974,48526,1092,36638,7726,927,788,5309,45516,13040,43633,5752,21642,19622,20570,21291,450,48346,6142,11933,17528,5109,7074,13904,1705,30275,17015,8631,13501,32657,1249,8554,45601,3510,2456,5075,12715,6850,28822,44103,20283,26862,19274,10974,23270,1803,6451,9414,15658,30566,2720,24857,28263,45766,5404,6736,7179,20364,29886,37077,38207,20881,15028,38111,29184,33298,25247,1674,23043,4803,23772,14665,14634,6370,28655,6409,15562,3745,35156,22622,1533,9245,2225,11298,5502,29127,14393,29908,28336,47355,31544,20905,8957,51609,48409,16862,42409,22645,3461,1063,40253,23874,2060,4885,4292,41792,27919,38406,1912,38147,41981,11891,15621,12782,24238,5586,19421,46350,36905,51144,34007,51678,9046,51676,51681,51679,48823,17391,15588,1912,4986,20596,24857,3939,1912,46431,1980,24401,17641,46810,18907,2917,11242,11244,3064,5581,1324,12245,33327,15894,3098,34033,15131,13540,45994,19291,8369,14959,44542,40208,5581,17854,11681,11960,10551,6634,51692,48653,24077,6039,1941,48433,13199,48393,10371,17311,12488,2660,9270,39504,1686,11108,6784,31048,4590,51736,12784,25263,8313,51733,2100,43800,12285,780,21719,4480,24885,11410,12269,9674,984,15186,27110,28454,15585,20565,2681,17293,3370,43760,35194,3395,3933,9666,13941,23590,12476,7115,15746,5909,15291,46605,16131,19532,4359,44167,9519,16836,3354,5015,963,13561,1234,1466,4851,16846,43079,5716,30872,16902,41085,44463,50163,50972,43489,7499,18999,45437,18051,20356,30273,44581,31062,24442,37686,2573,6367,48744,16423,28916,18919,8958,37692,3466,9258,24137,12326,30774,48022,31730,4328,34308,2772,6219,7582,24652,40098,39203,5924,19531,24365,10520,1232,4064,36704,24336,15950,9157,33869,6238,21832,40144,49804,44981,29056,17791,5741,12796,18781,4457,1276,35884,22687,46541,43893,50562,49040,43172,23132,5137,9593,47713,9289,10254,2800,15066,11664,22842,29103,22399,3102,6511,49203,2990,6257,12074,36027,2048,26678,13202,36902,43953,49867,43788,8937,7431,27057,6632,16949,12832,46643,15763,29555,331,1292,2124,7613,6571,2704,2824,2634,3682,1167,16385,50567,45619,50569,44179,51549,22904,9119,8229,16704,43999,28464,24482,4428,15295,20855,13062,12004,8779,48137,24878,3528,22106,29584,39992,46128,2907,9078,51473,51799,48678,45836,50261,28186,23555,9243,43236,50270,6764,11955,11311,1523,3682,1234,2686,4434,21010,48027,38684,9275,50212,51029,3971,17011,37143,15114,1184,7252,8158,21749,17292,15490,14725,20456,14791,38824,9349,15543,19577,5482,13950,1960,19576,44885,44590,3406,5161,4682,8003,7725,45118,9873,17555,41647,35005,51028,46253,51350,14652,51966,4825,42044,3359,13984,3993,1535,13345,42452,37163,45569,37296,4349,50716,30588,26928,24790,4725,11061,16367,4094,39233,20444,46080,19690,9436,37032,4389,35176,8259,44905,50284,16588,7098,13901,21791,6589,31347,4700,11340,13647,7051,5545,40947,1577,37600,3730,24940,22163,33739,51179,39630,28596,35583,39946,40151,3076,3597,27217,7168,41123,40423,47766,43875,40362,46035,38946,46037,41547,47774,48154,42620,50573,48102,51544,17117,1552,17128,5659,33817,33266,12038,49724,9563,9363,1124,11912,52083,3360,33266,36807,9904,46507,29112,11120,29512,2174,23032,12989,21208,31591,36258,2230,1690,8829,11895,23666,52085,45904,35374,35602,23689,9267,16508,1788,4040,22923,28272,52098,2640,6290,11792,889,52103,28089,6290,14907,45905,15782,24243,38336,35708,50460,29395,45451,9122,11631,28684,5089,46796,52113,49271,8630,21554,13184,3282,35353,51080,1712,15705,34303,5101,34171,15091,13494,7986,50322,15565,3012,17168,30776,24073,3544,14192,6714,44439,11721,36346,43862,11298,28688,15115,14343,6815,3435,48007,31198,1684,14916,3971,2691,46343,4850,46989,5193,5698,2602,42412,4338,3441,14970,1234,23658,9674,13662,29636,11727,6474,2677,20514,12277,24173,24204,14837,14525,52124,27886,49053,36103,14944,16576,10647,23235,27826,28053,25029,39123,37460,43957,36874,1552,10617,27030,6705,21626,20903,20654,3842,14571,41821,34148,14658,11653,3528,16130,11482,11361,3027,7560,3358,8431,5581,47063,43709,3503,30733,6914,28802,42724,5012,1690,20220,4023,24210,22335,33267,21530,22622,28735,16614,43288,5741,14914,14982,10957,35350,14821,5591,52264,49942,3141,22682,20564,37840,47012,24997,12062,51299,34072,27944,3349,3167,39375,11501,11964,13397,22682,3618,26725,28894,7339,34856,14936,32753,27944,3410,3157,29641,42998,4861,25965,34874,11276,17629,15273,3472,13344,2406,23874,14276,39231,31105,48192,15526,9589,11393,5092,8754,8839,25877,24452,8362,28719,51373,3877,30887,30108,13115,4340,48635,5106,18762,28734,23077,26097,9349,4300,29522,25877,25352,41818,24197,17791,1251,5414,17166,14860,5016,19843,2496,20126,11721,51832,15162,15044,8314,43437,47711,11461,50754,47116,5249,8778,15108,3755,4595,9366,1411,32351,45877,28180,1991,3380,6605,34105,9402,46333,8585,38877,14707,1427,3399,3441,26089,19545,30441,40354,1021,46619,52379,14832,28708,5482,12241,9726,7548,4102,10235,33637,46883,14533,16485,44792,2817,39387,29522,6534,1453,31019,52404,3876,16482,52390,46883,46669,1801,35991,32026,12246,9013,13770,6501,14233,45251,45778,51129,11721,32026,43632,13149,16573,14852,4513,14900,48187,11380,49916,2366,14005,26918,23317,2035,33918,11526,10599,32877,6210,50992,13064,21633,13488,26054,902,16130,990,40460,1267,15822,14867,40198,49972,32874,10287,3039,3690,7356,3516,5680,22088,11017,22681,35375,1787,14176,14590,39129,20941,50990,5549,15028,27944,2099,43287,22252,12261,6183,3597,14224,25476,52469,30971,34674,22975,16500,6487,29598,22977,5856,17337,50527,16813,24798,28719,7501,22618,14396,2026,52411,47430,47057,13958,12285,24306,17670,24301,27819,11898,787,39285,32117,38855,6807,3198,2319,16446,12978,3387,6772,5113,6575,16471,2529,6720,49931,51474,10057,2950,9442,11331,2936,6865,4711,21559,6773,50969,51541,47945,44720,50973,12223,4646,1692,2380,48609,14061,7202,4821,36729,13759,3419,2126,10905,51739,35967,31236,11604,7401,8468,5776,17362,26117,26799,22108,46939,43637,1568,48720,17582,51891,10235,5793,1243,3480,10266,9868,8243,16848,52388,17292,19093,17396,10394,39824,5009,12150,8814,10560,49337,21147,1801,8100,1835,5822,25767,21912,43869,7777,2981,1296,28899,4516,48787,16366,35324,11132,16353,1517,32765,18104,25227,29692,14417,6668,9628,50622,7175,51713,46536,37651,3088,6670,13177,2912,28494,4480,4676,35175,45455,6010,39811,33301,51857,34005,14340,43377,43845,26955,33942,12156,12322,4701,39490,44357,27045,31143,31848,25351,22970,5016,23847,11941,17123,1507,39952,52663,4407,15329,22750,26660,7615,31158,27476,35321,51485,36583,24729,17696,49613,10551,32035,48258,16836,23365,52682,49411,3008,8809,27058,41425,52659,50461,27894,31159,31848,6399,27525,9726,20733,6062,10953,4473,4823,52673,4511,52671,29892,27109,28857,3077,3622,44013,45775,4658,7212,52669,2496,11438,27454,37251,41734,2061,21546,9624,3609,4827,18549,31565,8517,16771,2684,25477,52722,49169,1611,9349,1177,10023,52731,4984,30839,6869,10531,39318,16007,12714,52160,1050,2112,2790,11664,12528,34005,4643,2539,22162,32725,44019,1589,34208,30183,52759,2183,29486,52155,8085,34946,24316,25044,17969,6323,8433,6846,43778,35072,5002,21615,15498,9040,49756,35304,8340,2061,32774,13120,17080,16202,4096,39944,9942,43844,41387,50306,6202,17969,52159,24922,4311,9255,28670,1574,48500,12297,52801,52700,42059,20338,31200,24047,1507,48450,31242,24533,3027,1285,37374,23367,22655,3714,1305,6703,51107,11533,26795,24291,30193,21669,12128,36744,28341,10985,52828,1703,2745,3511,3238,43830,15558,45172,31211,40068,16764,43110,15580,49083,39824,7560,43775,25244,15609,46939,4650,9354,33626,25474,8080,5702,3583,2686,37475,14504,13958,13005,16883,34174,11540,21998,36834,17595,4623,12515,33964,12038,6193,46523,45506,2127,23984,12774,17739,49032,38222,3671,45104,12699,17970,44479,21916,3314,1103,16422,24407,26815,50167,6317,47191,13002,11109,51408,44754,50389,40908,44674,15490,6342,13103,35914,46328,1783,1243,32959,1454,5861,3534,6937,20833,8660,36741,32928,17020,17857,39614,30959,24460,47875,48531,51517,17452,48841,47713,11198,13001,32769,18922,6769,44771,44677,25983,35955,37532,1176,27741,46127,3465,46320,8426,52454,13469,8085,9518,37152,27114,3439,15656,44329,39045,1590,9470,50609,27225,6350,36734,6037,27226,52395,3443,7210,34848,6845,15759,15716,43437,14027,9285,11041,12159,7543,43011,7765,25922,34644,30036,36584,1714,36726,34201,2680,34221,15763,10510,51973,6256,37357,13490,1852,48375,2530,16020,2528,23492,5156,16131,45063,51933,50239,25415,16905,10074,42942,51842,52379,5158,3100,44848,43462,6706,48344,52551,5649,25714,13100,41912,24513,7652,22983,3478,12812,29364,2324,23931,13215,10518,14587,28671,3936,41734,3356,8674,45916,30172,428,31262,43078,4389,4213,21272,2948,46826,17747,39196,7907,22056,15490,19933,25631,28984,38690,34076,16394,20520,5878,47702,1954,37041,20584,52850,37372,52022,26117,8078,42025,11950,928,18260,2496,19255,27557,49504,4200,8158,4793,22935,45921,38009,12770,22725,16137,20525,3493,37888,7026,12694,35911,1682,7501,43552,10678,2123,44025,5678,3550,42328,13119,3512,15789,20992,4761,15911,27559,8807,20307,3973,3802,50899,10298,43686,11469,28870,31382,39624,4211,20053,15585,3388,30108,9267,35771,25792,23163,14166,23684,3550,13121,8612,31807,46675,1856,5892,42991,9706,31391,1714,33653,27047,8323,39259,5542,24911,45976,2057,49613,27203,45387,25284,6772,23859,29050,25580,3225,20899,22610,14711,52999,23108,4396,39375,31368,4922,13480,9427,4448,45709,24386,22643,2981,50074,8096,15911,40873,1654,24586,11310,4682,33782,37336,8468,39889,49851,43494,7339,19287,36103,24211,36506,7085,34931,16849,33499,22314,49337,3549,2992,16358,22938,48855,29371,11098,3111,47797,15988,8087,35408,3676,52813,9486,40284,1504,27073,53166,15478,1696,32533,49613,26025,48874,45282,21305,28584,11438,25249,15905,49951,16135,2524,3838,48764,5947,15632,49875,37476,23428,11376,4441,21235,23365,10238,31368,12055,20459,22167,3650,36724,16039,7505,16371,5805,15227,47613,15789,3442,4716,8764,35110,20042,45374,20396,22186,21247,7299,38132,18082,3802,40144,3948,13541,53252,13940,7106,40725,1361,37155,13756,33720,1648,9408,42772,30616,1967,5782,10405,53140,18052,24492,1247,53135,8704,21441,31807,2599,23363,49871,1768,13385,29896,7175,30329,28507,3315,48249,15790,53307,4860,11080,11122,4870,4722,21870,39803,9178,4075,33622,44562,1412,9462,42766,1528,23363,16794,9255,10658,47124,39717,53320,53319,13811,3323,48249,53322,53311,9490,19816,38839,28882,37703,28776,49356,28887,37708,49360,37710,49366,37712,28762,29694,49349,29696,49368,5553,28756,37707,49350,29677,28884,16780,28757,38478,11886,52470,1575,27301,24601,3471,9348,4198,29508,4623,5582,3310,4883,9808,40611,3701,39623,35079,25812,44518,17993,35025,28837,31345,34835,10328,3062,6427,10903,52097,3679,33517,5164,4799,44913,25868,4797,43587,16370,17513,12941,2121,48165,49561,2932,24085,8000,35697,11802,1163,44982,48862,3186,48703,5682,49623,45922,24827,51084,2773,11048,12238,6746,23698,12342,17105,35759,39662,12068,45360,8816,8101,33586,37645,21464,46947,43992,53142,26110,49845,24757,35057,45349,52192,10381,3469,5653,6871,11430,36110,1847,3206,46427,23365,33469,15461,35690,12197,48887,8142,15649,8259,19066,8550,43099,30217,35567,20182,1668,31423,5959,23764,10977,46355,20234,1185,6243,12522,24557,14780,15582,16213,6436,34870,15498,5795,36786,53207,7258,4517,3870,44950,4625,3678,2507,5684,10454,30887,47340,9842,1424,44378,45467,3880,20327,1603,13912,11214,2076,28466,1525,6890,2269,35874,31569,50146,2531,3435,18909,10530,51073,48375,46699,7792,6988,9124,2849,3388,4364,52986,2225,48882,5888,9166,20058,5404,20939,45610,51862,45966,23402,45968,49041,44005,51913,46550,42649,50384,49047,23548,52073,51543,50575,19218,1465,9361,51690,9155,3419,38392,10623,19490,9222,13988,51523,33631,16359,51273,1162,27675,9368,1960,8367,10311,25505,1986,3370,10685,13283,20304,22312,6928,14203,40069,7054,3597,8821,43166,12302,16231,35927,46234,10634,27680,1684,50912,13564,24327,1614,49592,794,48892,49145,31625,52119,30238,37658,16106,37162,12527,1269,7277,1695,9464,8593,41647,6098,24923,32330,20922,53624,10070,22439,37404,6804,4234,16795,38055,16607,28341,3419,49692,1338,4017,53186,4234,27814,51832,1398,9349,24171,39675,9583,12394,15583,47149,32385,3862,15242,18922,32795,11739,14825,30962,35948,27390,31251,11672,11264,17990,45551,41720,11775,16166,2702,7977,19673,5296,37407,34260,46985,4016,32441,11878,24819,26862,1067,1725,33027,6709,47488,16844,3461,43855,7624,12705,9002,8998,12004,48859,11739,6704,1071,25351,21098,53639,6496,9581,39575,35599,22920,5155,17235,5897,20391,5652,17337,954,2727,49472,24915,4430,6414,20467,9564,16864,24499,27791,16408,26046,2355,994,34005,20310,3354,9355,511,4691,38081,3086,8602,18017,17465,43917,18748,22298,49731,24499,9964,44241,45017,20312,3963,1703,4678,5712,33817,10093,51029,9193,46848,50970,41874,50164,51803,7828,1009,49859,16624,10664,16140,6825,44870,51073,28143,20944,11611,11806,53770,31141,5286,11786,47129,40555,17344,41149,49558,21300,3462,34129,25244,1944,1692,30131,10046,47454,26186,19674,46520,50352,13763,4051,14260,46763,51551,46408,53547,51866,50380,22839,50568,46551,53553,42752,45195,46849,52900,42974,40852,959,3435,3778,9484,44591,16047,27025,33980,44596,18122,45989,51954,45806,24552,7726,13008,7749,33582,6489,49216,46080,16570,2856,41560,50650,48212,48474,28671,11801,1429,47876,43800,13007,14307,6693,1333,10160,3095,28798,37189,6537,39856,23585,32760,31324,50202,51818,51813,19724,37692,31764,7992,43388,2983,3929,33517,11711,10936,12190,49601,43970,51312,7068,10007,31318,22081,34222,1548,8973,4494,21471,8341,10020,36369,25998,2866,13040,12095,17887,53491,37598,16954,3375,53892,3496,23011,44283,53491,53899,53897,39295,51462,41099,15308,12027,4029,49516,38684,29348,8135,911,17402,17134,15969,6668,16098,1765,20369,4674,17419,16432,18692,48851,11899,30597,11661,14330,38141,33891,2873,25438,24805,53618,4041,49302,12781,53870,52898,50259,51410,52901,25168,32040,4829,3841,30558,9905,3341,47632,47479,11234,1799,22104,25433,2957,11656,16364,6932,15761,14584,48599,45534,44190,38204,2080,24557,45718,38009,1953,9188,11754,1937,53971,4392,3816,50210,6336,17747,6411,3548,1937,12048,1411,38077,34176,3220,49106,3157,20830,13280,34907,1320,15079,14652,1614,51840,9273,33574,18707,49177,11024,1099,48576,6156,52231,8464,31628,5065,44064,16501,24209,1241,1656,8451,21512,26100,45501,1553,30500,8637,4596,31127,48494,25534,11686,10108,49000,5009,28357,51467,47277,6370,5742,20369,15580,1447,3017,49133,21514,10184,15972,2817,25244,29591,43362,53034,22994,11404,11120,15091,20962,31254,24696,31592,21904,31406,48587,52876,33974,16158,15060,25247,45859,20549,33008,11866,25926,8428,45524,51467,10654,1846,14408,34116,33585,54079,26575,43438,14309,11332,49867,35348,33304,38832,54082,46862,38689,44449,33654,27081,32627,1492,14657,38326,31396,14683,15517,5114,35150,2924,7110,19581,50161,52546,48157,42078,53558,15886,17276,12326,6033,16759,15645,19597,21319,50475,53617,47005,47878,17292,5991,44421,8849,16577,2096,13055,2707,24693,5323,12053,9519,45904,46536,47861,4684,20867,34586,19658,1723,40128,14042,48860,11687,45511,20997,50629,1408,46788,1817,54135,27661,7094,9620,51888,19587,3108,53390,33906,11908,54124,31632,1956,54127,17153,54129,14958,8771,36907,15218,20561,54154,2520,54153,47861,14415,54140,35540,54142,14221,35861,2907,46476,2669,52959,47737,22663,20945,5330,25029,20448,8822,6602,6996,25430,4080,51693,24745,29665,48758,21147,26750,49298,51274,9023,2499,24801,40789,14515,12306,14445,51222,10370,47070,2795,1475,48195,8079,10287,11741,31362,7145,28071,3031,10170,10070,12815,10083,11735,54201,1925,48758,4232,50306,25579,9409,4931,17926,42344,14168,25272,15807,11283,24301,52750,53880,1233,6592,43462,38077,7525,13492,3049,9703,50002,27171,30616,15692,3329,22162,19396,13786,9971,22628,54266,5919,54264,9255,36001,3436,30998,17084,45348,5821,8431,29334,7750,43134,51194,45957,40666,8205,21870,29313,4062,29322,1703,29365,27532,29344,29321,29367,29366,29364,29359,54296,30244,9501,6583,29332,35120,35918,29336,25089,50050,54298,33758,54296,25090,31181,31122,54292,51746,4046,12261,27191,15950,33905,33702,46604,29355,54312,50698,43844,29365,44072,25752,29363,54292,54331,31181,49754,9986,43160,1086,54302,29373,5922,15079,20584,1149,29378,29373,18945,31111,11352,54107,46042,43883,52074,54111,51545,29058,43873,45978,29418,45980,29420,21551,15758,29396,4019,29404,27901,20941,2632,29402,29398,35940,18598,39903,50764,29409,39631,31262,29418,47147,29432,29459,36837,6754,29437,43789,2811,26750,27728,8138,29446,4021,2060,26991,29430,51793,54381,54385,39664,29456,53534,29438,54402,54401,35140,29443,16137,3858,45153,29448,33585,19443,2535,29421,15031,29455,54387,29417,54404,54381,7713,1912,51861,46406,41241,51552,42501,53548,46411,53805,51914,53807,49046,53809,50572,53811,46687,51411,42566,13224,1065,51826,9621,27453,31253,16165,31253,48892,51073,16162,21218,29713,12228,10609,4401,11484,17057,53644,21676,45180,46708,16326,27099,54444,4646,43526,1095,51386,11806,16683,1489,24065,4587,9626,3011,54447,9369,28822,16954,9351,28345,5916,5192,9874,32437,9283,11330,4674,3705,36844,15755,24180,4801,5089,29376,13553,18260,1855,45739,34938,17402,15522,30848,44114,11393,11572,50584,46087,1318,49663,1608,1440,29098,3656,1066,3358,50667,6347,43529,14561,16777,29370,1557,29001,16487,2196,14789,29566,19588,36919,1827,8385,14464,11941,43905,31625,34221,33302,17462,24415,3712,51767,24436,27264,24249,36540,22187,1014,35958,35160,17390,37549,26872,52684,3428,1965,44224,10689,37047,9248,16869,8757,46947,6707,1305,37062,5203,11570,20375,52974,5749,944,13821,47426,4492,46062,20044,26730,51485,9960,48545,50076,2766,9709,9709,5699,2040,29411,317,25631,3877,43906,27757,1397,9164,3025,11501,15464,35646,52103,4504,15038,30911,25306,12563,2039,5931,37043,21294,15950,1592,50014,50466,4953,20109,5434,4393,1584,42171,1093,1606,9366,8415,46828,21941,42118,54620,10171,26361,26910,22163,17093,1392,53788,6977,28134,49287,54560,40101,3872,39773,931,49717,32040,54635,5054,35197,29055,54617,1084,16465,7159,9622,40101,45280,2783,23646,1690,8221,5235,3206,12479,42219,12941,1585,2251,3409,24815,38016,31073,18532,27772,50923,53310,31389,8468,34209,46948,23496,2177,51025,34258,5092,11308,17840,3846,2873,29505,3751,10537,22648,11678,46476,2950,10045,10506,14950,5089,52440,10422,39220,39632,1509,14338,49254,22172,3322,23099,29334,35754,5242,21708,22267,5167,4552,33566,14417,47648,8456,19304,22035,34312,49845,5127,47782,3807,30658,1149,27747,1092,6716,6752,5857,17035,31117,2528,17352,12776,49898,13435,52594,36820,16097,47131,35423,9163,23741,23733,8634,16538,47983,20342,13405,21567,27098,3090,24801,17050,44356,23139,6890,38029,33757,8229,3436,39971,30171,48630,6134,980,14988,40954,21623,49804,35697,20375,2141,1924,13111,52554,33789,26998,14232,1559,8080,12821,23258,1542,17153,14767,29743,14992,40128,4450,4518,19668,16840,37231,11942,3461,3545,45507,14901,43083,38124,15036,28753,4140,1669,16400,8629,9264,11330,14289,49155,43051,27691,3331,11950,1328,25781,14165,9383,2783,2622,35769,14857,2651,8079,15648,4064,5394,16868,41396,50387,46686,45197,53945,30937,5190,39973,13012,51986,18104,50812,10000,53607,24024,27162,51900,48781,52350,14857,10403,9588,10693,40083,14505,50427,35804,12062,1482,1603,13434,2763,54203,26078,1711,50791,33673,49966,27199,46343,28492,51388,31921,9668,51537,20951,14249,7778,46080,11482,5860,26065,46970,50817,51460,43054,2877,46796,15732,52999,16705,12705,49804,13458,46808,27913,15241,3238,2993,21591,15629,5584,23369,28640,19283,8624,5231,8365,5373,50885,1194,51578,20787,11050,8298,39952,13179,33773,1411,15839,6021,41367,5917,13195,48634,54232,37724,54873,53913,43048,11366,5502,23467,49654,8688,22975,54849,41745,23441,11604,54887,12244,20944,9478,4074,51065,4673,51064,11898,19296,43740,25891,10046,53563,45209,9486,3475,15759,24876,36899,6242,6927,43540,1675,1553,1688,29439,48952,26651,1136,31239,21633,16341,6675,16570,19213,54282,40665,40547,20632,46729,25488,35769,35051,27210,47096,5087,52921,46018,9662,36510,38389,24237,11598,10267,8459,13492,6728,9059,53013,965,48586,7061,16157,43942,52564,6753,50738,48105,51458,31474,4360,32764,16744,5816,26685,17525,35333,17743,54006,12044,54400,34835,4487,25981,49428,44855,4808,51886,6183,13171,53426,50176,52882,39521,4812,3464,15979,36025,28808,1720,48344,13389,11022,51796,48480,11796,39788,23180,26588,34154,12113,13981,9157,33518,30196,11869,7079,16202,37626,49520,13249,3067,33680,13457,4429,4488,8901,51211,26032,43333,8820,17972,43039,16844,14487,8369,6511,12262,1060,11331,47177,6734,5260,13400,52045,14711,2307,44832,1093,5430,53319,788,23792,11480,12794,25926,53051,54145,49933,26155,11899,11697,35321,31374,53563,54494,3881,21522,4679,35910,5834,3094,10075,36551,12733,27053,12235,5218,45349,4857,25917,9986,43095,50602,5528,15736,14855,1803,48388,30640,43402,1234,33693,6751,46946,25265,27205,25814,26740,4064,15052,14959,38668,12673,38009,34165,47857,10616,18126,53942,50388,54437,54838,24841,32018,4014,31958,1162,32253,7254,32286,918,939,32323,33660,30814,847,32119,31849,3328,31871,1420,41019,17080,32350,1185,31982,3713,31587,3035,32558,31972,32113,32005,31943,52908,32327,1072,32452,1417,788,299,48263,55195,32263,3844,1887,47519,1307,51902,31982,1430,3154,1774,55189,32525,32044,41340,939,32111,1068,10963,32012,1434,55166,916,31987,478,7057,31947,26001,32247,890,32509,20460,2073,53560,1018,44,28419,32044,47335,32367,20881,31924,27892,55233,3653,8887,13240,1317,10686,31992,2035,1068,55243,847,32487,12111,3777,3651,32296,1257,6585,31939,32205,2078,31853,8230,32104,49855,31895,3543,21758,11887,13183,20461,904,31934,3047,1071,40627,55221,10034,1257,2039,912,55241,55249,1690,2189,5143,11099,2123,31939,13253,1399,5541,55256,1307,20672,32263,8045,55280,939,32504,31844,55212,31968,1420,32232,2821,23257,1166,25273,32077,1430,1065,1465,32237,4354,4933,1093,31878,1420,35354,1411,31909,55246,32224,987,1003,32111,5851,2035,3806,32129,55315,2021,905,31997,1317,18190,532,55234,29994,32344,55248,31947,55284,32322,32310,995,1581,32221,32136,31888,31877,45235,32386,2872,1173,32062,31889,12476,32557,16351,11099,32089,55353,50938,2985,32477,5858,27896,838,55277,1301,995,50938,32253,8304,32354,1834,888,31892,7095,6176,32398,3844,2039,3350,939,4593,55224,55383,292,55385,4113,31675,27250,32102,11893,32010,32101,55315,4933,32080,2032,3385,31912,55400,4933,31854,55267,1304,32344,5173,31861,13132,55387,1068,1572,32253,2768,3804,26114,55290,8887,31842,8004,5203,3035,4889,4660,32123,32386,42026,8680,12476,31912,4357,45466,47598,19567,32240,32164,27892,16517,55439,32141,1524,2120,1804,31934,995,24137,31922,1685,55451,32129,55416,32318,32244,55450,5565,32332,31947,50884,31854,55381,1071,31912,1785,55207,55408,995,4400,31912,31859,37133,27264,32467,9066,2150,1052,55256,32200,1404,31864,31839,2857,32132,10666,1554,1009,31842,31897,1190,55171,8906,922,18946,32141,55283,23240,31958,22686,31933,5820,55243,17408,20618,32580,32104,788,7558,1430,2039,31886,7765,55316,32769,922,31878,32526,35834,2145,23242,55205,55279,27596,32384,12758,1853,3656,19292,11961,32467,5985,32354,19630,55387,3704,20461,55324,1460,4014,3178,29414,1664,31992,5522,7194,1351,6029,5087,55181,32044,33780,847,55550,32070,21890,53523,12191,31982,55482,11493,55257,1240,32028,31984,26620,3878,1304,32206,9972,922,1760,23227,55317,55572,12284,29437,32232,55324,55416,24343,1462,2997,1065,32107,55398,2105,55213,8800,52908,32012,1002,1122,32308,31986,32,32018,9310,31924,31587,55205,55462,8704,55168,16484,49204,31892,13183,1552,1283,32102,8584,13041,32344,5858,32157,10658,32296,20565,32010,55466,32071,2082,2123,31996,44092,25232,32037,1235,890,32352,49075,2318,841,31997,5143,55632,1052,31853,32173,55281,6035,46576,12111,55248,32012,2063,55635,564,19715,55585,55597,478,886,32311,52908,55331,995,1240,1274,32482,18104,32303,23601,32327,32076,1564,1295,31900,6768,55559,55233,32153,55190,55558,55201,32141,32020,55201,55408,55675,1887,55679,31861,55681,55252,1307,55559,55640,31854,55669,32121,1914,55613,55683,27676,31871,55680,1683,32367,32193,55392,31933,1390,1002,3103,3745,55224,55704,55424,5790,6525,841,32482,8810,32354,1390,55379,32455,55693,12476,14037,55559,5036,32005,55697,6828,55686,55302,55677,41340,9987,32148,1476,32574,55700,1953,32487,2120,1420,20510,905,55641,55347,10235,31913,3967,1183,55684,55672,55201,55729,55673,55752,30667,55724,55678,55749,55592,31986,54613,5050,32018,2123,32286,55378,31842,29994,32104,18575,55606,55260,55744,55692,55665,44187,32159,55777,55272,13253,2367,3371,31842,55562,11344,55647,31904,55644,21337,55553,1276,32549,1422,23601,1313,32013,32354,1476,1456,26844,55514,8964,55761,1077,10963,55514,13136,55741,55597,55599,1538,45466,1670,31871,55279,51902,55651,8004,32172,5153,118,32244,55186,32074,316,55509,32438,55192,988,32386,19674,31878,31861,55611,31854,32423,55833,4296,40101,841,45,55582,32438,55471,1122,32132,55838,55281,15030,44384,55387,55257,55546,55594,9697,14456,44386,1175,31871,32169,3097,55851,55386,32467,55689,55611,32348,55825,32268,1420,27892,5664,12681,12610,55612,32133,6832,55671,32518,2318,31982,32515,23355,1104,450,55860,14456,6585,13224,11062,55796,31895,31859,1235,55741,1778,55685,55725,55811,1582,1417,2997,3730,32141,55817,3651,55168,55215,26963,31892,55428,55518,31859,55913,32224,55782,2208,55784,55790,44075,55647,55785,31916,55791,55295,32023,55311,2508,55798,55761,55485,2141,55931,55800,55806,6016,55566,55626,1052,32066,5140,1692,32452,55200,55733,32226,29033,55814,32348,55459,1853,31871,55660,6134,32237,1237,55444,32360,32501,26620,31842,31906,27009,55957,55910,55467,55964,55874,55937,31912,12795,33489,1012,32141,31889,7649,9179,55796,55976,32025,10634,55969,32359,14977,903,1912,31982,55984,10455,1009,928,55989,32034,50468,32044,44362,32461,55746,32065,31988,2071,31979,55204,43192,31972,32552,55334,8689,13041,1796,32296,7071,1853,9096,32115,1420,55308,2821,32323,7780,6134,923,32558,32346,2208,32507,39778,55588,2052,55544,55258,55397,6918,2052,32323,55809,55818,56013,32350,3103,32568,23682,55431,25998,10183,8887,55789,8584,55489,888,56021,55594,1056,847,55630,1462,56015,1299,32525,56018,55944,55627,2145,2208,52442,32,32111,55884,32233,11271,996,41019,55220,55598,17105,32386,55670,31887,55512,55595,916,32226,55203,3651,23693,55254,55981,55548,31914,55206,6289,31877,11783,44362,32310,55792,32240,26666,7209,55636,55776,56007,1051,841,32037,55844,55561,55925,55826,11256,55647,32012,55946,56086,3038,1523,925,32314,55201,55452,32423,42026,32224,55895,32526,1649,1465,55603,55469,1484,31929,31926,9972,56131,2138,56133,32467,1521,7194,55975,11817,55810,56115,55797,3073,12963,30716,55753,32363,5851,5429,6202,5646,32021,55557,56152,53523,8622,30713,55490,1374,56045,1227,31858,55828,32455,55872,12909,55832,55850,55311,55166,55827,27572,1267,31896,32010,33764,55844,32268,55391,3350,936,56171,56151,55884,56175,55839,56169,55448,56112,55885,55896,55204,56193,55891,12058,55231,55894,31854,55406,1406,31927,32277,13224,32384,55830,24599,55846,51859,32461,1458,4660,33964,55730,55898,2688,55802,8582,32386,55743,55484,31861,2857,56154,1307,55496,55483,37555,32242,55919,32071,55512,55280,888,32221,4664,55476,55866,32108,20461,55842,55856,32308,32129,31884,925,55720,55556,56165,4296,55873,31922,55436,56023,56178,56254,32244,55391,39121,56201,5854,55392,32042,55294,1641,55448,56245,2047,55852,32224,55971,1512,55881,1114,32141,56041,11381,56153,32095,55933,1781,55254,56273,995,55439,56284,56042,32224,9479,1674,1284,44,3053,8548,32080,55614,55225,56295,32196,6585,31854,55504,1690,31904,31859,56117,55539,55834,51902,56192,55854,2031,55622,56212,24333,55271,5955,56200,55233,32396,1600,1307,33489,784,56322,55595,14977,2367,32507,34315,56331,55533,56287,1114,56192,56211,56304,56276,55324,1077,450,55842,56183,55882,55864,55393,56158,55678,10373,55992,55387,4664,5087,56060,56197,56255,1417,56356,32398,55406,56294,15760,8548,43237,1524,1009,32494,56365,48874,19782,31972,5565,32253,28513,6832,1190,56278,25273,5664,32066,8045,55340,31913,32543,55929,20279,56068,55464,56316,890,32129,56000,55627,5968,56200,32327,55889,55248,55789,56267,5876,56202,55835,45387,32141,32164,33489,56345,56341,55430,8812,55842,56211,56393,9253,11531,55869,40101,56177,55804,55800,55840,55542,55424,55239,12909,55461,55469,55958,56337,56430,55463,56245,32106,37206,16325,31975,56314,56390,1488,55595,56393,3716,28448,55691,5123,56128,32284,56211,32132,1180,56285,56295,56316,56453,56360,48367,55473,56304,55584,2318,32363,56446,45548,32455,56274,11342,56444,32398,56022,53560,14954,56254,55994,55647,1500,55542,32398,31245,55378,1061,571,55218,19567,55941,56076,30489,55753,31877,56155,27676,841,32226,55488,55432,12681,4808,55217,56000,1052,32323,3047,55365,56111,56191,55953,55790,22636,55195,55684,55478,32778,10457,20618,55418,56225,10288,55738,32012,55933,21404,56374,4750,31913,56309,922,56481,55173,6204,32296,31979,5737,32129,55707,55904,56399,55453,55460,56245,32132,10233,49792,31933,56542,32038,1430,15494,55612,31859,3033,56550,32398,56553,52221,55721,32068,19567,9179,9513,32540,13814,1319,32783,32354,56105,32363,1235,32387,14041,25737,954,55816,32386,55417,19766,55632,55232,20965,32010,29662,55163,1417,56450,33924,22055,56584,31972,55479,14816,56588,32129,1462,56023,841,55349,32526,31888,31968,56228,2367,56495,31914,1261,907,55430,1554,32144,55562,56234,32518,15797,31914,56611,56400,32080,1655,36636,32553,1257,6918,32132,56534,55917,55301,56086,55541,32021,31993,32307,56009,30228,56023,56390,56191,31982,56531,32327,55921,32077,55203,25998,56199,22610,55989,1023,5087,56102,55973,20732,56442,56191,56114,31965,32278,55494,2138,30713,32279,56585,56591,1460,2565,32438,1685,4752,35768,1068,55887,55188,32532,45390,56325,1641,32089,56346,1509,55371,5203,31887,1785,55618,1173,56533,55189,32012,56544,55810,32504,56388,32279,56531,2078,33707,56378,56638,56078,17139,32244,55961,56129,55915,56325,20732,31934,1430,56562,55853,55984,56707,56567,55530,55646,1554,56301,31910,34877,55449,56525,11331,55601,938,32129,55777,13555,56723,56266,56098,12043,11531,55705,56403,13143,56450,31913,55913,56043,56606,4080,32296,55194,32253,56203,56539,56388,31904,56547,56696,9551,56328,32448,56462,32325,56277,31859,3053,1404,32379,21577,31899,32348,1072,55162,31905,55235,1359,8747,56765,34134,12160,32384,22070,55580,19669,32387,31982,9517,41340,4594,56576,788,31871,32402,24078,10036,8002,32263,7071,1585,44104,56145,56527,55206,21758,55259,56337,2078,32221,3704,56300,5143,53816,5155,32226,1562,45226,56453,56041,56089,6493,56605,32205,55593,1068,21758,55853,56734,55769,56670,25756,56021,55456,3192,56107,55828,56109,27676,56111,56715,32233,56115,31922,56203,56120,55757,12395,56609,32434,55176,3154,56130,55463,1484,56660,56843,1953,56845,55174,55547,55978,56208,55446,35378,55872,15701,55519,55186,27011,56856,55586,5779,56281,5583,8601,56440,56058,56159,56423,56177,56163,56839,55844,14521,55258,56499,55847,56875,55546,8314,47635,32384,56831,56453,55907,56043,55990,56397,56646,56308,56018,4933,56205,55198,32455,56209,52463,55595,56213,996,56215,55758,32095,56219,56226,56221,55434,56224,56220,5583,56156,31913,56493,908,56612,55821,56237,56489,32554,28819,55318,55535,36536,32001,56531,56114,56622,1572,32144,56662,55934,55820,55280,55842,56497,767,55883,56303,21577,55513,32253,56936,56624,31910,1692,32058,31947,26852,32244,56861,32042,1785,13385,56633,56473,56825,56475,32027,56849,55720,56432,56607,22301,55362,56320,7209,56647,56110,56650,56395,55667,32147,56910,56087,31945,56656,7053,32578,1476,31982,56931,11493,56764,2857,31896,55347,55291,53052,56671,8777,55308,53513,56562,55861,55852,56488,55159,56920,918,56900,2872,3656,56485,56595,56474,56013,56459,32284,22610,56567,55978,56053,32044,1581,55185,55240,14651,56288,32504,56123,56937,56936,31922,55722,55917,57021,55452,56702,56307,55692,55391,1887,55477,56928,15222,14651,45603,32089,2073,56623,32514,57038,31878,32274,9342,32384,5858,56124,56561,55778,36742,32308,45390,56708,56105,55939,55897,31272,11842,56139,56854,6501,57029,56737,56054,56165,56645,25756,55371,55750,55588,56099,1351,55948,2751,22188,4587,5707,56866,31896,4683,56464,55402,56708,20672,32077,55416,26844,32341,8417,56736,44678,56590,56515,18144,55718,1051,31968,1430,56156,55487,4889,955,57099,56225,5087,32356,1081,49615,32254,2768,55351,31887,1019,55559,5032,1820,32114,1428,32552,40940,32303,57000,20861,31924,56329,56021,56708,9551,32366,2148,1307,13132,55266,13183,56684,7272,56295,3540,55814,2846,55176,32563,57135,56537,5737,6137,292,55439,55648,57112,39121,31846,2763,1471,56059,57131,788,3059,56517,55241,56886,19618,1257,11961,1641,56295,56014,56992,1096,1068,55554,31895,1283,32108,28448,45348,56670,56908,57175,32386,57177,56399,57076,976,56461,4875,996,1230,32344,56914,3547,32367,47998,32354,57077,56295,3543,1664,56792,5196,1511,55545,55233,7090,56066,27900,55646,57134,31927,18125,56398,40101,55413,3385,55769,57074,32272,57185,8827,57085,56268,56707,31936,1054,4364,57222,32162,12906,19444,6498,56228,55479,55963,57233,54286,1257,10047,55898,57192,3027,1458,57190,56295,57100,27676,6395,56041,55953,25230,31924,20897,32363,2108,56159,32103,6817,929,55484,1417,55374,56091,55660,1306,2120,32525,55206,32049,55651,1541,56378,888,32367,1051,55584,56033,784,1002,55246,57138,3486,57176,6993,32047,31958,18190,32210,32010,56557,51357,9096,31975,39966,56635,56485,57129,5664,31892,7071,55386,55789,32142,13132,57263,55377,55288,28133,55710,1245,32329,32157,57114,56901,6202,31007,57252,57167,57255,14166,1235,57197,16858,57189,32089,57241,15553,57239,57105,32021,9046,57236,32279,57091,15786,5646,57080,52023,57231,56865,57086,57188,56464,55654,1214,55657,32106,55717,55661,888,55663,2123,55665,2494,32226,57025,56304,55738,55674,55735,56354,57358,55756,31922,55760,32106,57363,32499,7762,55900,55912,56502,56574,31859,57365,7693,55699,56217,57131,55703,57153,32227,1521,55708,19400,56011,55386,55712,57353,55715,2201,55660,55719,56972,20341,13383,19274,56217,10171,55727,57360,56903,4668,57377,55690,55734,55750,57376,55732,3651,55740,25032,20510,55720,57025,55748,55697,55899,56121,57402,57418,55733,57363,57359,57407,55762,9203,32599,32601,54352,53557,42623,15805,32018,3978,56042,31870,3350,57261,55539,56972,56651,1465,55555,56195,32122,2089,56369,32348,55689,7209,56942,56627,56624,55903,19674,56114,57453,57368,9479,57207,57390,32105,32277,55486,55651,1562,20672,2052,31853,8004,3408,55281,26830,55298,57457,31924,57153,19766,55897,31934,56702,20990,56886,55233,292,41340,2435,57070,55245,23659,31927,1098,57173,57441,56502,55555,4767,57186,56394,31947,55694,55651,57018,56337,305,32038,1471,57339,31997,55990,57470,32311,7213,56527,57513,56915,55538,56249,57344,7993,32374,2988,56682,57439,42993,55948,8881,56229,57024,57297,56379,32103,44680,1021,56750,1853,31975,3716,2991,6991,22074,56954,55324,57539,57262,31847,1075,56439,57506,19584,32354,57443,56503,6249,56554,32327,57528,55783,32207,35650,44434,4054,57404,55681,56292,55382,32461,56705,32451,11871,1674,55576,9063,10851,6991,55942,55952,55232,42322,55694,56009,55610,44434,905,32482,51688,55718,55496,57503,57583,30602,57550,1704,27264,1110,55942,3021,56027,2105,32096,57508,5866,57394,56454,57436,31914,56360,23601,32568,56933,19674,57131,32441,57588,999,31887,9517,57058,30969,55774,31927,57598,56337,39092,55194,55927,15533,55189,21792,9066,45710,55281,55312,56399,1462,27192,55888,56625,9245,2688,57637,57039,57021,1467,56847,32591,56723,56134,3881,55340,10455,1664,50938,56224,57642,13549,53682,1449,57655,5173,53617,55231,56376,38648,56124,32314,55392,55590,56305,41019,56784,32044,4400,939,32367,31143,996,55940,55233,8881,56929,6376,56277,928,57516,57354,56754,56059,32344,56757,56602,56233,1422,56709,55458,56525,55232,57694,56105,56935,57578,56744,32153,2021,988,55906,32044,29035,9461,56808,56594,56582,1572,16515,56808,32240,57608,21777,13914,976,1115,32141,56018,26844,35593,55177,56797,55507,16675,57301,55411,56336,47635,56962,56937,55971,33773,57733,56937,57670,6316,55963,55995,32266,56659,55532,55273,55413,31985,56960,55490,3506,57653,56345,56886,32240,55279,56067,16389,928,55272,56757,56302,55546,56014,4400,905,56013,55977,13385,56408,56576,1853,55775,57766,56016,57498,9342,1428,299,20852,32495,55835,52368,57569,56379,22909,56590,1464,56766,56762,56330,57599,57791,11593,55918,30713,32005,1081,13041,32016,56076,21084,56073,26844,57424,55761,55823,10129,8370,2821,57299,56841,50884,57723,55771,5898,55464,32414,56297,57816,55177,31900,57518,35248,55613,32108,1071,57104,10013,55987,4428,56940,30814,55477,55194,57077,56701,57477,57033,32005,32595,54422,936,57001,57761,49110,55513,57259,13081,31007,43792,31979,57835,31896,31839,32281,1694,4696,2039,57856,57749,10070,56355,56460,55748,1257,57461,57421,1953,57809,1706,57811,56083,56304,32428,56290,56477,1554,57364,1068,1230,428,57879,1511,31922,57558,56027,55396,3506,57328,1541,1641,22171,55692,56228,17139,32129,57100,55351,57896,56007,57752,12055,57709,32076,57192,50482,56326,55226,1471,43622,9594,32374,57443,57899,31861,2120,2317,57088,55486,57917,57894,17322,55982,56060,50339,57869,57504,10658,32221,49698,57918,55847,32071,32142,57247,57809,42721,55354,56448,57591,32224,57605,3992,5883,9500,32224,57447,4759,50067,13041,32141,56058,27132,32244,55806,55496,55769,32020,1641,55957,55242,24167,57245,57106,56618,18125,1401,55467,2073,955,6993,44579,1668,55405,31889,57304,1975,32329,11099,56273,5851,50307,55452,9466,6176,31967,56774,51859,55692,57048,28188,55411,16833,56988,57368,55741,32010,57919,32327,56793,44601,57301,32517,56288,57735,58006,57505,58008,21000,55386,56075,478,21838,56582,1071,32051,56670,55382,57394,3540,56090,6588,57666,26640,57141,58025,1578,32461,57066,32442,55607,57563,58029,31930,58023,56551,56605,1072,45466,55217,58032,55692,58032,56536,57014,31930,57048,58030,57574,57141,57907,1023,56090,58050,56165,58052,4054,2451,58048,56607,58057,13555,58041,45664,58047,57049,58038,56461,58059,32438,58064,57665,58030,58036,11219,58046,58027,58060,55901,57291,26835,55424,31884,1267,31562,55492,32101,1447,32578,57265,57554,56032,5868,56533,57417,19048,56447,32237,55297,55839,58099,56008,57503,22070,55545,1061,486,56681,57472,31972,56474,571,55631,57709,32221,9479,29035,55188,56538,31997,3053,8704,57939,57005,1351,55909,1344,57592,57809,57365,3097,31997,11091,57781,905,58126,58113,53160,55909,55304,55162,57506,24617,56229,55356,25571,57678,1359,57809,56689,6993,55168,58124,2052,55823,57551,57595,56997,1149,56287,56842,315,571,57199,55596,32296,25094,57661,56638,55206,17139,57875,6591,48367,56151,56092,53295,32501,9267,32096,32578,55219,55721,55780,56935,57064,5707,57101,57839,56620,55210,56150,55408,57279,32049,58194,55212,57503,1432,57829,939,58158,57594,57553,55819,32258,44434,32,32482,2039,31906,55542,55651,56625,57802,55655,55632,57360,56394,32303,55783,58211,8909,55955,819,57355,58127,55671,55206,36636,32179,56550,56304,58232,32114,56038,31922,32087,55281,58239,57368,5851,55548,32430,56486,56337,56125,32038,32196,55879,56789,57062,57379,55710,57381,1390,32389,25232,57380,57387,8887,58227,57390,428,58223,55919,57394,56956,1395,58237,56786,57288,57556,56418,36636,56028,58239,1269,58252,9551,58254,57189,55818,55740,13253,55329,57414,56559,56756,32190,58242,57062,14401,55567,32253,58280,56731,58233,56556,45387,57426,53556,54110,57432,10781,55159,57984,55944,31952,9072,55585,56009,8584,31888,4759,486,13183,56568,55341,4683,55529,56597,56076,7649,55771,12284,56394,55215,32733,37246,32104,58324,31968,57820,56695,55381,32172,32398,55403,55708,32499,31883,55601,44104,55823,4683,55793,56102,14128,57272,57506,1434,57393,32426,55384,56786,58354,31889,56929,57466,7071,57910,58082,56239,2095,56134,1706,55190,1432,55225,31904,1075,28136,841,57809,6841,57673,15222,55942,4354,57988,32522,57165,56306,57394,13253,55618,57876,58380,32568,58389,58122,55408,1072,55626,58377,30822,56954,58216,55872,23601,56604,1180,30939,32549,58406,57829,56575,57226,1061,58382,31844,57223,23693,57537,58388,55203,55944,56304,32450,32114,5968,56019,57503,56065,20672,57506,58119,1021,58166,57882,55818,31853,1521,55611,56461,58437,56407,10013,58324,57344,5918,31884,57841,35354,56948,57247,55948,12058,56019,888,29033,54422,56666,58420,25273,58427,57868,26102,847,55823,5993,58401,58433,57252,27120,58436,58209,58039,58440,55877,1655,16692,1148,32066,1554,57477,32162,1098,57543,58216,56004,2919,58319,16833,57847,55241,55304,55337,55277,56128,55799,28188,55233,26666,56297,1173,58212,56355,57384,58344,32572,56066,58225,26852,55774,532,887,57279,56093,31887,58502,58429,31847,915,31889,57186,532,1927,55239,55632,55233,5993,56517,58225,57919,31947,58503,31847,55130,55814,916,482,57214,55420,31952,2063,57529,32499,7075,55548,31881,8689,21777,56306,58514,57608,58516,16517,55753,2435,32491,32258,6817,55375,58498,55216,55651,31919,4054,58486,2986,32044,56992,32051,56409,2052,57586,58559,26963,571,18125,9096,1771,32037,2075,19674,58018,8002,57501,32172,53322,55359,32473,7095,4407,2527,58574,1524,57847,55901,25961,32104,56105,31904,58595,57121,55494,32076,13248,57107,14459,2105,55518,5820,57118,32237,55311,57523,8964,57661,31914,55742,3850,55587,57121,55408,56186,56205,57089,56615,55686,55317,56953,38742,1484,6960,55352,31972,56844,1460,57499,32068,5423,1140,32362,56278,1887,55387,5829,56066,56278,56941,31914,55594,55429,57921,32348,1019,56066,56376,57464,55966,996,56369,32580,32244,57261,32308,32089,32423,20897,58647,31924,58087,32438,58664,32138,12058,1183,56893,55843,32386,57895,55823,3967,57183,32477,9253,57461,56442,55267,57782,55325,57144,55408,58403,55930,8045,58688,58517,6591,58321,58145,33489,57588,56484,25994,56007,7641,58578,56816,57782,58316,57895,58428,58416,58707,2919,55637,56622,32778,55691,1704,43622,32549,58717,58087,55233,58485,32597,56002,1759,57636,56257,22751,31984,2818,58348,56058,57170,31847,1399,57636,9367,57350,5030,55416,58560,31997,2768,57689,58354,56463,57226,32499,32436,32025,2997,58463,34015,58350,58148,31245,57053,1052,58348,56360,56229,58749,1685,6960,1148,58348,58361,46690,32477,8594,58534,57344,6176,56841,994,31842,20897,55825,57550,26679,55608,32272,58355,922,57444,32020,57790,5196,8304,55671,58787,32494,55809,6255,36742,57159,31895,58794,1061,32487,5820,57844,56604,19644,55719,32070,56552,57868,55219,57057,58795,55672,58476,31975,58799,57357,57863,56574,31923,58790,58528,2063,16385,17378,58574,31889,55275,1148,32558,57868,57700,56858,56161,56052,19764,58806,56636,58831,15494,57936,56699,2078,58743,57882,57829,58399,32453,57292,56390,1237,57529,55455,55398,46341,58574,55903,58459,32111,1019,56356,32461,58386,15222,58348,58863,57554,55223,55802,58759,32038,55450,55385,55480,14631,57089,31864,58650,32565,56519,55985,58636,55934,2138,58765,888,58678,56643,5429,58700,29147,55818,57809,10666,56356,55299,11646,58861,1159,58658,58836,57959,1562,57847,21235,57673,31870,56325,6493,21553,56728,32071,58632,8704,12111,1692,56307,58676,56174,55245,58198,58675,58518,1771,56140,4014,58877,58655,24267,1122,58819,58878,58830,58596,31870,3073,58834,57270,58733,9697,58933,57121,58841,58937,58743,58291,1061,58152,57172,58350,56636,31839,31992,1538,57494,57411,32414,1455,32482,1552,32173,58087,58835,27379,56450,57506,7720,58527,55620,58839,55829,57160,8890,58155,58143,1760,55823,58967,8890,55620,55249,24887,31871,58972,24599,32323,55621,1162,55261,55464,32423,33489,32102,58720,55789,31965,55611,916,58959,8004,58718,888,55252,55804,3651,55823,58245,58997,56539,1257,6799,56867,57289,58210,15760,56568,56109,56550,916,58517,7075,59001,56442,58473,57722,3033,55298,56304,58471,57722,6182,59027,58532,58954,56829,58966,58984,905,58536,56570,49578,31933,58960,55354,3949,58681,32386,57731,532,1562,55404,32070,41777,55622,25232,55716,1706,57436,56604,57047,58761,41426,58792,28448,32096,55319,6493,36584,58818,58815,55446,57829,48273,57159,56277,56143,59072,55740,12111,57572,32327,58784,31967,49179,32277,55586,58794,5551,58792,58298,59071,59068,5587,32253,58789,59067,58430,25094,57705,58700,44426,58900,55912,1430,55240,57374,58434,32122,59007,1993,58378,58996,1993,55168,1993,55912,59061,58659,10129,55592,55924,58235,59111,59013,55167,56701,32274,7209,57506,59109,58896,21577,32281,59017,55836,20290,3385,56151,59112,59125,8149,58906,58399,59130,56539,58981,32284,5779,58235,19279,56104,56043,59139,32499,2105,32196,58858,58045,57072,56291,58949,56031,3704,55219,32263,58954,55793,32499,3925,58751,58766,44562,57014,10070,58115,26666,58772,32037,59082,31863,27184,55291,56324,56632,31904,3038,59182,57466,3033,55890,1173,58132,58485,58835,9466,58738,55826,59186,32437,55748,55194,2505,32077,32354,58269,55823,9272,55818,55335,57724,835,57809,58372,55385,58216,32044,29994,32327,55594,56765,794,58880,31842,57967,56875,55698,55257,57247,59227,56915,58882,59191,5084,58530,4389,56485,58124,25961,59081,58747,57030,8584,55753,31896,59010,36473,58158,59245,59174,4165,32270,838,57470,1458,57771,16326,55604,32279,55311,55370,56076,1599,32020,32478,32083,55512,3899,56496,59146,32092,1081,56369,55981,59008,58638,32158,58603,3026,14054,55258,58452,52552,3878,58942,55707,7213,13571,59280,55319,929,8772,57682,55461,56577,59285,56165,32462,903,58204,38648,57041,32323,4767,56093,58145,56790,57033,58388,55194,56538,59275,32574,32188,55810,59275,57254,55462,1796,58848,55180,2688,2030,55345,1145,13385,58886,1096,58632,1796,59302,32376,58125,56260,32286,38078,31997,58682,1690,57414,55304,7993,56913,32501,2581,58777,31947,55578,59281,55612,58613,59347,58458,55405,58949,58218,2148,55373,2872,57680,57900,56329,56496,59248,2529,1104,2039,58607,59037,31914,57882,20461,57743,56829,31900,9066,32567,31934,59352,54144,57499,59295,13380,56670,6332,56947,55859,55208,56176,55461,1792,819,32501,55833,3653,18837,10673,58348,55373,55670,57590,59331,57469,32455,59381,1108,58918,57293,32526,55753,56175,20897,55552,331,59238,32384,2073,57121,55842,58670,31975,1023,28819,55824,56128,56043,55846,59217,4296,29005,56224,925,57541,59392,55850,1785,57049,9017,55548,32461,57552,56560,6695,59413,32467,59433,1717,1104,56281,55861,1887,36636,32244,55657,55576,55301,59451,32323,58339,2120,58753,2063,55177,58148,13911,55639,58507,58572,3547,32111,6768,55904,32379,58878,55641,32196,56899,10091,55658,2138,45833,13275,58458,55411,55872,58108,5955,58567,55813,57624,58594,59237,55586,2023,58495,6255,58732,58566,9697,55168,9272,57343,58893,1521,1240,58700,2028,59501,8936,58846,57503,1441,57522,58399,58349,57127,44266,57053,58354,59117,59510,9066,59517,58767,57072,58444,51736,58438,58497,58741,26963,58158,59503,57393,59302,31906,45226,59466,59529,3547,571,13183,56676,58325,32018,1067,56287,10963,32071,58167,55227,56972,8417,58527,1091,57196,55898,59552,58973,56605,32329,9367,58145,59166,58756,1077,55426,58002,58952,58807,59287,39395,59244,58934,57845,9972,59436,56683,55510,56981,59204,32155,59577,58073,59440,56354,55660,57798,14459,57253,57957,55354,32445,55915,32578,3804,59449,3527,2093,56008,59596,59318,4357,58456,56109,52175,32442,59259,58587,56232,55853,59607,32461,59061,1939,55566,57343,58634,59290,56922,59096,59617,32298,59195,48654,59541,45226,59579,58738,57466,8964,57599,58746,56755,56396,49550,8704,57299,31961,1306,32434,59638,32344,59416,56105,57219,31958,19263,56085,1178,57743,58916,9461,59443,58645,36611,59602,56676,56380,56015,3878,26920,31975,58670,26823,55793,56942,58530,17378,2073,26920,31945,57094,11111,32515,57104,9466,57832,59652,58084,1237,55887,59678,59649,5858,32436,55901,55031,57413,32461,59263,2773,59206,57525,32430,2073,1511,58298,55910,8310,9173,56121,55498,31972,59456,59369,32402,42993,58948,57918,58756,3065,57440,55262,59309,32291,34315,55618,59572,58619,56883,57238,58269,59365,59371,14651,58762,59723,55518,59437,55978,59132,57965,58605,38078,14651,56344,56166,58923,58391,56015,56342,59224,5123,55987,57039,59667,55671,55294,4400,55188,58137,32514,59736,59733,4389,59731,57659,2093,59011,59369,57477,59728,59680,55196,59760,59366,57544,31849,2141,57706,10202,59616,59408,56904,58465,7216,59773,56043,56026,45821,32374,56724,5123,59628,31997,2138,56808,59632,58013,59510,1100,55401,56399,1242,7194,59640,996,59795,59643,1644,59372,57107,59348,55411,59112,53617,58567,59229,20976,31943,55288,56708,56174,58799,31934,59672,8936,1585,31992,59621,58014,7972,32346,57446,6774,56113,57550,4357,57258,58963,17969,57118,59049,53816,31924,4808,57680,32423,59399,59006,8584,57721,56102,39694,55810,55620,59289,59180,59775,1359,55606,32286,56118,56653,58970,55624,55179,59850,55464,56228,54422,57184,59786,59105,56605,32196,57017,31204,58824,56142,13098,57207,4669,57182,58819,59871,55420,55819,57133,57269,58464,32303,59187,55380,59346,32254,1524,3940,58927,57339,59783,57312,58675,57231,57102,58667,55993,58922,20897,56415,996,56921,59663,56935,59146,56273,57967,32092,1072,32451,59223,57656,59743,22188,58912,3829,56031,58908,31981,59812,59441,59479,1664,55705,57868,59080,1488,59388,59445,59760,59448,58894,56460,59423,2150,55491,58632,56939,55872,59935,59375,21777,57845,6768,57077,5162,32104,32122,59166,56329,3506,903,56049,56110,20301,32354,32351,59801,24887,55651,59348,1061,32037,59831,56151,10646,56141,58561,55512,57612,486,59547,23726,59835,58570,5030,55257,56609,58561,58872,56012,44056,57407,32227,59104,28136,57585,59976,57744,58148,59625,1588,35411,57434,9134,59164,32345,1081,57141,55168,56979,28188,57184,57739,55985,57930,56937,6695,59787,59415,56692,32528,57150,32005,59378,10523,58580,56043,60001,48604,59494,55533,31889,59787,56743,55196,56995,57301,55979,59942,60027,3899,57873,55821,56913,1417,57874,56247,57182,50459,32076,56256,56474,56761,57575,59856,55320,56618,55594,60045,1237,57038,55464,32389,57727,60051,56329,32066,50322,11113,57266,5036,58334,28419,56399,56466,57056,55915,58187,32163,32471,38631,31878,56235,41256,32414,59011,60073,56613,59962,56958,1419,59815,55442,55912,58676,56751,56384,47335,25503,55268,55341,32188,47335,55371,24444,58702,32171,5196,56517,59634,60001,56830,57739,55396,60104,60006,56168,60011,55443,56433,55307,58311,60016,1679,55935,35567,8622,31929,32511,60004,14631,1404,32540,56209,12238,3976,55829,57249,11517,58000,57861,10091,57811,60038,55271,32186,60042,55549,1655,56762,60046,58520,60044,58776,60056,55857,3432,53762,32247,55373,60057,56076,60059,57265,32332,55525,55992,60065,55780,55779,59151,56986,57697,32455,57611,2113,60076,55232,36708,58340,56636,55825,60083,2985,60085,55833,58102,4211,60090,55410,57205,57477,4211,55277,9256,58335,1641,32068,57781,841,58532,5851,55369,56250,56436,57690,58615,32104,58368,31877,56209,31900,55867,44434,56380,55254,58620,56673,31912,55450,58412,31914,56070,31904,32595,59465,56877,56212,3506,56353,55869,56476,56416,32080,57300,55635,32227,59368,56851,13424,32227,56018,59926,56140,59067,55963,32329,1476,55975,56339,56173,59264,60220,33606,60242,56277,60242,5878,57648,32253,60248,55819,60074,4211,55262,31936,56912,59716,22188,58815,55215,59696,58850,60019,32467,55465,13576,57837,976,31871,60262,5714,55641,55780,57664,8584,32441,31968,31972,25677,1781,5898,1304,60279,55876,16800,6340,56946,2093,55570,3926,57773,55815,6695,55295,13914,59443,32089,9618,59422,10666,56414,55324,59040,45142,55416,56118,55324,2075,1692,32271,56208,57756,60198,56138,60078,57472,55853,55176,58368,55477,60257,57247,55949,56257,17589,26092,56763,58657,58686,56343,59751,6588,59670,55798,2035,58726,56260,58480,56146,60202,56202,60254,56569,57249,56075,55599,47839,58407,32344,55649,57226,59131,57363,60005,57888,32070,56085,35834,56617,57250,60208,58567,56181,56543,56406,56551,56167,1488,59471,55411,55535,55800,32296,60211,36027,59911,55676,60376,59349,60214,56405,57685,56277,56508,60366,60384,55435,60129,55692,60086,58018,55642,57130,56348,56277,60224,56340,56381,56748,57629,59131,57639,59642,57450,37719,60370,59983,58299,32076,60025,6202,60404,56894,53816,16502,58580,58250,56350,56904,60394,48366,32242,55888,60422,6870,58000,57017,60359,7434,57702,59750,57190,30595,60308,60309,56323,9245,60357,57030,60440,57707,55897,55448,55933,6202,3664,56512,32042,56694,58454,56436,55467,56070,32341,55441,32027,60386,32038,56206,55684,60365,58624,56281,55789,60373,59446,60332,29994,59737,57612,16573,57287,57238,55761,57409,32012,60125,56202,57978,57216,60412,58454,57650,57782,60359,56202,55249,56048,57743,13880,57701,57697,55163,57758,55863,3653,13961,55993,58243,8805,60337,57307,56861,55957,32020,27896,55352,32428,57895,60041,55738,12392,56150,60142,2524,57453,59804,55553,6202,57778,32140,60420,3878,56623,56461,60498,55265,55834,60384,56280,55673,9017,57685,17047,2150,56028,56881,23789,55622,56770,60204,21448,58297,58393,60307,55863,60386,56456,8704,56253,24137,32240,60102,32272,56270,60246,57983,57648,10523,59074,32224,60252,60244,57806,60252,57004,58140,10658,32075,55828,32268,56874,60224,55861,3044,31874,51902,56393,56425,6748,60280,60377,15030,3044,50770,55859,59889,838,60422,32568,60216,38572,55862,55633,55742,44104,60426,59439,59074,14521,59386,56258,4365,56179,26852,60433,2985,56057,56755,59320,24238,57468,57775,60129,59203,56798,37088,60400,60163,60553,32186,24062,59872,58615,56585,60490,60624,59877,58478,58370,9367,55616,60392,56396,60357,57184,56611,55895,57062,56608,59436,60394,60550,55305,57696,56668,60251,57786,60484,55564,57523,57776,1326,12837,57540,55266,55742,55793,55853,55562,57944,56127,55530,56145,32561,58273,56442,60599,56975,58022,60036,55821,60339,57668,55205,55358,20510,55837,56827,55878,60395,60593,55633,1019,57170,60581,56177,60585,60217,60430,55324,60543,55880,60586,58393,55870,56834,60367,56472,60635,59423,55454,60361,56944,56673,32363,56508,57024,59085,59075,56874,56991,52552,55883,59386,60703,55460,58922,60472,57261,56550,60589,55314,60700,58927,56176,56944,60371,60727,57456,59510,60151,9697,57299,55738,57030,57409,55789,56982,58874,60365,32129,60702,55641,60392,58598,58044,56629,59226,59470,20897,60427,56113,57492,59835,1588,60750,56915,13497,59631,56314,56071,58179,3407,60455,55587,6918,55920,57739,57839,31899,57563,8026,60002,60144,57563,58437,59923,60772,60045,3038,22751,57706,60539,21268,55254,55789,56740,1937,56795,60181,45204,56078,57491,1496,58215,32491,47839,57381,46853,56923,57284,32126,41162,57885,4080,60025,55199,57453,56364,60404,58620,55595,55296,60402,59686,1785,59527,9129,32563,1760,55606,32173,41878,32001,60457,60005,57068,32553,57644,60203,59555,57728,8890,60656,31951,32227,32153,60321,58391,60283,55424,32346,60476,58406,58992,43113,57754,55448,56884,8798,5087,56273,55990,32543,56951,56390,60722,32540,56874,60686,60289,56441,60863,59745,27892,1937,60367,60031,18587,59074,56311,6501,60173,60714,13854,57094,32568,13814,58359,32119,55884,32096,32277,1456,57637,55552,60296,60866,60279,58914,60023,32540,60241,56726,55748,32258,56252,56452,60282,4360,60892,2052,55522,60580,55230,25756,57945,56043,1344,55337,4767,59653,21300,58563,9049,32104,51953,56575,59465,60302,60920,3840,58657,58506,60313,58468,56848,56137,20279,60317,56817,60315,60932,60797,56156,58422,32354,6134,55175,57552,58637,60485,32473,56670,60333,55368,55309,60502,60508,60675,5549,55861,60400,60343,60079,60955,60207,60058,60349,56393,3021,57253,57875,5854,59701,57691,59609,58912,60579,58791,56217,60971,56293,55692,56214,32095,55468,59304,60218,55593,60438,55387,56523,32227,55264,47635,56443,57104,57040,57682,60814,57104,60410,60415,59764,56245,60997,17847,56827,20057,60940,56129,1104,55807,5580,56721,60608,21792,56242,1820,61010,26601,56229,56913,57692,55435,60314,58602,55967,60447,60809,59936,58937,56975,56166,56577,46051,55626,60645,30939,58817,55755,32350,60188,60480,56179,943,61000,60484,56984,57174,59555,60488,32270,31926,59079,59536,12707,60553,55259,57754,55692,32329,49855,55445,58285,59908,32034,55586,56664,17407,60951,59492,60510,6154,57822,43660,57453,32071,57868,48654,56833,55924,56864,60522,55467,56868,57315,57035,55985,60226,55633,60487,9466,59424,60874,14731,55499,56739,56814,56516,60007,56339,57423,2093,57041,60552,60554,58495,55487,60173,60980,55560,60394,56879,31912,60863,50770,6585,60478,60595,38877,60535,60744,60601,56678,59223,61112,56470,60995,55862,1520,60595,60378,24246,55718,60145,56188,56211,60471,16942,56222,32057,55849,59125,4810,55337,58470,55982,58250,55916,31896,60323,58874,61084,56342,9159,57468,56604,56637,8805,52908,21307,60876,56619,57200,59770,56065,59877,5883,60321,32005,57868,60630,57803,58540,55423,8426,55413,56949,56021,58291,60966,60750,60738,56514,32284,60910,32086,56206,60478,57955,59298,56304,57724,56985,29511,58589,56618,56984,55163,3065,56375,60225,32258,59923,60228,55260,58947,60114,1717,56806,60765,33548,55207,56427,59787,59540,61012,32309,56743,32207,60734,55363,56406,1700,56945,32363,60543,60887,5173,55603,55573,56106,48776,55731,49389,55248,58843,60680,56577,56826,55417,59439,60418,58022,56392,57824,60711,59203,60221,60391,58797,60600,58185,10373,57754,61247,56560,55277,55656,58221,57348,57393,57351,55713,55666,57355,56971,57409,57807,57640,57423,57367,59150,60409,60513,55688,57398,60065,57372,32549,61268,61155,55737,57378,55702,58257,58263,922,55707,58429,58262,55797,55664,60097,58225,61256,57589,55948,55722,11540,56521,59782,57375,57402,60341,60737,57406,61277,57564,55757,57411,60659,1274,55745,57501,31981,4986,57417,57363,56216,55755,56521,57420,61298,32598,32600,26788,48101,57431,41554,58308,4989,32068,58926,1132,60947,58601,56295,56622,55466,57607,59672,56080,59142,32514,55444,58116,1509,57395,57491,61342,56122,56164,32434,55955,61005,56625,58528,1434,58758,58002,60406,55199,57702,35663,61031,61051,56375,61360,57266,21664,57265,56273,2055,32733,3527,60058,7937,58639,27054,55741,819,56504,57115,6202,57470,60834,36827,56568,33915,60569,32273,60757,1859,57569,61143,57146,32224,1432,61384,57344,13424,59204,57798,2066,32188,61140,60165,56892,57974,61179,61040,36742,30998,14054,60537,57836,59947,57541,56095,57806,27184,299,37575,61375,56196,60539,56695,61294,57293,61082,32080,61105,56760,60446,55842,61428,57293,60323,3253,58199,37751,60355,61436,5914,61012,56204,393,55584,61236,61406,56056,57710,60868,55484,57636,60308,56399,8594,55359,61412,56334,32335,32193,3970,32392,61398,57535,60033,55280,55396,61195,60077,60355,60977,56901,56128,61058,55940,57024,60978,55272,32289,57609,32272,56528,37365,61413,57259,56564,1304,43792,60269,57659,58389,24444,46079,32137,55684,1538,6080,32282,61474,61025,7639,32346,56846,61063,31184,61061,55288,60469,3382,61505,32338,57055,7563,57481,59047,57833,56738,56942,57482,59452,60071,56580,55464,55304,56317,60565,59585,61004,60294,60565,56415,57149,59547,60144,57768,56097,57716,56820,59512,57557,61531,55938,60042,36761,59173,56946,61542,16800,57869,49516,56222,56706,17589,55177,24267,57910,55954,61004,58910,61555,3963,59674,905,57577,59882,59199,965,57172,57419,58011,56505,57002,32499,2095,31906,59035,58571,58957,35257,55256,56953,55974,31842,60741,61535,55240,11951,57134,55537,56824,31870,60453,56097,57468,31877,5790,58547,58835,57611,4211,59006,12758,55548,55691,32076,57950,24460,58392,55467,60800,59655,60737,56720,55451,30873,55365,55917,55952,58905,56334,55748,56816,32451,59316,58623,58378,57996,32437,56539,56026,57798,60901,21000,57689,61032,56453,57770,57927,59028,57926,56472,57297,58998,2846,59334,57589,571,61464,3859,57597,56670,58317,56947,55542,939,32482,31117,55462,56303,32001,60265,60604,5582,55892,60030,61100,55874,57797,56332,55692,31965,56623,56434,60551,60923,59371,61432,32244,57857,57965,3653,59058,56442,60412,56465,58230,1173,32032,1521,58278,58739,1295,55450,3151,32477,9047,60207,58212,8417,61370,55494,60666,56766,61689,10028,32451,56370,61158,59769,61207,58513,3265,55211,32733,61120,56401,55901,25032,59462,55273,57279,32109,58244,57412,1504,61655,58389,55265,58542,7075,58837,55663,57804,58762,55371,1306,55582,60760,40379,56188,57075,61369,58476,56754,58013,55181,32068,5868,4833,56088,61344,55723,25885,55365,55999,61310,835,13911,57499,55474,1100,59603,58271,56685,60994,60299,58187,58244,3083,1426,58464,9159,57134,60080,51294,58988,61433,58449,59232,24194,57317,55494,57445,58374,58880,30822,59504,56973,57465,1331,57487,32207,59676,61057,56634,56474,57471,58889,31878,58471,5082,32169,56880,3967,4014,56488,58015,55412,58489,24078,60984,58388,56977,947,56838,42026,32461,58230,61347,56839,61814,1581,61794,60294,56943,59374,56977,60738,56956,31912,61824,32328,56045,55490,61830,61820,55490,58271,55784,61406,1376,61832,31933,61495,55505,57023,56413,56118,54976,6134,61829,60547,5919,61826,56737,58230,32083,60919,24659,11646,61819,61674,45845,61348,31860,6080,6204,56383,1079,26032,55906,55450,24137,58896,56883,56100,1240,58454,61144,54087,1578,57946,57271,56751,61757,55714,58615,31906,6918,57044,57784,2494,55634,57226,55396,9253,16838,55405,3059,58401,30228,19796,61842,61898,41878,61900,61888,51279,56259,58602,58034,21200,55509,60760,3432,58623,58248,60563,61175,17595,60063,31877,61916,51263,55998,26676,59974,58815,57877,3992,55256,60765,55484,57238,58368,61453,1081,61031,61707,32341,61910,61513,58278,56304,57008,58250,2941,56929,56481,60771,61820,32279,61949,55795,21777,31878,61903,55627,39996,59485,60883,56876,57746,6783,60884,61750,59821,61254,59983,61291,55662,15606,57389,57495,61310,60973,55673,61298,61263,61267,57375,57870,58244,55689,59409,57371,61755,57373,55682,57360,60580,57367,61280,57386,61287,61283,61920,14954,61993,55411,57352,61289,55716,60914,57393,61293,57496,61299,61297,55697,61299,56569,61301,57375,61990,61301,61306,58000,61308,32550,56079,61312,58221,61314,57420,61469,57423,61319,2152,57428,61322,51542,58306,61325,19881,28192,7006,14346,14325,31304,21902,48272,21621,24828,47747,3024,30864,27565,42059,16688,49867,57242,8937,9140,16594,17930,25782,46937,52581,24713,51723,48794,38088,12311,61560,31404,7900,6661,11601,1078,14462,39676,12253,51955,39859,49683,16796,10008,14347,29333,11904,20303,34229,48880,19302,1735,52752,10902,7662,4138,22056,48599,26762,3359,43107,5156,1768,13195,768,54727,15756,33506,5159,14284,15131,47616,30482,2022,12065,50762,2867,24563,58379,6191,20344,4804,43982,27324,2084,46328,6804,11958,4355,40129,28917,20342,31013,19506,7356,1688,1320,11095,55090,22058,8465,48468,35663,48743,528,17485,38077,3443,50941,3265,9244,49179,23246,4678,51355,7080,13091,34291,9259,33569,20342,44498,1246,6325,47210,47791,11516,48764,38055,21615,14031,25042,20472,21514,21202,3194,24927,53694,27067,14992,43676,1956,51132,1072,54096,6606,21270,27946,1405,44041,42990,14990,45373,26110,9420,54561,5017,6041,45014,49929,36584,21261,2763,37230,13345,17286,8416,13429,5114,27416,53451,25042,25421,47134,31210,5000,33469,14444,9511,44035,1819,48111,36857,28977,10020,13034,25903,54096,31284,45326,4316,3936,10188,21546,12011,20574,31257,34221,45932,7581,4850,16853,50194,10069,13859,32765,29423,41365,15949,14200,49106,43056,24930,43083,38009,5902,44768,49004,20974,10449,38681,21521,18598,22086,30307,14028,1516,8414,13484,26073,54102,46104,50304,49582,50325,2795,10179,22106,43351,15542,31141,46210,16361,3686,44520,42252,15752,4688,10232,1109,1055,54568,31801,3046,15072,13084,54278,53821,6343,46693,15607,14258,12346,43818,1729,1475,11076,48685,32464,30498,37414,11252,43791,4047,11653,16693,19045,32195,1897,4440,5827,4443,49997,48058,27393,51686,35140,14730,12328,2707,12329,51516,27175,62251,7056,8424,17057,15576,2059,4139,55090,47024,24599,8765,32845,39982,31052,5625,54587,3648,53544,50561,45967,50563,46546,42552,23381,42378,23136,51915,51548,45194,54435,53757,42513,50348,52549,12866,26626,15441,9493,51310,10069,42303,27422,53594,2247,8369,16075,53529,12921,10030,34061,2855,31840,1698,8436,62367,1459,62365,52487,24289,50094,7202,45156,33701,48123,47487,1826,13526,10605,53533,31095,62371,13641,34951,4682,13429,1472,23982,45100,2918,44915,9200,45888,990,3556,9133,10489,3443,7611,22054,45156,2997,4826,2259,4365,62382,1130,13901,7313,4883,2501,42303,3697,4329,33599,4704,2944,4356,13563,41364,10044,11861,48603,45940,35875,27596,9216,10285,41069,44791,1716,14654,3115,62420,28435,33856,13662,6498,556,8956,6716,39591,4014,8440,15637,51350,19783,5996,5174,47711,33653,16107,8980,17475,6832,4028,27051,62370,42331,1971,54246,11305,62374,26889,1826,46520,28475,44234,6835,54228,1514,51788,11299,19422,7242,38030,9431,44190,9965,15180,46601,51953,44566,45209,11822,13943,10672,62419,45665,17527,52545,54351,46556,54353,58307,20896,3736,24823,50605,41815,5661,15657,4505,43622,50864,46470,14249,39334,6374,37080,9984,9119,2784,31973,4975,6137,5694,12018,11080,4917,15125,11060,11330,14483,5330,18945,12738,3948,42015,5001,35592,11430,8442,11884,1336,9675,18122,12732,1472,13087,9585,38819,3384,39721,5623,49190,4558,7754,20928,2137,21863,51348,11132,17732,8775,26756,53511,1824,53450,26760,38109,18572,52602,53651,5236,22073,43374,3080,53838,47185,6441,16054,51490,49854,39702,1763,3547,2809,19736,35082,1735,3042,11659,9178,49803,28487,29887,13494,51270,22982,8603,8206,25041,17000,17323,16826,27738,9064,51831,22976,12026,53132,48471,13528,39173,7082,34065,25010,1165,44893,13559,42942,45389,32770,44119,6177,29918,18040,11473,9868,5805,8950,1109,21020,7357,28992,7791,16842,23006,1764,17378,8366,21660,26120,49743,33910,46379,20627,52484,7973,9174,14528,24094,47277,1188,35929,12984,44275,43776,7062,62592,14997,27728,44995,22086,13014,43198,25015,44398,37284,53694,22894,28054,24473,39627,39360,17524,12157,9132,31128,8467,17099,10044,28147,28467,14619,13439,62062,11797,31909,46429,54159,4250,38692,3966,39837,19547,1229,4550,6017,29116,53861,8861,39848,36698,18907,4336,8359,5227,1688,43284,48276,17732,24802,23975,11941,5405,23781,6010,25312,48248,18030,9687,46984,2096,4229,12326,14677,15641,3239,20096,44108,55100,30823,28336,21920,57227,9157,54276,51843,48808,21883,42334,35907,5078,3554,3155,18926,42015,4484,25903,47564,9079,8905,9165,2661,30216,23238,49439,4725,35939,33769,2802,22723,29717,36734,25542,30267,19418,11387,5013,37278,27722,48437,15920,55154,54836,45479,54354,30474,43493,3435,24165,24458,14556,22015,5615,24169,13008,16809,30409,16472,32661,23646,5068,9386,40062,24169,31935,29991,10506,16472,50212,28537,1279,11756,6062,32619,44771,50092,1064,43986,17611,47828,2774,1515,35843,8603,10694,36786,23785,10977,3981,25265,41700,14202,9842,3023,30258,14860,7923,1839,20413,14983,20234,44418,10900,7076,1016,1489,13641,9535,12167,4137,16611,6150,46829,52422,1327,6243,9535,50037,1309,43364,7503,62801,12517,4106,17325,1715,62806,1719,27621,23755,12287,54341,1315,6243,10234,11357,37833,1690,48432,10850,20550,24487,7893,12095,39285,11735,44059,1129,62829,33906,2101,8500,12287,11677,27950,62837,62875,1803,11295,30072,36587,2527,50450,9401,5578,62883,5791,5138,49871,32658,30141,5429,44199,49555,27123,29072,42899,3408,51903,20143,21150,8834,26916,3465,17884,1066,3381,1719,22197,45228,12522,17945,2031,19116,2988,43022,34,80,41618,109,101,110,42867,42358,43030,41624,53758,51802,51196,37018,42220,7189,22880,15480,6443,36206,33440,15431,16333,13690,36211,14070,6444,21994,22005,42465,13699,13730,5917,13702,5939,18282,18817,18230,13708,25710,29999,35452,18868,17691,2441,17459,12062,33416,25142,36344,18335,5399,34489,2848,22596,17797,13932,18209,13715,2803,11736,28270,31438,13736,29252,13738,5296,25670,5329,55763,21229,54840,10926,3233,29726,54845,54937,9379,53835,46609,20740,3946,54852,14410,4515,1640,49174,55791,2871,1357,53627,53776,1234,54863,49713,33852,48523,13495,11382,36066,12473,62554,2071,5782,29532,9393,44739,54878,54846,5191,20929,54883,8303,23441,30531,54944,8385,54946,10572,12123,28545,44589,9442,48408,1408,4550,14681,54899,31344,50470,22081,4341,4858,26751,4293,42273,5528,7229,8372,2693,31108,28822,47630,49784,40101,1890,13458,4797,54920,5742,2107,16794,13428,10946,54927,18749,18188,6017,5782,4396,3431,54934,4774,7047,42152,6411,20474,2102,1117,54942,14607,35125,54945,10069,54947,63055,13425,54950,4349,54952,52629,1653,27902,54956,19828,5842,54960,9965,43457,3977,54964,1722,5299,1710,54968,13098,38065,50212,18838,55102,46084,33733,46476,30170,47061,13763,63005,54983,10223,8232,9221,14027,22081,10394,16426,10382,38416,10171,47129,43374,11929,6441,54998,1676,55000,22106,26742,46957,43837,9501,49779,30046,14852,51611,12264,19655,47225,2729,28732,17860,55016,50438,55018,11340,2937,55021,19942,46078,5035,51464,3971,3995,1374,47588,6183,6661,40038,55034,40027,55036,54711,53742,20598,40495,12097,4713,5843,4504,10001,44554,1692,4217,55049,7953,10266,20164,5242,5550,31631,50802,56482,14160,39517,6538,55061,3331,55063,48745,50705,55066,50243,9235,5887,10394,17547,4594,15140,12120,48545,27900,5167,40493,21777,34138,1909,12234,17585,32785,55086,22723,5723,4113,34071,12083,13314,62588,55095,1855,14729,28479,62738,4015,8593,1784,13116,5217,8593,2053,1841,41063,20415,16911,14773,3025,19491,49563,3360,48221,1394,35965,6996,55120,6041,55122,11696,19716,55125,21142,3414,18745,30533,3969,13199,55133,52709,55135,48891,31318,11310,62817,55141,46700,55412,3020,55145,5794,55147,22923,2070,44354,50284,43375,9047,59993,3528,8004,58137,31939,17517,59589,55168,1460,55170,56640,56926,60942,61553,8878,13870,61745,32529,55184,56958,56760,60813,58436,56810,60448,60416,60805,55871,60811,38877,61421,61206,56625,61439,55590,56274,32129,61918,55277,55223,57386,55769,7780,53560,51422,55257,57451,57205,60093,3527,55237,57753,55240,55342,55250,40443,61657,55247,55242,55344,58244,32501,57606,55256,60884,61422,55720,55263,49578,55993,55409,10358,8981,60136,55273,32188,7993,59821,32249,60183,58322,55499,55285,60036,60508,55289,56585,61627,55293,56098,32005,57455,60255,60339,60515,29414,55305,31900,59552,58311,55310,60199,55313,56202,61404,55576,4354,55320,58033,55347,55545,60309,8008,55327,31839,50938,55616,55332,29662,57466,55336,959,32417,55638,58706,63367,41019,59510,4767,55348,56919,56599,22171,32495,32402,55355,57466,5858,55694,55360,57969,25961,57044,63443,57603,55367,63370,49855,58444,15797,55354,55988,55376,58353,55380,61334,55576,55384,57478,55388,57523,56264,63467,36267,55395,55474,8045,61888,56203,55402,57820,61013,56203,63406,61621,55643,57303,3344,59893,56783,55419,58289,53776,61164,55534,55426,26823,2872,57026,56164,55433,59344,61546,58008,56807,55442,58008,56038,55448,56540,61666,61617,58853,56290,57696,61052,61105,32132,60267,55467,61206,20290,55472,61894,32346,2021,57862,56591,55481,55925,32568,56523,61831,56051,55491,61887,1148,31853,60357,55503,63390,27123,32396,53097,59702,55505,7762,55507,61028,55510,9201,57840,32438,56745,2032,59728,57566,3992,60906,56481,3716,6289,59770,55528,50577,55531,57898,43794,7993,57640,57825,55540,61434,55402,57764,32574,61636,61427,56616,57467,55554,58624,56829,61304,55560,56251,3553,31875,55571,58277,55568,60908,55571,60819,55578,55575,63558,60424,20624,32396,58018,63487,15490,61444,61062,61082,63343,60102,56752,55596,60058,5750,63419,57646,59323,58072,61453,61799,55613,58197,56946,55617,55904,61763,20359,59054,55405,55625,58825,55628,5153,55630,59010,58120,61892,959,55637,32188,57709,60746,55833,56510,55787,56716,60352,63634,55652,4851,61253,58220,61968,62003,57589,61258,61972,61261,61974,61034,55759,62009,61978,60513,61276,55751,61270,17408,57405,61985,57396,61275,57375,56915,57409,58256,61993,55705,61995,58503,61286,56733,61259,2494,62002,57392,61292,55721,62006,60355,55483,63661,38795,56521,62011,61272,63669,61278,55900,62016,55743,59081,56000,56461,57365,58798,61317,61266,61301,62026,55728,58304,54436,54837,53813,24114,55765,2058,57272,55769,4767,61553,55773,60618,60159,59151,57664,12837,58100,32234,61398,55920,55786,56884,58995,56110,9461,61593,55928,32148,58368,60116,50652,55802,32473,60555,57737,55829,58255,60058,55813,60326,61782,60253,56613,55822,60718,55667,60681,55830,56189,55850,61222,60720,55850,60597,1696,63600,60904,5262,63760,60345,55852,60213,56876,56270,55858,52908,56677,61124,56340,55852,55866,60367,60222,61052,61665,57887,60583,55877,60426,63777,58005,60705,59760,55887,32511,60455,32244,60011,59796,60444,57870,57802,32018,4395,57629,60201,57163,55909,59703,3547,55912,60978,61945,61144,57797,63728,63732,56884,55924,59035,63578,32162,10176,63736,60018,61102,55801,57922,61154,55936,55967,58284,55940,59686,32087,60950,56145,57604,61350,60665,63510,60325,63411,60006,32254,57064,56831,32181,55971,57743,61715,61006,1523,55331,57915,55975,60235,50671,63736,60478,57770,60754,56716,60259,55988,56197,11393,55997,59897,56831,56722,55992,60299,56971,63347,1655,57480,56006,58100,58484,61281,59023,61185,56060,57010,56019,56396,61837,56636,61629,60538,63475,1572,56031,58107,56033,63890,3103,59323,58299,56040,60620,11652,61841,56304,61091,55963,32501,1511,61232,58036,835,60610,56059,55390,56062,57012,61547,3804,61227,60763,32240,9533,56074,59686,1422,56460,32224,12758,58350,57875,32076,60487,56975,55953,63855,32092,58179,32379,61415,61431,56819,14028,56101,57503,60066,959,61235,56783,56251,57184,55984,57476,57419,27184,60308,32553,56627,61818,57666,56126,57289,4075,56847,32341,60320,61170,63515,60935,61170,63855,56142,58243,61701,56147,57589,63972,60524,57908,56109,56864,61962,56162,61859,63958,56167,59415,58779,61137,61251,59405,60728,56178,55841,55827,55417,56182,55881,56185,59388,56617,63757,60708,63986,60807,56304,57484,63864,61519,56321,56891,60803,61393,61183,56896,57249,1514,56392,56472,63810,61315,59243,56905,56159,61454,56223,64021,56227,56232,56230,55495,57559,61598,56918,55159,56239,57705,31878,61441,56244,60438,55972,56248,41815,32001,60662,61661,55874,60138,55540,60698,60953,56184,32254,56261,64051,63819,56269,56323,56271,61744,56469,56678,57944,56279,60420,61783,57725,61181,60987,56288,64067,63555,56294,56296,10963,58196,61281,56717,59485,56047,58548,56308,61441,60693,59555,56313,61131,64016,59689,60039,12238,56321,60557,57786,31877,56270,61667,58659,64096,58009,60072,60218,63788,5137,56778,60541,56411,56996,60871,60464,60533,61525,61943,58730,56357,63868,64112,56361,56922,59792,56773,61540,56367,60926,56370,64073,8986,63508,61521,61882,56015,60206,56042,55901,60088,61136,59960,60109,60375,64087,57356,58986,61357,58804,60763,56402,55792,60447,60543,55435,56409,26152,60396,63497,56414,56391,4808,56417,60668,60688,61101,60476,63762,56422,60828,59645,59257,60110,56607,63966,60196,32207,63936,56440,56188,56686,56471,56725,59151,57184,60741,61634,58391,56455,61631,57865,1295,32508,60611,56465,56726,56468,63829,61122,56246,61822,14922,56476,64006,60759,56530,57156,37575,56485,61175,58161,56490,41340,56492,57246,16692,56972,56943,64155,57935,61294,57503,61570,57603,32504,60698,63817,46576,60412,31895,61179,56722,60618,61787,56520,57398,64228,56524,60553,56461,61481,56530,56699,63622,58217,58047,58390,32504,57578,63607,56543,61936,2662,64244,56548,59124,57187,58302,55877,58302,59574,61922,57699,4885,32096,56670,61486,34230,56709,56575,56571,7095,56573,58815,32108,56577,61342,64128,61670,30605,61582,59672,56587,1183,56589,56586,56592,64278,57712,56596,58082,55350,59030,60357,64143,56740,60642,61821,56641,61598,61431,63577,56188,21577,58193,60992,6204,60408,56626,61712,55452,61434,56631,57575,63943,58230,60172,59867,56639,32119,63577,1562,57729,60830,56968,56829,56650,61390,56653,55825,56655,32185,6850,55172,64237,59579,64280,61503,56666,56987,61627,60469,32363,61110,35935,3976,63775,56996,58444,56681,3350,55311,63621,58684,56687,32071,64246,923,56691,63857,56698,61026,64129,56043,60451,58192,55962,56704,63853,56712,57695,63864,64364,44187,58666,55923,55575,56719,63508,56722,57653,55616,64190,57753,52442,56427,60296,63588,56733,56730,61087,59935,11018,61471,61092,59489,56742,32277,59856,55516,64353,57609,64248,57536,57949,56323,56453,58747,61945,56758,59836,61533,60339,418,56985,64406,56769,64409,1331,56772,55303,63598,5589,64269,63947,17465,56780,19766,56777,21000,56791,54707,57165,2095,56789,56785,56792,61071,12786,61801,60559,56798,64032,30776,56802,60189,1162,61332,63503,2985,61027,63934,56813,57624,58497,55553,60179,64055,61537,63942,56823,58334,56957,56108,63948,32001,56711,56833,63412,60803,56836,56628,57644,56840,57817,56043,63519,61962,59258,64166,56960,56789,63859,56896,58255,64332,56858,56148,1500,2565,32511,61080,35271,55799,57167,56863,56869,63606,56872,61815,56874,56314,63765,60766,61961,60790,56468,56888,61782,64003,56889,331,32102,56835,60809,64013,56381,56898,57830,55916,64019,56904,61430,63499,57861,64025,64487,60258,56911,55698,64031,64285,55294,56921,55515,4933,64143,63320,64300,56930,61337,64294,63531,61815,63999,57834,31886,64212,60714,59642,61146,56950,56374,55586,15248,58466,61669,60569,64311,56959,61962,56640,60106,63449,13868,61357,64319,56649,57270,56971,32226,64517,61027,61446,55591,56980,56449,56663,61193,60163,60648,1137,56990,64338,57050,58935,56678,64205,56999,32522,61476,56009,58271,59023,57008,63955,63914,56020,59158,57049,57016,64554,60771,57020,61348,57023,55692,56395,64291,57028,61514,61827,57032,57850,64300,32092,61216,59572,61099,60146,55363,57045,26713,58031,58062,64579,32438,7090,57053,56993,57056,56143,55818,32072,13132,57057,55818,61707,57030,58064,59377,61520,58325,58015,57071,61671,10330,57075,57321,60143,57336,57341,32121,55343,32454,57079,57341,57230,58623,57093,57092,62458,64280,57096,57328,58190,59035,57188,2123,57325,64209,3547,12069,25273,60829,57112,63441,57319,6739,59479,58233,57120,56568,26652,56921,57125,58950,57128,55377,3992,32367,1056,57133,57216,26844,58596,57147,1639,57139,1023,57141,1051,57143,59202,64689,57137,30017,60988,56937,32003,60340,57154,32154,58657,4400,57158,8058,57161,39395,60929,57164,58530,57086,58785,59497,1993,1065,59161,57104,57181,59869,58740,32419,59344,64724,57183,61659,58714,59618,32360,57103,35327,57966,58191,57194,1564,58376,59042,57199,58359,5140,57203,63460,57206,63917,15258,57215,55586,32552,64636,64750,32278,64548,5306,56806,64643,57221,64488,32162,64647,57343,64645,57223,64652,24392,57334,32778,57235,60879,2097,57097,57240,64665,62051,64663,32106,57326,1153,56088,57251,58317,57254,61379,61431,61609,57841,61752,3831,57305,60060,55540,56418,57269,57296,64683,1199,57274,9066,58108,55491,2058,57280,64692,57282,60039,57875,63562,58935,64254,17477,59947,59649,40134,57295,17581,56378,59793,59240,58777,55689,57979,43738,60060,32115,57268,4317,5820,58738,57313,56906,24996,61780,64833,64491,64732,64097,64735,57329,59228,57891,56842,64660,10393,64770,57333,57236,1901,57228,57087,58928,64766,57293,57082,58748,63647,12795,63649,63682,61970,61288,61885,63654,59399,61263,61977,63704,57378,63688,61981,61271,57370,64601,61986,63668,55697,62014,61279,61997,55225,61994,57383,61285,61281,61287,62000,61885,63681,57615,55720,57047,63685,61296,64337,62009,60355,63691,57405,62013,63694,57419,63696,58001,61309,62020,61302,57366,63705,57362,63703,57358,62027,57427,61321,42360,50971,62359,53760,4543,57434,55749,58335,57438,55832,57526,58783,64093,64004,60929,55241,64123,57449,61520,57452,61712,57454,63388,63951,55733,32487,57460,64749,61725,58650,58756,56403,59402,61796,60793,20601,57475,57667,57478,64503,61938,19669,57480,61789,32733,61562,56002,1233,57133,57491,64721,57934,60735,58783,62006,61884,31863,61424,60733,64702,58145,61415,5423,57510,57744,32327,1317,61947,57515,61912,64040,64089,56918,478,57521,56101,32152,9466,60436,58022,61018,57530,64799,55533,47839,57534,61877,57531,57538,56622,57262,57542,61581,60837,64792,57547,63418,59332,58159,58207,571,64252,32309,60442,393,58130,45466,63582,57571,57567,5121,55974,43901,58017,57573,61910,64963,57434,60432,57580,12476,57582,59029,59987,57587,57349,57590,65040,57593,55203,58207,57597,57149,56846,59554,55265,55826,56208,61928,56086,9466,22055,59774,60344,57613,55804,55719,57617,1261,57619,5718,57161,64701,57150,5544,57626,57223,57628,60371,11482,32402,55298,57492,55775,57641,58171,64302,57640,57636,65083,61830,56883,64172,57652,58289,55210,64408,8896,60496,64409,65086,55578,58608,60077,65082,59351,64936,57065,58062,64955,55386,56390,57741,58815,63881,57675,1130,58397,55741,57680,57686,45718,57949,57681,58688,57299,65112,32102,60442,64257,59597,64127,56942,61511,1588,61362,59696,32071,57704,23312,60041,63631,9550,56428,55217,64273,25743,60828,57717,58530,57719,60522,57722,32014,64066,57814,60789,55260,18025,64188,64068,59489,57735,56099,63807,57738,64702,60478,63390,59614,56884,63963,58842,56976,57863,55555,63980,59924,56728,64931,63798,64378,60497,64585,65125,63573,57672,56059,61534,60230,55815,60910,57775,63881,55405,64616,11132,58975,32057,65149,61554,55476,55748,57486,64962,57795,24452,63888,55477,60049,61482,61619,57952,46019,59686,9618,57231,61264,1717,57872,60673,55280,59793,65153,60478,65153,31900,58342,59547,61717,3154,57824,64041,57787,55408,57828,17170,61461,57832,55487,57854,64790,61490,1118,64540,57850,64413,57844,55721,64585,34837,57849,59444,60659,56329,63874,57855,59279,57858,1706,57860,55383,61678,57864,64589,63700,61166,64379,61469,65217,60131,57812,64182,57878,63864,57881,58523,57884,65272,59859,64027,60005,57327,56842,57893,57901,5121,32422,31933,65282,57895,65284,57898,49504,57906,64737,59035,57442,56327,65291,27106,65198,57916,65287,57920,58655,55217,57900,10205,63575,57867,60919,64379,60107,57932,57212,55793,56688,57937,3178,57939,58176,1509,55609,59029,57772,3777,32442,13253,57948,64933,57994,55408,57800,57659,57776,59374,57958,57616,6240,58456,56091,58981,57659,57241,26577,57289,31863,15274,57973,32442,4354,57976,59548,61039,58454,1115,57981,12479,32380,55799,56628,57987,55275,56492,61523,58795,62497,58988,59276,61626,5541,64905,62018,58003,57730,56347,57735,64167,61951,64977,58011,61148,59525,9253,57572,58019,65031,32383,31968,58055,56812,58077,32077,58066,6920,65390,58077,58040,56632,64618,59436,58070,57890,65392,58043,64619,65390,58074,65390,58072,55784,58070,54596,65106,58072,58061,56124,65403,57049,58072,65416,1581,65400,22880,65397,65395,64634,58077,31329,65106,58080,1696,56238,55311,59679,58119,58087,13049,63534,56139,59791,58093,58106,63573,58684,58098,3047,63877,55325,65079,31681,63877,59457,65442,58110,65336,21758,64552,58115,65139,64205,65434,32568,61352,58123,59408,58753,61822,59100,49558,58131,61988,55750,58134,43370,59751,58139,56023,58094,57780,58144,57872,61018,59710,65023,58138,61046,61367,59634,58156,58753,65016,24805,61716,1564,57727,58165,49637,57883,56442,58170,58329,63564,1009,58175,58181,60612,65090,58176,58182,21535,60965,58186,59151,58188,64605,64842,58604,64632,63342,64075,55615,65518,32323,58202,55308,65046,57552,65491,59540,59029,61353,58214,32021,59215,64347,64859,57346,55616,64266,58224,57351,1432,59942,57441,64310,59771,58301,56549,59135,63588,59090,61059,58251,57252,60667,65551,55252,31965,59096,59116,32551,58249,32102,58241,58283,64630,1052,61992,64883,57732,4357,65361,64882,60676,58264,60940,819,59056,58268,3026,61293,61817,58300,57200,1762,58275,58438,65582,59769,65565,58281,65553,1071,63830,57058,58287,32068,31951,59081,61175,31913,65563,61473,57058,65549,65602,55818,65604,65019,63708,62357,42602,54283,54982,778,58309,57636,63408,23601,57189,56577,58166,59193,32166,52924,58321,58490,61339,32066,58327,60822,32305,1098,57487,58333,59058,58336,64716,58454,59458,63851,10019,57166,58344,58358,58347,58754,59515,58352,55378,59518,55224,1274,58357,55391,58359,59523,59301,26766,58365,56238,32346,61164,59119,9245,59213,60954,58375,49339,59111,56816,64709,58382,55742,58828,58862,55343,15222,58451,59714,59747,58392,65235,58395,34134,61367,58399,58482,41878,58166,58690,32118,60282,58410,4790,58407,58411,32454,58414,63398,58417,835,58451,59352,60939,59603,58425,58421,32323,58709,58753,58431,58835,57199,58435,4647,59527,34017,60820,13253,58443,55371,1887,58446,57259,58448,56480,58419,57011,1426,58455,57962,60070,58453,58460,60063,59171,59849,58315,59107,947,61141,65716,65715,58441,58475,58824,58594,6774,55392,56295,58991,56652,65621,61780,59049,7693,55835,55272,4696,65627,56002,58494,61155,56546,59467,58500,4829,58550,2919,32426,58505,2435,57586,58526,8890,482,58511,55604,32379,58529,57166,55251,1004,58519,59290,58521,55820,57053,58525,1458,58527,58501,65768,65782,58533,56635,58536,55253,65092,1572,64998,61728,57926,58545,8584,61596,58374,58515,65769,58552,57487,59038,48866,61007,59528,60199,58573,6249,5626,58564,42941,58203,32344,59973,59304,58571,59538,58148,58575,56965,58578,60599,58582,61191,58585,64024,65833,57811,55651,13542,58593,58478,1432,57121,58598,65843,56105,64442,58860,64666,58611,58607,59698,58610,55771,61013,59350,1760,58629,58617,59799,64038,59388,59231,58624,52175,63518,55832,1110,65859,55695,56228,58633,59847,31912,58882,59760,57994,58640,65128,58652,58793,63550,58666,5429,55914,58928,46699,58653,61028,57725,59311,59118,13253,16857,65275,59663,58666,60311,58424,59419,61519,58673,56204,59898,2919,58678,56595,56467,58681,55311,64749,56533,58705,32057,58687,2541,13081,55714,56748,59201,2494,58694,31979,59122,59333,58699,59960,1655,65919,56390,58685,32057,58711,29485,61920,55296,58723,59188,58714,50167,32047,32428,58721,11095,59044,64094,65938,55277,58726,61527,61393,59500,59933,59496,65822,61572,2032,63494,59537,65816,59539,940,65670,61186,59496,59048,32032,58764,53097,58753,59514,56753,31997,59521,59465,58760,65651,4587,65968,55471,65970,58360,59159,59154,58771,56635,63647,65227,60145,58778,55442,58158,58781,5541,57355,59613,61034,58788,59066,55306,58813,58793,59091,32038,58809,59086,66004,58801,57172,59542,60065,59117,59569,58796,58810,59076,60225,59063,58819,58816,55558,58814,59065,56225,2821,58212,58823,57183,58826,59054,59561,58941,58832,58936,55532,57270,66013,58838,59573,32344,65711,61232,58379,58407,58847,59297,46341,32111,61692,56233,66047,59329,30873,60113,58859,56110,32568,3716,56048,58354,58866,57270,1331,58869,64978,59980,1110,59963,59222,59893,57725,31853,59231,65600,59222,58884,53097,59326,59557,58889,64136,56708,59005,61831,58895,58002,59269,55769,64123,14228,65978,56427,58904,14977,58335,59918,11371,32164,64379,65872,60893,58667,58917,58923,2813,57309,60727,59899,4647,56421,59889,57725,32317,58752,66112,5423,66033,58935,66042,58835,7780,59509,66118,57174,31884,66036,58945,65560,61202,31860,57494,32558,59568,64350,64969,60191,8974,58957,61642,59043,59022,59114,32258,17077,58977,59368,58969,58934,58971,58509,58974,59216,58976,11686,58968,66085,58982,37113,58527,58986,31940,60002,55380,65751,63723,58994,59121,59008,58999,58961,59045,2097,32578,66084,59130,61176,59363,59134,59014,3053,59016,59148,59008,59020,63443,3949,57769,60280,30602,32179,59027,5522,58997,64621,59969,4211,59033,57172,59035,66146,58509,59039,64269,59338,56295,59000,58962,59154,31884,59048,58319,59234,55938,59053,57988,847,59056,57626,61402,59060,65978,59092,66023,58820,59096,66002,59064,59076,15521,66006,59075,59087,65782,5393,31889,35834,55641,59613,65600,66006,58798,59071,59088,57749,65550,2123,26872,59089,31927,66000,1351,58464,59098,6918,65467,35650,59102,57992,60173,59106,64932,59144,59123,58235,59114,59131,59179,65125,32346,56980,66263,58624,66265,59126,61520,59129,59153,32504,61720,59757,59144,59136,1065,59138,59124,59510,3021,58443,61600,66286,64598,58861,66183,1993,59150,56447,66179,64706,59786,59157,6588,56623,59160,64969,57031,65560,56963,59949,65782,59169,58765,58753,49389,59759,59175,32329,56635,59178,66013,64036,55186,45512,59184,61072,66322,58351,59189,56478,59192,57317,59194,59779,6204,57470,61564,60276,65921,32511,59721,3026,59206,57636,55908,26682,57595,66066,59328,55345,59219,1760,31853,66350,57664,66074,59808,59225,60760,59224,59808,58622,57465,58678,55347,8548,64563,32526,59238,55641,64822,49606,64020,59695,59246,3878,66315,59250,13132,55775,59849,65600,32595,57815,9972,56577,32066,59262,66129,59265,60611,64211,59269,65877,59272,59024,66393,59276,65849,55452,66134,59803,59283,57056,59295,2585,60884,59621,59291,32563,59293,838,59381,58853,57674,65983,65657,13911,59304,57809,59306,1195,65678,64690,32442,59271,59180,4664,1122,923,59315,56224,59322,61055,58854,59316,66432,59457,65751,59326,65665,59323,59303,59332,44590,65927,59336,55311,59338,59081,59340,59083,65835,57861,65857,59806,55944,59345,58614,59961,66135,56268,58444,13497,61753,39849,66136,64211,59363,55853,59370,59367,58509,59727,60855,59954,61677,55535,32095,59961,59379,59618,59381,39552,61039,32338,56892,55800,59445,59389,56262,11342,59388,59394,58021,59397,60795,64592,66417,59636,59403,61912,14079,59406,55210,29718,12191,58918,55533,59648,11605,59718,57700,60680,58518,59420,59901,6757,56253,63961,59735,60190,55824,59429,2688,59431,58101,58621,59575,61821,66097,59439,65510,59442,11099,55188,60728,59930,53523,59600,59699,58672,36583,66539,56633,59458,63752,59461,55469,59330,57708,1509,65826,65961,61763,51294,59471,31963,58928,59474,57126,57104,59477,32106,59922,56303,59803,59936,59480,10262,57011,66041,61056,47635,60631,66367,59492,6768,61277,59632,59509,59499,32414,58748,59502,61644,59505,59500,66583,59508,36012,60000,55742,25756,58348,59475,59498,59516,55632,65650,59533,58615,56595,66598,65656,58362,60095,58851,56407,59834,58499,59827,61644,1274,59534,57918,1588,66552,66610,65528,66615,59543,13993,65961,59548,57882,32308,61332,66080,32237,59207,1724,58525,55718,58985,59559,55535,59171,66131,5262,59785,59560,63535,59570,59569,9066,61112,66511,59800,66528,32144,59607,56661,59580,65173,59611,59588,56174,55949,59587,59920,58642,32108,55309,59593,59956,57765,55211,66661,66149,66539,65704,65731,5779,59605,56091,60681,58851,3970,66675,61236,58805,58785,64478,64648,4456,57499,52978,13424,1500,57721,59627,59624,59535,32540,59623,3035,59785,65050,1021,65966,16954,55909,56549,59402,37118,60377,55895,59641,58618,59644,58602,59646,13810,59648,32247,31979,65140,59653,56261,41064,58423,58798,64708,7026,59591,59662,66507,65646,32114,31936,56467,59669,55309,59939,10288,66721,64275,59677,64316,59679,59426,1339,57196,59683,61887,66621,59687,57919,64088,55166,61202,5143,61847,59009,57014,59697,59703,59699,59242,30667,59702,58609,59790,59706,6993,59708,66461,58135,66764,57875,58394,59715,55986,55904,66647,59574,57891,59722,1077,59766,32517,59726,66779,59724,59918,59374,66280,57538,65855,61427,59426,55894,66727,4833,59740,56938,60324,59676,59914,59428,56467,66794,59749,56443,58144,66520,55684,59754,60048,31984,59757,66373,10070,66473,32517,56344,59765,59724,4683,56791,59770,56418,58748,32136,56351,59775,3378,55622,56904,66695,4361,60036,16348,66691,66696,5032,59787,66700,4646,55909,32578,52675,59637,59797,58039,66705,55612,65861,57219,65849,62367,59807,59805,59486,60715,66356,31879,58726,60744,59589,59814,66734,1843,32386,59288,61890,58444,35739,60834,41162,59989,59827,55373,57835,58201,1081,59832,486,59834,58513,18835,66496,916,59840,31906,61885,55606,1344,59845,64546,66686,65737,59510,12111,1228,61227,59598,55778,66892,59457,59860,2919,32001,59863,32027,55474,66904,32279,60051,57183,56883,60923,55329,32204,58824,56638,60307,66913,59540,59879,2529,59881,66326,58804,55347,61945,1479,59888,66071,58637,66830,66116,57833,1422,1692,59897,59903,56391,23781,55508,58923,59904,58730,59906,56156,61060,26028,60454,59912,66798,55993,66101,59917,61142,66859,61248,66564,65175,59952,57946,66488,59929,59447,66538,59932,2818,66518,58883,59484,59938,61337,59941,56389,60512,32185,65785,59951,59948,64722,60249,59952,59958,52734,66665,55411,66850,61957,65703,59963,66876,59965,65388,64592,59026,59970,27123,32152,12058,65825,59988,59826,65018,66067,56390,7075,59983,31983,66525,59466,59977,55432,66619,66011,63309,29662,66307,56522,17969,59999,32335,60021,60003,65164,60105,67023,60008,55442,60010,63857,60012,64448,60112,58459,60591,60116,60020,65763,55994,60492,46312,60449,60871,28653,67029,67042,1694,60037,60133,60034,57825,61512,64047,60781,65024,63415,60143,60140,60050,61216,60053,55997,56842,64614,61716,65439,61031,60062,55708,4851,55912,60069,60068,65512,60070,55231,60165,60074,60167,32169,57953,60170,2039,60080,60709,60174,56111,60599,64134,55387,63379,56724,67088,59525,60277,32140,62417,66633,1836,60000,63824,32001,60104,55474,60106,65375,67028,55893,65376,60014,65728,12990,57456,67035,1298,60199,63591,60121,60860,63775,60956,12058,60127,60959,64132,61647,60035,65268,60135,59431,32272,60138,66809,60141,67055,65785,60777,60987,60052,32009,60149,67137,60152,60348,58092,61506,63559,24998,65081,63944,60161,66297,65133,56192,60166,31684,56375,60078,60171,64595,56114,58779,60176,55281,60178,67089,63483,60092,63388,57520,6768,60187,3047,56804,66137,39996,60194,56399,64170,55474,63964,55288,60342,60534,58997,64131,55874,61110,60210,63785,61427,60214,56278,60696,64213,60219,59010,59890,67084,60398,58012,60227,49483,59553,63934,55467,22070,60972,61638,58246,60237,61102,60240,56316,60561,66750,55259,56353,67214,19567,61117,32117,65091,57654,60567,36919,55821,58896,64199,32023,61488,60261,31972,60263,59469,60021,31968,63464,47811,59744,65438,67232,60273,27159,63725,49606,60278,55875,60281,60847,61551,60380,60287,58203,59572,60291,56289,32318,60889,66461,60914,55362,61754,66939,11646,60303,64264,56577,61861,60309,55512,58668,56896,60314,56132,65662,64951,64451,67180,60322,61777,60225,63837,60304,61188,60329,65094,56151,60947,66805,60949,32535,60507,60338,63470,57387,63932,60203,60344,67123,3992,60961,32376,67253,63643,59115,63656,41340,65125,65481,60975,60360,64144,55613,61220,57690,60572,60387,65716,60369,60414,60475,60374,56391,55876,60372,55859,67323,58412,61714,27493,67183,60205,60459,67331,55612,60479,60682,60393,60702,64152,61032,58812,60616,63330,58620,60730,57068,5714,65084,65554,61474,32272,64223,11342,60730,67353,60599,1109,60520,60421,60702,63592,60425,67361,60894,56959,60692,5662,60622,61014,60435,56310,60990,35327,64029,56233,56231,58852,61782,60445,56519,61023,60461,60450,65170,61764,56393,63919,61584,60458,55870,32132,64223,63547,41162,64109,55678,67321,60468,67288,55860,61137,56097,46026,32042,60467,56453,56521,67185,56834,60481,64752,60461,61042,60330,65196,61045,61864,60490,61049,65132,65129,61053,57759,60528,55998,60501,8964,60503,66485,64547,60506,61509,32071,61067,59614,57367,61701,67134,56149,55302,60524,65149,32042,64486,60525,64985,24367,60499,61217,60531,64064,60530,56557,61839,60617,57734,67400,63551,60367,65587,60546,61857,56935,67391,61032,60718,56071,60555,61604,64057,60558,67423,18545,60562,67220,14340,67196,60566,59085,56650,61685,63754,63994,32263,60574,64087,60690,40021,59555,60907,60606,11705,67324,60576,66598,67398,60724,61203,55953,67488,11699,60696,63991,60598,60635,63988,60602,59120,61100,14954,56421,65461,64400,65109,59240,56151,61150,33780,60615,63900,61422,60619,61749,65129,59403,65264,950,61163,60628,61161,66913,60631,60845,954,60634,61238,66900,64027,60638,56110,32434,60641,61834,60644,67199,56667,56988,63852,56326,60651,63586,61013,60654,55537,65007,59358,9159,57852,60661,59954,55685,4931,60329,60515,65549,60669,67506,60671,57527,65218,55306,63466,67295,65037,60679,63764,67337,60695,55639,56672,60687,64162,56789,60595,60699,60972,67453,59014,60684,60697,56259,67334,60701,61238,63783,56938,56478,64543,64001,67592,67472,63600,60363,60715,63773,56424,60549,63767,60460,60123,59639,67603,67593,60731,22607,67349,67615,1717,58155,55431,64970,60739,32434,61611,64385,56515,63946,60806,63787,63638,56697,58074,67228,66555,60753,63641,61815,61394,21326,67634,1685,60762,60767,63966,63919,60768,57714,57219,61952,65207,60774,1524,60776,67057,65024,60779,66517,67655,60774,61073,8415,60835,60787,57436,67663,36919,60318,59342,66882,61145,61777,59049,25444,60801,57984,64394,63335,57333,66871,61024,60967,57487,66500,65076,67373,60816,65076,55942,60819,58441,9134,65630,66893,60825,1359,60827,65141,32254,60406,60831,56164,60833,55204,67522,56103,2991,63674,60840,10623,4833,60843,14201,60717,67711,60848,1706,60850,66849,64982,64185,66474,56478,60857,64547,61227,67118,67498,61110,67597,14474,65234,61100,60869,60384,64108,60246,61089,60081,67581,31562,56931,60880,57172,44104,61960,55546,56743,61223,59434,56734,14867,67732,56339,67420,57325,67213,60066,58250,60277,60900,56457,60902,57616,64101,63557,67254,60909,65056,55552,67404,60297,66534,60916,59861,61674,55829,65458,67264,60924,57950,38007,56575,60444,63967,55363,60792,67277,67115,57039,63571,60939,55814,60942,60328,64407,56770,64336,58610,32501,60950,67428,60952,67294,60592,60390,67081,65640,60479,67301,57126,65875,58184,56560,55300,64304,67308,60970,67367,61263,60430,32080,56738,61672,63892,56457,63607,65085,66076,60121,67373,67647,46690,67831,60996,67353,60999,67353,56108,61003,67793,63850,36611,64373,67370,56528,32398,60196,67375,56461,60357,60443,56312,57219,61022,55842,61024,65174,60399,59592,60369,58153,67341,61975,55678,55192,61037,13217,11842,56094,67413,67796,55860,63931,61843,61048,67365,63513,55460,65179,55842,67425,66246,59314,67802,61062,60505,67020,60337,57174,67435,67130,65153,60514,67307,60783,61074,63956,61076,64022,64616,61079,67359,67446,57600,58004,56347,61086,67742,61089,8351,65676,64389,57734,60790,63765,57420,61098,58362,61100,59345,64161,61104,61206,55668,60086,61108,56322,56673,61108,61113,60586,61115,52221,67476,11699,55852,67329,55208,56899,60593,61125,60586,61127,2722,27192,67405,56303,61132,67402,60860,67315,56176,63428,59797,959,61141,56141,56737,63810,67671,61804,67515,59633,55989,55304,33780,61152,60876,56870,61156,57017,61938,61160,67527,60319,60627,56134,67531,950,57597,56228,61170,60881,67962,61174,66307,56539,61146,57111,64326,60215,65056,61182,55198,57954,58392,56354,67284,32332,56360,65838,64411,61194,60168,61747,67657,63674,58984,61202,60394,65054,61672,49303,61208,64443,59990,61212,58879,56783,1502,67621,67450,56557,67729,67334,67749,58178,63596,65931,65201,61300,67010,63908,56874,67628,61237,55879,61239,64156,61241,60873,56352,59890,60248,63988,58033,58911,58605,58185,65535,61255,63650,64863,64889,61260,64971,63655,64868,63658,64870,57116,64872,57367,64874,61984,64876,13383,61987,63688,64880,57116,65567,65573,63675,64886,61998,57388,62001,57391,64892,58270,64895,57398,62008,57401,64899,63582,11138,61989,64903,61305,8974,61307,57414,64602,62021,61269,56217,64515,60215,64913,60974,64915,9647,62029,64918,62946,64920,62948,55764,61327,61172,57995,5820,66499,57907,67237,61336,56736,64811,61431,60104,61346,68067,61345,67778,61950,61349,61527,58121,1411,58212,61354,59465,55262,64560,67152,16806,57678,57266,68138,61364,58250,67862,2111,61370,939,61372,3059,61374,57445,61377,31854,64672,64983,61382,67639,56557,58271,61387,61395,57442,61391,66423,60756,61395,63873,56708,57794,61400,61339,55948,56745,61410,56657,32096,64427,55487,61812,61412,59677,65052,65214,61417,56015,60225,64005,63374,68125,12476,64612,61947,66675,56439,56909,64834,56135,58513,60937,57247,59415,60518,61299,65518,61481,60419,3065,58314,57748,60537,61447,68016,32263,7075,66895,60966,64023,66748,10013,61457,63468,55496,60708,65205,55464,67571,61945,63472,61468,61317,57760,61472,58299,68232,61477,55450,61479,63930,64037,55986,57197,61485,36012,65240,61489,60269,4726,32315,61494,60489,15412,58295,61499,66091,1093,55174,61503,61508,67429,66089,66816,67885,57307,61511,32186,61938,61470,57002,61517,61514,55487,61357,63723,57990,60580,64111,63840,61528,67478,61530,66623,64406,63397,61536,63941,25756,63536,61540,32070,63501,66122,65520,61546,67979,56201,64549,65010,65227,23511,64093,61556,55437,65299,56327,61560,65338,61563,66326,32473,2768,57405,61569,57261,61571,58735,55646,61575,5030,61577,2784,61579,67695,60284,67626,32250,60828,55769,57165,59137,66433,65635,61591,60295,55554,56682,65575,1709,59540,65061,61600,56549,6493,61603,65328,32362,16675,63912,55769,66873,41064,61611,64373,61614,63496,61612,5582,64098,17732,64450,59782,63530,61625,59104,61627,32504,65205,64181,61632,57674,68368,67204,32434,65307,64398,58528,1655,65043,61646,67571,58413,61168,61650,59411,60759,61654,29056,63418,61658,67020,67037,63783,63795,67044,68392,68220,57794,55915,65143,63920,65778,55555,67268,67824,68402,65260,61921,61589,66896,61683,61816,60569,61686,3945,57482,61690,61732,61693,15100,57109,64132,61697,56325,57858,55262,60518,61702,61159,61704,1228,56666,68415,61709,59836,61711,58553,67329,56382,60153,65221,61719,66810,838,55252,61723,65772,29056,55194,61727,57547,61729,58762,61731,1564,61733,64964,61735,64987,57217,55689,5868,61740,60036,61742,67200,59075,14201,56939,60910,61754,57396,68154,68314,59897,64975,64973,57187,65337,65731,61762,64348,56899,63724,58619,55252,61768,59326,22719,59251,4389,59469,31844,35567,67961,65532,58378,60752,66902,57479,56005,61784,1098,61786,63530,64961,56915,1610,68448,63947,64587,64951,56362,61799,67667,61797,39919,67962,55371,61807,61472,61809,56444,61873,63525,56657,64537,60007,63886,68128,61950,57824,61855,68530,66476,57234,68398,58140,61850,67702,68526,61833,60832,68540,65286,65581,32076,61839,63982,32256,67875,45590,56045,67701,56414,61848,2492,61846,61858,64225,61854,61386,12395,68554,68548,55199,61851,13509,61819,68550,63800,9987,64694,57740,58851,61872,57394,68286,20914,68268,55429,61879,4522,57824,61641,61889,59842,61886,32471,58090,67443,32038,57133,61893,55474,61895,57514,63323,61904,7780,61901,32071,61956,58610,65143,55712,64049,61909,65392,2798,64985,4752,61784,61916,63345,67987,67067,57086,61922,63938,64171,60157,61927,57773,55360,68198,56218,61595,61934,55609,64351,61941,57200,65396,60045,68267,12076,60854,64507,57516,61948,64977,68529,65375,61663,67366,61956,59960,5851,61959,67927,64475,68650,57356,68051,64861,68081,63652,61289,64866,23659,67306,56748,68060,64912,64871,61980,68064,63664,68066,61750,55493,55696,68090,65025,68073,58258,68075,55709,68077,64864,55666,64891,65043,62005,61755,57397,55725,68085,57425,68087,60739,64909,57408,62023,65370,68095,61974,57416,62022,64911,60974,62025,64914,62009,61320,855,366,67,117,114,344,110,421,43029,38890,42871,68108,51195,45958,21106,16122,36872,9927,25021,40497,27940,16130,7051,49961,16134,50724,8329,2857,1532,9799,30122,6815,8970,16144,52374,5036,49900,17477,44241,37601,50176,23180,1445,16156,5647,54448,8939,21688,16163,46576,8633,25863,25025,33631,68748,46599,49567,46052,11233,17477,7028,5036,13817,10039,18932,19109,42763,18076,16071,16188,22393,30635,16192,31802,16195,6205,10912,16199,3452,60413,6228,16204,33437,16206,37248,39435,16218,26329,16214,48097,16218,48099,62507,61323,62032,42756,16324,32229,12766,41425,7099,14996,5002,17609,63149,38832,15131,1189,48999,12968,16502,15565,52379,53917,51005,52826,15164,50832,44905,12487,37553,45603,62726,3159,23430,1261,3697,14947,35714,17651,47290,18269,35729,2718,2496,5912,49474,37054,38619,9976,5669,29786,48609,23018,16356,8455,19666,49424,19995,47674,28834,22054,46646,62548,15279,27905,42428,15606,14752,38075,39591,7216,5860,1300,982,9186,3396,10518,30329,17438,48388,5776,5813,21203,962,50813,16055,35271,45980,24600,4208,21324,7739,3357,8144,31082,16465,5162,31033,11801,15194,50356,22756,2959,65022,25321,4524,5125,53094,15054,1813,38033,43103,27759,11543,14844,37334,39565,1287,3488,44764,11537,3039,47931,48280,1984,44859,2177,62906,33547,43979,38232,7111,24407,9482,68808,1322,35903,2109,17411,25443,4700,39838,1950,1552,44949,42807,7836,7278,23868,62833,18320,68838,1423,23650,34084,68832,29616,1498,34807,39872,38913,21045,24714,29896,3554,2084,38652,907,32788,40283,44893,22312,2670,32870,56163,2042,4112,49017,52231,13459,12481,14463,3165,14588,5095,4469,53592,22300,30853,51215,45264,26971,24104,4668,22124,6983,18273,33388,5401,24195,35552,33377,41498,44377,22171,5576,2391,3078,33368,17660,4132,53185,12561,1470,34813,54980,40937,40566,23354,39522,43831,5881,47823,2109,6310,44015,9072,27519,34005,36592,5173,37565,34648,37055,10602,21615,30329,13435,49105,3480,12976,53783,5528,44064,12923,34299,27656,25862,15251,9591,7202,6613,33585,1229,14750,45516,2107,19619,8079,10027,19799,54503,3219,11819,29411,15016,41976,17148,50749,21608,6507,33693,20344,46572,4511,55140,7041,4672,17551,62072,52944,29412,20598,62068,10017,30588,53722,11432,14447,45129,22085,7092,3007,8669,53179,12742,16422,28009,29351,33383,35519,6414,15251,41395,27519,5659,1514,62763,3158,4434,2103,47020,24373,14858,46479,10394,4361,1280,52714,34881,15114,25658,6803,5770,28324,14973,50797,11410,16501,44024,1142,60925,68981,7484,12245,52532,47707,3011,11892,45203,50737,27026,44544,12765,21207,42277,17764,1153,5128,47710,34173,42417,9241,49021,35108,25269,4988,24184,11196,3067,17535,2892,31182,63142,2482,7057,7753,28161,41371,29859,9312,11361,17087,1119,20584,51352,21251,6498,9487,9691,11436,13148,16547,15114,7019,1735,3161,52380,10437,5002,4551,45466,3031,26632,15039,17783,30106,50535,34770,35560,12149,17955,6734,34195,50998,9157,10650,12901,41416,9976,22125,29934,24887,35841,2454,30227,1578,54618,69028,34607,45879,38913,42666,29802,16043,68942,23624,8674,24528,17524,11271,18067,28676,42667,69160,901,57574,6532,21941,4196,34589,18349,50461,1783,9768,18377,69238,7976,30940,34753,18382,9818,12493,39762,69237,9877,26101,33413,34562,2709,26914,13457,3230,46506,18845,25920,22174,3381,3176,12443,35103,52346,10395,3095,13240,28176,39964,38979,13574,2514,30945,9726,6014,41891,41376,7980,40291,11575,8901,22136,12359,11350,27870,5542,4255,54985,41517,7941,37846,9566,18244,1424,3121,12493,31007,37537,34706,26008,3273,8438,69297,38333,44386,34777,17610,41338,54514,30197,38392,9641,20030,24994,1892,9791,4268,12382,19190,10079,10260,69316,44946,27514,1454,51951,3100,19570,41700,14502,41442,36190,45788,64408,37865,26209,69222,3092,52553,29781,69306,17310,6402,3409,23950,20228,23868,26296,37861,3915,13132,69350,36446,5485,9579,7196,5923,4132,3915,1649,9579,25349,32532,1549,32673,15582,8453,21897,1249,51941,51409,53812,47780,33124,17585,7048,25477,36350,30131,8328,4450,1773,48180,8105,48265,37060,34842,14855,9985,5085,16624,22303,69298,4932,39644,1338,41277,13943,12184,50650,31597,46537,7167,2525,43574,299,6402,22186,8386,52263,37134,21594,3797,3799,1101,9985,6014,22939,27614,69298,53764,25320,11756,23074,10057,37856,36486,15732,44629,4883,6709,38024,19843,69383,62795,12113,23576,28433,20279,31147,39387,24528,69435,15506,69437,49135,29018,12394,44342,9431,22991,9393,23652,51430,42664,41331,28014,6603,5342,39126,69459,38913,3049,27415,1677,14647,5914,45320,3425,2212,16430,8996,2200,50851,7566,45813,15466,1353,25303,7832,7221,29970,33493,49187,8705,19843,15981,17397,26586,40207,11123,12514,11336,2999,46520,48991,7397,15181,29502,50940,16771,8813,47621,37845,69341,10171,34023,5350,4442,43021,69231,22346,11048,44760,12272,44762,62093,6865,3509,11932,5034,4700,1970,44770,33863,50705,5707,12784,44775,44288,50879,30979,1324,44781,30131,26309,39220,44786,1893,44788,69539,6062,28970,17641,10697,54213,4074,27030,7052,28078,2066,23989,24099,45048,27470,44805,13523,16986,44809,3444,44811,1662,44813,54558,17832,3369,35874,44819,6062,16430,44783,16894,9486,1814,44826,20234,44829,69575,3927,44832,12150,14771,1611,32195,53618,31265,47617,28484,13308,44843,5176,44845,54586,31187,5797,54172,16083,10126,5234,4295,44854,29915,44857,17172,37143,11704,52122,22083,12265,4678,44866,66106,44868,49798,53747,11409,7097,3472,44874,2340,12764,3231,6830,4401,16670,50614,44882,46905,41821,62581,44887,62269,44889,23620,16026,14842,9290,23770,20329,38632,13293,44899,29514,33763,53619,53538,9240,1461,54151,69515,3773,319,18686,40352,17396,50749,16973,33750,5848,50056,12486,23517,29167,53234,37751,4640,9185,14540,6490,26998,21320,52253,29821,2211,4704,25826,16849,20467,10022,4300,32772,14752,47315,69673,1450,69675,24096,7372,69679,11350,69681,44820,41655,37861,18954,36420,3328,47655,7721,14468,2545,51796,2053,15841,48455,27992,29912,26125,4823,26092,24120,69704,50439,17162,43075,2419,69709,40656,19633,50363,49345,48387,7652,26753,4832,35248,42819,7103,69339,45767,2088,2294,7032,69509,69666,69357,37272,6902,25596,22926,43396,8426,38312,23776,24671,37867,18844,42817,29797,32608,38913,24659,2729,5125,11051,47402,30954,10030,19850,50243,44167,6127,63891,2665,15645,30870,17281,34159,26824,25659,69203,26522,41349,18866,25349,69699,27387,25692,1586,32406,62283,8426,39998,26932,69767,29786,69780,69230,9540,32906,77,101,32913,867,42357,38889,42870,51800,64919,68718,54284,20632,18204,41784,29244,7281,39843,18861,22030,20828,5306,54246,19633,18997,20045,2527,48887,15533,54542,8464,12942,54086,9564,34878,26756,20407,19640,44570,55388,6746,27578,26638,4667,45053,14696,973,31154,52620,27620,5030,62195,69555,51815,37665,22791,28250,11035,62391,12756,33774,26627,62787,9353,62712,49553,35930,9222,19584,4143,5004,1080,9535,53516,1326,15385,3628,68771,19064,13639,11265,35378,29014,4788,15008,25603,22152,36555,24592,44957,6990,5417,19804,30466,28573,3128,30415,17260,69874,27111,11400,1535,37893,37932,2570,69881,26886,20952,69682,69886,16491,49766,26633,35077,13516,24174,10515,46921,13434,15146,1601,6341,43540,10393,7756,2907,25243,2439,48709,49304,26757,2898,49838,1091,31588,18082,22415,21273,22413,28848,7990,33691,69932,15618,28843,28854,7971,15623,62781,46043,62509,62033,52076,21685,41976,22027,40588,11977,18149,39845,39754,39847,22422,24022,52594,69854,48323,3186,16022,32860,13667,15686,17727,10944,17820,16552,48622,3481,2448,1494,29082,36529,27523,53401,15467,16029,18514,30886,13546,6504,46600,15567,36826,22740,40166,28334,10995,19905,30352,24486,53373,1647,27029,62752,21784,16067,55337,11755,1443,3322,44103,6224,27470,52999,12001,1737,31484,16708,31486,19896,30356,2771,14079,45701,12297,19266,36246,22173,15194,42022,16843,23976,5028,11711,16900,10737,10360,51599,69999,53815,29344,30260,12299,5417,55308,35841,3072,69855,47955,43535,19163,24678,37670,38474,19321,69654,4544,18204,48914,33391,35711,18245,69215,33367,68947,41447,2718,33358,18340,34800,33405,34723,41497,18086,70056,33341,69096,68948,19101,70061,18399,18325,20213,33362,35723,70067,41444,37566,18410,70071,18383,69293,18292,70064,68997,34662,70079,41440,33354,70070,70059,5952,70073,33372,42961,19405,18277,70053,68998,70090,35726,33412,33355,70083,33345,70062,18430,18327,70077,34778,18347,68834,70092,70058,18497,70060,69302,34720,42770,33348,35722,70113,25411,18452,18379,70106,70094,70072,70120,18472,18446,42249,69310,18450,70068,70116,68837,70130,70084,41513,18486,18293,70112,18362,33365,18436,34542,70082,70141,70108,70074,41178,5347,70146,70137,70080,70150,69254,34594,70131,35681,18416,15748,22123,15323,35289,7376,37892,38153,40456,33157,40014,13735,35289,18494,70161,9837,18499,70143,18502,37863,46516,5318,36607,41579,35454,70148,9840,13929,42923,5363,20102,70188,9879,70190,13705,9883,36475,36193,9847,70073,41177,6420,22012,53543,9844,23455,70203,41176,62985,25272,42283,9897,41864,21988,41866,34426,15210,19188,9863,9031,33159,3902,35224,9805,42542,42211,16290,63709,62783,62510,16922,13748,18856,32609,30396,30349,16737,22602,30450,30390,22605,30334,3184,15322,45734,18055,16017,22088,30283,16020,2187,14743,26044,1327,16026,2879,6396,2345,30384,10972,70240,22601,30355,30400,30451,30333,30453,2515,34386,36068,36091,21074,14113,30747,38971,37000,20491,42884,9974,36116,37012,3160,21055,24993,30730,23827,19997,21061,21099,36152,7297,36944,68790,34411,17607,42760,39575,42765,15669,16063,19203,13225,19065,16068,25174,70304,39450,40553,34997,2181,18166,50922,10608,41641,10405,39006,16103,9219,6037,4477,18577,35451,24967,34477,40521,70231,65610,45956,54981,40938,4163,12181,41420,70274,36125,19424,62976,48081,29872,37957,21969,70282,37849,26534,36149,19990,70287,37949,7708,38918,70291,43167,36430,36152,16717,9810,28259,23876,25685,13738,6562,22077,19489,17879,18097,19598,6976,19601,8887,19603,50288,49853,24288,18171,16123,16042,21988,70325,19552,28102,17900,33149,17204,17904,6101,9787,18553,42477,14030,46108,42309,10711,29668,30106,68722,12522,19606,17917,19509,69012,41432,45199,12539,48066,40590,69949,42628,70311,24951,22815,2190,9783,4548,42522,40186,30433,39067,70413,18666,2355,40570,42536,2422,41987,30138,9856,32991,22036,18672,70426,18675,30137,8968,40420,3403,2847,53800,50377,53802,46410,45188,45972,45190,54432,50570,45622,53555,70232,50574,70234,16324,18649,40184,21357,42523,42521,17231,39750,18658,8032,24952,53726,22050,25113,22814,70423,19059,42532,10276,42534,70433,70472,30440,70436,22822,70430,70229,7337,42637,6646,50560,54425,53801,62347,54428,70445,53550,70447,53552,54433,43484,53810,70331,48679,51944,25221,37751,2744,25224,28727,12125,2172,15652,25230,24570,37290,25234,8448,48206,6651,31166,39771,53962,3862,25243,50612,25246,40159,53289,28509,50167,10122,4317,50360,25256,26693,3344,2755,21795,22369,1262,29346,25264,24354,46086,57093,52640,18922,46130,9491,27030,26114,3156,3598,26221,52030,17097,8862,41209,25284,63264,2440,33426,25289,46297,34896,31687,25294,54422,14436,819,11367,25299,1937,25301,1470,9637,2094,33451,22120,27577,30552,25311,46477,47655,1196,25315,26209,12494,9739,15904,25321,54789,45473,1053,25325,34004,32905,125];

    function getIconModal() {
        if (!modal) {
            _icons = JSON.parse(LZWDecompress(_icons));
            //_icons.Shapes.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 116" width="32" height="38"><path d="M50 0L100 29L100 87L50 116L0 87L0 29Z"></path></svg>');
            //_icons.Shapes.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116 100" width="38" height="32"><path d="M0 50L29 0L87 0L116 50L87 100L29 100Z"></path></svg>');


            //document.write(JSON.stringify(lzw_encode(JSON.stringify(_icons))));
            var content = '';

            for (var k in _icons) {
                content += '<div class="n2-form-tab "><div class="n2-h2 n2-content-box-title-bg">' + k + '</div><div class="n2-description">';

                for (var i = 0; i < _icons[k].length; i++) {
                    content += '<div class="n2-icon">' + _icons[k][i] + '</div>';
                }
                content += '</div></div>';
            }

            modal = new NextendModal({
                zero: {
                    size: [
                        1200,
                        600
                    ],
                    title: 'Icons',
                    back: false,
                    close: true,
                    content: content,
                    fn: {
                        show: function () {

                            var icons = this.content.find('.n2-icon');
                            icons.on('click', $.proxy(function (e) {
                                var node = $(e.currentTarget).clone(),
                                    svg = node.find('svg');

                                if (svg[0].hasChildNodes()) {
                                    var children = svg[0].childNodes;
                                    for (var i = 0; i < children.length; i++) {
                                        children[i].setAttribute("data-style", "{style}");
                                    }
                                }
                                callback(node.html());
                                this.hide(e);
                            }, this));
                        }
                    }
                }
            }, false);
            modal.setCustomClass('n2-icons-modal');
        }
        return modal;
    }

    function NextendElementIconManager(id) {
        this.element = $('#' + id);
        this.button = $('#' + id + '_edit').on('click', $.proxy(this.openModal, this));

        this.preview = this.element.parent().find('img').on('click', $.proxy(this.openModal, this));

        this.element.on('nextendChange', $.proxy(this.makePreview, this));


        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementIconManager.prototype = Object.create(NextendElement.prototype);
    NextendElementIconManager.prototype.constructor = NextendElementIconManager;

    NextendElementIconManager.prototype.insideChange = function (value) {
        this.element.val(value);

        this.triggerInsideChange();
    };

    NextendElementIconManager.prototype.openModal = function (e) {
        if(e) e.preventDefault();
        callback = $.proxy(this.setIcon, this);
        getIconModal().show();
    };

    NextendElementIconManager.prototype.val = function (value) {
        this.element.val(value);
        this.triggerOutsideChange();
    };

    NextendElementIconManager.prototype.setIcon = function (svg) {
        this.val(svg);
    };

    NextendElementIconManager.prototype.makePreview = function () {
        this.preview.attr('src', 'data:image/svg+xml;base64,' + Base64.encode(this.element.val()));
    };

    NextendElementIconManager.prototype.focus = function (shouldOpen) {
        if (shouldOpen) {
            this.openModal();
        }
    };

    scope.NextendElementIconManager = NextendElementIconManager;


})(n2, window);

function LZWDecompress(compressed) {
    "use strict";
    // Build the dictionary.
    var i,
        dictionary = [],
        w,
        result,
        k,
        entry = "",
        dictSize = 256;
    for (i = 0; i < 256; i += 1) {
        dictionary[i] = String.fromCharCode(i);
    }

    w = String.fromCharCode(compressed[0]);
    result = w;
    for (i = 1; i < compressed.length; i += 1) {
        k = compressed[i];
        if (dictionary[k]) {
            entry = dictionary[k];
        } else {
            if (k === dictSize) {
                entry = w + w.charAt(0);
            } else {
                return null;
            }
        }

        result += entry;

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);

        w = entry;
    }
    return result;
}
/*
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    return out;
}*/
(function ($, scope, undefined) {

    function NextendElementImage(id, parameters) {
        this.element = $('#' + id);

        this.field = this.element.data('field');
        this.field.connectedField = this;

        this.parameters = parameters;

        this.preview = $('#' + id + '_preview')
            .on('click', $.proxy(this.open, this));

        this.element.on('nextendChange', $.proxy(this.makePreview, this));

        this.button = $('#' + id + '_button').on('click', $.proxy(this.open, this));

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));
    };


    NextendElementImage.prototype = Object.create(NextendElement.prototype);
    NextendElementImage.prototype.constructor = NextendElementImage;

    NextendElementImage.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.val('');
    };

    NextendElementImage.prototype.val = function (value, meta) {
        var meta = $.extend({alt: false}, meta);
        if (meta.alt && meta.alt != '' && this.parameters.alt && this.parameters.alt != '') {
            $('#' + this.parameters.alt).val(meta.alt).trigger('change');
        }
        this.element.val(value);
        this.triggerOutsideChange();
    };

    NextendElementImage.prototype.makePreview = function () {
        var image = this.element.val();
        if (image.substr(0, 1) == '{') {
            this.preview.css('background-image', '');
        } else {
            this.preview.css('background-image', 'url(' + nextend.imageHelper.fixed(image) + ')');
        }
    };

    NextendElementImage.prototype.open = function (e) {
        if (e) {
            e.preventDefault();
        }
        nextend.imageHelper.openLightbox($.proxy(this.val, this));
    };

    NextendElementImage.prototype.edit = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var imageSrc = nextend.imageHelper.fixed(this.element.val()),
            image = $('<img src="' + imageSrc + '" />');

        if (imageSrc.substr(0, 2) == '//') {
            imageSrc = location.protocol + imageSrc;
        }

        window.nextend.getFeatherEditor().done($.proxy(function () {
            nextend.featherEditor.launch({
                image: image.get(0),
                hiresUrl: imageSrc,
                onSave: $.proxy(this.aviarySave, this),
                onSaveHiRes: $.proxy(this.aviarySave, this)
            });
        }, this));
    };

    NextendElementImage.prototype.aviarySave = function (id, src) {

        NextendAjaxHelper.ajax({
            type: "POST",
            url: NextendAjaxHelper.makeAjaxUrl(window.nextend.featherEditor.ajaxUrl, {
                nextendaction: 'saveImage'
            }),
            data: {
                aviaryUrl: src
            },
            dataType: 'json'
        })
            .done($.proxy(function (response) {
                this.val(nextend.imageHelper.make(response.data.image));
                nextend.featherEditor.close();
            }, this));
    };

    NextendElementImage.prototype.focus = function (shouldOpen) {
        if (shouldOpen) {
            this.open();
        }
    };

    scope.NextendElementImage = NextendElementImage;
})(n2, window);
;
(function ($, scope) {

    function NextendElementImageManager(id, parameters) {
        this.element = $('#' + id);
        $('#' + id + '_manage').on('click', $.proxy(this.show, this));

        this.parameters = parameters;

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementImageManager.prototype = Object.create(NextendElement.prototype);
    NextendElementImageManager.prototype.constructor = NextendElementImageManager;


    NextendElementImageManager.prototype.show = function (e) {
        e.preventDefault();
        nextend.imageManager.show(this.element.val(), $.proxy(this.save, this));
    };

    NextendElementImageManager.prototype.save = function () {

    };

    NextendElementImageManager.prototype.insideChange = function (value) {
        this.element.val(value);

        this.triggerInsideChange();
    };

    scope.NextendElementImageManager = NextendElementImageManager;

})(n2, window);
;
(function ($, scope) {

    function NextendElementList(id, multiple) {

        this.separator = '||';

        this.element = $('#' + id).on('change', $.proxy(this.onHiddenChange, this));

        this.select = $('#' + id + '_select').on('change', $.proxy(this.onChange, this));

        this.multiple = multiple;

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementList.prototype = Object.create(NextendElement.prototype);
    NextendElementList.prototype.constructor = NextendElementList;

    NextendElementList.prototype.onHiddenChange = function () {
        var value = this.element.val();
        if (value && value != this.select.val()) {
            this.insideChange(value);
        }
    };

    NextendElementList.prototype.onChange = function () {
        var value = this.select.val();
        if (value !== null && typeof value === 'object') {
            value = value.join(this.separator);
        }
        this.element.val(value);

        this.triggerOutsideChange();
    };

    NextendElementList.prototype.insideChange = function (value) {
        if (typeof value === 'array') {
            this.select.val(value.split(this.separator));
        } else {
            this.select.val(value);
        }

        this.element.val(value);

        this.triggerInsideChange();
    };

    scope.NextendElementList = NextendElementList;

})(n2, window);

;
(function ($, scope) {

    function NextendElementMirror(id) {
        this.element = $('#' + id).on('nextendChange', $.proxy(this.onChange, this));
        this.tr = this.element.closest('tr').nextAll();
        this.onChange();
    }

    NextendElementMirror.prototype.onChange = function () {
        var value = parseInt(this.element.val());

        if (value) {
            this.tr.css('display', 'none');
        } else {
            this.tr.css('display', '');
        }

    };

    scope.NextendElementMirror = NextendElementMirror;

})(n2, window);

;
(function ($, scope) {

    function NextendElementMixed(id, elements, separator) {

        this.element = $('#' + id);

        this.elements = [];
        for (var i = 0; i < elements.length; i++) {
            this.elements.push($('#' + elements[i])
                .on('outsideChange', $.proxy(this.onFieldChange, this)));
        }

        this.separator = separator;

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementMixed.prototype = Object.create(NextendElement.prototype);
    NextendElementMixed.prototype.constructor = NextendElementMixed;


    NextendElementMixed.prototype.onFieldChange = function () {
        this.element.val(this.getValue());

        this.triggerOutsideChange();
    };

    NextendElementMixed.prototype.insideChange = function (value) {
        this.element.val(value);

        var values = value.split(this.separator);

        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].data('field').insideChange(values[i]);
        }

        this.triggerInsideChange();
    };

    NextendElementMixed.prototype.getValue = function () {
        var values = [];
        for (var i = 0; i < this.elements.length; i++) {
            values.push(this.elements[i].val());
        }

        return values.join(this.separator);
    };

    scope.NextendElementMixed = NextendElementMixed;

})(n2, window);
(function ($, scope) {

    function NextendElementNumber(id, min, max, units) {
        this.min = min;
        this.max = max;

        this.element = $('#' + id).on({
            focus: $.proxy(this.focus, this),
            blur: $.proxy(this.blur, this),
            change: $.proxy(this.change, this)
        });
        this.parent = this.element.parent();

        var $units = this.parent.siblings('.n2-form-element-units').find('> input');
        if (units && $units.length) {
            $units.on('nextendChange', $.proxy(function () {
                this.min = units[$units.val() + 'min'];
                this.max = units[$units.val() + 'max'];
            }, this));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementNumber.prototype = Object.create(NextendElement.prototype);
    NextendElementNumber.prototype.constructor = NextendElementNumber;


    NextendElementNumber.prototype.focus = function () {
        this.parent.addClass('focus');

        this.element.on('keypress.n2-text', $.proxy(function (e) {
            if (e.which == 13) {
                this.element.off('keypress.n2-text');
                this.element.trigger('blur');
            }
        }, this));
    };

    NextendElementNumber.prototype.blur = function () {
        this.parent.removeClass('focus');
    };

    NextendElementNumber.prototype.change = function () {
        var validated = this.validate(this.element.val());
        if (validated === true) {
            this.triggerOutsideChange();
        } else {
            this.element.val(validated).trigger('change');
        }
    };

    NextendElementNumber.prototype.insideChange = function (value) {
        var validated = this.validate(value);
        if (validated === true) {
            this.element.val(value);
        } else {
            this.element.val(validated);
        }

        this.triggerInsideChange();
    };

    NextendElementNumber.prototype.validate = function (value) {
        var validatedValue = parseFloat(value);
        if (isNaN(validatedValue)) {
            validatedValue = 0;
        }
        validatedValue = Math.max(this.min, Math.min(this.max, validatedValue));
        if (validatedValue != value) {
            return validatedValue;
        }
        return true;
    };

    scope.NextendElementNumber = NextendElementNumber;
})(n2, window);
;
(function ($, scope) {

    function NextendElementOnoff(id) {
        this.element = $('#' + id);

        this.onoff = this.element.parent()
            .on('click', $.proxy(this.switch, this));

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementOnoff.prototype = Object.create(NextendElement.prototype);
    NextendElementOnoff.prototype.constructor = NextendElementOnoff;


    NextendElementOnoff.prototype.switch = function () {
        var value = parseInt(this.element.val());
        if (value) {
            value = 0;
        } else {
            value = 1;
        }
        this.element.val(value);
        this.setSelected(value);

        this.triggerOutsideChange();
    };

    NextendElementOnoff.prototype.insideChange = function (value) {
        value = parseInt(value);
        this.element.val(value);
        this.setSelected(value);

        this.triggerInsideChange();
    };

    NextendElementOnoff.prototype.setSelected = function (state) {
        if (state) {
            this.onoff.addClass('n2-onoff-on');
        } else {
            this.onoff.removeClass('n2-onoff-on');
        }
    };

    scope.NextendElementOnoff = NextendElementOnoff;

})(n2, window);

(function ($, scope) {

    function NextendElementRadio(id, values) {
        this.element = $('#' + id);

        this.values = values;

        this.parent = this.element.parent();

        this.options = this.parent.find('.n2-radio-option');

        for (var i = 0; i < this.options.length; i++) {
            this.options.eq(i).on('click', $.proxy(this.click, this));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementRadio.prototype = Object.create(NextendElement.prototype);
    NextendElementRadio.prototype.constructor = NextendElementRadio;

    NextendElementRadio.prototype.click = function (e) {
        this.changeSelectedIndex(this.options.index(e.currentTarget));
    };

    NextendElementRadio.prototype.changeSelectedIndex = function (index) {
        var value = this.values[index];

        this.element.val(value);

        this.setSelected(index);

        this.triggerOutsideChange();
    };

    NextendElementRadio.prototype.insideChange = function (value, option) {
        var index = $.inArray(value, this.values);
        if (index == '-1') {
            index = this.partialSearch(value);
        }

        if (index == '-1' && typeof option !== 'undefined') {
            index = this.addOption(value, option);
        }

        if (index != '-1') {
            this.element.val(this.values[index]);
            this.setSelected(index);

            this.triggerInsideChange();
        } else {
            // It will reset the state if the preferred value not available
            this.options.eq(0).trigger('click');
        }
    };

    NextendElementRadio.prototype.setSelected = function (index) {
        this.options.removeClass('n2-active');
        this.options.eq(index).addClass('n2-active');
    };

    NextendElementRadio.prototype.partialSearch = function (text) {
        text = text.replace(/^.*[\\\/]/, '');
        for (var i = 0; i < this.values.length; i++) {
            if (this.values[i].indexOf(text) != -1) return i;
        }
        return -1;
    };

    NextendElementRadio.prototype.addOption = function (value, option) {
        var i = this.values.push(value) - 1;
        option.appendTo(this.parent)
            .on('click', $.proxy(this.click, this));
        this.options = this.options.add(option);
        return i;
    };

    NextendElementRadio.prototype.addTabOption = function (value, label) {
        var i = this.values.push(value) - 1;
        var option = $('<div class="n2-radio-option n2-h4 n2-last">' + label + '</div>')
            .insertAfter(this.options.last().removeClass('n2-last'))
            .on('click', $.proxy(this.click, this));
        this.options = this.options.add(option);
        return i;
    };
    NextendElementRadio.prototype.removeTabOption = function (value) {
        var i = $.inArray(value, this.values);
        var option = this.options.eq(i);
        this.options = this.options.not(option);
        option.remove();
        if (i == 0) {
            this.options.eq(0).addClass('n2-first');
        }
        if (i == this.options.length) {
            this.options.eq(this.options.length - 1).addClass('n2-last');
        }

        this.values.splice(i, 1);
    };

    NextendElementRadio.prototype.moveTab = function (originalIndex, targetIndex) {

    };

    scope.NextendElementRadio = NextendElementRadio;

})(n2, window);
(function ($, scope) {

    function NextendElementRichText(id) {

        NextendElementText.prototype.constructor.apply(this, arguments);

        this.parent.find('.n2-textarea-rich-bold').on('click', $.proxy(this.bold, this));
        this.parent.find('.n2-textarea-rich-italic').on('click', $.proxy(this.italic, this));
        this.parent.find('.n2-textarea-rich-link').on('click', $.proxy(this.link, this));

    };


    NextendElementRichText.prototype = Object.create(NextendElementText.prototype);
    NextendElementRichText.prototype.constructor = NextendElementRichText;


    NextendElementRichText.prototype.bold = function () {
        this.wrapText('<b>', '</b>');
    };

    NextendElementRichText.prototype.italic = function () {
        this.wrapText('<i>', '</i>');
    };

    NextendElementRichText.prototype.link = function () {
        this.wrapText('<a href="">', '</a>');
    };

    NextendElementRichText.prototype.list = function () {
        this.wrapText('', "\n<ul>\n<li>#1 Item</li>\n<li>#2 Item</li>\n</ul>\n");
    };


    NextendElementRichText.prototype.wrapText = function (openTag, closeTag) {
        var textArea = this.element;
        var len = textArea.val().length;
        var start = textArea[0].selectionStart;
        var end = textArea[0].selectionEnd;
        var selectedText = textArea.val().substring(start, end);
        var replacement = openTag + selectedText + closeTag;
        textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len));
        this.triggerOutsideChange();
        this.element.focus();
    };

    scope.NextendElementRichText = NextendElementRichText;
})(n2, window);
;
(function ($, scope) {

    function NextendElementSkin(id, preId, skins, fixedMode) {
        this.element = $('#' + id);

        this.preId = preId;

        this.skins = skins;

        this.list = this.element.data('field');

        this.fixedMode = fixedMode;

        this.firstOption = this.list.select.find('option').eq(0);

        this.originalText = this.firstOption.text();

        this.element.on('nextendChange', $.proxy(this.onSkinSelect, this));

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementSkin.prototype = Object.create(NextendElement.prototype);
    NextendElementSkin.prototype.constructor = NextendElementSkin;


    NextendElementSkin.prototype.onSkinSelect = function () {
        var skin = this.element.val();
        if (skin != '0') {
            skin = this.skins[skin];
            for (var k in skin) {
                if (skin.hasOwnProperty(k)) {
                    var el = $('#' + this.preId + k);
                    if (el.length) {
                        var field = el.data('field');
                        field.insideChange(skin[k]);
                    }
                }
            }

            if (!this.fixedMode) {
                this.changeFirstOptionText(n2_('Done'));
                this.list.insideChange('0');
                setTimeout($.proxy(this.changeFirstOptionText, this, this.originalText), 3000);
            }

        }
    };

    NextendElementSkin.prototype.changeFirstOptionText = function (text) {
        this.firstOption.text(text);
    };

    NextendElementSkin.prototype.insideChange = function (value) {
        this.element.val(value);
        this.list.select.val(value);
    };

    scope.NextendElementSkin = NextendElementSkin;
})(n2, window);

;
(function ($, scope) {

    function NextendElementStyle(id, parameters) {
        this.element = $('#' + id);

        this.parameters = parameters;

        this.defaultSetId = parameters.set;

        this.element.parent()
            .on('click', $.proxy(this.show, this));

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));

        this.name = this.element.siblings('input');

        nextend.styleManager.$.on('visualDelete', $.proxy(this.styleDeleted, this));

        this.updateName(this.element.val());
        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementStyle.prototype = Object.create(NextendElement.prototype);
    NextendElementStyle.prototype.constructor = NextendElementStyle;

    NextendElementStyle.prototype.getLabel = function () {
        return this.parameters.label;
    }

    NextendElementStyle.prototype.show = function (e) {
        e.preventDefault();
        if (this.parameters.font != '') {
            nextend.styleManager.setConnectedFont(this.parameters.font);
        }
        if (this.parameters.font2 != '') {
            nextend.styleManager.setConnectedFont2(this.parameters.font2);
        }
        if (this.parameters.style2 != '') {
            nextend.styleManager.setConnectedStyle(this.parameters.style2);
        }
        if (this.defaultSetId) {
            nextend.styleManager.changeSetById(this.defaultSetId);
        }
        nextend.styleManager.show(this.element.val(), $.proxy(this.save, this), {
            previewMode: this.parameters.previewmode,
            previewHTML: this.parameters.preview
        });
    };

    NextendElementStyle.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.val('');
    };

    NextendElementStyle.prototype.save = function (e, value) {

        nextend.styleManager.addVisualUsage(this.parameters.previewmode, value, window.nextend.pre);

        this.val(value);
    };

    NextendElementStyle.prototype.val = function (value) {
        this.element.val(value);
        this.updateName(value);
        this.triggerOutsideChange();
    };

    NextendElementStyle.prototype.insideChange = function (value) {
        this.element.val(value);

        this.updateName(value);

        this.triggerInsideChange();
    };

    NextendElementStyle.prototype.updateName = function (value) {
        $.when(nextend.styleManager.getVisual(value))
            .done($.proxy(function (style) {
                this.name.val(style.name);
            }, this));
    };
    NextendElementStyle.prototype.styleDeleted = function (e, id) {
        if (id == this.element.val()) {
            this.insideChange('');
        }
    };
    NextendElementStyle.prototype.renderStyle = function () {
        var style = this.element.val();
        nextend.styleManager.addVisualUsage(this.parameters.previewmode, style, '');
        return nextend.styleManager.getClass(style, this.parameters.previewmode);
    };

    scope.NextendElementStyle = NextendElementStyle;

    $(window).ready(function () {
        new NextendElementContextMenu('.n2-form-element-style', 'style');
    });

})(n2, window);
;
(function ($, scope) {

    function NextendElementSubform(id, target, tab, originalValue) {
        this.id = id;

        this.element = $('#' + id);

        this.target = $('#' + target);

        this.tab = tab;

        this.originalValue = originalValue;

        this.form = this.element.closest('form').data('form');

        this.list = this.element.data('field');

        this.element.on('nextendChange', $.proxy(this.loadSubform, this));

        NextendElement.prototype.constructor.apply(this, arguments);
    };


    NextendElementSubform.prototype = Object.create(NextendElement.prototype);
    NextendElementSubform.prototype.constructor = NextendElementSubform;

    NextendElementSubform.prototype.loadSubform = function () {
        var value = this.element.val();
        if (value == 'disabled') {
            this.target.html('');
        } else {
            var values = [];
            if (value == this.originalValue) {
                values = this.form.values;
            }

            var data = {
                id: this.id,
                values: values,
                tab: this.tab,
                value: value
            };

            NextendAjaxHelper.ajax({
                type: "POST",
                url: NextendAjaxHelper.makeAjaxUrl(this.form.url),
                data: data,
                dataType: 'json'
            }).done($.proxy(this.load, this));
        }
    };

    NextendElementSubform.prototype.load = function (response) {
        this.target.html(response.data.html);
        eval(response.data.scripts);
    };

    scope.NextendElementSubform = NextendElementSubform;

})(n2, window);

;
(function ($, scope) {

    function NextendElementSubformImage(id, options) {

        this.element = $('#' + id);

        this.options = $('#' + options).find('.n2-subform-image-option');

        this.subform = this.element.data('field');

        this.active = this.getIndex(this.options.filter('.n2-active').get(0));

        for (var i = 0; i < this.options.length; i++) {
            this.options.eq(i).on('click', $.proxy(this.selectOption, this));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementSubformImage.prototype = Object.create(NextendElement.prototype);
    NextendElementSubformImage.prototype.constructor = NextendElementSubformImage;


    NextendElementSubformImage.prototype.selectOption = function (e) {
        var index = this.getIndex(e.currentTarget);
        if (index != this.active) {

            this.options.eq(index).addClass('n2-active');
            this.options.eq(this.active).removeClass('n2-active');

            this.active = index;

            var value = this.subform.list.select.find('option').eq(index).val();
            this.subform.list.insideChange(value);
        }
    };

    NextendElementSubformImage.prototype.getIndex = function (option) {
        return $.inArray(option, this.options);
    };
    scope.NextendElementSubformImage = NextendElementSubformImage;

})(n2, window);
;
(function ($, scope) {

    function NextendElementSwitcher(id, values) {

        this.element = $('#' + id);

        this.options = this.element.parent().find('.n2-switcher-unit');

        this.active = this.options.index(this.options.filter('.n2-active'));

        this.values = values;

        for (var i = 0; i < this.options.length; i++) {
            this.options.eq(i).on('click', $.proxy(this.switch, this, i));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementSwitcher.prototype = Object.create(NextendElement.prototype);
    NextendElementSwitcher.prototype.constructor = NextendElementSwitcher;


    NextendElementSwitcher.prototype.switch = function (i, e) {
        this.element.val(this.values[i]);
        this.setSelected(i);

        this.triggerOutsideChange();
    };

    NextendElementSwitcher.prototype.insideChange = function (value) {
        var i = $.inArray(value, this.values);

        this.element.val(this.values[i]);
        this.setSelected(i);

        this.triggerInsideChange();
    };

    NextendElementSwitcher.prototype.setSelected = function (i) {
        this.options.eq(this.active).removeClass('n2-active');
        this.options.eq(i).addClass('n2-active');
        this.active = i;
    };

    scope.NextendElementSwitcher = NextendElementSwitcher;

})(n2, window);

;
(function ($, scope) {

    function NextendElementUnits(id, values) {

        this.element = $('#' + id);

        this.options = this.element.parent().find('.n2-element-unit');
        this.currentUnit = this.element.parent().find('.n2-element-current-unit');

        this.values = values;

        for (var i = 0; i < this.options.length; i++) {
            this.options.eq(i).on('click', $.proxy(this.switch, this, i));
        }

        NextendElement.prototype.constructor.apply(this, arguments);
    };

    NextendElementUnits.prototype = Object.create(NextendElement.prototype);
    NextendElementUnits.prototype.constructor = NextendElementUnits;


    NextendElementUnits.prototype.switch = function (i, e) {
        this.element.val(this.values[i]);
        this.setSelected(i);

        this.triggerOutsideChange();
    };

    NextendElementUnits.prototype.insideChange = function (value) {
        var i = $.inArray(value, this.values);

        this.element.val(this.values[i]);
        this.setSelected(i);

        this.triggerInsideChange();
    };

    NextendElementUnits.prototype.setSelected = function (i) {
        this.currentUnit.html(this.options.eq(i).html());
    };

    scope.NextendElementUnits = NextendElementUnits;

})(n2, window);

(function ($, scope, undefined) {

    var ajaxUrl = '',
        modal = null,
        cache = {},
        callback = function (url) {
        },
        lastValue = '';

    function NextendElementUrl(id, parameters) {
        this.element = $('#' + id);

        this.field = this.element.data('field');

        this.parameters = parameters;

        ajaxUrl = this.parameters.url;

        this.button = $('#' + id + '_button').on('click', $.proxy(this.open, this));

        this.element.siblings('.n2-form-element-clear')
            .on('click', $.proxy(this.clear, this));
    };

    NextendElementUrl.prototype = Object.create(NextendElement.prototype);
    NextendElementUrl.prototype.constructor = NextendElementUrl;

    NextendElementUrl.prototype.clear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.val('#');
    };

    NextendElementUrl.prototype.val = function (value) {
        this.element.val(value);
        this.triggerOutsideChange();
    };

    NextendElementUrl.prototype.open = function (e) {
        e.preventDefault();
        callback = $.proxy(this.insert, this);
        lastValue = this.element.val();
        this.getModal().show();
    };

    NextendElementUrl.prototype.insert = function (url) {
        this.val(url);
    };

    NextendElementUrl.prototype.getModal = function () {
        if (!modal) {
            var getLinks = function (search) {
                if (typeof cache[search] == 'undefined') {
                    cache[search] = $.ajax({
                        type: "POST",
                        url: NextendAjaxHelper.makeAjaxUrl(ajaxUrl),
                        data: {
                            keyword: search
                        },
                        dataType: 'json'
                    });
                }
                return cache[search];
            };

            var parameters = this.parameters;

            var lightbox = {
                    size: [
                        500,
                        590
                    ],
                    title: n2_('Lightbox'),
                    back: 'zero',
                    close: true,
                    content: '<form class="n2-form"></form>',
                    controls: ['<a href="#" class="n2-button n2-button-normal n2-button-l n2-radius-s n2-button-green n2-uc n2-h4">' + n2_('Insert') + '</a>'],
                    fn: {
                        show: function () {
                            var button = this.controls.find('.n2-button'),
                                chooseImages = $('<a href="#" class="n2-button n2-button-normal n2-button-m n2-radius-s n2-button-green n2-uc n2-h5" style="float:right; margin-right: 20px;">' + n2_('Choose images') + '</a>'),
                                form = this.content.find('.n2-form').on('submit', function (e) {
                                    e.preventDefault();
                                    button.trigger('click');
                                }).append(this.createTextarea(n2_('Content list') + " - " + n2_('One per line'), 'n2-link-resource', 'width: 446px;height: 100px;')).append(chooseImages).append(this.createInputUnit(n2_('Autoplay duration'), 'n2-link-autoplay', 'ms', 'width: 40px;')),
                                resourceField = this.content.find('#n2-link-resource').focus(),
                                autoplayField = this.content.find('#n2-link-autoplay').val(0);

                            chooseImages.on('click', function (e) {
                                e.preventDefault();
                                nextend.imageHelper.openMultipleLightbox(function (images) {
                                    var value = resourceField.val().replace(/\n$/, '');

                                    for (var i = 0; i < images.length; i++) {
                                        value += "\n" + images[i].image;
                                    }
                                    resourceField.val(value.replace(/^\n/, ''));
                                });
                            });

                            var matches = lastValue.match(/lightbox\[(.*?)\]/);
                            if (matches && matches.length == 2) {
                                var parts = matches[1].split(',');
                                if (parseInt(parts[parts.length - 1]) > 0) {
                                    autoplayField.val(parseInt(parts[parts.length - 1]));
                                    parts.pop();
                                }
                                resourceField.val(parts.join("\n"));
                            }

                            this.content.append(this.createHeading(n2_('Examples')));
                            this.createTable([
                                [n2_('Image'), 'http://smartslider3.com/image.jpg'],
                                ['YouTube', 'https://www.youtube.com/watch?v=MKmIwHAFjSU'],
                                ['Vimeo', 'https://vimeo.com/144598279'],
                                ['Iframe', 'http://smartslider3.com']
                            ], ['', '']).appendTo(this.content);

                            button.on('click', $.proxy(function (e) {
                                e.preventDefault();
                                var link = resourceField.val();
                                if (link != '') {
                                    var autoplay = '';
                                    if (autoplayField.val() > 0) {
                                        autoplay = ',' + autoplayField.val();
                                    }
                                    callback('lightbox[' + link.replace(/,/g, '&#44;').split("\n").filter(Boolean).join(',') + autoplay + ']');
                                }
                                this.hide(e);
                            }, this));
                        }
                    }
                },
                links = {
                    size: [
                        600,
                        500
                    ],
                    title: n2_('Link'),
                    back: 'zero',
                    close: true,
                    content: '<div class="n2-form"></div>',
                    fn: {
                        show: function () {

                            this.content.find('.n2-form').append(this.createInput(n2_('Keyword'), 'n2-links-keyword', 'width:546px;'));
                            var search = $('#n2-links-keyword'),
                                heading = this.createHeading('').appendTo(this.content),
                                result = this.createResult().appendTo(this.content),
                                searchString = '';

                            search.on('keyup', $.proxy(function () {
                                    searchString = search.val();
                                    getLinks(searchString).done($.proxy(function (r) {
                                        if (search.val() == searchString) {
                                            var links = r.data;
                                            if (searchString == '') {
                                                heading.html(n2_('No search term specified. Showing recent items.'));
                                            } else {
                                                heading.html(n2_printf(n2_('Showing items match for "%s"'), searchString));
                                            }

                                            var data = [],
                                                modal = this;
                                            for (var i = 0; i < links.length; i++) {
                                                data.push([links[i].title, links[i].info, $('<div class="n2-button n2-button-normal n2-button-xs n2-radius-s n2-button-green n2-uc n2-h5">' + n2_('Select') + '</div>')
                                                    .on('click', {permalink: links[i].link}, function (e) {
                                                        callback(e.data.permalink);
                                                        modal.hide();
                                                    })]);
                                            }
                                            result.html('');
                                            this.createTable(data, ['width:100%;', '', '']).appendTo(this.createTableWrap().appendTo(result));
                                        }
                                    }, this));
                                }, this))
                                .trigger('keyup').focus();

                            this.content.append('<hr style="margin: 0 -20px;"/>');
                            var external = $('<div class="n2-input-button"><input placeholder="External url" type="text" id="external-url" name="external-url" value="" /><a href="#" class="n2-button n2-button-normal n2-button-l n2-radius-s n2-button-green n2-uc n2-h4">Insert</a></div>')
                                .css({
                                    display: 'block',
                                    textAlign: 'center'
                                })
                                .appendTo(this.content),
                                externalInput = external.find('input').val(lastValue);

                            external.find('.n2-button').on('click', function (e) {
                                e.preventDefault();
                                callback(externalInput.val());
                                modal.hide();
                            });
                        }
                    }
                };
            links.back = false;
            modal = new NextendModal({
                zero: links
            }, false);
        
            modal.setCustomClass('n2-url-modal');
        }
        return modal;
    };

    scope.NextendElementUrl = NextendElementUrl;

})(n2, window);
;
(function ($, scope) {

    function NextendElementDevices(id, values) {

        this.$el = $('#' + id).data('field', this);
        this.fields = {};
        for (var i = 0; i < values.length; i++) {
            this.fields[values[i]] = new NextendElementDevice(id + '-' + values[i]);
        }
    };

    NextendElementDevices.prototype.setAvailableDevices = function (devices) {
        for (var k in devices) {
            var field = this.fields[k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()];
            if (!devices[k]) {
                field.detach();
            }
        }
        this.$el.children().first().addClass('n2-first');
        this.$el.children().last().addClass('n2-last');
    }


    scope.NextendElementDevices = NextendElementDevices;

    function NextendElementDevice(id) {
        NextendElementOnoff.prototype.constructor.apply(this, arguments);
    };


    NextendElementDevice.prototype = Object.create(NextendElementOnoff.prototype);
    NextendElementDevice.prototype.constructor = NextendElementDevice;

    NextendElementDevice.prototype.detach = function () {
        this.onoff.detach();
    }

    NextendElementDevice.prototype.setSelected = function (state) {
        if (state) {
            this.onoff.addClass('n2-active');
        } else {
            this.onoff.removeClass('n2-active');
        }
    };


})(n2, window);
var fixto = (function ($, window, document) {

    // Start Computed Style. Please do not modify this module here. Modify it from its own repo. See address below.

    /*! Computed Style - v0.1.0 - 2012-07-19
     * https://github.com/bbarakaci/computed-style
     * Copyright (c) 2012 Burak Barakaci; Licensed MIT */
    var computedStyle = (function () {
        var computedStyle = {
            getAll: function (element) {
                return document.defaultView.getComputedStyle(element);
            },
            get: function (element, name) {
                return this.getAll(element)[name];
            },
            toFloat: function (value) {
                return parseFloat(value, 10) || 0;
            },
            getFloat: function (element, name) {
                return this.toFloat(this.get(element, name));
            },
            _getAllCurrentStyle: function (element) {
                return element.currentStyle;
            }
        };

        if (document.documentElement.currentStyle) {
            computedStyle.getAll = computedStyle._getAllCurrentStyle;
        }

        return computedStyle;

    }());

    // End Computed Style. Modify whatever you want to.

    var mimicNode = (function () {
        /*
         Class Mimic Node
         Dependency : Computed Style
         Tries to mimick a dom node taking his styles, dimensions. May go to his repo if gets mature.
         */

        function MimicNode(element) {
            this.element = element;
            this.replacer = document.createElement('div');
            this.replacer.style.visibility = 'hidden';
            this.hide();
            element.parentNode.insertBefore(this.replacer, element);
        }

        MimicNode.prototype = {
            replace: function () {
                var rst = this.replacer.style;
                var styles = computedStyle.getAll(this.element);

                // rst.width = computedStyle.width(this.element) + 'px';
                // rst.height = this.element.offsetHeight + 'px';

                // Setting offsetWidth
                rst.width = this._width();
                rst.height = this._height();

                // Adobt margins
                rst.marginTop = styles.marginTop;
                rst.marginBottom = styles.marginBottom;
                rst.marginLeft = styles.marginLeft;
                rst.marginRight = styles.marginRight;

                // Adopt positioning
                rst.cssFloat = styles.cssFloat;
                rst.styleFloat = styles.styleFloat; //ie8;
                rst.position = styles.position;
                rst.top = styles.top;
                rst.right = styles.right;
                rst.bottom = styles.bottom;
                rst.left = styles.left;
                // rst.borderStyle = styles.borderStyle;

                rst.display = styles.display;

            },

            hide: function () {
                this.replacer.style.display = 'none';
            },

            _width: function () {
                return this.element.getBoundingClientRect().width + 'px';
            },

            _widthOffset: function () {
                return this.element.offsetWidth + 'px';
            },

            _height: function () {
                return this.element.getBoundingClientRect().height + 'px';
            },

            _heightOffset: function () {
                return this.element.offsetHeight + 'px';
            },

            destroy: function () {
                $(this.replacer).remove();

                // set properties to null to break references
                for (var prop in this) {
                    if (this.hasOwnProperty(prop)) {
                        this[prop] = null;
                    }
                }
            }
        };

        var bcr = document.documentElement.getBoundingClientRect();
        if (!bcr.width) {
            MimicNode.prototype._width = MimicNode.prototype._widthOffset;
            MimicNode.prototype._height = MimicNode.prototype._heightOffset;
        }

        return {
            MimicNode: MimicNode,
            computedStyle: computedStyle
        };
    }());

    // Class handles vendor prefixes
    function Prefix() {
        // Cached vendor will be stored when it is detected
        this._vendor = null;

        //this._dummy = document.createElement('div');
    }

    Prefix.prototype = {

        _vendors: {
            webkit: {cssPrefix: '-webkit-', jsPrefix: 'Webkit'},
            moz: {cssPrefix: '-moz-', jsPrefix: 'Moz'},
            ms: {cssPrefix: '-ms-', jsPrefix: 'ms'},
            opera: {cssPrefix: '-o-', jsPrefix: 'O'}
        },

        _prefixJsProperty: function (vendor, prop) {
            return vendor.jsPrefix + prop[0].toUpperCase() + prop.substr(1);
        },

        _prefixValue: function (vendor, value) {
            return vendor.cssPrefix + value;
        },

        _valueSupported: function (prop, value, dummy) {
            // IE8 will throw Illegal Argument when you attempt to set a not supported value.
            try {
                dummy.style[prop] = value;
                return dummy.style[prop] === value;
            }
            catch (er) {
                return false;
            }
        },

        /**
         * Returns true if the property is supported
         * @param {string} prop Property name
         * @returns {boolean}
         */
        propertySupported: function (prop) {
            // Supported property will return either inine style value or an empty string.
            // Undefined means property is not supported.
            return document.documentElement.style[prop] !== undefined;
        },

        /**
         * Returns prefixed property name for js usage
         * @param {string} prop Property name
         * @returns {string|null}
         */
        getJsProperty: function (prop) {
            // Try native property name first.
            if (this.propertySupported(prop)) {
                return prop;
            }

            // Prefix it if we know the vendor already
            if (this._vendor) {
                return this._prefixJsProperty(this._vendor, prop);
            }

            // We don't know the vendor, try all the possibilities
            var prefixed;
            for (var vendor in this._vendors) {
                prefixed = this._prefixJsProperty(this._vendors[vendor], prop);
                if (this.propertySupported(prefixed)) {
                    // Vendor detected. Cache it.
                    this._vendor = this._vendors[vendor];
                    return prefixed;
                }
            }

            // Nothing worked
            return null;
        },

        /**
         * Returns supported css value for css property. Could be used to check support or get prefixed value string.
         * @param {string} prop Property
         * @param {string} value Value name
         * @returns {string|null}
         */
        getCssValue: function (prop, value) {
            // Create dummy element to test value
            var dummy = document.createElement('div');

            // Get supported property name
            var jsProperty = this.getJsProperty(prop);

            // Try unprefixed value 
            if (this._valueSupported(jsProperty, value, dummy)) {
                return value;
            }

            var prefixedValue;

            // If we know the vendor already try prefixed value
            if (this._vendor) {
                prefixedValue = this._prefixValue(this._vendor, value);
                if (this._valueSupported(jsProperty, prefixedValue, dummy)) {
                    return prefixedValue;
                }
            }

            // Try all vendors
            for (var vendor in this._vendors) {
                prefixedValue = this._prefixValue(this._vendors[vendor], value);
                if (this._valueSupported(jsProperty, prefixedValue, dummy)) {
                    // Vendor detected. Cache it.
                    this._vendor = this._vendors[vendor];
                    return prefixedValue;
                }
            }
            // No support for value
            return null;
        }
    };

    var prefix = new Prefix();

    // We will need this frequently. Lets have it as a global until we encapsulate properly.
    var transformJsProperty = prefix.getJsProperty('transform');

    // Will hold if browser creates a positioning context for fixed elements.
    var fixedPositioningContext;

    // Checks if browser creates a positioning context for fixed elements.
    // Transform rule will create a positioning context on browsers who follow the spec.
    // Ie for example will fix it according to documentElement
    // TODO: Other css rules also effects. perspective creates at chrome but not in firefox. transform-style preserve3d effects.
    function checkFixedPositioningContextSupport() {
        var support = false;
        var parent = document.createElement('div');
        var child = document.createElement('div');
        parent.appendChild(child);
        parent.style[transformJsProperty] = 'translate(0)';
        // Make sure there is space on top of parent
        parent.style.marginTop = '10px';
        parent.style.visibility = 'hidden';
        child.style.position = 'fixed';
        child.style.top = 0;
        document.body.appendChild(parent);
        var rect = child.getBoundingClientRect();
        // If offset top is greater than 0 meand transformed element created a positioning context.
        if (rect.top > 0) {
            support = true;
        }
        // Remove dummy content
        document.body.removeChild(parent);
        return support;
    }

    // It will return null if position sticky is not supported
    var nativeStickyValue = prefix.getCssValue('position', 'sticky');

    // It will return null if position fixed is not supported
    var fixedPositionValue = prefix.getCssValue('position', 'fixed');

    // Dirty business
    var ie = navigator.appName === 'Microsoft Internet Explorer';
    var ieversion;

    if (ie) {
        ieversion = parseFloat(navigator.appVersion.split("MSIE")[1]);
    }

    function FixTo(child, parent, options) {
        this.child = child;
        this._$child = $(child);
        this.parent = parent;
        this.options = {
            className: 'fixto-fixed',
            top: 0
        };
        this._setOptions(options);
    }

    FixTo.prototype = {
        // Returns the total outerHeight of the elements passed to mind option. Will return 0 if none.
        _mindtop: function () {
            var top = 0;
            if (this._$mind) {
                var el;
                var rect;
                var height;
                for (var i = 0, l = this._$mind.length; i < l; i++) {
                    el = this._$mind[i];
                    rect = el.getBoundingClientRect();
                    if (rect.height) {
                        top += rect.height;
                    }
                    else {
                        var styles = computedStyle.getAll(el);
                        top += el.offsetHeight + computedStyle.toFloat(styles.marginTop) + computedStyle.toFloat(styles.marginBottom);
                    }
                }
            }
            return top;
        },

        // Public method to stop the behaviour of this instance.        
        stop: function () {
            this._stop();
            this._running = false;
        },

        // Public method starts the behaviour of this instance.
        start: function () {

            // Start only if it is not running not to attach event listeners multiple times.
            if (!this._running) {
                this._start();
                this._running = true;
            }
        },

        //Public method to destroy fixto behaviour
        destroy: function () {
            this.stop();

            this._destroy();

            // Remove jquery data from the element
            this._$child.removeData('fixto-instance');

            // set properties to null to break references
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = null;
                }
            }
        },

        _setOptions: function (options) {
            $.extend(this.options, options);
            if (this.options.mind) {
                this._$mind = $(this.options.mind);
            }
            if (this.options.zIndex) {
                this.child.style.zIndex = this.options.zIndex;
            }
        },

        setOptions: function (options) {
            this._setOptions(options);
            this.refresh();
        },

        // Methods could be implemented by subclasses

        _stop: function () {

        },

        _start: function () {

        },

        _destroy: function () {

        },

        refresh: function () {

        }
    };

    // Class FixToContainer
    function FixToContainer(child, parent, options) {
        FixTo.call(this, child, parent, options);
        this._replacer = new mimicNode.MimicNode(child);
        this._ghostNode = this._replacer.replacer;

        this._saveStyles();

        this._saveViewportHeight();

        // Create anonymous functions and keep references to register and unregister events.
        this._proxied_onscroll = this._bind(this._onscroll, this);
        this._proxied_onresize = this._bind(this._onresize, this);

        this.start();
    }

    FixToContainer.prototype = new FixTo();

    $.extend(FixToContainer.prototype, {

        // Returns an anonymous function that will call the given function in the given context
        _bind: function (fn, context) {
            return function () {
                return fn.call(context);
            };
        },

        // at ie8 maybe only in vm window resize event fires everytime an element is resized.
        _toresize: ieversion === 8 ? document.documentElement : window,

        _onscroll: function _onscroll() {
            this._scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this._parentBottom = (this.parent.offsetHeight + this._fullOffset('offsetTop', this.parent)) - computedStyle.getFloat(this.parent, 'paddingBottom');
            if (!this.fixed) {

                var childStyles = computedStyle.getAll(this.child);

                if (
                    this._scrollTop < this._parentBottom &&
                    this._scrollTop > (this._fullOffset('offsetTop', this.child) - this.options.top - this._mindtop()) &&
                    this._viewportHeight > (this.child.offsetHeight + computedStyle.toFloat(childStyles.marginTop) + computedStyle.toFloat(childStyles.marginBottom))
                ) {

                    this._fix();
                    this._adjust();
                }
            } else {
                if (this._scrollTop > this._parentBottom || this._scrollTop < (this._fullOffset('offsetTop', this._ghostNode) - this.options.top - this._mindtop())) {
                    this._unfix();
                    return;
                }
                this._adjust();
            }
        },

        _adjust: function _adjust() {
            var top = 0;
            var mindTop = this._mindtop();
            var diff = 0;
            var childStyles = computedStyle.getAll(this.child);
            var context = null;

            if (fixedPositioningContext) {
                // Get positioning context.
                context = this._getContext();
                if (context) {
                    // There is a positioning context. Top should be according to the context.
                    top = Math.abs(context.getBoundingClientRect().top);
                }
            }

            diff = (this._parentBottom - this._scrollTop) - (this.child.offsetHeight + computedStyle.toFloat(childStyles.marginBottom) + mindTop + this.options.top);

            if (diff > 0) {
                diff = 0;
            }

            this.child.style.top = (diff + mindTop + top + this.options.top) - computedStyle.toFloat(childStyles.marginTop) + 'px';
        },

        // Calculate cumulative offset of the element.
        // Optionally according to context
        _fullOffset: function _fullOffset(offsetName, elm, context) {
            var offset = elm[offsetName];
            var offsetParent = elm.offsetParent;

            // Add offset of the ascendent tree until we reach to the document root or to the given context
            while (offsetParent !== null && offsetParent !== context) {
                offset = offset + offsetParent[offsetName];
                offsetParent = offsetParent.offsetParent;
            }

            return offset;
        },

        // Get positioning context of the element.
        // We know that the closest parent that a transform rule applied will create a positioning context.
        _getContext: function () {
            var parent;
            var element = this.child;
            var context = null;
            var styles;

            // Climb up the treee until reaching the context
            while (!context) {
                parent = element.parentNode;
                if (parent === document.documentElement) {
                    return null;
                }

                styles = computedStyle.getAll(parent);
                // Element has a transform rule
                if (styles[transformJsProperty] !== 'none') {
                    context = parent;
                    break;
                }
                element = parent;
            }
            return context;
        },

        _fix: function _fix() {
            var child = this.child;
            var childStyle = child.style;
            var childStyles = computedStyle.getAll(child);
            var left = child.getBoundingClientRect().left;
            var width = childStyles.width;

            this._saveStyles();

            if (document.documentElement.currentStyle) {
                // Function for ie<9. When hasLayout is not triggered in ie7, he will report currentStyle as auto, clientWidth as 0. Thus using offsetWidth.
                // Opera also falls here 
                width = (child.offsetWidth) - (computedStyle.toFloat(childStyles.paddingLeft) + computedStyle.toFloat(childStyles.paddingRight) + computedStyle.toFloat(childStyles.borderLeftWidth) + computedStyle.toFloat(childStyles.borderRightWidth)) + 'px';
            }

            // Ie still fixes the container according to the viewport.
            if (fixedPositioningContext) {
                var context = this._getContext();
                if (context) {
                    // There is a positioning context. Left should be according to the context.
                    left = child.getBoundingClientRect().left - context.getBoundingClientRect().left;
                }
            }

            this._replacer.replace();

            childStyle.left = (left - computedStyle.toFloat(childStyles.marginLeft)) + 'px';
            childStyle.width = width;

            childStyle.position = 'fixed';
            childStyle.top = this._mindtop() + this.options.top - computedStyle.toFloat(childStyles.marginTop) + 'px';
            this._$child.addClass(this.options.className);
            this.fixed = true;
        },

        _unfix: function _unfix() {
            var childStyle = this.child.style;
            this._replacer.hide();
            childStyle.position = this._childOriginalPosition;
            childStyle.top = this._childOriginalTop;
            childStyle.width = this._childOriginalWidth;
            childStyle.left = this._childOriginalLeft;
            this._$child.removeClass(this.options.className);
            this.fixed = false;
        },

        _saveStyles: function () {
            var childStyle = this.child.style;
            this._childOriginalPosition = childStyle.position;
            this._childOriginalTop = childStyle.top;
            this._childOriginalWidth = childStyle.width;
            this._childOriginalLeft = childStyle.left;
        },

        _onresize: function () {
            this.refresh();
        },

        _saveViewportHeight: function () {
            // ie8 doesn't support innerHeight
            this._viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        },

        _stop: function () {
            // Unfix the container immediately.
            this._unfix();
            // remove event listeners
            $(window).unbind('scroll', this._proxied_onscroll);
            $(this._toresize).unbind('resize', this._proxied_onresize);
        },

        _start: function () {
            // Trigger onscroll to have the effect immediately.
            this._onscroll();

            // Attach event listeners
            $(window).bind('scroll', this._proxied_onscroll);
            $(this._toresize).bind('resize', this._proxied_onresize);
        },

        _destroy: function () {
            // Destroy mimic node instance
            this._replacer.destroy();
        },

        refresh: function () {
            this._saveViewportHeight();
            this._unfix();
            this._onscroll();
        }
    });

    function NativeSticky(child, parent, options) {
        FixTo.call(this, child, parent, options);
        this.start();
    }

    NativeSticky.prototype = new FixTo();

    $.extend(NativeSticky.prototype, {
        _start: function () {

            var childStyles = computedStyle.getAll(this.child);

            this._childOriginalPosition = childStyles.position;
            this._childOriginalTop = childStyles.top;

            this.child.style.position = nativeStickyValue;
            this.refresh();
        },

        _stop: function () {
            this.child.style.position = this._childOriginalPosition;
            this.child.style.top = this._childOriginalTop;
        },

        refresh: function () {
            this.child.style.top = this._mindtop() + this.options.top + 'px';
        }
    });


    var fixTo = function fixTo(childElement, parentElement, options) {
        var _nativeStickyValue = nativeStickyValue;
        if (_nativeStickyValue == '-webkit-sticky' && $(parentElement).css('display') == 'table-cell') {
            _nativeStickyValue = false;
        }

        if ((_nativeStickyValue && !options) || (_nativeStickyValue && options && options.useNativeSticky !== false)) {
            // Position sticky supported and user did not disabled the usage of it.
            return new NativeSticky(childElement, parentElement, options);
        }
        else if (fixedPositionValue) {
            // Position fixed supported

            if (fixedPositioningContext === undefined) {
                // We don't know yet if browser creates fixed positioning contexts. Check it.
                fixedPositioningContext = checkFixedPositioningContextSupport();
            }

            return new FixToContainer(childElement, parentElement, options);
        }
        else {
            return 'Neither fixed nor sticky positioning supported';
        }
    };

    /*
     No support for ie lt 8
     */

    if (ieversion < 8) {
        fixTo = function () {
            return 'not supported';
        };
    }

    // Let it be a jQuery Plugin
    $.fn.fixTo = function (targetSelector, options) {

        var $targets = $(targetSelector);

        var i = 0;
        return this.each(function () {

            // Check the data of the element.
            var instance = $(this).data('fixto-instance');

            // If the element is not bound to an instance, create the instance and save it to elements data.
            if (!instance) {
                $(this).data('fixto-instance', fixTo(this, $targets[i], options));
            }
            else {
                // If we already have the instance here, expect that targetSelector parameter will be a string
                // equal to a public methods name. Run the method on the instance without checking if
                // it exists or it is a public method or not. Cause nasty errors when necessary.
                var method = targetSelector;
                instance[method].call(instance, options);
            }
            i++;
        });
    };

    /*
     Expose
     */

    return {
        FixToContainer: FixToContainer,
        fixTo: fixTo,
        computedStyle: computedStyle,
        mimicNode: mimicNode
    };


}(n2, window, document));
/*
 * ----------------------------- JSTORAGE -------------------------------------
 * Simple local storage wrapper to save data on the browser side, supporting
 * all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
 *
 * Author: Andris Reinman, andris.reinman@gmail.com
 * Project homepage: www.jstorage.info
 *
 * Licensed under Unlicense:
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org/>
 */

/* global ActiveXObject: false */
/* jshint browser: true */

(function() {
    'use strict';

    var
    /* jStorage version */
        JSTORAGE_VERSION = '0.4.12',

    /* detect a dollar object or create one if not found */
        $ = window.n2 || window.$ || (window.$ = {}),

    /* check for a JSON handling support */
        JSON = {
            parse: window.JSON && (window.JSON.parse || window.JSON.decode) ||
                String.prototype.evalJSON && function(str) {
                    return String(str).evalJSON();
                } ||
                $.parseJSON ||
                $.evalJSON,
            stringify: Object.toJSON ||
                window.JSON && (window.JSON.stringify || window.JSON.encode) ||
                $.toJSON
        };

    // Break if no JSON support was found
    if (typeof JSON.parse !== 'function' || typeof JSON.stringify !== 'function') {
        throw new Error('No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page');
    }

    var
    /* This is the object, that holds the cached values */
        _storage = {
            __jstorage_meta: {
                CRC32: {}
            }
        },

    /* Actual browser storage (localStorage or globalStorage['domain']) */
        _storage_service = {
            jStorage: '{}'
        },

    /* DOM element for older IE versions, holds userData behavior */
        _storage_elm = null,

    /* How much space does the storage take */
        _storage_size = 0,

    /* which backend is currently used */
        _backend = false,

    /* onchange observers */
        _observers = {},

    /* timeout to wait after onchange event */
        _observer_timeout = false,

    /* last update time */
        _observer_update = 0,

    /* pubsub observers */
        _pubsub_observers = {},

    /* skip published items older than current timestamp */
        _pubsub_last = +new Date(),

    /* Next check for TTL */
        _ttl_timeout,

        /**
         * XML encoding and decoding as XML nodes can't be JSON'ized
         * XML nodes are encoded and decoded if the node is the value to be saved
         * but not if it's as a property of another object
         * Eg. -
         *   $.jStorage.set('key', xmlNode);        // IS OK
         *   $.jStorage.set('key', {xml: xmlNode}); // NOT OK
         */
            _XMLService = {

            /**
             * Validates a XML node to be XML
             * based on jQuery.isXML function
             */
            isXML: function(elm) {
                var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
                return documentElement ? documentElement.nodeName !== 'HTML' : false;
            },

            /**
             * Encodes a XML node to string
             * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
             */
            encode: function(xmlNode) {
                if (!this.isXML(xmlNode)) {
                    return false;
                }
                try { // Mozilla, Webkit, Opera
                    return new XMLSerializer().serializeToString(xmlNode);
                } catch (E1) {
                    try { // IE
                        return xmlNode.xml;
                    } catch (E2) {}
                }
                return false;
            },

            /**
             * Decodes a XML node from string
             * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
             */
            decode: function(xmlString) {
                var dom_parser = ('DOMParser' in window && (new DOMParser()).parseFromString) ||
                        (window.ActiveXObject && function(_xmlString) {
                            var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                            xml_doc.async = 'false';
                            xml_doc.loadXML(_xmlString);
                            return xml_doc;
                        }),
                    resultXML;
                if (!dom_parser) {
                    return false;
                }
                resultXML = dom_parser.call('DOMParser' in window && (new DOMParser()) || window, xmlString, 'text/xml');
                return this.isXML(resultXML) ? resultXML : false;
            }
        };


    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * Initialization function. Detects if the browser supports DOM Storage
     * or userData behavior and behaves accordingly.
     */
    function _init() {
        /* Check if browser supports localStorage */
        var localStorageReallyWorks = false;
        if ('localStorage' in window) {
            try {
                window.localStorage.setItem('_tmptest', 'tmpval');
                localStorageReallyWorks = true;
                window.localStorage.removeItem('_tmptest');
            } catch (BogusQuotaExceededErrorOnIos5) {
                // Thanks be to iOS5 Private Browsing mode which throws
                // QUOTA_EXCEEDED_ERRROR DOM Exception 22.
            }
        }

        if (localStorageReallyWorks) {
            try {
                if (window.localStorage) {
                    _storage_service = window.localStorage;
                    _backend = 'localStorage';
                    _observer_update = _storage_service.jStorage_update;
                }
            } catch (E3) { /* Firefox fails when touching localStorage and cookies are disabled */ }
        }
        /* Check if browser supports globalStorage */
        else if ('globalStorage' in window) {
            try {
                if (window.globalStorage) {
                    if (window.location.hostname == 'localhost') {
                        _storage_service = window.globalStorage['localhost.localdomain'];
                    } else {
                        _storage_service = window.globalStorage[window.location.hostname];
                    }
                    _backend = 'globalStorage';
                    _observer_update = _storage_service.jStorage_update;
                }
            } catch (E4) { /* Firefox fails when touching localStorage and cookies are disabled */ }
        }
        /* Check if browser supports userData behavior */
        else {
            _storage_elm = document.createElement('link');
            if (_storage_elm.addBehavior) {

                /* Use a DOM element to act as userData storage */
                _storage_elm.style.behavior = 'url(#default#userData)';

                /* userData element needs to be inserted into the DOM! */
                document.getElementsByTagName('head')[0].appendChild(_storage_elm);

                try {
                    _storage_elm.load('jStorage');
                } catch (E) {
                    // try to reset cache
                    _storage_elm.setAttribute('jStorage', '{}');
                    _storage_elm.save('jStorage');
                    _storage_elm.load('jStorage');
                }

                var data = '{}';
                try {
                    data = _storage_elm.getAttribute('jStorage');
                } catch (E5) {}

                try {
                    _observer_update = _storage_elm.getAttribute('jStorage_update');
                } catch (E6) {}

                _storage_service.jStorage = data;
                _backend = 'userDataBehavior';
            } else {
                _storage_elm = null;
                return;
            }
        }

        // Load data from storage
        _load_storage();

        // remove dead keys
        _handleTTL();

        // start listening for changes
        _setupObserver();

        // initialize publish-subscribe service
        _handlePubSub();

        // handle cached navigation
        if ('addEventListener' in window) {
            window.addEventListener('pageshow', function(event) {
                if (event.persisted) {
                    _storageObserver();
                }
            }, false);
        }
    }

    /**
     * Reload data from storage when needed
     */
    function _reloadData() {
        var data = '{}';

        if (_backend == 'userDataBehavior') {
            _storage_elm.load('jStorage');

            try {
                data = _storage_elm.getAttribute('jStorage');
            } catch (E5) {}

            try {
                _observer_update = _storage_elm.getAttribute('jStorage_update');
            } catch (E6) {}

            _storage_service.jStorage = data;
        }

        _load_storage();

        // remove dead keys
        _handleTTL();

        _handlePubSub();
    }

    /**
     * Sets up a storage change observer
     */
    function _setupObserver() {
        if (_backend == 'localStorage' || _backend == 'globalStorage') {
            if ('addEventListener' in window) {
                window.addEventListener('storage', _storageObserver, false);
            } else {
                document.attachEvent('onstorage', _storageObserver);
            }
        } else if (_backend == 'userDataBehavior') {
            setInterval(_storageObserver, 1000);
        }
    }

    /**
     * Fired on any kind of data change, needs to check if anything has
     * really been changed
     */
    function _storageObserver() {
        var updateTime;
        // cumulate change notifications with timeout
        clearTimeout(_observer_timeout);
        _observer_timeout = setTimeout(function() {

            if (_backend == 'localStorage' || _backend == 'globalStorage') {
                updateTime = _storage_service.jStorage_update;
            } else if (_backend == 'userDataBehavior') {
                _storage_elm.load('jStorage');
                try {
                    updateTime = _storage_elm.getAttribute('jStorage_update');
                } catch (E5) {}
            }

            if (updateTime && updateTime != _observer_update) {
                _observer_update = updateTime;
                _checkUpdatedKeys();
            }

        }, 25);
    }

    /**
     * Reloads the data and checks if any keys are changed
     */
    function _checkUpdatedKeys() {
        var oldCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32)),
            newCrc32List;

        _reloadData();
        newCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32));

        var key,
            updated = [],
            removed = [];

        for (key in oldCrc32List) {
            if (oldCrc32List.hasOwnProperty(key)) {
                if (!newCrc32List[key]) {
                    removed.push(key);
                    continue;
                }
                if (oldCrc32List[key] != newCrc32List[key] && String(oldCrc32List[key]).substr(0, 2) == '2.') {
                    updated.push(key);
                }
            }
        }

        for (key in newCrc32List) {
            if (newCrc32List.hasOwnProperty(key)) {
                if (!oldCrc32List[key]) {
                    updated.push(key);
                }
            }
        }

        _fireObservers(updated, 'updated');
        _fireObservers(removed, 'deleted');
    }

    /**
     * Fires observers for updated keys
     *
     * @param {Array|String} keys Array of key names or a key
     * @param {String} action What happened with the value (updated, deleted, flushed)
     */
    function _fireObservers(keys, action) {
        keys = [].concat(keys || []);

        var i, j, len, jlen;

        if (action == 'flushed') {
            keys = [];
            for (var key in _observers) {
                if (_observers.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            action = 'deleted';
        }
        for (i = 0, len = keys.length; i < len; i++) {
            if (_observers[keys[i]]) {
                for (j = 0, jlen = _observers[keys[i]].length; j < jlen; j++) {
                    _observers[keys[i]][j](keys[i], action);
                }
            }
            if (_observers['*']) {
                for (j = 0, jlen = _observers['*'].length; j < jlen; j++) {
                    _observers['*'][j](keys[i], action);
                }
            }
        }
    }

    /**
     * Publishes key change to listeners
     */
    function _publishChange() {
        var updateTime = (+new Date()).toString();

        if (_backend == 'localStorage' || _backend == 'globalStorage') {
            try {
                _storage_service.jStorage_update = updateTime;
            } catch (E8) {
                // safari private mode has been enabled after the jStorage initialization
                _backend = false;
            }
        } else if (_backend == 'userDataBehavior') {
            _storage_elm.setAttribute('jStorage_update', updateTime);
            _storage_elm.save('jStorage');
        }

        _storageObserver();
    }

    /**
     * Loads the data from the storage based on the supported mechanism
     */
    function _load_storage() {
        /* if jStorage string is retrieved, then decode it */
        if (_storage_service.jStorage) {
            try {
                _storage = JSON.parse(String(_storage_service.jStorage));
            } catch (E6) {
                _storage_service.jStorage = '{}';
            }
        } else {
            _storage_service.jStorage = '{}';
        }
        _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;

        if (!_storage.__jstorage_meta) {
            _storage.__jstorage_meta = {};
        }
        if (!_storage.__jstorage_meta.CRC32) {
            _storage.__jstorage_meta.CRC32 = {};
        }
    }

    /**
     * This functions provides the 'save' mechanism to store the jStorage object
     */
    function _save() {
        _dropOldEvents(); // remove expired events
        try {
            _storage_service.jStorage = JSON.stringify(_storage);
            // If userData is used as the storage engine, additional
            if (_storage_elm) {
                _storage_elm.setAttribute('jStorage', _storage_service.jStorage);
                _storage_elm.save('jStorage');
            }
            _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;
        } catch (E7) { /* probably cache is full, nothing is saved this way*/ }
    }

    /**
     * Function checks if a key is set and is string or numberic
     *
     * @param {String} key Key name
     */
    function _checkKey(key) {
        if (typeof key != 'string' && typeof key != 'number') {
            throw new TypeError('Key name must be string or numeric');
        }
        if (key == '__jstorage_meta') {
            throw new TypeError('Reserved key name');
        }
        return true;
    }

    /**
     * Removes expired keys
     */
    function _handleTTL() {
        var curtime, i, TTL, CRC32, nextExpire = Infinity,
            changed = false,
            deleted = [];

        clearTimeout(_ttl_timeout);

        if (!_storage.__jstorage_meta || typeof _storage.__jstorage_meta.TTL != 'object') {
            // nothing to do here
            return;
        }

        curtime = +new Date();
        TTL = _storage.__jstorage_meta.TTL;

        CRC32 = _storage.__jstorage_meta.CRC32;
        for (i in TTL) {
            if (TTL.hasOwnProperty(i)) {
                if (TTL[i] <= curtime) {
                    delete TTL[i];
                    delete CRC32[i];
                    delete _storage[i];
                    changed = true;
                    deleted.push(i);
                } else if (TTL[i] < nextExpire) {
                    nextExpire = TTL[i];
                }
            }
        }

        // set next check
        if (nextExpire != Infinity) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(nextExpire - curtime, 0x7FFFFFFF));
        }

        // save changes
        if (changed) {
            _save();
            _publishChange();
            _fireObservers(deleted, 'deleted');
        }
    }

    /**
     * Checks if there's any events on hold to be fired to listeners
     */
    function _handlePubSub() {
        var i, len;
        if (!_storage.__jstorage_meta.PubSub) {
            return;
        }
        var pubelm,
            _pubsubCurrent = _pubsub_last,
            needFired = [];

        for (i = len = _storage.__jstorage_meta.PubSub.length - 1; i >= 0; i--) {
            pubelm = _storage.__jstorage_meta.PubSub[i];
            if (pubelm[0] > _pubsub_last) {
                _pubsubCurrent = pubelm[0];
                needFired.unshift(pubelm);
            }
        }

        for (i = needFired.length - 1; i >= 0; i--) {
            _fireSubscribers(needFired[i][1], needFired[i][2]);
        }

        _pubsub_last = _pubsubCurrent;
    }

    /**
     * Fires all subscriber listeners for a pubsub channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload data to deliver
     */
    function _fireSubscribers(channel, payload) {
        if (_pubsub_observers[channel]) {
            for (var i = 0, len = _pubsub_observers[channel].length; i < len; i++) {
                // send immutable data that can't be modified by listeners
                try {
                    _pubsub_observers[channel][i](channel, JSON.parse(JSON.stringify(payload)));
                } catch (E) {}
            }
        }
    }

    /**
     * Remove old events from the publish stream (at least 2sec old)
     */
    function _dropOldEvents() {
        if (!_storage.__jstorage_meta.PubSub) {
            return;
        }

        var retire = +new Date() - 2000;

        for (var i = 0, len = _storage.__jstorage_meta.PubSub.length; i < len; i++) {
            if (_storage.__jstorage_meta.PubSub[i][0] <= retire) {
                // deleteCount is needed for IE6
                _storage.__jstorage_meta.PubSub.splice(i, _storage.__jstorage_meta.PubSub.length - i);
                break;
            }
        }

        if (!_storage.__jstorage_meta.PubSub.length) {
            delete _storage.__jstorage_meta.PubSub;
        }

    }

    /**
     * Publish payload to a channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload to send to the subscribers
     */
    function _publish(channel, payload) {
        if (!_storage.__jstorage_meta) {
            _storage.__jstorage_meta = {};
        }
        if (!_storage.__jstorage_meta.PubSub) {
            _storage.__jstorage_meta.PubSub = [];
        }

        _storage.__jstorage_meta.PubSub.unshift([+new Date(), channel, payload]);

        _save();
        _publishChange();
    }


    /**
     * JS Implementation of MurmurHash2
     *
     *  SOURCE: https://github.com/garycourt/murmurhash-js (MIT licensed)
     *
     * @author <a href='mailto:gary.court@gmail.com'>Gary Court</a>
     * @see http://github.com/garycourt/murmurhash-js
     * @author <a href='mailto:aappleby@gmail.com'>Austin Appleby</a>
     * @see http://sites.google.com/site/murmurhash/
     *
     * @param {string} str ASCII only
     * @param {number} seed Positive integer only
     * @return {number} 32-bit positive integer hash
     */

    function murmurhash2_32_gc(str, seed) {
        var
            l = str.length,
            h = seed ^ l,
            i = 0,
            k;

        while (l >= 4) {
            k =
                ((str.charCodeAt(i) & 0xff)) |
                    ((str.charCodeAt(++i) & 0xff) << 8) |
                    ((str.charCodeAt(++i) & 0xff) << 16) |
                    ((str.charCodeAt(++i) & 0xff) << 24);

            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
            k ^= k >>> 24;
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

            l -= 4;
            ++i;
        }

        switch (l) {
            case 3:
                h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
            /* falls through */
            case 2:
                h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
            /* falls through */
            case 1:
                h ^= (str.charCodeAt(i) & 0xff);
                h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        }

        h ^= h >>> 13;
        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        h ^= h >>> 15;

        return h >>> 0;
    }

    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    $.jStorage = {
        /* Version number */
        version: JSTORAGE_VERSION,

        /**
         * Sets a key's value.
         *
         * @param {String} key Key to set. If this value is not set or not
         *              a string an exception is raised.
         * @param {Mixed} value Value to set. This can be any value that is JSON
         *              compatible (Numbers, Strings, Objects etc.).
         * @param {Object} [options] - possible options to use
         * @param {Number} [options.TTL] - optional TTL value, in milliseconds
         * @return {Mixed} the used value
         */
        set: function(key, value, options) {
            _checkKey(key);

            options = options || {};

            // undefined values are deleted automatically
            if (typeof value == 'undefined') {
                this.deleteKey(key);
                return value;
            }

            if (_XMLService.isXML(value)) {
                value = {
                    _is_xml: true,
                    xml: _XMLService.encode(value)
                };
            } else if (typeof value == 'function') {
                return undefined; // functions can't be saved!
            } else if (value && typeof value == 'object') {
                // clone the object before saving to _storage tree
                value = JSON.parse(JSON.stringify(value));
            }

            _storage[key] = value;

            _storage.__jstorage_meta.CRC32[key] = '2.' + murmurhash2_32_gc(JSON.stringify(value), 0x9747b28c);

            this.setTTL(key, options.TTL || 0); // also handles saving and _publishChange

            _fireObservers(key, 'updated');
            return value;
        },

        /**
         * Looks up a key in cache
         *
         * @param {String} key - Key to look up.
         * @param {mixed} def - Default value to return, if key didn't exist.
         * @return {Mixed} the key value, default value or null
         */
        get: function(key, def) {
            _checkKey(key);
            if (key in _storage) {
                if (_storage[key] && typeof _storage[key] == 'object' && _storage[key]._is_xml) {
                    return _XMLService.decode(_storage[key].xml);
                } else {
                    return _storage[key];
                }
            }
            return typeof(def) == 'undefined' ? null : def;
        },

        /**
         * Deletes a key from cache.
         *
         * @param {String} key - Key to delete.
         * @return {Boolean} true if key existed or false if it didn't
         */
        deleteKey: function(key) {
            _checkKey(key);
            if (key in _storage) {
                delete _storage[key];
                // remove from TTL list
                if (typeof _storage.__jstorage_meta.TTL == 'object' &&
                    key in _storage.__jstorage_meta.TTL) {
                    delete _storage.__jstorage_meta.TTL[key];
                }

                delete _storage.__jstorage_meta.CRC32[key];

                _save();
                _publishChange();
                _fireObservers(key, 'deleted');
                return true;
            }
            return false;
        },

        /**
         * Sets a TTL for a key, or remove it if ttl value is 0 or below
         *
         * @param {String} key - key to set the TTL for
         * @param {Number} ttl - TTL timeout in milliseconds
         * @return {Boolean} true if key existed or false if it didn't
         */
        setTTL: function(key, ttl) {
            var curtime = +new Date();
            _checkKey(key);
            ttl = Number(ttl) || 0;
            if (key in _storage) {

                if (!_storage.__jstorage_meta.TTL) {
                    _storage.__jstorage_meta.TTL = {};
                }

                // Set TTL value for the key
                if (ttl > 0) {
                    _storage.__jstorage_meta.TTL[key] = curtime + ttl;
                } else {
                    delete _storage.__jstorage_meta.TTL[key];
                }

                _save();

                _handleTTL();

                _publishChange();
                return true;
            }
            return false;
        },

        /**
         * Gets remaining TTL (in milliseconds) for a key or 0 when no TTL has been set
         *
         * @param {String} key Key to check
         * @return {Number} Remaining TTL in milliseconds
         */
        getTTL: function(key) {
            var curtime = +new Date(),
                ttl;
            _checkKey(key);
            if (key in _storage && _storage.__jstorage_meta.TTL && _storage.__jstorage_meta.TTL[key]) {
                ttl = _storage.__jstorage_meta.TTL[key] - curtime;
                return ttl || 0;
            }
            return 0;
        },

        /**
         * Deletes everything in cache.
         *
         * @return {Boolean} Always true
         */
        flush: function() {
            _storage = {
                __jstorage_meta: {
                    CRC32: {}
                }
            };
            _save();
            _publishChange();
            _fireObservers(null, 'flushed');
            return true;
        },

        /**
         * Returns a read-only copy of _storage
         *
         * @return {Object} Read-only copy of _storage
         */
        storageObj: function() {
            function F() {}
            F.prototype = _storage;
            return new F();
        },

        /**
         * Returns an index of all used keys as an array
         * ['key1', 'key2',..'keyN']
         *
         * @return {Array} Used keys
         */
        index: function() {
            var index = [],
                i;
            for (i in _storage) {
                if (_storage.hasOwnProperty(i) && i != '__jstorage_meta') {
                    index.push(i);
                }
            }
            return index;
        },

        /**
         * How much space in bytes does the storage take?
         *
         * @return {Number} Storage size in chars (not the same as in bytes,
         *                  since some chars may take several bytes)
         */
        storageSize: function() {
            return _storage_size;
        },

        /**
         * Which backend is currently in use?
         *
         * @return {String} Backend name
         */
        currentBackend: function() {
            return _backend;
        },

        /**
         * Test if storage is available
         *
         * @return {Boolean} True if storage can be used
         */
        storageAvailable: function() {
            return !!_backend;
        },

        /**
         * Register change listeners
         *
         * @param {String} key Key name
         * @param {Function} callback Function to run when the key changes
         */
        listenKeyChange: function(key, callback) {
            _checkKey(key);
            if (!_observers[key]) {
                _observers[key] = [];
            }
            _observers[key].push(callback);
        },

        /**
         * Remove change listeners
         *
         * @param {String} key Key name to unregister listeners against
         * @param {Function} [callback] If set, unregister the callback, if not - unregister all
         */
        stopListening: function(key, callback) {
            _checkKey(key);

            if (!_observers[key]) {
                return;
            }

            if (!callback) {
                delete _observers[key];
                return;
            }

            for (var i = _observers[key].length - 1; i >= 0; i--) {
                if (_observers[key][i] == callback) {
                    _observers[key].splice(i, 1);
                }
            }
        },

        /**
         * Subscribe to a Publish/Subscribe event stream
         *
         * @param {String} channel Channel name
         * @param {Function} callback Function to run when the something is published to the channel
         */
        subscribe: function(channel, callback) {
            channel = (channel || '').toString();
            if (!channel) {
                throw new TypeError('Channel not defined');
            }
            if (!_pubsub_observers[channel]) {
                _pubsub_observers[channel] = [];
            }
            _pubsub_observers[channel].push(callback);
        },

        /**
         * Publish data to an event stream
         *
         * @param {String} channel Channel name
         * @param {Mixed} payload Payload to deliver
         */
        publish: function(channel, payload) {
            channel = (channel || '').toString();
            if (!channel) {
                throw new TypeError('Channel not defined');
            }

            _publish(channel, payload);
        },

        /**
         * Reloads the data from browser storage
         */
        reInit: function() {
            _reloadData();
        },

        /**
         * Removes reference from global objects and saves it as jStorage
         *
         * @param {Boolean} option if needed to save object as simple 'jStorage' in windows context
         */
        noConflict: function(saveInGlobal) {
            delete window.$.jStorage;

            if (saveInGlobal) {
                window.jStorage = this;
            }

            return this;
        }
    };

    // Initialize jStorage
    _init();

})();
/**
 * @preserve jQuery DateTimePicker plugin v2.4.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout*/

(function(jQuery){
    var module, define;
(function ($) {
    'use strict';
    var default_options  = {
        i18n: {
            ar: { // Arabic
                months: [
                    "كانون الثاني", "شباط", "آذار", "نيسان", "مايو", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
                ],
                dayOfWeek: [
                    "ن", "ث", "ع", "خ", "ج", "س", "ح"
                ]
            },
            ro: { // Romanian
                months: [
                    "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
                ],
                dayOfWeek: [
                    "l", "ma", "mi", "j", "v", "s", "d"
                ]
            },
            id: { // Indonesian
                months: [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeek: [
                    "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"
                ]
            },
            bg: { // Bulgarian
                months: [
                    "Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"
                ],
                dayOfWeek: [
                    "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
                ]
            },
            fa: { // Persian/Farsi
                months: [
                    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
                ],
                dayOfWeek: [
                    'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
                ]
            },
            ru: { // Russian
                months: [
                    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ],
                dayOfWeek: [
                    "Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
                ]
            },
            uk: { // Ukrainian
                months: [
                    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
                ],
                dayOfWeek: [
                    "Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"
                ]
            },
            en: { // English
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeek: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ]
            },
            el: { // Ελληνικά
                months: [
                    "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
                ],
                dayOfWeek: [
                    "Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"
                ]
            },
            de: { // German
                months: [
                    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                ],
                dayOfWeek: [
                    "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"
                ]
            },
            nl: { // Dutch
                months: [
                    "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"
                ],
                dayOfWeek: [
                    "zo", "ma", "di", "wo", "do", "vr", "za"
                ]
            },
            tr: { // Turkish
                months: [
                    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
                ],
                dayOfWeek: [
                    "Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"
                ]
            },
            fr: { //French
                months: [
                    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                ],
                dayOfWeek: [
                    "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"
                ]
            },
            es: { // Spanish
                months: [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                dayOfWeek: [
                    "Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"
                ]
            },
            th: { // Thai
                months: [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
                ],
                dayOfWeek: [
                    'อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'
                ]
            },
            pl: { // Polish
                months: [
                    "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"
                ],
                dayOfWeek: [
                    "nd", "pn", "wt", "śr", "cz", "pt", "sb"
                ]
            },
            pt: { // Portuguese
                months: [
                    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeek: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"
                ]
            },
            ch: { // Simplified Chinese
                months: [
                    "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
                ],
                dayOfWeek: [
                    "日", "一", "二", "三", "四", "五", "六"
                ]
            },
            se: { // Swedish
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September",  "Oktober", "November", "December"
                ],
                dayOfWeek: [
                    "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
                ]
            },
            kr: { // Korean
                months: [
                    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
                ],
                dayOfWeek: [
                    "일", "월", "화", "수", "목", "금", "토"
                ]
            },
            it: { // Italian
                months: [
                    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
                ],
                dayOfWeek: [
                    "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"
                ]
            },
            da: { // Dansk
                months: [
                    "January", "Februar", "Marts", "April", "Maj", "Juni", "July", "August", "September", "Oktober", "November", "December"
                ],
                dayOfWeek: [
                    "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
                ]
            },
            no: { // Norwegian
                months: [
                    "Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"
                ],
                dayOfWeek: [
                    "Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"
                ]
            },
            ja: { // Japanese
                months: [
                    "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
                ],
                dayOfWeek: [
                    "日", "月", "火", "水", "木", "金", "土"
                ]
            },
            vi: { // Vietnamese
                months: [
                    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
                ],
                dayOfWeek: [
                    "CN", "T2", "T3", "T4", "T5", "T6", "T7"
                ]
            },
            sl: { // Slovenščina
                months: [
                    "Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
                ],
                dayOfWeek: [
                    "Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"
                ]
            },
            cs: { // Čeština
                months: [
                    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
                ],
                dayOfWeek: [
                    "Ne", "Po", "Út", "St", "Čt", "Pá", "So"
                ]
            },
            hu: { // Hungarian
                months: [
                    "Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"
                ],
                dayOfWeek: [
                    "Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo"
                ]
            },
            az: { //Azerbaijanian (Azeri)
                months: [
                    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
                ],
                dayOfWeek: [
                    "B", "Be", "Ça", "Ç", "Ca", "C", "Ş"
                ]
            },
            bs: { //Bosanski
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeek: [
                    "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
                ]
            },
            ca: { //Català
                months: [
                    "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
                ],
                dayOfWeek: [
                    "Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"
                ]
            },
            'en-GB': { //English (British)
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeek: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ]
            },
            et: { //"Eesti"
                months: [
                    "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"
                ],
                dayOfWeek: [
                    "P", "E", "T", "K", "N", "R", "L"
                ]
            },
            eu: { //Euskara
                months: [
                    "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"
                ],
                dayOfWeek: [
                    "Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."
                ]
            },
            fi: { //Finnish (Suomi)
                months: [
                    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
                ],
                dayOfWeek: [
                    "Su", "Ma", "Ti", "Ke", "To", "Pe", "La"
                ]
            },
            gl: { //Galego
                months: [
                    "Xan", "Feb", "Maz", "Abr", "Mai", "Xun", "Xul", "Ago", "Set", "Out", "Nov", "Dec"
                ],
                dayOfWeek: [
                    "Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"
                ]
            },
            hr: { //Hrvatski
                months: [
                    "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
                ],
                dayOfWeek: [
                    "Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"
                ]
            },
            ko: { //Korean (한국어)
                months: [
                    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
                ],
                dayOfWeek: [
                    "일", "월", "화", "수", "목", "금", "토"
                ]
            },
            lt: { //Lithuanian (lietuvių)
                months: [
                    "Sausio", "Vasario", "Kovo", "Balandžio", "Gegužės", "Birželio", "Liepos", "Rugpjūčio", "Rugsėjo", "Spalio", "Lapkričio", "Gruodžio"
                ],
                dayOfWeek: [
                    "Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš"
                ]
            },
            lv: { //Latvian (Latviešu)
                months: [
                    "Janvāris", "Februāris", "Marts", "Aprīlis ", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"
                ],
                dayOfWeek: [
                    "Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"
                ]
            },
            mk: { //Macedonian (Македонски)
                months: [
                    "јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"
                ],
                dayOfWeek: [
                    "нед", "пон", "вто", "сре", "чет", "пет", "саб"
                ]
            },
            mn: { //Mongolian (Монгол)
                months: [
                    "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
                ],
                dayOfWeek: [
                    "Дав", "Мяг", "Лха", "Пүр", "Бсн", "Бям", "Ням"
                ]
            },
            'pt-BR': { //Português(Brasil)
                months: [
                    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                dayOfWeek: [
                    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
                ]
            },
            sk: { //Slovenčina
                months: [
                    "Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"
                ],
                dayOfWeek: [
                    "Ne", "Po", "Ut", "St", "Št", "Pi", "So"
                ]
            },
            sq: { //Albanian (Shqip)
                months: [
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ],
                dayOfWeek: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
                ]
            },
            'sr-YU': { //Serbian (Srpski)
                months: [
                    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
                ],
                dayOfWeek: [
                    "Ned", "Pon", "Uto", "Sre", "čet", "Pet", "Sub"
                ]
            },
            sr: { //Serbian Cyrillic (Српски)
                months: [
                    "јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"
                ],
                dayOfWeek: [
                    "нед", "пон", "уто", "сре", "чет", "пет", "суб"
                ]
            },
            sv: { //Svenska
                months: [
                    "Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"
                ],
                dayOfWeek: [
                    "Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"
                ]
            },
            'zh-TW': { //Traditional Chinese (繁體中文)
                months: [
                    "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
                ],
                dayOfWeek: [
                    "日", "一", "二", "三", "四", "五", "六"
                ]
            },
            zh: { //Simplified Chinese (简体中文)
                months: [
                    "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
                ],
                dayOfWeek: [
                    "日", "一", "二", "三", "四", "五", "六"
                ]
            },
            he: { //Hebrew (עברית)
                months: [
                    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
                ],
                dayOfWeek: [
                    'א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'
                ]
            }
        },
        value: '',
        lang: 'en',

        format:	'Y/m/d H:i',
        formatTime:	'H:i',
        formatDate:	'Y/m/d',

        startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
        step: 60,
        monthChangeSpinner: true,

        closeOnDateSelect: false,
        closeOnWithoutClick: true,
        closeOnInputClick: true,

        timepicker: true,
        datepicker: true,
        weeks: false,

        defaultTime: false,	// use formatTime format (ex. '10:00' for formatTime:	'H:i')
        defaultDate: false,	// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

        minDate: false,
        maxDate: false,
        minTime: false,
        maxTime: false,

        allowTimes: [],
        opened: false,
        initTime: true,
        inline: false,
        theme: '',

        onSelectDate: function () {},
        onSelectTime: function () {},
        onChangeMonth: function () {},
        onChangeYear: function () {},
        onChangeDateTime: function () {},
        onShow: function () {},
        onClose: function () {},
        onGenerate: function () {},

        withoutCopyright: true,
        inverseButton: false,
        hours12: false,
        next:	'xdsoft_next',
        prev : 'xdsoft_prev',
        dayOfWeekStart: 0,
        parentID: 'body',
        timeHeightInTimePicker: 25,
        timepickerScrollbar: true,
        todayButton: true,
        defaultSelect: true,

        scrollMonth: true,
        scrollTime: true,
        scrollInput: true,

        lazyInit: false,
        mask: false,
        validateOnBlur: true,
        allowBlank: true,
        yearStart: 1950,
        yearEnd: 2050,
        style: '',
        id: '',
        fixed: false,
        roundTime: 'round', // ceil, floor
        className: '',
        weekends: [],
        disabledDates : [],
        yearOffset: 0,
        beforeShowDay: null,

        enterLikeTab: true
    };
    // fix for ie8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            var i, j;
            for (i = (start || 0), j = this.length; i < j; i += 1) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        };
    }
    Date.prototype.countDaysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };
    $.fn.xdsoftScroller = function (percent) {
        return this.each(function () {
            var timeboxparent = $(this),
                pointerEventToXY = function (e) {
                    var out = {x: 0, y: 0},
                        touch;
                    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                        touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                        out.x = touch.clientX;
                        out.y = touch.clientY;
                    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                        out.x = e.clientX;
                        out.y = e.clientY;
                    }
                    return out;
                },
                move = 0,
                timebox,
                parentHeight,
                height,
                scrollbar,
                scroller,
                maximumOffset = 100,
                start = false,
                startY = 0,
                startTop = 0,
                h1 = 0,
                touchStart = false,
                startTopScroll = 0,
                calcOffset = function () {};
            if (percent === 'hide') {
                timeboxparent.find('.xdsoft_scrollbar').hide();
                return;
            }
            if (!$(this).hasClass('xdsoft_scroller_box')) {
                timebox = timeboxparent.children().eq(0);
                parentHeight = timeboxparent[0].clientHeight;
                height = timebox[0].offsetHeight;
                scrollbar = $('<div class="xdsoft_scrollbar"></div>');
                scroller = $('<div class="xdsoft_scroller"></div>');
                scrollbar.append(scroller);

                timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
                calcOffset = function calcOffset(event) {
                    var offset = pointerEventToXY(event).y - startY + startTopScroll;
                    if (offset < 0) {
                        offset = 0;
                    }
                    if (offset + scroller[0].offsetHeight > h1) {
                        offset = h1 - scroller[0].offsetHeight;
                    }
                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
                };

                scroller
                    .on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
                        }

                        startY = pointerEventToXY(event).y;
                        startTopScroll = parseInt(scroller.css('margin-top'), 10);
                        h1 = scrollbar[0].offsetHeight;

                        if (event.type === 'mousedown') {
                            if (document) {
                                $(document.body).addClass('xdsoft_noselect');
                            }
                            $([document.body, window]).on('mouseup.xdsoft_scroller', function arguments_callee() {
                                $([document.body, window]).off('mouseup.xdsoft_scroller', arguments_callee)
                                    .off('mousemove.xdsoft_scroller', calcOffset)
                                    .removeClass('xdsoft_noselect');
                            });
                            $(document.body).on('mousemove.xdsoft_scroller', calcOffset);
                        } else {
                            touchStart = true;
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    })
                    .on('touchmove', function (event) {
                        if (touchStart) {
                            event.preventDefault();
                            calcOffset(event);
                        }
                    })
                    .on('touchend touchcancel', function (event) {
                        touchStart =  false;
                        startTopScroll = 0;
                    });

                timeboxparent
                    .on('scroll_element.xdsoft_scroller', function (event, percentage) {
                        if (!parentHeight) {
                            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
                        }
                        percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

                        scroller.css('margin-top', maximumOffset * percentage);

                        setTimeout(function () {
                            timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
                        }, 10);
                    })
                    .on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
                        var percent, sh;
                        parentHeight = timeboxparent[0].clientHeight;
                        height = timebox[0].offsetHeight;
                        percent = parentHeight / height;
                        sh = percent * scrollbar[0].offsetHeight;
                        if (percent > 1) {
                            scroller.hide();
                        } else {
                            scroller.show();
                            scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
                            maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
                            if (noTriggerScroll !== true) {
                                timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
                            }
                        }
                    });

                timeboxparent.on('mousewheel', function (event) {
                    var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

                    top = top - (event.deltaY * 20);
                    if (top < 0) {
                        top = 0;
                    }

                    timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
                    event.stopPropagation();
                    return false;
                });

                timeboxparent.on('touchstart', function (event) {
                    start = pointerEventToXY(event);
                    startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
                });

                timeboxparent.on('touchmove', function (event) {
                    if (start) {
                        event.preventDefault();
                        var coord = pointerEventToXY(event);
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
                    }
                });

                timeboxparent.on('touchend touchcancel', function (event) {
                    start = false;
                    startTop = 0;
                });
            }
            timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
        });
    };

    $.fn.datetimepicker = function (opt) {
        var KEY0 = 48,
            KEY9 = 57,
            _KEY0 = 96,
            _KEY9 = 105,
            CTRLKEY = 17,
            DEL = 46,
            ENTER = 13,
            ESC = 27,
            BACKSPACE = 8,
            ARROWLEFT = 37,
            ARROWUP = 38,
            ARROWRIGHT = 39,
            ARROWDOWN = 40,
            TAB = 9,
            F5 = 116,
            AKEY = 65,
            CKEY = 67,
            VKEY = 86,
            ZKEY = 90,
            YKEY = 89,
            ctrlDown	=	false,
            options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

            lazyInitTimer = 0,
            createDateTimePicker,
            destroyDateTimePicker,

            lazyInit = function (input) {
                if(typeof options.i18n[options.lang] === 'undefined'){
                    options.lang = 'en';
                }
                input
                    .on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function initOnActionCallback(event) {
                        if (input.is(':disabled') || input.data('xdsoft_datetimepicker')) {
                            return;
                        }
                        clearTimeout(lazyInitTimer);
                        lazyInitTimer = setTimeout(function () {

                            if (!input.data('xdsoft_datetimepicker')) {
                                createDateTimePicker(input);
                            }
                            input
                                .off('open.xdsoft focusin.xdsoft mousedown.xdsoft', initOnActionCallback)
                                .trigger('open.xdsoft');
                        }, 100);
                    });
            };

        createDateTimePicker = function (input) {
            var datetimepicker = $('<div ' + (options.id ? 'id="' + options.id + '"' : '') + ' ' + (options.style ? 'style="' + options.style + '"' : '') + ' class="xdsoft_datetimepicker xdsoft_' + options.theme + ' xdsoft_noselect ' + (options.weeks ? ' xdsoft_showweeks' : '') + options.className + '"></div>'),
                xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
                datepicker = $('<div class="xdsoft_datepicker active"></div>'),
                mounth_picker = $('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button>' +
                '<div class="xdsoft_label xdsoft_month"><span></span><i></i></div>' +
                '<div class="xdsoft_label xdsoft_year"><span></span><i></i></div>' +
                '<button type="button" class="xdsoft_next"></button></div>'),
                calendar = $('<div class="xdsoft_calendar"></div>'),
                timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),
                timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
                timebox = $('<div class="xdsoft_time_variant"></div>'),
            /*scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
             scroller = $('<div class="xdsoft_scroller"></div>'),*/
                monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
                yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
                triggerAfterOpen = false,
                XDSoft_datetime,
            //scroll_element,
                xchangeTimer,
                timerclick,
                current_time_index,
                setPos,
                timer = 0,
                timer1 = 0,
                _xdsoft_datetime;

            mounth_picker
                .find('.xdsoft_month span')
                .after(monthselect);
            mounth_picker
                .find('.xdsoft_year span')
                .after(yearselect);

            mounth_picker
                .find('.xdsoft_month,.xdsoft_year')
                .on('mousedown.xdsoft', function (event) {
                    var select = $(this).find('.xdsoft_select').eq(0),
                        val = 0,
                        top = 0,
                        visible = select.is(':visible'),
                        items,
                        i;

                    mounth_picker
                        .find('.xdsoft_select')
                        .hide();
                    if (_xdsoft_datetime.currentTime) {
                        val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
                    }

                    select[visible ? 'hide' : 'show']();
                    for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
                        if (items.eq(i).data('value') === val) {
                            break;
                        } else {
                            top += items[0].offsetHeight;
                        }
                    }

                    select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
                    event.stopPropagation();
                    return false;
                });

            mounth_picker
                .find('.xdsoft_select')
                .xdsoftScroller()
                .on('mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                })
                .on('mousedown.xdsoft', '.xdsoft_option', function (event) {
                    var year = _xdsoft_datetime.currentTime.getFullYear();
                    if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
                        _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
                    }

                    $(this).parent().parent().hide();

                    datetimepicker.trigger('xchange.xdsoft');
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }

                    if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                });

            datetimepicker.setOptions = function (_options) {
                options = $.extend(true, {}, options, _options);

                if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
                    options.allowTimes = $.extend(true, [], _options.allowTimes);
                }

                if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
                    options.weekends = $.extend(true, [], _options.weekends);
                }

                if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
                    options.disabledDates = $.extend(true, [], _options.disabledDates);
                }

                if ((options.open || options.opened) && (!options.inline)) {
                    input.trigger('open.xdsoft');
                }

                if (options.inline) {
                    triggerAfterOpen = true;
                    datetimepicker.addClass('xdsoft_inline');
                    input.after(datetimepicker).hide();
                }

                if (options.inverseButton) {
                    options.next = 'xdsoft_prev';
                    options.prev = 'xdsoft_next';
                }

                if (options.datepicker) {
                    datepicker.addClass('active');
                } else {
                    datepicker.removeClass('active');
                }

                if (options.timepicker) {
                    timepicker.addClass('active');
                } else {
                    timepicker.removeClass('active');
                }

                if (options.value) {
                    if (input && input.val) {
                        input.val(options.value);
                    }
                    _xdsoft_datetime.setCurrentTime(options.value);
                }

                if (isNaN(options.dayOfWeekStart)) {
                    options.dayOfWeekStart = 0;
                } else {
                    options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
                }

                if (!options.timepickerScrollbar) {
                    timeboxparent.xdsoftScroller('hide');
                }

                if (options.minDate && /^-(.*)$/.test(options.minDate)) {
                    options.minDate = _xdsoft_datetime.strToDateTime(options.minDate).dateFormat(options.formatDate);
                }

                if (options.maxDate &&  /^\+(.*)$/.test(options.maxDate)) {
                    options.maxDate = _xdsoft_datetime.strToDateTime(options.maxDate).dateFormat(options.formatDate);
                }

                mounth_picker
                    .find('.xdsoft_today_button')
                    .css('visibility', !options.todayButton ? 'hidden' : 'visible');

                if (options.mask) {
                    var e,
                        getCaretPos = function (input) {
                            try {
                                if (document.selection && document.selection.createRange) {
                                    var range = document.selection.createRange();
                                    return range.getBookmark().charCodeAt(2) - 2;
                                }
                                if (input.setSelectionRange) {
                                    return input.selectionStart;
                                }
                            } catch (e) {
                                return 0;
                            }
                        },
                        setCaretPos = function (node, pos) {
                            node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
                            if (!node) {
                                return false;
                            }
                            if (node.createTextRange) {
                                var textRange = node.createTextRange();
                                textRange.collapse(true);
                                textRange.moveEnd('character', pos);
                                textRange.moveStart('character', pos);
                                textRange.select();
                                return true;
                            }
                            if (node.setSelectionRange) {
                                node.setSelectionRange(pos, pos);
                                return true;
                            }
                            return false;
                        },
                        isValidValue = function (mask, value) {
                            var reg = mask
                                .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
                                .replace(/_/g, '{digit+}')
                                .replace(/([0-9]{1})/g, '{digit$1}')
                                .replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
                                .replace(/\{digit[\+]\}/g, '[0-9_]{1}');
                            return (new RegExp(reg)).test(value);
                        };
                    input.off('keydown.xdsoft');

                    if (options.mask === true) {
                        options.mask = options.format
                            .replace(/Y/g, '9999')
                            .replace(/F/g, '9999')
                            .replace(/m/g, '19')
                            .replace(/d/g, '39')
                            .replace(/H/g, '29')
                            .replace(/i/g, '59')
                            .replace(/s/g, '59');
                    }

                    if ($.type(options.mask) === 'string') {
                        if (!isValidValue(options.mask, input.val())) {
                            input.val(options.mask.replace(/[0-9]/g, '_'));
                        }

                        input.on('keydown.xdsoft', function (event) {
                            var val = this.value,
                                key = event.which,
                                pos,
                                digit;

                            if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
                                pos = getCaretPos(this);
                                digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

                                if ((key === BACKSPACE || key === DEL) && pos) {
                                    pos -= 1;
                                    digit = '_';
                                }

                                while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                    pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                                }

                                val = val.substr(0, pos) + digit + val.substr(pos + 1);
                                if ($.trim(val) === '') {
                                    val = options.mask.replace(/[0-9]/g, '_');
                                } else {
                                    if (pos === options.mask.length) {
                                        event.preventDefault();
                                        return false;
                                    }
                                }

                                pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
                                while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                                    pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
                                }

                                if (isValidValue(options.mask, val)) {
                                    this.value = val;
                                    setCaretPos(this, pos);
                                } else if ($.trim(val) === '') {
                                    this.value = options.mask.replace(/[0-9]/g, '_');
                                } else {
                                    input.trigger('error_input.xdsoft');
                                }
                            } else {
                                if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
                                    return true;
                                }
                            }

                            event.preventDefault();
                            return false;
                        });
                    }
                }
                if (options.validateOnBlur) {
                    input
                        .off('blur.xdsoft')
                        .on('blur.xdsoft', function () {
                            if (options.allowBlank && !$.trim($(this).val()).length) {
                                $(this).val(null);
                                datetimepicker.data('xdsoft_datetime').empty();
                            } else if (!Date.parseDate($(this).val(), options.format)) {
                                $(this).val((_xdsoft_datetime.now()).dateFormat(options.format));
                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            } else {
                                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
                            }
                            datetimepicker.trigger('changedatetime.xdsoft');
                        });
                }
                options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

                datetimepicker
                    .trigger('xchange.xdsoft')
                    .trigger('afterOpen.xdsoft');
            };

            datetimepicker
                .data('options', options)
                .on('mousedown.xdsoft', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    yearselect.hide();
                    monthselect.hide();
                    return false;
                });

            //scroll_element = timepicker.find('.xdsoft_time_box');
            timeboxparent.append(timebox);
            timeboxparent.xdsoftScroller();

            datetimepicker.on('afterOpen.xdsoft', function () {
                timeboxparent.xdsoftScroller();
            });

            datetimepicker
                .append(datepicker)
                .append(timepicker);

            if (options.withoutCopyright !== true) {
                datetimepicker
                    .append(xdsoft_copyright);
            }

            datepicker
                .append(mounth_picker)
                .append(calendar);

            $(options.parentID)
                .append(datetimepicker);

            XDSoft_datetime = function () {
                var _this = this;
                _this.now = function (norecursion) {
                    var d = new Date(),
                        date,
                        time;

                    if (!norecursion && options.defaultDate) {
                        date = _this.strToDate(options.defaultDate);
                        d.setFullYear(date.getFullYear());
                        d.setMonth(date.getMonth());
                        d.setDate(date.getDate());
                    }

                    if (options.yearOffset) {
                        d.setFullYear(d.getFullYear() + options.yearOffset);
                    }

                    if (!norecursion && options.defaultTime) {
                        time = _this.strtotime(options.defaultTime);
                        d.setHours(time.getHours());
                        d.setMinutes(time.getMinutes());
                    }

                    return d;
                };

                _this.isValidDate = function (d) {
                    if (Object.prototype.toString.call(d) !== "[object Date]") {
                        return false;
                    }
                    return !isNaN(d.getTime());
                };

                _this.setCurrentTime = function (dTime) {
                    _this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
                    datetimepicker.trigger('xchange.xdsoft');
                };

                _this.empty = function () {
                    _this.currentTime = null;
                };

                _this.getCurrentTime = function (dTime) {
                    return _this.currentTime;
                };

                _this.nextMonth = function () {
                    var month = _this.currentTime.getMonth() + 1,
                        year;
                    if (month === 12) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
                        month = 0;
                    }

                    year = _this.currentTime.getFullYear();

                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);

                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }

                    if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
                        options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }

                    datetimepicker.trigger('xchange.xdsoft');
                    return month;
                };

                _this.prevMonth = function () {
                    var month = _this.currentTime.getMonth() - 1;
                    if (month === -1) {
                        _this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
                        month = 11;
                    }
                    _this.currentTime.setDate(
                        Math.min(
                            new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
                            _this.currentTime.getDate()
                        )
                    );
                    _this.currentTime.setMonth(month);
                    if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
                        options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    datetimepicker.trigger('xchange.xdsoft');
                    return month;
                };

                _this.getWeekOfYear = function (datetime) {
                    var onejan = new Date(datetime.getFullYear(), 0, 1);
                    return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
                };

                _this.strToDateTime = function (sDateTime) {
                    var tmpDate = [], timeOffset, currentTime;

                    if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
                        return sDateTime;
                    }

                    tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
                    if (tmpDate) {
                        tmpDate[2] = Date.parseDate(tmpDate[2], options.formatDate);
                    }
                    if (tmpDate  && tmpDate[2]) {
                        timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
                        currentTime = new Date((_xdsoft_datetime.now()).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
                    } else {
                        currentTime = sDateTime ? Date.parseDate(sDateTime, options.format) : _this.now();
                    }

                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now();
                    }

                    return currentTime;
                };

                _this.strToDate = function (sDate) {
                    if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
                        return sDate;
                    }

                    var currentTime = sDate ? Date.parseDate(sDate, options.formatDate) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.strtotime = function (sTime) {
                    if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
                        return sTime;
                    }
                    var currentTime = sTime ? Date.parseDate(sTime, options.formatTime) : _this.now(true);
                    if (!_this.isValidDate(currentTime)) {
                        currentTime = _this.now(true);
                    }
                    return currentTime;
                };

                _this.str = function () {
                    return _this.currentTime.dateFormat(options.format);
                };
                _this.currentTime = this.now();
            };

            _xdsoft_datetime = new XDSoft_datetime();

            mounth_picker
                .find('.xdsoft_today_button')
                .on('mousedown.xdsoft', function () {
                    datetimepicker.data('changed', true);
                    _xdsoft_datetime.setCurrentTime(0);
                    datetimepicker.trigger('afterOpen.xdsoft');
                }).on('dblclick.xdsoft', function () {
                    input.val(_xdsoft_datetime.str());
                    datetimepicker.trigger('close.xdsoft');
                });
            mounth_picker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false;

                    (function arguments_callee1(v) {
                        var month =  _xdsoft_datetime.currentTime.getMonth();
                        if ($this.hasClass(options.next)) {
                            _xdsoft_datetime.nextMonth();
                        } else if ($this.hasClass(options.prev)) {
                            _xdsoft_datetime.prevMonth();
                        }
                        if (options.monthChangeSpinner) {
                            if (!stop) {
                                timer = setTimeout(arguments_callee1, v || 100);
                            }
                        }
                    }(500));

                    $([document.body, window]).on('mouseup.xdsoft', function arguments_callee2() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window]).off('mouseup.xdsoft', arguments_callee2);
                    });
                });

            timepicker
                .find('.xdsoft_prev,.xdsoft_next')
                .on('mousedown.xdsoft', function () {
                    var $this = $(this),
                        timer = 0,
                        stop = false,
                        period = 110;
                    (function arguments_callee4(v) {
                        var pheight = timeboxparent[0].clientHeight,
                            height = timebox[0].offsetHeight,
                            top = Math.abs(parseInt(timebox.css('marginTop'), 10));
                        if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
                            timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
                        } else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
                            timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
                        }
                        timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
                        period = (period > 10) ? 10 : period - 10;
                        if (!stop) {
                            timer = setTimeout(arguments_callee4, v || period);
                        }
                    }(500));
                    $([document.body, window]).on('mouseup.xdsoft', function arguments_callee5() {
                        clearTimeout(timer);
                        stop = true;
                        $([document.body, window])
                            .off('mouseup.xdsoft', arguments_callee5);
                    });
                });

            xchangeTimer = 0;
            // base handler - generating a calendar and timepicker
            datetimepicker
                .on('xchange.xdsoft', function (event) {
                    clearTimeout(xchangeTimer);
                    xchangeTimer = setTimeout(function () {
                        var table =	'',
                            start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
                            i = 0,
                            j,
                            today = _xdsoft_datetime.now(),
                            maxDate = false,
                            minDate = false,
                            d,
                            y,
                            m,
                            w,
                            classes = [],
                            customDateSettings,
                            newRow = true,
                            time = '',
                            h = '',
                            line_time;

                        while (start.getDay() !== options.dayOfWeekStart) {
                            start.setDate(start.getDate() - 1);
                        }

                        table += '<table><thead><tr>';

                        if (options.weeks) {
                            table += '<th></th>';
                        }

                        for (j = 0; j < 7; j += 1) {
                            table += '<th>' + options.i18n[options.lang].dayOfWeek[(j + options.dayOfWeekStart) % 7] + '</th>';
                        }

                        table += '</tr></thead>';
                        table += '<tbody>';

                        if (options.maxDate !== false) {
                            maxDate = _xdsoft_datetime.strToDate(options.maxDate);
                            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
                        }

                        if (options.minDate !== false) {
                            minDate = _xdsoft_datetime.strToDate(options.minDate);
                            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                        }

                        while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
                            classes = [];
                            i += 1;

                            d = start.getDate();
                            y = start.getFullYear();
                            m = start.getMonth();
                            w = _xdsoft_datetime.getWeekOfYear(start);

                            classes.push('xdsoft_date');

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
                                customDateSettings = options.beforeShowDay.call(datetimepicker, start);
                            } else {
                                customDateSettings = null;
                            }

                            if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
                                classes.push('xdsoft_disabled');
                            } else if (options.disabledDates.indexOf(start.dateFormat(options.formatDate)) !== -1) {
                                classes.push('xdsoft_disabled');
                            }

                            if (customDateSettings && customDateSettings[1] !== "") {
                                classes.push(customDateSettings[1]);
                            }

                            if (_xdsoft_datetime.currentTime.getMonth() !== m) {
                                classes.push('xdsoft_other_month');
                            }

                            if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push('xdsoft_current');
                            }

                            if (today.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
                                classes.push('xdsoft_today');
                            }

                            if (start.getDay() === 0 || start.getDay() === 6 || ~options.weekends.indexOf(start.dateFormat(options.formatDate))) {
                                classes.push('xdsoft_weekend');
                            }

                            if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
                                classes.push(options.beforeShowDay(start));
                            }

                            if (newRow) {
                                table += '<tr>';
                                newRow = false;
                                if (options.weeks) {
                                    table += '<th>' + w + '</th>';
                                }
                            }

                            table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '">' +
                            '<div>' + d + '</div>' +
                            '</td>';

                            if (start.getDay() === options.dayOfWeekStartPrev) {
                                table += '</tr>';
                                newRow = true;
                            }

                            start.setDate(d + 1);
                        }
                        table += '</tbody></table>';

                        calendar.html(table);

                        mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[options.lang].months[_xdsoft_datetime.currentTime.getMonth()]);
                        mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

                        // generate timebox
                        time = '';
                        h = '';
                        m = '';
                        line_time = function line_time(h, m) {
                            var now = _xdsoft_datetime.now();
                            now.setHours(h);
                            h = parseInt(now.getHours(), 10);
                            now.setMinutes(m);
                            m = parseInt(now.getMinutes(), 10);
                            var optionDateTime = new Date(_xdsoft_datetime.currentTime)
                            optionDateTime.setHours(h);
                            optionDateTime.setMinutes(m);
                            classes = [];
                            if((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
                                classes.push('xdsoft_disabled');
                            }
                            if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours(), 10) === parseInt(h, 10) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step === parseInt(m, 10))) {
                                if (options.defaultSelect || datetimepicker.data('changed')) {
                                    classes.push('xdsoft_current');
                                } else if (options.initTime) {
                                    classes.push('xdsoft_init_time');
                                }
                            }
                            if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
                                classes.push('xdsoft_today');
                            }
                            time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + now.dateFormat(options.formatTime) + '</div>';
                        };

                        if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
                            for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
                                for (j = 0; j < 60; j += options.step) {
                                    h = (i < 10 ? '0' : '') + i;
                                    m = (j < 10 ? '0' : '') + j;
                                    line_time(h, m);
                                }
                            }
                        } else {
                            for (i = 0; i < options.allowTimes.length; i += 1) {
                                h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
                                m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
                                line_time(h, m);
                            }
                        }

                        timebox.html(time);

                        opt = '';
                        i = 0;

                        for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
                        }
                        yearselect.children().eq(0)
                            .html(opt);

                        for (i = 0, opt = ''; i <= 11; i += 1) {
                            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[options.lang].months[i] + '</div>';
                        }
                        monthselect.children().eq(0).html(opt);
                        $(datetimepicker)
                            .trigger('generate.xdsoft');
                    }, 10);
                    event.stopPropagation();
                })
                .on('afterOpen.xdsoft', function () {
                    if (options.timepicker) {
                        var classType, pheight, height, top;
                        if (timebox.find('.xdsoft_current').length) {
                            classType = '.xdsoft_current';
                        } else if (timebox.find('.xdsoft_init_time').length) {
                            classType = '.xdsoft_init_time';
                        }
                        if (classType) {
                            pheight = timeboxparent[0].clientHeight;
                            height = timebox[0].offsetHeight;
                            top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
                            if ((height - pheight) < top) {
                                top = height - pheight;
                            }
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
                        } else {
                            timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
                        }
                    }
                });

            timerclick = 0;
            calendar
                .on('click.xdsoft', 'td', function (xdevent) {
                    xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
                    timerclick += 1;
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }

                    currentTime.setDate(1);
                    currentTime.setFullYear($this.data('year'));
                    currentTime.setMonth($this.data('month'));
                    currentTime.setDate($this.data('date'));

                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    input.val(_xdsoft_datetime.str());
                    if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === 0 && !options.timepicker))) && !options.inline) {
                        datetimepicker.trigger('close.xdsoft');
                    }

                    if (options.onSelectDate &&	$.isFunction(options.onSelectDate)) {
                        options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }

                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                    setTimeout(function () {
                        timerclick = 0;
                    }, 200);
                });

            timebox
                .on('click.xdsoft', 'div', function (xdevent) {
                    xdevent.stopPropagation();
                    var $this = $(this),
                        currentTime = _xdsoft_datetime.currentTime;

                    if (currentTime === undefined || currentTime === null) {
                        _xdsoft_datetime.currentTime = _xdsoft_datetime.now();
                        currentTime = _xdsoft_datetime.currentTime;
                    }

                    if ($this.hasClass('xdsoft_disabled')) {
                        return false;
                    }
                    currentTime.setHours($this.data('hour'));
                    currentTime.setMinutes($this.data('minute'));
                    datetimepicker.trigger('select.xdsoft', [currentTime]);

                    datetimepicker.data('input').val(_xdsoft_datetime.str());
                    if (!options.inline) {
                        datetimepicker.trigger('close.xdsoft');
                    }

                    if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
                        options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
                    }
                    datetimepicker.data('changed', true);
                    datetimepicker.trigger('xchange.xdsoft');
                    datetimepicker.trigger('changedatetime.xdsoft');
                });


            datepicker
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollMonth) {
                        return true;
                    }
                    if (event.deltaY < 0) {
                        _xdsoft_datetime.nextMonth();
                    } else {
                        _xdsoft_datetime.prevMonth();
                    }
                    return false;
                });

            input
                .on('mousewheel.xdsoft', function (event) {
                    if (!options.scrollInput) {
                        return true;
                    }
                    if (!options.datepicker && options.timepicker) {
                        current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
                        if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
                            current_time_index += event.deltaY;
                        }
                        if (timebox.children().eq(current_time_index).length) {
                            timebox.children().eq(current_time_index).trigger('mousedown');
                        }
                        return false;
                    }
                    if (options.datepicker && !options.timepicker) {
                        datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
                        if (input.val) {
                            input.val(_xdsoft_datetime.str());
                        }
                        datetimepicker.trigger('changedatetime.xdsoft');
                        return false;
                    }
                });

            datetimepicker
                .on('changedatetime.xdsoft', function (event) {
                    if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
                        var $input = datetimepicker.data('input');
                        options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
                        delete options.value;
                        $input.trigger('change');
                    }
                })
                .on('generate.xdsoft', function () {
                    if (options.onGenerate && $.isFunction(options.onGenerate)) {
                        options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
                    }
                    if (triggerAfterOpen) {
                        datetimepicker.trigger('afterOpen.xdsoft');
                        triggerAfterOpen = false;
                    }
                })
                .on('click.xdsoft', function (xdevent) {
                    xdevent.stopPropagation();
                });

            current_time_index = 0;

            setPos = function () {
                var offset = datetimepicker.data('input').offset(), top = offset.top + datetimepicker.data('input')[0].offsetHeight - 1, left = offset.left, position = "absolute";
                if (options.fixed) {
                    top -= $(window).scrollTop();
                    left -= $(window).scrollLeft();
                    position = "fixed";
                } else {
                    if (top + datetimepicker[0].offsetHeight > $(window).height() + $(window).scrollTop()) {
                        top = offset.top - datetimepicker[0].offsetHeight + 1;
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    if (left + datetimepicker[0].offsetWidth > $(window).width()) {
                        left = $(window).width() - datetimepicker[0].offsetWidth;
                    }
                }
                datetimepicker.css({
                    left: left,
                    top: top,
                    position: position
                });
            };
            datetimepicker
                .on('open.xdsoft', function (event) {
                    var onShow = true;
                    if (options.onShow && $.isFunction(options.onShow)) {
                        onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onShow !== false) {
                        datetimepicker.show();
                        setPos();
                        $(window)
                            .off('resize.xdsoft', setPos)
                            .on('resize.xdsoft', setPos);

                        if (options.closeOnWithoutClick) {
                            $([document.body, window]).on('mousedown.xdsoft', function arguments_callee6() {
                                datetimepicker.trigger('close.xdsoft');
                                $([document.body, window]).off('mousedown.xdsoft', arguments_callee6);
                            });
                        }
                    }
                })
                .on('close.xdsoft', function (event) {
                    var onClose = true;
                    mounth_picker
                        .find('.xdsoft_month,.xdsoft_year')
                        .find('.xdsoft_select')
                        .hide();
                    if (options.onClose && $.isFunction(options.onClose)) {
                        onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
                    }
                    if (onClose !== false && !options.opened && !options.inline) {
                        datetimepicker.hide();
                    }
                    event.stopPropagation();
                })
                .on('toggle.xdsoft', function (event) {
                    if (datetimepicker.is(':visible')) {
                        datetimepicker.trigger('close.xdsoft');
                    } else {
                        datetimepicker.trigger('open.xdsoft');
                    }
                })
                .data('input', input);

            timer = 0;
            timer1 = 0;

            datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
            datetimepicker.setOptions(options);

            function getCurrentValue() {

                var ct = false, time;

                if (options.startDate) {
                    ct = _xdsoft_datetime.strToDate(options.startDate);
                } else {
                    ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
                    if (ct) {
                        ct = _xdsoft_datetime.strToDateTime(ct);
                    } else if (options.defaultDate) {
                        ct = _xdsoft_datetime.strToDate(options.defaultDate);
                        if (options.defaultTime) {
                            time = _xdsoft_datetime.strtotime(options.defaultTime);
                            ct.setHours(time.getHours());
                            ct.setMinutes(time.getMinutes());
                        }
                    }
                }

                if (ct && _xdsoft_datetime.isValidDate(ct)) {
                    datetimepicker.data('changed', true);
                } else {
                    ct = '';
                }

                return ct || 0;
            }

            _xdsoft_datetime.setCurrentTime(getCurrentValue());

            input
                .data('xdsoft_datetimepicker', datetimepicker)
                .on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function (event) {
                    if (input.is(':disabled') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
                        return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (input.is(':disabled')) {
                            return;
                        }

                        triggerAfterOpen = true;
                        _xdsoft_datetime.setCurrentTime(getCurrentValue());

                        datetimepicker.trigger('open.xdsoft');
                    }, 100);
                })
                .on('keydown.xdsoft', function (event) {
                    var val = this.value, elementSelector,
                        key = event.which;
                    if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
                        elementSelector = $("input:visible,textarea:visible");
                        datetimepicker.trigger('close.xdsoft');
                        elementSelector.eq(elementSelector.index(this) + 1).focus();
                        return false;
                    }
                    if ([TAB].indexOf(key) !== -1) {
                        datetimepicker.trigger('close.xdsoft');
                        return true;
                    }
                });
        };
        destroyDateTimePicker = function (input) {
            var datetimepicker = input.data('xdsoft_datetimepicker');
            if (datetimepicker) {
                datetimepicker.data('xdsoft_datetime', null);
                datetimepicker.remove();
                input
                    .data('xdsoft_datetimepicker', null)
                    .off('.xdsoft');
                $(window).off('resize.xdsoft');
                $([window, document.body]).off('mousedown.xdsoft');
                if (input.unmousewheel) {
                    input.unmousewheel();
                }
            }
        };
        $(document)
            .off('keydown.xdsoftctrl keyup.xdsoftctrl')
            .on('keydown.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = true;
                }
            })
            .on('keyup.xdsoftctrl', function (e) {
                if (e.keyCode === CTRLKEY) {
                    ctrlDown = false;
                }
            });
        return this.each(function () {
            var datetimepicker = $(this).data('xdsoft_datetimepicker');
            if (datetimepicker) {
                if ($.type(opt) === 'string') {
                    switch (opt) {
                        case 'show':
                            $(this).select().focus();
                            datetimepicker.trigger('open.xdsoft');
                            break;
                        case 'hide':
                            datetimepicker.trigger('close.xdsoft');
                            break;
                        case 'toggle':
                            datetimepicker.trigger('toggle.xdsoft');
                            break;
                        case 'destroy':
                            destroyDateTimePicker($(this));
                            break;
                        case 'reset':
                            this.value = this.defaultValue;
                            if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(Date.parseDate(this.value, options.format))) {
                                datetimepicker.data('changed', false);
                            }
                            datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
                            break;
                    }
                } else {
                    datetimepicker
                        .setOptions(opt);
                }
                return 0;
            }
            if ($.type(opt) !== 'string') {
                if (!options.lazyInit || options.open || options.inline) {
                    createDateTimePicker($(this));
                } else {
                    lazyInit($(this));
                }
            }
        });
    };
    $.fn.datetimepicker.defaults = default_options;
}(jQuery));
(function () {
    /*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
     * Licensed under the MIT License (LICENSE.txt).
     *
     * Version: 3.1.12
     *
     * Requires: jQuery 1.2.2+
     */
    !function(a){"function"==typeof define&&define.amd?define(["jQuery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

// Parse and Format Library
//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
    /*
     * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
     *
     * This program is free software; you can redistribute it and/or modify it
     * under the terms of the GNU Lesser General Public License as published by the
     * Free Software Foundation, version 2.1.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
     * details.
     */
    Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function() {return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};
}());
})(n2);
;
(function (factory) {
    factory(n2);
}
(function ($) {
    "use strict";

    var pluginName = "tinyscrollbar", defaults =
        {
            axis: 'y'    // Vertical or horizontal scrollbar? ( x || y ).
            , wheel: true   // Enable or disable the mousewheel;
            , wheelSpeed: 40     // How many pixels must the mouswheel scroll at a time.
            , wheelLock: true   // Lock default scrolling window when there is no more content.
            , scrollInvert: false  // Enable invert style scrolling
            , trackSize: false  // Set the size of the scrollbar to auto or a fixed number.
            , thumbSize: false  // Set the size of the thumb to auto or a fixed number
        }
        ;

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        var self = this, $viewport = $container.find(".viewport"), $overview = $container.find(".overview"), $scrollbar = $container.find(".scrollbar"), $track = $scrollbar.find(".track"), $thumb = $scrollbar.find(".thumb"), mousePosition = 0, isHorizontal = this.options.axis === 'x', hasTouchEvents = false, wheelEvent = ("onwheel" in document || document.documentMode >= 9) ? "wheel" :
                (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll"), sizeLabel = isHorizontal ? "width" : "height", posiLabel = isHorizontal ? (nextend.isRTL() ? "right" : "left") : "top"
            ;

        this.contentPosition = 0;
        this.viewportSize = 0;
        this.contentSize = 0;
        this.contentRatio = 0;
        this.trackSize = 0;
        this.trackRatio = 0;
        this.thumbSize = 0;
        this.thumbPosition = 0;

        function initialize() {
            self.update();
            setEvents();

            return self;
        }

        this.update = function (scrollTo) {
            var sizeLabelCap = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            this.viewportSize = $viewport[0]['offset' + sizeLabelCap];
            this.contentSize = $overview.width();
            this.contentRatio = this.viewportSize / this.contentSize;
            this.trackSize = $scrollbar.parent().width() || this.viewportSize;
            this.thumbSize = Math.min(this.trackSize, Math.max(0, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio = this.options.thumbSize ? (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize) : (this.contentSize / this.trackSize);
            mousePosition = $track.offset().top;

            $container.toggleClass("n2-scroll-disable", this.contentRatio >= 1);
            $scrollbar.toggleClass("disable", this.contentRatio >= 1);
            switch (scrollTo) {
                case "bottom":
                    this.contentPosition = this.contentSize - this.viewportSize;
                    break;

                case "relative":
                    this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = parseInt(scrollTo, 10) || 0;
            }

            setSize();

            $container.trigger('scrollUpdate');

            return self;
        };

        function setSize() {
            $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
            $overview.css(posiLabel, -self.contentPosition);
            $scrollbar.css(sizeLabel, self.trackSize);
            $track.css(sizeLabel, self.trackSize);
            $thumb.css(sizeLabel, self.thumbSize);
        }

        function setEvents() {
            if (hasTouchEvents) {
                $viewport[0].ontouchstart = function (event) {
                    if (1 === event.touches.length) {
                        event.stopPropagation();

                        start(event.touches[0]);
                    }
                };
            }
            else {
                $thumb.bind("mousedown", start);
                $track.bind("mousedown", drag);
            }

            $(window).resize(function () {
                self.update("relative");
            });

            if (self.options.wheel) {
                $container.on('mousewheel', wheel);
            }
        }

        function start(event) {
            $("body").addClass("noSelect");

            mousePosition = isHorizontal ? event.pageX : event.pageY;
            self.thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            if (hasTouchEvents) {
                document.ontouchmove = function (event) {
                    event.preventDefault();
                    drag(event.touches[0]);
                };
                document.ontouchend = end;
            }
            else {
                $(document).bind("mousemove", drag);
                $(document).bind("mouseup", end);
                $thumb.bind("mouseup", end);
            }
        }

        function wheel(event) {
            if (self.contentRatio < 1) {
                var evntObj = event,
                    deltaDir = "delta" + self.options.axis.toUpperCase(),
                    wheelSpeedDelta = evntObj.deltaY;

                self.contentPosition -= wheelSpeedDelta * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));

                $container.trigger("move");

                $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
                $overview.css(posiLabel, -self.contentPosition);

                if (self.options.wheelLock || (self.contentPosition !== (self.contentSize - self.viewportSize) && self.contentPosition !== 0)) {
                    evntObj = $.event.fix(evntObj);
                    evntObj.preventDefault();
                }
            }
        }

        function drag(event) {
            if (self.contentRatio < 1) {
                var mousePositionNew = isHorizontal ? event.pageX : event.pageY,
                    thumbPositionDelta = mousePositionNew - mousePosition;

                if (self.options.scrollInvert && hasTouchEvents) {
                    thumbPositionDelta = mousePosition - mousePositionNew;
                }

                if (nextend.isRTL()) {
                    thumbPositionDelta *= -1;
                }

                var thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta));
                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -self.contentPosition);
            }
        }

        function end() {
            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", drag);
            $(document).unbind("mouseup", end);
            $thumb.unbind("mouseup", end);
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));

/**
 * jquery.unique-element-id.js
 *
 * A simple jQuery plugin to get a unique ID for
 * any HTML element
 *
 * Usage:
 *    $('some_element_selector').uid();
 *
 * by Jamie Rumbelow <jamie@jamierumbelow.net>
 * http://jamieonsoftware.com
 * Copyright (c)2011 Jamie Rumbelow
 *
 * Licensed under the MIT license (http://www.opensource.org/licenses/MIT)
 */

(function ($) {
    /**
     * Generate a new unqiue ID
     */
    function generateUniqueId() {

        // Return a unique ID
        return "n" + Math.floor((1 + Math.random()) * 0x1000000000000)
                .toString(16);
    }

    /**
     * Get a unique ID for an element, ensuring that the
     * element has an id="" attribute
     */
    $.fn.uid = function () {
        var id = null;
        do {
            id = generateUniqueId();
        } while ($('#' + id).length > 0)
        return id;
    };
})(n2);
(function (smartSlider, $, scope, undefined) {

    function NextendAdminSinglePane(tab, mainPane) {
        this.loadDefaults();

        this.topOffset = $('#wpadminbar, .navbar-fixed-top').height();

        this.tab = tab;
        this.mainPane = mainPane;
    }

    NextendAdminSinglePane.prototype.loadDefaults = function () {
        this.ratio = 1;
        this.excludedHeight = 0;
    };

    NextendAdminSinglePane.prototype.lateInit = function () {
        this.calibrate();

        $(window).on('resize', $.proxy(this.resize, this));
        $(window).one('load', $.proxy(this.calibrate, this));
    };

    NextendAdminSinglePane.prototype.calibrate = function () {
        this.excludedHeight = this.getExcludedHeight();
        this.resize();
    };

    NextendAdminSinglePane.prototype.getExcludedHeight = function () {
        return 0;
    };

    NextendAdminSinglePane.prototype.resize = function () {
        this.targetHeight = window.innerHeight - this.topOffset - this.excludedHeight;
        this.changeRatio(this.ratio);
    };

    NextendAdminSinglePane.prototype.changeRatio = function (ratio) {
        this.mainPane.height(this.targetHeight);
    };

    scope.NextendAdminSinglePane = NextendAdminSinglePane;

    function NextendAdminVerticalPane(tab, mainPane, bottomPane) {

        NextendAdminSinglePane.prototype.constructor.apply(this, arguments);

        if (this.key) {
            this.ratio = $.jStorage.get(this.key, this.ratio);
        }

        this.bottomPane = bottomPane;
    }

    NextendAdminVerticalPane.prototype = Object.create(NextendAdminSinglePane.prototype);
    NextendAdminVerticalPane.prototype.constructor = NextendAdminVerticalPane;

    NextendAdminVerticalPane.prototype.loadDefaults = function () {

        NextendAdminSinglePane.prototype.loadDefaults.apply(this, arguments);

        this.key = false;
        this.ratio = 0.5;
        this.originalRatio = 0.5;
    };

    NextendAdminVerticalPane.prototype.lateInit = function () {

        NextendAdminSinglePane.prototype.lateInit.apply(this, arguments);

        this.tab.find(".n2-sidebar-pane-sizer").draggable({
            axis: 'y',
            scroll: false,
            start: $.proxy(this.start, this),
            drag: $.proxy(this.drag, this)
        });
    };

    NextendAdminVerticalPane.prototype.start = function (event, ui) {
        this.originalRatio = this.ratio;
    };

    NextendAdminVerticalPane.prototype.drag = function (event, ui) {
        var ratio = this.originalRatio + ui.position.top / this.targetHeight;


        if (ratio < 0.1) {
            ratio = 0.1;
            ui.position.top = (ratio - this.originalRatio) * this.targetHeight;
        } else if (ratio > 0.9) {
            ratio = 0.9;
            ui.position.top = (ratio - this.originalRatio) * this.targetHeight;
        }

        this.changeRatio(ratio);

        ui.position.top = 0;
    };

    NextendAdminVerticalPane.prototype.changeRatio = function (ratio) {
        var h = parseInt(this.targetHeight * this.ratio);
        this.mainPane.height(h);
        this.bottomPane.height(this.targetHeight - h - 1);
        this.ratio = ratio;
        if (this.key) {
            $.jStorage.set(this.key, ratio);
        }
    };

    scope.NextendAdminVerticalPane = NextendAdminVerticalPane;

})(nextend.smartSlider, n2, window);
/*!
 * jQuery contextMenu v2.2.5-dev - Plugin for simple contextMenu handling
 *
 * Version: v2.2.5-dev
 *
 * Authors: Björn Brala (SWIS.nl), Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://swisnl.github.io/jQuery-contextMenu/
 *
 * Copyright (c) 2011-2016 SWIS BV and contributors
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * Date: 2016-08-27T11:09:09.141Z
 */

(function (factory) {
    factory(n2);
})(function ($) {

    'use strict';

    // TODO: -
    // ARIA stuff: menuitem, menuitemcheckbox und menuitemradio
    // create <menu> structure if $.support[htmlCommand || htmlMenuitem] and !opt.disableNative

    // determine html5 compatibility
    $.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
    $.support.htmlCommand = ('HTMLCommandElement' in window);
    $.support.eventSelectstart = ('onselectstart' in document.documentElement);
    /* // should the need arise, test for css user-select
     $.support.cssUserSelect = (function(){
     var t = false,
     e = document.createElement('div');

     $.each('Moz|Webkit|Khtml|O|ms|Icab|'.split('|'), function(i, prefix) {
     var propCC = prefix + (prefix ? 'U' : 'u') + 'serSelect',
     prop = (prefix ? ('-' + prefix.toLowerCase() + '-') : '') + 'user-select';

     e.style.cssText = prop + ': text;';
     if (e.style[propCC] == 'text') {
     t = true;
     return false;
     }

     return true;
     });

     return t;
     })();
     */

    /* jshint ignore:start */
    if (!$.ui || !$.widget) {
        // duck punch $.cleanData like jQueryUI does to get that remove event
        $.cleanData = (function (orig) {
            return function (elems) {
                var events, elem, i;
                for (i = 0; elems[i] != null; i++) {
                    elem = elems[i];
                    try {
                        // Only trigger remove when necessary to save time
                        events = $._data(elem, 'events');
                        if (events && events.remove) {
                            $(elem).triggerHandler('remove');
                        }

                        // Http://bugs.jquery.com/ticket/8235
                    } catch (e) {
                    }
                }
                orig(elems);
            };
        })($.cleanData);
    }
    /* jshint ignore:end */

    var // currently active contextMenu trigger
        $currentTrigger = null,
        // is contextMenu initialized with at least one menu?
        initialized = false,
        // window handle
        $win = $(window),
        // number of registered menus
        counter = 0,
        // mapping selector to namespace
        namespaces = {},
        // mapping namespace to options
        menus = {},
        // custom command type handlers
        types = {},
        // default values
        defaults = {
            // selector of contextMenu trigger
            selector: null,
            // where to append the menu to
            appendTo: null,
            // method to trigger context menu ["right", "left", "hover"]
            trigger: 'right',
            // hide menu when mouse leaves trigger / menu elements
            autoHide: false,
            // ms to wait before showing a hover-triggered context menu
            delay: 200,
            // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
            // as long as the trigger happened on one of the trigger-element's child nodes
            reposition: true,

            // Default classname configuration to be able avoid conflicts in frameworks
            classNames: {

                hover: 'context-menu-hover', // Item hover
                disabled: 'context-menu-disabled', // Item disabled
                visible: 'context-menu-visible', // Item visible
                notSelectable: 'context-menu-not-selectable', // Item not selectable

                icon: 'context-menu-icon',
                iconEdit: 'context-menu-icon-edit',
                iconCut: 'context-menu-icon-cut',
                iconCopy: 'context-menu-icon-copy',
                iconPaste: 'context-menu-icon-paste',
                iconDelete: 'context-menu-icon-delete',
                iconAdd: 'context-menu-icon-add',
                iconQuit: 'context-menu-icon-quit'
            },

            // determine position to show menu at
            determinePosition: function ($menu) {
                // position to the lower middle of the trigger element
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: 'center top',
                        at: 'center bottom',
                        of: this,
                        offset: '0 5',
                        collision: 'fit'
                    }).css('display', 'none');
                } else {
                    // determine contextMenu position
                    var offset = this.offset();
                    offset.top += this.outerHeight();
                    offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                    $menu.css(offset);
                }
            },
            // position menu
            position: function (opt, x, y) {
                var offset;
                // determine contextMenu position
                if (!x && !y) {
                    opt.determinePosition.call(this, opt.$menu);
                    return;
                } else if (x === 'maintain' && y === 'maintain') {
                    // x and y must not be changed (after re-show on command click)
                    offset = opt.$menu.position();
                } else {
                    // x and y are given (by mouse event)
                    offset = {top: y, left: x};
                }

                // correct offset if viewport demands it
                var bottom = $win.scrollTop() + $win.height(),
                    right = $win.scrollLeft() + $win.width(),
                    height = opt.$menu.outerHeight(),
                    width = opt.$menu.outerWidth();

                if (offset.top + height > bottom) {
                    offset.top -= height;
                }

                if (offset.top < 0) {
                    offset.top = 0;
                }

                if (offset.left + width > right) {
                    offset.left -= width;
                }

                if (offset.left < 0) {
                    offset.left = 0;
                }

                opt.$menu.css(offset);
            },
            // position the sub-menu
            positionSubmenu: function ($menu) {
                if ($.ui && $.ui.position) {
                    // .position() is provided as a jQuery UI utility
                    // (...and it won't work on hidden elements)
                    $menu.css('display', 'block').position({
                        my: 'left top',
                        at: 'right top',
                        of: this,
                        collision: 'flipfit fit'
                    }).css('display', '');
                } else {
                    // determine contextMenu position
                    var offset = {
                        top: 0,
                        left: this.outerWidth()
                    };
                    $menu.css(offset);
                }
            },
            // offset to add to zIndex
            zIndex: 1,
            // show hide animation settings
            animation: {
                duration: 50,
                show: 'slideDown',
                hide: 'slideUp'
            },
            // events
            events: {
                show: $.noop,
                hide: $.noop
            },
            // default callback
            callback: null,
            // list of contextMenu items
            items: {}
        },
        // mouse position for hover activation
        hoveract = {
            timer: null,
            pageX: null,
            pageY: null
        },
        // determine zIndex
        zindex = function ($t) {
            var zin = 0,
                $tt = $t;

            while (true) {
                zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
                $tt = $tt.parent();
                if (!$tt || !$tt.length || 'html body'.indexOf($tt.prop('nodeName').toLowerCase()) > -1) {
                    break;
                }
            }
            return zin;
        },
        // event handlers
        handle = {
            // abort anything
            abortevent: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
            },
            // contextmenu show dispatcher
            contextmenu: function (e) {
                var $this = $(this);

                // disable actual context-menu if we are using the right mouse button as the trigger
                if (e.data.trigger === 'right') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                // abort native-triggered events unless we're triggering on right click
                if ((e.data.trigger !== 'right' && e.data.trigger !== 'demand') && e.originalEvent) {
                    return;
                }

                // Let the current contextmenu decide if it should show or not based on its own trigger settings
                if (e.mouseButton !== undefined && e.data) {
                    if (!(e.data.trigger === 'left' && e.mouseButton === 0) && !(e.data.trigger === 'right' && e.mouseButton === 2)) {
                        // Mouse click is not valid.
                        return;
                    }
                }

                // abort event if menu is visible for this trigger
                if ($this.hasClass('context-menu-active')) {
                    return;
                }

                if (!$this.hasClass('context-menu-disabled')) {
                    // theoretically need to fire a show event at <menu>
                    // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
                    // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                    // e.data.$menu.trigger(evt);

                    $currentTrigger = $this;
                    if (e.data.build) {
                        var built = e.data.build($currentTrigger, e);
                        // abort if build() returned false
                        if (built === false) {
                            return;
                        }

                        // dynamically build menu on invocation
                        e.data = $.extend(true, {}, defaults, e.data, built || {});

                        // abort if there are no items to display
                        if (!e.data.items || $.isEmptyObject(e.data.items)) {
                            // Note: jQuery captures and ignores errors from event handlers
                            if (window.console) {
                                (console.error || console.log).call(console, 'No items specified to show in contextMenu');
                            }

                            throw new Error('No Items specified');
                        }

                        // backreference for custom command type creation
                        e.data.$trigger = $currentTrigger;

                        op.create(e.data);
                    }
                    var showMenu = false;
                    for (var item in e.data.items) {
                        if (e.data.items.hasOwnProperty(item)) {
                            var visible;
                            if ($.isFunction(e.data.items[item].visible)) {
                                visible = e.data.items[item].visible.call($(e.currentTarget), item, e.data);
                            } else if (typeof item.visible !== 'undefined') {
                                visible = e.data.items[item].visible === true;
                            } else {
                                visible = true;
                            }
                            if (visible) {
                                showMenu = true;
                            }
                        }
                    }
                    if (showMenu) {
                        // show menu
                        var menuContainer = (e.data.appendTo === null ? $('body') : $(e.data.appendTo));
                        var srcElement = e.target || e.srcElement || e.originalTarget;
                        if (e.offsetX !== undefined && e.offsetY !== undefined) {
                            op.show.call($this, e.data,
                                $(srcElement).offset().left - menuContainer.offset().left + e.offsetX,
                                $(srcElement).offset().top - menuContainer.offset().top + e.offsetY);
                        } else {
                            op.show.call($this, e.data, e.pageX, e.pageY);
                        }
                    }
                }
            },
            // contextMenu left-click trigger
            click: function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
            },
            // contextMenu right-click trigger
            mousedown: function (e) {
                // register mouse down
                var $this = $(this);

                // hide any previous menus
                if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                    $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
                }

                // activate on right click
                if (e.button === 2) {
                    $currentTrigger = $this.data('contextMenuActive', true);
                }
            },
            // contextMenu right-click trigger
            mouseup: function (e) {
                // show menu
                var $this = $(this);
                if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $currentTrigger = $this;
                    $this.trigger($.Event('contextmenu', {data: e.data, pageX: e.pageX, pageY: e.pageY}));
                }

                $this.removeData('contextMenuActive');
            },
            // contextMenu hover trigger
            mouseenter: function (e) {
                var $this = $(this),
                    $related = $(e.relatedTarget),
                    $document = $(document);

                // abort if we're coming from a menu
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                // abort if a menu is shown
                if ($currentTrigger && $currentTrigger.length) {
                    return;
                }

                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
                hoveract.data = e.data;
                $document.on('mousemove.contextMenuShow', handle.mousemove);
                hoveract.timer = setTimeout(function () {
                    hoveract.timer = null;
                    $document.off('mousemove.contextMenuShow');
                    $currentTrigger = $this;
                    $this.trigger($.Event('contextmenu', {
                        data: hoveract.data,
                        pageX: hoveract.pageX,
                        pageY: hoveract.pageY
                    }));
                }, e.data.delay);
            },
            // contextMenu hover trigger
            mousemove: function (e) {
                hoveract.pageX = e.pageX;
                hoveract.pageY = e.pageY;
            },
            // contextMenu hover trigger
            mouseleave: function (e) {
                // abort if we're leaving for a menu
                var $related = $(e.relatedTarget);
                if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                    return;
                }

                try {
                    clearTimeout(hoveract.timer);
                } catch (e) {
                }

                hoveract.timer = null;
            },
            // click on layer to hide contextMenu
            layerClick: function (e) {
                var $this = $(this),
                    root = $this.data('contextMenuRoot'),
                    button = e.button,
                    x = e.pageX,
                    y = e.pageY,
                    target,
                    offset;

                e.preventDefault();
                e.stopImmediatePropagation();

                setTimeout(function () {
                    var $window;
                    var triggerAction = ((root.trigger === 'left' && button === 0) || (root.trigger === 'right' && button === 2));

                    // find the element that would've been clicked, wasn't the layer in the way
                    if (document.elementFromPoint && root.$layer) {
                        root.$layer.hide();
                        target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                        $(target).trigger('mousedown').trigger('mouseup');
                        root.$layer.show();
                    }

                    if (root.reposition && triggerAction) {
                        if (document.elementFromPoint) {
                            if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                                root.position.call(root.$trigger, root, x, y);
                                return;
                            }
                        } else {
                            offset = root.$trigger.offset();
                            $window = $(window);
                            // while this looks kinda awful, it's the best way to avoid
                            // unnecessarily calculating any positions
                            offset.top += $window.scrollTop();
                            if (offset.top <= e.pageY) {
                                offset.left += $window.scrollLeft();
                                if (offset.left <= e.pageX) {
                                    offset.bottom = offset.top + root.$trigger.outerHeight();
                                    if (offset.bottom >= e.pageY) {
                                        offset.right = offset.left + root.$trigger.outerWidth();
                                        if (offset.right >= e.pageX) {
                                            // reposition
                                            root.position.call(root.$trigger, root, x, y);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (target && triggerAction) {
                        root.$trigger.one('contextmenu:hidden', function () {
                            $(target).contextMenu({x: x, y: y, button: button});
                        });
                    }

                    if (root != null && root.$menu != null) {
                        root.$menu.trigger('contextmenu:hide');
                    }
                }, 50);
            },
            // key handled :hover
            keyStop: function (e, opt) {
                if (!opt.isInput) {
                    e.preventDefault();
                }

                e.stopPropagation();
            },
            key: function (e) {

                var opt = {};

                // Only get the data from $currentTrigger if it exists
                if ($currentTrigger) {
                    opt = $currentTrigger.data('contextMenu') || {};
                }
                // If the trigger happen on a element that are above the contextmenu do this
                if (opt.zIndex === undefined) {
                    opt.zIndex = 0;
                }
                var targetZIndex = 0;
                var getZIndexOfTriggerTarget = function (target) {
                    if (target.style.zIndex !== '') {
                        targetZIndex = target.style.zIndex;
                    } else {
                        if (target.offsetParent !== null && target.offsetParent !== undefined) {
                            getZIndexOfTriggerTarget(target.offsetParent);
                        }
                        else if (target.parentElement !== null && target.parentElement !== undefined) {
                            getZIndexOfTriggerTarget(target.parentElement);
                        }
                    }
                };
                getZIndexOfTriggerTarget(e.target);
                // If targetZIndex is heigher then opt.zIndex dont progress any futher.
                // This is used to make sure that if you are using a dialog with a input / textarea / contenteditable div
                // and its above the contextmenu it wont steal keys events
                if (targetZIndex > opt.zIndex) {
                    return;
                }
                switch (e.keyCode) {
                    case 9:
                    case 38: // up
                        handle.keyStop(e, opt);
                        // if keyCode is [38 (up)] or [9 (tab) with shift]
                        if (opt.isInput) {
                            if (e.keyCode === 9 && e.shiftKey) {
                                e.preventDefault();
                                if (opt.$selected) {
                                    opt.$selected.find('input, textarea, select').blur();
                                }
                                opt.$menu.trigger('prevcommand');
                                return;
                            } else if (e.keyCode === 38 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else if (e.keyCode !== 9 || e.shiftKey) {
                            opt.$menu.trigger('prevcommand');
                            return;
                        }
                        break;
                    // omitting break;
                    // case 9: // tab - reached through omitted break;
                    case 40: // down
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (e.keyCode === 9) {
                                e.preventDefault();
                                if (opt.$selected) {
                                    opt.$selected.find('input, textarea, select').blur();
                                }
                                opt.$menu.trigger('nextcommand');
                                return;
                            } else if (e.keyCode === 40 && opt.$selected.find('input, textarea, select').prop('type') === 'checkbox') {
                                // checkboxes don't capture this key
                                e.preventDefault();
                                return;
                            }
                        } else {
                            opt.$menu.trigger('nextcommand');
                            return;
                        }
                        break;

                    case 37: // left
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }

                        if (!opt.$selected.parent().hasClass('context-menu-root')) {
                            var $parent = opt.$selected.parent().parent();
                            opt.$selected.trigger('contextmenu:blur');
                            opt.$selected = $parent;
                            return;
                        }
                        break;

                    case 39: // right
                        handle.keyStop(e, opt);
                        if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                            break;
                        }

                        var itemdata = opt.$selected.data('contextMenu') || {};
                        if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                            opt.$selected = null;
                            itemdata.$selected = null;
                            itemdata.$menu.trigger('nextcommand');
                            return;
                        }
                        break;

                    case 35: // end
                    case 36: // home
                        if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                            return;
                        } else {
                            (opt.$selected && opt.$selected.parent() || opt.$menu)
                                .children(':not(.' + opt.classNames.disabled + ', .' + opt.classNames.notSelectable + ')')[e.keyCode === 36 ? 'first' : 'last']()
                                .trigger('contextmenu:focus');
                            e.preventDefault();
                            return;
                        }
                        break;

                    case 13: // enter
                        handle.keyStop(e, opt);
                        if (opt.isInput) {
                            if (opt.$selected && !opt.$selected.is('textarea, select')) {
                                e.preventDefault();
                                return;
                            }
                            break;
                        }
                        if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                            opt.$selected.trigger('mouseup');
                        }
                        return;

                    case 32: // space
                    case 33: // page up
                    case 34: // page down
                        // prevent browser from scrolling down while menu is visible
                        handle.keyStop(e, opt);
                        return;

                    case 27: // esc
                        handle.keyStop(e, opt);
                        opt.$menu.trigger('contextmenu:hide');
                        return;

                    default: // 0-9, a-z
                        var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                        if (opt.accesskeys && opt.accesskeys[k]) {
                            // according to the specs accesskeys must be invoked immediately
                            opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu ? 'contextmenu:focus' : 'mouseup');
                            return;
                        }
                        break;
                }
                // pass event to selected item,
                // stop propagation to avoid endless recursion
                e.stopPropagation();
                if (typeof opt.$selected !== 'undefined' && opt.$selected !== null) {
                    opt.$selected.trigger(e);
                }
            },
            // select previous possible command in menu
            prevItem: function (e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                    $round = $prev;

                // skip disabled or hidden elements
                while ($prev.hasClass(root.classNames.disabled) || $prev.hasClass(root.classNames.notSelectable) || $prev.is(':hidden')) {
                    if ($prev.prev().length) {
                        $prev = $prev.prev();
                    } else {
                        $prev = $children.last();
                    }
                    if ($prev.is($round)) {
                        // break endless loop
                        return;
                    }
                }

                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }

                // activate next
                handle.itemMouseenter.call($prev.get(0), e);

                // focus input
                var $input = $prev.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // select next possible command in menu
            nextItem: function (e) {
                e.stopPropagation();
                var opt = $(this).data('contextMenu') || {};
                var root = $(this).data('contextMenuRoot') || {};

                // obtain currently selected menu
                if (opt.$selected) {
                    var $s = opt.$selected;
                    opt = opt.$selected.parent().data('contextMenu') || {};
                    opt.$selected = $s;
                }

                var $children = opt.$menu.children(),
                    $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                    $round = $next;

                // skip disabled
                while ($next.hasClass(root.classNames.disabled) || $next.hasClass(root.classNames.notSelectable) || $next.is(':hidden')) {
                    if ($next.next().length) {
                        $next = $next.next();
                    } else {
                        $next = $children.first();
                    }
                    if ($next.is($round)) {
                        // break endless loop
                        return;
                    }
                }

                // leave current
                if (opt.$selected) {
                    handle.itemMouseleave.call(opt.$selected.get(0), e);
                }

                // activate next
                handle.itemMouseenter.call($next.get(0), e);

                // focus input
                var $input = $next.find('input, textarea, select');
                if ($input.length) {
                    $input.focus();
                }
            },
            // flag that we're inside an input so the key handler can act accordingly
            focusInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.$selected = opt.$selected = $this;
                root.isInput = opt.isInput = true;
            },
            // flag that we're inside an input so the key handler can act accordingly
            blurInput: function () {
                var $this = $(this).closest('.context-menu-item'),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.isInput = opt.isInput = false;
            },
            // :hover on menu
            menuMouseenter: function () {
                var root = $(this).data().contextMenuRoot;
                root.hovering = true;
            },
            // :hover on menu
            menuMouseleave: function (e) {
                var root = $(this).data().contextMenuRoot;
                if (root.$layer && root.$layer.is(e.relatedTarget)) {
                    root.hovering = false;
                }
            },
            // :hover done manually so key handling is possible
            itemMouseenter: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                root.hovering = true;

                // abort if we're re-entering
                if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }

                // make sure only one item is selected
                (opt.$menu ? opt : root).$menu
                    .children('.' + root.classNames.hover).trigger('contextmenu:blur')
                    .children('.hover').trigger('contextmenu:blur');

                if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
                    opt.$selected = null;
                    return;
                }

                $this.trigger('contextmenu:focus');
            },
            // :hover done manually so key handling is possible
            itemMouseleave: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                    if (typeof root.$selected !== 'undefined' && root.$selected !== null) {
                        root.$selected.trigger('contextmenu:blur');
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    root.$selected = opt.$selected = opt.$node;
                    return;
                }

                $this.trigger('contextmenu:blur');
            },
            // contextMenu item click
            itemClick: function (e) {
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot,
                    key = data.contextMenuKey,
                    callback;

                // abort if the key is unknown or disabled or is a menu
                if (!opt.items[key] || $this.is('.' + root.classNames.disabled + ', .context-menu-submenu, .context-menu-separator, .' + root.classNames.notSelectable)) {
                    return;
                }

                e.preventDefault();
                e.stopImmediatePropagation();

                if ($.isFunction(opt.callbacks[key]) && Object.prototype.hasOwnProperty.call(opt.callbacks, key)) {
                    // item-specific callback
                    callback = opt.callbacks[key];
                } else if ($.isFunction(root.callback)) {
                    // default callback
                    callback = root.callback;
                } else {
                    // no callback, no action
                    return;
                }

                // hide menu if callback doesn't stop that
                if (callback.call(root.$trigger, key, root) !== false) {
                    root.$menu.trigger('contextmenu:hide');
                } else if (root.$menu.parent().length) {
                    op.update.call(root.$trigger, root);
                }
            },
            // ignore click events on input elements
            inputClick: function (e) {
                e.stopImmediatePropagation();
            },
            // hide <menu>
            hideMenu: function (e, data) {
                var root = $(this).data('contextMenuRoot');
                op.hide.call(root.$trigger, root, data && data.force);
            },
            // focus <command>
            focusItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if ($this.hasClass(root.classNames.disabled) || $this.hasClass(root.classNames.notSelectable)) {
                    return;
                }

                $this
                    .addClass([root.classNames.hover, root.classNames.visible].join(' '))
                    // select other items and included items
                    .parent().find('.context-menu-item').not($this)
                    .removeClass(root.classNames.visible)
                    .filter('.' + root.classNames.hover)
                    .trigger('contextmenu:blur');

                // remember selected
                opt.$selected = root.$selected = $this;

                // position sub-menu - do after show so dumb $.ui.position can keep up
                if (opt.$node) {
                    root.positionSubmenu.call(opt.$node, opt.$menu);
                }
            },
            // blur <command>
            blurItem: function (e) {
                e.stopPropagation();
                var $this = $(this),
                    data = $this.data(),
                    opt = data.contextMenu,
                    root = data.contextMenuRoot;

                if (opt.autoHide) { // for tablets and touch screens this needs to remain
                    $this.removeClass(root.classNames.visible);
                }
                $this.removeClass(root.classNames.hover);
                opt.$selected = null;
            }
        },
        // operations
        op = {
            show: function (opt, x, y) {
                var $trigger = $(this),
                    css = {};

                // hide any open menus
                $('#context-menu-layer').trigger('mousedown');

                // backreference for callbacks
                opt.$trigger = $trigger;

                // show event
                if (opt.events.show.call($trigger, opt) === false) {
                    $currentTrigger = null;
                    return;
                }

                // create or update context menu
                op.update.call($trigger, opt);

                // position menu
                opt.position.call($trigger, opt, x, y);

                // make sure we're in front
                if (opt.zIndex) {
                    var additionalZValue = opt.zIndex;
                    // If opt.zIndex is a function, call the function to get the right zIndex.
                    if (typeof opt.zIndex === 'function') {
                        additionalZValue = opt.zIndex.call($trigger, opt);
                    }
                    css.zIndex = zindex($trigger) + additionalZValue;
                }

                // add layer
                op.layer.call(opt.$menu, opt, css.zIndex);

                // adjust sub-menu zIndexes
                opt.$menu.find('ul').css('zIndex', css.zIndex + 1);

                // position and show context menu
                opt.$menu.css(css)[opt.animation.show](opt.animation.duration, function () {
                    $trigger.trigger('contextmenu:visible');
                });
                // make options available and set state
                $trigger
                    .data('contextMenu', opt)
                    .addClass('context-menu-active');

                // register key handler
                $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
                // register autoHide handler
                if (opt.autoHide) {
                    // mouse position handler
                    $(document).on('mousemove.contextMenuAutoHide scroll.contextMenuAutoHide', function (e) {
                        // need to capture the offset on mousemove,
                        // since the page might've been scrolled since activation
                        var pos = $trigger.offset();
                        pos.right = pos.left + $trigger.outerWidth();
                        pos.bottom = pos.top + $trigger.outerHeight();

                        if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                            /* Additional hover check after short time, you might just miss the edge of the menu */
                            setTimeout(function () {
                                if (!opt.hovering && opt.$menu != null) {
                                    opt.$menu.trigger('contextmenu:hide');
                                }
                            }, 50);
                        }
                    });
                }
            },
            hide: function (opt, force) {
                var $trigger = $(this);
                if (!opt) {
                    opt = $trigger.data('contextMenu') || {};
                }

                // hide event
                if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
                    return;
                }

                // remove options and revert state
                $trigger
                    .removeData('contextMenu')
                    .removeClass('context-menu-active');

                if (opt.$layer) {
                    // keep layer for a bit so the contextmenu event can be aborted properly by opera
                    setTimeout((function ($layer) {
                        return function () {
                            $layer.remove();
                        };
                    })(opt.$layer), 10);

                    try {
                        delete opt.$layer;
                    } catch (e) {
                        opt.$layer = null;
                    }
                }

                // remove handle
                $currentTrigger = null;
                // remove selected
                opt.$menu.find('.' + opt.classNames.hover).trigger('contextmenu:blur');
                opt.$selected = null;
                // collapse all submenus
                opt.$menu.find('.' + opt.classNames.visible).removeClass(opt.classNames.visible);
                // unregister key and mouse handlers
                // $(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
                $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
                // hide menu
                if (opt.$menu) {
                    opt.$menu[opt.animation.hide](opt.animation.duration, function () {
                        // tear down dynamically built menu after animation is completed.
                        if (opt.build) {
                            opt.$menu.remove();
                            $.each(opt, function (key) {
                                switch (key) {
                                    case 'ns':
                                    case 'selector':
                                    case 'build':
                                    case 'trigger':
                                        return true;

                                    default:
                                        opt[key] = undefined;
                                        try {
                                            delete opt[key];
                                        } catch (e) {
                                        }
                                        return true;
                                }
                            });
                        }

                        setTimeout(function () {
                            $trigger.trigger('contextmenu:hidden');
                        }, 10);
                    });
                }
            },
            create: function (opt, root) {
                if (root === undefined) {
                    root = opt;
                }
                // create contextMenu
                opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || '').data({
                    'contextMenu': opt,
                    'contextMenuRoot': root
                });

                $.each(['callbacks', 'commands', 'inputs'], function (i, k) {
                    opt[k] = {};
                    if (!root[k]) {
                        root[k] = {};
                    }
                });

                if (!root.accesskeys) {
                    root.accesskeys = {};
                }

                function createNameNode(item) {
                    var $name = $('<span></span>');
                    if (item._accesskey) {
                        if (item._beforeAccesskey) {
                            $name.append(document.createTextNode(item._beforeAccesskey));
                        }
                        $('<span></span>')
                            .addClass('context-menu-accesskey')
                            .text(item._accesskey)
                            .appendTo($name);
                        if (item._afterAccesskey) {
                            $name.append(document.createTextNode(item._afterAccesskey));
                        }
                    } else {
                        if (item.isHtmlName) {
                            // restrict use with access keys
                            if (typeof item.accesskey !== 'undefined') {
                                throw new Error('accesskeys are not compatible with HTML names and cannot be used together in the same item');
                            }
                            $name.html(item.name);
                        } else {
                            $name.text(item.name);
                        }
                    }
                    return $name;
                }

                // create contextMenu items
                $.each(opt.items, function (key, item) {
                    var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ''),
                        $label = null,
                        $input = null;

                    // iOS needs to see a click-event bound to an element to actually
                    // have the TouchEvents infrastructure trigger the click event
                    $t.on('click', $.noop);

                    // Make old school string seperator a real item so checks wont be
                    // akward later.
                    // And normalize 'cm_separator' into 'cm_seperator'.
                    if (typeof item === 'string' || item.type === 'cm_separator') {
                        item = {type: 'cm_seperator'};
                    }

                    item.$node = $t.data({
                        'contextMenu': opt,
                        'contextMenuRoot': root,
                        'contextMenuKey': key
                    });

                    // register accesskey
                    // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                    if (typeof item.accesskey !== 'undefined') {
                        var aks = splitAccesskey(item.accesskey);
                        for (var i = 0, ak; ak = aks[i]; i++) {
                            if (!root.accesskeys[ak]) {
                                root.accesskeys[ak] = item;
                                var matched = item.name.match(new RegExp('^(.*?)(' + ak + ')(.*)$', 'i'));
                                if (matched) {
                                    item._beforeAccesskey = matched[1];
                                    item._accesskey = matched[2];
                                    item._afterAccesskey = matched[3];
                                }
                                break;
                            }
                        }
                    }

                    if (item.type && types[item.type]) {
                        // run custom type handler
                        types[item.type].call($t, item, opt, root);
                        // register commands
                        $.each([opt, root], function (i, k) {
                            k.commands[key] = item;
                            // Overwrite only if undefined or the item is appended to the root. This so it
                            // doesn't overwrite callbacks of root elements if the name is the same.
                            if ($.isFunction(item.callback) && (k.callbacks[key] === undefined || opt.type === undefined)) {
                                k.callbacks[key] = item.callback;
                            }
                        });
                    } else {
                        // add label for input
                        if (item.type === 'cm_seperator') {
                            $t.addClass('context-menu-separator ' + root.classNames.notSelectable);
                        } else if (item.type === 'html') {
                            $t.addClass('context-menu-html ' + root.classNames.notSelectable);
                        } else if (item.type) {
                            $label = $('<label></label>').appendTo($t);
                            createNameNode(item).appendTo($label);

                            $t.addClass('context-menu-input');
                            opt.hasTypes = true;
                            $.each([opt, root], function (i, k) {
                                k.commands[key] = item;
                                k.inputs[key] = item;
                            });
                        } else if (item.items) {
                            item.type = 'sub';
                        }

                        switch (item.type) {
                            case 'cm_seperator':
                                break;

                            case 'text':
                                $input = $('<input type="text" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .appendTo($label);
                                break;

                            case 'textarea':
                                $input = $('<textarea name=""></textarea>')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .appendTo($label);

                                if (item.height) {
                                    $input.height(item.height);
                                }
                                break;

                            case 'checkbox':
                                $input = $('<input type="checkbox" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .val(item.value || '')
                                    .prop('checked', !!item.selected)
                                    .prependTo($label);
                                break;

                            case 'radio':
                                $input = $('<input type="radio" value="1" name="" value="">')
                                    .attr('name', 'context-menu-input-' + item.radio)
                                    .val(item.value || '')
                                    .prop('checked', !!item.selected)
                                    .prependTo($label);
                                break;

                            case 'select':
                                $input = $('<select name="">')
                                    .attr('name', 'context-menu-input-' + key)
                                    .appendTo($label);
                                if (item.options) {
                                    $.each(item.options, function (value, text) {
                                        $('<option></option>').val(value).text(text).appendTo($input);
                                    });
                                    $input.val(item.selected);
                                }
                                break;

                            case 'sub':
                                createNameNode(item).appendTo($t);

                                item.appendTo = item.$node;
                                op.create(item, root);
                                $t.data('contextMenu', item).addClass('context-menu-submenu');
                                item.callback = null;
                                break;

                            case 'html':
                                $(item.html).appendTo($t);
                                break;

                            default:
                                $.each([opt, root], function (i, k) {
                                    k.commands[key] = item;
                                    // Overwrite only if undefined or the item is appended to the root. This so it
                                    // doesn't overwrite callbacks of root elements if the name is the same.
                                    if ($.isFunction(item.callback) && (k.callbacks[key] === undefined || opt.type === undefined)) {
                                        k.callbacks[key] = item.callback;
                                    }
                                });
                                createNameNode(item).appendTo($t);
                                break;
                        }

                        // disable key listener in <input>
                        if (item.type && item.type !== 'sub' && item.type !== 'html' && item.type !== 'cm_seperator') {
                            $input
                                .on('focus', handle.focusInput)
                                .on('blur', handle.blurInput);

                            if (item.events) {
                                $input.on(item.events, opt);
                            }
                        }

                        // add icons
                        if (item.icon) {
                            if ($.isFunction(item.icon)) {
                                item._icon = item.icon.call(this, this, $t, key, item);
                            } else {
                                if (typeof(item.icon) === 'string' && item.icon.substring(0, 3) == 'fa-') {
                                    // to enable font awesome
                                    item._icon = root.classNames.icon + ' ' + root.classNames.icon + '--fa fa ' + item.icon;
                                } else {
                                    item._icon = root.classNames.icon + ' ' + root.classNames.icon + '-' + item.icon;
                                }
                            }
                            $t.addClass(item._icon);
                        }
                    }

                    // cache contained elements
                    item.$input = $input;
                    item.$label = $label;

                    // attach item to menu
                    $t.appendTo(opt.$menu);

                    // Disable text selection
                    if (!opt.hasTypes && $.support.eventSelectstart) {
                        // browsers support user-select: none,
                        // IE has a special event for text-selection
                        // browsers supporting neither will not be preventing text-selection
                        $t.on('selectstart.disableTextSelect', handle.abortevent);
                    }
                });
                // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
                if (!opt.$node) {
                    opt.$menu.css('display', 'none').addClass('context-menu-root');
                }
                opt.$menu.appendTo(opt.appendTo || document.body);
            },
            resize: function ($menu, nested) {
                var domMenu;
                // determine widths of submenus, as CSS won't grow them automatically
                // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
                // kinda sucks hard...

                // determine width of absolutely positioned element
                $menu.css({position: 'absolute', display: 'block'});
                // don't apply yet, because that would break nested elements' widths
                $menu.data('width',
                    (domMenu = $menu.get(0)).getBoundingClientRect ?
                        Math.ceil(domMenu.getBoundingClientRect().width) :
                    $menu.outerWidth() + 1); // outerWidth() returns rounded pixels
                // reset styles so they allow nested elements to grow/shrink naturally
                $menu.css({
                    position: 'static',
                    minWidth: '0px',
                    maxWidth: '100000px'
                });
                // identify width of nested menus
                $menu.find('> li > ul').each(function () {
                    op.resize($(this), true);
                });
                // reset and apply changes in the end because nested
                // elements' widths wouldn't be calculatable otherwise
                if (!nested) {
                    $menu.find('ul').addBack().css({
                        position: '',
                        display: '',
                        minWidth: '',
                        maxWidth: ''
                    }).outerWidth(function () {
                        return $(this).data('width');
                    });
                }
            },
            update: function (opt, root) {
                var $trigger = this;
                if (root === undefined) {
                    root = opt;
                    op.resize(opt.$menu);
                }
                // re-check disabled for each item
                opt.$menu.children().each(function () {
                    var $item = $(this),
                        key = $item.data('contextMenuKey'),
                        item = opt.items[key],
                        disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, key, root)) || item.disabled === true,
                        visible;
                    if ($.isFunction(item.visible)) {
                        visible = item.visible.call($trigger, key, root);
                    } else if (typeof item.visible !== 'undefined') {
                        visible = item.visible === true;
                    } else {
                        visible = true;
                    }
                    $item[visible ? 'show' : 'hide']();

                    // dis- / enable item
                    $item[disabled ? 'addClass' : 'removeClass'](root.classNames.disabled);

                    if ($.isFunction(item.icon)) {
                        $item.removeClass(item._icon);
                        item._icon = item.icon.call(this, $trigger, $item, key, item);
                        $item.addClass(item._icon);
                    }

                    if (item.type) {
                        // dis- / enable input elements
                        $item.find('input, select, textarea').prop('disabled', disabled);

                        // update input states
                        switch (item.type) {
                            case 'text':
                            case 'textarea':
                                item.$input.val(item.value || '');
                                break;

                            case 'checkbox':
                            case 'radio':
                                item.$input.val(item.value || '').prop('checked', !!item.selected);
                                break;

                            case 'select':
                                item.$input.val(item.selected || '');
                                break;
                        }
                    }

                    if (item.$menu) {
                        // update sub-menu
                        op.update.call($trigger, item, root);
                    }
                });
            },
            layer: function (opt, zIndex) {
                // add transparent layer for click area
                // filter and background for Internet Explorer, Issue #23
                var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                    .css({height: $win.height(), width: $win.width(), display: 'block'})
                    .data('contextMenuRoot', opt)
                    .insertBefore(this)
                    .on('contextmenu', handle.abortevent)
                    .on('mousedown', handle.layerClick);

                // IE6 doesn't know position:fixed;
                if (document.body.style.maxWidth === undefined) { // IE6 doesn't support maxWidth
                    $layer.css({
                        'position': 'absolute',
                        'height': $(document).height()
                    });
                }

                return $layer;
            }
        };

    // split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
    function splitAccesskey(val) {
        var t = val.split(/\s+/),
            keys = [];

        for (var i = 0, k; k = t[i]; i++) {
            k = k.charAt(0).toUpperCase(); // first character only
            // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
            // a map to look up already used access keys would be nice
            keys.push(k);
        }

        return keys;
    }

// handle contextMenu triggers
    $.fn.contextMenu = function (operation) {
        var $t = this, $o = operation;
        if (this.length > 0) {  // this is not a build on demand menu
            if (operation === undefined) {
                this.first().trigger('contextmenu');
            } else if (operation.x !== undefined && operation.y !== undefined) {
                this.first().trigger($.Event('contextmenu', {
                    pageX: operation.x,
                    pageY: operation.y,
                    mouseButton: operation.button
                }));
            } else if (operation === 'hide') {
                var $menu = this.first().data('contextMenu') ? this.first().data('contextMenu').$menu : null;
                if ($menu) {
                    $menu.trigger('contextmenu:hide');
                }
            } else if (operation === 'destroy') {
                $.contextMenu('destroy', {context: this});
            } else if ($.isPlainObject(operation)) {
                operation.context = this;
                $.contextMenu('create', operation);
            } else if (operation) {
                this.removeClass('context-menu-disabled');
            } else if (!operation) {
                this.addClass('context-menu-disabled');
            }
        } else {
            $.each(menus, function () {
                if (this.selector === $t.selector) {
                    $o.data = this;

                    $.extend($o.data, {trigger: 'demand'});
                }
            });

            handle.contextmenu.call($o.target, $o);
        }

        return this;
    };

    // manage contextMenu instances
    $.contextMenu = function (operation, options) {

        if (typeof operation !== 'string') {
            options = operation;
            operation = 'create';
        }

        if (typeof options === 'string') {
            options = {selector: options};
        } else if (options === undefined) {
            options = {};
        }

        // merge with default options
        var o = $.extend(true, {}, defaults, options || {});
        var $document = $(document);
        var $context = $document;
        var _hasContext = false;

        if (!o.context || !o.context.length) {
            o.context = document;
        } else {
            // you never know what they throw at you...
            $context = $(o.context).first();
            o.context = $context.get(0);
            _hasContext = !$(o.context).is(document);
        }

        switch (operation) {
            case 'create':
                // no selector no joy
                if (!o.selector) {
                    throw new Error('No selector specified');
                }
                // make sure internal classes are not bound to
                if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                    throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
                }
                if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                    throw new Error('No Items specified');
                }
                counter++;
                o.ns = '.contextMenu' + counter;
                if (!_hasContext) {
                    namespaces[o.selector] = o.ns;
                }
                menus[o.ns] = o;

                // default to right click
                if (!o.trigger) {
                    o.trigger = 'right';
                }

                if (!initialized) {
                    var itemClick = o.itemClickEvent === 'click' ? 'click.contextMenu' : 'mouseup.contextMenu';
                    var contextMenuItemObj = {
                        // 'mouseup.contextMenu': handle.itemClick,
                        // 'click.contextMenu': handle.itemClick,
                        'contextmenu:focus.contextMenu': handle.focusItem,
                        'contextmenu:blur.contextMenu': handle.blurItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.itemMouseenter,
                        'mouseleave.contextMenu': handle.itemMouseleave
                    };
                    contextMenuItemObj[itemClick] = handle.itemClick;
                    // make sure item click is registered first
                    $document
                        .on({
                            'contextmenu:hide.contextMenu': handle.hideMenu,
                            'prevcommand.contextMenu': handle.prevItem,
                            'nextcommand.contextMenu': handle.nextItem,
                            'contextmenu.contextMenu': handle.abortevent,
                            'mouseenter.contextMenu': handle.menuMouseenter,
                            'mouseleave.contextMenu': handle.menuMouseleave
                        }, '.context-menu-list')
                        .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                        .on(contextMenuItemObj, '.context-menu-item');

                    initialized = true;
                }

                // engage native contextmenu event
                $context
                    .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);

                if (_hasContext) {
                    // add remove hook, just in case
                    $context.on('remove' + o.ns, function () {
                        $(this).contextMenu('destroy');
                    });
                }

                switch (o.trigger) {
                    case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);
                        break;

                    case 'left':
                        $context.on('click' + o.ns, o.selector, o, handle.click);
                        break;
                    /*
                     default:
                     // http://www.quirksmode.org/dom/events/contextmenu.html
                     $document
                     .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                     .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                     break;
                     */
                }

                // create menu
                if (!o.build) {
                    op.create(o);
                }
                break;

            case 'destroy':
                var $visibleMenu;
                if (_hasContext) {
                    // get proper options
                    var context = o.context;
                    $.each(menus, function (ns, o) {

                        // Is this menu equest to the context called from
                        if (!$(context).is(o.selector)) {
                            return true;
                        }

                        $visibleMenu = $('.context-menu-list').filter(':visible');
                        if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                            $visibleMenu.trigger('contextmenu:hide', {force: true});
                        }

                        try {
                            if (menus[o.ns].$menu) {
                                menus[o.ns].$menu.remove();
                            }

                            delete menus[o.ns];
                        } catch (e) {
                            menus[o.ns] = null;
                        }

                        $(o.context).off(o.ns);

                        return true;
                    });
                } else if (!o.selector) {
                    $document.off('.contextMenu .contextMenuAutoHide');
                    $.each(menus, function (ns, o) {
                        $(o.context).off(o.ns);
                    });

                    namespaces = {};
                    menus = {};
                    counter = 0;
                    initialized = false;

                    $('#context-menu-layer, .context-menu-list').remove();
                } else if (namespaces[o.selector]) {
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }

                    try {
                        if (menus[namespaces[o.selector]].$menu) {
                            menus[namespaces[o.selector]].$menu.remove();
                        }

                        delete menus[namespaces[o.selector]];
                    } catch (e) {
                        menus[namespaces[o.selector]] = null;
                    }

                    $document.off(namespaces[o.selector]);
                }
                break;

            case 'html5':
                // if <command> or <menuitem> are not handled by the browser,
                // or options was a bool true,
                // initialize $.contextMenu for them
                if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options === 'boolean' && options)) {
                    $('menu[type="context"]').each(function () {
                        if (this.id) {
                            $.contextMenu({
                                selector: '[contextmenu=' + this.id + ']',
                                items: $.contextMenu.fromMenu(this)
                            });
                        }
                    }).css('display', 'none');
                }
                break;

            default:
                throw new Error('Unknown operation "' + operation + '"');
        }

        return this;
    };

// import values into <input> commands
    $.contextMenu.setInputValues = function (opt, data) {
        if (data === undefined) {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                    item.value = data[key] || '';
                    break;

                case 'checkbox':
                    item.selected = data[key] ? true : false;
                    break;

                case 'radio':
                    item.selected = (data[item.radio] || '') === item.value;
                    break;

                case 'select':
                    item.selected = data[key] || '';
                    break;
            }
        });
    };

// export values from <input> commands
    $.contextMenu.getInputValues = function (opt, data) {
        if (data === undefined) {
            data = {};
        }

        $.each(opt.inputs, function (key, item) {
            switch (item.type) {
                case 'text':
                case 'textarea':
                case 'select':
                    data[key] = item.$input.val();
                    break;

                case 'checkbox':
                    data[key] = item.$input.prop('checked');
                    break;

                case 'radio':
                    if (item.$input.prop('checked')) {
                        data[item.radio] = item.value;
                    }
                    break;
            }
        });

        return data;
    };

// find <label for="xyz">
    function inputLabel(node) {
        return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
    }

// convert <menu> to items object
    function menuChildren(items, $children, counter) {
        if (!counter) {
            counter = 0;
        }

        $children.each(function () {
            var $node = $(this),
                node = this,
                nodeName = this.nodeName.toLowerCase(),
                label,
                item;

            // extract <label><input>
            if (nodeName === 'label' && $node.find('input, textarea, select').length) {
                label = $node.text();
                $node = $node.children().first();
                node = $node.get(0);
                nodeName = node.nodeName.toLowerCase();
            }

            /*
             * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
             * Not being the sadistic kind, $.contextMenu only accepts:
             * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
             * Everything else will be imported as an html node, which is not interfaced with contextMenu.
             */

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
            switch (nodeName) {
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
                case 'menu':
                    item = {name: $node.attr('label'), items: {}};
                    counter = menuChildren(item.items, $node.children(), counter);
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
                case 'a':
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
                case 'button':
                    item = {
                        name: $node.text(),
                        disabled: !!$node.attr('disabled'),
                        callback: (function () {
                            return function () {
                                $node.click();
                            };
                        })()
                    };
                    break;

                // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command

                case 'menuitem':
                case 'command':
                    switch ($node.attr('type')) {
                        case undefined:
                        case 'command':
                        case 'menuitem':
                            item = {
                                name: $node.attr('label'),
                                disabled: !!$node.attr('disabled'),
                                icon: $node.attr('icon'),
                                callback: (function () {
                                    return function () {
                                        $node.click();
                                    };
                                })()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                selected: !!$node.attr('checked')
                            };
                            break;
                        case 'radio':
                            item = {
                                type: 'radio',
                                disabled: !!$node.attr('disabled'),
                                name: $node.attr('label'),
                                radio: $node.attr('radiogroup'),
                                value: $node.attr('id'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                    }
                    break;

                case 'hr':
                    item = '-------';
                    break;

                case 'input':
                    switch ($node.attr('type')) {
                        case 'text':
                            item = {
                                type: 'text',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                value: $node.val()
                            };
                            break;

                        case 'checkbox':
                            item = {
                                type: 'checkbox',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        case 'radio':
                            item = {
                                type: 'radio',
                                name: label || inputLabel(node),
                                disabled: !!$node.attr('disabled'),
                                radio: !!$node.attr('name'),
                                value: $node.val(),
                                selected: !!$node.attr('checked')
                            };
                            break;

                        default:
                            item = undefined;
                            break;
                    }
                    break;

                case 'select':
                    item = {
                        type: 'select',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        selected: $node.val(),
                        options: {}
                    };
                    $node.children().each(function () {
                        item.options[this.value] = $(this).text();
                    });
                    break;

                case 'textarea':
                    item = {
                        type: 'textarea',
                        name: label || inputLabel(node),
                        disabled: !!$node.attr('disabled'),
                        value: $node.val()
                    };
                    break;

                case 'label':
                    break;

                default:
                    item = {type: 'html', html: $node.clone(true)};
                    break;
            }

            if (item) {
                counter++;
                items['key' + counter] = item;
            }
        });

        return counter;
    }

// convert html5 menu
    $.contextMenu.fromMenu = function (element) {
        var $this = $(element),
            items = {};

        menuChildren(items, $this.children());

        return items;
    };

// make defaults accessible
    $.contextMenu.defaults = defaults;
    $.contextMenu.types = types;
// export internal functions - undocumented, for hacking only!
    $.contextMenu.handle = handle;
    $.contextMenu.op = op;
    $.contextMenu.menus = menus;


});
