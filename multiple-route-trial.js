$(document).ready(function() {
    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()


// manage location in render array
let map
// make a global variable to use for calculate and display route
// var destinationAutocomplete = new google.maps.places.Autocomplete(
//     destinationInput, {
//         placeIdOnly: true
//     });






function renderDirections(result, map) {

  // THIS IS ONLY RENDERING LAST COLOR IN LIST. NBDEAL FOR NOW...ALSO MARKERS ARE DOING WEIRD THINGS. A PROBLEM FOR LATER....

  // var directionsRenderer1 = new google.maps.DirectionsRenderer({
  //   directions: result,
  //   routeIndex: 0,
  //   map: map,
  //   polylineOptions: {
  //     strokeColor: "green"
  //   }
  // });
  // console.log("routeindex1 = ", directionsRenderer1.getRouteIndex());
  //
  // var directionsRenderer2 = new google.maps.DirectionsRenderer({
  //   directions: result,
  //   routeIndex: 1,
  //   map: map,
  //   polylineOptions: {
  //     strokeColor: "blue"
  //   }
  // });
  // console.log("routeindex2 = ", directionsRenderer2.getRouteIndex()); //line 17

  var directionsRenderer3 = new google.maps.DirectionsRenderer({
    directions: result,
    routeIndex: 2,
    map: map,
    polylineOptions: {
      strokeColor: "purple"
    }
  });
  console.log("routeindex3 = ", directionsRenderer3.getRouteIndex());


}

function calculateAndDisplayBusRoute(origin, destination, directionsService, directionsDisplay, map) {
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.TRANSIT,
    provideRouteAlternatives: false
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      renderDirections(response, map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}




function calculateAndDisplayRoute(origin, destination, directionsService, directionsDisplay, map) {
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.BICYCLING,
    provideRouteAlternatives: false
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      renderDirections(response, map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function displayInstructions () {
  // here... i should probably create a div for each rendered plolyline. They need to be attached in the right order.
  

}


function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(
    document.getElementById("map"), {
      center: new google.maps.LatLng(37.4419, -122.1419),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  directionsDisplay.setMap(map);

  //something would need to be changed here to get it to display a three peice route



// call first route
  calculateAndDisplayRoute(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map);

// call bus route
calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map);

// call second route
calculateAndDisplayRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map);

}
  //  }

   initMap()
})
   // Get the ball rolling and trigger our init() on 'load'
  //  google.maps.event.addDomListener(window, 'load', init);
