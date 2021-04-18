var userCurrentLat = 0;
var userCurrentLong = 0;
var markersList = new Array();

async function getMeterStatus(latitude, longitude) {
    var parkingMeterRepository = new ParkingMeterRepository();
    var vacantParkingMeterList = await parkingMeterRepository.fetchVacantMeters(latitude,longitude);
    if(!vacantParkingMeterList || vacantParkingMeterList.length == 0) console.log("Unfortunately no meter spots are free at the moment.")
    else {
        console.log("Found a vacant spot-Finally")

        //remove markers from last search
        if(markersList.length>0){
            removeMarkers();
            markersList = new Array();
        }
        addMarkers(vacantParkingMeterList);
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

function fetchUserLocation(){
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(function(result){
        userCurrentLat = result.coords.latitude;
        userCurrentLong = result.coords.longitude;
        console.log("user currentLat: "+userCurrentLat+"\n");
    });
}

function addMarkers(vacantParkingMeterList){
    for (var i=0; i<vacantParkingMeterList.length; i++){
        var marker = new mapboxgl.Marker({
            color: "#FFFFFF",
            }).setLngLat([vacantParkingMeterList[i].latlng.longitude, vacantParkingMeterList[i].latlng.latitude])
            .addTo(map);
        }
        markersList.push(marker);
}

function removeMarkers(){
    for (var i=0; i<markersList.length; i++){
        markersList[i].remove();
    }
}

function fetchDirections(startLongitude, startLatitude,endLongitude, endLatitude){

    https://api.mapbox.com/matching/v5/mapbox/driving/-117.17282,32.71204;-117.17288,32.71225?steps=true&radiuses=25;25&access_token=YOUR_MAPBOX_ACCESS_TOKEN
    var query = 'https://api.mapbox.com/matching/v5/mapbox/driving/' + startLongitude+','+startLatitude+';'+endLongitude+','+endLatitude+ '?geometries=geojson&access_token=' + mapboxgl.accessToken;
    //var query = "https://api.mapbox.com/matching/v5/mapbox/driving/-117.17282,32.71204;-117.17288,32.71225?steps=true&radiuses=25;25&access_token="+ mapboxgl.accessToken;
    //fetchDirections("-117.17282","32.71204","-117.17288","32.71225");
    $.ajax({
      method: 'GET',
      url: query
    }).done(function(data) {
      // Get the coordinates from the response
      console.log("Data from fetch");
      console.log(data);
      var coords = data.matchings[0].geometry;
      map.on('load',function(){
        addRoute(coords);
      });
    });
}

function addRoute(coords) {
    // If a route is already loaded, remove it
    console.log("add route");
    if (map.getSource('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    } else { // Add a new layer to the map
      map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": coords
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#03AA46",
          "line-width": 8,
          "line-opacity": 0.8
        }
      });
    };
  }



