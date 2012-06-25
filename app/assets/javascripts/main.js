var map;

var OSM = {};


var def_val = {
    lat : 48.856583,
    lng : 2.352276,
    zoom : 13
};

OSM.misc = {};
OSM.ux = {};
OSM.map = {};

OSM.misc.addZone = function() {    
    var path = [['48.853613', '2.271012'],
		['48.833874', '2.286961'],
		['48.840944', '2.274786']];
    
    polygon = map.drawPolygon({
	paths: path, // pre-defined polygon shape
	strokeColor: '#BBD8E9',
	strokeOpacity: 1,
	strokeWeight: 3,
	fillColor: '#BBD8E9',
	fillOpacity: 0.6,
	infoWindow: {
	    content: '<p>HTML Content</p>'
	}
    });
}


/*
 * Set map center when element clicked on sidebar
 */
OSM.ux.handleSidebar = function() {
    var sidebar = $('#sidebar');
    
    sidebar.find('li').each(function() {
	$(this).click(function() {
	    var clicked_id = $(this).attr('data-id');
	    var markers = map.markers;

	    for (var i = 0; i < markers.length; i++) {
		if (markers[i].details == clicked_id) {
		    
		    map.setCenter($(this).attr('data-lat'), $(this).attr('data-lng'));
		    // Hidde all infoWindow
		    map.hideInfoWindows();
		    // Activate marker
		    markers[i].activate();
		    
		    break;
		}
	    }
	});
    });
}

/*
 * Init all buttons
 */
OSM.map.reset_map = function() {
    map.setCenter(def_val.lat, def_val.lng);
    map.setZoom(def_val.zoom);
    map.hideInfoWindows();
}

var explIndex = 1;

OSM.ux.initUX = function() {
    $('#set-center').click(function() {	
	OSM.map.reset_map();
    });

    $(window).resize(function() {
	resize();
    });
    
    $('#launch-exploration').click(function() {
	map.setZoom(18);

	setInterval(function() {
	    if (map.markers[explIndex] == null) {
		OSM.map.reset_map();
		return;
	    }
	    map.hideInfoWindows();
	    // Activate marker
	    map.markers[explIndex].activate();	    
	    explIndex++;
	}, 8000);
	
	
    });    
}

function backgroundSound() {
    var el = document.getElementById('background-sound');
    el.volume = 0.3;

    var swi = 'on';

    if ($.cookie('sound'))
	swi = $.cookie('sound');
    

    $('#switch-sound').click(function() {
	if (swi == 'on') {
	    swi = 'off';
	    el.pause();
	    $(this).html('Sound');
	    $.cookie('sound', 'off');
	}
	else {
	    swi = 'on';
	    el.play();
	    $(this).html('Stop Sound');
	    $.cookie('sound', 'on');
	}
    });

    if ($.cookie('sound') == 'off') {
	el.pause();
	swi = 'off';
	$('#switch-sound').html('Sound');
    }    
}

function displayCoordinates() {
    var lat_disp = $('#lat-disp');
    var lng_disp = $('#lng-disp');

    map.addMarker({
	lat: def_val.lat,
	lng: def_val.lng,
	draggable: true,
	infoWindow: {
	    content: '<p><div id="sisilng">0</div><div id="sisilat">0</div></p>'
	},
	position_changed : function(e) {
	    if (e) {
		// lat_disp.val(e.position.$a);
		// lng_disp.val(e.position.ab);
		$('#sisilng').html(e.position.$a);
		$('#sisilat').html(e.position.ab);
	    }
	}
    });   
}

function resize() {
    var main_content_size = $(window).width() - $('#sidenav').width() - $('#sidebar').width();
    $('#map-part').width(main_content_size);
    $('#map').height($(window).height() - $('#map-top').height());
}

function geocode(addr) {

    var sidebar = $('#sidebar');
    
    sidebar.find('li').each(function() {
	var self = $(this);

	GMaps.geocode({
	    //address: '2 place rodin paris',
	    lat : self.attr('data-lat'),
	    lng : self.attr('data-lng'),
	    callback: function(results, status) {
		if (status == 'OK') {
		    
		    var dt = results[0].address_components;
		    
		    for (var i = 0; i < dt.length; i++) {
			if (dt[i].types) {
			    for (var j = 0; j < dt[i].types.length; j++) {
				if (dt[i].types[j] == 'postal_code') {
				    self.find('.arrondissement-prev').append(dt[i].short_name);
				}
			    }
			}
		    }
		    
		}
	    }
	});

    });    
}


$().ready(function() {


    // Set Zone draggable max
    var strictBounds = new google.maps.LatLngBounds(
	new google.maps.LatLng(48.79725231471425, 2.200184020019492), 
	new google.maps.LatLng(48.95316965864623, 2.4877168264159764)
    );
    

    map = new GMaps({
	div: '#map',
	lat: def_val.lat,
	lng : def_val.lng,
	zoom : def_val.zoom,
	overviewMapControl: true,
	overviewMapControlOptions: {
	    opened: true
	},
	minZoom : 12,
	//mapType : 'Hybrid',
	dragend: function(e) {
	    
	    // Restrict dragging outside Paris zone
	    if (strictBounds.contains(map.getCenter())) return;
	    var c = map.getCenter(),
            x = c.lng(),
            y = c.lat(),
            maxX = strictBounds.getNorthEast().lng(),
            maxY = strictBounds.getNorthEast().lat(),
            minX = strictBounds.getSouthWest().lng(),
            minY = strictBounds.getSouthWest().lat();

	    if (x < minX) x = minX;
	    if (x > maxX) x = maxX;
	    if (y < minY) y = minY;
	    if (y > maxY) y = maxY;

	    map.setCenter(y, x);
	}
    });

    console.log(map.mapTypeId);

    map.addControl({
	position: 'top_right',
	text: 'Reset center',
	style: {
	    margin: '5px',
	    padding: '1px 6px',
	    border: 'solid 1px #717B87',
	    background: '#fff'
	},
	events: {
	    click: function(){
		OSM.map.reset_map();
	    }
	}
    });

    OSM.ux.initUX();
    OSM.misc.addZone();
    displayCoordinates();
    resize();

    AddDynamicMarkers();
    //AddDynamicMarkers2();

    geocode();
    OSM.ux.handleSidebar();
    backgroundSound();
});
