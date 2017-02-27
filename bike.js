let map
let directionsService
let directionsDisplay
let pos = {
    lat: 40.0722083,
    lng: -105.5083316
}

$(document).ready(function() {
    // select box initialize
    $('select').material_select()
    // initialize side-nav
    $(".button-collapse").sideNav()


    function initMap() {
        // the two directions display/service may not be necessary
        directionsDisplay = new google.maps.DirectionsRenderer;

        directionsService = new google.maps.DirectionsService;
        map = new google.maps.Map(document.getElementById('map'), {
            // mapTypeControl: false,
            center: {
                lat: 40.0722083,
                lng: -105.5083316
            },
            zoom: 15
        });
        new AutocompleteDirectionsHandler(map);
        let infoWindow = new google.maps.InfoWindow({
            map: map
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Boo!');
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
              // try putting ajax call here? so it goes after coords?....
              $.ajax({
                          method: 'GET',
                          url: `https://maps.googleapis.com/maps/api/place/textsearch/xml?query=bus+stops&location=${pos.lat},${pos.lng}&radius=500&key=AIzaSyC8Lgex8nTqbToDXIyayP-WHEe2ssI6j5c`,
                          dataType: 'json',
                          //  send HTTP request to OMDB API search endpoint(see docs)
                          success: function(data) {
                              //  clear search
                              console.log("success");
                          },
                          error: function() {
                              console.log("error");
                              console.log("lat, long", pos.lat, pos.lng);
                          }
                      }) // end of ajax





        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    initMap()

    /**
     * @constructor
     */
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'TRANSIT';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        // var modeSelector = document.getElementById('mode-selector');
        // this.directionsService = new google.maps.DirectionsService;
        // this.directionsDisplay = new google.maps.DirectionsRenderer;
        // this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {
                placeIdOnly: true
            });
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {
                placeIdOnly: true
            });

        // this.setupClickListener('changemode-walking', 'WALKING');
        // this.setupClickListener('changemode-transit', 'TRANSIT');
        // this.setupClickListener('changemode-driving', 'DRIVING');

        // I CAN'T SEEM TO USE GEOLOCATE WITH THESE TWO LINES. AND WITHOUT THEM MY INPUT FIELDS GET PUT ON TOP OF THE MAP....
        //
        // this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        // this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        // SWEET TAKING OUT THESE LINES OF CODE AS WELL LETS ME DO BOTH THINGS...FOR NOW...

        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    // AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    //     var radioButton = document.getElementById(id);
    //     var me = this;
    //     radioButton.addEventListener('click', function() {
    //         me.travelMode = mode;
    //         me.route();
    //     });
    // };

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete) {
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
            } else {
                me.destinationPlaceId = place.place_id;
            }
            me.route();
        });

    };

    AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var me = this;

        this.directionsService.route({
            origin: {
                'placeId': this.originPlaceId
            },
            destination: {
                'placeId': this.destinationPlaceId
            },
            travelMode: this.travelMode
        }, function(response, status) {
            if (status === 'OK') {
                me.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    // this needs to happen after user either accepts of denies location access
    // $.ajax({
    //             method: 'GET',
    //             url: `https://maps.googleapis.com/maps/api/place/textsearch/xml?query=bus+stops&location=${pos.lat},${pos.lng}&radius=500&key=AIzaSyC8Lgex8nTqbToDXIyayP-WHEe2ssI6j5c`,
    //             dataType: 'json',
    //             //  send HTTP request to OMDB API search endpoint(see docs)
    //             success: function(data) {
    //                 //  clear search
    //                 console.log("success");
    //             },
    //             error: function() {
    //                 console.log("error");
    //                 console.log("lat, long", pos.lat, pos.lng);
    //             }
    //         }) // end of ajax




})
