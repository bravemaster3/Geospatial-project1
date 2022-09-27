	// Initialize the map and assign it to a variable for later use
	// there's a few ways to declare a VARIABLE in javascript.
	// you might also see people declaring variables using `const` and `let`
	var map = L.map('map', {
	    // Set latitude and longitude of the map center (required)
	    center: [64.17, 19.55],
	    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
	    zoom: 13
	});
	 

	// Creating tile layers and adding one to the map it to the map
	var osm = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	  minZoom: 5}).addTo(map);

	var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		minZoom: 5,
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});

	var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    minZoom: 5,
    subdomains:['mt0','mt1','mt2','mt3']
    });


	//Creating styles for the geojson files

	var catchmentsStyle = {
	    weight:1,
	    fillColor:"blue",
	    color: "blue",
	    fillOpacity:0.05
	}

	var EC_footprint_90Style = {
	    weight:2,
	    //fillColor:"white",
	    color: "yellow",
	    fillOpacity:0
	}

	var boardwalksStyle = {
    weight:2,
    color:"black"
    }

    var EC_towersStyle ={
/*    radius:6,
    fillColor:"green",
    color:"red",
    weight:1*/

	shape: "triangle",
	radius: 5,
	fillColor: "black",
	fillOpacity: 0.5,
	color: "white",
	weight: 1
    }

    var weirsStyle = {		
	shape: "star-5",
	radius: 10,
	fillColor: "cyan",
	fillOpacity: 0.8,
	color: "white",
	weight: 1
	}


	//Adding the geojson files
	var catchments_layer = L.geoJSON(catchments, {
		style : catchmentsStyle,
		onEachFeature:function(feature, layer){

        area = turf.area(feature)/10000
        center = turf.center(feature)

        center_long = center.geometry.coordinates[0]
        center_lat = center.geometry.coordinates[1]

        var label = `Catchment: ${feature.properties.Site}<br>` + 
        `Area: ${area.toFixed(2)} ha <br>`+
        `Center: Long ${center_long.toFixed(2)}, Lat ${center_lat.toFixed(2)}`
        
        layer.bindPopup(label)
    }
	}).addTo(map)
	var EC_footprints_layer = L.geoJSON(EC_footprint_90, {
		style: EC_footprint_90Style,
		onEachFeature:function(feature, layer){
			layer.bindPopup(feature.properties.layer)
		}
	}).addTo(map)

	var boardwalks_layer = L.geoJSON(boardwalks, {
		style : boardwalksStyle
	}).addTo(map)

	var EC_towers_layer = L.geoJSON(EC_towers, {
		pointToLayer: function(feature, latlng){
        /*return L.circleMarker(latlng, EC_towersStyle)*/
        return L.shapeMarker(latlng, EC_towersStyle)
    	},
    	onEachFeature:function(feature, layer){

	        var label = `EC tower: ${feature.properties.Site}`
	        layer.bindPopup(label)
    	}
	}).addTo(map)

	var weirs_layer = L.geoJSON(weirs, {
		pointToLayer: function(feature, latlng){
			return L.shapeMarker(latlng, weirsStyle)
		},
		onEachFeature:function(feature, layer){
			var label = `Weir ID: ${feature.properties.ID}<br>` + 
	        `Site: ${feature.properties.Site}`
        
        layer.bindPopup(label)
		}
	}).addTo(map)

	//programming the actions of the checkboxes
	var osmRadio = document.getElementById("osmRadio")
	var OpenTopoMapRadio = document.getElementById("OpenTopoMapRadio")
	var googleTerrainRadio = document.getElementById("googleTerrainRadio")

	var catchmentsCheck = document.getElementById("catchmentsCheck")
	var EC_footprintsCheck = document.getElementById("EC_footprintsCheck")
	var boardwalksCheck = document.getElementById("boardwalksCheck")
	var EC_towersCheck = document.getElementById("EC_towersCheck")
	var weirsCheck = document.getElementById("weirsCheck")


	var baseLayers = {
		"osm": osm,
		"Open Topo Map": OpenTopoMap,
		"Google terrain": googleTerrain
	}

	osmRadio.onclick = function(){
		if($(this).is(':checked'))	baseLayers["osm"].addTo(map)
		else this._map.removeLayer(osm)
	}


	OpenTopoMapRadio.onclick = function(){
		if($(this).is(':checked'))	baseLayers["Open Topo Map"].addTo(map)
		else map.removeLayer(OpenTopoMap);
	}

	googleTerrainRadio.onclick = function(){
		if($(this).is(':checked'))	baseLayers["Google terrain"].addTo(map)

		else map.removeLayer(googleTerrain)
	}



	catchmentsCheck.onclick = function(){
		if($(this).is(':checked'))	catchments_layer.addTo(map)
		else map.removeLayer(catchments_layer)
	}
	EC_footprintsCheck.onclick = function(){
		if($(this).is(':checked'))	EC_footprints_layer.addTo(map)
		else map.removeLayer(EC_footprints_layer)
	}
	boardwalksCheck.onclick = function(){
		if($(this).is(':checked'))	boardwalks_layer.addTo(map)
		else map.removeLayer(boardwalks_layer)
	}
	EC_towersCheck.onclick = function(){
		if($(this).is(':checked'))	EC_towers_layer.addTo(map)
		else map.removeLayer(EC_towers_layer)
	}
	weirsCheck.onclick = function(){
		if($(this).is(':checked'))	weirs_layer.addTo(map)
		else map.removeLayer(weirs_layer)
	}


//add print control to the map
L.control.browserPrint({position: 'topleft'}).addTo(map);

//Mouse move coordinates

map.on('mousemove', function(e){
    //console.log(e)
    $("#coordinates").html(`Lat:${e.latlng.lat.toFixed(3)}, Long:${e.latlng.lng.toFixed(3)}`)
})