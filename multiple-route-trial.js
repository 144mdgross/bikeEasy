$(document).ready(function() {
    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()


    // manage location in render array
    let map
    let directionsDisplay
    let directionsService = new google.maps.DirectionsService();
    var directionsRenderer1
    // let directionsRendererOptions = {
    //     suppressInfoWindows: false,
    //     suppressMarkers: true,
    //     draggable: false
    //   }
    // make a global variable to use for calculate and display route
    // var destinationAutocomplete = new google.maps.places.Autocomplete(
    //     destinationInput, {
    //         placeIdOnly: true
    //     });


// okay so now I'm listeneing to the buttons. now maybe wrap each giant if statement and call it depending on which button is checked? I'd need to change the event listener some too. not too big of a deal hopefully.
  $('form').click(function(e){
let isChecked = $(e.target)[0].id
console.log(isChecked);

if(isChecked === 'test1') {
  console.log(isChecked, "you did it you");
}


})




    function renderDirections(result, map) {

        // THIS IS ONLY RENDERING LAST COLOR IN LIST. NBDEAL FOR NOW...ALSO MARKERS ARE DOING WEIRD THINGS. A PROBLEM FOR LATER....

        directionsRenderer1 = new google.maps.DirectionsRenderer({
          directions: result,
          routeIndex: 0,
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "green"
          }
        });
        console.log("routeindex1 = ", directionsRenderer1.getRouteIndex());

        var directionsRenderer2 = new google.maps.DirectionsRenderer({
          directions: result,
          routeIndex: 1,
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "blue"
          }
        });
        console.log("routeindex2 = ", directionsRenderer2.getRouteIndex()); //line 17

        var directionsRenderer3 = new google.maps.DirectionsRenderer({
            directions: result,
            routeIndex: 2,
            suppressMarkes: true,
            map: map,
            polylineOptions: {
                strokeColor: "purple"
            }
        });
        console.log("routeindex3 = ", directionsRenderer3.getRouteIndex());


    }


if($('#test1')[0].checked) {
    function calculateAndDisplayRoute1(origin, destination, directionService, directionDisplay, map) {
        directionService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.BICYCLING,
            provideRouteAlternatives: false
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                renderDirections(response, map);
              let bikeDisplay = directionsDisplay.setDirections(response)
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


    // OKAY. can I make a radio button box where the user can bike which leg of the trip they want to see directions for? With the first leg being the default. Would have have to make a third calculateAndDisplayRoute? I guess that isn't the worst
    // setRouteIndex(routeIndex:number)


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
        directionsDisplay.setPanel(document.getElementById('panelOne'))



        //something would need to be changed here to get it to display a three peice route



        // call first route
        calculateAndDisplayRoute1(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

        // call bus route
        calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

        // call second route
        calculateAndDisplayRoute1(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map)

    }
    //  }
  } // end of first if

  if($('#test1')[0].checked) {
      function calculateAndDisplayRoute1(origin, destination, directionService, directionDisplay, map) {
          directionService.route({
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.BICYCLING,
              provideRouteAlternatives: false
          }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                  renderDirections(response, map);
                let bikeDisplay = directionsDisplay.setDirections(response)
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


      // OKAY. can I make a radio button box where the user can bike which leg of the trip they want to see directions for? With the first leg being the default. Would have have to make a third calculateAndDisplayRoute? I guess that isn't the worst
      // setRouteIndex(routeIndex:number)


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
          directionsDisplay.setPanel(document.getElementById('panelOne'))



          //something would need to be changed here to get it to display a three peice route



          // call first route
          calculateAndDisplayRoute1(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

          // call bus route
          calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

          // call second route
          calculateAndDisplayRoute1(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map)

      }
      //  }
    } // end of first if

      else if($(test2)[0].checked) {
        function calculateAndDisplayRoute1(origin, destination, directionService, directionDisplay, map) {
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
                    let busDisplay = directionsDisplay.setDirections(response)
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
            directionsDisplay.setPanel(document.getElementById('panelOne'))

            // call first route
            calculateAndDisplayRoute1(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

            // call bus route
            calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

            // call second route
            calculateAndDisplayRoute1(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map)

        }

      }// end of second if

    else if($(test3)[0].checked) {
      function calculateAndDisplayRoute1(origin, destination, directionService, directionDisplay, map) {
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

      function calculateAndDisplayRoute2(origin, destination, directionService, directionDisplay, map) {
          directionService.route({
              origin: origin,
              destination: destination,
              travelMode: google.maps.TravelMode.BICYCLING,
              provideRouteAlternatives: false
          }, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                  renderDirections(response, map);
                let bikeDisplay2 = directionsDisplay.setDirections(response)
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
          directionsDisplay.setPanel(document.getElementById('panelOne'))



          //something would need to be changed here to get it to display a three peice route



          // call first route
          calculateAndDisplayRoute1(new google.maps.LatLng(40.0722083, -105.5083316), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

          // call bus route
          calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

          // call second route
          calculateAndDisplayRoute2(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(39.7367179, -104.9847337), directionsService, directionsDisplay, map)

      }

    }// end of second if
    initMap()
})
// Get the ball rolling and trigger our init() on 'load'
//  google.maps.event.addDomListener(window, 'load', init);
