let map
let directionsService
let directionsDisplay
var originAutocomplete
var originLatitude
var longitude
var address1
var address2


$(document).ready(function() {
  // select box initialize
  $('select').material_select()
  // initialize side-nav
  $(".button-collapse").sideNav()

  // FUNCTION TO GEOCODE LATLNG FROM ADDRESS
  function GetLatlongOrigin()
  {
      var geocoder = new google.maps.Geocoder();
      address1 = document.getElementById('origin-input').value;


      geocoder.geocode({ 'address': address1 }, function (results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              originLatitude = results[0].geometry.location.lat();
              console.log(latitude, "latitude origin")
              originLongitude = results[0].geometry.location.lng();
              console.log(longitude, "longitude origin")

          }
      });
}

function GetLatlongDestination()
{
    var geocoder = new google.maps.Geocoder();
    address2 = document.getElementById('destination-input').value;

    geocoder.geocode({ 'address': address2 }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            console.log(latitude, "latitude destination")
            var longitude = results[0].geometry.location.lng();
            console.log(longitude, "longitude destination")

        }
    });
}
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {
                lat: 40.0722083,
                lng: -105.5083316
            },
            zoom: 8
        });

        new AutocompleteDirectionsHandler(map);
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


    initMap()

})
