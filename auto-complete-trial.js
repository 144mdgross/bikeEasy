$(document).ready(function() {

  let map
  let directionsDisplay
  let directionsService = new google.maps.DirectionsService();
  var originAutocomplete
  var originLatitude
  var originLongitude
  let destinationLatitude
  let destinationLongitude
  var address1
  var address2
    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()

    function GetLatlongOrigin()
    {
        var geocoder = new google.maps.Geocoder();
        address1 = document.getElementById('origin-input').value;


        geocoder.geocode({ 'address': address1 }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                originLatitude = results[0].geometry.location.lat();
                console.log(originLatitude, "latitude origin")
                originLongitude = results[0].geometry.location.lng();
                console.log(originLongitude, "longitude origin")

            }
        });
  }

  function GetLatlongDestination()
  {
      var geocoder = new google.maps.Geocoder();
      address2 = document.getElementById('destination-input').value;

      geocoder.geocode({ 'address': address2 }, function (results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              destinationLatitude = results[0].geometry.location.lat();
              console.log(destinationLatitude, "latitude destination")
              destinationLongitude = results[0].geometry.location.lng();
              console.log(destinationLongitude, "longitude destination")

          }
      });
  }

      /**
       * @constructor
       */
      function AutocompleteDirectionsHandler(map) {
          //  necessary
          this.map = map;
          this.originPlaceId = null;
          this.destinationPlaceId = null;
          var originInput = document.getElementById('origin-input');
          var destinationInput = document.getElementById('destination-input');

          originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {
                  placeIdOnly: false
              });
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {
                  placeIdOnly: false
              });

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

      }


      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          var me = this;
          autocomplete.bindTo('bounds', this.map);
          autocomplete.addListener('place_changed', function() {
              var place = autocomplete.getPlace();
              if (!place.place_id) {
                  window.alert("Please select an option from the dropdown list.");
                  return;
              }
              if (mode === 'ORIG') {
                  me.originPlaceId = place.place_id;
                  GetLatlongOrigin()
              } else {
                  me.destinationPlaceId = place.place_id;
                  GetLatlongDestination()
              }

          });

      };


// make an event listener so that when the button is clicked it will fun functions to re-render routes


    // manage location in render array


    function renderDirections(result, map) {

        var directionsRenderer3 = new google.maps.DirectionsRenderer({
            directions: result,
            routeIndex: 2,
            suppressMarkes: true,
            map: map,
            polylineOptions: {
                strokeColor: "purple"
            }
        });
        // console.log("routeindex3 = ", directionsRenderer3.getRouteIndex());
        // console.log(directionsRenderer3.directions.routes[0].warnings[0], "directions Renderer warning");
        let warning = directionsRenderer3.directions.routes[0].warnings[0]
        let steps = directionsRenderer3.directions.routes[0].legs[0].steps
        let copyright = directionsRenderer3.directions.routes[0].copyrights
        let totalLegTime = directionsRenderer3.directions.routes[0].legs[0].duration.text
        let totalLegDistance = directionsRenderer3.directions.routes[0].legs[0].distance.text
        console.log(totalLegTime)
        console.log(totalLegDistance);

        //  ward place-id:[0] "EiY3My03NSBDb2x1bWJpYSBTdCwgV2FyZCwgQ08gODA0ODEsIFVTQQ"

        // Boulder Transit Center place-id:
        // "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E"
        // "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E"

        // Union Station place id
        // "ChIJ58F9ysN4bIcRm4CacOXarfI
        // "ChIJ58F9ysN4bIcRm4CacOXarfI"

        //  CREATE CONTROL FLOW SO EACH TABLE GOES TO APPROPRIATE SPOT
        //  REMEMBER TO DISPLAY WARNING
        let placeId = directionsRenderer3.directions.geocoded_waypoints[0].place_id
        // console.log(placeId, "placeID");

        if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
            $('#panelTwo th').html(warning)
            $('#copyright2').html(copyright)
            //  loop through steps
            for (var i = 0; i < steps.length; i++) {
                let instruction = steps[i].instructions
                let row = $('<tr>')
                row.html(instruction)
                row.addClass('')
                $('#panelTwo tbody').append(row)

                // append each instruction to the table

                // console.log(instruction);
            }
        } else if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {
            $('#panelThree th').text(warning)
            $('#copyright3').text(copyright)
            for (var i = 0; i < steps.length; i++) {
                let instruction = steps[i].instructions
                let row = $('<tr>')
                row.html(instruction)
                row.addClass('')
                $('#panelThree tbody').append(row)

                // append each instruction to the table

                // console.log(instruction);
            }

        } else {
            $('#panelOne th').text(warning)
            $('#copyright1').text(copyright)
            for (var i = 0; i < steps.length; i++) {
                let instruction = steps[i].instructions
                let row = $('<tr>')
                row.html(instruction)
                row.addClass('')
                $('#panelOne tbody').append(row)

            }
        }
    } // end of render directions function

    function calculateAndDisplayRoute(origin, destination, directionService, directionDisplay, map) {
        directionService.route({
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

    function calculateAndDisplayBusRoute(origin, destination, directionService, directionDisplay, map) {
        directionService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            provideRouteAlternatives: false
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                renderDirections(response, map);
                // let busDisplay = directionsDisplay.setDirections(response)
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }


    function initMap() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay2 = new google.maps.DirectionsRenderer()
        map = new google.maps.Map(
            document.getElementById("map"), {
                center: new google.maps.LatLng(40.0722083, -105.5083316),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        directionsDisplay.setMap(map);
        new AutocompleteDirectionsHandler(map);

        // call first route
        calculateAndDisplayRoute(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

        // call bus route
        calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

        // call second route
        calculateAndDisplayRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map)

    }


    initMap()
})
// Get the ball rolling and trigger our init() on 'load'
//  google.maps.event.addDomListener(window, 'load', init);
