
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
    //$(document).ready(function(){
        mapboxgl.accessToken = MapBoxKey;
        map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [LosAngelesLong,LosAngelesLat],
        zoom: 8
        });

    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
    });

    // Add the geocoder to the map
    map.addControl(geocoder);
    geocoder.on('result', function (e) {
        var marker2 = new mapboxgl.Marker({ color: 'red', rotation: 45 })
        .setLngLat([e.result.geometry.coordinates[0], e.result.geometry.coordinates[1]])
        .addTo(map);
        getMeterStatus(e.result.geometry.coordinates[1],e.result.geometry.coordinates[0]);
    });

//});
    

}

