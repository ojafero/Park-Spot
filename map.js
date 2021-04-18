
async function getMeterStatus(latitude, longitude) {
    var parkingMeterRepository = new ParkingMeterRepository();
    var vacantParkingMeterList = await parkingMeterRepository.fetchVacantMeters(latitude,longitude);
    if(!vacantParkingMeterList || vacantParkingMeterList.length == 0) console.log("Unfortunately no meter spots are free at the moment.")
    else {
        console.log("Found a vacant spot-Finally")
        console.log(vacantParkingMeterList);
    }  
}

function initializeMap(){
    mapboxgl.accessToken = MapBoxKey;
                map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [LosAngelesLong,LosAngelesLat],
                zoom: 13
    });
}
function addSearchBar(){
    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, 
        mapboxgl: mapboxgl, 
    });
        // Add the geocoder to the map
    map.addControl(geocoder);
    geocoder.on('result', function (e) {
        getMeterStatus(e.result.geometry.coordinates[1],e.result.geometry.coordinates[0]);
    });
}

function addZoomToMap(){
    //Add zoom to map
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

}

function setupMap(){
    initializeMap();
    addSearchBar();
    addZoomToMap();
}



