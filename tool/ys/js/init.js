(function( $, Color ){
/******************************************************************************/
// page manager singleton
var MGR = {
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 MAIN SWATCH AND LOCATION...
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	changedURL: function(){
		// store the current location
		MGR.currentURL = String( window.location );
		// compare with previous
		if ( MGR.previousURL === MGR.currentURL ) return false;
		// remember the current for next compare
		MGR.previousURL = MGR.currentURL;
		return true; // URL changed
		},
	// extract the color info from location
	getURLcolor: function(){
		return Color( MGR.currentURL.split('#')[1] );
		},
	// set the color info to the location
	setURLcolor: function( color ){
		window.location = color.hex();
		},
	// periodically check location for a color...
	recurse: function(){
		if ( MGR.stopped ) return;
		MGR.timer = setTimeout( function(){
			MGR.loadColor(); // query the location
			MGR.recurse(); // recurse
			}, 300 );
		},
	// start the recursive polling
	start: function(){
		MGR.stopped = false;
		MGR.loadColor();
		MGR.recurse();
		},
	// stop the recursive polling
	stop: function(){
		clearTimeout( MGR.timer );
		MGR.stopped = true;
		},
	// update the color location
	loadColor: function(){
		// if the URL has not changed, stop
		if ( MGR.stopped || !MGR.changedURL() ) return;
		// create the color, from location...
		MGR.color = MGR.getURLcolor();
		// validate that we found a correct color...
		if ( !MGR.color ) return;
		// set the URL to the standard
		MGR.setURLcolor( MGR.color );
		// update the page with the color...
		MGR.$swatch.css( 'background-color', MGR.color.hex() );
		MGR.$code.html( MGR.color.hex() );
		MGR.$name.html( MGR.color.name() )
			.css( "color", MGR.color.gray().lum()<40 ? "#FFF" : "#000" );
		},
	// initialize the page
	init: function(){
		// store refs to some page elements
		MGR.$swatch = $('#swatch');
		MGR.$code = $("#hexcode");
		MGR.$name = $('#colorname');
		// bind some events...
		$('#logo').bind("click",function(){
			window.location = Color('?').hex();
			return false;
			});
		// load the initial color...
		MGR.start();
		// load some colored swatches...
		MGR.initSwatches();
		},	
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 NAMED SWATCHES...
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	// remotely get swatches	
	getSwatches: function( lastpointer ){
		// add in remote call later on...
		return Color._names;
		}, 
	// load some swatches...
	loadSwatches: function(){
		var obj = MGR.getSwatches(), i = 0, hex, html,
		$section = $('<div class="sect" />');
		// iterate and add swatches
		for ( hex in obj ){
			html = '<div class="swatch" style="background-color:#'+( hex )+'" '
				+'title="'+( obj[ hex ].split(",")[0] )+'">&nbsp;</div>';
			$( html ).appendTo( $section ); 
			if ( i++ > 999 ) break;
			}
		MGR.$swatchesDiv.append( $section );
		MGR.startSwatches( $section, i );
		},
	// animate some swatches...
	moveSwatches: function( x, auto ){
		//if ( MGR.swatchesStopped ) 
			return;
		MGR.swatchesTimer = setTimeout( function(){					 
			// find the new position...
			var pos = ( auto ? x * MGR.swatchDir : x ) + MGR.lastPos;
			// pan to the right...
			if ( auto && pos < MGR.viewport - MGR.section ) MGR.swatchDir = +1;
			// pan to the left...
			else if ( auto && pos >= 0 ) MGR.swatchDir = -1;
			// limit the positon...
			pos = Math.max( Math.min( pos, 0 ), MGR.viewport - MGR.section ); 
			// set the new position...
			MGR.$swatchesSection.animate({ left: pos }, 300, "linear" );
			// remember 
			MGR.lastPos = pos;
			// recurse
			MGR.moveSwatches( x, auto ); 
			}, 300 );
		},
	stopSwatches: function( x ){
		clearTimeout( MGR.swatchesTimer );
		if ( MGR.$swatchesSection ) MGR.$swatchesSection.stop();
		if ( x ) MGR.moveSwatches( x );
		else MGR.swatchesStopped = true;
		},
	// initialize the animation props	
	startSwatches: function( $section, num ){
		return;
		MGR.stopSwatches();
		MGR.swatchesStopped = false;
		if ( $section ){
			MGR.section = num*35;
			MGR.$swatchesSection = $section.width( MGR.section );
			MGR.swatchTotal = num;
			MGR.lastPos = 0;
			MGR.swatchDir = -1;
			}
		MGR.viewport = MGR.$swatchesDiv.width();
		MGR.moveSwatches( 5, true );
		},
	// initialize the swatches...
	initSwatches: function(){
		// reference the container element
		MGR.$swatchesDiv = $('#swatches')
		/*
			.bind("mouseenter", function(){ MGR.stopSwatches(); })
			.bind("mouseleave", function(){ MGR.startSwatches(); });
		$('#swatchesLeft')
			.bind("mouseenter", function(){ MGR.stopSwatches( -50 ); })
			.bind("mouseleave", function(){ MGR.startSwatches(); });
		$('#swatchesRight')
			.bind("mouseenter", function(){ MGR.stopSwatches( +50 ); })
			.bind("mouseleave", function(){ MGR.startSwatches(); });
			*/
		// event delegation...
		$('.swatch', MGR.$swatchesDiv ).live("click",function(){
			var clr = $( this ).css("background-color");
			if ( clr = Color( clr ) ) window.location = clr.hex();									 
			});
		MGR.loadSwatches();
		},
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 CUBE IMAGE...
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	/*
	//$div.loadImage( "hexspace", color.hex );
	//$data.loadImage( "components", color.hex );
	$.fn.loadImage = function( type, hex ){
		var $elem = $( this ).html(""),
		img = new Image();
		img.title = hex;
		img.onload = function(){ 
			$elem.append( img );
			};
		img.src = 'img/'+ type +'.php?x='+ hex;
		return this;
		};
		*/
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 RGB SLIDERS...
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	
	/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 HSL PICKER...
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	
	// no trailing commas...
	iesucks: true
	};
// attach to the body/dom.ready event
$( document.body ).bind( "ready", MGR.init );
/******************************************************************************/		  
})( jQuery, Color );