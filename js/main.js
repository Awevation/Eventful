//Global variables are definitely OK
var markers;
var lonLat;
var zoom;

$(document).ready(function() {
    //hide popups
    $("#shareDialog").hide();
    main();
});

function main() {
        map = new OpenLayers.Map("mainMap");
        var mapnik = new OpenLayers.Layer.OSM();
        map.addLayer(mapnik);
                        
        map.setCenter(new
        OpenLayers.LonLat(3,3) // Center of the map
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
          ), 1 // Zoom level
         );
        markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers);
	init();
}

function init() {
    //setup Set form
    $( "#shareButton" ).click(function() {
	navigator.geolocation.getCurrentPosition(function(position) {       
		var lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
		.transform(
		    new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984 
		    map.getProjectionObject() //to Spherical Mercator Projection
		    );
                                            
	    markers.addMarker(new OpenLayers.Marker(lonLat));
           
	    map.setCenter(lonLat, 14);
	    }); 
	});

    $("#setButton").click(function() {
	popupSet();
    });
}

//Popup the share dialog
function popupSet() {
    $("#shareDialog")
	.dialog({
	    position: [100, 100],
	    autoOpen: true,
	    width: 200,
	    draggable: false,
	    closeText: ""
	});

    $("#formSubmit").click(function() {
	//go all ajax on Chrome's ass
	$("#shareForm").submit(function() {
	    $.get("http://nominatim.openstreetmap.org/search.php?format=json&q=" + $("input#where").val(), function(data) {
		res = $.parseJSON(data);
		lonLat = new OpenLayers.LonLat(res[0].lon, res[0].lat).transform(
		    new OpenLayers.Projection("EPSG:4326"), //transform from WGS 1984 
		    map.getProjectionObject() //to Spherical Mercator Projection
		    );
		map.setCenter(lonLat, 15);
		markers.addMarker(new OpenLayers.Marker(lonLat));

		$.post("/postLonLat", function(data) {
		    console.log(data);
		});
	    });

	    $("input#where").val("");
	    $("input#when").val("");
	    $("input#what").val("");

	    return false;
	});
	$( "#shareDialog" ).dialog("close");
    });
}

function addMarker(lonLat, dialog) {
    markers.addMarker(new OpenLayers.Marker(lonLat));
    
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
	    lonLat, null,
   	    '<a target="_blank" href="http://openlayers.org/"></a> ' +
	    dialog, null,
	    true // <-- true if we want a close (X) button, false otherwise
	    );
    map.addPopup(popup);
}

function getLocation() {
    if(navigator.geolocation) {
	loc = {lon: 0, lat: 0};
	navigator.geolocation.getCurrentPosition(function(pos) {
	    loc.lon = pos.coords.longitude;
	    loc.lat = pos.coords.latitude;
	    return loc;
	});
    } else {
	alert("Your browser does not support, or has not got enabled, geolocation :(");
    }

    return loc;
}

function parseForm() {
    $("#shareDialog").submit(function () {
	$.get('parseForm.php?' + $('#shareDialog').serialize())

	$.post('parseForm.php', $("#shareDialog").serialize())

	$.get('index.html', function(data) {
	      $('#title').html(data);
	        alert('Load was performed.');
	});
	return false;
    });
}
	
