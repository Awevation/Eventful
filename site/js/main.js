//Global variables are definitely OK
var markers;

$(document).ready(function() {
    main();
});

function main() {
    map = new OpenLayers.Map("mainMap");
    map.addLayer(new OpenLayers.Layer.OSM());
    map.zoomToMaxExtent();
    var lonLat = new OpenLayers.LonLat( -0.1279688 ,51.5077286 )
	.transform(
		new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
		map.getProjectionObject() // to Spherical Mercator Projection
		);

    var zoom=17;

    // A popup with some information about our location	 
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
	    lonLat, null,
   	    '<a target="_blank" href="http://openlayers.org/">We</a> ' +
	    'could be here.<br>Or elsewhere.', null,
	    true // <-- true if we want a close (X) button, false otherwise
	    );

    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
		     
    //markers.addMarker(new OpenLayers.Marker(lonLat));

    var dialog = "Oh, hey there. I'm an event. Nearly. ";
    addMarker(lonLat, dialog);
    
    //markers.addMarker(new OpenLayers.Marker(lonLat));

    map.setCenter(lonLat, zoom);
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
	
