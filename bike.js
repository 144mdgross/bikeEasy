let map;
$(document).ready(function() {
    // select box initialize
    $('select').material_select();
    // initialize side-nav
    $(".button-collapse").sideNav();

    // set up time slelct box options dynamically in 24 hour system at 10 minute increments?

    //   query google maps
    // 'https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters'
    // init maps
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -34.397,
                lng: 150.644
            },
            zoom: 15,
            // mapTypeId: google.maps.mapTypeId.ROADMAP

        });

        new AutocompleteDirectionsHandler(map);
    }

    initMap()

    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

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

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    // AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    //   var radioButton = document.getElementById(id);
    //   var me = this;
    //   radioButton.addEventListener('click', function() {
    //     me.travelMode = mode;
    //     me.route();
    //   });
    // };

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
    };




}) // document ready
