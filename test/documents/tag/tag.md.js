(function () {
var $alpha_tag_node_modules__alife_alpha_security_security_js = function () {
var exports = {}, module = { exports: exports };

var security = {};


var objOnEvents = {};
var reAllEvents;
initAllEventsRe();
function initAllEventsRe(){
    var doc = document;
    var arrDoms = [window, doc.createElement("form")];
    try{
        arrDoms.push(doc.createElement("img"));
        arrDoms.push(doc.createElement("iframe"));
        arrDoms.push(doc.createElement("object"));
        arrDoms.push(doc.createElement("embed"));
        arrDoms.push(doc.createElement("audio"));
    }
    catch(e){}
    var dom;
    var key;
    for(var i=0,c=arrDoms.length;i<c;i++){
        dom = arrDoms[i];
        for(key in dom){
            if(/^on/.test(key)){
                objOnEvents[key.substring(2)] = 1;
            }
        }
    }
    var arrAllEvents = [];
    for(key in objOnEvents){
        arrAllEvents.push(key);
    }
    reAllEvents = new RegExp('([\'"`\\s\\/]on(?:'+arrAllEvents.join('|')+'))\\s*=','ig');
}


security.isAlibabaAppUrl = function(url){
    var reAlibabaUrl = /^https?:\/\/(([^\:\/]+\.)?(alibaba|aliexpress)\.com|127.0.0.1|totoroserver.alibaba.net)(\:\d+)?\//i;
    var reStyleUrl = /^https?:\/\/(style|img)\.(alibaba|aliexpress)\.com(\:\d+)?\//i;
    return (reAlibabaUrl.test(url) || (/^(\w+):\/\//i.test(url) === false && reAlibabaUrl.test(location.href))) && reStyleUrl.test(url) === false;
};



security.encodeHTML = function(str){
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};


security.htmlFilter = function(str, args, securityDebug){

    var reAllTags = /<(script|link|frame)([^\w])/ig;
    var reAttrs = /[\'"`\s\/](srcdoc)\s*=/ig;
    var reBadSrc = /[\'"`\s\/]src\s*=\s*['"]?\s*(javascript:|data\s*:\s*text\/html)/ig;

    
    try{
        var clickstat = window.dmtrack && dmtrack.clickstat;
        var caller = args.callee.caller || '';
        var callerFunc = caller.toString().substr(0, 300);
        var match1 = str.match(reAllTags);
        var match2 = str.match(reAllEvents);
        var match3 = str.match(reAttrs);
        var match4 = str.match(reBadSrc);
        var match = match1 || match2 || match3 || match4;
        if(clickstat && match !== null){
            clickstat(location.protocol+'//stat.alibaba.com/event/common.html', {id:15669, ext:'url='+encodeURIComponent(location.href)+'|caller='+encodeURIComponent(callerFunc)+'|html='+encodeURIComponent(match[0])+'|ver=0725'});
        }
    }
    catch(e){}

    if(securityDebug !== true){
        str = String(str);

        
        str  = str.replace(reAllTags, '<$10$2');
        
        str = str.replace(reAllEvents, '$10=');
        
        str = str.replace(reAttrs, ' $10=');
        
        str = str.replace(reBadSrc, ' src0="');
    }

    return str;
};


security.mixCsrfToken = function(url){
    var cookie = document.cookie;
    var match = cookie && cookie.match(/(?:^|;)\s*xman_us_t\s*=\s*([^;]+)/);
    if(match){
        match = match[1].match(/(?:^|&)\s*ctoken\s*=\s*([^&]+)/);
    }
    var csrf_token = window['_intl_csrf_token_'] || (match && match[1]);

    if(csrf_token &&
        security.isAlibabaAppUrl(url) &&
        /(\?|&)ctoken=/.test(url) === false){
        url += ( /\?/.test( url ) ? '&' : '?' ) + 'ctoken=' + csrf_token;
    }

    return url;
};


security.hookJquery = function ($) {
    
    if(!$.fn.rawHtml){
        
        $.fn.rawHtml = $.fn.html;
        $.fn.html = function( value ){
            var args = Array.prototype.slice.call(arguments);
            if ( typeof value === 'string') {
                args[0] = security.htmlFilter(value, arguments, $.securityDebug);
            }
            return $.fn.rawHtml.apply(this, args);
        };
        $.fn.rawLoad = function( url, params, callback ){
            if ( typeof url !== "string") {
                return $.fn.load.apply( this, arguments );
            }
            var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

            
            if ( !this.length ) {
                return this;
            }

            var selector, type, response,
                self = this,
                off = url.indexOf(" ");

            if ( off >= 0 ) {
                selector = url.slice( off, url.length );
                url = url.slice( 0, off );
            }

            
            if ( $.isFunction( params ) ) {

                
                callback = params;
                params = undefined;

            
            } else if ( params && typeof params === "object" ) {
                type = "POST";
            }

            
            $.ajax({
                url: url,

                
                type: type,
                dataType: "html",
                data: params,
                complete: function( jqXHR, status ) {
                    if ( callback ) {
                        self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
                    }
                }
            }).done(function( responseText ) {

                
                response = arguments;

                
                self.rawHtml( selector ?

                    
                    $("<div>")

                        
                        
                        .append( responseText.replace( rscript, "" ) )

                        
                        .find( selector ) :

                    
                    responseText );

            });

            return this;
        };
        
        $.ajaxPrefilter( "*", function( s) {
            s.url = security.mixCsrfToken(s.url);
        });
    }
};

































module.exports = security;


$alpha_tag_node_modules__alife_alpha_security_security_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_jquery_jquery_js = function () {
var exports = {}, module = { exports: exports };


  /*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ) {
var
    
    rootjQuery,

    
    readyList,

    
    document = window.document,
    location = window.location,
    navigator = window.navigator,

    
    _jQuery = window.jQuery,

    
    _$ = window.$,

    
    core_push = Array.prototype.push,
    core_slice = Array.prototype.slice,
    core_indexOf = Array.prototype.indexOf,
    core_toString = Object.prototype.toString,
    core_hasOwn = Object.prototype.hasOwnProperty,
    core_trim = String.prototype.trim,

    
    jQuery = function( selector, context ) {
        
        return new jQuery.fn.init( selector, context, rootjQuery );
    },

    
    core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

    
    core_rnotwhite = /\S/,
    core_rspace = /\s+/,

    
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    
    
    rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

    
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

    
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

    
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,

    
    fcamelCase = function( all, letter ) {
        return ( letter + "" ).toUpperCase();
    },

    
    DOMContentLoaded = function() {
        if ( document.addEventListener ) {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            jQuery.ready();
        } else if ( document.readyState === "complete" ) {
            
            
            document.detachEvent( "onreadystatechange", DOMContentLoaded );
            jQuery.ready();
        }
    },

    
    class2type = {};

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
        var match, elem, ret, doc;

        
        if ( !selector ) {
            return this;
        }

        
        if ( selector.nodeType ) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;
        }

        
        if ( typeof selector === "string" ) {
            if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                
                match = [ null, selector, null ];

            } else {
                match = rquickExpr.exec( selector );
            }

            
            if ( match && (match[1] || !context) ) {

                
                if ( match[1] ) {
                    context = context instanceof jQuery ? context[0] : context;
                    doc = ( context && context.nodeType ? context.ownerDocument || context : document );

                    
                    selector = jQuery.parseHTML( match[1], doc, true );
                    if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                        this.attr.call( selector, context, true );
                    }

                    return jQuery.merge( this, selector );

                
                } else {
                    elem = document.getElementById( match[2] );

                    
                    
                    if ( elem && elem.parentNode ) {
                        
                        
                        if ( elem.id !== match[2] ) {
                            return rootjQuery.find( selector );
                        }

                        
                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            
            } else if ( !context || context.jquery ) {
                return ( context || rootjQuery ).find( selector );

            
            
            } else {
                return this.constructor( context ).find( selector );
            }

        
        
        } else if ( jQuery.isFunction( selector ) ) {
            return rootjQuery.ready( selector );
        }

        if ( selector.selector !== undefined ) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
    },

    
    selector: "",

    
    jquery: "1.8.3",

    
    length: 0,

    
    size: function() {
        return this.length;
    },

    toArray: function() {
        return core_slice.call( this );
    },

    
    
    get: function( num ) {
        return num == null ?

            
            this.toArray() :

            
            ( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    
    
    pushStack: function( elems, name, selector ) {

        
        var ret = jQuery.merge( this.constructor(), elems );

        
        ret.prevObject = this;

        ret.context = this.context;

        if ( name === "find" ) {
            ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
        } else if ( name ) {
            ret.selector = this.selector + "." + name + "(" + selector + ")";
        }

        
        return ret;
    },

    
    
    
    each: function( callback, args ) {
        return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
        
        jQuery.ready.promise().done( fn );

        return this;
    },

    eq: function( i ) {
        i = +i;
        return i === -1 ?
            this.slice( i ) :
            this.slice( i, i + 1 );
    },

    first: function() {
        return this.eq( 0 );
    },

    last: function() {
        return this.eq( -1 );
    },

    slice: function() {
        return this.pushStack( core_slice.apply( this, arguments ),
            "slice", core_slice.call(arguments).join(",") );
    },

    map: function( callback ) {
        return this.pushStack( jQuery.map(this, function( elem, i ) {
            return callback.call( elem, i, elem );
        }));
    },

    end: function() {
        return this.prevObject || this.constructor(null);
    },

    
    
    push: core_push,
    sort: [].sort,
    splice: [].splice
};


jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        
        i = 2;
    }

    
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        
        if ( (options = arguments[ i ]) != null ) {
            
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                
                if ( target === copy ) {
                    continue;
                }

                
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    
                    target[ name ] = jQuery.extend( deep, clone, copy );

                
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    
    return target;
};

jQuery.extend({
    noConflict: function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    },

    
    isReady: false,

    
    
    readyWait: 1,

    
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },

    
    ready: function( wait ) {

        
        if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
            return;
        }

        
        if ( !document.body ) {
            return setTimeout( jQuery.ready, 1 );
        }

        
        jQuery.isReady = true;

        
        if ( wait !== true && --jQuery.readyWait > 0 ) {
            return;
        }

        
        readyList.resolveWith( document, [ jQuery ] );

        
        if ( jQuery.fn.trigger ) {
            jQuery( document ).trigger("ready").off("ready");
        }
    },

    
    
    
    isFunction: function( obj ) {
        return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray || function( obj ) {
        return jQuery.type(obj) === "array";
    },

    isWindow: function( obj ) {
        return obj != null && obj == obj.window;
    },

    isNumeric: function( obj ) {
        return !isNaN( parseFloat(obj) ) && isFinite( obj );
    },

    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            class2type[ core_toString.call(obj) ] || "object";
    },

    isPlainObject: function( obj ) {
        
        
        
        if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        try {
            
            if ( obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            
            return false;
        }

        
        

        var key;
        for ( key in obj ) {}

        return key === undefined || core_hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },

    error: function( msg ) {
        throw new Error( msg );
    },

    
    
    
    parseHTML: function( data, context, scripts ) {
        var parsed;
        if ( !data || typeof data !== "string" ) {
            return null;
        }
        if ( typeof context === "boolean" ) {
            scripts = context;
            context = 0;
        }
        context = context || document;

        
        if ( (parsed = rsingleTag.exec( data )) ) {
            return [ context.createElement( parsed[1] ) ];
        }

        parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
        return jQuery.merge( [],
            (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
    },

    parseJSON: function( data ) {
        if ( !data || typeof data !== "string") {
            return null;
        }

        
        data = jQuery.trim( data );

        
        if ( window.JSON && window.JSON.parse ) {
            return window.JSON.parse( data );
        }

        
        
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {

            return ( new Function( "return " + data ) )();

        }
        jQuery.error( "Invalid JSON: " + data );
    },

    
    parseXML: function( data ) {
        var xml, tmp;
        if ( !data || typeof data !== "string" ) {
            return null;
        }
        try {
            if ( window.DOMParser ) { 
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { 
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            jQuery.error( "Invalid XML: " + data );
        }
        return xml;
    },

    noop: function() {},

    
    
    
    globalEval: function( data ) {
        if ( data && core_rnotwhite.test( data ) ) {
            
            
            
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    },

    
    
    camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    
    each: function( obj, callback, args ) {
        var name,
            i = 0,
            length = obj.length,
            isObj = length === undefined || jQuery.isFunction( obj );

        if ( args ) {
            if ( isObj ) {
                for ( name in obj ) {
                    if ( callback.apply( obj[ name ], args ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.apply( obj[ i++ ], args ) === false ) {
                        break;
                    }
                }
            }

        
        } else {
            if ( isObj ) {
                for ( name in obj ) {
                    if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                        break;
                    }
                }
            }
        }

        return obj;
    },

    
    trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
        function( text ) {
            return text == null ?
                "" :
                core_trim.call( text );
        } :

        
        function( text ) {
            return text == null ?
                "" :
                ( text + "" ).replace( rtrim, "" );
        },

    
    makeArray: function( arr, results ) {
        var type,
            ret = results || [];

        if ( arr != null ) {
            
            
            type = jQuery.type( arr );

            if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
                core_push.call( ret, arr );
            } else {
                jQuery.merge( ret, arr );
            }
        }

        return ret;
    },

    inArray: function( elem, arr, i ) {
        var len;

        if ( arr ) {
            if ( core_indexOf ) {
                return core_indexOf.call( arr, elem, i );
            }

            len = arr.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

            for ( ; i < len; i++ ) {
                
                if ( i in arr && arr[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    },

    merge: function( first, second ) {
        var l = second.length,
            i = first.length,
            j = 0;

        if ( typeof l === "number" ) {
            for ( ; j < l; j++ ) {
                first[ i++ ] = second[ j ];
            }

        } else {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    },

    grep: function( elems, callback, inv ) {
        var retVal,
            ret = [],
            i = 0,
            length = elems.length;
        inv = !!inv;

        
        
        for ( ; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }

        return ret;
    },

    
    map: function( elems, callback, arg ) {
        var value, key,
            ret = [],
            i = 0,
            length = elems.length,
            
            isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

        
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }

        
        } else {
            for ( key in elems ) {
                value = callback( elems[ key ], key, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }
        }

        
        return ret.concat.apply( [], ret );
    },

    
    guid: 1,

    
    
    proxy: function( fn, context ) {
        var tmp, args, proxy;

        if ( typeof context === "string" ) {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        
        
        if ( !jQuery.isFunction( fn ) ) {
            return undefined;
        }

        
        args = core_slice.call( arguments, 2 );
        proxy = function() {
            return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
        };

        
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

        return proxy;
    },

    
    
    access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
        var exec,
            bulk = key == null,
            i = 0,
            length = elems.length;

        
        if ( key && typeof key === "object" ) {
            for ( i in key ) {
                jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
            }
            chainable = 1;

        
        } else if ( value !== undefined ) {
            
            exec = pass === undefined && jQuery.isFunction( value );

            if ( bulk ) {
                
                if ( exec ) {
                    exec = fn;
                    fn = function( elem, key, value ) {
                        return exec.call( jQuery( elem ), value );
                    };

                
                } else {
                    fn.call( elems, value );
                    fn = null;
                }
            }

            if ( fn ) {
                for (; i < length; i++ ) {
                    fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                }
            }

            chainable = 1;
        }

        return chainable ?
            elems :

            
            bulk ?
                fn.call( elems ) :
                length ? fn( elems[0], key ) : emptyGet;
    },

    now: function() {
        return ( new Date() ).getTime();
    }
});

jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = jQuery.Deferred();

        
        
        
        if ( document.readyState === "complete" ) {
            
            setTimeout( jQuery.ready, 1 );

        
        } else if ( document.addEventListener ) {
            
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            
            window.addEventListener( "load", jQuery.ready, false );

        
        } else {
            
            document.attachEvent( "onreadystatechange", DOMContentLoaded );

            
            window.attachEvent( "onload", jQuery.ready );

            
            
            var top = false;

            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}

            if ( top && top.doScroll ) {
                (function doScrollCheck() {
                    if ( !jQuery.isReady ) {

                        try {
                            
                            
                            top.doScroll("left");
                        } catch(e) {
                            return setTimeout( doScrollCheck, 50 );
                        }

                        
                        jQuery.ready();
                    }
                })();
            }
        }
    }
    return readyList.promise( obj );
};


jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});


rootjQuery = jQuery(document);

var optionsCache = {};


function createOptions( options ) {
    var object = optionsCache[ options ] = {};
    jQuery.each( options.split( core_rspace ), function( _, flag ) {
        object[ flag ] = true;
    });
    return object;
}























jQuery.Callbacks = function( options ) {

    
    
    options = typeof options === "string" ?
        ( optionsCache[ options ] || createOptions( options ) ) :
        jQuery.extend( {}, options );

    var 
        memory,
        
        fired,
        
        firing,
        
        firingStart,
        
        firingLength,
        
        firingIndex,
        
        list = [],
        
        stack = !options.once && [],
        
        fire = function( data ) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                    memory = false; 
                    break;
                }
            }
            firing = false;
            if ( list ) {
                if ( stack ) {
                    if ( stack.length ) {
                        fire( stack.shift() );
                    }
                } else if ( memory ) {
                    list = [];
                } else {
                    self.disable();
                }
            }
        },
        
        self = {
            
            add: function() {
                if ( list ) {
                    
                    var start = list.length;
                    (function add( args ) {
                        jQuery.each( args, function( _, arg ) {
                            var type = jQuery.type( arg );
                            if ( type === "function" ) {
                                if ( !options.unique || !self.has( arg ) ) {
                                    list.push( arg );
                                }
                            } else if ( arg && arg.length && type !== "string" ) {
                                
                                add( arg );
                            }
                        });
                    })( arguments );
                    
                    
                    if ( firing ) {
                        firingLength = list.length;
                    
                    
                    } else if ( memory ) {
                        firingStart = start;
                        fire( memory );
                    }
                }
                return this;
            },
            
            remove: function() {
                if ( list ) {
                    jQuery.each( arguments, function( _, arg ) {
                        var index;
                        while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                            list.splice( index, 1 );
                            
                            if ( firing ) {
                                if ( index <= firingLength ) {
                                    firingLength--;
                                }
                                if ( index <= firingIndex ) {
                                    firingIndex--;
                                }
                            }
                        }
                    });
                }
                return this;
            },
            
            has: function( fn ) {
                return jQuery.inArray( fn, list ) > -1;
            },
            
            empty: function() {
                list = [];
                return this;
            },
            
            disable: function() {
                list = stack = memory = undefined;
                return this;
            },
            
            disabled: function() {
                return !list;
            },
            
            lock: function() {
                stack = undefined;
                if ( !memory ) {
                    self.disable();
                }
                return this;
            },
            
            locked: function() {
                return !stack;
            },
            
            fireWith: function( context, args ) {
                args = args || [];
                args = [ context, args.slice ? args.slice() : args ];
                if ( list && ( !fired || stack ) ) {
                    if ( firing ) {
                        stack.push( args );
                    } else {
                        fire( args );
                    }
                }
                return this;
            },
            
            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },
            
            fired: function() {
                return !!fired;
            }
        };

    return self;
};
jQuery.extend({

    Deferred: function( func ) {
        var tuples = [
                
                [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                [ "notify", "progress", jQuery.Callbacks("memory") ]
            ],
            state = "pending",
            promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    deferred.done( arguments ).fail( arguments );
                    return this;
                },
                then: function(  ) {
                    var fns = arguments;
                    return jQuery.Deferred(function( newDefer ) {
                        jQuery.each( tuples, function( i, tuple ) {
                            var action = tuple[ 0 ],
                                fn = fns[ i ];
                            
                            deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                                function() {
                                    var returned = fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise()
                                            .done( newDefer.resolve )
                                            .fail( newDefer.reject )
                                            .progress( newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                    }
                                } :
                                newDefer[ action ]
                            );
                        });
                        fns = null;
                    }).promise();
                },
                
                
                promise: function( obj ) {
                    return obj != null ? jQuery.extend( obj, promise ) : promise;
                }
            },
            deferred = {};

        
        promise.pipe = promise.then;

        
        jQuery.each( tuples, function( i, tuple ) {
            var list = tuple[ 2 ],
                stateString = tuple[ 3 ];

            
            promise[ tuple[1] ] = list.add;

            
            if ( stateString ) {
                list.add(function() {
                    
                    state = stateString;

                
                }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
            }

            
            deferred[ tuple[0] ] = list.fire;
            deferred[ tuple[0] + "With" ] = list.fireWith;
        });

        
        promise.promise( deferred );

        
        if ( func ) {
            func.call( deferred, deferred );
        }

        
        return deferred;
    },

    
    when: function( subordinate  ) {
        var i = 0,
            resolveValues = core_slice.call( arguments ),
            length = resolveValues.length,

            
            remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

            
            deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            
            updateFunc = function( i, contexts, values ) {
                return function( value ) {
                    contexts[ i ] = this;
                    values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                    if( values === progressValues ) {
                        deferred.notifyWith( contexts, values );
                    } else if ( !( --remaining ) ) {
                        deferred.resolveWith( contexts, values );
                    }
                };
            },

            progressValues, progressContexts, resolveContexts;

        
        if ( length > 1 ) {
            progressValues = new Array( length );
            progressContexts = new Array( length );
            resolveContexts = new Array( length );
            for ( ; i < length; i++ ) {
                if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                    resolveValues[ i ].promise()
                        .done( updateFunc( i, resolveContexts, resolveValues ) )
                        .fail( deferred.reject )
                        .progress( updateFunc( i, progressContexts, progressValues ) );
                } else {
                    --remaining;
                }
            }
        }

        
        if ( !remaining ) {
            deferred.resolveWith( resolveContexts, resolveValues );
        }

        return deferred.promise();
    }
});
jQuery.support = (function() {

    var support,
        all,
        a,
        select,
        opt,
        input,
        fragment,
        eventName,
        i,
        isSupported,
        clickFn,
        div = document.createElement("div");

    
    div.setAttribute( "className", "t" );
    div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

    
    all = div.getElementsByTagName("*");
    a = div.getElementsByTagName("a")[ 0 ];
    if ( !all || !a || !all.length ) {
        return {};
    }

    
    select = document.createElement("select");
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName("input")[ 0 ];

    a.style.cssText = "top:1px;float:left;opacity:.5";
    support = {
        
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        
        
        tbody: !div.getElementsByTagName("tbody").length,

        
        
        htmlSerialize: !!div.getElementsByTagName("link").length,

        
        
        style: /top/.test( a.getAttribute("style") ),

        
        
        hrefNormalized: ( a.getAttribute("href") === "/a" ),

        
        
        
        opacity: /^0.5/.test( a.style.opacity ),

        
        
        cssFloat: !!a.style.cssFloat,

        
        
        
        checkOn: ( input.value === "on" ),

        
        
        optSelected: opt.selected,

        
        getSetAttribute: div.className !== "t",

        
        enctype: !!document.createElement("form").enctype,

        
        
        html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

        
        boxModel: ( document.compatMode === "CSS1Compat" ),

        
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true,
        boxSizingReliable: true,
        pixelPosition: false
    };

    
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    
    
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    
    
    try {
        delete div.test;
    } catch( e ) {
        support.deleteExpando = false;
    }

    if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", clickFn = function() {
            
            
            support.noCloneEvent = false;
        });
        div.cloneNode( true ).fireEvent("onclick");
        div.detachEvent( "onclick", clickFn );
    }

    
    
    input = document.createElement("input");
    input.value = "t";
    input.setAttribute( "type", "radio" );
    support.radioValue = input.value === "t";

    input.setAttribute( "checked", "checked" );

    
    input.setAttribute( "name", "t" );

    div.appendChild( input );
    fragment = document.createDocumentFragment();
    fragment.appendChild( div.lastChild );

    
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    
    
    support.appendChecked = input.checked;

    fragment.removeChild( input );
    fragment.appendChild( div );

    
    
    
    
    
    
    if ( div.attachEvent ) {
        for ( i in {
            submit: true,
            change: true,
            focusin: true
        }) {
            eventName = "on" + i;
            isSupported = ( eventName in div );
            if ( !isSupported ) {
                div.setAttribute( eventName, "return;" );
                isSupported = ( typeof div[ eventName ] === "function" );
            }
            support[ i + "Bubbles" ] = isSupported;
        }
    }

    
    jQuery(function() {

    setTimeout(function () {
        var container, div, tds, marginDiv,
            divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
            body = document.getElementsByTagName("body")[0];

        if ( !body ) {
            
            return;
        }

        container = document.createElement("div");
        container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
        body.insertBefore( container, body.firstChild );

        
        div = document.createElement("div");
        container.appendChild( div );

        
        
        
        
        
        
        
        div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName("td");
        tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
        isSupported = ( tds[ 0 ].offsetHeight === 0 );

        tds[ 0 ].style.display = "";
        tds[ 1 ].style.display = "none";

        
        
        support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

        
        div.innerHTML = "";
        div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        support.boxSizing = ( div.offsetWidth === 4 );
        support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

        
        
        if ( window.getComputedStyle ) {
            support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
            support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

            
            
            
            
            
            marginDiv = document.createElement("div");
            marginDiv.style.cssText = div.style.cssText = divReset;
            marginDiv.style.marginRight = marginDiv.style.width = "0";
            div.style.width = "1px";
            div.appendChild( marginDiv );
            support.reliableMarginRight =
                !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
        }

        if ( typeof div.style.zoom !== "undefined" ) {
            
            
            
            
            div.innerHTML = "";
            div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

            
            
            div.style.display = "block";
            div.style.overflow = "visible";
            div.innerHTML = "<div></div>";
            div.firstChild.style.width = "5px";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

            container.style.zoom = 1;
        }

        
        body.removeChild( container );
        container = div = tds = marginDiv = null;
    }, 0);

    });

    
    fragment.removeChild( div );
    all = a = select = opt = input = fragment = div = null;

    return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    rmultiDash = /([A-Z])/g;

jQuery.extend({
    cache: {},

    deletedIds: [],

    
    uuid: 0,

    
    
    expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

    
    
    noData: {
        "embed": true,
        
        "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        "applet": true
    },

    hasData: function( elem ) {
        elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
        return !!elem && !isEmptyDataObject( elem );
    },

    data: function( elem, name, data, pvt  ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

            
            
            isNode = elem.nodeType,

            
            
            cache = isNode ? jQuery.cache : elem,

            
            
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

        
        
        if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            
            
            if ( isNode ) {
                elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            
            
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        
        
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }

        thisCache = cache[ id ];

        
        
        
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        
        
        if ( getByName ) {

            
            ret = thisCache[ name ];

            
            if ( ret == null ) {

                
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    },

    removeData: function( elem, name, pvt  ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, i, l,

            isNode = elem.nodeType,

            
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

        
        
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ] : cache[ id ].data;

            if ( thisCache ) {

                
                if ( !jQuery.isArray( name ) ) {

                    
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {

                        
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split(" ");
                        }
                    }
                }

                for ( i = 0, l = name.length; i < l; i++ ) {
                    delete thisCache[ name[i] ];
                }

                
                
                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                    return;
                }
            }
        }

        
        if ( !pvt ) {
            delete cache[ id ].data;

            
            
            if ( !isEmptyDataObject( cache[ id ] ) ) {
                return;
            }
        }

        
        if ( isNode ) {
            jQuery.cleanData( [ elem ], true );

        
        } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
            delete cache[ id ];

        
        } else {
            cache[ id ] = null;
        }
    },

    
    _data: function( elem, name, data ) {
        return jQuery.data( elem, name, data, true );
    },

    
    acceptData: function( elem ) {
        var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

        
        return !noData || noData !== true && elem.getAttribute("classid") === noData;
    }
});

jQuery.fn.extend({
    data: function( key, value ) {
        var parts, part, attr, name, l,
            elem = this[0],
            i = 0,
            data = null;

        
        if ( key === undefined ) {
            if ( this.length ) {
                data = jQuery.data( elem );

                if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                    attr = elem.attributes;
                    for ( l = attr.length; i < l; i++ ) {
                        name = attr[i].name;

                        if ( !name.indexOf( "data-" ) ) {
                            name = jQuery.camelCase( name.substring(5) );

                            dataAttr( elem, name, data[ name ] );
                        }
                    }
                    jQuery._data( elem, "parsedAttrs", true );
                }
            }

            return data;
        }

        
        if ( typeof key === "object" ) {
            return this.each(function() {
                jQuery.data( this, key );
            });
        }

        parts = key.split( ".", 2 );
        parts[1] = parts[1] ? "." + parts[1] : "";
        part = parts[1] + "!";

        return jQuery.access( this, function( value ) {

            if ( value === undefined ) {
                data = this.triggerHandler( "getData" + part, [ parts[0] ] );

                
                if ( data === undefined && elem ) {
                    data = jQuery.data( elem, key );
                    data = dataAttr( elem, key, data );
                }

                return data === undefined && parts[1] ?
                    this.data( parts[0] ) :
                    data;
            }

            parts[1] = value;
            this.each(function() {
                var self = jQuery( this );

                self.triggerHandler( "setData" + part, parts );
                jQuery.data( this, key, value );
                self.triggerHandler( "changeData" + part, parts );
            });
        }, null, value, arguments.length > 1, null, false );
    },

    removeData: function( key ) {
        return this.each(function() {
            jQuery.removeData( this, key );
        });
    }
});

function dataAttr( elem, key, data ) {
    
    
    if ( data === undefined && elem.nodeType === 1 ) {

        var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                
                +data + "" === data ? +data :
                rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch( e ) {}

            
            jQuery.data( elem, key, data );

        } else {
            data = undefined;
        }
    }

    return data;
}


function isEmptyDataObject( obj ) {
    var name;
    for ( name in obj ) {

        
        if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
            continue;
        }
        if ( name !== "toJSON" ) {
            return false;
        }
    }

    return true;
}
jQuery.extend({
    queue: function( elem, type, data ) {
        var queue;

        if ( elem ) {
            type = ( type || "fx" ) + "queue";
            queue = jQuery._data( elem, type );

            
            if ( data ) {
                if ( !queue || jQuery.isArray(data) ) {
                    queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                } else {
                    queue.push( data );
                }
            }
            return queue || [];
        }
    },

    dequeue: function( elem, type ) {
        type = type || "fx";

        var queue = jQuery.queue( elem, type ),
            startLength = queue.length,
            fn = queue.shift(),
            hooks = jQuery._queueHooks( elem, type ),
            next = function() {
                jQuery.dequeue( elem, type );
            };

        
        if ( fn === "inprogress" ) {
            fn = queue.shift();
            startLength--;
        }

        if ( fn ) {

            
            
            if ( type === "fx" ) {
                queue.unshift( "inprogress" );
            }

            
            delete hooks.stop;
            fn.call( elem, next, hooks );
        }

        if ( !startLength && hooks ) {
            hooks.empty.fire();
        }
    },

    
    _queueHooks: function( elem, type ) {
        var key = type + "queueHooks";
        return jQuery._data( elem, key ) || jQuery._data( elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
                jQuery.removeData( elem, type + "queue", true );
                jQuery.removeData( elem, key, true );
            })
        });
    }
});

jQuery.fn.extend({
    queue: function( type, data ) {
        var setter = 2;

        if ( typeof type !== "string" ) {
            data = type;
            type = "fx";
            setter--;
        }

        if ( arguments.length < setter ) {
            return jQuery.queue( this[0], type );
        }

        return data === undefined ?
            this :
            this.each(function() {
                var queue = jQuery.queue( this, type, data );

                
                jQuery._queueHooks( this, type );

                if ( type === "fx" && queue[0] !== "inprogress" ) {
                    jQuery.dequeue( this, type );
                }
            });
    },
    dequeue: function( type ) {
        return this.each(function() {
            jQuery.dequeue( this, type );
        });
    },
    
    
    delay: function( time, type ) {
        time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
        type = type || "fx";

        return this.queue( type, function( next, hooks ) {
            var timeout = setTimeout( next, time );
            hooks.stop = function() {
                clearTimeout( timeout );
            };
        });
    },
    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    },
    
    
    promise: function( type, obj ) {
        var tmp,
            count = 1,
            defer = jQuery.Deferred(),
            elements = this,
            i = this.length,
            resolve = function() {
                if ( !( --count ) ) {
                    defer.resolveWith( elements, [ elements ] );
                }
            };

        if ( typeof type !== "string" ) {
            obj = type;
            type = undefined;
        }
        type = type || "fx";

        while( i-- ) {
            tmp = jQuery._data( elements[ i ], type + "queueHooks" );
            if ( tmp && tmp.empty ) {
                count++;
                tmp.empty.add( resolve );
            }
        }
        resolve();
        return defer.promise( obj );
    }
});
var nodeHook, boolHook, fixSpecified,
    rclass = /[\t\r\n]/g,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea|)$/i,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
    attr: function( name, value ) {
        return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
    },

    removeAttr: function( name ) {
        return this.each(function() {
            jQuery.removeAttr( this, name );
        });
    },

    prop: function( name, value ) {
        return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
    },

    removeProp: function( name ) {
        name = jQuery.propFix[ name ] || name;
        return this.each(function() {
            
            try {
                this[ name ] = undefined;
                delete this[ name ];
            } catch( e ) {}
        });
    },

    addClass: function( value ) {
        var classNames, i, l, elem,
            setClass, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).addClass( value.call(this, j, this.className) );
            });
        }

        if ( value && typeof value === "string" ) {
            classNames = value.split( core_rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 ) {
                    if ( !elem.className && classNames.length === 1 ) {
                        elem.className = value;

                    } else {
                        setClass = " " + elem.className + " ";

                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                                setClass += classNames[ c ] + " ";
                            }
                        }
                        elem.className = jQuery.trim( setClass );
                    }
                }
            }
        }

        return this;
    },

    removeClass: function( value ) {
        var removes, className, elem, c, cl, i, l;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).removeClass( value.call(this, j, this.className) );
            });
        }
        if ( (value && typeof value === "string") || value === undefined ) {
            removes = ( value || "" ).split( core_rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];
                if ( elem.nodeType === 1 && elem.className ) {

                    className = (" " + elem.className + " ").replace( rclass, " " );

                    
                    for ( c = 0, cl = removes.length; c < cl; c++ ) {
                        
                        while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
                            className = className.replace( " " + removes[ c ] + " " , " " );
                        }
                    }
                    elem.className = value ? jQuery.trim( className ) : "";
                }
            }
        }

        return this;
    },

    toggleClass: function( value, stateVal ) {
        var type = typeof value,
            isBool = typeof stateVal === "boolean";

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( i ) {
                jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
            });
        }

        return this.each(function() {
            if ( type === "string" ) {
                
                var className,
                    i = 0,
                    self = jQuery( this ),
                    state = stateVal,
                    classNames = value.split( core_rspace );

                while ( (className = classNames[ i++ ]) ) {
                    
                    state = isBool ? state : !self.hasClass( className );
                    self[ state ? "addClass" : "removeClass" ]( className );
                }

            } else if ( type === "undefined" || type === "boolean" ) {
                if ( this.className ) {
                    
                    jQuery._data( this, "__className__", this.className );
                }

                
                this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
            }
        });
    },

    hasClass: function( selector ) {
        var className = " " + selector + " ",
            i = 0,
            l = this.length;
        for ( ; i < l; i++ ) {
            if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                return true;
            }
        }

        return false;
    },

    val: function( value ) {
        var hooks, ret, isFunction,
            elem = this[0];

        if ( !arguments.length ) {
            if ( elem ) {
                hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?
                    
                    ret.replace(rreturn, "") :
                    
                    ret == null ? "" : ret;
            }

            return;
        }

        isFunction = jQuery.isFunction( value );

        return this.each(function( i ) {
            var val,
                self = jQuery(this);

            if ( this.nodeType !== 1 ) {
                return;
            }

            if ( isFunction ) {
                val = value.call( this, i, self.val() );
            } else {
                val = value;
            }

            
            if ( val == null ) {
                val = "";
            } else if ( typeof val === "number" ) {
                val += "";
            } else if ( jQuery.isArray( val ) ) {
                val = jQuery.map(val, function ( value ) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

            
            if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                this.value = val;
            }
        });
    }
});

jQuery.extend({
    valHooks: {
        option: {
            get: function( elem ) {
                
                
                var val = elem.attributes.value;
                return !val || val.specified ? elem.value : elem.text;
            }
        },
        select: {
            get: function( elem ) {
                var value, option,
                    options = elem.options,
                    index = elem.selectedIndex,
                    one = elem.type === "select-one" || index < 0,
                    values = one ? null : [],
                    max = one ? index + 1 : options.length,
                    i = index < 0 ?
                        max :
                        one ? index : 0;

                
                for ( ; i < max; i++ ) {
                    option = options[ i ];

                    
                    if ( ( option.selected || i === index ) &&
                            
                            ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                            ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

                        
                        value = jQuery( option ).val();

                        
                        if ( one ) {
                            return value;
                        }

                        
                        values.push( value );
                    }
                }

                return values;
            },

            set: function( elem, value ) {
                var values = jQuery.makeArray( value );

                jQuery(elem).find("option").each(function() {
                    this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                });

                if ( !values.length ) {
                    elem.selectedIndex = -1;
                }
                return values;
            }
        }
    },

    
    attrFn: {},

    attr: function( elem, name, value, pass ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
            return jQuery( elem )[ name ]( value );
        }

        
        if ( typeof elem.getAttribute === "undefined" ) {
            return jQuery.prop( elem, name, value );
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        
        
        if ( notxml ) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
        }

        if ( value !== undefined ) {

            if ( value === null ) {
                jQuery.removeAttr( elem, name );
                return;

            } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                elem.setAttribute( name, value + "" );
                return value;
            }

        } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
            return ret;

        } else {

            ret = elem.getAttribute( name );

            
            return ret === null ?
                undefined :
                ret;
        }
    },

    removeAttr: function( elem, value ) {
        var propName, attrNames, name, isBool,
            i = 0;

        if ( value && elem.nodeType === 1 ) {

            attrNames = value.split( core_rspace );

            for ( ; i < attrNames.length; i++ ) {
                name = attrNames[ i ];

                if ( name ) {
                    propName = jQuery.propFix[ name ] || name;
                    isBool = rboolean.test( name );

                    
                    
                    if ( !isBool ) {
                        jQuery.attr( elem, name, "" );
                    }
                    elem.removeAttribute( getSetAttribute ? name : propName );

                    
                    if ( isBool && propName in elem ) {
                        elem[ propName ] = false;
                    }
                }
            }
        }
    },

    attrHooks: {
        type: {
            set: function( elem, value ) {
                
                if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                    jQuery.error( "type property can't be changed" );
                } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                    
                    
                    
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        },
        
        
        value: {
            get: function( elem, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.get( elem, name );
                }
                return name in elem ?
                    elem.value :
                    null;
            },
            set: function( elem, value, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.set( elem, value, name );
                }
                
                elem.value = value;
            }
        }
    },

    propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    },

    prop: function( elem, name, value ) {
        var ret, hooks, notxml,
            nType = elem.nodeType;

        
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        if ( notxml ) {
            
            name = jQuery.propFix[ name ] || name;
            hooks = jQuery.propHooks[ name ];
        }

        if ( value !== undefined ) {
            if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                return ( elem[ name ] = value );
            }

        } else {
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {
                return elem[ name ];
            }
        }
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {
                
                
                var attributeNode = elem.getAttributeNode("tabindex");

                return attributeNode && attributeNode.specified ?
                    parseInt( attributeNode.value, 10 ) :
                    rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                        0 :
                        undefined;
            }
        }
    }
});


boolHook = {
    get: function( elem, name ) {
        
        
        var attrNode,
            property = jQuery.prop( elem, name );
        return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
            name.toLowerCase() :
            undefined;
    },
    set: function( elem, value, name ) {
        var propName;
        if ( value === false ) {
            
            jQuery.removeAttr( elem, name );
        } else {
            
            
            propName = jQuery.propFix[ name ] || name;
            if ( propName in elem ) {
                
                elem[ propName ] = true;
            }

            elem.setAttribute( name, name.toLowerCase() );
        }
        return name;
    }
};


if ( !getSetAttribute ) {

    fixSpecified = {
        name: true,
        id: true,
        coords: true
    };

    
    
    nodeHook = jQuery.valHooks.button = {
        get: function( elem, name ) {
            var ret;
            ret = elem.getAttributeNode( name );
            return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
                ret.value :
                undefined;
        },
        set: function( elem, value, name ) {
            
            var ret = elem.getAttributeNode( name );
            if ( !ret ) {
                ret = document.createAttribute( name );
                elem.setAttributeNode( ret );
            }
            return ( ret.value = value + "" );
        }
    };

    
    
    jQuery.each([ "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            set: function( elem, value ) {
                if ( value === "" ) {
                    elem.setAttribute( name, "auto" );
                    return value;
                }
            }
        });
    });

    
    
    jQuery.attrHooks.contenteditable = {
        get: nodeHook.get,
        set: function( elem, value, name ) {
            if ( value === "" ) {
                value = "false";
            }
            nodeHook.set( elem, value, name );
        }
    };
}



if ( !jQuery.support.hrefNormalized ) {
    jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            get: function( elem ) {
                var ret = elem.getAttribute( name, 2 );
                return ret === null ? undefined : ret;
            }
        });
    });
}

if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
        get: function( elem ) {
            
            
            return elem.style.cssText.toLowerCase() || undefined;
        },
        set: function( elem, value ) {
            return ( elem.style.cssText = value + "" );
        }
    };
}



if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
        get: function( elem ) {
            var parent = elem.parentNode;

            if ( parent ) {
                parent.selectedIndex;

                
                if ( parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
            }
            return null;
        }
    });
}


if ( !jQuery.support.enctype ) {
    jQuery.propFix.enctype = "encoding";
}


if ( !jQuery.support.checkOn ) {
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            get: function( elem ) {
                
                return elem.getAttribute("value") === null ? "on" : elem.value;
            }
        };
    });
}
jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
        set: function( elem, value ) {
            if ( jQuery.isArray( value ) ) {
                return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
            }
        }
    });
});
var rformElems = /^(?:textarea|input|select)$/i,
    rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
    rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    hoverHack = function( events ) {
        return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
    };





jQuery.event = {

    add: function( elem, types, handler, data, selector ) {

        var elemData, eventHandle, events,
            t, tns, type, namespaces, handleObj,
            handleObjIn, handlers, special;

        
        if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
            return;
        }

        
        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
        }

        
        if ( !handler.guid ) {
            handler.guid = jQuery.guid++;
        }

        
        events = elemData.events;
        if ( !events ) {
            elemData.events = events = {};
        }
        eventHandle = elemData.handle;
        if ( !eventHandle ) {
            elemData.handle = eventHandle = function( e ) {
                
                
                return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                    jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                    undefined;
            };
            
            eventHandle.elem = elem;
        }

        
        
        types = jQuery.trim( hoverHack(types) ).split( " " );
        for ( t = 0; t < types.length; t++ ) {

            tns = rtypenamespace.exec( types[t] ) || [];
            type = tns[1];
            namespaces = ( tns[2] || "" ).split( "." ).sort();

            
            special = jQuery.event.special[ type ] || {};

            
            type = ( selector ? special.delegateType : special.bindType ) || type;

            
            special = jQuery.event.special[ type ] || {};

            
            handleObj = jQuery.extend({
                type: type,
                origType: tns[1],
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                namespace: namespaces.join(".")
            }, handleObjIn );

            
            handlers = events[ type ];
            if ( !handlers ) {
                handlers = events[ type ] = [];
                handlers.delegateCount = 0;

                
                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                    
                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle, false );

                    } else if ( elem.attachEvent ) {
                        elem.attachEvent( "on" + type, eventHandle );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            
            if ( selector ) {
                handlers.splice( handlers.delegateCount++, 0, handleObj );
            } else {
                handlers.push( handleObj );
            }

            
            jQuery.event.global[ type ] = true;
        }

        
        elem = null;
    },

    global: {},

    
    remove: function( elem, types, handler, selector, mappedTypes ) {

        var t, tns, type, origType, namespaces, origCount,
            j, events, special, eventType, handleObj,
            elemData = jQuery.hasData( elem ) && jQuery._data( elem );

        if ( !elemData || !(events = elemData.events) ) {
            return;
        }

        
        types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
        for ( t = 0; t < types.length; t++ ) {
            tns = rtypenamespace.exec( types[t] ) || [];
            type = origType = tns[1];
            namespaces = tns[2];

            
            if ( !type ) {
                for ( type in events ) {
                    jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                }
                continue;
            }

            special = jQuery.event.special[ type ] || {};
            type = ( selector? special.delegateType : special.bindType ) || type;
            eventType = events[ type ] || [];
            origCount = eventType.length;
            namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

            
            for ( j = 0; j < eventType.length; j++ ) {
                handleObj = eventType[ j ];

                if ( ( mappedTypes || origType === handleObj.origType ) &&
                     ( !handler || handler.guid === handleObj.guid ) &&
                     ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                     ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                    eventType.splice( j--, 1 );

                    if ( handleObj.selector ) {
                        eventType.delegateCount--;
                    }
                    if ( special.remove ) {
                        special.remove.call( elem, handleObj );
                    }
                }
            }

            
            
            if ( eventType.length === 0 && origCount !== eventType.length ) {
                if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                    jQuery.removeEvent( elem, type, elemData.handle );
                }

                delete events[ type ];
            }
        }

        
        if ( jQuery.isEmptyObject( events ) ) {
            delete elemData.handle;

            
            
            jQuery.removeData( elem, "events", true );
        }
    },

    
    
    customEvent: {
        "getData": true,
        "setData": true,
        "changeData": true
    },

    trigger: function( event, data, elem, onlyHandlers ) {
        
        if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
            return;
        }

        
        var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
            type = event.type || event,
            namespaces = [];

        
        if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
            return;
        }

        if ( type.indexOf( "!" ) >= 0 ) {
            
            type = type.slice(0, -1);
            exclusive = true;
        }

        if ( type.indexOf( "." ) >= 0 ) {
            
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }

        if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
            
            return;
        }

        
        event = typeof event === "object" ?
            
            event[ jQuery.expando ] ? event :
            
            new jQuery.Event( type, event ) :
            
            new jQuery.Event( type );

        event.type = type;
        event.isTrigger = true;
        event.exclusive = exclusive;
        event.namespace = namespaces.join( "." );
        event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
        ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

        
        if ( !elem ) {

            
            cache = jQuery.cache;
            for ( i in cache ) {
                if ( cache[ i ].events && cache[ i ].events[ type ] ) {
                    jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
                }
            }
            return;
        }

        
        event.result = undefined;
        if ( !event.target ) {
            event.target = elem;
        }

        
        data = data != null ? jQuery.makeArray( data ) : [];
        data.unshift( event );

        
        special = jQuery.event.special[ type ] || {};
        if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
            return;
        }

        
        
        eventPath = [[ elem, special.bindType || type ]];
        if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

            bubbleType = special.delegateType || type;
            cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
            for ( old = elem; cur; cur = cur.parentNode ) {
                eventPath.push([ cur, bubbleType ]);
                old = cur;
            }

            
            if ( old === (elem.ownerDocument || document) ) {
                eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
            }
        }

        
        for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

            cur = eventPath[i][0];
            event.type = eventPath[i][1];

            handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
            if ( handle ) {
                handle.apply( cur, data );
            }
            
            handle = ontype && cur[ ontype ];
            if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                event.preventDefault();
            }
        }
        event.type = type;

        
        if ( !onlyHandlers && !event.isDefaultPrevented() ) {

            if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                
                
                
                
                if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

                    
                    old = elem[ ontype ];

                    if ( old ) {
                        elem[ ontype ] = null;
                    }

                    
                    jQuery.event.triggered = type;
                    elem[ type ]();
                    jQuery.event.triggered = undefined;

                    if ( old ) {
                        elem[ ontype ] = old;
                    }
                }
            }
        }

        return event.result;
    },

    dispatch: function( event ) {

        
        event = jQuery.event.fix( event || window.event );

        var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
            handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
            delegateCount = handlers.delegateCount,
            args = core_slice.call( arguments ),
            run_all = !event.exclusive && !event.namespace,
            special = jQuery.event.special[ event.type ] || {},
            handlerQueue = [];

        
        args[0] = event;
        event.delegateTarget = this;

        
        if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
            return;
        }

        
        
        if ( delegateCount && !(event.button && event.type === "click") ) {

            for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

                
                if ( cur.disabled !== true || event.type !== "click" ) {
                    selMatch = {};
                    matches = [];
                    for ( i = 0; i < delegateCount; i++ ) {
                        handleObj = handlers[ i ];
                        sel = handleObj.selector;

                        if ( selMatch[ sel ] === undefined ) {
                            selMatch[ sel ] = handleObj.needsContext ?
                                jQuery( sel, this ).index( cur ) >= 0 :
                                jQuery.find( sel, this, null, [ cur ] ).length;
                        }
                        if ( selMatch[ sel ] ) {
                            matches.push( handleObj );
                        }
                    }
                    if ( matches.length ) {
                        handlerQueue.push({ elem: cur, matches: matches });
                    }
                }
            }
        }

        
        if ( handlers.length > delegateCount ) {
            handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
        }

        
        for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
            matched = handlerQueue[ i ];
            event.currentTarget = matched.elem;

            for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
                handleObj = matched.matches[ j ];

                
                
                if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

                    event.data = handleObj.data;
                    event.handleObj = handleObj;

                    ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                    if ( ret !== undefined ) {
                        event.result = ret;
                        if ( ret === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        
        if ( special.postDispatch ) {
            special.postDispatch.call( this, event );
        }

        return event.result;
    },

    
    
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

    fixHooks: {},

    keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function( event, original ) {

            
            if ( event.which == null ) {
                event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
        }
    },

    mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function( event, original ) {
            var eventDoc, doc, body,
                button = original.button,
                fromElement = original.fromElement;

            
            if ( event.pageX == null && original.clientX != null ) {
                eventDoc = event.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            
            if ( !event.relatedTarget && fromElement ) {
                event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
            }

            
            
            if ( !event.which && button !== undefined ) {
                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
            }

            return event;
        }
    },

    fix: function( event ) {
        if ( event[ jQuery.expando ] ) {
            return event;
        }

        
        var i, prop,
            originalEvent = event,
            fixHook = jQuery.event.fixHooks[ event.type ] || {},
            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        event = jQuery.Event( originalEvent );

        for ( i = copy.length; i; ) {
            prop = copy[ --i ];
            event[ prop ] = originalEvent[ prop ];
        }

        
        if ( !event.target ) {
            event.target = originalEvent.srcElement || document;
        }

        
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        
        event.metaKey = !!event.metaKey;

        return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
    },

    special: {
        load: {
            
            noBubble: true
        },

        focus: {
            delegateType: "focusin"
        },
        blur: {
            delegateType: "focusout"
        },

        beforeunload: {
            setup: function( data, namespaces, eventHandle ) {
                
                if ( jQuery.isWindow( this ) ) {
                    this.onbeforeunload = eventHandle;
                }
            },

            teardown: function( namespaces, eventHandle ) {
                if ( this.onbeforeunload === eventHandle ) {
                    this.onbeforeunload = null;
                }
            }
        }
    },

    simulate: function( type, elem, event, bubble ) {
        
        
        
        var e = jQuery.extend(
            new jQuery.Event(),
            event,
            { type: type,
                isSimulated: true,
                originalEvent: {}
            }
        );
        if ( bubble ) {
            jQuery.event.trigger( e, null, elem );
        } else {
            jQuery.event.dispatch.call( elem, e );
        }
        if ( e.isDefaultPrevented() ) {
            event.preventDefault();
        }
    }
};



jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
    function( elem, type, handle ) {
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle, false );
        }
    } :
    function( elem, type, handle ) {
        var name = "on" + type;

        if ( elem.detachEvent ) {

            
            
            if ( typeof elem[ name ] === "undefined" ) {
                elem[ name ] = null;
            }

            elem.detachEvent( name, handle );
        }
    };

jQuery.Event = function( src, props ) {
    
    if ( !(this instanceof jQuery.Event) ) {
        return new jQuery.Event( src, props );
    }

    
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        
        
        this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

    
    } else {
        this.type = src;
    }

    
    if ( props ) {
        jQuery.extend( this, props );
    }

    
    this.timeStamp = src && src.timeStamp || jQuery.now();

    
    this[ jQuery.expando ] = true;
};

function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
}



jQuery.Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }

        
        if ( e.preventDefault ) {
            e.preventDefault();

        
        } else {
            e.returnValue = false;
        }
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }
        
        if ( e.stopPropagation ) {
            e.stopPropagation();
        }
        
        e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
};


jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        delegateType: fix,
        bindType: fix,

        handle: function( event ) {
            var ret,
                target = this,
                related = event.relatedTarget,
                handleObj = event.handleObj,
                selector = handleObj.selector;

            
            
            if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = fix;
            }
            return ret;
        }
    };
});


if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
        setup: function() {
            
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            
            jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                
                var elem = e.target,
                    form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                if ( form && !jQuery._data( form, "_submit_attached" ) ) {
                    jQuery.event.add( form, "submit._submit", function( event ) {
                        event._submit_bubble = true;
                    });
                    jQuery._data( form, "_submit_attached", true );
                }
            });
            
        },

        postDispatch: function( event ) {
            
            if ( event._submit_bubble ) {
                delete event._submit_bubble;
                if ( this.parentNode && !event.isTrigger ) {
                    jQuery.event.simulate( "submit", this.parentNode, event, true );
                }
            }
        },

        teardown: function() {
            
            if ( jQuery.nodeName( this, "form" ) ) {
                return false;
            }

            
            jQuery.event.remove( this, "._submit" );
        }
    };
}


if ( !jQuery.support.changeBubbles ) {

    jQuery.event.special.change = {

        setup: function() {

            if ( rformElems.test( this.nodeName ) ) {
                
                
                
                if ( this.type === "checkbox" || this.type === "radio" ) {
                    jQuery.event.add( this, "propertychange._change", function( event ) {
                        if ( event.originalEvent.propertyName === "checked" ) {
                            this._just_changed = true;
                        }
                    });
                    jQuery.event.add( this, "click._change", function( event ) {
                        if ( this._just_changed && !event.isTrigger ) {
                            this._just_changed = false;
                        }
                        
                        jQuery.event.simulate( "change", this, event, true );
                    });
                }
                return false;
            }
            
            jQuery.event.add( this, "beforeactivate._change", function( e ) {
                var elem = e.target;

                if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
                    jQuery.event.add( elem, "change._change", function( event ) {
                        if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                            jQuery.event.simulate( "change", this.parentNode, event, true );
                        }
                    });
                    jQuery._data( elem, "_change_attached", true );
                }
            });
        },

        handle: function( event ) {
            var elem = event.target;

            
            if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                return event.handleObj.handler.apply( this, arguments );
            }
        },

        teardown: function() {
            jQuery.event.remove( this, "._change" );

            return !rformElems.test( this.nodeName );
        }
    };
}


if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        
        var attaches = 0,
            handler = function( event ) {
                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
            };

        jQuery.event.special[ fix ] = {
            setup: function() {
                if ( attaches++ === 0 ) {
                    document.addEventListener( orig, handler, true );
                }
            },
            teardown: function() {
                if ( --attaches === 0 ) {
                    document.removeEventListener( orig, handler, true );
                }
            }
        };
    });
}

jQuery.fn.extend({

    on: function( types, selector, data, fn,  one ) {
        var origFn, type;

        
        if ( typeof types === "object" ) {
            
            if ( typeof selector !== "string" ) { 
                
                data = data || selector;
                selector = undefined;
            }
            for ( type in types ) {
                this.on( type, selector, data, types[ type ], one );
            }
            return this;
        }

        if ( data == null && fn == null ) {
            
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {
                
                fn = data;
                data = undefined;
            } else {
                
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return this;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {
                
                jQuery().off( event );
                return origFn.apply( this, arguments );
            };
            
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
        }
        return this.each( function() {
            jQuery.event.add( this, types, fn, data, selector );
        });
    },
    one: function( types, selector, data, fn ) {
        return this.on( types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        var handleObj, type;
        if ( types && types.preventDefault && types.handleObj ) {
            
            handleObj = types.handleObj;
            jQuery( types.delegateTarget ).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {
            
            for ( type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {
            
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each(function() {
            jQuery.event.remove( this, types, fn, selector );
        });
    },

    bind: function( types, data, fn ) {
        return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
        return this.off( types, null, fn );
    },

    live: function( types, data, fn ) {
        jQuery( this.context ).on( types, this.selector, data, fn );
        return this;
    },
    die: function( types, fn ) {
        jQuery( this.context ).off( types, this.selector || "**", fn );
        return this;
    },

    delegate: function( selector, types, data, fn ) {
        return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {
        
        return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
    },

    trigger: function( type, data ) {
        return this.each(function() {
            jQuery.event.trigger( type, data, this );
        });
    },
    triggerHandler: function( type, data ) {
        if ( this[0] ) {
            return jQuery.event.trigger( type, data, this[0], true );
        }
    },

    toggle: function( fn ) {
        
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                
                event.preventDefault();

                
                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    },

    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

    
    jQuery.fn[ name ] = function( data, fn ) {
        if ( fn == null ) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ?
            this.on( name, null, data, fn ) :
            this.trigger( name );
    };

    if ( rkeyEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
    }

    if ( rmouseEvent.test( name ) ) {
        jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
    }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
    assertGetIdNotName,
    Expr,
    getText,
    isXML,
    contains,
    compile,
    sortOrder,
    hasDuplicate,
    outermostContext,

    baseHasDuplicate = true,
    strundefined = "undefined",

    expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

    Token = String,
    document = window.document,
    docElem = document.documentElement,
    dirruns = 0,
    done = 0,
    pop = [].pop,
    push = [].push,
    slice = [].slice,
    
    indexOf = [].indexOf || function( elem ) {
        var i = 0,
            len = this.length;
        for ( ; i < len; i++ ) {
            if ( this[i] === elem ) {
                return i;
            }
        }
        return -1;
    },

    
    markFunction = function( fn, value ) {
        fn[ expando ] = value == null || value;
        return fn;
    },

    createCache = function() {
        var cache = {},
            keys = [];

        return markFunction(function( key, value ) {
            
            if ( keys.push( key ) > Expr.cacheLength ) {
                delete cache[ keys.shift() ];
            }

            
            return (cache[ key + " " ] = value);
        }, cache );
    },

    classCache = createCache(),
    tokenCache = createCache(),
    compilerCache = createCache(),

    

    
    whitespace = "[\\x20\\t\\r\\n\\f]",
    
    characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

    
    
    
    identifier = characterEncoding.replace( "w", "w#" ),

    
    operators = "([*^$|!~]?=)",
    attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
        "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

    
    
    
    
    
    pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

    
    pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
        "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

    
    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
    rpseudo = new RegExp( pseudos ),

    
    rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

    rnot = /^:not/,
    rsibling = /[\x20\t\r\n\f]*[+~]/,
    rendsWithNot = /:not\($/,

    rheader = /h\d/i,
    rinputs = /input|select|textarea|button/i,

    rbackslash = /\\(?!\\)/g,

    matchExpr = {
        "ID": new RegExp( "^#(" + characterEncoding + ")" ),
        "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
        "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
        "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "POS": new RegExp( pos, "i" ),
        "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
            "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
    },

    

    
    assert = function( fn ) {
        var div = document.createElement("div");

        try {
            return fn( div );
        } catch (e) {
            return false;
        } finally {
            
            div = null;
        }
    },

    
    assertTagNameNoComments = assert(function( div ) {
        div.appendChild( document.createComment("") );
        return !div.getElementsByTagName("*").length;
    }),

    
    assertHrefNotNormalized = assert(function( div ) {
        div.innerHTML = "<a href='#'></a>";
        return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
            div.firstChild.getAttribute("href") === "#";
    }),

    
    assertAttributes = assert(function( div ) {
        div.innerHTML = "<select></select>";
        var type = typeof div.lastChild.getAttribute("multiple");
        
        return type !== "boolean" && type !== "string";
    }),

    
    assertUsableClassName = assert(function( div ) {
        
        div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
        if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
            return false;
        }

        
        div.lastChild.className = "e";
        return div.getElementsByClassName("e").length === 2;
    }),

    
    
    assertUsableName = assert(function( div ) {
        
        div.id = expando + 0;
        div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
        docElem.insertBefore( div, docElem.firstChild );

        
        var pass = document.getElementsByName &&
            
            document.getElementsByName( expando ).length === 2 +
            
            document.getElementsByName( expando + 0 ).length;
        assertGetIdNotName = !document.getElementById( expando );

        
        docElem.removeChild( div );

        return pass;
    });


try {
    slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
    slice = function( i ) {
        var elem,
            results = [];
        for ( ; (elem = this[i]); i++ ) {
            results.push( elem );
        }
        return results;
    };
}

function Sizzle( selector, context, results, seed ) {
    results = results || [];
    context = context || document;
    var match, elem, xml, m,
        nodeType = context.nodeType;

    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    if ( nodeType !== 1 && nodeType !== 9 ) {
        return [];
    }

    xml = isXML( context );

    if ( !xml && !seed ) {
        if ( (match = rquickExpr.exec( selector )) ) {
            
            if ( (m = match[1]) ) {
                if ( nodeType === 9 ) {
                    elem = context.getElementById( m );
                    
                    
                    if ( elem && elem.parentNode ) {
                        
                        
                        if ( elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    } else {
                        return results;
                    }
                } else {
                    
                    if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                        contains( context, elem ) && elem.id === m ) {
                        results.push( elem );
                        return results;
                    }
                }

            
            } else if ( match[2] ) {
                push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
                return results;

            
            } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
                push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
                return results;
            }
        }
    }

    
    return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
    return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
    return Sizzle( expr, null, null, [ elem ] ).length > 0;
};


function createInputPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
    };
}


function createButtonPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
    };
}


function createPositionalPseudo( fn ) {
    return markFunction(function( argument ) {
        argument = +argument;
        return markFunction(function( seed, matches ) {
            var j,
                matchIndexes = fn( [], seed.length, argument ),
                i = matchIndexes.length;

            
            while ( i-- ) {
                if ( seed[ (j = matchIndexes[i]) ] ) {
                    seed[j] = !(matches[j] = seed[j]);
                }
            }
        });
    });
}





getText = Sizzle.getText = function( elem ) {
    var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

    if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            
            
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
        
    } else {

        
        for ( ; (node = elem[i]); i++ ) {
            
            ret += getText( node );
        }
    }
    return ret;
};

isXML = Sizzle.isXML = function( elem ) {
    
    
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};


contains = Sizzle.contains = docElem.contains ?
    function( a, b ) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
    } :
    docElem.compareDocumentPosition ?
    function( a, b ) {
        return b && !!( a.compareDocumentPosition( b ) & 16 );
    } :
    function( a, b ) {
        while ( (b = b.parentNode) ) {
            if ( b === a ) {
                return true;
            }
        }
        return false;
    };

Sizzle.attr = function( elem, name ) {
    var val,
        xml = isXML( elem );

    if ( !xml ) {
        name = name.toLowerCase();
    }
    if ( (val = Expr.attrHandle[ name ]) ) {
        return val( elem );
    }
    if ( xml || assertAttributes ) {
        return elem.getAttribute( name );
    }
    val = elem.getAttributeNode( name );
    return val ?
        typeof elem[ name ] === "boolean" ?
            elem[ name ] ? name : null :
            val.specified ? val.value : null :
        null;
};

Expr = Sizzle.selectors = {

    
    cacheLength: 50,

    createPseudo: markFunction,

    match: matchExpr,

    
    attrHandle: assertHrefNotNormalized ?
        {} :
        {
            "href": function( elem ) {
                return elem.getAttribute( "href", 2 );
            },
            "type": function( elem ) {
                return elem.getAttribute("type");
            }
        },

    find: {
        "ID": assertGetIdNotName ?
            function( id, context, xml ) {
                if ( typeof context.getElementById !== strundefined && !xml ) {
                    var m = context.getElementById( id );
                    
                    
                    return m && m.parentNode ? [m] : [];
                }
            } :
            function( id, context, xml ) {
                if ( typeof context.getElementById !== strundefined && !xml ) {
                    var m = context.getElementById( id );

                    return m ?
                        m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                            [m] :
                            undefined :
                        [];
                }
            },

        "TAG": assertTagNameNoComments ?
            function( tag, context ) {
                if ( typeof context.getElementsByTagName !== strundefined ) {
                    return context.getElementsByTagName( tag );
                }
            } :
            function( tag, context ) {
                var results = context.getElementsByTagName( tag );

                
                if ( tag === "*" ) {
                    var elem,
                        tmp = [],
                        i = 0;

                    for ( ; (elem = results[i]); i++ ) {
                        if ( elem.nodeType === 1 ) {
                            tmp.push( elem );
                        }
                    }

                    return tmp;
                }
                return results;
            },

        "NAME": assertUsableName && function( tag, context ) {
            if ( typeof context.getElementsByName !== strundefined ) {
                return context.getElementsByName( name );
            }
        },

        "CLASS": assertUsableClassName && function( className, context, xml ) {
            if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
                return context.getElementsByClassName( className );
            }
        }
    },

    relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" }
    },

    preFilter: {
        "ATTR": function( match ) {
            match[1] = match[1].replace( rbackslash, "" );

            
            match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

            if ( match[2] === "~=" ) {
                match[3] = " " + match[3] + " ";
            }

            return match.slice( 0, 4 );
        },

        "CHILD": function( match ) {
            








            match[1] = match[1].toLowerCase();

            if ( match[1] === "nth" ) {
                
                if ( !match[2] ) {
                    Sizzle.error( match[0] );
                }

                
                
                match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
                match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

            
            } else if ( match[2] ) {
                Sizzle.error( match[0] );
            }

            return match;
        },

        "PSEUDO": function( match ) {
            var unquoted, excess;
            if ( matchExpr["CHILD"].test( match[0] ) ) {
                return null;
            }

            if ( match[3] ) {
                match[2] = match[3];
            } else if ( (unquoted = match[4]) ) {
                
                if ( rpseudo.test(unquoted) &&
                    
                    (excess = tokenize( unquoted, true )) &&
                    
                    (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                    
                    unquoted = unquoted.slice( 0, excess );
                    match[0] = match[0].slice( 0, excess );
                }
                match[2] = unquoted;
            }

            
            return match.slice( 0, 3 );
        }
    },

    filter: {
        "ID": assertGetIdNotName ?
            function( id ) {
                id = id.replace( rbackslash, "" );
                return function( elem ) {
                    return elem.getAttribute("id") === id;
                };
            } :
            function( id ) {
                id = id.replace( rbackslash, "" );
                return function( elem ) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === id;
                };
            },

        "TAG": function( nodeName ) {
            if ( nodeName === "*" ) {
                return function() { return true; };
            }
            nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

            return function( elem ) {
                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
            };
        },

        "CLASS": function( className ) {
            var pattern = classCache[ expando ][ className + " " ];

            return pattern ||
                (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                classCache( className, function( elem ) {
                    return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
                });
        },

        "ATTR": function( name, operator, check ) {
            return function( elem, context ) {
                var result = Sizzle.attr( elem, name );

                if ( result == null ) {
                    return operator === "!=";
                }
                if ( !operator ) {
                    return true;
                }

                result += "";

                return operator === "=" ? result === check :
                    operator === "!=" ? result !== check :
                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                    operator === "$=" ? check && result.substr( result.length - check.length ) === check :
                    operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                    operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
                    false;
            };
        },

        "CHILD": function( type, argument, first, last ) {

            if ( type === "nth" ) {
                return function( elem ) {
                    var node, diff,
                        parent = elem.parentNode;

                    if ( first === 1 && last === 0 ) {
                        return true;
                    }

                    if ( parent ) {
                        diff = 0;
                        for ( node = parent.firstChild; node; node = node.nextSibling ) {
                            if ( node.nodeType === 1 ) {
                                diff++;
                                if ( elem === node ) {
                                    break;
                                }
                            }
                        }
                    }

                    
                    diff -= last;
                    return diff === first || ( diff % first === 0 && diff / first >= 0 );
                };
            }

            return function( elem ) {
                var node = elem;

                switch ( type ) {
                    case "only":
                    case "first":
                        while ( (node = node.previousSibling) ) {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        if ( type === "first" ) {
                            return true;
                        }

                        node = elem;

                        
                    case "last":
                        while ( (node = node.nextSibling) ) {
                            if ( node.nodeType === 1 ) {
                                return false;
                            }
                        }

                        return true;
                }
            };
        },

        "PSEUDO": function( pseudo, argument ) {
            
            
            
            
            var args,
                fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                    Sizzle.error( "unsupported pseudo: " + pseudo );

            
            
            
            if ( fn[ expando ] ) {
                return fn( argument );
            }

            
            if ( fn.length > 1 ) {
                args = [ pseudo, pseudo, "", argument ];
                return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                    markFunction(function( seed, matches ) {
                        var idx,
                            matched = fn( seed, argument ),
                            i = matched.length;
                        while ( i-- ) {
                            idx = indexOf.call( seed, matched[i] );
                            seed[ idx ] = !( matches[ idx ] = matched[i] );
                        }
                    }) :
                    function( elem ) {
                        return fn( elem, 0, args );
                    };
            }

            return fn;
        }
    },

    pseudos: {
        "not": markFunction(function( selector ) {
            
            
            
            var input = [],
                results = [],
                matcher = compile( selector.replace( rtrim, "$1" ) );

            return matcher[ expando ] ?
                markFunction(function( seed, matches, context, xml ) {
                    var elem,
                        unmatched = matcher( seed, null, xml, [] ),
                        i = seed.length;

                    
                    while ( i-- ) {
                        if ( (elem = unmatched[i]) ) {
                            seed[i] = !(matches[i] = elem);
                        }
                    }
                }) :
                function( elem, context, xml ) {
                    input[0] = elem;
                    matcher( input, null, xml, results );
                    return !results.pop();
                };
        }),

        "has": markFunction(function( selector ) {
            return function( elem ) {
                return Sizzle( selector, elem ).length > 0;
            };
        }),

        "contains": markFunction(function( text ) {
            return function( elem ) {
                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
            };
        }),

        "enabled": function( elem ) {
            return elem.disabled === false;
        },

        "disabled": function( elem ) {
            return elem.disabled === true;
        },

        "checked": function( elem ) {
            
            
            var nodeName = elem.nodeName.toLowerCase();
            return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },

        "selected": function( elem ) {
            
            
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }

            return elem.selected === true;
        },

        "parent": function( elem ) {
            return !Expr.pseudos["empty"]( elem );
        },

        "empty": function( elem ) {
            
            
            
            
            
            var nodeType;
            elem = elem.firstChild;
            while ( elem ) {
                if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
                    return false;
                }
                elem = elem.nextSibling;
            }
            return true;
        },

        "header": function( elem ) {
            return rheader.test( elem.nodeName );
        },

        "text": function( elem ) {
            var type, attr;
            
            
            return elem.nodeName.toLowerCase() === "input" &&
                (type = elem.type) === "text" &&
                ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
        },

        
        "radio": createInputPseudo("radio"),
        "checkbox": createInputPseudo("checkbox"),
        "file": createInputPseudo("file"),
        "password": createInputPseudo("password"),
        "image": createInputPseudo("image"),

        "submit": createButtonPseudo("submit"),
        "reset": createButtonPseudo("reset"),

        "button": function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === "button" || name === "button";
        },

        "input": function( elem ) {
            return rinputs.test( elem.nodeName );
        },

        "focus": function( elem ) {
            var doc = elem.ownerDocument;
            return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },

        "active": function( elem ) {
            return elem === elem.ownerDocument.activeElement;
        },

        
        "first": createPositionalPseudo(function() {
            return [ 0 ];
        }),

        "last": createPositionalPseudo(function( matchIndexes, length ) {
            return [ length - 1 ];
        }),

        "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
            return [ argument < 0 ? argument + length : argument ];
        }),

        "even": createPositionalPseudo(function( matchIndexes, length ) {
            for ( var i = 0; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "odd": createPositionalPseudo(function( matchIndexes, length ) {
            for ( var i = 1; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        })
    }
};

function siblingCheck( a, b, ret ) {
    if ( a === b ) {
        return ret;
    }

    var cur = a.nextSibling;

    while ( cur ) {
        if ( cur === b ) {
            return -1;
        }

        cur = cur.nextSibling;
    }

    return 1;
}

sortOrder = docElem.compareDocumentPosition ?
    function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
            a.compareDocumentPosition :
            a.compareDocumentPosition(b) & 4
        ) ? -1 : 1;
    } :
    function( a, b ) {
        
        if ( a === b ) {
            hasDuplicate = true;
            return 0;

        
        } else if ( a.sourceIndex && b.sourceIndex ) {
            return a.sourceIndex - b.sourceIndex;
        }

        var al, bl,
            ap = [],
            bp = [],
            aup = a.parentNode,
            bup = b.parentNode,
            cur = aup;

        
        if ( aup === bup ) {
            return siblingCheck( a, b );

        
        } else if ( !aup ) {
            return -1;

        } else if ( !bup ) {
            return 1;
        }

        
        
        while ( cur ) {
            ap.unshift( cur );
            cur = cur.parentNode;
        }

        cur = bup;

        while ( cur ) {
            bp.unshift( cur );
            cur = cur.parentNode;
        }

        al = ap.length;
        bl = bp.length;

        
        for ( var i = 0; i < al && i < bl; i++ ) {
            if ( ap[i] !== bp[i] ) {
                return siblingCheck( ap[i], bp[i] );
            }
        }

        
        return i === al ?
            siblingCheck( a, bp[i], -1 ) :
            siblingCheck( ap[i], b, 1 );
    };



[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;


Sizzle.uniqueSort = function( results ) {
    var elem,
        duplicates = [],
        i = 1,
        j = 0;

    hasDuplicate = baseHasDuplicate;
    results.sort( sortOrder );

    if ( hasDuplicate ) {
        for ( ; (elem = results[i]); i++ ) {
            if ( elem === results[ i - 1 ] ) {
                j = duplicates.push( i );
            }
        }
        while ( j-- ) {
            results.splice( duplicates[ j ], 1 );
        }
    }

    return results;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
    var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[ expando ][ selector + " " ];

    if ( cached ) {
        return parseOnly ? 0 : cached.slice( 0 );
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while ( soFar ) {

        
        if ( !matched || (match = rcomma.exec( soFar )) ) {
            if ( match ) {
                
                soFar = soFar.slice( match[0].length ) || soFar;
            }
            groups.push( tokens = [] );
        }

        matched = false;

        
        if ( (match = rcombinators.exec( soFar )) ) {
            tokens.push( matched = new Token( match.shift() ) );
            soFar = soFar.slice( matched.length );

            
            matched.type = match[0].replace( rtrim, " " );
        }

        
        for ( type in Expr.filter ) {
            if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                (match = preFilters[ type ]( match ))) ) {

                tokens.push( matched = new Token( match.shift() ) );
                soFar = soFar.slice( matched.length );
                matched.type = type;
                matched.matches = match;
            }
        }

        if ( !matched ) {
            break;
        }
    }

    
    
    
    return parseOnly ?
        soFar.length :
        soFar ?
            Sizzle.error( selector ) :
            
            tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
    var dir = combinator.dir,
        checkNonElements = base && combinator.dir === "parentNode",
        doneName = done++;

    return combinator.first ?
        
        function( elem, context, xml ) {
            while ( (elem = elem[ dir ]) ) {
                if ( checkNonElements || elem.nodeType === 1  ) {
                    return matcher( elem, context, xml );
                }
            }
        } :

        
        function( elem, context, xml ) {
            
            if ( !xml ) {
                var cache,
                    dirkey = dirruns + " " + doneName + " ",
                    cachedkey = dirkey + cachedruns;
                while ( (elem = elem[ dir ]) ) {
                    if ( checkNonElements || elem.nodeType === 1 ) {
                        if ( (cache = elem[ expando ]) === cachedkey ) {
                            return elem.sizset;
                        } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
                            if ( elem.sizset ) {
                                return elem;
                            }
                        } else {
                            elem[ expando ] = cachedkey;
                            if ( matcher( elem, context, xml ) ) {
                                elem.sizset = true;
                                return elem;
                            }
                            elem.sizset = false;
                        }
                    }
                }
            } else {
                while ( (elem = elem[ dir ]) ) {
                    if ( checkNonElements || elem.nodeType === 1 ) {
                        if ( matcher( elem, context, xml ) ) {
                            return elem;
                        }
                    }
                }
            }
        };
}

function elementMatcher( matchers ) {
    return matchers.length > 1 ?
        function( elem, context, xml ) {
            var i = matchers.length;
            while ( i-- ) {
                if ( !matchers[i]( elem, context, xml ) ) {
                    return false;
                }
            }
            return true;
        } :
        matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
    var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

    for ( ; i < len; i++ ) {
        if ( (elem = unmatched[i]) ) {
            if ( !filter || filter( elem, context, xml ) ) {
                newUnmatched.push( elem );
                if ( mapped ) {
                    map.push( i );
                }
            }
        }
    }

    return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    if ( postFilter && !postFilter[ expando ] ) {
        postFilter = setMatcher( postFilter );
    }
    if ( postFinder && !postFinder[ expando ] ) {
        postFinder = setMatcher( postFinder, postSelector );
    }
    return markFunction(function( seed, results, context, xml ) {
        var temp, i, elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,

            
            elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

            
            matcherIn = preFilter && ( seed || !selector ) ?
                condense( elems, preMap, preFilter, context, xml ) :
                elems,

            matcherOut = matcher ?
                
                postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                    
                    [] :

                    
                    results :
                matcherIn;

        
        if ( matcher ) {
            matcher( matcherIn, matcherOut, context, xml );
        }

        
        if ( postFilter ) {
            temp = condense( matcherOut, postMap );
            postFilter( temp, [], context, xml );

            
            i = temp.length;
            while ( i-- ) {
                if ( (elem = temp[i]) ) {
                    matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                }
            }
        }

        if ( seed ) {
            if ( postFinder || preFilter ) {
                if ( postFinder ) {
                    
                    temp = [];
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) ) {
                            
                            temp.push( (matcherIn[i] = elem) );
                        }
                    }
                    postFinder( null, (matcherOut = []), temp, xml );
                }

                
                i = matcherOut.length;
                while ( i-- ) {
                    if ( (elem = matcherOut[i]) &&
                        (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                        seed[temp] = !(results[temp] = elem);
                    }
                }
            }

        
        } else {
            matcherOut = condense(
                matcherOut === results ?
                    matcherOut.splice( preexisting, matcherOut.length ) :
                    matcherOut
            );
            if ( postFinder ) {
                postFinder( null, results, matcherOut, xml );
            } else {
                push.apply( results, matcherOut );
            }
        }
    });
}

function matcherFromTokens( tokens ) {
    var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[ tokens[0].type ],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

        
        matchContext = addCombinator( function( elem ) {
            return elem === checkContext;
        }, implicitRelative, true ),
        matchAnyContext = addCombinator( function( elem ) {
            return indexOf.call( checkContext, elem ) > -1;
        }, implicitRelative, true ),
        matchers = [ function( elem, context, xml ) {
            return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                (checkContext = context).nodeType ?
                    matchContext( elem, context, xml ) :
                    matchAnyContext( elem, context, xml ) );
        } ];

    for ( ; i < len; i++ ) {
        if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
            matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
        } else {
            matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

            
            if ( matcher[ expando ] ) {
                
                j = ++i;
                for ( ; j < len; j++ ) {
                    if ( Expr.relative[ tokens[j].type ] ) {
                        break;
                    }
                }
                return setMatcher(
                    i > 1 && elementMatcher( matchers ),
                    i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
                    matcher,
                    i < j && matcherFromTokens( tokens.slice( i, j ) ),
                    j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                    j < len && tokens.join("")
                );
            }
            matchers.push( matcher );
        }
    }

    return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    var bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function( seed, context, xml, results, expandContext ) {
            var elem, j, matcher,
                setMatched = [],
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                outermost = expandContext != null,
                contextBackup = outermostContext,
                
                elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

            if ( outermost ) {
                outermostContext = context !== document && context;
                cachedruns = superMatcher.el;
            }

            
            for ( ; (elem = elems[i]) != null; i++ ) {
                if ( byElement && elem ) {
                    for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
                        if ( matcher( elem, context, xml ) ) {
                            results.push( elem );
                            break;
                        }
                    }
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                        cachedruns = ++superMatcher.el;
                    }
                }

                
                if ( bySet ) {
                    
                    if ( (elem = !matcher && elem) ) {
                        matchedCount--;
                    }

                    
                    if ( seed ) {
                        unmatched.push( elem );
                    }
                }
            }

            
            matchedCount += i;
            if ( bySet && i !== matchedCount ) {
                for ( j = 0; (matcher = setMatchers[j]); j++ ) {
                    matcher( unmatched, setMatched, context, xml );
                }

                if ( seed ) {
                    
                    if ( matchedCount > 0 ) {
                        while ( i-- ) {
                            if ( !(unmatched[i] || setMatched[i]) ) {
                                setMatched[i] = pop.call( results );
                            }
                        }
                    }

                    
                    setMatched = condense( setMatched );
                }

                
                push.apply( results, setMatched );

                
                if ( outermost && !seed && setMatched.length > 0 &&
                    ( matchedCount + setMatchers.length ) > 1 ) {

                    Sizzle.uniqueSort( results );
                }
            }

            
            if ( outermost ) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }

            return unmatched;
        };

    superMatcher.el = 0;
    return bySet ?
        markFunction( superMatcher ) :
        superMatcher;
}

compile = Sizzle.compile = function( selector, group  ) {
    var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[ expando ][ selector + " " ];

    if ( !cached ) {
        
        if ( !group ) {
            group = tokenize( selector );
        }
        i = group.length;
        while ( i-- ) {
            cached = matcherFromTokens( group[i] );
            if ( cached[ expando ] ) {
                setMatchers.push( cached );
            } else {
                elementMatchers.push( cached );
            }
        }

        
        cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
    }
    return cached;
};

function multipleContexts( selector, contexts, results ) {
    var i = 0,
        len = contexts.length;
    for ( ; i < len; i++ ) {
        Sizzle( selector, contexts[i], results );
    }
    return results;
}

function select( selector, context, results, seed, xml ) {
    var i, tokens, token, type, find,
        match = tokenize( selector ),
        j = match.length;

    if ( !seed ) {
        
        if ( match.length === 1 ) {

            
            tokens = match[0] = match[0].slice( 0 );
            if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                    context.nodeType === 9 && !xml &&
                    Expr.relative[ tokens[1].type ] ) {

                context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
                if ( !context ) {
                    return results;
                }

                selector = selector.slice( tokens.shift().length );
            }

            
            for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
                token = tokens[i];

                
                if ( Expr.relative[ (type = token.type) ] ) {
                    break;
                }
                if ( (find = Expr.find[ type ]) ) {
                    
                    if ( (seed = find(
                        token.matches[0].replace( rbackslash, "" ),
                        rsibling.test( tokens[0].type ) && context.parentNode || context,
                        xml
                    )) ) {

                        
                        tokens.splice( i, 1 );
                        selector = seed.length && tokens.join("");
                        if ( !selector ) {
                            push.apply( results, slice.call( seed, 0 ) );
                            return results;
                        }

                        break;
                    }
                }
            }
        }
    }

    
    
    compile( selector, match )(
        seed,
        context,
        xml,
        results,
        rsibling.test( selector )
    );
    return results;
}

if ( document.querySelectorAll ) {
    (function() {
        var disconnectedMatch,
            oldSelect = select,
            rescape = /'|\\/g,
            rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

            
            
            rbuggyQSA = [ ":focus" ],

            
            
            
            rbuggyMatches = [ ":active" ],
            matches = docElem.matchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.webkitMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector;

        
        
        assert(function( div ) {
            
            
            
            
            
            div.innerHTML = "<select><option selected=''></option></select>";

            
            if ( !div.querySelectorAll("[selected]").length ) {
                rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
            }

            
            
            
            if ( !div.querySelectorAll(":checked").length ) {
                rbuggyQSA.push(":checked");
            }
        });

        assert(function( div ) {

            
            
            div.innerHTML = "<p test=''></p>";
            if ( div.querySelectorAll("[test^='']").length ) {
                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
            }

            
            
            div.innerHTML = "<input type='hidden'/>";
            if ( !div.querySelectorAll(":enabled").length ) {
                rbuggyQSA.push(":enabled", ":disabled");
            }
        });

        
        rbuggyQSA =  new RegExp( rbuggyQSA.join("|") );

        select = function( selector, context, results, seed, xml ) {
            
            
            
            if ( !seed && !xml && !rbuggyQSA.test( selector ) ) {
                var groups, i,
                    old = true,
                    nid = expando,
                    newContext = context,
                    newSelector = context.nodeType === 9 && selector;

                
                
                
                
                if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    groups = tokenize( selector );

                    if ( (old = context.getAttribute("id")) ) {
                        nid = old.replace( rescape, "\\$&" );
                    } else {
                        context.setAttribute( "id", nid );
                    }
                    nid = "[id='" + nid + "'] ";

                    i = groups.length;
                    while ( i-- ) {
                        groups[i] = nid + groups[i].join("");
                    }
                    newContext = rsibling.test( selector ) && context.parentNode || context;
                    newSelector = groups.join(",");
                }

                if ( newSelector ) {
                    try {
                        push.apply( results, slice.call( newContext.querySelectorAll(
                            newSelector
                        ), 0 ) );
                        return results;
                    } catch(qsaError) {
                    } finally {
                        if ( !old ) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }

            return oldSelect( selector, context, results, seed, xml );
        };

        if ( matches ) {
            assert(function( div ) {
                
                
                disconnectedMatch = matches.call( div, "div" );

                
                
                try {
                    matches.call( div, "[test!='']:sizzle" );
                    rbuggyMatches.push( "!=", pseudos );
                } catch ( e ) {}
            });

            
            rbuggyMatches =  new RegExp( rbuggyMatches.join("|") );

            Sizzle.matchesSelector = function( elem, expr ) {
                
                expr = expr.replace( rattributeQuotes, "='$1']" );

                
                if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && !rbuggyQSA.test( expr ) ) {
                    try {
                        var ret = matches.call( elem, expr );

                        
                        if ( ret || disconnectedMatch ||
                                
                                
                                elem.document && elem.document.nodeType !== 11 ) {
                            return ret;
                        }
                    } catch(e) {}
                }

                return Sizzle( expr, null, null, [ elem ] ).length > 0;
            };
        }
    })();
}


Expr.pseudos["nth"] = Expr.pseudos["eq"];


function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();


Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
    rparentsprev = /^(?:parents|prev(?:Until|All))/,
    isSimple = /^.[^:#\[\.,]*$/,
    rneedsContext = jQuery.expr.match.needsContext,
    
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

jQuery.fn.extend({
    find: function( selector ) {
        var i, l, length, n, r, ret,
            self = this;

        if ( typeof selector !== "string" ) {
            return jQuery( selector ).filter(function() {
                for ( i = 0, l = self.length; i < l; i++ ) {
                    if ( jQuery.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            });
        }

        ret = this.pushStack( "", "find", selector );

        for ( i = 0, l = this.length; i < l; i++ ) {
            length = ret.length;
            jQuery.find( selector, this[i], ret );

            if ( i > 0 ) {
                
                for ( n = length; n < ret.length; n++ ) {
                    for ( r = 0; r < length; r++ ) {
                        if ( ret[r] === ret[n] ) {
                            ret.splice(n--, 1);
                            break;
                        }
                    }
                }
            }
        }

        return ret;
    },

    has: function( target ) {
        var i,
            targets = jQuery( target, this ),
            len = targets.length;

        return this.filter(function() {
            for ( i = 0; i < len; i++ ) {
                if ( jQuery.contains( this, targets[i] ) ) {
                    return true;
                }
            }
        });
    },

    not: function( selector ) {
        return this.pushStack( winnow(this, selector, false), "not", selector);
    },

    filter: function( selector ) {
        return this.pushStack( winnow(this, selector, true), "filter", selector );
    },

    is: function( selector ) {
        return !!selector && (
            typeof selector === "string" ?
                
                
                rneedsContext.test( selector ) ?
                    jQuery( selector, this.context ).index( this[0] ) >= 0 :
                    jQuery.filter( selector, this ).length > 0 :
                this.filter( selector ).length > 0 );
    },

    closest: function( selectors, context ) {
        var cur,
            i = 0,
            l = this.length,
            ret = [],
            pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

        for ( ; i < l; i++ ) {
            cur = this[i];

            while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
                if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                    ret.push( cur );
                    break;
                }
                cur = cur.parentNode;
            }
        }

        ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

        return this.pushStack( ret, "closest", selectors );
    },

    
    
    index: function( elem ) {

        
        if ( !elem ) {
            return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
        }

        
        if ( typeof elem === "string" ) {
            return jQuery.inArray( this[0], jQuery( elem ) );
        }

        
        return jQuery.inArray(
            
            elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
        var set = typeof selector === "string" ?
                jQuery( selector, context ) :
                jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
            all = jQuery.merge( this.get(), set );

        return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
            all :
            jQuery.unique( all ) );
    },

    addBack: function( selector ) {
        return this.add( selector == null ?
            this.prevObject : this.prevObject.filter(selector)
        );
    }
});

jQuery.fn.andSelf = jQuery.fn.addBack;



function isDisconnected( node ) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
    do {
        cur = cur[ dir ];
    } while ( cur && cur.nodeType !== 1 );

    return cur;
}

jQuery.each({
    parent: function( elem ) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
        return jQuery.dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "parentNode", until );
    },
    next: function( elem ) {
        return sibling( elem, "nextSibling" );
    },
    prev: function( elem ) {
        return sibling( elem, "previousSibling" );
    },
    nextAll: function( elem ) {
        return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
        return jQuery.dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
        return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
    },
    children: function( elem ) {
        return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
        return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
            jQuery.merge( [], elem.childNodes );
    }
}, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
        var ret = jQuery.map( this, fn, until );

        if ( !runtil.test( name ) ) {
            selector = until;
        }

        if ( selector && typeof selector === "string" ) {
            ret = jQuery.filter( selector, ret );
        }

        ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

        if ( this.length > 1 && rparentsprev.test( name ) ) {
            ret = ret.reverse();
        }

        return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
    };
});

jQuery.extend({
    filter: function( expr, elems, not ) {
        if ( not ) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 ?
            jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
            jQuery.find.matches(expr, elems);
    },

    dir: function( elem, dir, until ) {
        var matched = [],
            cur = elem[ dir ];

        while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
            if ( cur.nodeType === 1 ) {
                matched.push( cur );
            }
            cur = cur[dir];
        }
        return matched;
    },

    sibling: function( n, elem ) {
        var r = [];

        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                r.push( n );
            }
        }

        return r;
    }
});


function winnow( elements, qualifier, keep ) {

    
    
    qualifier = qualifier || 0;

    if ( jQuery.isFunction( qualifier ) ) {
        return jQuery.grep(elements, function( elem, i ) {
            var retVal = !!qualifier.call( elem, i, elem );
            return retVal === keep;
        });

    } else if ( qualifier.nodeType ) {
        return jQuery.grep(elements, function( elem, i ) {
            return ( elem === qualifier ) === keep;
        });

    } else if ( typeof qualifier === "string" ) {
        var filtered = jQuery.grep(elements, function( elem ) {
            return elem.nodeType === 1;
        });

        if ( isSimple.test( qualifier ) ) {
            return jQuery.filter(qualifier, filtered, !keep);
        } else {
            qualifier = jQuery.filter( qualifier, filtered );
        }
    }

    return jQuery.grep(elements, function( elem, i ) {
        return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
    });
}
function createSafeFragment( document ) {
    var list = nodeNames.split( "|" ),
    safeFrag = document.createDocumentFragment();

    if ( safeFrag.createElement ) {
        while ( list.length ) {
            safeFrag.createElement(
                list.pop()
            );
        }
    }
    return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style|link)/i,
    rnocache = /<(?:script|object|embed|option|style)/i,
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
    rcheckableType = /^(?:checkbox|radio)$/,
    
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
    wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    },
    safeFragment = createSafeFragment( document ),
    fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;



if ( !jQuery.support.htmlSerialize ) {
    wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
    text: function( value ) {
        return jQuery.access( this, function( value ) {
            return value === undefined ?
                jQuery.text( this ) :
                this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
        }, null, value, arguments.length );
    },

    wrapAll: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapAll( html.call(this, i) );
            });
        }

        if ( this[0] ) {
            
            var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

            if ( this[0].parentNode ) {
                wrap.insertBefore( this[0] );
            }

            wrap.map(function() {
                var elem = this;

                while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                    elem = elem.firstChild;
                }

                return elem;
            }).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapInner( html.call(this, i) );
            });
        }

        return this.each(function() {
            var self = jQuery( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        });
    },

    wrap: function( html ) {
        var isFunction = jQuery.isFunction( html );

        return this.each(function(i) {
            jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
        });
    },

    unwrap: function() {
        return this.parent().each(function() {
            if ( !jQuery.nodeName( this, "body" ) ) {
                jQuery( this ).replaceWith( this.childNodes );
            }
        }).end();
    },

    append: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 || this.nodeType === 11 ) {
                this.appendChild( elem );
            }
        });
    },

    prepend: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 || this.nodeType === 11 ) {
                this.insertBefore( elem, this.firstChild );
            }
        });
    },

    before: function() {
        if ( !isDisconnected( this[0] ) ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this );
            });
        }

        if ( arguments.length ) {
            var set = jQuery.clean( arguments );
            return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
        }
    },

    after: function() {
        if ( !isDisconnected( this[0] ) ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this.nextSibling );
            });
        }

        if ( arguments.length ) {
            var set = jQuery.clean( arguments );
            return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
        }
    },

    
    remove: function( selector, keepData ) {
        var elem,
            i = 0;

        for ( ; (elem = this[i]) != null; i++ ) {
            if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                if ( !keepData && elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                    jQuery.cleanData( [ elem ] );
                }

                if ( elem.parentNode ) {
                    elem.parentNode.removeChild( elem );
                }
            }
        }

        return this;
    },

    empty: function() {
        var elem,
            i = 0;

        for ( ; (elem = this[i]) != null; i++ ) {
            
            if ( elem.nodeType === 1 ) {
                jQuery.cleanData( elem.getElementsByTagName("*") );
            }

            
            while ( elem.firstChild ) {
                elem.removeChild( elem.firstChild );
            }
        }

        return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map( function () {
            return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
        });
    },

    html: function( value ) {
        return jQuery.access( this, function( value ) {
            var elem = this[0] || {},
                i = 0,
                l = this.length;

            if ( value === undefined ) {
                return elem.nodeType === 1 ?
                    elem.innerHTML.replace( rinlinejQuery, "" ) :
                    undefined;
            }

            
            if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
                ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

                value = value.replace( rxhtmlTag, "<$1></$2>" );

                try {
                    for (; i < l; i++ ) {
                        
                        elem = this[i] || {};
                        if ( elem.nodeType === 1 ) {
                            jQuery.cleanData( elem.getElementsByTagName( "*" ) );
                            elem.innerHTML = value;
                        }
                    }

                    elem = 0;

                
                } catch(e) {}
            }

            if ( elem ) {
                this.empty().append( value );
            }
        }, null, value, arguments.length );
    },

    replaceWith: function( value ) {
        if ( !isDisconnected( this[0] ) ) {
            
            
            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this), old = self.html();
                    self.replaceWith( value.call( this, i, old ) );
                });
            }

            if ( typeof value !== "string" ) {
                value = jQuery( value ).detach();
            }

            return this.each(function() {
                var next = this.nextSibling,
                    parent = this.parentNode;

                jQuery( this ).remove();

                if ( next ) {
                    jQuery(next).before( value );
                } else {
                    jQuery(parent).append( value );
                }
            });
        }

        return this.length ?
            this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
            this;
    },

    detach: function( selector ) {
        return this.remove( selector, true );
    },

    domManip: function( args, table, callback ) {

        
        args = [].concat.apply( [], args );

        var results, first, fragment, iNoClone,
            i = 0,
            value = args[0],
            scripts = [],
            l = this.length;

        
        if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
            return this.each(function() {
                jQuery(this).domManip( args, table, callback );
            });
        }

        if ( jQuery.isFunction(value) ) {
            return this.each(function(i) {
                var self = jQuery(this);
                args[0] = value.call( this, i, table ? self.html() : undefined );
                self.domManip( args, table, callback );
            });
        }

        if ( this[0] ) {
            results = jQuery.buildFragment( args, this, scripts );
            fragment = results.fragment;
            first = fragment.firstChild;

            if ( fragment.childNodes.length === 1 ) {
                fragment = first;
            }

            if ( first ) {
                table = table && jQuery.nodeName( first, "tr" );

                
                
                
                for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
                    callback.call(
                        table && jQuery.nodeName( this[i], "table" ) ?
                            findOrAppend( this[i], "tbody" ) :
                            this[i],
                        i === iNoClone ?
                            fragment :
                            jQuery.clone( fragment, true, true )
                    );
                }
            }

            
            fragment = first = null;

            if ( scripts.length ) {
                jQuery.each( scripts, function( i, elem ) {
                    if ( elem.src ) {
                        if ( jQuery.ajax ) {
                            jQuery.ajax({
                                url: elem.src,
                                type: "GET",
                                dataType: "script",
                                async: false,
                                global: false,
                                "throws": true
                            });
                        } else {
                            jQuery.error("no ajax");
                        }
                    } else {
                        jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
                    }

                    if ( elem.parentNode ) {
                        elem.parentNode.removeChild( elem );
                    }
                });
            }
        }

        return this;
    }
});

function findOrAppend( elem, tag ) {
    return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

    if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
        return;
    }

    var type, i, l,
        oldData = jQuery._data( src ),
        curData = jQuery._data( dest, oldData ),
        events = oldData.events;

    if ( events ) {
        delete curData.handle;
        curData.events = {};

        for ( type in events ) {
            for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                jQuery.event.add( dest, type, events[ type ][ i ] );
            }
        }
    }

    
    if ( curData.data ) {
        curData.data = jQuery.extend( {}, curData.data );
    }
}

function cloneFixAttributes( src, dest ) {
    var nodeName;

    
    if ( dest.nodeType !== 1 ) {
        return;
    }

    
    
    if ( dest.clearAttributes ) {
        dest.clearAttributes();
    }

    
    
    if ( dest.mergeAttributes ) {
        dest.mergeAttributes( src );
    }

    nodeName = dest.nodeName.toLowerCase();

    if ( nodeName === "object" ) {
        
        
        if ( dest.parentNode ) {
            dest.outerHTML = src.outerHTML;
        }

        
        
        
        
        if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
            dest.innerHTML = src.innerHTML;
        }

    } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
        
        
        

        dest.defaultChecked = dest.checked = src.checked;

        
        
        if ( dest.value !== src.value ) {
            dest.value = src.value;
        }

    
    
    } else if ( nodeName === "option" ) {
        dest.selected = src.defaultSelected;

    
    
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
        dest.defaultValue = src.defaultValue;

    
    } else if ( nodeName === "script" && dest.text !== src.text ) {
        dest.text = src.text;
    }

    
    
    dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
    var fragment, cacheable, cachehit,
        first = args[ 0 ];

    
    
    
    context = context || document;
    context = !context.nodeType && context[0] || context;
    context = context.ownerDocument || context;

    
    
    
    
    
    if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
        first.charAt(0) === "<" && !rnocache.test( first ) &&
        (jQuery.support.checkClone || !rchecked.test( first )) &&
        (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

        
        cacheable = true;
        fragment = jQuery.fragments[ first ];
        cachehit = fragment !== undefined;
    }

    if ( !fragment ) {
        fragment = context.createDocumentFragment();
        jQuery.clean( args, context, fragment, scripts );

        
        
        if ( cacheable ) {
            jQuery.fragments[ first ] = cachehit && fragment;
        }
    }

    return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
        var elems,
            i = 0,
            ret = [],
            insert = jQuery( selector ),
            l = insert.length,
            parent = this.length === 1 && this[0].parentNode;

        if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
            insert[ original ]( this[0] );
            return this;
        } else {
            for ( ; i < l; i++ ) {
                elems = ( i > 0 ? this.clone(true) : this ).get();
                jQuery( insert[i] )[ original ]( elems );
                ret = ret.concat( elems );
            }

            return this.pushStack( ret, name, insert.selector );
        }
    };
});

function getAll( elem ) {
    if ( typeof elem.getElementsByTagName !== "undefined" ) {
        return elem.getElementsByTagName( "*" );

    } else if ( typeof elem.querySelectorAll !== "undefined" ) {
        return elem.querySelectorAll( "*" );

    } else {
        return [];
    }
}


function fixDefaultChecked( elem ) {
    if ( rcheckableType.test( elem.type ) ) {
        elem.defaultChecked = elem.checked;
    }
}

jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
        var srcElements,
            destElements,
            i,
            clone;

        if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
            clone = elem.cloneNode( true );

        
        } else {
            fragmentDiv.innerHTML = elem.outerHTML;
            fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
        }

        if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
            
            
            
            
            

            cloneFixAttributes( elem, clone );

            
            srcElements = getAll( elem );
            destElements = getAll( clone );

            
            
            
            for ( i = 0; srcElements[i]; ++i ) {
                
                if ( destElements[i] ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }
            }
        }

        
        if ( dataAndEvents ) {
            cloneCopyEvent( elem, clone );

            if ( deepDataAndEvents ) {
                srcElements = getAll( elem );
                destElements = getAll( clone );

                for ( i = 0; srcElements[i]; ++i ) {
                    cloneCopyEvent( srcElements[i], destElements[i] );
                }
            }
        }

        srcElements = destElements = null;

        
        return clone;
    },

    clean: function( elems, context, fragment, scripts ) {
        var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
            safe = context === document && safeFragment,
            ret = [];

        
        if ( !context || typeof context.createDocumentFragment === "undefined" ) {
            context = document;
        }

        
        for ( i = 0; (elem = elems[i]) != null; i++ ) {
            if ( typeof elem === "number" ) {
                elem += "";
            }

            if ( !elem ) {
                continue;
            }

            
            if ( typeof elem === "string" ) {
                if ( !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );
                } else {
                    
                    safe = safe || createSafeFragment( context );
                    div = context.createElement("div");
                    safe.appendChild( div );

                    
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    
                    tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
                    wrap = wrapMap[ tag ] || wrapMap._default;
                    depth = wrap[0];
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    
                    if ( !jQuery.support.tbody ) {

                        
                        hasBody = rtbody.test(elem);
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }
                    }

                    
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = div.childNodes;

                    
                    div.parentNode.removeChild( div );
                }
            }

            if ( elem.nodeType ) {
                ret.push( elem );
            } else {
                jQuery.merge( ret, elem );
            }
        }

        
        if ( div ) {
            elem = div = safe = null;
        }

        
        
        if ( !jQuery.support.appendChecked ) {
            for ( i = 0; (elem = ret[i]) != null; i++ ) {
                if ( jQuery.nodeName( elem, "input" ) ) {
                    fixDefaultChecked( elem );
                } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
                    jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
                }
            }
        }

        
        if ( fragment ) {
            
            handleScript = function( elem ) {
                
                if ( !elem.type || rscriptType.test( elem.type ) ) {
                    
                    
                    return scripts ?
                        scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                        fragment.appendChild( elem );
                }
            };

            for ( i = 0; (elem = ret[i]) != null; i++ ) {
                
                if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
                    
                    fragment.appendChild( elem );
                    if ( typeof elem.getElementsByTagName !== "undefined" ) {
                        
                        jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

                        
                        ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                        i += jsTags.length;
                    }
                }
            }
        }

        return ret;
    },

    cleanData: function( elems,  acceptData ) {
        var data, id, elem, type,
            i = 0,
            internalKey = jQuery.expando,
            cache = jQuery.cache,
            deleteExpando = jQuery.support.deleteExpando,
            special = jQuery.event.special;

        for ( ; (elem = elems[i]) != null; i++ ) {

            if ( acceptData || jQuery.acceptData( elem ) ) {

                id = elem[ internalKey ];
                data = id && cache[ id ];

                if ( data ) {
                    if ( data.events ) {
                        for ( type in data.events ) {
                            if ( special[ type ] ) {
                                jQuery.event.remove( elem, type );

                            
                            } else {
                                jQuery.removeEvent( elem, type, data.handle );
                            }
                        }
                    }

                    
                    if ( cache[ id ] ) {

                        delete cache[ id ];

                        
                        
                        
                        if ( deleteExpando ) {
                            delete elem[ internalKey ];

                        } else if ( elem.removeAttribute ) {
                            elem.removeAttribute( internalKey );

                        } else {
                            elem[ internalKey ] = null;
                        }

                        jQuery.deletedIds.push( id );
                    }
                }
            }
        }
    }
});

(function() {

var matched, browser;




jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}


if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
    function jQuerySub( selector, context ) {
        return new jQuerySub.fn.init( selector, context );
    }
    jQuery.extend( true, jQuerySub, this );
    jQuerySub.superclass = this;
    jQuerySub.fn = jQuerySub.prototype = this();
    jQuerySub.fn.constructor = jQuerySub;
    jQuerySub.sub = this.sub;
    jQuerySub.fn.init = function init( selector, context ) {
        if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
            context = jQuerySub( context );
        }

        return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
    };
    jQuerySub.fn.init.prototype = jQuerySub.fn;
    var rootjQuerySub = jQuerySub(document);
    return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
    ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    rposition = /^(top|right|bottom|left)$/,
    
    
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    rmargin = /^margin/,
    rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
    rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
    rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
    elemdisplay = { BODY: "block" },

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssNormalTransform = {
        letterSpacing: 0,
        fontWeight: 400
    },

    cssExpand = [ "Top", "Right", "Bottom", "Left" ],
    cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

    eventsToggle = jQuery.fn.toggle;


function vendorPropName( style, name ) {

    
    if ( name in style ) {
        return name;
    }

    
    var capName = name.charAt(0).toUpperCase() + name.slice(1),
        origName = name,
        i = cssPrefixes.length;

    while ( i-- ) {
        name = cssPrefixes[ i ] + capName;
        if ( name in style ) {
            return name;
        }
    }

    return origName;
}

function isHidden( elem, el ) {
    elem = el || elem;
    return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
    var elem, display,
        values = [],
        index = 0,
        length = elements.length;

    for ( ; index < length; index++ ) {
        elem = elements[ index ];
        if ( !elem.style ) {
            continue;
        }
        values[ index ] = jQuery._data( elem, "olddisplay" );
        if ( show ) {
            
            
            if ( !values[ index ] && elem.style.display === "none" ) {
                elem.style.display = "";
            }

            
            
            
            if ( elem.style.display === "" && isHidden( elem ) ) {
                values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
            }
        } else {
            display = curCSS( elem, "display" );

            if ( !values[ index ] && display !== "none" ) {
                jQuery._data( elem, "olddisplay", display );
            }
        }
    }

    
    
    for ( index = 0; index < length; index++ ) {
        elem = elements[ index ];
        if ( !elem.style ) {
            continue;
        }
        if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
            elem.style.display = show ? values[ index ] || "" : "none";
        }
    }

    return elements;
}

jQuery.fn.extend({
    css: function( name, value ) {
        return jQuery.access( this, function( elem, name, value ) {
            return value !== undefined ?
                jQuery.style( elem, name, value ) :
                jQuery.css( elem, name );
        }, name, value, arguments.length > 1 );
    },
    show: function() {
        return showHide( this, true );
    },
    hide: function() {
        return showHide( this );
    },
    toggle: function( state, fn2 ) {
        var bool = typeof state === "boolean";

        if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
            return eventsToggle.apply( this, arguments );
        }

        return this.each(function() {
            if ( bool ? state : isHidden( this ) ) {
                jQuery( this ).show();
            } else {
                jQuery( this ).hide();
            }
        });
    }
});

jQuery.extend({
    
    
    cssHooks: {
        opacity: {
            get: function( elem, computed ) {
                if ( computed ) {
                    
                    var ret = curCSS( elem, "opacity" );
                    return ret === "" ? "1" : ret;

                }
            }
        }
    },

    
    cssNumber: {
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },

    
    
    cssProps: {
        
        "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },

    
    style: function( elem, name, value, extra ) {
        
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        
        var ret, type, hooks,
            origName = jQuery.camelCase( name ),
            style = elem.style;

        name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

        
        
        hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

        
        if ( value !== undefined ) {
            type = typeof value;

            
            if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                
                type = "number";
            }

            
            if ( value == null || type === "number" && isNaN( value ) ) {
                return;
            }

            
            if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                value += "px";
            }

            
            if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
                
                
                try {
                    style[ name ] = value;
                } catch(e) {}
            }

        } else {
            
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                return ret;
            }

            
            return style[ name ];
        }
    },

    css: function( elem, name, numeric, extra ) {
        var val, num, hooks,
            origName = jQuery.camelCase( name );

        
        name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

        
        
        hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

        
        if ( hooks && "get" in hooks ) {
            val = hooks.get( elem, true, extra );
        }

        
        if ( val === undefined ) {
            val = curCSS( elem, name );
        }

        
        if ( val === "normal" && name in cssNormalTransform ) {
            val = cssNormalTransform[ name ];
        }

        
        if ( numeric || extra !== undefined ) {
            num = parseFloat( val );
            return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
        }
        return val;
    },

    
    swap: function( elem, options, callback ) {
        var ret, name,
            old = {};

        
        for ( name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        ret = callback.call( elem );

        
        for ( name in options ) {
            elem.style[ name ] = old[ name ];
        }

        return ret;
    }
});



if ( window.getComputedStyle ) {
    curCSS = function( elem, name ) {
        var ret, width, minWidth, maxWidth,
            computed = window.getComputedStyle( elem, null ),
            style = elem.style;

        if ( computed ) {

            
            ret = computed.getPropertyValue( name ) || computed[ name ];

            if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                ret = jQuery.style( elem, name );
            }

            
            
            
            
            if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;

                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return ret;
    };
} else if ( document.documentElement.currentStyle ) {
    curCSS = function( elem, name ) {
        var left, rsLeft,
            ret = elem.currentStyle && elem.currentStyle[ name ],
            style = elem.style;

        
        
        if ( ret == null && style && style[ name ] ) {
            ret = style[ name ];
        }

        
        

        
        
        
        
        if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

            
            left = style.left;
            rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

            
            if ( rsLeft ) {
                elem.runtimeStyle.left = elem.currentStyle.left;
            }
            style.left = name === "fontSize" ? "1em" : ret;
            ret = style.pixelLeft + "px";

            
            style.left = left;
            if ( rsLeft ) {
                elem.runtimeStyle.left = rsLeft;
            }
        }

        return ret === "" ? "auto" : ret;
    };
}

function setPositiveNumber( elem, value, subtract ) {
    var matches = rnumsplit.exec( value );
    return matches ?
            Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
            value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
    var i = extra === ( isBorderBox ? "border" : "content" ) ?
        
        4 :
        
        name === "width" ? 1 : 0,

        val = 0;

    for ( ; i < 4; i += 2 ) {
        
        if ( extra === "margin" ) {
            
            
            val += jQuery.css( elem, extra + cssExpand[ i ], true );
        }

        
        if ( isBorderBox ) {
            
            if ( extra === "content" ) {
                val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
            }

            
            if ( extra !== "margin" ) {
                val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
            }
        } else {
            
            val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

            
            if ( extra !== "padding" ) {
                val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
            }
        }
    }

    return val;
}

function getWidthOrHeight( elem, name, extra ) {

    
    var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        valueIsBorderBox = true,
        isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

    
    
    
    if ( val <= 0 || val == null ) {
        
        val = curCSS( elem, name );
        if ( val < 0 || val == null ) {
            val = elem.style[ name ];
        }

        
        if ( rnumnonpx.test(val) ) {
            return val;
        }

        
        
        valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

        
        val = parseFloat( val ) || 0;
    }

    
    return ( val +
        augmentWidthOrHeight(
            elem,
            name,
            extra || ( isBorderBox ? "border" : "content" ),
            valueIsBorderBox
        )
    ) + "px";
}



function css_defaultDisplay( nodeName ) {
    if ( elemdisplay[ nodeName ] ) {
        return elemdisplay[ nodeName ];
    }

    var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
        display = elem.css("display");
    elem.remove();

    
    
    if ( display === "none" || display === "" ) {
        
        iframe = document.body.appendChild(
            iframe || jQuery.extend( document.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            })
        );

        
        
        
        if ( !iframeDoc || !iframe.createElement ) {
            iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
            iframeDoc.write("<!doctype html><html><body>");
            iframeDoc.close();
        }

        elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

        display = curCSS( elem, "display" );
        document.body.removeChild( iframe );
    }

    
    elemdisplay[ nodeName ] = display;

    return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
    jQuery.cssHooks[ name ] = {
        get: function( elem, computed, extra ) {
            if ( computed ) {
                
                
                if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
                    return jQuery.swap( elem, cssShow, function() {
                        return getWidthOrHeight( elem, name, extra );
                    });
                } else {
                    return getWidthOrHeight( elem, name, extra );
                }
            }
        },

        set: function( elem, value, extra ) {
            return setPositiveNumber( elem, value, extra ?
                augmentWidthOrHeight(
                    elem,
                    name,
                    extra,
                    jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
                ) : 0
            );
        }
    };
});

if ( !jQuery.support.opacity ) {
    jQuery.cssHooks.opacity = {
        get: function( elem, computed ) {
            
            return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
                computed ? "1" : "";
        },

        set: function( elem, value ) {
            var style = elem.style,
                currentStyle = elem.currentStyle,
                opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                filter = currentStyle && currentStyle.filter || style.filter || "";

            
            
            style.zoom = 1;

            
            if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
                style.removeAttribute ) {

                
                
                
                style.removeAttribute( "filter" );

                
                if ( currentStyle && !currentStyle.filter ) {
                    return;
                }
            }

            
            style.filter = ralpha.test( filter ) ?
                filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
        }
    };
}



jQuery(function() {
    if ( !jQuery.support.reliableMarginRight ) {
        jQuery.cssHooks.marginRight = {
            get: function( elem, computed ) {
                
                
                return jQuery.swap( elem, { "display": "inline-block" }, function() {
                    if ( computed ) {
                        return curCSS( elem, "marginRight" );
                    }
                });
            }
        };
    }

    
    
    
    if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
        jQuery.each( [ "top", "left" ], function( i, prop ) {
            jQuery.cssHooks[ prop ] = {
                get: function( elem, computed ) {
                    if ( computed ) {
                        var ret = curCSS( elem, prop );
                        
                        return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
                    }
                }
            };
        });
    }

});

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
        return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
    };

    jQuery.expr.filters.visible = function( elem ) {
        return !jQuery.expr.filters.hidden( elem );
    };
}


jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
}, function( prefix, suffix ) {
    jQuery.cssHooks[ prefix + suffix ] = {
        expand: function( value ) {
            var i,

                
                parts = typeof value === "string" ? value.split(" ") : [ value ],
                expanded = {};

            for ( i = 0; i < 4; i++ ) {
                expanded[ prefix + cssExpand[ i ] + suffix ] =
                    parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
            }

            return expanded;
        }
    };

    if ( !rmargin.test( prefix ) ) {
        jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    }
});
var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
    serialize: function() {
        return jQuery.param( this.serializeArray() );
    },
    serializeArray: function() {
        return this.map(function(){
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        })
        .filter(function(){
            return this.name && !this.disabled &&
                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                    rinput.test( this.type ) );
        })
        .map(function( i, elem ){
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val, i ){
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
});



jQuery.param = function( a, traditional ) {
    var prefix,
        s = [],
        add = function( key, value ) {
            
            value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
            s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
        };

    
    if ( traditional === undefined ) {
        traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }

    
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
        
        jQuery.each( a, function() {
            add( this.name, this.value );
        });

    } else {
        
        
        for ( prefix in a ) {
            buildParams( prefix, a[ prefix ], traditional, add );
        }
    }

    
    return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
    var name;

    if ( jQuery.isArray( obj ) ) {
        
        jQuery.each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {
                
                add( prefix, v );

            } else {
                
                
                
                
                
                
                
                buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
            }
        });

    } else if ( !traditional && jQuery.type( obj ) === "object" ) {
        
        for ( name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        }

    } else {
        
        add( prefix, obj );
    }
}
var
    
    ajaxLocParts,
    ajaxLocation,

    rhash = /#.*$/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, 
    
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

    
    _load = jQuery.fn.load,

    








    prefilters = {},

    




    transports = {},

    
    allTypes = ["*/"] + ["*"];



try {
    ajaxLocation = location.href;
} catch( e ) {
    
    
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}


ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];


function addToPrefiltersOrTransports( structure ) {

    
    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        var dataType, list, placeBefore,
            dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
            i = 0,
            length = dataTypes.length;

        if ( jQuery.isFunction( func ) ) {
            
            for ( ; i < length; i++ ) {
                dataType = dataTypes[ i ];
                
                
                placeBefore = /^\+/.test( dataType );
                if ( placeBefore ) {
                    dataType = dataType.substr( 1 ) || "*";
                }
                list = structure[ dataType ] = structure[ dataType ] || [];
                
                list[ placeBefore ? "unshift" : "push" ]( func );
            }
        }
    };
}


function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
        dataType , inspected  ) {

    dataType = dataType || options.dataTypes[ 0 ];
    inspected = inspected || {};

    inspected[ dataType ] = true;

    var selection,
        list = structure[ dataType ],
        i = 0,
        length = list ? list.length : 0,
        executeOnly = ( structure === prefilters );

    for ( ; i < length && ( executeOnly || !selection ); i++ ) {
        selection = list[ i ]( options, originalOptions, jqXHR );
        
        
        if ( typeof selection === "string" ) {
            if ( !executeOnly || inspected[ selection ] ) {
                selection = undefined;
            } else {
                options.dataTypes.unshift( selection );
                selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
            }
        }
    }
    
    
    if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
        selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
    }
    
    
    return selection;
}




function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for ( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        jQuery.extend( true, target, deep );
    }
}

jQuery.fn.load = function( url, params, callback ) {
    if ( typeof url !== "string" && _load ) {
        return _load.apply( this, arguments );
    }

    
    if ( !this.length ) {
        return this;
    }

    var selector, type, response,
        self = this,
        off = url.indexOf(" ");

    if ( off >= 0 ) {
        selector = url.slice( off, url.length );
        url = url.slice( 0, off );
    }

    
    if ( jQuery.isFunction( params ) ) {

        
        callback = params;
        params = undefined;

    
    } else if ( params && typeof params === "object" ) {
        type = "POST";
    }

    
    jQuery.ajax({
        url: url,

        
        type: type,
        dataType: "html",
        data: params,
        complete: function( jqXHR, status ) {
            if ( callback ) {
                self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
            }
        }
    }).done(function( responseText ) {

        
        response = arguments;

        
        self.html( selector ?

            
            jQuery("<div>")

                
                
                .append( responseText.replace( rscript, "" ) )

                
                .find( selector ) :

            
            responseText );

    });

    return this;
};


jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
    jQuery.fn[ o ] = function( f ){
        return this.on( o, f );
    };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
});

jQuery.extend({

    getScript: function( url, callback ) {
        return jQuery.get( url, undefined, callback, "script" );
    },

    getJSON: function( url, data, callback ) {
        return jQuery.get( url, data, callback, "json" );
    },

    
    
    
    ajaxSetup: function( target, settings ) {
        if ( settings ) {
            
            ajaxExtend( target, jQuery.ajaxSettings );
        } else {
            
            settings = target;
            target = jQuery.ajaxSettings;
        }
        ajaxExtend( target, settings );
        return target;
    },

    ajaxSettings: {
        url: ajaxLocation,
        isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
        global: true,
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        processData: true,
        async: true,
        











        accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            text: "text/plain",
            json: "application/json, text/javascript",
            "*": allTypes
        },

        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText"
        },

        
        
        
        converters: {

            
            "* text": window.String,

            
            "text html": true,

            
            "text json": jQuery.parseJSON,

            
            "text xml": jQuery.parseXML
        },

        
        
        
        
        flatOptions: {
            context: true,
            url: true
        }
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    
    ajax: function( url, options ) {

        
        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        
        options = options || {};

        var 
            ifModifiedKey,
            
            responseHeadersString,
            responseHeaders,
            
            transport,
            
            timeoutTimer,
            
            parts,
            
            fireGlobals,
            
            i,
            
            s = jQuery.ajaxSetup( {}, options ),
            
            callbackContext = s.context || s,
            
            
            
            globalEventContext = callbackContext !== s &&
                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                        jQuery( callbackContext ) : jQuery.event,
            
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks( "once memory" ),
            
            statusCode = s.statusCode || {},
            
            requestHeaders = {},
            requestHeadersNames = {},
            
            state = 0,
            
            strAbort = "canceled",
            
            jqXHR = {

                readyState: 0,

                
                setRequestHeader: function( name, value ) {
                    if ( !state ) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                
                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match === undefined ? null : match;
                },

                
                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                
                abort: function( statusText ) {
                    statusText = statusText || strAbort;
                    if ( transport ) {
                        transport.abort( statusText );
                    }
                    done( 0, statusText );
                    return this;
                }
            };

        
        
        
        function done( status, nativeStatusText, responses, headers ) {
            var isSuccess, success, error, response, modified,
                statusText = nativeStatusText;

            
            if ( state === 2 ) {
                return;
            }

            
            state = 2;

            
            if ( timeoutTimer ) {
                clearTimeout( timeoutTimer );
            }

            
            
            transport = undefined;

            
            responseHeadersString = headers || "";

            
            jqXHR.readyState = status > 0 ? 4 : 0;

            
            if ( responses ) {
                response = ajaxHandleResponses( s, jqXHR, responses );
            }

            
            if ( status >= 200 && status < 300 || status === 304 ) {

                
                if ( s.ifModified ) {

                    modified = jqXHR.getResponseHeader("Last-Modified");
                    if ( modified ) {
                        jQuery.lastModified[ ifModifiedKey ] = modified;
                    }
                    modified = jqXHR.getResponseHeader("Etag");
                    if ( modified ) {
                        jQuery.etag[ ifModifiedKey ] = modified;
                    }
                }

                
                if ( status === 304 ) {

                    statusText = "notmodified";
                    isSuccess = true;

                
                } else {

                    isSuccess = ajaxConvert( s, response );
                    statusText = isSuccess.state;
                    success = isSuccess.data;
                    error = isSuccess.error;
                    isSuccess = !error;
                }
            } else {
                
                
                error = statusText;
                if ( !statusText || status ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            
            jqXHR.status = status;
            jqXHR.statusText = ( nativeStatusText || statusText ) + "";

            
            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            
            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
            }

            
            completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                
                if ( !( --jQuery.active ) ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }
        }

        
        deferred.promise( jqXHR );
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;
        jqXHR.complete = completeDeferred.add;

        
        jqXHR.statusCode = function( map ) {
            if ( map ) {
                var tmp;
                if ( state < 2 ) {
                    for ( tmp in map ) {
                        statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                    }
                } else {
                    tmp = map[ jqXHR.status ];
                    jqXHR.always( tmp );
                }
            }
            return this;
        };

        
        
        
        s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

        
        s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

        
        if ( s.crossDomain == null ) {
            parts = rurl.exec( s.url.toLowerCase() );
            s.crossDomain = !!( parts &&
                ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
            );
        }

        
        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = jQuery.param( s.data, s.traditional );
        }

        
        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        
        if ( state === 2 ) {
            return jqXHR;
        }

        
        fireGlobals = s.global;

        
        s.type = s.type.toUpperCase();

        
        s.hasContent = !rnoContent.test( s.type );

        
        if ( fireGlobals && jQuery.active++ === 0 ) {
            jQuery.event.trigger( "ajaxStart" );
        }

        
        if ( !s.hasContent ) {

            
            if ( s.data ) {
                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                
                delete s.data;
            }

            
            ifModifiedKey = s.url;

            
            if ( s.cache === false ) {

                var ts = jQuery.now(),
                    
                    ret = s.url.replace( rts, "$1_=" + ts );

                
                s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
            }
        }

        
        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        
        if ( s.ifModified ) {
            ifModifiedKey = ifModifiedKey || s.url;
            if ( jQuery.lastModified[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
            }
            if ( jQuery.etag[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
            }
        }

        
        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        
        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        
        if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                
                return jqXHR.abort();

        }

        
        strAbort = "abort";

        
        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        
        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        
        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;
            
            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }
            
            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = setTimeout( function(){
                    jqXHR.abort( "timeout" );
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch (e) {
                
                if ( state < 2 ) {
                    done( -1, e );
                
                } else {
                    throw e;
                }
            }
        }

        return jqXHR;
    },

    
    active: 0,

    
    lastModified: {},
    etag: {}

});






function ajaxHandleResponses( s, jqXHR, responses ) {

    var ct, type, finalDataType, firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes,
        responseFields = s.responseFields;

    
    for ( type in responseFields ) {
        if ( type in responses ) {
            jqXHR[ responseFields[type] ] = responses[ type ];
        }
    }

    
    while( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
        }
    }

    
    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    
    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {
        
        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }
        
        finalDataType = finalDataType || firstDataType;
    }

    
    
    
    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}


function ajaxConvert( s, response ) {

    var conv, conv2, current, tmp,
        
        dataTypes = s.dataTypes.slice(),
        prev = dataTypes[ 0 ],
        converters = {},
        i = 0;

    
    if ( s.dataFilter ) {
        response = s.dataFilter( response, s.dataType );
    }

    
    if ( dataTypes[ 1 ] ) {
        for ( conv in s.converters ) {
            converters[ conv.toLowerCase() ] = s.converters[ conv ];
        }
    }

    
    for ( ; (current = dataTypes[++i]); ) {

        
        if ( current !== "*" ) {

            
            if ( prev !== "*" && prev !== current ) {

                
                conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                
                if ( !conv ) {
                    for ( conv2 in converters ) {

                        
                        tmp = conv2.split(" ");
                        if ( tmp[ 1 ] === current ) {

                            
                            conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                converters[ "* " + tmp[ 0 ] ];
                            if ( conv ) {
                                
                                if ( conv === true ) {
                                    conv = converters[ conv2 ];

                                
                                } else if ( converters[ conv2 ] !== true ) {
                                    current = tmp[ 0 ];
                                    dataTypes.splice( i--, 0, current );
                                }

                                break;
                            }
                        }
                    }
                }

                
                if ( conv !== true ) {

                    
                    if ( conv && s["throws"] ) {
                        response = conv( response );
                    } else {
                        try {
                            response = conv( response );
                        } catch ( e ) {
                            return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                        }
                    }
                }
            }

            
            prev = current;
        }
    }

    return { state: "success", data: response };
}
var oldCallbacks = [],
    rquestion = /\?/,
    rjsonp = /(=)\?(?=&|$)|\?\?/,
    nonce = jQuery.now();


jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
        this[ callback ] = true;
        return callback;
    }
});


jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var callbackName, overwritten, responseContainer,
        data = s.data,
        url = s.url,
        hasCallback = s.jsonp !== false,
        replaceInUrl = hasCallback && rjsonp.test( url ),
        replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
            !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
            rjsonp.test( data );

    
    if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

        
        callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
            s.jsonpCallback() :
            s.jsonpCallback;
        overwritten = window[ callbackName ];

        
        if ( replaceInUrl ) {
            s.url = url.replace( rjsonp, "$1" + callbackName );
        } else if ( replaceInData ) {
            s.data = data.replace( rjsonp, "$1" + callbackName );
        } else if ( hasCallback ) {
            s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
        }

        
        s.converters["script json"] = function() {
            if ( !responseContainer ) {
                jQuery.error( callbackName + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        
        s.dataTypes[ 0 ] = "json";

        
        window[ callbackName ] = function() {
            responseContainer = arguments;
        };

        
        jqXHR.always(function() {
            
            window[ callbackName ] = overwritten;

            
            if ( s[ callbackName ] ) {
                
                s.jsonpCallback = originalSettings.jsonpCallback;

                
                oldCallbacks.push( callbackName );
            }

            
            if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                overwritten( responseContainer[ 0 ] );
            }

            responseContainer = overwritten = undefined;
        });

        
        return "script";
    }
});

jQuery.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /javascript|ecmascript/
    },
    converters: {
        "text script": function( text ) {
            jQuery.globalEval( text );
            return text;
        }
    }
});


jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
        s.global = false;
    }
});


jQuery.ajaxTransport( "script", function(s) {

    
    if ( s.crossDomain ) {

        var script,
            head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

        return {

            send: function( _, callback ) {

                script = document.createElement( "script" );

                script.async = "async";

                if ( s.scriptCharset ) {
                    script.charset = s.scriptCharset;
                }

                script.src = s.url;

                
                script.onload = script.onreadystatechange = function( _, isAbort ) {

                    if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                        
                        script.onload = script.onreadystatechange = null;

                        
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }

                        
                        script = undefined;

                        
                        if ( !isAbort ) {
                            callback( 200, "success" );
                        }
                    }
                };
                
                
                head.insertBefore( script, head.firstChild );
            },

            abort: function() {
                if ( script ) {
                    script.onload( 0, 1 );
                }
            }
        };
    }
});
var xhrCallbacks,
    
    xhrOnUnloadAbort = window.ActiveXObject ? function() {
        
        for ( var key in xhrCallbacks ) {
            xhrCallbacks[ key ]( 0, 1 );
        }
    } : false,
    xhrId = 0;


function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {}
}



jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    





    function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    
    createStandardXHR;


(function( xhr ) {
    jQuery.extend( jQuery.support, {
        ajax: !!xhr,
        cors: !!xhr && ( "withCredentials" in xhr )
    });
})( jQuery.ajaxSettings.xhr() );


if ( jQuery.support.ajax ) {

    jQuery.ajaxTransport(function( s ) {
        
        if ( !s.crossDomain || jQuery.support.cors ) {

            var callback;

            return {
                send: function( headers, complete ) {

                    
                    var handle, i,
                        xhr = s.xhr();

                    
                    
                    if ( s.username ) {
                        xhr.open( s.type, s.url, s.async, s.username, s.password );
                    } else {
                        xhr.open( s.type, s.url, s.async );
                    }

                    
                    if ( s.xhrFields ) {
                        for ( i in s.xhrFields ) {
                            xhr[ i ] = s.xhrFields[ i ];
                        }
                    }

                    
                    if ( s.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( s.mimeType );
                    }

                    
                    
                    
                    
                    
                    if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                        headers[ "X-Requested-With" ] = "XMLHttpRequest";
                    }

                    
                    try {
                        for ( i in headers ) {
                            xhr.setRequestHeader( i, headers[ i ] );
                        }
                    } catch( _ ) {}

                    
                    
                    
                    xhr.send( ( s.hasContent && s.data ) || null );

                    
                    callback = function( _, isAbort ) {

                        var status,
                            statusText,
                            responseHeaders,
                            responses,
                            xml;

                        
                        
                        
                        try {

                            
                            if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                
                                callback = undefined;

                                
                                if ( handle ) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    if ( xhrOnUnloadAbort ) {
                                        delete xhrCallbacks[ handle ];
                                    }
                                }

                                
                                if ( isAbort ) {
                                    
                                    if ( xhr.readyState !== 4 ) {
                                        xhr.abort();
                                    }
                                } else {
                                    status = xhr.status;
                                    responseHeaders = xhr.getAllResponseHeaders();
                                    responses = {};
                                    xml = xhr.responseXML;

                                    
                                    if ( xml && xml.documentElement  ) {
                                        responses.xml = xml;
                                    }

                                    
                                    
                                    try {
                                        responses.text = xhr.responseText;
                                    } catch( e ) {
                                    }

                                    
                                    
                                    try {
                                        statusText = xhr.statusText;
                                    } catch( e ) {
                                        
                                        statusText = "";
                                    }

                                    

                                    
                                    
                                    
                                    if ( !status && s.isLocal && !s.crossDomain ) {
                                        status = responses.text ? 200 : 404;
                                    
                                    } else if ( status === 1223 ) {
                                        status = 204;
                                    }
                                }
                            }
                        } catch( firefoxAccessException ) {
                            if ( !isAbort ) {
                                complete( -1, firefoxAccessException );
                            }
                        }

                        
                        if ( responses ) {
                            complete( status, statusText, responses, responseHeaders );
                        }
                    };

                    if ( !s.async ) {
                        
                        callback();
                    } else if ( xhr.readyState === 4 ) {
                        
                        
                        setTimeout( callback, 0 );
                    } else {
                        handle = ++xhrId;
                        if ( xhrOnUnloadAbort ) {
                            
                            
                            if ( !xhrCallbacks ) {
                                xhrCallbacks = {};
                                jQuery( window ).unload( xhrOnUnloadAbort );
                            }
                            
                            xhrCallbacks[ handle ] = callback;
                        }
                        xhr.onreadystatechange = callback;
                    }
                },

                abort: function() {
                    if ( callback ) {
                        callback(0,1);
                    }
                }
            };
        }
    });
}
var fxNow, timerId,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
    rrun = /queueHooks$/,
    animationPrefilters = [ defaultPrefilter ],
    tweeners = {
        "*": [function( prop, value ) {
            var end, unit,
                tween = this.createTween( prop, value ),
                parts = rfxnum.exec( value ),
                target = tween.cur(),
                start = +target || 0,
                scale = 1,
                maxIterations = 20;

            if ( parts ) {
                end = +parts[2];
                unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

                
                if ( unit !== "px" && start ) {
                    
                    
                    
                    start = jQuery.css( tween.elem, prop, true ) || end || 1;

                    do {
                        
                        
                        scale = scale || ".5";

                        
                        start = start / scale;
                        jQuery.style( tween.elem, prop, start + unit );

                    
                    
                    } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                }

                tween.unit = unit;
                tween.start = start;
                
                tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
            }
            return tween;
        }]
    };


function createFxNow() {
    setTimeout(function() {
        fxNow = undefined;
    }, 0 );
    return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
    jQuery.each( props, function( prop, value ) {
        var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
            index = 0,
            length = collection.length;
        for ( ; index < length; index++ ) {
            if ( collection[ index ].call( animation, prop, value ) ) {

                
                return;
            }
        }
    });
}

function Animation( elem, properties, options ) {
    var result,
        index = 0,
        tweenerIndex = 0,
        length = animationPrefilters.length,
        deferred = jQuery.Deferred().always( function() {
            
            delete tick.elem;
        }),
        tick = function() {
            var currentTime = fxNow || createFxNow(),
                remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                
                temp = remaining / animation.duration || 0,
                percent = 1 - temp,
                index = 0,
                length = animation.tweens.length;

            for ( ; index < length ; index++ ) {
                animation.tweens[ index ].run( percent );
            }

            deferred.notifyWith( elem, [ animation, percent, remaining ]);

            if ( percent < 1 && length ) {
                return remaining;
            } else {
                deferred.resolveWith( elem, [ animation ] );
                return false;
            }
        },
        animation = deferred.promise({
            elem: elem,
            props: jQuery.extend( {}, properties ),
            opts: jQuery.extend( true, { specialEasing: {} }, options ),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function( prop, end, easing ) {
                var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                animation.tweens.push( tween );
                return tween;
            },
            stop: function( gotoEnd ) {
                var index = 0,
                    
                    
                    length = gotoEnd ? animation.tweens.length : 0;

                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( 1 );
                }

                
                
                if ( gotoEnd ) {
                    deferred.resolveWith( elem, [ animation, gotoEnd ] );
                } else {
                    deferred.rejectWith( elem, [ animation, gotoEnd ] );
                }
                return this;
            }
        }),
        props = animation.props;

    propFilter( props, animation.opts.specialEasing );

    for ( ; index < length ; index++ ) {
        result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
        if ( result ) {
            return result;
        }
    }

    createTweens( animation, props );

    if ( jQuery.isFunction( animation.opts.start ) ) {
        animation.opts.start.call( elem, animation );
    }

    jQuery.fx.timer(
        jQuery.extend( tick, {
            anim: animation,
            queue: animation.opts.queue,
            elem: elem
        })
    );

    
    return animation.progress( animation.opts.progress )
        .done( animation.opts.done, animation.opts.complete )
        .fail( animation.opts.fail )
        .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
    var index, name, easing, value, hooks;

    
    for ( index in props ) {
        name = jQuery.camelCase( index );
        easing = specialEasing[ name ];
        value = props[ index ];
        if ( jQuery.isArray( value ) ) {
            easing = value[ 1 ];
            value = props[ index ] = value[ 0 ];
        }

        if ( index !== name ) {
            props[ name ] = value;
            delete props[ index ];
        }

        hooks = jQuery.cssHooks[ name ];
        if ( hooks && "expand" in hooks ) {
            value = hooks.expand( value );
            delete props[ name ];

            
            
            for ( index in value ) {
                if ( !( index in props ) ) {
                    props[ index ] = value[ index ];
                    specialEasing[ index ] = easing;
                }
            }
        } else {
            specialEasing[ name ] = easing;
        }
    }
}

jQuery.Animation = jQuery.extend( Animation, {

    tweener: function( props, callback ) {
        if ( jQuery.isFunction( props ) ) {
            callback = props;
            props = [ "*" ];
        } else {
            props = props.split(" ");
        }

        var prop,
            index = 0,
            length = props.length;

        for ( ; index < length ; index++ ) {
            prop = props[ index ];
            tweeners[ prop ] = tweeners[ prop ] || [];
            tweeners[ prop ].unshift( callback );
        }
    },

    prefilter: function( callback, prepend ) {
        if ( prepend ) {
            animationPrefilters.unshift( callback );
        } else {
            animationPrefilters.push( callback );
        }
    }
});

function defaultPrefilter( elem, props, opts ) {
    var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
        anim = this,
        style = elem.style,
        orig = {},
        handled = [],
        hidden = elem.nodeType && isHidden( elem );

    
    if ( !opts.queue ) {
        hooks = jQuery._queueHooks( elem, "fx" );
        if ( hooks.unqueued == null ) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
                if ( !hooks.unqueued ) {
                    oldfire();
                }
            };
        }
        hooks.unqueued++;

        anim.always(function() {
            
            
            anim.always(function() {
                hooks.unqueued--;
                if ( !jQuery.queue( elem, "fx" ).length ) {
                    hooks.empty.fire();
                }
            });
        });
    }

    
    if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
        
        
        
        
        opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

        
        
        if ( jQuery.css( elem, "display" ) === "inline" &&
                jQuery.css( elem, "float" ) === "none" ) {

            
            
            if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
                style.display = "inline-block";

            } else {
                style.zoom = 1;
            }
        }
    }

    if ( opts.overflow ) {
        style.overflow = "hidden";
        if ( !jQuery.support.shrinkWrapBlocks ) {
            anim.done(function() {
                style.overflow = opts.overflow[ 0 ];
                style.overflowX = opts.overflow[ 1 ];
                style.overflowY = opts.overflow[ 2 ];
            });
        }
    }


    
    for ( index in props ) {
        value = props[ index ];
        if ( rfxtypes.exec( value ) ) {
            delete props[ index ];
            toggle = toggle || value === "toggle";
            if ( value === ( hidden ? "hide" : "show" ) ) {
                continue;
            }
            handled.push( index );
        }
    }

    length = handled.length;
    if ( length ) {
        dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
        if ( "hidden" in dataShow ) {
            hidden = dataShow.hidden;
        }

        
        if ( toggle ) {
            dataShow.hidden = !hidden;
        }
        if ( hidden ) {
            jQuery( elem ).show();
        } else {
            anim.done(function() {
                jQuery( elem ).hide();
            });
        }
        anim.done(function() {
            var prop;
            jQuery.removeData( elem, "fxshow", true );
            for ( prop in orig ) {
                jQuery.style( elem, prop, orig[ prop ] );
            }
        });
        for ( index = 0 ; index < length ; index++ ) {
            prop = handled[ index ];
            tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
            orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

            if ( !( prop in dataShow ) ) {
                dataShow[ prop ] = tween.start;
                if ( hidden ) {
                    tween.end = tween.start;
                    tween.start = prop === "width" || prop === "height" ? 1 : 0;
                }
            }
        }
    }
}

function Tween( elem, options, prop, end, easing ) {
    return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
    constructor: Tween,
    init: function( elem, options, prop, end, easing, unit ) {
        this.elem = elem;
        this.prop = prop;
        this.easing = easing || "swing";
        this.options = options;
        this.start = this.now = this.cur();
        this.end = end;
        this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    },
    cur: function() {
        var hooks = Tween.propHooks[ this.prop ];

        return hooks && hooks.get ?
            hooks.get( this ) :
            Tween.propHooks._default.get( this );
    },
    run: function( percent ) {
        var eased,
            hooks = Tween.propHooks[ this.prop ];

        if ( this.options.duration ) {
            this.pos = eased = jQuery.easing[ this.easing ](
                percent, this.options.duration * percent, 0, 1, this.options.duration
            );
        } else {
            this.pos = eased = percent;
        }
        this.now = ( this.end - this.start ) * eased + this.start;

        if ( this.options.step ) {
            this.options.step.call( this.elem, this.now, this );
        }

        if ( hooks && hooks.set ) {
            hooks.set( this );
        } else {
            Tween.propHooks._default.set( this );
        }
        return this;
    }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
    _default: {
        get: function( tween ) {
            var result;

            if ( tween.elem[ tween.prop ] != null &&
                (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                return tween.elem[ tween.prop ];
            }

            
            
            
            
            result = jQuery.css( tween.elem, tween.prop, false, "" );
            
            return !result || result === "auto" ? 0 : result;
        },
        set: function( tween ) {
            
            
            if ( jQuery.fx.step[ tween.prop ] ) {
                jQuery.fx.step[ tween.prop ]( tween );
            } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
            } else {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    }
};




Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function( tween ) {
        if ( tween.elem.nodeType && tween.elem.parentNode ) {
            tween.elem[ tween.prop ] = tween.now;
        }
    }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
    var cssFn = jQuery.fn[ name ];
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return speed == null || typeof speed === "boolean" ||
            
            ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
            cssFn.apply( this, arguments ) :
            this.animate( genFx( name, true ), speed, easing, callback );
    };
});

jQuery.fn.extend({
    fadeTo: function( speed, to, easing, callback ) {

        
        return this.filter( isHidden ).css( "opacity", 0 ).show()

            
            .end().animate({ opacity: to }, speed, easing, callback );
    },
    animate: function( prop, speed, easing, callback ) {
        var empty = jQuery.isEmptyObject( prop ),
            optall = jQuery.speed( speed, easing, callback ),
            doAnimation = function() {
                
                var anim = Animation( this, jQuery.extend( {}, prop ), optall );

                
                if ( empty ) {
                    anim.stop( true );
                }
            };

        return empty || optall.queue === false ?
            this.each( doAnimation ) :
            this.queue( optall.queue, doAnimation );
    },
    stop: function( type, clearQueue, gotoEnd ) {
        var stopQueue = function( hooks ) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop( gotoEnd );
        };

        if ( typeof type !== "string" ) {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
        }
        if ( clearQueue && type !== false ) {
            this.queue( type || "fx", [] );
        }

        return this.each(function() {
            var dequeue = true,
                index = type != null && type + "queueHooks",
                timers = jQuery.timers,
                data = jQuery._data( this );

            if ( index ) {
                if ( data[ index ] && data[ index ].stop ) {
                    stopQueue( data[ index ] );
                }
            } else {
                for ( index in data ) {
                    if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                        stopQueue( data[ index ] );
                    }
                }
            }

            for ( index = timers.length; index--; ) {
                if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                    timers[ index ].anim.stop( gotoEnd );
                    dequeue = false;
                    timers.splice( index, 1 );
                }
            }

            
            
            
            if ( dequeue || !gotoEnd ) {
                jQuery.dequeue( this, type );
            }
        });
    }
});


function genFx( type, includeWidth ) {
    var which,
        attrs = { height: type },
        i = 0;

    
    
    includeWidth = includeWidth? 1 : 0;
    for( ; i < 4 ; i += 2 - includeWidth ) {
        which = cssExpand[ i ];
        attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    }

    if ( includeWidth ) {
        attrs.opacity = attrs.width = type;
    }

    return attrs;
}


jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return this.animate( props, speed, easing, callback );
    };
});

jQuery.speed = function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
        complete: fn || !fn && easing ||
            jQuery.isFunction( speed ) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
        opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

    
    if ( opt.queue == null || opt.queue === true ) {
        opt.queue = "fx";
    }

    
    opt.old = opt.complete;

    opt.complete = function() {
        if ( jQuery.isFunction( opt.old ) ) {
            opt.old.call( this );
        }

        if ( opt.queue ) {
            jQuery.dequeue( this, opt.queue );
        }
    };

    return opt;
};

jQuery.easing = {
    linear: function( p ) {
        return p;
    },
    swing: function( p ) {
        return 0.5 - Math.cos( p*Math.PI ) / 2;
    }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
    var timer,
        timers = jQuery.timers,
        i = 0;

    fxNow = jQuery.now();

    for ( ; i < timers.length; i++ ) {
        timer = timers[ i ];
        
        if ( !timer() && timers[ i ] === timer ) {
            timers.splice( i--, 1 );
        }
    }

    if ( !timers.length ) {
        jQuery.fx.stop();
    }
    fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
    if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
        timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
    }
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
    clearInterval( timerId );
    timerId = null;
};

jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    
    _default: 400
};


jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
        return jQuery.grep(jQuery.timers, function( fn ) {
            return elem === fn.elem;
        }).length;
    };
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
    if ( arguments.length ) {
        return options === undefined ?
            this :
            this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
    }

    var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
        box = { top: 0, left: 0 },
        elem = this[ 0 ],
        doc = elem && elem.ownerDocument;

    if ( !doc ) {
        return;
    }

    if ( (body = doc.body) === elem ) {
        return jQuery.offset.bodyOffset( elem );
    }

    docElem = doc.documentElement;

    
    if ( !jQuery.contains( docElem, elem ) ) {
        return box;
    }

    
    
    if ( typeof elem.getBoundingClientRect !== "undefined" ) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow( doc );
    clientTop  = docElem.clientTop  || body.clientTop  || 0;
    clientLeft = docElem.clientLeft || body.clientLeft || 0;
    scrollTop  = win.pageYOffset || docElem.scrollTop;
    scrollLeft = win.pageXOffset || docElem.scrollLeft;
    return {
        top: box.top  + scrollTop  - clientTop,
        left: box.left + scrollLeft - clientLeft
    };
};

jQuery.offset = {

    bodyOffset: function( body ) {
        var top = body.offsetTop,
            left = body.offsetLeft;

        if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
            top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
            left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
        }

        return { top: top, left: left };
    },

    setOffset: function( elem, options, i ) {
        var position = jQuery.css( elem, "position" );

        
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        var curElem = jQuery( elem ),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css( elem, "top" ),
            curCSSLeft = jQuery.css( elem, "left" ),
            calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {}, curPosition = {}, curTop, curLeft;

        
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( jQuery.isFunction( options ) ) {
            options = options.call( elem, i, curOffset );
        }

        if ( options.top != null ) {
            props.top = ( options.top - curOffset.top ) + curTop;
        }
        if ( options.left != null ) {
            props.left = ( options.left - curOffset.left ) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );
        } else {
            curElem.css( props );
        }
    }
};


jQuery.fn.extend({

    position: function() {
        if ( !this[0] ) {
            return;
        }

        var elem = this[0],

        
        offsetParent = this.offsetParent(),

        
        offset       = this.offset(),
        parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

        
        
        
        offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
        offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

        
        parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
        parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

        
        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    },

    offsetParent: function() {
        return this.map(function() {
            var offsetParent = this.offsetParent || document.body;
            while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || document.body;
        });
    }
});



jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
    var top = /Y/.test( prop );

    jQuery.fn[ method ] = function( val ) {
        return jQuery.access( this, function( elem, method, val ) {
            var win = getWindow( elem );

            if ( val === undefined ) {
                return win ? (prop in win) ? win[ prop ] :
                    win.document.documentElement[ method ] :
                    elem[ method ];
            }

            if ( win ) {
                win.scrollTo(
                    !top ? val : jQuery( win ).scrollLeft(),
                     top ? val : jQuery( win ).scrollTop()
                );

            } else {
                elem[ method ] = val;
            }
        }, method, val, arguments.length, null );
    };
});

function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
        elem :
        elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
}

jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
        
        jQuery.fn[ funcName ] = function( margin, value ) {
            var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

            return jQuery.access( this, function( elem, type, value ) {
                var doc;

                if ( jQuery.isWindow( elem ) ) {
                    
                    
                    
                    return elem.document.documentElement[ "client" + name ];
                }

                
                if ( elem.nodeType === 9 ) {
                    doc = elem.documentElement;

                    
                    
                    return Math.max(
                        elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                        elem.body[ "offset" + name ], doc[ "offset" + name ],
                        doc[ "client" + name ]
                    );
                }

                return value === undefined ?
                    
                    jQuery.css( elem, type, value, extra ) :

                    
                    jQuery.style( elem, type, value, extra );
            }, type, chainable ? margin : undefined, chainable, null );
        };
    });
});

window.jQuery = window.$ = jQuery;













if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
}

})( window );

    
    var security = $alpha_tag_node_modules__alife_alpha_security_security_js();
    if (security && security.hookJquery) {
        security.hookJquery($);
    }

    
    module.exports = $.noConflict(true);


$alpha_tag_node_modules__alife_alpha_jquery_jquery_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_handlebars_handlebars_js = function () {
var exports = {}, module = { exports: exports };

/*!

 handlebars v2.0.0

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Handlebars = root.Handlebars || factory();
  }
}(this, function () {

var __module4__ = (function() {
  "use strict";
  var __exports__;
  
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();


var __module3__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj ) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  
  
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  
  
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    
    if (string instanceof SafeString) {
      return string.toString();
    } else if (string == null) {
      return "";
    } else if (!string) {
      return string + '';
    }

    
    
    
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }

  __exports__.appendContextPath = appendContextPath;
  return __exports__;
})(__module4__);


var __module5__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();


var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "2.0.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 6;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', 
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '== 1.x.x',
    5: '== 2.0.0-alpha.x',
    6: '>= 2.0.0-beta.1'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn) {
      if (toString.call(name) === objectType) {
        if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function(name) {
      delete this.helpers[name];
    },

    registerPartial: function(name, partial) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function(name) {
      delete this.partials[name];
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function() {
      if(arguments.length === 1) {
        
        return undefined;
      } else {
        
        throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse,
          fn = options.fn;

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }

          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
          options = {data: data};
        }

        return fn(context, options);
      }
    });

    instance.registerHelper('each', function(context, options) {
      if (!options) {
        throw new Exception('Must pass iterator to #each');
      }

      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      var contextPath;
      if (options.data && options.ids) {
        contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
      }

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));

              if (contextPath) {
                data.contextPath = contextPath + i;
              }
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) {
                data.key = key;
                data.index = i;
                data.first = (i === 0);

                if (contextPath) {
                  data.contextPath = contextPath + key;
                }
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      
      
      
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      var fn = options.fn;

      if (!Utils.isEmpty(context)) {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
          options = {data:data};
        }

        return fn(context, options);
      } else {
        return options.inverse(this);
      }
    });

    instance.registerHelper('log', function(message, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, message);
    });

    instance.registerHelper('lookup', function(obj, field) {
      return obj && obj[field];
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    
    log: function(level, message) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, message);
        }
      }
    }
  };
  __exports__.logger = logger;
  var log = logger.log;
  __exports__.log = log;
  var createFrame = function(object) {
    var frame = Utils.extend({}, object);
    frame._parent = object;
    return frame;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module5__);


var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
  var createFrame = __dependency3__.createFrame;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;

  function template(templateSpec, env) {
    
    if (!env) {
      throw new Exception("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new Exception('Unknown template object: ' + typeof templateSpec);
    }

    
    
    env.VM.checkRevision(templateSpec.compiler);

    var invokePartialWrapper = function(partial, indent, name, context, hash, helpers, partials, data, depths) {
      if (hash) {
        context = Utils.extend({}, context, hash);
      }

      var result = env.VM.invokePartial.call(this, partial, name, context, helpers, partials, data, depths);

      if (result == null && env.compile) {
        var options = { helpers: helpers, partials: partials, data: data, depths: depths };
        partials[name] = env.compile(partial, { data: data !== undefined, compat: templateSpec.compat }, env);
        result = partials[name](context, options);
      }
      if (result != null) {
        if (indent) {
          var lines = result.split('\n');
          for (var i = 0, l = lines.length; i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }

            lines[i] = indent + lines[i];
          }
          result = lines.join('\n');
        }
        return result;
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    
    var container = {
      lookup: function(depths, name) {
        var len = depths.length;
        for (var i = 0; i < len; i++) {
          if (depths[i] && depths[i][name] != null) {
            return depths[i][name];
          }
        }
      },
      lambda: function(current, context) {
        return typeof current === 'function' ? current.call(context) : current;
      },

      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,

      fn: function(i) {
        return templateSpec[i];
      },

      programs: [],
      program: function(i, data, depths) {
        var programWrapper = this.programs[i],
            fn = this.fn(i);
        if (data || depths) {
          programWrapper = program(this, i, fn, data, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(this, i, fn);
        }
        return programWrapper;
      },

      data: function(data, depth) {
        while (data && depth--) {
          data = data._parent;
        }
        return data;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = Utils.extend({}, common, param);
        }

        return ret;
      },

      noop: env.VM.noop,
      compilerInfo: templateSpec.compiler
    };

    var ret = function(context, options) {
      options = options || {};
      var data = options.data;

      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data = initData(context, data);
      }
      var depths;
      if (templateSpec.useDepths) {
        depths = options.depths ? [context].concat(options.depths) : [context];
      }

      return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
    };
    ret.isTop = true;

    ret._setup = function(options) {
      if (!options.partial) {
        container.helpers = container.merge(options.helpers, env.helpers);

        if (templateSpec.usePartial) {
          container.partials = container.merge(options.partials, env.partials);
        }
      } else {
        container.helpers = options.helpers;
        container.partials = options.partials;
      }
    };

    ret._child = function(i, data, depths) {
      if (templateSpec.useDepths && !depths) {
        throw new Exception('must pass parent depths');
      }

      return program(container, i, templateSpec[i], data, depths);
    };
    return ret;
  }

  __exports__.template = template;function program(container, i, fn, data, depths) {
    var prog = function(context, options) {
      options = options || {};

      return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
    };
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data, depths) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data, depths: depths };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;function initData(context, data) {
    if (!data || !('root' in data)) {
      data = data ? createFrame(data) : {};
      data.root = context;
    }
    return data;
  }
  return __exports__;
})(__module3__, __module5__, __module2__);


var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  
  var base = __dependency1__;

  
  
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module4__, __module5__, __module3__, __module6__);


var __module7__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;

  function LocationInfo(locInfo) {
    locInfo = locInfo || {};
    this.firstLine   = locInfo.first_line;
    this.firstColumn = locInfo.first_column;
    this.lastColumn  = locInfo.last_column;
    this.lastLine    = locInfo.last_line;
  }

  var AST = {
    ProgramNode: function(statements, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "program";
      this.statements = statements;
      this.strip = strip;
    },

    MustacheNode: function(rawParams, hash, open, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "mustache";
      this.strip = strip;

      
      if (open != null && open.charAt) {
        
        var escapeFlag = open.charAt(3) || open.charAt(2);
        this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
      } else {
        this.escaped = !!open;
      }

      if (rawParams instanceof AST.SexprNode) {
        this.sexpr = rawParams;
      } else {
        
        this.sexpr = new AST.SexprNode(rawParams, hash);
      }

      
      this.id = this.sexpr.id;
      this.params = this.sexpr.params;
      this.hash = this.sexpr.hash;
      this.eligibleHelper = this.sexpr.eligibleHelper;
      this.isHelper = this.sexpr.isHelper;
    },

    SexprNode: function(rawParams, hash, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = "sexpr";
      this.hash = hash;

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      
      
      
      this.isHelper = !!(params.length || hash);

      
      
      this.eligibleHelper = this.isHelper || id.isSimple;

      
      
      
    },

    PartialNode: function(partialName, context, hash, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.hash = hash;
      this.strip = strip;

      this.strip.inlineStandalone = true;
    },

    BlockNode: function(mustache, program, inverse, strip, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = 'block';
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;
      this.strip = strip;

      if (inverse && !program) {
        this.isInverse = true;
      }
    },

    RawBlockNode: function(mustache, content, close, locInfo) {
      LocationInfo.call(this, locInfo);

      if (mustache.sexpr.id.original !== close) {
        throw new Exception(mustache.sexpr.id.original + " doesn't match " + close, this);
      }

      content = new AST.ContentNode(content, locInfo);

      this.type = 'block';
      this.mustache = mustache;
      this.program = new AST.ProgramNode([content], {}, locInfo);
    },

    ContentNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "content";
      this.original = this.string = string;
    },

    HashNode: function(pairs, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "hash";
      this.pairs = pairs;
    },

    IdNode: function(parts, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0,
          depthString = '';

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) {
            throw new Exception("Invalid path: " + original, this);
          } else if (part === "..") {
            depth++;
            depthString += '../';
          } else {
            this.isScoped = true;
          }
        } else {
          dig.push(part);
        }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;
      this.idName   = depthString + this.string;

      
      
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    },

    PartialNameNode: function(name, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    },

    DataNode: function(id, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "DATA";
      this.id = id;
      this.stringModeValue = id.stringModeValue;
      this.idName = '@' + id.stringModeValue;
    },

    StringNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    },

    NumberNode: function(number, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "NUMBER";
      this.original =
        this.number = number;
      this.stringModeValue = Number(number);
    },

    BooleanNode: function(bool, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    },

    CommentNode: function(comment, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "comment";
      this.comment = comment;

      this.strip = {
        inlineStandalone: true
      };
    }
  };


  
  
  __exports__ = AST;
  return __exports__;
})(__module5__);


var __module9__ = (function() {
  "use strict";
  var __exports__;
  
  
  
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"CONTENT":12,"COMMENT":13,"openRawBlock":14,"END_RAW_BLOCK":15,"OPEN_RAW_BLOCK":16,"sexpr":17,"CLOSE_RAW_BLOCK":18,"openBlock":19,"block_option0":20,"closeBlock":21,"openInverse":22,"block_option1":23,"OPEN_BLOCK":24,"CLOSE":25,"OPEN_INVERSE":26,"inverseAndProgram":27,"INVERSE":28,"OPEN_ENDBLOCK":29,"path":30,"OPEN":31,"OPEN_UNESCAPED":32,"CLOSE_UNESCAPED":33,"OPEN_PARTIAL":34,"partialName":35,"param":36,"partial_option0":37,"partial_option1":38,"sexpr_repetition0":39,"sexpr_option0":40,"dataName":41,"STRING":42,"NUMBER":43,"BOOLEAN":44,"OPEN_SEXPR":45,"CLOSE_SEXPR":46,"hash":47,"hash_repetition_plus0":48,"hashSegment":49,"ID":50,"EQUALS":51,"DATA":52,"pathSegments":53,"SEP":54,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",12:"CONTENT",13:"COMMENT",15:"END_RAW_BLOCK",16:"OPEN_RAW_BLOCK",18:"CLOSE_RAW_BLOCK",24:"OPEN_BLOCK",25:"CLOSE",26:"OPEN_INVERSE",28:"INVERSE",29:"OPEN_ENDBLOCK",31:"OPEN",32:"OPEN_UNESCAPED",33:"CLOSE_UNESCAPED",34:"OPEN_PARTIAL",42:"STRING",43:"NUMBER",44:"BOOLEAN",45:"OPEN_SEXPR",46:"CLOSE_SEXPR",50:"ID",51:"EQUALS",52:"DATA",54:"SEP"},
  productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[10,3],[14,3],[9,4],[9,4],[19,3],[22,3],[27,2],[21,3],[8,3],[8,3],[11,5],[11,4],[17,3],[17,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,3],[47,1],[49,3],[35,1],[35,1],[35,1],[41,2],[30,1],[53,3],[53,1],[6,0],[6,2],[20,0],[20,1],[23,0],[23,1],[37,0],[37,1],[38,0],[38,1],[39,0],[39,2],[40,0],[40,1],[48,1],[48,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: yy.prepareProgram($$[$0-1].statements, true); return $$[$0-1]; 
  break;
  case 2:this.$ = new yy.ProgramNode(yy.prepareProgram($$[$0]), {}, this._$);
  break;
  case 3:this.$ = $$[$0];
  break;
  case 4:this.$ = $$[$0];
  break;
  case 5:this.$ = $$[$0];
  break;
  case 6:this.$ = $$[$0];
  break;
  case 7:this.$ = new yy.ContentNode($$[$0], this._$);
  break;
  case 8:this.$ = new yy.CommentNode($$[$0], this._$);
  break;
  case 9:this.$ = new yy.RawBlockNode($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 10:this.$ = new yy.MustacheNode($$[$0-1], null, '', '', this._$);
  break;
  case 11:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
  break;
  case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
  break;
  case 13:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 14:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 15:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
  break;
  case 16:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
  break;
  case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 19:this.$ = new yy.PartialNode($$[$0-3], $$[$0-2], $$[$0-1], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 20:this.$ = new yy.PartialNode($$[$0-2], undefined, $$[$0-1], yy.stripFlags($$[$0-3], $$[$0]), this._$);
  break;
  case 21:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
  break;
  case 22:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
  break;
  case 23:this.$ = $$[$0];
  break;
  case 24:this.$ = new yy.StringNode($$[$0], this._$);
  break;
  case 25:this.$ = new yy.NumberNode($$[$0], this._$);
  break;
  case 26:this.$ = new yy.BooleanNode($$[$0], this._$);
  break;
  case 27:this.$ = $$[$0];
  break;
  case 28:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
  break;
  case 29:this.$ = new yy.HashNode($$[$0], this._$);
  break;
  case 30:this.$ = [$$[$0-2], $$[$0]];
  break;
  case 31:this.$ = new yy.PartialNameNode($$[$0], this._$);
  break;
  case 32:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
  break;
  case 33:this.$ = new yy.PartialNameNode(new yy.NumberNode($$[$0], this._$));
  break;
  case 34:this.$ = new yy.DataNode($$[$0], this._$);
  break;
  case 35:this.$ = new yy.IdNode($$[$0], this._$);
  break;
  case 36: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 37:this.$ = [{part: $$[$0]}];
  break;
  case 38:this.$ = [];
  break;
  case 39:$$[$0-1].push($$[$0]);
  break;
  case 48:this.$ = [];
  break;
  case 49:$$[$0-1].push($$[$0]);
  break;
  case 52:this.$ = [$$[$0]];
  break;
  case 53:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[2,38],6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],31:[2,38],32:[2,38],34:[2,38]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:[1,10],13:[1,11],14:16,16:[1,20],19:14,22:15,24:[1,18],26:[1,19],28:[2,2],29:[2,2],31:[1,12],32:[1,13],34:[1,17]},{1:[2,1]},{5:[2,39],12:[2,39],13:[2,39],16:[2,39],24:[2,39],26:[2,39],28:[2,39],29:[2,39],31:[2,39],32:[2,39],34:[2,39]},{5:[2,3],12:[2,3],13:[2,3],16:[2,3],24:[2,3],26:[2,3],28:[2,3],29:[2,3],31:[2,3],32:[2,3],34:[2,3]},{5:[2,4],12:[2,4],13:[2,4],16:[2,4],24:[2,4],26:[2,4],28:[2,4],29:[2,4],31:[2,4],32:[2,4],34:[2,4]},{5:[2,5],12:[2,5],13:[2,5],16:[2,5],24:[2,5],26:[2,5],28:[2,5],29:[2,5],31:[2,5],32:[2,5],34:[2,5]},{5:[2,6],12:[2,6],13:[2,6],16:[2,6],24:[2,6],26:[2,6],28:[2,6],29:[2,6],31:[2,6],32:[2,6],34:[2,6]},{5:[2,7],12:[2,7],13:[2,7],16:[2,7],24:[2,7],26:[2,7],28:[2,7],29:[2,7],31:[2,7],32:[2,7],34:[2,7]},{5:[2,8],12:[2,8],13:[2,8],16:[2,8],24:[2,8],26:[2,8],28:[2,8],29:[2,8],31:[2,8],32:[2,8],34:[2,8]},{17:21,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:27,30:22,41:23,50:[1,26],52:[1,25],53:24},{4:28,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{4:29,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{12:[1,30]},{30:32,35:31,42:[1,33],43:[1,34],50:[1,26],53:24},{17:35,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:36,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:37,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[1,38]},{18:[2,48],25:[2,48],33:[2,48],39:39,42:[2,48],43:[2,48],44:[2,48],45:[2,48],46:[2,48],50:[2,48],52:[2,48]},{18:[2,22],25:[2,22],33:[2,22],46:[2,22]},{18:[2,35],25:[2,35],33:[2,35],42:[2,35],43:[2,35],44:[2,35],45:[2,35],46:[2,35],50:[2,35],52:[2,35],54:[1,40]},{30:41,50:[1,26],53:24},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],52:[2,37],54:[2,37]},{33:[1,42]},{20:43,27:44,28:[1,45],29:[2,40]},{23:46,27:47,28:[1,45],29:[2,42]},{15:[1,48]},{25:[2,46],30:51,36:49,38:50,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],47:57,48:58,49:60,50:[1,59],52:[1,25],53:24},{25:[2,31],42:[2,31],43:[2,31],44:[2,31],45:[2,31],50:[2,31],52:[2,31]},{25:[2,32],42:[2,32],43:[2,32],44:[2,32],45:[2,32],50:[2,32],52:[2,32]},{25:[2,33],42:[2,33],43:[2,33],44:[2,33],45:[2,33],50:[2,33],52:[2,33]},{25:[1,61]},{25:[1,62]},{18:[1,63]},{5:[2,17],12:[2,17],13:[2,17],16:[2,17],24:[2,17],26:[2,17],28:[2,17],29:[2,17],31:[2,17],32:[2,17],34:[2,17]},{18:[2,50],25:[2,50],30:51,33:[2,50],36:65,40:64,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],46:[2,50],47:66,48:58,49:60,50:[1,59],52:[1,25],53:24},{50:[1,67]},{18:[2,34],25:[2,34],33:[2,34],42:[2,34],43:[2,34],44:[2,34],45:[2,34],46:[2,34],50:[2,34],52:[2,34]},{5:[2,18],12:[2,18],13:[2,18],16:[2,18],24:[2,18],26:[2,18],28:[2,18],29:[2,18],31:[2,18],32:[2,18],34:[2,18]},{21:68,29:[1,69]},{29:[2,41]},{4:70,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{21:71,29:[1,69]},{29:[2,43]},{5:[2,9],12:[2,9],13:[2,9],16:[2,9],24:[2,9],26:[2,9],28:[2,9],29:[2,9],31:[2,9],32:[2,9],34:[2,9]},{25:[2,44],37:72,47:73,48:58,49:60,50:[1,74]},{25:[1,75]},{18:[2,23],25:[2,23],33:[2,23],42:[2,23],43:[2,23],44:[2,23],45:[2,23],46:[2,23],50:[2,23],52:[2,23]},{18:[2,24],25:[2,24],33:[2,24],42:[2,24],43:[2,24],44:[2,24],45:[2,24],46:[2,24],50:[2,24],52:[2,24]},{18:[2,25],25:[2,25],33:[2,25],42:[2,25],43:[2,25],44:[2,25],45:[2,25],46:[2,25],50:[2,25],52:[2,25]},{18:[2,26],25:[2,26],33:[2,26],42:[2,26],43:[2,26],44:[2,26],45:[2,26],46:[2,26],50:[2,26],52:[2,26]},{18:[2,27],25:[2,27],33:[2,27],42:[2,27],43:[2,27],44:[2,27],45:[2,27],46:[2,27],50:[2,27],52:[2,27]},{17:76,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[2,47]},{18:[2,29],25:[2,29],33:[2,29],46:[2,29],49:77,50:[1,74]},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],51:[1,78],52:[2,37],54:[2,37]},{18:[2,52],25:[2,52],33:[2,52],46:[2,52],50:[2,52]},{12:[2,13],13:[2,13],16:[2,13],24:[2,13],26:[2,13],28:[2,13],29:[2,13],31:[2,13],32:[2,13],34:[2,13]},{12:[2,14],13:[2,14],16:[2,14],24:[2,14],26:[2,14],28:[2,14],29:[2,14],31:[2,14],32:[2,14],34:[2,14]},{12:[2,10]},{18:[2,21],25:[2,21],33:[2,21],46:[2,21]},{18:[2,49],25:[2,49],33:[2,49],42:[2,49],43:[2,49],44:[2,49],45:[2,49],46:[2,49],50:[2,49],52:[2,49]},{18:[2,51],25:[2,51],33:[2,51],46:[2,51]},{18:[2,36],25:[2,36],33:[2,36],42:[2,36],43:[2,36],44:[2,36],45:[2,36],46:[2,36],50:[2,36],52:[2,36],54:[2,36]},{5:[2,11],12:[2,11],13:[2,11],16:[2,11],24:[2,11],26:[2,11],28:[2,11],29:[2,11],31:[2,11],32:[2,11],34:[2,11]},{30:79,50:[1,26],53:24},{29:[2,15]},{5:[2,12],12:[2,12],13:[2,12],16:[2,12],24:[2,12],26:[2,12],28:[2,12],29:[2,12],31:[2,12],32:[2,12],34:[2,12]},{25:[1,80]},{25:[2,45]},{51:[1,78]},{5:[2,20],12:[2,20],13:[2,20],16:[2,20],24:[2,20],26:[2,20],28:[2,20],29:[2,20],31:[2,20],32:[2,20],34:[2,20]},{46:[1,81]},{18:[2,53],25:[2,53],33:[2,53],46:[2,53],50:[2,53]},{30:51,36:82,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],50:[1,26],52:[1,25],53:24},{25:[1,83]},{5:[2,19],12:[2,19],13:[2,19],16:[2,19],24:[2,19],26:[2,19],28:[2,19],29:[2,19],31:[2,19],32:[2,19],34:[2,19]},{18:[2,28],25:[2,28],33:[2,28],42:[2,28],43:[2,28],44:[2,28],45:[2,28],46:[2,28],50:[2,28],52:[2,28]},{18:[2,30],25:[2,30],33:[2,30],46:[2,30],50:[2,30]},{5:[2,16],12:[2,16],13:[2,16],16:[2,16],24:[2,16],26:[2,16],28:[2,16],29:[2,16],31:[2,16],32:[2,16],34:[2,16]}],
  defaultActions: {4:[2,1],44:[2,41],47:[2,43],57:[2,47],63:[2,10],70:[2,15],73:[2,45]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };
  
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 12;
                                   
  break;
  case 1:return 12;
  break;
  case 2:
                                     this.popState();
                                     return 12;
                                   
  break;
  case 3:
                                    yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                                    this.popState();
                                    return 15;
                                   
  break;
  case 4: return 12; 
  break;
  case 5:strip(0,4); this.popState(); return 13;
  break;
  case 6:return 45;
  break;
  case 7:return 46;
  break;
  case 8: return 16; 
  break;
  case 9:
                                    this.popState();
                                    this.begin('raw');
                                    return 18;
                                   
  break;
  case 10:return 34;
  break;
  case 11:return 24;
  break;
  case 12:return 29;
  break;
  case 13:this.popState(); return 28;
  break;
  case 14:this.popState(); return 28;
  break;
  case 15:return 26;
  break;
  case 16:return 26;
  break;
  case 17:return 32;
  break;
  case 18:return 31;
  break;
  case 19:this.popState(); this.begin('com');
  break;
  case 20:strip(3,5); this.popState(); return 13;
  break;
  case 21:return 31;
  break;
  case 22:return 51;
  break;
  case 23:return 50;
  break;
  case 24:return 50;
  break;
  case 25:return 54;
  break;
  case 26:
  break;
  case 27:this.popState(); return 33;
  break;
  case 28:this.popState(); return 25;
  break;
  case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 42;
  break;
  case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 42;
  break;
  case 31:return 52;
  break;
  case 32:return 44;
  break;
  case 33:return 44;
  break;
  case 34:return 43;
  break;
  case 35:return 50;
  break;
  case 36:yy_.yytext = strip(1,2); return 50;
  break;
  case 37:return 'INVALID';
  break;
  case 38:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,38],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  
  return __exports__;
})();


var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function stripFlags(open, close) {
    return {
      left: open.charAt(2) === '~',
      right: close.charAt(close.length-3) === '~'
    };
  }

  __exports__.stripFlags = stripFlags;
  function prepareBlock(mustache, program, inverseAndProgram, close, inverted, locInfo) {
    
    if (mustache.sexpr.id.original !== close.path.original) {
      throw new Exception(mustache.sexpr.id.original + ' doesn\'t match ' + close.path.original, mustache);
    }

    var inverse = inverseAndProgram && inverseAndProgram.program;

    var strip = {
      left: mustache.strip.left,
      right: close.strip.right,

      
      
      openStandalone: isNextWhitespace(program.statements),
      closeStandalone: isPrevWhitespace((inverse || program).statements)
    };

    if (mustache.strip.right) {
      omitRight(program.statements, null, true);
    }

    if (inverse) {
      var inverseStrip = inverseAndProgram.strip;

      if (inverseStrip.left) {
        omitLeft(program.statements, null, true);
      }
      if (inverseStrip.right) {
        omitRight(inverse.statements, null, true);
      }
      if (close.strip.left) {
        omitLeft(inverse.statements, null, true);
      }

      
      if (isPrevWhitespace(program.statements)
          && isNextWhitespace(inverse.statements)) {

        omitLeft(program.statements);
        omitRight(inverse.statements);
      }
    } else {
      if (close.strip.left) {
        omitLeft(program.statements, null, true);
      }
    }

    if (inverted) {
      return new this.BlockNode(mustache, inverse, program, strip, locInfo);
    } else {
      return new this.BlockNode(mustache, program, inverse, strip, locInfo);
    }
  }

  __exports__.prepareBlock = prepareBlock;
  function prepareProgram(statements, isRoot) {
    for (var i = 0, l = statements.length; i < l; i++) {
      var current = statements[i],
          strip = current.strip;

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(statements, i, isRoot, current.type === 'partial'),
          _isNextWhitespace = isNextWhitespace(statements, i, isRoot),

          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.right) {
        omitRight(statements, i, true);
      }
      if (strip.left) {
        omitLeft(statements, i, true);
      }

      if (inlineStandalone) {
        omitRight(statements, i);

        if (omitLeft(statements, i)) {
          
          if (current.type === 'partial') {
            current.indent = (/([ \t]+$)/).exec(statements[i-1].original) ? RegExp.$1 : '';
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).statements);

        
        omitLeft(statements, i);
      }
      if (closeStandalone) {
        
        omitRight(statements, i);

        omitLeft((current.inverse || current.program).statements);
      }
    }

    return statements;
  }

  __exports__.prepareProgram = prepareProgram;function isPrevWhitespace(statements, i, isRoot) {
    if (i === undefined) {
      i = statements.length;
    }

    
    
    var prev = statements[i-1],
        sibling = statements[i-2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'content') {
      return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
    }
  }
  function isNextWhitespace(statements, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = statements[i+1],
        sibling = statements[i+2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'content') {
      return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
    }
  }

  
  
  
  
  
  
  
  function omitRight(statements, i, multiple) {
    var current = statements[i == null ? 0 : i + 1];
    if (!current || current.type !== 'content' || (!multiple && current.rightStripped)) {
      return;
    }

    var original = current.string;
    current.string = current.string.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
    current.rightStripped = current.string !== original;
  }

  
  
  
  
  
  
  
  function omitLeft(statements, i, multiple) {
    var current = statements[i == null ? statements.length - 1 : i - 1];
    if (!current || current.type !== 'content' || (!multiple && current.leftStripped)) {
      return;
    }

    
    var original = current.string;
    current.string = current.string.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
    current.leftStripped = current.string !== original;
    return current.leftStripped;
  }
  return __exports__;
})(__module5__);


var __module8__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;
  var Helpers = __dependency3__;
  var extend = __dependency4__.extend;

  __exports__.parser = parser;

  var yy = {};
  extend(yy, Helpers, AST);

  function parse(input) {
    
    if (input.constructor === AST.ProgramNode) { return input; }

    parser.yy = yy;

    return parser.parse(input);
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__, __module10__, __module3__);


var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;
  var isArray = __dependency2__.isArray;

  var slice = [].slice;

  function Compiler() {}

  __exports__.Compiler = Compiler;
  
  
  

  Compiler.prototype = {
    compiler: Compiler,

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }

      
      
      len = this.children.length;
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.opcodes = [];
      this.children = [];
      this.depths = {list: []};
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;

      
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true,
        'lookup': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements;

      for(var i=0, l=statements.length; i<l; i++) {
        this.accept(statements[i]);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var sexpr = mustache.sexpr;
      var type = this.classifySexpr(sexpr);

      if (type === "helper") {
        this.helperSexpr(sexpr, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(sexpr);

        
        
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue', sexpr.id.original);
      } else {
        this.ambiguousSexpr(sexpr, program, inverse);

        
        
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, i, l;

      this.opcode('pushHash');

      for(i=0, l=pairs.length; i<l; i++) {
        this.pushParam(pairs[i][1]);
      }
      while(i--) {
        this.opcode('assignToHash', pairs[i][0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if (partial.hash) {
        this.accept(partial.hash);
      } else {
        this.opcode('push', 'undefined');
      }

      if (partial.context) {
        this.accept(partial.context);
      } else {
        this.opcode('getContext', 0);
        this.opcode('pushContext');
      }

      this.opcode('invokePartial', partialName.name, partial.indent || '');
      this.opcode('append');
    },

    content: function(content) {
      if (content.string) {
        this.opcode('appendContent', content.string);
      }
    },

    mustache: function(mustache) {
      this.sexpr(mustache.sexpr);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousSexpr: function(sexpr, program, inverse) {
      var id = sexpr.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.ID(id);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      var id = sexpr.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          id = sexpr.id,
          name = id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        id.falsy = true;

        this.ID(id);
        this.opcode('invokeHelper', params.length, id.original, id.isSimple);
      }
    },

    sexpr: function(sexpr) {
      var type = this.classifySexpr(sexpr);

      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts, id.falsy, id.isScoped);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id.depth, data.id.parts);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    NUMBER: function(number) {
      this.opcode('pushLiteral', number.number);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: slice.call(arguments, 1) });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifySexpr: function(sexpr) {
      var isHelper   = sexpr.isHelper;
      var isEligible = sexpr.eligibleHelper;
      var options    = this.options;

      
      
      if (isEligible && !isHelper) {
        var name = sexpr.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      for(var i=0, l=params.length; i<l; i++) {
        this.pushParam(params[i]);
      }
    },

    pushParam: function(val) {
      if (this.stringParams) {
        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', val.stringModeValue, val.type);

        if (val.type === 'sexpr') {
          
          
          this.sexpr(val);
        }
      } else {
        if (this.trackIds) {
          this.opcode('pushId', val.type, val.idName || val.stringModeValue);
        }
        this.accept(val);
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.hash(sexpr.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    
    var ret = function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
    ret._setup = function(options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(options);
    };
    ret._child = function(i, data, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data, depths);
    };
    return ret;
  }

  __exports__.compile = compile;function argEquals(a, b) {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b) && a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }
  return __exports__;
})(__module5__, __module3__);


var __module12__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var Exception = __dependency2__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    
    
    nameLookup: function(parent, name ) {
      if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      } else {
        return parent + "['" + name + "']";
      }
    },
    depthedLookup: function(name) {
      this.aliases.lookup = 'this.lookup';

      return 'lookup(depths, "' + name + '")';
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return [revision, versions];
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options;
      this.stringParams = this.options.stringParams;
      this.trackIds = this.options.trackIds;
      this.precompile = !asObject;

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: []
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.aliases = {};
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      this.useDepths = this.useDepths || environment.depths.list.length || this.options.compat;

      var opcodes = environment.opcodes,
          opcode,
          i,
          l;

      for (i = 0, l = opcodes.length; i < l; i++) {
        opcode = opcodes[i];

        this[opcode.opcode].apply(this, opcode.args);
      }

      
      this.pushSource('');

      
      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      var fn = this.createFunctionContext(asObject);
      if (!this.isChild) {
        var ret = {
          compiler: this.compilerInfo(),
          main: fn
        };
        var programs = this.context.programs;
        for (i = 0, l = programs.length; i < l; i++) {
          if (programs[i]) {
            ret[i] = programs[i];
          }
        }

        if (this.environment.usePartial) {
          ret.usePartial = true;
        }
        if (this.options.data) {
          ret.useData = true;
        }
        if (this.useDepths) {
          ret.useDepths = true;
        }
        if (this.options.compat) {
          ret.compat = true;
        }

        if (!asObject) {
          ret.compiler = JSON.stringify(ret.compiler);
          ret = this.objectLiteral(ret);
        }

        return ret;
      } else {
        return fn;
      }
    },

    preamble: function() {
      
      
      this.lastContext = 0;
      this.source = [];
    },

    createFunctionContext: function(asObject) {
      var varDeclarations = '';

      var locals = this.stackVars.concat(this.registers.list);
      if(locals.length > 0) {
        varDeclarations += ", " + locals.join(", ");
      }

      
      for (var alias in this.aliases) {
        if (this.aliases.hasOwnProperty(alias)) {
          varDeclarations += ', ' + alias + '=' + this.aliases[alias];
        }
      }

      var params = ["depth0", "helpers", "partials", "data"];

      if (this.useDepths) {
        params.push('depths');
      }

      
      var source = this.mergeSource(varDeclarations);

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        return 'function(' + params.join(',') + ') {\n  ' + source + '}';
      }
    },
    mergeSource: function(varDeclarations) {
      var source = '',
          buffer,
          appendOnly = !this.forceBuffer,
          appendFirst;

      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            if (!source) {
              appendFirst = true;
              source = buffer + ';\n  ';
            } else {
              source += 'buffer += ' + buffer + ';\n  ';
            }
            buffer = undefined;
          }
          source += line + '\n  ';

          if (!this.environment.isSimple) {
            appendOnly = false;
          }
        }
      }

      if (appendOnly) {
        if (buffer || !source) {
          source += 'return ' + (buffer || '""') + ';\n';
        }
      } else {
        varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());
        if (buffer) {
          source += 'return buffer + ' + buffer + ';\n';
        } else {
          source += 'return buffer;\n';
        }
      }

      if (varDeclarations) {
        source = 'var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n  ') + source;
      }

      return source;
    },

    
    
    
    
    
    
    
    
    
    blockValue: function(name) {
      this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = [this.contextName(0)];
      this.setupParams(name, 0, params);

      var blockName = this.popStack();
      params.splice(1, 0, blockName);

      this.push('blockHelperMissing.call(' + params.join(', ') + ')');
    },

    
    
    
    
    
    
    ambiguousBlockValue: function() {
      this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      
      var params = [this.contextName(0)];
      this.setupParams('', 0, params, true);

      this.flushInline();

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    
    
    
    
    
    
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      }

      this.pendingContent = content;
    },

    
    
    
    
    
    
    
    
    
    append: function() {
      
      
      this.flushInline();
      var local = this.popStack();
      this.pushSource('if (' + local + ' != null) { ' + this.appendToBuffer(local) + ' }');
      if (this.environment.isSimple) {
        this.pushSource("else { " + this.appendToBuffer("''") + " }");
      }
    },

    
    
    
    
    
    
    appendEscaped: function() {
      this.aliases.escapeExpression = 'this.escapeExpression';

      this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    
    
    
    
    
    
    
    getContext: function(depth) {
      this.lastContext = depth;
    },

    
    
    
    
    
    
    pushContext: function() {
      this.pushStackLiteral(this.contextName(this.lastContext));
    },

    
    
    
    
    
    
    
    lookupOnContext: function(parts, falsy, scoped) {
      
      var i = 0,
          len = parts.length;

      if (!scoped && this.options.compat && !this.lastContext) {
        
        
        this.push(this.depthedLookup(parts[i++]));
      } else {
        this.pushContext();
      }

      for (; i < len; i++) {
        this.replaceStack(function(current) {
          var lookup = this.nameLookup(current, parts[i], 'context');
          
          
          if (!falsy) {
            return ' != null ? ' + lookup + ' : ' + current;
          } else {
            
            return ' && ' + lookup;
          }
        });
      }
    },

    
    
    
    
    
    
    lookupData: function(depth, parts) {
      
      if (!depth) {
        this.pushStackLiteral('data');
      } else {
        this.pushStackLiteral('this.data(data, ' + depth + ')');
      }

      var len = parts.length;
      for (var i = 0; i < len; i++) {
        this.replaceStack(function(current) {
          return ' && ' + this.nameLookup(current, parts[i], 'data');
        });
      }
    },

    
    
    
    
    
    
    
    resolvePossibleLambda: function() {
      this.aliases.lambda = 'this.lambda';

      this.push('lambda(' + this.popStack() + ', ' + this.contextName(0) + ')');
    },

    
    
    
    
    
    
    
    
    pushStringParam: function(string, type) {
      this.pushContext();
      this.pushString(type);

      
      
      if (type !== 'sexpr') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.trackIds) {
        this.push('{}'); 
      }
      if (this.stringParams) {
        this.push('{}'); 
        this.push('{}'); 
      }
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: [], ids: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.trackIds) {
        this.push('{' + hash.ids.join(',') + '}');
      }
      if (this.stringParams) {
        this.push('{' + hash.contexts.join(',') + '}');
        this.push('{' + hash.types.join(',') + '}');
      }

      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    
    
    
    
    
    
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    
    
    
    
    
    
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    
    
    
    
    
    
    
    
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    
    
    
    
    
    
    
    
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    
    
    
    
    
    
    
    
    
    invokeHelper: function(paramSize, name, isSimple) {
      this.aliases.helperMissing = 'helpers.helperMissing';

      var nonHelper = this.popStack();
      var helper = this.setupHelper(paramSize, name);

      var lookup = (isSimple ? helper.name + ' || ' : '') + nonHelper + ' || helperMissing';
      this.push('((' + lookup + ').call(' + helper.callParams + '))');
    },

    
    
    
    
    
    
    
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    
    
    
    
    
    
    
    
    
    
    
    
    invokeAmbiguous: function(name, helperCall) {
      this.aliases.functionType = '"function"';
      this.aliases.helperMissing = 'helpers.helperMissing';
      this.useRegister('helper');

      var nonHelper = this.popStack();

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      this.push(
        '((helper = (helper = ' + helperName + ' || ' + nonHelper + ') != null ? helper : helperMissing'
          + (helper.paramsInit ? '),(' + helper.paramsInit : '') + '),'
        + '(typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper))');
    },

    
    
    
    
    
    
    
    invokePartial: function(name, indent) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + indent + "'", "'" + name + "'", this.popStack(), this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      } else if (this.options.compat) {
        params.push('undefined');
      }
      if (this.options.compat) {
        params.push('depths');
      }

      this.push("this.invokePartial(" + params.join(", ") + ")");
    },

    
    
    
    
    
    
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type,
          id;

      if (this.trackIds) {
        id = this.popStack();
      }
      if (this.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts.push("'" + key + "': " + context);
      }
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      if (id) {
        hash.ids.push("'" + key + "': " + id);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    pushId: function(type, name) {
      if (type === 'ID' || type === 'DATA') {
        this.pushString(name);
      } else if (type === 'sexpr') {
        this.pushStackLiteral('true');
      } else {
        this.pushStackLiteral('null');
      }
    },

    

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
          this.context.environments[index] = child;

          this.useDepths = this.useDepths || compiler.useDepths;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      var child = this.environment.children[guid],
          depths = child.depths.list,
          useDepths = this.useDepths,
          depth;

      var programParams = [child.index, 'data'];

      if (useDepths) {
        programParams.push('depths');
      }

      return 'this.program(' + programParams.join(', ') + ')';
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      this.pushSource(stack + " = " + item + ";");
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack,
          createdStack,
          usedLiteral;

      
      if (!this.isInline()) {
        throw new Exception('replaceStack on non-inline');
      }

      
      var top = this.popStack(true);

      if (top instanceof Literal) {
        
        prefix = stack = top.value;
        usedLiteral = true;
      } else {
        
        createdStack = !this.stackSlot;
        var name = !createdStack ? this.topStackName() : this.incrStack();

        prefix = '(' + this.push(name) + ' = ' + top + ')';
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push('(' + prefix + item + ')');
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function() {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    contextName: function(context) {
      if (this.useDepths && context) {
        return 'depths[' + context + ']';
      } else {
        return 'depth' + context;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    objectLiteral: function(obj) {
      var pairs = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          pairs.push(this.quotedString(key) + ':' + obj[key]);
        }
      }

      return '{' + pairs.join(',') + '}';
    },

    setupHelper: function(paramSize, name, blockHelper) {
      var params = [],
          paramsInit = this.setupParams(name, paramSize, params, blockHelper);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: [this.contextName(0)].concat(params).join(", ")
      };
    },

    setupOptions: function(helper, paramSize, params) {
      var options = {}, contexts = [], types = [], ids = [], param, inverse, program;

      options.name = this.quotedString(helper);
      options.hash = this.popStack();

      if (this.trackIds) {
        options.hashIds = this.popStack();
      }
      if (this.stringParams) {
        options.hashTypes = this.popStack();
        options.hashContexts = this.popStack();
      }

      inverse = this.popStack();
      program = this.popStack();

      
      
      if (program || inverse) {
        if (!program) {
          program = 'this.noop';
        }

        if (!inverse) {
          inverse = 'this.noop';
        }

        options.fn = program;
        options.inverse = inverse;
      }

      
      
      var i = paramSize;
      while (i--) {
        param = this.popStack();
        params[i] = param;

        if (this.trackIds) {
          ids[i] = this.popStack();
        }
        if (this.stringParams) {
          types[i] = this.popStack();
          contexts[i] = this.popStack();
        }
      }

      if (this.trackIds) {
        options.ids = "[" + ids.join(",") + "]";
      }
      if (this.stringParams) {
        options.types = "[" + types.join(",") + "]";
        options.contexts = "[" + contexts.join(",") + "]";
      }

      if (this.options.data) {
        options.data = "data";
      }

      return options;
    },

    
    
    setupParams: function(helperName, paramSize, params, useRegister) {
      var options = this.objectLiteral(this.setupOptions(helperName, paramSize, params));

      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return 'options=' + options;
      } else {
        params.push(options);
        return '';
      }
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module5__);


var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  
  var Handlebars = __dependency1__;

  
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module11__, __module12__);

  return __module0__;
}));


$alpha_tag_node_modules__alife_alpha_handlebars_handlebars_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_class_class_js = function () {
var exports = {}, module = { exports: exports };













function Class(o, properties) {
    
    var args = arguments, cls;
    if (!(this instanceof Class) && isFunction(o) && args.length == 1) {
        return classify(o)
    }else if(args.length == 2 && !isFunction(o)){
        cls = function(){};
        cls.prototype = o;
        cls.prototype.constructor = cls;
        return Class.create(cls, properties, true);
    }else{
        return Class.create(o, properties, true);
    }
}

module.exports = Class;

















Class.create = function (parent, properties, isInit){

    if (!isFunction(parent)) {
        
        properties = parent;
        parent = null
    }

    properties || (properties = {});
    parent || (parent = properties.Extends || Class);
    
    properties.Extends = parent;

    
    function SubClass() {
        
        
        if(!(parent.prototype.init || parent.prototype.initialize)){
            parent.apply(this, arguments);
        }
        
        if (this.constructor === SubClass) {
            if (SubClass._meta) {
                for (var i = 0; i < SubClass._meta.length; i++) {
                    SubClass._meta[i].apply(this, arguments);
                }
            }
            var init;
            if(isInit === true){
                init = this.init || this.initialize;
            }else{
                init = this.initialize || this.init;
            }
            if (init) {
                init.apply(this, arguments)
            }
        }
    }
    
    if(isInit === true){
        SubClass._STATIC_CREATE = true;
    }

    
    if (parent !== Class) {
        if(parent.StaticsWhiteList){
            parent.StaticsWhiteList.push('_meta');
        }
        mix(SubClass, parent, parent.StaticsWhiteList)
    }

    
    implement.call(SubClass, properties);

    
    return classify(SubClass)
};


function implement(properties) {
    var key, value

    for (key in properties) {
        value = properties[key]

        if (Class.Mutators.hasOwnProperty(key)) {
            Class.Mutators[key].call(this, value)
        } else {
            this.prototype[key] = value
        }
    }
}



Class.extend = function (properties) {
    properties || (properties = {});

    properties.Extends = this;

    return Class.create(properties)
};


function classify(cls) {
    cls.extend = Class.extend;
    cls.implement = implement;
    return cls
}



Class.Mutators = {

    'Extends': function (parent) {
        var existed = this.prototype;
        
        var proto = createProto(parent.prototype);

        
        mix(proto, existed);

        
        proto.constructor = this;

        
        this.prototype = proto;

        
        
        this.superclass = parent.prototype
    },

    'Implements': function (items) {
        isArray(items) || (items = [items]);
        var proto = this.prototype, item, meta = [];
        if (this._meta) {
            
            for (var i = 0; i < this._meta.length; i++) {
                meta[i] = this._meta[i];
            }
        }
        this._meta = meta;
        while (item = items.shift()) {
            if (typeof item == 'function') {
                this._meta.push(item);
            }
            mix(proto, item.prototype || item)
        }
        this._meta = unique(this._meta);
    },

    'Statics': function (staticProperties) {
        mix(this, staticProperties)
    }
};



function Ctor() {
}


var createProto = Object.__proto__ ?
    function (proto) {
        return { __proto__: proto }
    } :
    function (proto) {
        Ctor.prototype = proto;
        return new Ctor()
    };





function mix(r, s, wl) {
    
    for (var p in s) {
        if (s.hasOwnProperty(p)) {
            if (wl && indexOf(wl, p) === -1) continue

            
            if (p !== 'prototype') {
                r[p] = s[p]
            }
        }
    }
}

var unique = function (arr) {
    var object = {}, result = [];
    for (var i = 0; i < arr.length; i++) {
        if (!object[arr[i]]) {
            result.push(arr[i]);
            object[arr[i]] = true;
        }
    }
    return result;
};

var toString = Object.prototype.toString;

var isArray = Array.isArray || function (val) {
        return toString.call(val) === '[object Array]'
    };

var isFunction = function (val) {
    return toString.call(val) === '[object Function]'
};

var indexOf = Array.prototype.indexOf ?
    function (arr, item) {
        return arr.indexOf(item)
    } :
    function (arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i
            }
        }
        return -1
    };


$alpha_tag_node_modules__alife_alpha_class_class_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_util_log_js = function () {
var exports = {}, module = { exports: exports };





module.exports = {
    


    info : function(message) {
        if(window.console) {
            window.console.log(message);
        }
    },
    








    deprecated : function(method, instead, version) {
        if(window.console) {
            window.console.log(method + ' is deprecated at [ '+ version +' ], use [ ' + instead + ' ] instead of it.');
        }
    }
}

$alpha_tag_node_modules__alife_alpha_util_log_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_events_events_js = function () {
var exports = {}, module = { exports: exports };

var log = $alpha_tag_node_modules__alife_alpha_util_log_js();








var eventSplitter = /\s+/











function Events() {

}




Events.prototype.on = function (events, callback, context) {
    var cache, event, list
    if (!callback) return this

    cache = this.__events || (this.__events = {})
    if (typeof events == 'string') {
        events = events.split(eventSplitter)
    }
    while (event = events.shift()) {
        list = cache[event] || (cache[event] = []);
        list.push(callback, context);
    }

    return this;
};

Events.prototype.once = function (events, callback, context) {
    var that = this;
    var cb = function () {
        that.off(events, cb);
        callback.apply(this, arguments);
    };
    this.on(events, cb, context);
};




Events.prototype.off = function (events, callback, context) {
    var cache, event, list, i;

    
    if (!(cache = this.__events)) {
        return this;
    }
    if (!(events || callback || context)) {
        delete this.__events;
        return this;
    }

    events = events ? events.split(eventSplitter) : keys(cache)

    
    while (event = events.shift()) {
        list = cache[event];
        if (!list) continue;

        if (!(callback || context)) {
            delete cache[event];
            continue;
        }

        for (i = list.length - 2; i >= 0; i -= 2) {
            if (!(callback && list[i] !== callback ||
                context && list[i + 1] !== context)) {
                list.splice(i, 2);
            }
        }
    }

    return this;
};






Events.prototype.trigger = function (events) {
    var cache, event, all, list, i, len, rest = [], args, returned = true;
    if (!(cache = this.__events)) return this;

    events = events.split(eventSplitter);

    
    
    for (i = 1, len = arguments.length; i < len; i++) {
        rest[i - 1] = arguments[i];
    }

    
    
    while (event = events.shift()) {
        
        if (all = cache.all) all = all.slice();
        if (list = cache[event]) list = list.slice();

        
        returned = triggerEvents(list, rest, this) && returned;

        
        returned = triggerEvents(all, [event].concat(rest), this) && returned;
    }

    return returned;
};


Events.prototype.attach = function () {
    log.deprecated('attach', 'on', '1.1.0');
    this.on.apply(this, arguments);
};
Events.prototype.detach = function () {
    log.deprecated('detach', 'off', '1.1.0');
    this.on.apply(this, arguments);
};
Events.prototype.notify = function () {
    log.deprecated('notify', 'trigger', '1.1.0');
    this.trigger.apply(this, arguments);
};

Events.prototype.emit = Events.prototype.trigger



Events.mixTo = function (receiver) {
    receiver = isFunction(receiver) ? receiver.prototype : receiver;
    var proto = Events.prototype;

    for (var p in proto) {
        if (proto.hasOwnProperty(p)) {
            receiver[p] = proto[p];
        }
    }
};





var keys = Object.keys;

if (!keys) {
    keys = function (o) {
        var result = [];

        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                result.push(name);
            }
        }
        return result;
    }
}


function triggerEvents(list, args, context) {
    var pass = true;

    if (list) {
        var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]
        
        
        switch (args.length) {
            case 0:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context.__context || context) !== false && pass
                }
                break;
            case 1:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context.__context || context, a1) !== false && pass
                }
                break;
            case 2:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context.__context || context, a1, a2) !== false && pass
                }
                break;
            case 3:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context.__context || context, a1, a2, a3) !== false && pass
                }
                break;
            default:
                for (; i < l; i += 2) {
                    pass = list[i].apply(list[i + 1] || context.__context || context, args) !== false && pass
                }
                break;
        }

    }
    
    return pass;
}

function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}

Events.create = function (context) {
    log.deprecated('create', 'new Events()', '1.1.0');
    var e = new Events();
    e.__context = context;
    return e;
};

var mixinEvents = new Events();

for (var key in mixinEvents) {
    Events[key] = mixinEvents[key];
}

module.exports = Events



$alpha_tag_node_modules__alife_alpha_events_events_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_base_src_aspect_js = function () {
var exports = {}, module = { exports: exports };



  
  
  
  
  
  


  
  exports.before = function(methodName, callback, context) {
    return weave.call(this, 'before', methodName, callback, context);
  };


  
  exports.after = function(methodName, callback, context) {
    return weave.call(this, 'after', methodName, callback, context);
  };


  
  

  var eventSplitter = /\s+/;

  function weave(when, methodName, callback, context) {
    var names = methodName.split(eventSplitter);
    var name, method;

    while (name = names.shift()) {
      method = this[name];
      if (method) {
        if (!method.__isAspected) {
          wrap.call(this, name);
        }
        this.on(when + ':' + name, callback, context);
      }
    }

    return this;
  }



  function wrap(methodName) {
    var old = this[methodName];

    this[methodName] = function() {
      var args = Array.prototype.slice.call(arguments);
      var beforeArgs = ['before:' + methodName].concat(args);

      
      if (this.trigger.apply(this, beforeArgs) === false) return;

      var ret = old.apply(this, arguments);
      var afterArgs = ['after:' + methodName, ret].concat(args);
      this.trigger.apply(this, afterArgs);

      return ret;
    };

    this[methodName].__isAspected = true;
  }



$alpha_tag_node_modules__alife_alpha_base_src_aspect_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_base_src_attribute_js = function () {
var exports = {}, module = { exports: exports };


  
  
  
  
  

  function Attribute(){
  }


 Attribute.prototype.initOptions = function(){
     this.initAttrs.apply(this, arguments);
 };


 Attribute.prototype._mergeInheritedAttrs = function(attrs, props){

     if(this.constructor._STATIC_CREATE){
         mergeInheritedAttrs(attrs, this, props, 'options');
     }else{
         mergeInheritedAttrs(attrs, this, props, 'attrs');
     }

 };

  
  
 Attribute.prototype.initAttrs = function(config) {
    

    var attrs = this.attrs = this.options = {};

    
    var specialProps = this.propsInAttrs || [];

     this._mergeInheritedAttrs(attrs, specialProps);

    
    if (config) {
      mergeUserValue(attrs, config);
    }

    
    setSetterAttrs(this, attrs, config);

    
    parseEventsFromAttrs(this, attrs);

    
    copySpecialProps(specialProps, this, attrs, true);
  };

  
  Attribute.prototype.toJSON = function(){
      var result = {};
      for(var key in this.attrs){
          if(this.attrs.hasOwnProperty(key)){
              result[key] = this.get(key);
          }
      }
      return result;
  };


  
  Attribute.prototype.get = function(key) {
    var attrs;
    if (this.constructor._STATIC_CREATE) {
       attrs = this.options;
    } else {
       attrs = this.attrs;
    }
    var attr = attrs[key] || {};
    var val = attr.value;
    return attr.getter ? attr.getter.call(this, val, key) : val;
  };


  
  
  Attribute.prototype.set = function(key, val, options) {
    var attrs = {};

    
    if (isString(key)) {
      attrs[key] = val;
    }
    
    else {
      attrs = key;
      options = val;
    }

    options || (options = {});
    var silent = options.silent;
    var override = options.override;

    var now;

    if (this.constructor._STATIC_CREATE) {
        now = this.options;
    } else {
        now = this.attrs;
    }

    var changed = this.__changedAttrs || (this.__changedAttrs = {});

    for (key in attrs) {
      if (!attrs.hasOwnProperty(key)) continue;

      
      if(!isPlainObject(now[key])){
          now[key] = {};
      }
      var attr = now[key];
      val = attrs[key];

      if (attr.readOnly) {
        throw new Error('This attribute is readOnly: ' + key);
      }

      
      if (attr.setter) {
        val = attr.setter.call(this, val, key);
      }

      
      var prev = this.get(key);

      
      
      
      if (!override && isPlainObject(prev) && isPlainObject(val)) {
        val = merge(merge({}, prev), val);
      }

      
      now[key].value = val;

      
      
      if (!this.__initializingAttrs && !isEqual(prev, val)) {
        if (silent) {
          changed[key] = [val, prev];
        }
        else {
          this.trigger('change:' + key, val, prev, key);
            this.trigger(key + 'Changed', val, prev, key);
        }
      }
    }

    return this;
  };


  
  
  Attribute.prototype.change = function() {
    var changed = this.__changedAttrs;

    if (changed) {
      for (var key in changed) {
        if (changed.hasOwnProperty(key)) {
          var args = changed[key];
          this.trigger('change:' + key, args[0], args[1], key);
            this.trigger(key + 'Changed', args[0], args[1], key);
        }
      }
      delete this.__changedAttrs;
    }

    return this;
  };

  module.exports = exports = Attribute;

  
  exports._isPlainObject = isPlainObject;

  
  

  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;

  





  
  var iteratesOwnLast;
  (function() {
    var props = [];
    function Ctor() { this.x = 1; }
    Ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var prop in new Ctor()) { props.push(prop); }
    iteratesOwnLast = props[0] !== 'x';
  }());

  var isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]';
  };

  function isString(val) {
    return toString.call(val) === '[object String]';
  }

  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  function isWindow(o) {
    return o != null && o == o.window;
  }

  function isPlainObject(o) {
    
    
    
    
    if (!o || toString.call(o) !== "[object Object]" ||
        o.nodeType || isWindow(o)) {
      return false;
    }

    try {
      
      if (o.constructor &&
          !hasOwn.call(o, "constructor") &&
          !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      
      return false;
    }

    var key;

    
    
    
    if (iteratesOwnLast) {
      for (key in o) {
        return hasOwn.call(o, key);
      }
    }

    
    
    for (key in o) {}

    return key === undefined || hasOwn.call(o, key);
  }

  function isEmptyObject(o) {
    if (!o || toString.call(o) !== "[object Object]" ||
        o.nodeType || isWindow(o) || !o.hasOwnProperty) {
      return false;
    }

    for (var p in o) {
      if (o.hasOwnProperty(p)) return false;
    }
    return true;
  }

  function merge(receiver, supplier) {
    var key, value;

    for (key in supplier) {
      if (supplier.hasOwnProperty(key)) {
        receiver[key] = cloneValue(supplier[key], receiver[key]);
      }
    }

    return receiver;
  }

  
  function cloneValue(value, prev){
    if (isArray(value)) {
      value = value.slice();
    }
    else if (isPlainObject(value)) {
      isPlainObject(prev) || (prev = {});

      value = merge(prev, value);
    }

    return value;
  }

  var keys = Object.keys;

  if (!keys) {
    keys = function(o) {
      var result = [];

      for (var name in o) {
        if (o.hasOwnProperty(name)) {
          result.push(name);
        }
      }
      return result;
    };
  }

  function mergeInheritedAttrs(attrs, instance, specialProps, key) {
    var inherited = [];
    var proto = instance.constructor.prototype;

    while (proto) {
      
      if (!proto.hasOwnProperty(key)) {
        proto[key] = {};
      }

      
      copySpecialProps(specialProps, proto[key], proto);

      
      if (!isEmptyObject(proto[key])) {
        inherited.unshift(proto[key]);
      }

      
      proto = proto.constructor.superclass;
    }

    
    for (var i = 0, len = inherited.length; i < len; i++) {
      mergeAttrs(attrs, normalize(inherited[i]));
    }
  }

  function mergeUserValue(attrs, config) {
    mergeAttrs(attrs, normalize(config, true), true);
  }

  function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
    for (var i = 0, len = specialProps.length; i < len; i++) {
      var key = specialProps[i];

      if (supplier.hasOwnProperty(key)) {
        receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
      }
    }
  }


  var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
  var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

  function parseEventsFromAttrs(host, attrs) {
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        var value = attrs[key].value, m;

        if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
          host[m[1]](getEventName(m[2]), value);
        }
      }
    }
  }

  
  function getEventName(name) {
    var m = name.match(EVENT_NAME_PATTERN);
    var ret = m[1] ? 'change:' : '';
    ret += m[2].toLowerCase() + m[3];
    return ret;
  }


  function setSetterAttrs(host, attrs, config) {
    var options = { silent: true };
    host.__initializingAttrs = true;

    for (var key in config) {
      if (config.hasOwnProperty(key)) {
        if (attrs[key].setter) {
          host.set(key, config[key], options);
        }
      }
    }

    delete host.__initializingAttrs;
  }


  var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

  
  
  
  
  
  
  
  
  
  function normalize(attrs, isUserValue) {
    var newAttrs = {};

    for (var key in attrs) {
      var attr = attrs[key];

      if (!isUserValue &&
          isPlainObject(attr) &&
          hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
        newAttrs[key] = attr;
        continue;
      }

      newAttrs[key] = {
        value: attr
      };
    }

    return newAttrs;
  }

  var ATTR_OPTIONS = ['setter', 'getter', 'readOnly'];
  
  function mergeAttrs(attrs, inheritedAttrs, isUserValue){
    var key, value;
    var attr;

    for (key in inheritedAttrs) {
      if (inheritedAttrs.hasOwnProperty(key)) {
        value = inheritedAttrs[key];
        attr = attrs[key];

        if (!attr) {
          attr = attrs[key] = {};
        }

        
        
        

        
        (value['value'] !== undefined) && (attr['value'] = cloneValue(value['value'], attr['value']));

        
        if (isUserValue) continue;

        for (var i in ATTR_OPTIONS) {
          var option = ATTR_OPTIONS[i];
          if (value[option] !== undefined) {
            attr[option] = value[option];
          }
        }
      }
    }

    return attrs;
  }

  function hasOwnProperties(object, properties) {
    for (var i = 0, len = properties.length; i < len; i++) {
      if (object.hasOwnProperty(properties[i])) {
        return true;
      }
    }
    return false;
  }


  
  function isEmptyAttrValue(o) {
    return o == null || 
        (isString(o) || isArray(o)) && o.length === 0 || 
        isEmptyObject(o); 
  }

  
  function isEqual(a, b) {
    if (a === b) return true;

    if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

    
    var className = toString.call(a);
    if (className != toString.call(b)) return false;

    switch (className) {

      
      case '[object String]':
        
        
        return a == String(b);

      case '[object Number]':
        
        
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

      case '[object Date]':
      case '[object Boolean]':
        
        
        
        
        return +a == +b;

      
      case '[object RegExp]':
        return a.source == b.source &&
            a.global == b.global &&
            a.multiline == b.multiline &&
            a.ignoreCase == b.ignoreCase;

      
      case '[object Array]':
        var aString = a.toString();
        var bString = b.toString();

        
        return aString.indexOf('[object') === -1 &&
            bString.indexOf('[object') === -1 &&
            aString === bString;
    }

    if (typeof a != 'object' || typeof b != 'object') return false;

    
    if (isPlainObject(a) && isPlainObject(b)) {

      
      if (!isEqual(keys(a), keys(b))) {
        return false;
      }

      
      for (var p in a) {
        if (a[p] !== b[p]) return false;
      }

      return true;
    }

    
    return false;
  }

$alpha_tag_node_modules__alife_alpha_base_src_attribute_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_base_src_plugin_host_js = function () {
var exports = {}, module = { exports: exports };

var PluginHost = function(config) {

};

PluginHost.prototype = {

    constructor: PluginHost,

    install: function(Plugin, config) {

        var i, ln, name;
        this.__plugins || (this.__plugins = {});

        if (isArray(Plugin)) {
            for (i = 0, ln = Plugin.length; i < ln; i++) {
                this.install(Plugin[i]);
            }
        } else {
            if (Plugin && !isFunction(Plugin)) {
                config = Plugin.cfg;
                Plugin = Plugin.plg;
            }

            if (Plugin && Plugin.Name) {
                name = Plugin.Name;

                config = config || {};
                config.host = this;

                if (this.hasPlugin(name)) {
                    if (this[name].set) {
                        this[name].set(config);
                    }
                } else {
                    this[name] = new Plugin(config);
                    this.__plugins[name] = Plugin;
                }
            }
        }
        return this;
    },

    uninstall: function(Plugin) {

        if (!this.__plugins) return this;

        var name = Plugin,
            plugins = this.__plugins;

        if (Plugin) {
            if (isFunction(Plugin)) {
                name = Plugin.Name;
                if (name && (!plugins[name] || plugins[name] !== Plugin)) {
                    name = null;
                }
            }

            if (name) {
                if (this[name]) {
                    if (this[name].destroy) {
                        this[name].destroy();
                    }
                    delete this[name];
                }
                if (plugins[name]) {
                    delete plugins[name];
                }
            }
        } else {
            for (name in this.__plugins) {
                if (this.__plugins.hasOwnProperty(name)) {
                    this.uninstall(name);
                }
            }
        }
        return this;
    },


    hasPlugin : function(name) {

        if (!this.__plugins) return false;

        return (this.__plugins[name] && this[name]);
    }

};


var toString = {}.toString,
    isFunction = function( it ){
        return toString.call( it ) === '[object Function]';
    },
    isArray = Array.isArray || function(it) {
            return toString.call(it) === '[object Array]'
        };

module.exports = PluginHost;

$alpha_tag_node_modules__alife_alpha_base_src_plugin_host_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_base_base_js = function () {
var exports = {}, module = { exports: exports };



  
  
  

  var Class = $alpha_tag_node_modules__alife_alpha_class_class_js();
  var Events = $alpha_tag_node_modules__alife_alpha_events_events_js();
  var Aspect = $alpha_tag_node_modules__alife_alpha_base_src_aspect_js();
  var Attribute = $alpha_tag_node_modules__alife_alpha_base_src_attribute_js();
  var PluginHost = $alpha_tag_node_modules__alife_alpha_base_src_plugin_host_js();


  module.exports = Class.create({
    Implements: [Events, Aspect, Attribute, PluginHost],

    init: function(config){
      this.initialize.apply(this, arguments);
    },

    initialize: function(config) {
      this.initAttrs(config);
      if (config && config.plugins) {
        this.install(config.plugins);
      }
      
      
      parseEventsFromInstance(this, this.attrs);
    },

    destroy: function() {
      this.off();
      this.uninstall();

      for (var p in this) {
        if (this.hasOwnProperty(p)) {
          delete this[p];
        }
      }

      
      
      this.destroy = function() {};
    }
  });


  function parseEventsFromInstance(host, attrs) {
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        var m = '_onChange' + ucfirst(attr);
        if (host[m]) {
          host.on('change:' + attr, host[m]);
        }
      }
    }
  }

  function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }


$alpha_tag_node_modules__alife_alpha_base_base_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_widget_src_daparser_js = function () {
var exports = {}, module = { exports: exports };



  
  
  

  var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();


  
  exports.parseElement = function(element, raw) {
    element = $(element)[0];
    var dataset = {};

    
    if (element.dataset) {
      
      dataset = $.extend({}, element.dataset)
    }
    else {
      var attrs = element.attributes;

      for (var i = 0, len = attrs.length; i < len; i++) {
        var attr = attrs[i];
        var name = attr.name;

        if (name.indexOf('data-') === 0) {
          name = camelCase(name.substring(5));
          dataset[name] = attr.value
        }
      }
    }

    return raw === true ? dataset : normalizeValues(dataset)
  };


  
  

  var RE_DASH_WORD = /-([a-z])/g;
  var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
  var parseJSON = this.JSON ? JSON.parse : $.parseJSON;

  
  function camelCase(str) {
    return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
      return (letter + '').toUpperCase()
    })
  }

  
  function normalizeValues(data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {

        var val = data[key];
        if (typeof val !== 'string') continue;

        if (JSON_LITERAL_PATTERN.test(val)) {
          val = val.replace(/'/g, '"');
          data[key] = normalizeValues(parseJSON(val))
        }
        else {
          data[key] = normalizeValue(val)
        }
      }
    }

    return data
  }

  
  
  
  function normalizeValue(val) {
    if (val.toLowerCase() === 'false') {
      val = false
    }
    else if (val.toLowerCase() === 'true') {
      val = true
    }
    else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
      var number = parseFloat(val);
      if (number + '' === val) {
        val = number
      }
    }

    return val
  }



$alpha_tag_node_modules__alife_alpha_widget_src_daparser_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_widget_src_auto_render_js = function () {
var exports = {}, module = { exports: exports };



  var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();
  var DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered';


  
  exports.autoRender = function(config) {
    return new this(config).render()
  };


  
  exports.autoRenderAll = function(root, callback) {
    if (typeof root === 'function') {
      callback = root;
      root = null;
    }

    root = $(root || document.body);
    var modules = [];
    var elements = [];

    root.find('[data-widget]').each(function(i, element) {
      if (!exports.isDataApiOff(element)) {
        modules.push(element.getAttribute('data-widget').toLowerCase());
        elements.push(element);
      }
    });

    if (modules.length) {
      seajs.use(modules, function() {

        for (var i = 0; i < arguments.length; i++) {
          var SubWidget = arguments[i];
          var element = $(elements[i]);

          
          if (element.attr(DATA_WIDGET_AUTO_RENDERED)) continue;

          var config = {
            initElement: element,
            renderType: 'auto'
          };

          
          var role = element.attr('data-widget-role');
          config[role ? role : 'element'] = element;

          
          SubWidget.autoRender && SubWidget.autoRender(config);

          
          element.attr(DATA_WIDGET_AUTO_RENDERED, 'true')
        }

        
        callback && callback()
      })
    }
  };


  var isDefaultOff = $(document.body).attr('data-api') === 'off';

  
  exports.isDataApiOff = function(element) {
    var elementDataApi = $(element).attr('data-api');

    
    
    
    return  elementDataApi === 'off' ||
        (elementDataApi !== 'on' && isDefaultOff)
  };



$alpha_tag_node_modules__alife_alpha_widget_src_auto_render_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_widget_src_registry_js = function () {
var exports = {}, module = { exports: exports };

var cache = {}, num = 0;
var DATA_WIDGET_CID = 'data-widget-cid';
var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();




var registry = {
    length : 0,
    



    add : function(widget) {
        var id = widget.cid || uniqueId();
        cache[id] = widget;
        this.length++;
    },
    



    remove : function(widget) {
        if(widget) {
            var id = widget.cid;
            delete cache[id];
            this.length--;
        }
    },
    



    byId : function(id) {
        return cache[id];
    },
    




    byNode : function(node) {
        return cache[node.getAttribute('data-widget-cid')];
    },
    





    findWidgets : function(root, skipNode) {
        var result = [],
            getChildWidgets = function(container) {
                for(var node = container.firstChild; node; node = node.nextSibling){
                    if(node.nodeType == 1) {
                        var widget = registry.byNode(node);
                        if(widget) {
                            result.push(widget);
                        }
                        else if(node !== skipNode) {
                            getChildWidgets(node);
                        }
                    }
                }
            };
        getChildWidgets(root);
        return result;
    },
    






    find : function(root, selector, skipNode) {
        if(!root || !selector) {
            return [];
        }
        var result = [], byNode = this.byNode;
        var widgetEls = $(root).find('['+ DATA_WIDGET_CID +']').filter(selector);
        if(skipNode) {
            widgetEls = widgetEls.not($(skipNode).find('*['+ DATA_WIDGET_CID +']').andSelf());   
        }
        widgetEls.each(function(index, el){
            var widget = byNode(el);
            if(widget) {
                result.push(widget);
            }
        });
        return result;
    },
    
    




    getClosestWidget : function(node) {
        var id;
        while(node) {
            id = node.nodeType == 1 && node.getAttribute('data-widget-cid');
            if(id) {
                return cache[id];
            }
            node = node.parentNode;
        }
        return null;
    }
};
function uniqueId() {
    return '__widget' + num++;
}
module.exports = registry;

$alpha_tag_node_modules__alife_alpha_widget_src_registry_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_widget_widget_js = function () {
var exports = {}, module = { exports: exports };







var Base = $alpha_tag_node_modules__alife_alpha_base_base_js()
var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js()
var DAParser = $alpha_tag_node_modules__alife_alpha_widget_src_daparser_js()
var AutoRender = $alpha_tag_node_modules__alife_alpha_widget_src_auto_render_js()
var registry = $alpha_tag_node_modules__alife_alpha_widget_src_registry_js()
var DELEGATE_EVENT_NS = '.delegate-events-'
var ON_RENDER = '_onRender'
var DATA_WIDGET_CID = 'data-widget-cid'


var cachedInstances = {}

var Widget = Base.extend({

    
    propsInAttrs: ['initElement', 'element', 'events', 'srcNode'],

    
    element: null,

    
    
    
    
    
    
    events: null,

    
    attrs: {
        
        id: null,
        className: null,
        style: null,

        
        template: '<div></div>',

        
        model: null,

        isReplaceWithElement: true,

        
        parentNode: document.body
    },

    
    
    initialize: function(config) {
        this.cid = uniqueCid()

        
        var dataAttrsConfig = this._parseDataAttrsConfig(config)
        Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig)
        this.srcNode = $(this.srcNode);
        
        this.parseElement()
        this.focusNode = this.$((this.focusNode || '[autofocus]'));
        this.initProps()

        
        this.delegateEvents()

        
        this.setup()

        
        this._stamp()
        registry.add(this);

        
        this._isTemplate = !(config && config.element)
    },

    
    _parseDataAttrsConfig: function(config) {
        var element, dataAttrsConfig
        if (config) {
            element = config.initElement ? $(config.initElement) : $(config.element)
        }

        
        if (element && element[0] && !AutoRender.isDataApiOff(element)) {
            dataAttrsConfig = DAParser.parseElement(element)
        }

        return dataAttrsConfig
    },

    
    parseElement: function() {
        var element = this.element

        if (element) {
            this.element = $(element)
        }
        
        else if (this.get('template')) {
            this.parseElementFromTemplate()
        }
        
        if (!this.element || !this.element[0]) {
            throw new Error('element is invalid')
        }
    },

    fillContent: function(){
        var children = $(this.srcNode[0].childNodes),
            content = this.$('[data-role=content]'),
            id = this.srcNode.attr('id');

        if(content.length){
            content.append(children);
        }else{
            this.element.append(children);
        }
        if(this.get('isReplaceWithElement')){
            if(id){
                this.set('id', id);
            }
            this.srcNode.replaceWith(this.element);
        }else{
            this.srcNode.append(this.element[0].childNodes);
            this.element = this.srcNode;
        }
    },

    
    parseElementFromTemplate: function() {
        var template = this.get('template')

        if(isFunction(template)){
            template = template(this.get('model'))
        }

        this.element = $(template)
    },

    
    initProps: function() {
    },

    
    delegateEvents: function(element, events, handler) {
        
        if (arguments.length === 0) {
            events = getEvents(this)
            element = this.element
        }

        
        
        
        
        else if (arguments.length === 1) {
            events = element
            element = this.element
        }

        
        else if (arguments.length === 2) {
            handler = events
            events = element
            element = this.element
        }

        
        else {
            element || (element = this.element)
            this._delegateElements || (this._delegateElements = [])
            this._delegateElements.push($(element))
        }

        
        if (isString(events) && isFunction(handler)) {
            var o = {}
            o[events] = handler
            events = o
        }

        
        for (var key in events) {
            if (!events.hasOwnProperty(key)) continue

            var args = parseEventKey(key, this)
            var eventType = args.type
            var selector = args.selector

                ;(function(handler, widget) {

                var callback = function(ev) {
                    if (isFunction(handler)) {
                        handler.call(widget, ev)
                    } else {
                        widget[handler](ev)
                    }
                }

                
                if (selector) {
                    $(element).on(eventType, selector, callback)
                }
                
                
                else {
                    $(element).on(eventType, callback)
                }

            })(events[key], this)
        }

        return this
    },

    
    undelegateEvents: function(element, eventKey) {
        if (!eventKey) {
            eventKey = element
            element = null
        }

        
        
        if (arguments.length === 0) {
            var type = DELEGATE_EVENT_NS + this.cid

            this.element && this.element.off(type)

            
            if (this._delegateElements) {
                for (var de in this._delegateElements) {
                    if (!this._delegateElements.hasOwnProperty(de)) continue
                    this._delegateElements[de].off(type)
                }
            }

        } else {
            var args = parseEventKey(eventKey, this)

            
            
            if (!element) {
                this.element && this.element.off(args.type, args.selector)
            }

            
            
            else {
                $(element).off(args.type, args.selector)
            }
        }
        return this
    },

    
    setup: function() {
    },

    
    
    
    render: function() {

        
        if (!this.rendered) {
            if(this.srcNode.length){
                this.fillContent(this.srcNode);
            }
            this._renderAndBindAttrs()
            this.rendered = true
        }

        if(this.get('isReplaceWithElement')){
            
            var parentNode = this.get('parentNode')
            if (parentNode && !isInDocument(this.element[0])) {
                
                
                var outerBoxClass = this.constructor.outerBoxClass
                if (outerBoxClass) {
                    var outerBox = this._outerBox = $('<div></div>').addClass(outerBoxClass)
                    outerBox.append(this.element).appendTo(parentNode)
                } else {
                    this.element.appendTo(parentNode)
                }
            }
        }
        return this
    },

    
    _renderAndBindAttrs: function() {
        var widget = this
        var attrs = widget.attrs

        for (var attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) continue
            var m = ON_RENDER + ucfirst(attr)

            if (this[m]) {
                var val = this.get(attr)

                
                if (!isEmptyAttrValue(val)) {
                    this[m](val, undefined, attr)
                }

                
                (function(m) {
                    widget.on('change:' + attr, function(val, prev, key) {
                        widget[m](val, prev, key)
                    })
                })(m)
            }
        }
    },

    _onRenderId: function(val) {
        this.element.attr('id', val)
    },

    _onRenderClassName: function(val) {
        this.element.addClass(val)
    },

    _onRenderStyle: function(val) {
        this.element.css(val)
    },

    
    _stamp: function() {
        var cid = this.cid;

        (this.initElement || this.element).attr(DATA_WIDGET_CID, cid)
        cachedInstances[cid] = this
    },

    
    $: function(selector) {
        return this.element.find(selector)
    },

    





    find : function(selector, skipNode) {
       return registry.find(this.element, selector, skipNode);
    },

    destroy: function() {
        this.undelegateEvents()
        registry.remove(this);
        delete cachedInstances[this.cid]

        
        if (this.element && this._isTemplate) {
            this.element.off()
            
            if (this._outerBox) {
                this._outerBox.remove()
            } else {
                this.element.remove()
            }
        }
        this.element = null

        Widget.superclass.destroy.call(this)
    },

    focus: function () {
        if (this.focusNode) {
            try {
                this.focusNode.focus();
            } catch (e) {

            }
        }
        return this;
    }
})









Widget.query = function(selector) {
    var element = $(selector).eq(0)
    var cid

    element && (cid = element.attr(DATA_WIDGET_CID))
    return cachedInstances[cid]
};

['byId', 'byNode', 'findWidgets', 'find', 'getClosestWidget'].forEach(function(method){
        Widget[method] = registry[method];
    });


Widget.autoRender = AutoRender.autoRender
Widget.autoRenderAll = AutoRender.autoRenderAll
Widget.StaticsWhiteList = ['autoRender']

module.exports = Widget





var toString = Object.prototype.toString
var cidCounter = 0

function uniqueCid() {
    return 'widget-' + cidCounter++
}

function isString(val) {
    return toString.call(val) === '[object String]'
}

function isFunction(val) {
    return toString.call(val) === '[object Function]'
}


var contains = $.contains || function(a, b) {
    
    return !!(a.compareDocumentPosition(b) & 16)
}

function isInDocument(element) {
    return contains(document.documentElement, element)
}

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1)
}


var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/
var EXPRESSION_FLAG = /{{([^}]+)}}/g
var INVALID_SELECTOR = 'INVALID_SELECTOR'

function getEvents(widget) {
    if (isFunction(widget.events)) {
        widget.events = widget.events()
    }
    return widget.events
}

function parseEventKey(eventKey, widget) {
    var match = eventKey.match(EVENT_KEY_SPLITTER)
    var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid

    
    var selector = match[2] || undefined

    if (selector && selector.indexOf('{{') > -1) {
        selector = parseExpressionInEventKey(selector, widget)
    }

    return {
        type: eventType,
        selector: selector
    }
}


function parseExpressionInEventKey(selector, widget) {

    return selector.replace(EXPRESSION_FLAG, function(m, name) {
        var parts = name.split('.')
        var point = widget, part

        while (part = parts.shift()) {
            if (point === widget.attrs) {
                point = widget.get(part)
            } else {
                point = point[part]
            }
        }

        
        if (isString(point)) {
            return point
        }

        
        return INVALID_SELECTOR
    })
}



function isEmptyAttrValue(o) {
    return o == null || o === undefined
}

$alpha_tag_node_modules__alife_alpha_widget_widget_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_position_position_js = function () {
var exports = {}, module = { exports: exports };



    
    
    
    

    var Position = exports,
        VIEWPORT = { _id: 'VIEWPORT', nodeType: 1 },
        $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js(),
        isPinFixed = false,
        isBaseFixed = false,
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE6 = ua.indexOf("msie 6") !== -1;


        
        
        Position.pin = function(pinObject, baseObject) {

            
            pinObject = normalize(pinObject);
            baseObject = normalize(baseObject);

            
            
            if (pinObject.element === VIEWPORT ||
                pinObject.element._id === 'VIEWPORT') {
                return;
            }

            
            
            var pinElement = $(pinObject.element);

            if (pinElement.css('position') !== 'fixed' || isIE6) {
                pinElement.css('position', 'absolute');
                isPinFixed = false;
            }
            else {
                
                isPinFixed = true;
            }


            
            var baseElement = $(baseObject.element);

            if (baseObject.element === VIEWPORT ||
                baseObject.element._id === 'VIEWPORT' ||
                baseElement.css('position') !== 'fixed' || isIE6) {
                isBaseFixed = false;
            }
            else {
                
                isBaseFixed = true;
            }

            
            
            
            posConverter(pinObject);
            posConverter(baseObject);

            var parentOffset = getParentOffset(pinElement);
            var baseOffset = (isPinFixed && isBaseFixed) ? getLeftTop(baseElement) : baseObject.offset();

            
            var top = baseOffset.top + baseObject.y -
                    pinObject.y - parentOffset.top;

            var left = baseOffset.left + baseObject.x -
                    pinObject.x - parentOffset.left;

            
            pinElement.css({ left: left, top: top });
        };

        var POINTS = {
            lt : {
                x : "0",
                y : "0"
            },
            rt : {
                x : "100%",
                y : "0"
            },
            lb : {
                x : "0",
                y : "100%"
            },
            rb : {
                x : "100%",
                y : "100%"
            },
            lc : {
                x : "0",
                y : "50%"
            },
            rc : {
                x : "100%",
                y : "50%"
            },
            cc : {
                x : "50%",
                y : "50%"
            },
            ct : {
                x : "50%",
                y : "0"
            },
            cb : {
                x : "50%",
                y : "100%"
            }
        };

    
    
    Position.center = function(pinElement, baseElement) {
        Position.place(pinElement, baseElement,"cc","cc");
    };

    
    
    
    Position.place = function(pinElement, baseElement, pinPoint, basePoint) {
        Position.pin({
            element: pinElement,
            x: POINTS[pinPoint]["x"],
            y: POINTS[pinPoint]["y"]
        }, {
            element: baseElement,
            x: POINTS[basePoint]["x"],
            y: POINTS[basePoint]["y"]
        });

        var reversed = $(pinElement).data("reversed") || 0;

        if(reversed < 2){
            reverse(pinElement, baseElement, pinPoint, basePoint);
        }

        $(pinElement).data("reversed",0);
    };

    Position.inScreen = function(pinElement, baseElement, pinPoint, basePoint){
        var box = $(pinElement)[0].getBoundingClientRect(),
            pinElementSize = {
                width : $(pinElement).outerWidth(),
                height : $(pinElement).outerHeight()
            },
            winSize = {
                width : $(window).outerWidth(),
                height : $(window).outerHeight()
            };

        var horizontal = true , vertical = true;
        
        if(pinPoint == "lt" || pinPoint == "lb"){
            horizontal = (box.left + pinElementSize.width) <= winSize.width;
        }else{
            horizontal = box.left >= 0;
        }

        
        if(pinPoint == "lt" || pinPoint == "rt"){
            vertical = (box.top + pinElementSize.height) <= winSize.height;
        }else{
            vertical = box.top >= 0;
        }

        return {
            horizontal : horizontal,
            vertical : vertical
        };
    };

    function reverseHorizontalPoint(point){
        return point.replace(/l|r/ig,function(c){
            return {
                l : "r",
                r : "l"
            }[c];
        });
    }

    function reverseVerticalPoint(point){
        return point.replace(/t|b/ig,function(c){
            return {
                t : "b",
                b : "t"
            }[c];
        });
    }

    function reversePoint(point){
        return point.replace(/l|t|r|b/ig,function(c){
            return {
                l : "r",
                r : "l",
                t : "b",
                b : "t"
            }[c];
        });
    }

    function reverse(pinElement, baseElement, pinPoint, basePoint){
        var inScreen = Position.inScreen(pinElement, baseElement, pinPoint, basePoint);

        if(inScreen.horizontal && inScreen.vertical){
            return true;
        }

        
        if(!inScreen.horizontal && !inScreen.vertical){
            pinPoint = reversePoint(pinPoint);
            basePoint = reversePoint(basePoint);
        }

        
        if(!inScreen.horizontal && inScreen.vertical){
            pinPoint = reverseHorizontalPoint(pinPoint);
            basePoint = reverseHorizontalPoint(basePoint);
        }

        
        if(inScreen.horizontal && !inScreen.vertical){
            pinPoint = reverseVerticalPoint(pinPoint);
            basePoint = reverseVerticalPoint(basePoint);
        }

        var reversed = parseFloat($(pinElement).data("reversed"), 10) || 0;
        $(pinElement).data("reversed",reversed + 1);

        Position.place(pinElement, baseElement, pinPoint, basePoint);
    }

    
    
    Position.VIEWPORT = VIEWPORT;


    
    

    
    function normalize(posObject) {
        posObject = toElement(posObject) || {};

        if (posObject.nodeType) {
            posObject = { element: posObject };
        }

        var element = toElement(posObject.element) || VIEWPORT;
        if (element.nodeType !== 1) {
            throw new Error('posObject.element is invalid.');
        }

        var result = {
            element: element,
            x: posObject.x || 0,
            y: posObject.y || 0
        };

        
        var isVIEWPORT = (element === VIEWPORT || element._id === 'VIEWPORT');

        
        result.offset = function() {
            
            if (isPinFixed) {
                return {
                    left: 0,
                    top: 0
                };
            }
            else if (isVIEWPORT) {
                return {
                    left: $(document).scrollLeft(),
                    top: $(document).scrollTop()
                };
            }
            else {
                return getOffset($(element)[0]);
            }
        };

        
        result.size = function() {
            var el = isVIEWPORT ? $(window) : $(element);
            return {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
        };

        return result;
    }

    
    function posConverter(pinObject) {
        pinObject.x = xyConverter(pinObject.x, pinObject, 'width');
        pinObject.y = xyConverter(pinObject.y, pinObject, 'height');
    }

    
    function xyConverter(x, pinObject, type) {
        
        x = x + '';

        
        x = x.replace(/px/gi, '');

        
        if (/\D/.test(x)) {
            x = x.replace(/(?:top|left)/gi, '0%')
                 .replace(/center/gi, '50%')
                 .replace(/(?:bottom|right)/gi, '100%');
        }

        
        if (x.indexOf('%') !== -1) {
            
            x = x.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
                return pinObject.size()[type] * (d / 100.0);
            });
        }

        
        if (/[+\-*\/]/.test(x)) {
            try {
                
                
                
                x = (new Function('return ' + x))();
            } catch (e) {
                throw new Error('Invalid position value: ' + x);
            }
        }

        
        return numberize(x);
    }

    
    function getParentOffset(element) {
        var parent = element.offsetParent();

        
        
        
        if (parent[0] === document.documentElement) {
            parent = $(document.body);
        }

        
        if (isIE6) {
            parent.css('zoom', 1);
        }

        
        var offset;

        
        
        
        
        
        if (parent[0] === document.body &&
            parent.css('position') === 'static') {
                offset = { top:0, left: 0 };
        } else {
            offset = getOffset(parent[0]);
        }

        
        offset.top += numberize(parent.css('border-top-width'));
        offset.left += numberize(parent.css('border-left-width'));

        return offset;
    }

    function numberize(s) {
        return parseFloat(s, 10) || 0;
    }

    function toElement(element) {
        return $(element)[0];
    }

    
    
    
    
    
    
    
    
    
    
    function getOffset(element) {
        var box = element.getBoundingClientRect(),
            docElem = document.documentElement;

        
        return {
            left: box.left + (window.pageXOffset || docElem.scrollLeft) -
                  (docElem.clientLeft || document.body.clientLeft  || 0),
            top: box.top  + (window.pageYOffset || docElem.scrollTop) -
                 (docElem.clientTop || document.body.clientTop  || 0)
        };
    }

    function getLeftTop(element){
        return {
            left: numberize(element.css('left')),
            top: numberize(element.css('top'))
        };
    }



$alpha_tag_node_modules__alife_alpha_position_position_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_overlay_manager_js = function () {
var exports = {}, module = { exports: exports };

var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();

var Manager = {
    


    beginZIndex : 1000,
    


    allOverlays : [],
    


    blurOverlays : [],


    addOverlay: function(overlay, hidden){









        this.allOverlays.push(overlay);
        if(hidden){
            this.blurOverlays.push(overlay);
        }
    },

    




    getCurrentOverlayZIndex : function() {
        var currentOverlay = this.getCurrentOverlay(),
            zIndex;

        if(currentOverlay){
            zIndex = currentOverlay.element.css('zIndex');
        }

        if(typeof zIndex == 'number'){
            return zIndex;
        }
        return this.beginZIndex;
    },
    



    getCurrentOverlay : function() {
        var current;
        this.allOverlays.forEach(function(overlay) {
            if(overlay.get('focused')) {
                current = overlay;
            }
        });
        return current;
    },
    hideBlurOverlays : function(e) {
        this.blurOverlays.forEach(function(overlay) {
            if(overlay.get('visible')) {
                for(var i = 0; i < overlay._relativeElements.length; i++){
                    var el = $(overlay._relativeElements[i])[0];
                    if(el === e.target || $.contains(el, e.target) || !$.contains(document, e.target)) {
                        return;
                    }
                }
                overlay.hide();
            }
        });
    },
    



    removeOverlay: function(overlay){
        var i = this.allOverlays.indexOf(overlay),
            index = this.blurOverlays.indexOf(overlay);

        this.allOverlays.splice(i ,1);
        this.blurOverlays.splice(index, 1);
    }
};

$(document).on('click', function(e){
    Manager.hideBlurOverlays(e);
});

var timeout;
var winWidth = $(window).width();
var winHeight = $(window).height();

$(window).on('resize', function(){
    timeout && clearTimeout(timeout);
    timeout = setTimeout(function() {
        var winNewWidth = $(window).width();
        var winNewHeight = $(window).height();

        
        
        if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
            Manager.allOverlays.forEach(function(overlay){
                if(overlay.get('visible')){
                    overlay.setPosition();
                }
            });
        }

        winWidth = winNewWidth;
        winHeight = winNewHeight;
    }, 80);
});

module.exports = Manager;

$alpha_tag_node_modules__alife_alpha_overlay_manager_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_overlay_overlay_js = function () {
var exports = {}, module = { exports: exports };



    var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js(),
        Position = $alpha_tag_node_modules__alife_alpha_position_position_js(),
        Widget = $alpha_tag_node_modules__alife_alpha_widget_widget_js(),
        log = $alpha_tag_node_modules__alife_alpha_util_log_js(),
        Manager = $alpha_tag_node_modules__alife_alpha_overlay_manager_js();

    var isPad = navigator.userAgent.match(/iPad/i);
    var padShim;

    
    
    
    

    var Overlay = Widget.extend({

        attrs: {
            
            width: null,
            height: null,
            visible: false,
            autoFocus: true,
            zIndex: 99,
            
            align: {
                
                selfXY: [0, 0],
                
                baseElement: Position.VIEWPORT,
                
                baseXY: [0, 0]
            },

            
            parentNode: document.body
        },

        closingReason: {},

        show: function() {
            
            if (!this.rendered) {
                this.render();
            }
            this.set('visible', true);
            return this;
        },

        hide: function() {
            this.closingReason = {cancel: false};
            this.set('visible', false);
            return this;
        },

        cancel: function(){
            this.closingReason = {cancel: true};
            this.set('visible', false);
            return this;
        },

        setup: function() {
            
            this.focusNode = this.element.find('[autofocus]');
            if(!this.focusNode.length){
                this.focusNode = this.element;
            }
            Manager.addOverlay(this);
            
            this._setupIPad();

            this.after('render', function() {
                var pos = this.element.css('position');
                if (this.get('align') && (pos === 'static' || pos === 'relative')) {
                    this.element.css({
                        position: 'absolute',
                        left: '-9999px',
                        top: '-9999px'
                    });
                }
            });
            
            this.after('show', function(){
                this.setPosition();
            });
        },

        destroy: function() {
            Manager.removeOverlay(this);
            return Overlay.superclass.destroy.call(this);
        },

        _setPosition: function(align){
            log.deprecated('_setPosition', 'setPosition', '1.1.0');
            this.setPosition(align);
        },

        
        setPosition: function(align) {
            
            if (!$.contains(document.documentElement, this.element[0])) {
                return;
            }

            align || (align = this.get('align'));

            
            if(!align) {
                return;
            }

            var isHidden = this.element.css('display') === 'none';

            
            if (isHidden) {
                this.element.css({
                    visibility: 'hidden',
                    display: 'block'
                });
            }

            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });

            
            if (isHidden) {
                this.element.css({ visibility: '', display: 'none' });
            }

            return this;
        },



        
        _setupIPad: function(){
            if(isPad){
                if(!padShim){
                    padShim = $('<a href="javascript:void(0);" style="outline:none;display:block;position:absolute;left:0;top:0;zoom:1.01;opacity:1;background-color:transparent;"></a>');
                    padShim.hide().insertBefore($('body')[0].firstChild);

                    var targetElement;

                    
                    padShim.on('click', function(e){
                        padShim.hide();
                        targetElement = document.elementFromPoint(e.clientX, e.clientY);
                        padShim.show();
                    });

                    
                    $(document).on('click', function(e){
                        if(e.target != padShim[0]){
                            return;
                        }

                        var $targetElement = $(targetElement);

                        switch(targetElement.tagName.toLowerCase()){
                            case 'select':
                                fakeMouseEvent(targetElement, e, 'mousedown');
                                break;
                            case 'textarea':
                                $targetElement.focus();
                                break;
                            case 'input':
                                var type = targetElement.type;
                                switch(type){
                                    case 'checkbox':
                                    case 'radio':
                                        fakeMouseEvent(targetElement, e, 'click');
                                        break;
                                    default:
                                        $targetElement.focus();
                                        break;
                                }
                                break;
                            default:
                                fakeMouseEvent(targetElement, e, 'click');
                                break;
                        }
                    });
                }

                this.before('destroy', function(){
                    padShim.hide();
                });

                
                this.on('change:visible', function(val){
                    if(val){
                        var el = this.element;

                        
                        padShim.css('zIndex', el.parent()[0] == document.body ? el.css('zIndex') : 0)
                            .css('width', Math.max(document.documentElement.clientWidth, document.getElementsByTagName('body')[0].offsetWidth))
                            .css('height', Math.max(document.documentElement.clientHeight, document.getElementsByTagName('body')[0].offsetHeight))
                            .show();
                        
                    } else {
                        padShim.hide();
                    }
                });
            }
        },

        
        _blurHide: function(arr) {
            arr = $.makeArray(arr);
            arr.push(this.element);
            this._relativeElements = arr;
            Manager.addOverlay(this, true);
        },

        

        _onRenderWidth: function(val) {
            this.element.css('width', val);
        },

        _onRenderHeight: function(val) {
            this.element.css('height', val);
        },

        _onRenderZIndex: function(val) {
            this.element.css('zIndex', val);
        },

        _onRenderAlign: function(val) {
            this.setPosition(val);
        },

        _onRenderVisible: function(val) {
            if(val){
                this.element.show().removeAttr('aria-hidden');
                if(this.get('autoFocus')){
                    this.set('focused', true);
                }
                this.trigger('show');
            }else{
                this.element.hide().attr('aria-hidden', true);
                this.set('focused', false);
                this.trigger('hide', this.closingReason);
            }
        }

    });



    module.exports = Overlay;


    
    

    function fakeMouseEvent(targetElement, e, type){
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(type, true, true, window, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    }






$alpha_tag_node_modules__alife_alpha_overlay_overlay_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_popup_popup_js = function () {
var exports = {}, module = { exports: exports };



    var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();
    var Overlay = $alpha_tag_node_modules__alife_alpha_overlay_overlay_js();


    
    var Popup = Overlay.extend({

        attrs: {
            
            trigger: {
                value: null, 
                getter: function(val) {
                    return $(val);
                }
            },

            
            triggerType: 'hover', 

            
            delegateNode: {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            },

            
            align: {
                value: {
                    baseXY: [0, '100%'],
                    selfXY: [0, 0]
                },
                setter: function(val) {
                    if (!val) {
                        return;
                    }
                    if (val.baseElement) {
                        this._specifiedBaseElement = true;
                    } else if (this.activeTrigger) {
                        
                        
                        val.baseElement = this.activeTrigger;
                    }
                    return val;
                },
                getter: function(val) {
                    if(!val){
                        return val;
                    }
                    
                    return $.extend({}, val, this._specifiedBaseElement ? {} : {
                        baseElement: this.activeTrigger
                    });
                }
            },

            
            delay: 70,

            
            
            disabled: false,

            
            effect: '',

            
            duration: 250

        },

        setup: function() {
            Popup.superclass.setup.call(this);


            var children;
            if(this.srcNode && this.srcNode.length){
                children = this.srcNode.children();
                this.set('trigger', children.eq(0));
                this.element = children.eq(1);
            }

            this._bindTrigger();
            this._blurHide(this.get('trigger'));

            
            
            this.activeTrigger = this.get('trigger').eq(0);

            
            
            var that = this;
            if (this.get('delegateNode')) {
              this.before('show', function () {
                that._relativeElements = that.get('trigger');
                that._relativeElements.push(that.element);
              });
            }
        },
        
        fillContent: function(){},

        show: function() {
            if (this.get('disabled')) {
                return;
            }
            return Popup.superclass.show.call(this);
        },

        _bindTrigger: function() {
            var triggerType = this.get('triggerType');

            if (triggerType === 'click') {
                this._bindClick();
            } else if (triggerType === 'focus') {
                this._bindFocus(); 
            } else {
                
                this._bindHover();
            }
        },

        _bindClick: function() {
            var that = this;

            bindEvent('click', this.get('trigger'), function(e) {
                if (this.tagName.toLowerCase() === "a") {
                    e.preventDefault();
                }

                
                if (this._active === true) {
                    that.hide();
                } else {
                    
                    makeActive(this);
                    that.show();
                }
            }, this.get('delegateNode'), this);

            
            this.before('hide', function() {
                makeActive();
            });

            
            
            function makeActive(trigger) {
                if (that.get('disabled')) {
                    return;
                }
                that.get('trigger').each(function(i, item) {
                    if (trigger == item) {
                        item._active = true;
                        
                        that.activeTrigger = $(item);
                    } else {
                        item._active = false;
                    }
                });
            }
        },
        
        _bindFocus: function() {
            var that = this;
            var timer;
            
            bindEvent('focus', this.get('trigger'), function() {
                if(timer){
                    clearTimeout(timer);
                    timer = null;
                }

                
                that.activeTrigger = $(this);
                that.show();
            }, this.get('delegateNode'), this);

            bindEvent('blur', this.get('trigger'), function() {
                if(timer){
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function() {
                    (!that._downOnElement) && that.hide();
                    that._downOnElement = false;
                }, that.get('delay'));
            }, this.get('delegateNode'), this);

            
            this.delegateEvents("mousedown", function(e) {
                this._downOnElement = true;
            });
        },
        
        _bindHover: function() {
            var trigger = this.get('trigger');
            var delegateNode = this.get('delegateNode');
            var delay = this.get('delay');

            var showTimer, hideTimer;
            var that = this;

            
            
            if (delay < 0) {
                this._bindTooltip();
                return;
            }

            bindEvent('mouseenter', trigger, function() {
                clearTimeout(hideTimer);
                hideTimer = null;

                
                that.activeTrigger = $(this);
                showTimer = setTimeout(function() {
                    that.show();
                }, delay);
            }, delegateNode, this);

            bindEvent('mouseleave', trigger, leaveHandler, delegateNode, this);

            
            this.delegateEvents("mouseenter", function() {
                clearTimeout(hideTimer);
            });
            this.delegateEvents("mouseleave", leaveHandler);


            function leaveHandler(e) {
                clearTimeout(showTimer);
                showTimer = null;

                if (that.get('visible')) {
                    hideTimer = setTimeout(function() {
                        that.hide();
                    }, delay);
                }
            }
        },

        _bindTooltip: function(){
            var trigger = this.get('trigger');
            var delegateNode = this.get('delegateNode');
            var that = this;

            bindEvent('mouseenter', trigger, function() {
                
                that.activeTrigger = $(this);
                that.show();
            }, delegateNode, this);

            bindEvent('mouseleave', trigger, function() {
                that.hide();
            }, delegateNode, this);
        },

        _onRenderVisible: function(val) {
            var fade = (this.get('effect').indexOf('fade') !== -1);
            var slide = (this.get('effect').indexOf('slide') !== -1);
            var animConfig = {};
            slide && (animConfig.height = (val ? 'show' : 'hide'));
            fade && (animConfig.opacity = (val ? 'show' : 'hide'));
            if (fade || slide) {
                this.element.stop(true, true)
                            .animate(animConfig, this.get('duration'))
                            .css({
                                'visibility': 'visible'
                            });
            } else {
                this.element[val ? 'show' : 'hide']();
            }
        }

    });

    module.exports = Popup;

    
    function bindEvent(type, element, fn, delegateNode, context) {
        var hasDelegateNode = delegateNode && delegateNode[0];

        context.delegateEvents(hasDelegateNode ? delegateNode : element, hasDelegateNode ? type + " " + element.selector : type, function (e) {
            fn.call(e.currentTarget, e);
        });
    }



$alpha_tag_node_modules__alife_alpha_popup_popup_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_templatable_templatable_js = function () {
var exports = {}, module = { exports: exports };



  var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();
  var Handlebars = $alpha_tag_node_modules__alife_alpha_handlebars_handlebars_js()['default'];

  var compiledTemplates = {};

  
  module.exports = {

    
    templateHelpers: null,

    
    templatePartials: null,

    
    templateObject: null,

    
    parseElementFromTemplate: function() {
      
      var t, template = this.get('template');
      if (/^#/.test(template) &&
        (t = document.getElementById(template.substring(1)))) {
        template = t.innerHTML;
        this.set('template', template);
      }
      this.templateObject = convertTemplateToObject(template);
      this.element = $(this.compile());
    },

    
    compile: function(template, model) {
      template || (template = this.get('template'));

      model || (model = this.get('model')) || (model = {});
      if (model.toJSON) {
        model = model.toJSON();
      }

      
      if (isFunction(template)) {
        return template(model, {
          helpers: this.templateHelpers,
          partials: precompile(this.templatePartials)
        });
      } else {
        var helpers = this.templateHelpers;
        var partials = this.templatePartials;
        var helper, partial;

        
        if (helpers) {
          for (helper in helpers) {
            if (helpers.hasOwnProperty(helper)) {
              Handlebars.registerHelper(helper, helpers[helper]);
            }
          }
        }
        
        if (partials) {
          for (partial in partials) {
            if (partials.hasOwnProperty(partial)) {
              Handlebars.registerPartial(partial, partials[partial]);
            }
          }
        }

        var compiledTemplate = compiledTemplates[template];
        if (!compiledTemplate) {
          compiledTemplate = compiledTemplates[template] = Handlebars.compile(template);
        }

        
        var html = compiledTemplate(model);

        
        if (helpers) {
          for (helper in helpers) {
            if (helpers.hasOwnProperty(helper)) {
              delete Handlebars.helpers[helper];
            }
          }
        }
        
        if (partials) {
          for (partial in partials) {
            if (partials.hasOwnProperty(partial)) {
              delete Handlebars.partials[partial];
            }
          }
        }
        return html;
      }
    },

    
    renderPartial: function(selector) {
      if (this.templateObject) {
        var template = convertObjectToTemplate(this.templateObject, selector);

        if (template) {
          if (selector) {
            this.$(selector).html(this.compile(template));
          } else {
            this.element.html(this.compile(template));
          }
        } else {
          this.element.html(this.compile());
        }
      }

      
      else {
        var all = $(this.compile());
        var selected = all.find(selector);
        if (selected.length) {
          this.$(selector).html(selected.html());
        } else {
          this.element.html(all.html());
        }
      }

      return this;
    }
  };


  
  

  var _compile = Handlebars.compile;

  Handlebars.compile = function(template) {
    return isFunction(template) ?
        template : _compile.call(Handlebars, template);
  };

  
  function convertTemplateToObject(template) {
    return isFunction(template) ? null : $(encode(template));
  }

  
  function convertObjectToTemplate(templateObject, selector) {
    if (!templateObject) return;

    var element;
    if (selector) {
      element = templateObject.find(selector);
      if (element.length === 0) {
        throw new Error('Invalid template selector: ' + selector);
      }
    } else {
      element = templateObject;
    }
    return decode(element.html());
  }

  function encode(template) {
    return template
        
        .replace(/({[^}]+}})/g, '<!--$1-->')
        
        .replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g,
        ' data-templatable-$1=$2$3$2');
  }

  function decode(template) {
    return template
        .replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, '$1')
        .replace(/data-templatable-/ig, '');
  }

  function isFunction(obj) {
    return typeof obj === "function";
  }

  function precompile(partials) {
    if (!partials) return {};

    var result = {};
    for (var name in partials) {
      var partial = partials[name];
      result[name] = isFunction(partial) ? partial :
        Handlebars.compile(partial);
    }
    return result;
  }
















$alpha_tag_node_modules__alife_alpha_templatable_templatable_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tpl = function () {
var exports = {}, module = { exports: exports };

module.exports = "<div class=\"ui2-balloon ui2-shadow-normal\">\n\t{{#if complex}}\n\t\t{{#if hasCloseX}}\n            <i class=\"ui2-icon ui2-icon-cross close-balloon\" data-role=\"close\"></i>\n\t\t{{/if}}\n            <div data-role=\"content\"></div>\n\t\t{{#if hasViewMore}}\n    \t\t<a class=\"ui2-action viewmore\" href=\"{{viewmoreLink}}\"><span>{{viewmore}}</span><i class=\"ui2-icon ui2-icon-arrow-right ui2-action-gap\"></i></a>\n\t\t{{/if}}\n\t{{else}}\n\t\t<div data-role=\"content\"></div>\n\t{{/if}}\n\n</div>\n";

$alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tpl = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tips_js = function () {
var exports = {}, module = { exports: exports };






var cachedTips = {};
var initTips = function (config) {
    config = config || {};
    var triggerType = config.triggerType || "click";
    var arrowPosition = config.arrowPosition || 'lt';
    var cacheKey = triggerType + "@" + arrowPosition;

    var trigger = config.trigger || "[data-role=tips]";
    var triggers = trigger.split(',').map(function(item) { return item.trim(); });

    
    var initialTips = config.content || '';
    var initialWidth = config.width || '200';

    var cachedTip = cachedTips[cacheKey];
    var balloon = cachedTip && cachedTip.balloon;
    if(cachedTip) {
        var currentTriggers = cachedTip.triggers;
        var newTriggers = triggers.filter(function(item) {
            return currentTriggers.indexOf(item) === -1;
        });
        if(newTriggers.length > 0) {
            
            triggers = currentTriggers.concat(newTriggers);
            trigger = triggers.join(',');
            balloon.destroy();
        } else {
            
            return balloon;
        }
    }

    balloon = new this({
        events: {
            'before:show': 'beforeShow'
        },
        trigger: trigger,
        triggerType: triggerType,
        arrowPosition: arrowPosition,
        inViewport: true,
        delegateNode: document,

        beforeShow: function() {
            var target = this.activeTrigger;
            this.set('width', target.data('width') || initialWidth);
            
            
            this.set('content', target.data('tips') || initialTips);
        },
        content: initialTips
    });

    cachedTips[cacheKey] = {
        balloon: balloon,
        triggers: triggers
    };

    return balloon;
};

module.exports = initTips;


$alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tips_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_balloon_balloon_js = function () {
var exports = {}, module = { exports: exports };









var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js(),
    Popup = $alpha_tag_node_modules__alife_alpha_popup_popup_js(),
    Templatable = $alpha_tag_node_modules__alife_alpha_templatable_templatable_js(),

    
    DISTANCE = 'distance',
    ARROW_POSITION = 'arrowPosition',
    ALIGN_TYPE = 'alignType',
    OFFSET = 'offset',
    IN_VIEWPORT = 'inViewport',

    
    positionMap = {
        'tl': 'tl',
        'tr': 'tr',
        'rt': 'rt',
        'rb': 'rb',
        'br': 'br',
        'bl': 'bl',
        'lb': 'lb',
        'lt': 'lt'
    },
    
    defaultArrowShift = 17,

    
    classPrefix = 'ui2-balloon-',

    ATTRS = {},

    Balloon;








ATTRS[DISTANCE] = 10;








ATTRS[ARROW_POSITION] = {
    value: 'lt',
    setter: function(val){
        var p = positionMap[val] || 'lt';

        if(!this._oriSet){
            this._originArrowPosition = p;
        }

        return p;
    }
};










ATTRS[ALIGN_TYPE] = {
    value: 'arrow',
    setter: function(val){
        if(val != 'arrow' && val != 'line'){
            val = 'arrow';
        }

        return val;
    }
};








ATTRS[OFFSET] = {
    value: null,
    getter: function(val){
        return val || [0, 0];
    }
};








ATTRS[IN_VIEWPORT] = false;


ATTRS.direction = 'up';


ATTRS.template = $alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tpl();


ATTRS.content = '';
ATTRS.title = '';
ATTRS.hasTitle = false;
ATTRS.hasCloseX = false;
ATTRS.hasViewMore = false;
ATTRS.viewmore = 'View more';
ATTRS.viewmoreLink = '';

Balloon = Popup.extend({

    Implements: [Templatable],

    Statics: {
        tips: $alpha_tag_node_modules__alife_alpha_balloon_src_balloon_tips_js()
    },

    attrs: ATTRS,

    events: {
        'click [data-role="close"]': 'hide'
    },

    
    setup: function() {
        
        this._originArrowPosition = this.get(ARROW_POSITION);
        this._oriSet = false;


        
        
        if(this.get('triggerType') == 'none'){
            this._bindTrigger = this._blurHide = function(){};
        }

        Balloon.superclass.setup.call(this);
    },

    
    
    parseElement: function(){
        this._initModel();

        Balloon.superclass.parseElement.call(this);
    },

    





    _initModel: function(){
        var model = {
                complex: false
            },
            hasCloseX = this.get('hasCloseX'),
            hasViewMore = this.get('hasViewMore'),
            viewmore = this.get('viewmore'),
            viewmoreLink = this.get('viewmoreLink'),
            hasTitle = this.get('title') != '';

        if(hasCloseX || hasTitle || hasViewMore){
            model.complex = true;
            model.hasCloseX = hasCloseX;
            model.viewmore = viewmore;
            model.viewmoreLink = viewmoreLink;
            model.hasViewMore = hasViewMore;
        }

        
        this.set('model', model);
    },

    
    show: function() {
        
        

        Balloon.superclass.show.call(this);

        
        this._makesureInViewport();

        return this;
    },

    
    _makesureInViewport: function(){
        if (this.get(IN_VIEWPORT)){
            var arrowPosition = this._originArrowPosition,
                $window = $(window),
                scrollTop = $window.scrollTop(),
                scrollLeft = $window.scrollLeft(),
                element = this.element,
                distance = this.get('distance'),
                activeTrigger = $(this.activeTrigger),
                triggerOffset = activeTrigger.offset(),
                offset = element.offset();

            
            if(arrowPosition.indexOf('t') > -1){
                
                
                if(triggerOffset.top + activeTrigger.outerHeight() > scrollTop + $window.outerHeight() - (element.outerHeight() + distance)){
                    arrowPosition = arrowPosition.replace('t', 'B');
                }
            }
            
            





            
            if(arrowPosition.indexOf('l') > -1){
                
                
                if(triggerOffset.left + activeTrigger.outerWidth() > scrollLeft + $window.outerWidth() - (element.outerWidth() + distance)){
                    arrowPosition = arrowPosition.replace('l', 'R');
                }
            }
            
            






            
            



            
            this._oriSet = true;
            this.set(ARROW_POSITION, arrowPosition.toLowerCase());
            this._oriSet = false;
        }
    },

    
    




    
    _setAlign: function() {
        var alignObject,
            arrowPosition,
            offset = this.get(OFFSET),
            needSet = false;

        
        alignObject = this._setAlignBase();

        
        





        
        if(this.get(ALIGN_TYPE) == 'line'){
            arrowPosition = this.get(ARROW_POSITION);

            
            switch(arrowPosition.charAt(1)){
                case 'l':
                    alignObject.baseXY[0] = 0;
                    alignObject.selfXY[0] = 0;
                    break;
                case 'r':
                    alignObject.baseXY[0] = '100%';
                    alignObject.selfXY[0] = '100%';
                    break;
                case 't':
                    alignObject.baseXY[1] = 0;
                    alignObject.selfXY[1] = 0;
                    break;
                case 'b':
                    alignObject.baseXY[1] = '100%';
                    alignObject.selfXY[1] = '100%';
                    break;
                default:
                    break;
            }
        }

        
        var offLeft = -offset[0];
        var offTop = -offset[1];
        if(offLeft != 0){
            alignObject.selfXY[0] += ((offLeft > 0 ? '+' : '') + String(offLeft));
        }
        if(offTop != 0){
            alignObject.selfXY[1] += ((offTop > 0 ? '+' : '') + String(offTop));
        }

        
        this.set('align', alignObject);
    },

    
    _setAlignBase: function() {
        var alignObject = {},
            arrowShift = this.get('arrowShift'),
            distance = this.get('distance'),
            pointPos = '50%',
            direction = this.get('direction');

        if (arrowShift < 0) {
            arrowShift = '100%' + arrowShift;
        }

        if (direction === 'up') {
            alignObject.baseXY = [pointPos, 0];
            alignObject.selfXY = [arrowShift, '100%+' + distance];
        }
        else if (direction === 'down') {
            alignObject.baseXY = [pointPos, '100%+' + distance];
            alignObject.selfXY = [arrowShift, 0];
        }
        else if (direction === 'left') {
            alignObject.baseXY = [0, pointPos];
            alignObject.selfXY = ['100%+' + distance, arrowShift];
        }
        else if (direction === 'right') {
            alignObject.baseXY = ['100%+' + distance, pointPos];
            alignObject.selfXY = [0, arrowShift];
        }

        
        return alignObject;
    },

    
    _onRenderArrowPosition: function(val, preVal){
        var direction,
            arrowShift;

        
        switch(val.charAt(0)){
            case 'l':
                direction = 'right';
                break;
            case 'r':
                direction = 'left';
                break;
            case 't':
                direction = 'down';
                break;
            case 'b':
                direction = 'up';
                break;
            default:
                break;
        }

        
        if(val == 'tr' || val == 'rb' || val == 'br' || val == 'lb'){
            arrowShift = -defaultArrowShift;
        } else {
            arrowShift = defaultArrowShift;
        }

        
        this.set('direction', direction);
        this.set('arrowShift', arrowShift);
        this._setAlign();

        
        this.element.removeClass(classPrefix + preVal).addClass(classPrefix + val);
    },

    
    _onRenderAlignType: function(val){
        if(this.rendered){
            this._setAlign();
        }
    },

    

    _onRenderContent: function(val) {
        var ctn = this.$('[data-role="content"]');
        if (typeof val !== 'string') {
            val = val.call(this);
        }
        if(ctn){
            ctn.html(val);
        }

        
        if(this.get('visible')){
            this._setPosition();
            this._makesureInViewport();
        }
    },

    _onRenderTitle: function(val) {
        var ctn = this.$('[datarole="title"]');
        if (typeof val !== 'string') {
            val = val.call(this);
        }
        if (ctn) {
            ctn.html(val);
        }

        
        if (this.get('visible')) {
            this._setPosition();
            this._makesureInViewport();
        }
    }

});

module.exports = Balloon;



$alpha_tag_node_modules__alife_alpha_balloon_balloon_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_node_modules__alife_alpha_mixin_ui_state_js = function () {
var exports = {}, module = { exports: exports };






function UIState(){
    this.before('_mergeInheritedAttrs', initUIStateAttrs);
    this.after('initialize', initDomEventListeners);
}





function initUIStateAttrs() {
    var attrs = this.attrs;

    attrs.disabled = {
        value: null,
        setter: function(val){
            if(typeof val != 'boolean') {
                throw new Error('attrs.disabled must be an boolean!');
            }
            return val;
        }
    };
    attrs.focused = {
        value: null,
        setter: function(val){
            if(typeof val != 'boolean') {
                throw new Error('attrs.focused must be an boolean!');
            }
            var prev = this.get('focused');
            var disabled = this.get('disabled');
            return disabled? prev: val;
        }
    };
    attrs.visible = {
        value: null,
        setter: function(val){
            if(typeof val != 'boolean') {
                throw new Error('attrs.visible must be an boolean!');
            }
            return val;
        }
    };
}




UIState.prototype._onRenderDisabled = function(val, prev, key){
    this.element.toggleClass('disabled', val);
    this.element.attr('aria-disabled', val);
};




UIState.prototype._onRenderVisible = function(val, prev, key){
    this.element.attr('aria-hidden', !val);
    this.element.toggle(val);
};




UIState.prototype._onRenderFocused = function(val, prev, key){
    this.element.toggleClass('focused', val);

    var focusNode;
    if (this.focusNode.length) {
        focusNode = this.focusNode;
    } else {
        focusNode = this.element;
    }
    if (!this._oldTabIndex) {
        this._oldTabIndex = focusNode.attr('tabindex');
    }

    if (val) {
        try {
            focusNode.attr('tabindex', 0);
            focusNode.focus();
        } catch (e) {

        }
    } else {
        try {
            if (this._oldTabIndex != null) {
                focusNode.attr('tabindex', this._oldTabIndex);
            } else {
                focusNode.removeAttr('tabindex');
            }
            focusNode.blur();
        } catch (e) {
        }
    }
};

UIState.prototype.blur = function(){
    this.set('focused', false);
};

UIState.prototype.focus = function(){
    this.set('focused', true);
};






function initDomEventListeners() {
    var focusNode = this.focusNode;
    if(focusNode){
        this.delegateEvents(focusNode, 'focus.uistate.mixin', function(){
            var disabled = this.get('disabled');
            if(!disabled) {
                this.focus();
            }
        });
        this.delegateEvents(focusNode, 'blur.uistate.mixin', function(){
            this.blur();
        });
    }
}



module.exports = UIState;

$alpha_tag_node_modules__alife_alpha_mixin_ui_state_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_handlebars_helper_js = function () {
var exports = {}, module = { exports: exports };

var Handlebars = $alpha_tag_node_modules__alife_alpha_handlebars_handlebars_js();

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
    var operators, result;

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    operators = {
        '==': function (l, r) {
            return l == r;
        },
        '===': function (l, r) {
            return l === r;
        },
        '!=': function (l, r) {
            return l != r;
        },
        '!==': function (l, r) {
            return l !== r;
        },
        '<': function (l, r) {
            return l < r;
        },
        '>': function (l, r) {
            return l > r;
        },
        '<=': function (l, r) {
            return l <= r;
        },
        '>=': function (l, r) {
            return l >= r;
        },
        '&&': function (l, r) {
            return l && r;
        },
        '||': function (l, r) {
            return l || r;
        },
        'typeof': function (l, r) {
            return typeof l == r;
        }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    if (typeof rvalue === 'string' && rvalue.indexOf('||') !== -1) {
        result = false;
        $.each(rvalue.split('||'), function (i, rvalue) {
            result = (result || operators[operator](lvalue, rvalue));
        });
    }
    else if (typeof rvalue === 'string' && rvalue.indexOf('&&') !== -1) {
        result = true;
        $.each(rvalue.split('&&'), function (i, rvalue) {
            result = (result && operators[operator](lvalue, rvalue));
        });
    }
    else {
        result = operators[operator](lvalue, rvalue);
    }

    if (result) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});


$alpha_tag_src_handlebars_helper_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_tpl_tag_basic_tpl = function () {
var exports = {}, module = { exports: exports };

module.exports = "\n<div class=\"ui2-tag ui2-tag-{{type}} ui2-tag-{{subType}} ui2-tag-{{size}}\" data-type=\"{{type}}\" data-subType=\"{{subType}}\">\n\n  <div class=\"ui2-tag-head\"></div>\n\n  <div class=\"ui2-tag-body\" data-role=\"tag-body\">\n    {{content}}\n  </div>\n\n  <div class=\"ui2-tag-tail\" data-role=\"tag-tail\">\n    {{#compare subType '==' 'filter'}}\n      <div class=\"ui2-tag-tail-item ui2-tag-close\">\n        <i class=\"ui2-icon ui2-icon-cross\"></i>\n      </div>\n    {{/compare}}\n  </div>\n  \n</div>\n";

$alpha_tag_src_tpl_tag_basic_tpl = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_tpl_tag_appraise_tpl = function () {
var exports = {}, module = { exports: exports };

module.exports = "\n<div class=\"ui2-tag ui2-tag-{{type}} ui2-tag-{{subType}} ui2-tag-{{size}} {{#if tagNum}}ui2-tag-hasnum{{/if}}\" data-type=\"{{type}}\" data-subType=\"{{subType}}\">\n  <div class=\"ui2-tag-head\"></div>\n  <div class=\"ui2-tag-body\" data-role=\"tag-body\">\n      {{content}}\n  </div>\n  <div class=\"ui2-tag-tail\" data-role=\"tag-tail\">\n    {{#compare subType '!=' 'editting'}}\n\n      {{#if tagNum}}\n        {{#compare tagNum '>' 99}}\n          <div class=\"ui2-tag-tail-item ui2-tag-num\" title=\"{{tagNum}}\">\n            <span class=\"ui2-tag-num-wrap\" data-num=\"{{tagNum}}\">\n              99 <span class=\"ui2-tag-sup\">+</span>\n            </span>\n          </div>\n        {{else}}\n          <div class=\"ui2-tag-tail-item ui2-tag-num\" title=\"{{tagNum}}\">\n           <span class=\"ui2-tag-num-wrap\" data-num=\"{{tagNum}}\">\n             {{tagNum}}\n           </span>\n          </div>\n        {{/compare}}\n      {{else}}\n        <div class=\"ui2-tag-tail-item ui2-tag-num zero\" title=\"\">\n          <span class=\"ui2-tag-num-wrap\" data-num=\"0\">\n            {{tagNum}}\n          </span>\n        </div>\n      {{/if}}\n\n    {{/compare}}\n\n    <div class=\"ui2-tag-tail-item ui2-tag-tail-add\" data-role=\"tag-add\">\n      <i class=\"ui2-icon ui2-icon-add\"></i>\n    </div>\n    <div class=\"ui2-tag-tail-item ui2-tag-tail-minus\" data-role=\"tag-minus\">\n      <i class=\"ui2-icon ui2-icon-subtract\"></i>\n    </div>\n\n    {{#compare subType '==' 'editting'}}\n      <div class=\"ui2-tag-tail-item ui2-tag-tail-cross\">\n        <i class=\"ui2-icon ui2-icon-cross\"></i>\n      </div>\n    {{/compare}}\n  </div>\n</div>\n";

$alpha_tag_src_tpl_tag_appraise_tpl = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_tpl_tag_authen_tpl = function () {
var exports = {}, module = { exports: exports };

module.exports = "\n<div class=\"ui2-tag ui2-tag-{{type}} ui2-tag-{{subType}} ui2-tag-{{size}} {{#compare subType '==' 'widthAppraise'}}{{#if tagNum}}ui2-tag-hasnum{{/if}}{{/compare}}\" data-type=\"{{type}}\" data-subType=\"{{subType}}\">\n  <div class=\"ui2-tag-head\">\n    <div class=\"ui2-tag-head-item\">\n      <i class=\"ui2-icon ui2-icon-assessed-badge\"></i>\n    </div>\n  </div>\n  <div class=\"ui2-tag-body\" data-role=\"tag-body\">\n    {{content}}\n  </div>\n  <div class=\"ui2-tag-tail\" data-role=\"tag-tail\">\n\n    {{#compare subType '==' 'widthAppraise'}}\n      {{#compare tagNum '>' 99}}\n        <div class=\"ui2-tag-tail-item ui2-tag-num\" title=\"{{tagNum}}\">\n          <span class=\"ui2-tag-num-wrap\">\n            99 <span class=\"ui2-tag-sup\">+</span>\n          </span>\n        </div>\n      {{else}}\n        <div class=\"ui2-tag-tail-item ui2-tag-num\" title=\"tagNum\">\n         {{tagNum}}\n        </div>\n      {{/compare}}\n    {{/compare}}\n\n  </div>\n</div>\n";

$alpha_tag_src_tpl_tag_authen_tpl = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_tpl_tag_text_tpl = function () {
var exports = {}, module = { exports: exports };

module.exports = "\n<div class=\"ui2-tag ui2-tag-{{type}} ui2-tag-{{subType}} ui2-tag-{{size}}\" data-type=\"{{type}}\" data-subType=\"{{subType}}\">\n  <div class=\"ui2-tag-head\"></div>\n  \n  <div class=\"ui2-tag-body\" data-role=\"tag-body\">\n    {{content}}\n  </div>\n\n  <div class=\"ui2-tag-tail\" data-role=\"tag-tail\">\n    {{#compare subType '==' 'filter'}}\n      <div class=\"ui2-tag-tail-item ui2-tag-close\">\n        <i class=\"ui2-icon ui2-icon-cross\"></i>\n      </div>\n    {{/compare}}\n  </div>\n  \n</div>\n";

$alpha_tag_src_tpl_tag_text_tpl = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_src_tag_js = function () {
var exports = {}, module = { exports: exports };











'use strict';


var $ = $alpha_tag_node_modules__alife_alpha_jquery_jquery_js();
var Handlebars = $alpha_tag_node_modules__alife_alpha_handlebars_handlebars_js();
var Widget = $alpha_tag_node_modules__alife_alpha_widget_widget_js();
var Balloon = $alpha_tag_node_modules__alife_alpha_balloon_balloon_js();
var UIState = $alpha_tag_node_modules__alife_alpha_mixin_ui_state_js();


$alpha_tag_src_handlebars_helper_js();










var tpls = {
  'basic': $alpha_tag_src_tpl_tag_basic_tpl(),
  'appraise': $alpha_tag_src_tpl_tag_appraise_tpl(),
  'authen': $alpha_tag_src_tpl_tag_authen_tpl(),
  'text': $alpha_tag_src_tpl_tag_text_tpl(),
};





var TAG = '.ui2-tag';




var TAG_BODY = '.ui2-tag-body';




var TAG_SELECT = 'ui2-tag-selected';




var TAIL_ITEM = '.ui2-tag-tail-item';




var TAG_NUM_CONTAINER = '.ui2-tag-num-wrap';








var Tag = Widget.extend({
  Implements: [UIState],
  


















  attrs: {
    template: {
      getter: function() {
        if (!this.get('type')) {
          return null;
        }

        return tpls[this.get('type')];
      }
    },
    parentNode: "body",
    type: 'basic',
    subType: 'link',
    content: "",
    tagNum: '',
    hasPraised: false,
    size: 'default',
    hasTip: false,
    tipContent: '',
    selectCallback: null,
    unSelectCallback: null
  },

  










  events: {
    'click [data-role=tag-body]': 'onClickTagBody',
    'click [data-role=tag-tail]': 'onClickTagTail'
  },

  





  render: function() {
    Tag.superclass.render.call(this);

    $(this.get('parentNode')).append(this.element);

    if (this.get('hasTip')) {
      var content = this.get('tipContent');

      this._makeTip(content);
    }

    this._bindUI();
    return this;
  },

  





  parseElementFromTemplate: function() {
    Tag.superclass.parseElementFromTemplate.call(this);

    var template = Handlebars.compile(this.get('template'));
    template = template({
      content: this.get('content'),
      type: this.get('type'),
      subType: this.get('subType'),
      tagNum: this.get('tagNum'),
      size: this.get('size')
    });

    this.element = $(template);
  },

  







  _makeTip: function(content) {
    var that = this;
    var tagWidth = $(this.element).width();

    that.balloon = new Balloon({
      trigger: $(that.element).find(TAG_BODY),
      arrowPosition: 'tl',
      content: content || '',
      offset: [- (1 * tagWidth / 3), 0]
    });

    return that;
  },

  






  _bindUI: function() {
    var subType = this.get('subType');

    var tail = this.element.find(TAIL_ITEM);

    switch (subType) {
      case 'filter':
        tail.hide();
        break;
      case 'editting':
        tail.hide();
        this.element.find('.ui2-tag-tail-cross').show();
        break;
      case 'appraise':
        this._bindAppraiseEvent();
        break;
    }

  },

  





  _bindAppraiseEvent: function() {
    var that = this;
    var subType = this.get('subType');

    
    if (subType == 'appraise') {
      $(this.element).hover(function() {
        var hasPraised = that.get('hasPraised');

        if (hasPraised) {
          $(this).addClass('ui2-tag-appraise-hover has-praised');
        } else {
          $(this).addClass('ui2-tag-appraise-hover');
        }

      }, function() {
        $(this).removeClass('ui2-tag-appraise-hover has-praised');
      });
    }

  },

  




  _executeCallBack: function() {

    var tagNumContainer  = this.element.find(TAG_NUM_CONTAINER);
    var tagNum           = parseInt(tagNumContainer.data('num'));
    var infiniteNum      = '99 <span class="ui2-tag-sup">+</span>';

    var hasPraised       = this.get('hasPraised');
    var subType          = this.get('subType');
    var type             = this.get('type');
    var unSelectCallback = this.get('unSelectCallback');
    var selectCallback   = this.get('selectCallback');

    
    if (subType == 'appraise' && !hasPraised) {

      if (tagNum + 1 > 99) {
        tagNumContainer.html('<div class="animated fadeInUp add">+1</div>');

        setTimeout(function() {
          tagNumContainer.html(infiniteNum);
        }, 600);

      } else {
        tagNumContainer.text(tagNum + 1);
      }

      $(this.element).find('.zero').show();

      tagNumContainer.data('num', tagNum + 1);

      this.set('hasPraised', true);
      this.trigger('ADD_NUM_SUCCESS', tagNum + 1);
      this.showMinusBtn();
    } else {

      if (tagNum - 1 > 99) {
        tagNumContainer.html('<div class="animated fadeInUp add">-1</div>');

        setTimeout(function() {
          tagNumContainer.html(infiniteNum);
        }, 600);

      } else {
        tagNumContainer.text(tagNum - 1);
      }

      tagNumContainer.data('num', tagNum - 1);

      if (tagNum - 1 === 0) {
        $(this.element).find('.zero').hide();
      }

      this.set('hasPraised', false);
      this.trigger('MINUS_NUM_SUCCESS', tagNum - 1);
      this.showAddBtn();
    }

    
    if ((type == 'basic' || type == 'text') && this.element.hasClass(TAG_SELECT)) {
      if ($.isFunction(unSelectCallback)) {
        unSelectCallback();
      }
    } else if (type == 'basic' || type == 'text') {
      if ($.isFunction(selectCallback)) {
        selectCallback();
      }
    } else if (type == 'appraise' && subType == 'editting') {
      if ($.isFunction(unSelectCallback)) {
        unSelectCallback();
      }
    }
  },

  




  showAddBtn: function() {
    $(this.element).removeClass('has-praised');
  },

  




  showMinusBtn: function() {
    $(this.element).addClass('has-praised');
  },

  




  destroy: function() {
    Tag.superclass.destroy.call(this);

    this.element.find('[data-role=tag-body]').off();
    this.element.find('[data-role=tag-tail]').off();
    this.element.off();
  },

  




  onClickTagTail: function() {

    var subType = this.get('subType');

    if (subType == 'editting' || subType == 'filter') {
      this.element.hide();
    }
    this._executeCallBack();
  },

  




  onClickTagBody: function(e) {
    var type = this.get('type');
    var subType = this.get('subType');
    var target = $(e.currentTarget);
    var root = target.parents(TAG);
    var tail = root.find(TAIL_ITEM);

    if (type == 'authen' || type == 'appraise' || subType == 'link') {
      return false;
    }

    
    if (root.hasClass(TAG_SELECT)) {
      
      if (subType == 'filter') {
        return false;
      }

      this._executeCallBack();

      root.removeClass(TAG_SELECT);

    } else {
      if (subType == 'filter') {
        tail.show();
      }
      this._executeCallBack();
      root.addClass(TAG_SELECT);

    }

    return false;
  },

});

module.exports = Tag;


$alpha_tag_src_tag_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_tag_js = function () {
var exports = {}, module = { exports: exports };

module.exports = $alpha_tag_src_tag_js();


$alpha_tag_tag_js = function () { return module.exports; };
return module.exports;
};
var $alpha_tag_examples_tag_md_js = function () {
var exports = {}, module = { exports: exports };

var modules = {
    "alpha-jquery/jquery" : function () { return $alpha_tag_node_modules__alife_alpha_jquery_jquery_js() },
    "/tag" : function () { return $alpha_tag_tag_js() },
};
window.require = function (id) {
    return (modules[id] || function () { return null })();
};

$alpha_tag_examples_tag_md_js = function () { return module.exports; };
return module.exports;
};
$alpha_tag_examples_tag_md_js();
}());