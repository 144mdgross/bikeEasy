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

    function GetLatlongOrigin() {
        var geocoder = new google.maps.Geocoder();
        address1 = document.getElementById('origin-input').value;


        geocoder.geocode({
            'address': address1
        }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                originLatitude = results[0].geometry.location.lat();
                console.log(originLatitude, "latitude origin")
                originLongitude = results[0].geometry.location.lng();
                console.log(originLongitude, "longitude origin")

            }
        });
    }

    function GetLatlongDestination() {
        var geocoder = new google.maps.Geocoder();
        address2 = document.getElementById('destination-input').value;

        geocoder.geocode({
            'address': address2
        }, function(results, status) {

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
        console.log(placeId, "placeID");

        if ($('#origin-input').val().includes('Boulder')) {
            if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
                $('#panelTwo .warning').html(warning)
                $('#copyright2').html(copyright)

                let row2 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row2.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row2.append(distanceSummary)
                $('#panelTwo tbody').append(row2)

                //  loop through steps
                for (var i = 1; i < steps.length; i++) {
                    let instruction = steps[i].instructions
                    let row = $('<tr>')
                    row.html(instruction)
                    row.addClass('')
                    $('#panelTwo tbody').append(row)

                    // append each instruction to the table

                    // console.log(instruction);
                }
            } else if (placeId === "ChIJ58F9ysN4bIcRm4CacOXarfI") {
                $('#panelThree .warning').text(warning)
                $('#copyright3').text(copyright)

                let row3 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row3.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row3.append(distanceSummary)
                $('#panelThree tbody').append(row3)


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
                $('#panelOne .warning').text(warning)
                $('#copyright1').text(copyright)

                let row1 = $('<tr>')
                let timeSummary = $('<td>')
                row1.append(timeSummary)
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row1.append(distanceSummary)
                $('#panelOne tbody').append(row1)


                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions
                    let row = $('<tr>')
                    row.html(instruction)
                    row.addClass('')
                    $('#panelOne tbody').append(row)

                }
            }

        } else if ($('#origin-input').val().includes('Denver')) {
            if (placeId === "ChIJ-3hMUcJ4bIcRuaidfDaWTnY") {
              // log(placeId, "is anything getting through?")
              // ChIJZTYRctV-bIcRb74MCUMHUzQ
              // ChIJ-3hMUcJ4bIcRuaidfDaWTnY
                $('#panelTwo .warning').html(warning)
                $('#copyright2').html(copyright)


                let row2 = $('<tr>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row2.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row2.append(distanceSummary)
                $('#panelTwo tbody').append(row2)


                //  loop through steps
                for (var i = 1; i < steps.length; i++) {
                    let instruction = steps[i].instructions
                    let row = $('<tr>')
                    row.html(instruction)
                    row.addClass('')
                    $('#panelTwo tbody').append(row)
                }
            } else if (placeId === "Ei0xNDAxLTE0NDMgQ2FueW9uIEJsdmQsIEJvdWxkZXIsIENPIDgwMzAyLCBVU0E") {
                $('#panelThree .warning').text(warning)
                $('#copyright3').text(copyright)

                let row3 = $('<td>')
                let timeSummary = $('<td>')
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')
                row3.append(timeSummary)

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row3.append(distanceSummary)
                $('#panelThree tbody').append(row3)

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
                $('#panelOne .warning').text(warning)
                $('#copyright1').text(copyright)

                let row1 = $('<tr>')
                let timeSummary = $('<td>')
                row1.append(timeSummary)
                timeSummary.text(totalLegTime)
                timeSummary.addClass('summary')

                let distanceSummary = $('<td>')
                distanceSummary.text(totalLegDistance)
                distanceSummary.addClass('distance')
                row1.append(distanceSummary)
                $('#panelOne tbody').append(row1)

                for (var i = 0; i < steps.length; i++) {
                    let instruction = steps[i].instructions
                    let row = $('<tr>')
                    row.html(instruction)
                    row.addClass('')
                    $('#panelOne tbody').append(row)

                }
            }
        } // end of else if
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


    }


    initMap()

    $('#submit').click(function(e) {
        e.target = this
        if ($('#origin-input').val() === "" || $('#destination-input').val() === "") {
            Materialize.toast('I am a toast!', 4000, 'toast-class')
        } else {
            $('#totals').removeClass('hide')
            $('#directions-tables').removeClass('hide')

            $('tbody').empty()

            if ($('#origin-input').val().includes('Boulder') && $('#destination-input').val().includes('Denver')) {
                console.log($('#origin-input').val(), "text");
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

                calculateAndDisplayBusRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

                calculateAndDisplayRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)


            } else if ($('#origin-input').val().includes('Denver') && $('#destination-input').val().includes('Boulder')) {

                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(39.753931, -105.001159), directionsService, directionsDisplay, map)

                calculateAndDisplayBusRoute(new google.maps.LatLng(39.753931, -105.001159), new google.maps.LatLng(40.016779, -105.276376), directionsService, directionsDisplay, map)

                calculateAndDisplayRoute(new google.maps.LatLng(40.016779, -105.276376), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            } else if ($('#origin-input').val().includes('Boulder') && $('#destination-input').val().includes('Boulder')) {
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            } else if ($('#origin-input').val().includes('Denver') && $('#destination-input').val().includes('Denver')) {
                calculateAndDisplayRoute(new google.maps.LatLng(originLatitude, originLongitude), new google.maps.LatLng(destinationLatitude, destinationLongitude), directionsService, directionsDisplay, map)
            }

        }
    }) // end of click

  // call ajax for Boulder (id "boulder-weather")
    // $.ajax({
    //   method: 'GET',
    //   url: 'http://api.openweathermap.org/data/2.5/weather?lat=40.017512&lon=-105.28561100000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05',
    //   dataType: 'json',
    //   success: function(data){
    //     console.log("success!", data);
    //   },
    //   error: function(){
    //     console.log('error');
    //   }
    // })
    //
    // // call ajax for Denver (id "denver-weather")
    // $.ajax({
    //   method: 'GET',
    //   url: `http://api.openweathermap.org/data/2.5/forecast?lat=39.7366466&lon=-104.98454900000002&units=imperial&APPID=db2edac29cd5933073366cfb65c34f05`,
    //   dataType: 'json',
    //   success: function(data){
    //     console.log("success!", data);
    //   },
    //   error: function(){
    //     console.log('error');
    //   }
    // })


})
// Get the ball rolling and trigger our init() on 'load'
//  google.maps.event.addDomListener(window, 'load', init);
