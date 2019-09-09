(function(){
/*****************************************************************************/
// Color.core.js - rev 42
// Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
// Liscensed under the MIT License (MIT-LICENSE.txt)
// http://www.opensource.org/licenses/mit-license.php
// Created: 2006-12-13 | Updated: 2009-01-05
/*****************************************************************************/
// REFERENCE >> http://www.w3.org/TR/css3-color/
/*****************************************************************************/
// PUBLIC >> Color Constructor
var Color = window.Color = function( code ){
	// skip when no args
	if ( !code ) return;
	// pass through valid color objects...
	if ( isColor( code ) ) return code;
	// trim leading/trailing white-space
	code = code.replace( PATTERN_TRIM, "" );	
	// iterate stored color formats...
	for ( var color, i = 0; i < COLOR_FORMATS.length && !color; i++ )
		// try to implement each color format...
		color = Color[ COLOR_FORMATS[i] ].apply( this, arguments );
	// check for valid color instance
	return isColor( color ) ? color : null; 
	};
/*****************************************************************************/
// PUBLIC >> Extend Color Recognized Formats
Color.format = function( format, func ){
	if ( !func ){ // only one argument
		// iterate as an object for key/value pairs
		for ( var key in format ) Color.format( key, format[ key ] );
		return;
		}	
	// store format in private list
	COLOR_FORMATS[ COLOR_FORMATS.length ] = format;
	// create a static color function
	Color[ format ] = function(){
		// configure the core object values
		var config = func.apply( this, arguments );
		// extend the color instance with config values, or fail
		return  config ? new Color().update( config ) : null;
		};
	};
/*****************************************************************************/	
// PUBLIC >> Extend Color Instance Methods
Color.extend = function( object ){
	if ( object ) merge( Color.prototype, object );
	};
/*****************************************************************************/
// PUBLIC >> Color Methods
Color.extend({
	update: function( obj ){
		// update any passed values
		obj = obj ? merge( this, obj ) : this;
		// fix configured RGB values...
		obj.R = limitRGB( obj.R );
		obj.G = limitRGB( obj.G );
		obj.B = limitRGB( obj.B );
		// fix ALPHA opacity value ( float between 0 and 1 )
		obj.A = Math.min( Math.max( isNaN( obj.A ) ? 1 : obj.A, 0 ), 1 );
		// create the HEX component string... ( to validate )
		obj.X = toHEX( obj.R )+toHEX( obj.G )+toHEX( obj.B );
		return obj; // chain
		},
	hex: function(){
		return '#'+( this.X );
		},
	rgb: function(){
		return 'rgb('+ this.R +','+ this.G +','+ this.B +')';
		},
	html: function(){
		return this.A==0 ? "transparent" : this.hex();
		},
	rgba: function(){
		return 'rgba('+ this.R +','+ this.G +','+ this.B +','+ this.A +')';
		},	
	toStr: function(){ 
		return '(new Color("'+ this.rgba() +'"))'; 
		}
	});
/*****************************************************************************/
// PRIVATE >> Static Methods...
// evaluate color instances, utility
function isColor( clr ){ 
	return clr instanceof Color && clr.X && PATTERN_HEX.test( clr.X ); 
	}; 
// give all "object" properties to the "target" object
function merge( target, object ){
	for ( var key in object ) target[ key ] = object[ key ]; 
	return target;
	};
// limit rgb values ( integer between 0 and 255 )
function limitRGB( v ){ 
	return Math.round( Math.min( Math.max( parseFloat( v ), 0 ), 255 ) ); 
	};
// convert a number to a 2 character hexadecimal string...
function toHEX( n ){ 
	return ( n < 16 ? "0" : "" )+( n ).toString( 16 ).toUpperCase(); 
	};
/*****************************************************************************/
// PRIVATE >> Local Variables	
// stored color formats, numeric regexp pattern fragment
var COLOR_FORMATS = [], NUM = "\\s*(0|-?\\d*[1-9]+\\d*\\.?\\d*)\\s*", 
// regular expression patterns used for parsing
PATTERN_RGB = new RegExp("^rgba?\\("+ NUM +","+ NUM +","+ NUM +"(?:,\\s*(.+)\\s*)?\\)$","i"),
PATTERN_HEX = ( /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i ),
PATTERN_TRIM = ( /^\s+|\s+$/g );
/*****************************************************************************/
// PUBLIC >> Color Formats
Color.format({
	hex: function( hex ){ 
		// "#FFFFFF" | "FFFFFF" | "#FFFFFFFF" 			 
		return ( hex = PATTERN_HEX.exec( hex ) ) ? {
			R: parseInt( hex[1], 16 ), // RED
			G: parseInt( hex[2], 16 ), // GREEN
			B: parseInt( hex[3], 16 ), // BLUE
			A: parseInt( hex[4] || "FF", 16 )/255 // ALPHA
			} : null;
		},
	rgb: function( rgb ){
		// "rgb(255,255,255)" | "rgba(255,255,255,1)"
		return ( rgb = PATTERN_RGB.exec( rgb ) ) ? {
			R: rgb[1], // RED
			G: rgb[2], // GREEN
			B: rgb[3], // BLUE
			A: parseFloat( rgb[4] || "1" ) // ALPHA
			} : null;
		}
	});
/***********************************************************************/
})();(function( Color ){
/*****************************************************************************/
// Color.formats.js - rev 2
// Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
// Liscensed under the MIT License (MIT-LICENSE.txt)
// http://www.opensource.org/licenses/mit-license.php
// Created: 2008-11-13 | Updated: 2008-12-02
/*****************************************************************************/
// REQUIRES: Color.core.js
/*****************************************************************************/
// EXTEND / CONFIGURE COLOR OBJECT FORMATS
Color.format({
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// percentage red, green, blue, alpha ( 0% - 100% )
	"rgb-percent": function( rgb ){
		return ( rgb = PATTERN_RGBPERCENT.exec( rgb ) ) ? {
			R: 255 * parsePercent( rgb[1] ), // RED
			G: 255 * parsePercent( rgb[2] ), // GREEN
			B: 255 * parsePercent( rgb[3] ), // BLUE
			A: ( rgb[4] || "" ).indexOf("%")>0 ? parsePercent( rgb[4] ) : parseFloat( rgb[4] || "1" ) // ALPHA
			} : null;
		},
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// decimal red, green, blue, alpha ( 0 - 1 )
	"rgb-decimal": function( rgb ){
		return ( rgb = PATTERN_RGBDECIMAL.exec( rgb ) ) ? {
			R: 255 * parseFloat( rgb[1] ), // RED
			G: 255 * parseFloat( rgb[2] ), // GREEN
			B: 255 * parseFloat( rgb[3] ), // BLUE
			A: parseFloat( rgb[4] || "1" ) // ALPHA
			} : null;
		},
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// shorthand (3 char) hexadecimal
	"hex-short": function( hx ){
		return ( hx = PATTERN_SHORT.exec( hx ) ) ? {
			R: parseInt( hx[1] + hx[1], 16 ),
			G: parseInt( hx[2] + hx[2], 16 ),
			B: parseInt( hx[3] + hx[3], 16 )
			} : null;						 
		},
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// "?" or "random" or "rand" keyword
	"random": function( str ){
		return PATTERN_RANDOM.test( str ) ? { 
			R: Math.random() * 255, 
			G: Math.random() * 255, 
			B: Math.random() * 255 
			} : null;							
		}, 
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// "transparent" keyword
	"transparent": function( str ){
		return PATTERN_TRANSPARENT.test( str ) ? { R:0, G:0, B:0, A:0 } : null;						 
		}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	});
/*****************************************************************************/
// PRIVATE LOCAL VARIABLES AND FUNCTIONS
var percent = "\\s*(0|-?\\d*\\d+\\d*\\.?\\d*%)\\s*", // Numeric Pattern Fragment
PATTERN_RGBPERCENT = new RegExp("^rgba?\\("+ percent +","+ percent +","+ percent +"(?:,\\s*(.+)\\s*)?\\)$","i"),
decimal = "\\s*(-?[01]?\\.\\d+(?:e[\\+\\-]\\d+)?)\\s*", // Numeric Pattern Fragment
PATTERN_RGBDECIMAL = new RegExp("^rgba?\\("+ decimal +","+ decimal +","+ decimal +"(?:,"+ decimal +")?\\)$","i"),
PATTERN_SHORT = ( /^#?([\da-f])([\da-f])([\da-f])$/i ), 
PATTERN_RANDOM = ( /^random|\?|rand$/i ),
PATTERN_TRANSPARENT = ( /^transparent$/i );
function parsePercent( n ){ return parseFloat( n.replace("%","") )/100; };
/***********************************************************************/
})( window.Color );(function( Color ){
/*****************************************************************************/
// Color.methods.js - rev 39
// Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
// Liscensed under the MIT License (MIT-LICENSE.txt)
// http://www.opensource.org/licenses/mit-license.php
// Created: 2006-12-13 | Updated: 2008-11-12
/*****************************************************************************/
// REQUIRES: Color.js
/*****************************************************************************/
// Color Methods

Color.extend({		  
	attr: function( key, value, callback ){ 
		if ( !key || this[ key ] == null ) return this; // bad arg
		if ( value == null ) return this[ key ]; // read value
		var obj = new Color().update( this ); // copy the object
		if ( typeof value == "string" ) // increment value
			value = ( parseFloat( value ) || 0 ) + obj[ key ]; 
		if ( typeof value == "number" && !isNaN( value ) ){
			obj[ key ] = value; // set exact value
			return callback ? callback.call( obj, key, value ) || obj : obj.update(); // optional callback
			}
		return this;
		},		 
	red: function( val ){ 
		return this.attr( 'R', val ); 
		},
	green: function( val ){ 
		return this.attr( 'G', val ); 
		},
	blue: function( val ){ 
		return this.attr( 'B', val ); 
		},
	alpha: function( val ){ 
		return this.attr( 'A', val ); 
		},
	snap: function( s ){
		return new Color().update({ R: snapTo( this.R, s ), G: snapTo( this.G, s ), B: snapTo( this.B, s ), A: this.A });
		},
	safe: function(){ // 216 "web-safe" palette
		return this.snap( 51 );
		}, 
	smart: function(){ // 4096 "web-smart" palette
		return this.snap( 17 );
		}, 
	"short": function(){ // "web-smart" shorthand hex
		return this.snap( 17 ).hex().replace( /([\da-f]){2}/gi, "$1" ); 
		},
	inv: function(){ 
		return new Color().update({ R: 255-this.R, G: 255-this.G, B: 255-this.B, A: this.A }); 
		},
	gray: function(){ 
		var val = this.R*.299 + this.G*.587 + this.B*.114;
		return new Color().update({ R: val, G: val, B: val, A: this.A });
		},	
	mix: function( clr, pct ){ 
		clr = Color( clr || '#000000' ); 
		pct = Math.max( Math.min( parseFloat( pct ) || .5, 1), 0 );
		return new Color().update({
			R: mixTo( this.R, clr.R, pct ),
			G: mixTo( this.G, clr.G, pct ),
			B: mixTo( this.B, clr.B, pct ),
			A: mixTo( this.A, clr.A, pct )
			}); 
		}
	});


/*****************************************************************************/
// Private Utilities 
//------------------------------------------------
// Snap - used by "Color.prototype.safe" & "Color.prototype.smart" & "Color.prototype.short"
function snapTo( value, num ){ 
	return Math[ value % num <= Math.floor( num / 2 ) ? 'floor' : 'ceil' ]( value / num ) * num; 
	};
//------------------------------------------------
// mixTo - used by "Color.prototype.mix" & "Color.prototype.blend" & "Color.prototype.cycle"
function mixTo( x, y, pct ){ return Math.round( ( x + pct*( y-x ) ) * 1e9 ) / 1e9; };
/***********************************************************************/
})( window.Color ); (function( Color ){
/*****************************************************************************/
// Color.names.js - rev 33 
// Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
// Liscensed under the MIT License (MIT-LICENSE.txt)
// http://www.opensource.org/licenses/mit-license.php
// Created: 2007-01-03 | Updated: 2008-12-12
/*****************************************************************************/
// REQUIRES: Color.js, utils.js
/*****************************************************************************/

/*****************************************************************************/	
// PUBLIC STATIC >> Extends Recognized Color Names

Color.learn = function( color, name ){
	// one argument, iterate as an object for code/name pairs
	if ( !name ) for ( var key in color ) Color.learn( key, color[ key ] );
	// two args, add color code and name(s) to lookup hash tables
	else if ( color = Color( color ) ) { // evaluate color code
		//console.log( color.X, COUNT_CODES++ );
		STORED_NAMES[ color.X ] = STORED_NAMES[ color.X ] || ""; // prep the names
		for ( var i = 0, names = name.split(","); i < names.length; i++ ){ // iterate 
			name = names[ i ].replace( PATTERN_TRIM, "" ); // trim spaces
			if ( name.length ){ // skip empty strings...
				//console.log( name, COUNT_NAMES++ );
				STORED_NAMES[ color.X ] += name+","; // (store) "RRGGBB": "name1,name2,",
				STORED_CODES[ name.toLowerCase() ] = color.X; // (store) "name1": "RRGGBB", 
				}
			}
		}
	};
	
// PRIVATE LOCAL VARIABLES...
var PATTERN_ESCAPE = ( /(\/|\.|\*|\+|\?|\$|\^|\||\(|\)|\[|\]|\{|\}|\\)/g ), // characters to escape for RegExp
PATTERN_TRIM = ( /^\s+|\s+$/g ), STORED_NAMES = [], STORED_CODES = [], COUNT_CODES = 0, COUNT_NAMES = 0;

/*****************************************************************************/	
// EXTEND COLOR FORMATS >> create a color by name
// match exact color names
Color.format( "named", function( name ){
	var hex = STORED_CODES[ name.toLowerCase() ]; // try a case-insensitive lookup...
	return hex ? Color.hex( hex ).update({ N: name }) : null; // use stored hex code
	});
// match partial color names...
Color.format( "name-search", function( name ){
	var hex, pattern = new RegExp("(?:^|,)("+ name.replace( PATTERN_ESCAPE, "\\$1" ) +"[^,]*),", "i" );
	for ( hex in STORED_NAMES ) // iterate color name cache
		if ( name = pattern.exec( STORED_NAMES[ hex ] ) ) // matched a name
			return Color.hex( hex ).update({ N: name[1] }); // use stored hex code
	return null; // no match
	});

/*****************************************************************************/	
// EXTEND COLOR METHODS

Color.extend({
	name: function( str ){
		return str ? this.update({ N: str }) : (( this.N || STORED_NAMES[ this.X ] || "" )+",").split(',')[0]; // lookup color name... 
		},
	learn: function( name ){ 
		this.N = name || this.N;
		Color.learn( this, this.N );
		return this;
		}
	});

Color.total = function( key ){
	var i = 0, obj = key=="codes" ? STORED_NAMES : STORED_CODES, k;
	for ( k in obj ){ i += 1; }
	return i;
	};

/*****************************************************************************/	
// Extends Recognized Color Names

// learn basic color names...
Color.learn({
	'000000': 'Black,',
	'808080': 'Gray,Grey,',
	'C0C0C0': 'Silver,',
	'FFFFFF': 'White,',
	'FF0000': 'Red,',
	'800000': 'Maroon,',
	'00FF00': 'Lime,',
	'008000': 'Green,',
	'0000FF': 'Blue,',
	'000080': 'Navy,',
	'FFFF00': 'Yellow,',
	'808000': 'Olive,',
	'00FFFF': 'Cyan,Aqua,',
	'008080': 'Teal,',
	'FF00FF': 'Magenta,Fuchsia,',
	'800080': 'Purple,'
	}); 
Color._names = STORED_NAMES;
/***********************************************************************/
})( window.Color );(function( Color ){
/*****************************************************************************/
// Color.hsl.js - rev 42
// Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
// Liscensed under the MIT License (MIT-LICENSE.txt)
// http://www.opensource.org/licenses/mit-license.php
// Created: 2008-11-10 | Updated: 2008-12-10

/*****************************************************************************/
// REFERENCE: // http://www.w3.org/TR/css3-color/
// REQUIRES: Color.core.js
// HUE, SATURATION, LUMINOSITY COLOR FORMAT AND METHODS

/*****************************************************************************/
// PUBLIC >> extend the color format "hsl" and "hsla" >> hue, sat, lum, alpha

Color.format( "hsl", function( hsl ){
	return ( hsl = PATTERN_HSL.exec( hsl ) ) ? 
		hsl2rgb( hsl[1], hsl[2], hsl[3], hsl[4] ) : null;
	});

Color.format( "semi-random", function( str ){
	str = ( str || "" ).toLowerCase();
	if ( str.indexOf('*') == -1 ) return null;
	var h1=180, h2=180, s1=50, s2=50, l1=50, l2=50, x;
	if ( x = PATTERN_HUE.exec( str ) ){ // restrict HUE
		h2 = x[1] ? 10 : 30; // +/- h1
		switch ( x[2] ){
			case 'red': h1 = 0; break;
			case 'warm': h2 = 90; // +/- h1
			case 'yellow': h1 = 60; break;
			case 'green': h1 = 120; break;
			case 'cyan': h1 = 180; break;
			case 'cool': h2 = 90; // +/- h1
			case 'blue': h1 = 240; break;
			case 'magenta': h1 = 300; break;
			default: break;
			}
		}
	if ( x = PATTERN_SAT.exec( str ) ) // restrict SAT
		switch ( x[2] ){
			case 'dull': s1 = 25; s2 = x[1] ? 0 : 50; break;
			case 'sharp': s1 = 75; s2 = x[1] ? 100 : 50; break;
			default: break;
			}
	if ( x = PATTERN_LUM.exec( str ) ) // restrict LUM
		switch ( x[2] ){
			case 'dark': l1 = 25; l2 = x[1] ? 0 : 50; break;
			case 'light': l1 = 75; l2 = x[1] ? 100 : 50; break;
			default: break;
			}
	return hsl2rgb( rand(h1-h2,h1+h2), rand(s1,s2), rand(l1,l2) ); // SEMI RANDOM HSL
	});

/*****************************************************************************/
// PUBLIC >> extend the Color methods 

Color.extend({
	hsl: function(){
		makeHSL( this );
		return 'hsl('+ this.H +','+ this.S +','+ this.L +')';
		},
	hsla: function(){
		makeHSL( this );
		return 'hsla('+ this.H +','+ this.S +','+ this.L +','+ this.A +')';
		},
	hue: function( val ){ 
		return makeHSL( this ).attr( 'H', val, updateHSL );
		},
	sat: function( val ){ 
		return makeHSL( this ).attr( 'S', val, updateHSL );
		},
	lum: function( val ){ 
		return makeHSL( this ).attr( 'L', val, updateHSL );
		}
	});

function updateHSL(){ 
	return this.update( hsl2rgb( this.H, this.S, this.L, this.A ) );
	};

/*****************************************************************************/
// PRIVATE >> STATIC METHODS

function makeHSL ( obj ){
	// evaluate object values as fractions
	var red = obj.R/255, gre = obj.G/255, blu = obj.B/255, 
	// min and max values, and difference
	mn = Math.min(red,gre,blu), mx = Math.max(red,gre,blu), df = mx-mn, 
	// component differentials...
	dfR = (((mx-red)/6)+(df/2))/df, 
	dfG = (((mx-gre)/6)+(df/2))/df, 
	dfB = (((mx-blu)/6)+(df/2))/df,
	// converted values...
	lum = ( mx + mn )/2, 
	sat = df==0 ? 0 : lum < .5 ? df/( mx + mn ) : df/( 2 - mx - mn ),
	hue = df==0 ? 0 : red==mx ? dfB - dfG : gre==mx ? ( 1/3 ) + dfR - dfB : ( 2/3 ) + dfG - dfR;
	// update internal values...
	obj.H = Math.round( Math.min( hue*360, 360 ) );
	obj.S = Math.round( Math.min( sat*100, 100 ) );
	obj.L = Math.round( Math.min( lum*100, 100 ) );
	// continue chain
	return obj;
	};

function hsl2rgb( hue, sat, lum, alpha ){
	// evaluate arguments as fractions
	hue = parseFloat( hue ) / 360; 
	sat = parseFloat( sat ) / 100; 
	lum = parseFloat( lum ) / 100;
	alpha = parseFloat( alpha ) || 1;
	// color is completely gray
	if ( sat == 0 ) return { R: lum*255, G: lum*255, B: lum*255, A: alpha }; 
	// calculate conversion adjusting variables...
	var x = ( lum < 0.5 )?( lum * ( 1 + sat ) ):( lum + sat - sat * lum ), y = ( 2 * lum - x );
	return { 
		R: hue2rgb( hue + 1/3, x, y ), 
		G: hue2rgb( hue, x, y ), 
		B: hue2rgb( hue - 1/3, x, y ), 
		A: alpha || 1 
		};
	};

function hue2rgb( hue, x, y ){
	hue += hue < 0 ? +1 : hue > 1 ? -1 : 0; // rotate hue
	hue = 6 * hue < 1 ? y + ( x - y ) * 6 * hue : 2 * hue < 1 ? x : 
		3 * hue < 2 ? y + ( x - y )*( ( 2 / 3 ) - hue ) * 6 : y;
	return Math.ceil( 255 * hue );
	};

// random number between two numbers
function rand( x, y ){
	var mn = Math.min( x, y ), 
	df = Math.max( x, y ) - mn;
	return Math.random() * df + mn; 
	};

/*****************************************************************************/
// PRIVATE >> Local Variables

var digit = "(-?\\d*\\.?\\d+(?:e[\\+\\-]\\d+)?%?)", // RegExp Number Fragment
PATTERN_HSL = new RegExp("^hsla?\\("+digit+","+digit+","+digit+"(?:,"+digit+")?\\)$","i"),
PATTERN_HUE = (/(?:\*|\s)(very|\+)?\s?(warm|red|yellow|green|cool|cyan|blue|magenta)(?:\s|$)/),
PATTERN_SAT = (/(?:\*|\s)(very|\+)?\s?(dull|sharp)(?:\s|$)/),
PATTERN_LUM = (/(?:\*|\s)(very|\+)?\s?(dark|light)(?:\s|$)/);

/***********************************************************************/
})( window.Color );