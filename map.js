
async function getMeterStatus(latitude, longitude) {
    addSearchBar();
    var parkingMeterRepository = new ParkingMeterRepository();
    var vacantParkingMeterList = await parkingMeterRepository.fetchVacantMeters(latitude,longitude);
    if(!vacantParkingMeterList || vacantParkingMeterList.length == 0) console.log("Unfortunately no meter spots are free at the moment.")
    else {
        console.log("Found a vacant spot-Finally")
        console.log(vacantParkingMeterList);
    }  
}


function addSearchBar(){
    var map;
		$(document).ready(function(){
			mapboxgl.accessToken = MapBoxKey;
			map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v11'
		    });

        var geocoder = new MapboxGeocoder({ // Initialize the geocoder
            accessToken: mapboxgl.accessToken, // Set the access token
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
        });

        // Add the geocoder to the map
        map.addControl(geocoder);
        geocoder.on('result', function (e) {
            console.log("Geocoder fired");
            console.log("Geocoder coordinates"+e.result.geometry.coordinates+"\n");
            console.log(e.result.geometry);
            getMeterStatus(e.result.geometry.coordinates[1],e.result.geometry.coordinates[0]);
        });

	});
    

}

